"use server"
import { randomBytes } from "crypto"
import { join } from "path"
import getUsage from "@/actions/getUsage"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import Usages from "@/utils/Models/Usages"
import { v4 } from "uuid"
import Prompts from "@/utils/Models/Prompts"
import { generateData, generateTranscriptAndData } from "@/actions/uploads/generateData"
import { URL } from "url"
import { exec } from "child_process"
import { readdirSync, readFileSync, unlinkSync } from "fs"

const proxies = [
  "http://fujfdpql:t3y6r0q84972@104.253.199.219:5498",
  "http://fujfdpql:t3y6r0q84972@130.180.233.163:7734",
  "http://fujfdpql:t3y6r0q84972@82.29.143.115:7829",
  "http://fujfdpql:t3y6r0q84972@46.203.161.140:5637",
  "http://fujfdpql:t3y6r0q84972@46.203.29.147:6634",
  "http://fujfdpql:t3y6r0q84972@104.252.59.174:7646",
  "http://fujfdpql:t3y6r0q84972@72.46.138.83:6309",
  "http://fujfdpql:t3y6r0q84972@166.0.42.40:6048",
  "http://fujfdpql:t3y6r0q84972@154.194.27.17:6557",
  "http://fujfdpql:t3y6r0q84972@45.196.60.149:6489",
  "http://fujfdpql:t3y6r0q84972@63.141.62.193:6486",
]

function iso8601DurationToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1]) || 0
  const minutes = parseInt(match[2]) || 0
  const seconds = parseInt(match[3]) || 0
  return hours * 3600 + minutes * 60 + seconds
}

function getVideoIdFromUrl(url) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v")
    }

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.split("/")[1]
    }

    return null
  } catch (err) {
    return null
  }
}

export async function checkYTVideo(url) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const { seconds: usage, cost } = await getUsage(id)
  const user = await Users.findOne({_id: id})

  try {
    const videoId = getVideoIdFromUrl(url)
    const req = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.GOOGLE_API}`)
    const data = await req.json()
    const duration = data.items[0]?.contentDetails?.duration
    if (!duration) return {msg: "This video is unavailable"}
    const length = iso8601DurationToSeconds(duration)
    const totalTime = length + usage
    if ((!user.active && totalTime > 3600) || (!user.active && cost > 0.2) || (user.active && cost >= 3.5)) {
      return {msg: "exceeded"}
    }
    if (length > (3600 * 10)) {
      return {msg: "limit"}
    }
    const promptId = v4()
    await Promise.all([
      new Prompts({userId: id, promptId, summary: "", title: "", type: "yt", public: false, cost: 0}).save(),
      new Usages({userId: id, dateTime: Date.now().toString(), seconds: length, promptId, type: "video"}).save()
    ])
    return {msg: "success", promptId, ytVideoId: videoId, length}
  } catch (e) {
    console.log(e)
    return {msg: "This video is unavailable"}
  }
}
///////////////////////////////
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      else if (stderr) reject(stderr)
      else resolve(stdout)
    })
  })
}

async function getCaptions(url) {
  const videoId = randomBytes(8).toString("hex")
  const outputTemplate = join(process.cwd(), "temp", `${videoId}.%(ext)s`)
  for (const proxy of proxies) {
    try {
      await execPromise(
        `yt-dlp --proxy "${proxy}" --write-auto-subs --sub-lang "en" -o "${outputTemplate}" --skip-download ${url}`
      )
      const dir = join(process.cwd(), "temp")
      const matchedFiles = readdirSync(dir, {withFileTypes: true}).filter(file => file.isFile() && file.name.includes(videoId)).map(file => join(dir, file.name))
      if (matchedFiles.length === 0) return null

      const subtitleFile = matchedFiles[0]
      let content = readFileSync(subtitleFile, "utf-8")

      content = content
        .replace(/^\d{2}:\d{2}:\d{2}\.\d{3} --> .*$/gm, '')
        .replace(/<[^>]+>/g, '')
        .replace(/^\s*$/gm, '')
        .split('\n')
        .map(line => line.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      unlinkSync(subtitleFile)

      return content
    } catch (e) {
      console.log(e)
    }
  }
  return null
}

async function downloadVideo(url) {
  const videoId = randomBytes(8).toString("hex")
  const outputTemplate = join(process.cwd(), "temp", `${videoId}.%(ext)s`)
  for (const proxy of proxies) {
    try {
      await execPromise(
        `yt-dlp --proxy "${proxy}" -f worstaudio -o "${outputTemplate}" --extract-audio --audio-format mp3 ${url}`
      )
      return {videoId, videoPath: join(process.cwd(), "temp", `${videoId}.mp3`)}
    } catch (e) {
      console.log(e)
      if (e.includes("format is not available")) return null
    }
  }
  return null
}

export async function uploadYoutubeVideo(promptId, url, length) {
  try {
    const transcript = await getCaptions(url)
    if (!transcript) {
      const r = await downloadVideo(url)
      if (!r) {
        await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
        return
      }
      await generateTranscriptAndData(promptId, r.videoPath, r.videoId)
      await Usages.findOneAndUpdate({promptId}, {$inc: {cost: (0.18 * (length / 3600))}})
      return
    }
    await generateData(promptId, transcript)
  } catch (e) {
    console.log(e)
    await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
  }
}