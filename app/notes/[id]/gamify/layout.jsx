import { getPrompt } from "@/actions/prompts/getPrompt"
import EnterGameCode from "@/components/EnterGameCode"
import { authConfig } from "@/utils/auth"
import { getServerSession } from "next-auth"

export default async function Layout({ params, children }) {
  const { id } = await params
  const prompt = await getPrompt(id)
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id

  if (userId === prompt.userId) {
    if (!prompt.public) return <h2>Note must be public</h2>
    return children
  }

  return <EnterGameCode />
}