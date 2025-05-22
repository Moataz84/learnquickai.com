"use server"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import { getServerSession } from "next-auth"

export default async function getQuestions(promptId, userId) {
  let questions
  if (userId === "id") {
    const session = await getServerSession(authConfig)
    const id = session?.user?.id
    questions = await Questions.find({promptId, userId: id})
  } else {
    questions = await Questions.find({promptId}).limit(25)
  }
  return questions.map(q => ({question: q.question, answer: q.answer, options: q.options}))
}