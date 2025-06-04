"use server"
import { getPrompt } from "@/actions/prompts/getPrompt"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import Usages from "@/utils/Models/Usages"
import { getServerSession } from "next-auth"
import { zodTextFormat } from "openai/helpers/zod"
import OpenAI from "openai"
import { z } from "zod"
import getUsage from "@/actions/getUsage"
import Users from "@/utils/Models/Users"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
})

const questionsSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    answer: z.enum(["A", "B", "C", "D"]),
    options: z.array(z.object({
      id: z.enum(["A", "B", "C", "D"]),
      text: z.string()
    }))
  }))
})

export default async function generateQuestions(promptId) {
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id
  const user = await Users.findOne({_id: userId})
  const { cost, questions: q } = await getUsage(userId)

  if (cost >= 3.5) {
    return ["rate-limit"]
  }

  if (!user.active) {
    if (q + 1 > 5 || cost > 0.15) {
      return ["exceeded"]
    }
  }

  const prompt = await getPrompt(promptId)
  const message = `You are an expert tutor generating multiple-choice quiz questions from an educational video **summary**.

Your task is to generate 10 high-quality multiple-choice questions **related to the concepts in the summary**, but:

📌 **Do not copy examples or exact values** from the summary if the subject is:
- Mathematics
- Physics
- Engineering
(Use similar but original numbers, functions, or problems)

📌 For **memorization-heavy subjects** (e.g. biology, history, terminology-based topics), it's acceptable to use exact information from the summary.

✅ Every question should:
- Be directly related to the concepts or techniques explained in the summary
- Be unique and unlikely to repeat on regeneration
- Include exactly one correct answer
- Use LaTeX formatting inside for all mathematical notation

🧠 Vary the difficulty and reasoning depth:
- Some factual/definition-based
- Some conceptual
- Some application-level

📦 Return exactly 10 questions in this JSON format:

{
  "questions": [
    {
      "question": "string (LaTeX allowed should include opeing and closing tags)",
      "answer": "A" | "B" | "C" | "D",
      "options": [
        { "id": "A", "text": "..." },
        { "id": "B", "text": "..." },
        { "id": "C", "text": "..." },
        { "id": "D", "text": "..." }
      ]
    },
    ...
  ]
}

Do **not** include explanations or extra commentary.  
Only output the final JSON object.

Summary:
${prompt.summary}`

  const response = await openai.responses.parse({
    input: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-4o-mini",
    text: {
      format: zodTextFormat(questionsSchema, "questions")
    }
  })

  const questions = response.output_parsed.questions.map(q => ({...q, quizVisable: true, flashcardVisable: true, userId, promptId, question: q.question.replaceAll("\\", "\\\\"), options: q.options.map(o => ({...o, text: o.text.replaceAll("\\", "\\\\")}))}))

  await Promise.all([
    Questions.insertMany(questions),
    new Usages({userId, dateTime: Date.now().toString(), seconds: 0, promptId, cost: (response.usage.output_tokens * 6.0e-7) + (response.usage.input_tokens * 1.5e-7), type: "questions"}).save()
  ])
  return questions
}