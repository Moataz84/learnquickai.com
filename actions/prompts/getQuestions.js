"use server"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import { getServerSession } from "next-auth"

export default async function getQuestions(promptId) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const questions = await Questions.find({promptId, userId: id, $or: [{flashcardVisable: true}, {quizVisable: true}]})
  const gameQuestions = await Questions.find({promptId}).limit(30)
  const mapped = [questions, gameQuestions].map(l => l.map(q => ({question: q.question, answer: q.answer, options: q.options, id: q.id, quizVisable: q.quizVisable, flashcardVisable: q.flashcardVisable})))
  return {questions: mapped[0], gameQuestions: mapped[1]}
}