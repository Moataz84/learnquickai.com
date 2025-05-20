import { getPrompt } from "@/actions/prompts/getPrompt"
import Link from "next/link"

export default async function Layout({ params, children }) {
  const { id } = await params
  const prompt = await getPrompt(id)

  if (prompt.public) return children
  return (
    <div className="flex flex-col items-center mt-24 mx-auto text-center space-y-6 px-6">
      <h2 className="text-3xl font-semibold">
        This note is not public 🔒
      </h2>
      <p className="text-lg max-w-lg px-4">
        You need to make this note public to share it with others. Go to the settings below to update the privacy.
      </p>
      <Link href={`/notes/${id}/settings`} className="px-6 py-3 bg-blue-600 rounded-md text-white text-base hover:bg-blue-700 transition inline-block">Go to Settings</Link>
    </div>
  )
}