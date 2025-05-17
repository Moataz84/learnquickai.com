"use server"
import { randomBytes } from "crypto"
import { join } from "path"
import { setFfmpegPath, setFfprobePath } from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import ffprobePath from "ffprobe-static"
import getUsage from "@/actions/getUsage"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import Usages from "@/utils/Models/Usages"
import { v4 } from "uuid"
import Prompts from "@/utils/Models/Prompts"
import { YoutubeTranscript } from "youtube-transcript"
import { getBasicInfo } from "ytdl-core"
import youtubeDl from "youtube-dl-exec"
import { generateData, generateTranscriptAndData } from "@/actions/uploads/generateData"

setFfmpegPath(ffmpegPath)
setFfprobePath(ffprobePath.path)

export async function checkYTVideo(url) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const usage = await getUsage(id)
  const user = await Users.findOne({_id: id})

  try {
    const info = await getBasicInfo(url)
    const length = info.videoDetails.lengthSeconds
    const totalTime = parseFloat(length) + usage
    if (!user.active && totalTime > 3600) {
      return {msg: "exceeded"}
    }
    const promptId = v4()
    await Promise.all([
      new Prompts({userId: id, promptId, summary: "", title: "", type: "yt", public: false}).save(),
      new Usages({userId: id, dateTime: Date.now().toString(), seconds: length, promptId, paidFor: true}).save()
    ])
    return {msg: "success", promptId}
  } catch (e) {
    console.log(e)
    return {msg: "This video is unavailable"}
  }
}

export async function uploadYoutubeVideo(promptId, url) {
  try {
    try {
      const result = await YoutubeTranscript.fetchTranscript(url)
      const transcript = result.map(part => part.text).toString()
      if (transcript.length === 0) throw Error("")
      await generateData(promptId, transcript)
    } catch (e) {
      console.log(e)
      const videoId = randomBytes(8).toString("hex")
      const videoPath = join(process.cwd(), "temp", videoId + ".mp3")
      await youtubeDl(url, {
        extractAudio: true,
        output: videoPath,
        audioFormat: "mp3",
        preferFreeFormats: true,
        ffmpegLocation: ffmpegPath
      })
      await generateTranscriptAndData(promptId, videoPath, videoId)
      await Usages.findOneAndUpdate({promptId}, {$set: {paidFor: true}})
    }
  } catch {
    await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
  }
}