import getUsage from "@/actions/getUsage"
import { authConfig } from "@/utils/auth"
import Messages from "@/utils/Models/Messages"
import Prompts from "@/utils/Models/Prompts"
import Usages from "@/utils/Models/Usages"
import Users from "@/utils/Models/Users"
import { getServerSession } from "next-auth"
import OpenAI from "openai"
import { encoding_for_model } from "tiktoken"

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
  const user = await Users.findOne({_id: userId})
  const { cost } = await getUsage(userId)
  if ((!user.active && cost > 0.2) || (user.active && cost >= 3.5)) {
    return new Response(null, { status: 204 })
  }

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
          console.log(chunk)
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

            const enc = encoding_for_model("gpt-4o-mini-2024-07-18")
            const promptText = `Answer this question ${message}. Reference this summary when relevant ${summary}.`
            const promptTokenCount = enc.encode(promptText).length
            const completionTokenCount = enc.encode(assistantContent).length
            new Usages({userId, dateTime: Date.now().toString(), seconds: 0, promptId, cost: (completionTokenCount * 6.0e-7) + (promptTokenCount * 1.5e-7), type: "message"}).save()
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
