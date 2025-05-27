"use server"
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync, createReadStream } from "fs"
import { randomBytes } from "crypto"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import Usages from "@/utils/Models/Usages"
import { v4 } from "uuid"
import Prompts from "@/utils/Models/Prompts"
import { OpenAI } from "openai"
import { exec } from "child_process"
import getUsage from "@/actions/getUsage"
import Users from "@/utils/Models/Users"
import { generateData } from "@/actions/uploads/generateData"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
})

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
  const { cost } = await getUsage(id)
  if ((!user.active && cost > 0.2) || cost >= 3.5) {
    return {msg: "exceeded"}
  }

  const promptId = v4()
  await Promise.all([
    new Prompts({userId: id, promptId, summary: "", title: "", type: "doc", public: false}).save(),
    new Usages({userId: id, dateTime: Date.now().toString(), seconds: 0, promptId, cost: 0, type: "document"}).save()
  ])
  return {msg: "success", promptId, documentPath, pId}
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      else if (stderr) reject(stderr)
      else resolve(stdout)
    })
  })
}

export async function generateDocumentData(promptId, filePath, pId) {
  try {
    const isPDF = filePath.split('.').pop().toLowerCase() === "pdf"
    if (!isPDF) {
      await execPromise(`libreoffice --headless --convert-to pdf --outdir "${join(process.cwd(), "temp")}" "${filePath}"`)
      unlinkSync(filePath)
    }
    
    const pdfFile = join(process.cwd(), "temp", pId + ".pdf")

    const file = await openai.files.create({
      file: createReadStream(pdfFile),
      purpose: "user_data",
    })

    unlinkSync(pdfFile)

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: file.id,
            },
            {
              type: "input_text",
              text: `You are a ✍️ helpful and enthusiastic note-taking assistant 📚✨.

    Given the content of the document, generate **extremely detailed, student-friendly notes** that:
    - 🧠 Break down complex concepts in a clear, beginner-friendly way — like you’re teaching someone who’s totally new to the topic.
    - 🗣️ Use **direct quotes** for key phrases or moments to preserve the speaker’s exact wording when adding value.
    - 😄 Include **plenty of emojis throughout** to make the content fun, engaging, and emotionally expressive — especially at headings, tips, examples, and summaries.
    - 🗂️ Organize everything into **clear, logical sections**, using headings and subheadings with emojis that reflect the section theme.
    - 🔍 Offer **thorough explanations for every key point**, so learners don’t feel lost.
    - 🧪 Add **examples with step-by-step reasoning**, so the learner understands both *how* and *why* things work.
    - 💡 Include **pro tips, common mistakes, or quick reminders** in each section where useful.
    - 📝 Provide a **fun, descriptive, and relevant title** that captures the spirit of the video.
    - 📏 Keep explanations precise but rich with context, as if helping a classmate who missed the lecture.

    📋 **Respond in the exact format below** (new lines and structure are important!):

    **Title:**
    {🎯 Your creative, engaging, and topic-appropriate title goes here!}

    ---

    - **📚 Section 1: [Topic Name]**
      - ✨ **Explanation**: {Explain the topic using simple, relatable terms}
      - 📌 **Key Concepts**: {List core ideas and their meanings}
      - 🔍 **Example**: {Include a detailed example, breaking it down step-by-step}
      - 💬 **Quote**: “{Insert an important quote only if it adds value not just random}”
      - 💡 **Tip/Reminder**: {A helpful tip or common mistake to avoid}
      - 🧾 **Summary**: {Brief recap of the most important takeaways}

    ---

    - **📘 Section 2: [Next Topic]**
      - ✨ **Explanation**: {Another beginner-friendly explanation}
      - 📌 **Key Concepts**: {Bullet points with key terms and insights}
      - 🔍 **Example**: {Walkthrough of a second example}
      - 💬 **Quote**: “{Another quote only if it adds value not just random}”
      - ⚠️ **Warning**: {If there’s something people often get wrong}
      - 🧾 **Summary**: {Wrap up this section with the main ideas}

    ---

    - **📗 Section 3: [Another Topic]**
      - ✨ **Explanation**: {Continue with clear explanations}
      - 🧮 **Formula Breakdown**: {If a formula appears, break it down with emojis and simple language}
        - Example: \\( F = ma \\) ➡️ **F (Force)** = **m (mass)** ✖️ **a (acceleration)**
      - 🔍 **Example**: {Step-by-step usage of the formula or concept}
      - 💡 **Tip**: {Helpful insight or memory aid}
      - 🧾 **Summary**: {Quick review of this concept}

    ---

    Add **as many sections as needed** to cover all topics thoroughly!

    ---

    **🏁 Conclusion:**
    - 🧠 **Final Summary**: {Recap the key learnings from the document in a motivating, high-level way}
    - 📣 **Final Tips**: {Share tips, encouragement, or reminders to help the student retain and apply the material}

    ---

    📏 Your goal: Make this feel like the best set of notes a student could get if they missed class — clear, detailed, emoji-packed, and actually *fun* to read!

    📝 The final response should be around **1000 words** and use **lots of emojis generously throughout** — especially near headings, key terms, and important concepts. 🎉`,
              },
          ],
        },
      ],
    })

    const summary = response.output_text.replaceAll("\\", "\\\\")
    const match = summary.match(/^\*\*Title:\*\*\s*\n(.*)/m)
    const rawTitle = match[1]
    const title = rawTitle.replace(/\*\*(.*?)\*\*/g, '$1')
    await Promise.all([
      Prompts.findOneAndUpdate({promptId}, {$set: {title, summary}}),
      Usages.findOneAndUpdate({promptId}, {$inc: {cost: ((response.usage.output_tokens * 6.0e-7) + (response.usage.input_tokens * 1.5e-7))}}),
      openai.files.del(file.id)
    ])
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