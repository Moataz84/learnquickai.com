import { authConfig } from "@/utils/auth"
import Messages from "@/utils/Models/Messages"
import Prompts from "@/utils/Models/Prompts"
import { getServerSession } from "next-auth"
import OpenAI from "openai"

export const dynamic = "force-dynamic"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
})

export async function GET(req) {
  
  const { searchParams } = new URL(req.url)
  const message = searchParams.get("message") || ""
  const promptId = searchParams.get("promptId") || ""

  const session = await getServerSession(authConfig)
  const userId = session?.user?.id

  await new Messages({
    promptId,
    userId,
    role: "user",
    content: message,
  }).save()
  
  const prompt = await Prompts.findOne({promptId})
  const summary = prompt.summary

  const encoder = new TextEncoder()

  let assistantContent = ""

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create(
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Answer this question ${message}. Reference this summary when relevant ${summary}.` }],
            stream: true,
          },
          { responseType: "stream" }
        )

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content

          if (content) {
            assistantContent += content
            controller.enqueue(
              encoder.encode(`data: ${content.replaceAll("\\", "\\\\")}\n\n`)
            )
          }

          if (chunk.choices[0]?.finish_reason === "stop") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"))
            controller.close()

            await new Messages({
              promptId,
              userId,
              role: "assistant",
              content: assistantContent.replaceAll("\\", "\\\\"),
            }).save()

            break
          }
        }
      } catch (error) {
        console.error("Streaming error:", error)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
