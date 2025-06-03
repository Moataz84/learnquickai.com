"use server"
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, rmSync, unlinkSync, writeFileSync } from "fs"
import { randomBytes } from "crypto"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import Usages from "@/utils/Models/Usages"
import { v4 } from "uuid"
import Prompts from "@/utils/Models/Prompts"
import getUsage from "@/actions/getUsage"
import Users from "@/utils/Models/Users"
import { generateData } from "@/actions/uploads/generateData"
import { execSync } from "child_process"
import PdfParse from "pdf-parse"
import { createWorker } from "tesseract.js"

export async function uploadChunk(formData) {
  const chunk = formData.get("chunk")
  const chunkFile = formData.get("chunkFile")
  const fileId = formData.get("fileId")

  const dir = join(process.cwd(), "temp", fileId)
  const tempPath = join(dir, chunkFile)
  const buffer = Buffer.from(await chunk.arrayBuffer())

  if (!existsSync(dir)) {
    mkdirSync(`temp/${fileId}`)
  }
  writeFileSync(tempPath, buffer)
}

export async function checkDocument(fileId, fileExtension) {
  const dir = join(process.cwd(), "temp", fileId)
  const files = readdirSync(dir).sort((a, b) => Number(a) - Number(b))
  const pId = randomBytes(8).toString("hex")
  const documentPath = join(process.cwd(), "temp", pId + `.${fileExtension}`)

  const writeStream = createWriteStream(documentPath)
  for (const file of files) {
    const chunk = readFileSync(join(dir, file))
    writeStream.write(chunk)
  }
  writeStream.end()
  rmSync(dir, {recursive: true})

  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const user = await Users.findOne({_id: id})
  const { documents, cost } = await getUsage(id)
  
  if (cost >= 3.5) {
    unlinkSync(documentPath)
    return {msg: "rate-limit"}
  }

  if (!user.active) {
    if (documents + 1 > 2 || cost > 0.15) {
      unlinkSync(documentPath)
      return {msg: "exceeded"}
    }
  }

  const promptId = v4()
  await Promise.all([
    new Prompts({userId: id, promptId, summary: "", title: "", type: "doc", public: false}).save(),
    new Usages({userId: id, dateTime: Date.now().toString(), seconds: 0, promptId, cost: 0, type: "document"}).save()
  ])
  return {msg: "success", promptId, documentPath, pId}
}

async function ocrImages(images) {
  const worker = await createWorker("eng")
  let fullText = ""

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    console.log(`🔍 OCRing page ${i + 1} (${image})...`)
    const { data } = await worker.recognize(image)
    fullText += `\n\n--- Page ${i + 1} ---\n${data.text}`
  }

  await worker.terminate()
  return fullText.trim()
}

export async function generateDocumentData(promptId, filePath, pId) {
  try {
    const isPDF = filePath.split('.').pop().toLowerCase() === "pdf"
    if (!isPDF) {
      execSync(`libreoffice --headless --convert-to pdf --outdir "${join(process.cwd(), "temp")}" "${filePath}"`)
      unlinkSync(filePath)
    }
    
    const pdfFile = join(process.cwd(), "temp", pId + ".pdf")
    const buffer = readFileSync(pdfFile)

    const t = await PdfParse(buffer)
    if (t.text.trim().length > 100) {
      await generateData(promptId, t.text.trim())
      unlinkSync(pdfFile)
      return
    }

    const outputDir = join(process.cwd(), "temp", pId)
    mkdirSync(outputDir)
    execSync(`pdftoppm -png -r 150 "${pdfFile}" "${outputDir}/${pId}-page"`)

    const images = readdirSync(outputDir)
    .filter(file => file.endsWith(".png"))
    .map(file => join(outputDir, file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    const text = await ocrImages(images)

    generateData(promptId, text)
    rmdirSync(outputDir, {recursive: true})
    unlinkSync(pdfFile)
  } catch (e) {
    console.log(e)
    await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
  }
}

export async function generateTXTData(promptId, filePath) {
  try {
    const file = join(process.cwd(), "temp", filePath)
    const contents = readFileSync(file, "utf-8")
    await generateData(promptId, contents)
    unlinkSync(file)
  } catch (e) {
    await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
  }
}