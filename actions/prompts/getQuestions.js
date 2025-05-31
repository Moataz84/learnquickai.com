"use server"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import { getServerSession } from "next-auth"
import { headers } from "next/headers"

export default async function getQuestions(promptId) {
  let questions = []
  const headerList = await headers()
  const pathname = headerList.get("x-current-path")
  const purpose = pathname.includes("quiz") ? "quiz" : pathname.includes("flashcards") ? "flashcards" : ""
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  if (purpose === "quiz") {
    questions = await Questions.find({promptId, userId: id, quizVisable: true})
  } else if (purpose === "flashcards") {
    questions = await Questions.find({promptId, userId: id, flashcardVisable: true})
  } else {
    questions = await Questions.find({promptId}).limit(30)
  }
  return questions.map(q => ({question: q.question, answer: q.answer, options: q.options, id: q.id}))
}