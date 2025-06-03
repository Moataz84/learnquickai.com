"use server"
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "fs"
import { randomBytes } from "crypto"
import { join } from "path"
import { setFfmpegPath, ffprobe, setFfprobePath } from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import ffprobePath from "ffprobe-static"
import getUsage from "@/actions/getUsage"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import Usages from "@/utils/Models/Usages"
import { v4 } from "uuid"
import Prompts from "@/utils/Models/Prompts"

setFfmpegPath(ffmpegPath)
setFfprobePath(ffprobePath.path)

function getVideoDuration(filePath){
  return new Promise((resolve, reject) => {
    ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err)
      resolve(parseInt(metadata.format.duration))
    })
  })
}

export async function uploadChunk(formData) {
  const chunk = formData.get("chunk")
  const chunkIndex = formData.get("chunkIndex")
  const fileId = formData.get("fileId")

  const dir = join(process.cwd(), "temp", fileId)
  const tempPath = join(dir, `${chunkIndex}.mp3`)
  const buffer = Buffer.from(await chunk.arrayBuffer())

  if (!existsSync(dir)) {
    mkdirSync(`temp/${fileId}`)
  }
  writeFileSync(tempPath, buffer)
}

export async function checkVideo(fileId) {
  const dir = join(process.cwd(), "temp", fileId)
  const files = readdirSync(dir).sort((a, b) => Number(a) - Number(b))
  const videoId = randomBytes(8).toString("hex")
  const videoPath = join(process.cwd(), "temp", videoId + ".mp3")

  const writeStream = createWriteStream(videoPath)
  for (const file of files) {
    const chunk = readFileSync(join(dir, file))
    writeStream.write(chunk)
  }
  writeStream.end()
  rmSync(dir, {recursive: true})

  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const { seconds: usage, cost, videoAndAudio } = await getUsage(id)
  const duration = await getVideoDuration(videoPath)
  const totalTime = usage + duration
  const user = await Users.findOne({_id: id})
  
  if (cost >= 3.5) {
    unlinkSync(videoPath)
    return {msg: "rate-limit"}
  }

  if (!user.active) {
    if (totalTime > 3600 || videoAndAudio + 1 > 2 || (cost + ((0.2 * duration) / 3600)) > 0.15) {
      unlinkSync(videoPath)
      return {msg: "exceeded"}
    }
  }

  const promptId = v4()
  await Promise.all([
    new Prompts({userId: id, promptId, summary: "", title: "", type: "audio", public: false}).save(),
    new Usages({userId: id, dateTime: Date.now().toString(), seconds: duration.toString(), promptId, cost: (0.18* (duration / 3600)), type: "audio"}).save()
  ])
  return {msg: "success", promptId, videoId, videoPath}
}