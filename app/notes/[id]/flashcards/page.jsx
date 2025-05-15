import FlashcardUI from "@/components/FlashCards"
import { authConfig } from "@/utils/auth"
import Questions from "@/utils/Models/Questions"
import { getServerSession } from "next-auth"

export default async function FlashCardsPage({ params }) {
  const { id } = await params
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id
  const flashCards = (await Questions.find({promptId: id, userId})).map(q => ({question: q.question, answer: q.options.find(a => a.id === q.answer).text}))
  return <FlashcardUI flashCardsData={flashCards} promptId={id} />
}