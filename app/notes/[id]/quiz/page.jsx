import QuizClient from "@/components/QuizClient"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import { getServerSession } from "next-auth"

export default async function QuizPage({ params }) {
  const { id } = await params
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id
  const questions = (await Questions.find({promptId: id, userId})).map(q => ({question: q.question, answer: q.answer, options: q.options}))
  return <QuizClient promptId={id} questions={questions.length === 0? null : questions} />  
}