import NotFound from "@/app/not-found"
import { getServerSession } from "next-auth"
import { authConfig } from "@/utils/auth"
import { getPrompt } from "@/actions/prompts/getPrompt"
import SideMenu from "@/components/SideMenu"
import PromptError from "@/components/PromptError"
import PromptLoader from "@/components/PromptLoader"
import { PromptProvider } from "@/contexts/PromptContext"
import getMessages from "@/actions/prompts/getMessages"
import { QuestionsProvider } from "@/contexts/QuestionsContext"
import getQuestions from "@/actions/prompts/getQuestions"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }) {
  const { id } = await params
  const prompt = await getPrompt(id)
  if (!prompt) return {title: "Not Found"}
  const session = await getServerSession(authConfig)
  if (!prompt.public && prompt.userId !== session?.user?.id) return {title: "Not Found"}
  if (prompt.summary === "failed") return {title: "Note Failed"}
  if (prompt.summary === "") return {title: "Loading"}
  return {title: `LearnQuick AI - ${prompt.title}`}
}

export default async function Layout({ params, children }) {
  const { id } = await params
  const prompt = await getPrompt(id)
  if (!prompt) return <NotFound />
  const session = await getServerSession(authConfig)
  if (!prompt.public && prompt.userId !== session?.user?.id) return <NotFound />
  const messages = await getMessages(id)
  const questions = await getQuestions(id)

  return (
    <div className="flex">
      <SideMenu promptId={id} />
      {
      prompt.summary === "failed"? 
        <PromptError /> 
      : 
      <PromptProvider initialPrompt={prompt}>
        <QuestionsProvider promptId={id} initialQuestions={questions}>
          <PromptLoader children={children} number={Math.floor(Math.random() * 10)} userMessages={messages} />
        </QuestionsProvider>
      </PromptProvider>
      }
    </div>
  )
}