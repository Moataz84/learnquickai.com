"use server"
import { getPrompt } from "@/actions/prompts/getPrompt"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import Usages from "@/utils/Models/Usages"
import { getServerSession } from "next-auth"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
})

export async function generateQuiz(promptId) {
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id
  await Questions.deleteMany({promptId, userId})
  const prompt = await getPrompt(promptId)
  const message = `Generate 10 high-quality multiple-choice questions based on the summary below.

Requirements:
- Questions must test **specific understanding**, facts, or reasoning **explicitly stated or implied** in the summary.
- Use **exact examples or terminology** from the summary wherever possible.
- Ensure that each question is clear, focused, and only has **one correct answer**.
- Avoid overly generic or vague questions.
- Mix factual recall, conceptual understanding, and light inference.
- Questions must be unique and should be unlikly to be generated again from the same prompt.

Format the question as a JSON object:
{
  "question": "A concise and relevant question from the summary.",
  "options": [
    { "id": "A", "text": "Option A" },
    { "id": "B", "text": "Option B" },
    { "id": "C", "text": "Option C" },
    { "id": "D", "text": "Option D" }
  ],
  "answer": "A"
}

Only return a **valid JSON string of 10 question object** with no extra commentary or markdown and use latex if needed.

Summary:
${prompt.summary}`

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-4o-mini",
  })

  const questions = JSON.parse(response.choices[0].message.content.replaceAll("\\", "\\\\").replaceAll("\\\\\\\\", "\\\\")).map(q => ({...q, userId, promptId, question: q.question.replaceAll("\\", "\\\\"), options: q.options.map(o => ({...o, text: o.text.replaceAll("\\", "\\\\")}))}))
  await Promise.all([
    Questions.insertMany(questions),
    Usages.findOneAndUpdate({promptId}, {$inc: {cost: ((response.usage.completion_tokens * 6.0e-7) + (response.usage.prompt_tokens * 1.5e-7))}})
  ])
  return questions
}