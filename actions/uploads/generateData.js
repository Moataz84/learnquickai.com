"use server"
import Prompts from "@/utils/Models/Prompts"
import ffmpeg, { setFfmpegPath, ffprobe, setFfprobePath } from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import ffprobePath from "ffprobe-static"
import { unlinkSync } from "fs"
import { OpenAI } from "openai"
import { join } from "path"
import { createReadStream } from "fs"
import Usages from "@/utils/Models/Usages"

setFfmpegPath(ffmpegPath)
setFfprobePath(ffprobePath.path)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
})

async function splitWithOverlap(inputPath, outputDir, videoId, chunkLength = 60, overlap = 2) {
  return new Promise((resolve, reject) => {
    ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err)

      const duration = metadata.format.duration
      const step = chunkLength - overlap
      const files = []
      const commands = []
      let index = 0

      for (let start = 0; start < duration; start += step) {
        const actualDuration = Math.min(chunkLength, duration - start)
        const outputFile = join(outputDir, `${videoId}_chunk_${String(index).padStart(3, "0")}.mp3`)
        files.push(outputFile)

        const cmd = ffmpeg(inputPath)
          .setStartTime(start)
          .duration(actualDuration)
          .output(outputFile)

        const promise = new Promise((res, rej) => {
          cmd.on("end", res)
             .on("error", rej)
             .run()
        })

        commands.push(promise)
        index++
      }

      Promise.all(commands)
        .then(() => resolve(files))
        .catch(reject)
    })
  })
}

async function transcribeChunk(filePath) {
  const fileStream = createReadStream(filePath)

  try {
    const response = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "gpt-4o-mini-transcribe"
    })
    return response.text
  } catch (e) {
    console.log(e)
    return ""
  }
}

async function transcribeChunks(chunks) {
  const transcriptions = []
  const chunkBatches = []

  for (let i = 0; i < chunks.length; i += 5) {
    const batch = chunks.slice(i, i + 5)
    chunkBatches.push(batch)
  }

  for (const batch of chunkBatches) {
    try {
      const results = await Promise.all(batch.map(chunkPath => transcribeChunk(chunkPath)))
      transcriptions.push(...results)
    } catch (error) {
    }
  }

  const finalTranscription = transcriptions.join("\n")
  return finalTranscription
}

export async function generateData(promptId, transcript) {
  const prompt = `You are a ✍️ helpful and enthusiastic note-taking assistant 📚✨.

Given a video transcript, generate **extremely detailed, student-friendly notes** that:
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
- 🧠 **Final Summary**: {Recap the key learnings from the video in a motivating, high-level way}
- 📣 **Final Tips**: {Share tips, encouragement, or reminders to help the student retain and apply the material}

---

📏 Your goal: Make this feel like the best set of notes a student could get if they missed class — clear, detailed, emoji-packed, and actually *fun* to read!

📝 The final response should be around **1000 words** and use **lots of emojis generously throughout** — especially near headings, key terms, and important concepts. 🎉
`
  const userMessage = `${prompt}\n\nTranscript:\n${transcript}`
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "gpt-4o-mini"
  })
  const summary = response.choices[0].message.content.replaceAll("\\", "\\\\")
  const match = summary.match(/^\*\*Title:\*\*\s*\n(.*)/m)
  const rawTitle = match[1]
  const title = rawTitle.replace(/\*\*(.*?)\*\*/g, '$1')
  await Promise.all([
    Prompts.findOneAndUpdate({promptId}, {$set: {title, summary, transcript}}),
    Usages.findOneAndUpdate({promptId}, {$inc: {cost: ((response.usage.completion_tokens * 6.0e-7) + (response.usage.prompt_tokens * 1.5e-7))}})
  ])
}

export async function generateTranscriptAndData(promptId, videoPath, videoId) {
  try {
    const files = await splitWithOverlap(videoPath, "temp", videoId)
    const generatedTranscript = await transcribeChunks(files);
    [...files, videoPath].forEach(file => unlinkSync(file))
    await generateData(promptId, generatedTranscript)
  } catch {
    await Prompts.findOneAndUpdate({promptId}, {$set: {summary: "failed"}})
  }
}