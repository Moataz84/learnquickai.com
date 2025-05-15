import { getPrompt } from "@/actions/prompts/getPrompt"
import { authConfig } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Layout({ params, children }) {
  const { id } = await params
  const prompt = await getPrompt(id)
  const session = await getServerSession(authConfig)
  const userId = session?.user?.id
  if (prompt.userId !== userId) return (
    <div className="flex flex-col items-center justify-center min-h-full text-center p-6 mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-4">
        You don't have permission to view this page.
      </p>
      <Link href={`/notes/${id}`}>
        <Button variant="default" className="cursor-pointer">Go Back</Button>
      </Link>
    </div>
  )
  return children
}