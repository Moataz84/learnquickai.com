"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { FiChevronLeft, FiChevronRight, FiSend, FiArrowDown } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MathRender from "@/components/MathRender"
import { usePrompt } from "@/contexts/PromptContext"
import getMessages from "@/actions/prompts/getMessages"
import { useRouter, useSearchParams } from "next/navigation"

const ChatMessages = React.memo(({ messages }) => {
  return messages.length !== 0 ? (
    messages.map((msg, idx) => (
      <div
        key={idx}
        className={`p-2 rounded-lg ${
          msg.role === "user"
            ? "bg-blue-500 text-white self-end ml-auto"
            : "bg-zinc-100 dark:bg-zinc-800"
        }`}
        style={{ maxWidth: "80%", width: "fit-content" }}
      >
        <MathRender>{msg.content}</MathRender>
      </div>
    ))
  ) : (
    <p className="text-center text-sm text-muted-foreground italic py-4">
      Start a conversation to get started!
    </p>
  )
})

export default function ChatSidebar({ userMessages }) {
  const router = useRouter()
  const { prompt } = usePrompt()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const CHARACTER_LIMIT = 500

  const messagesContainerRef = useRef(null)
  const bottomRef = useRef(null)
  const searchParams = useSearchParams()

  const [messages, setMessages] = useState(userMessages)

  useEffect(() => {
    const param = searchParams.get("chat")
    if (param !== null) {
      setOpen(true)
    }
  }, [searchParams])

  const handleSend = useCallback(() => {
    if (!input.trim() || loading || input.length > CHARACTER_LIMIT) return

    const userMessage = input.trim().replaceAll("\\", "\\\\")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    let assistantMsg = { role: "assistant", content: "" }
    setMessages((prev) => [...prev, assistantMsg])

    const source = new EventSource(`/api/stream?message=${encodeURIComponent(userMessage)}&promptId=${encodeURIComponent(prompt.promptId)}`)

    source.onmessage = async (event) => {
      if (event.data === "[DONE]") {
        setLoading(false)
        source.close()
        const msgs = await getMessages(prompt.promptId)
        setMessages(msgs)
        return
      }

      if (event.data === "[FREE_OVERUSE]") {
        setLoading(false)
        source.close()
        return router.push("/pricing")
      }

      if (event.data === "[PAID_OVERUSE]") {
        setLoading(false)
        source.close()
        return router.push("/rate-limit")
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last.role === "assistant") {
          const updated = { ...last, content: last.content + event.data }
          return [...prev.slice(0, -1), updated]
        }
        return prev
      })
    }

    source.onerror = (err) => {
      setLoading(false)
      source.close()
    }
  }, [input, loading, prompt.promptId])


  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, open, scrollToBottom])

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100

    setShowScrollBtn(!isAtBottom)
  }

  const memoMessages = useMemo(() => messages, [messages])

  return (
  <div className={`z-50 transition-all duration-300
    sticky top-[64px] md:top-0 right-0 h-[calc(100vh-64px)] md:h-screen ${open ? "fixed inset-0 bg-black/50 md:bg-transparent" : ""}`}
  >
  <div
    className={`flex h-full border-l shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 ${open ? "w-full md:w-96" : "w-15"} ${open ? "fixed right-0 h-full z-50" : ""}`}
  >
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-semibold text-lg">{open ? "Chat" : ""}</span>
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <FiChevronRight /> : <FiChevronLeft />}
        </Button>
      </div>

      {/* Chat Messages */}
      {open && (
        <div
          className="flex-1 overflow-y-auto p-3 space-y-2 text-sm relative"
          ref={messagesContainerRef}
          onScroll={handleScroll}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          <ChatMessages messages={memoMessages} />
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input Section */}
      {open && (
        <div className="p-3 border-t flex flex-col gap-2">
          <Textarea
            rows={2}
            className="resize-none"
            maxLength={CHARACTER_LIMIT}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {input.length}/{CHARACTER_LIMIT}
            </span>
            <Button
              size="sm"
              className="cursor-pointer"
              disabled={loading || input.length === 0 || input.length > CHARACTER_LIMIT}
              onClick={handleSend}
            >
              <FiSend className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Scroll to Bottom Button */}
  {showScrollBtn && open && (
    <Button
      variant="secondary"
      className="fixed bottom-24 right-4 shadow text-xs cursor-pointer z-[60]"
      onClick={scrollToBottom}
    >
      <FiArrowDown className="mr-1" />
      Scroll to bottom
    </Button>
  )}
</div>

  )
}