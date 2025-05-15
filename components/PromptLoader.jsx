"use client"
import { usePrompt } from "@/contexts/PromptContext"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Chatbot from "@/components/Chatbot"

const tips = [
  "🧠 Did you know? Handwritten notes help improve memory retention!",
  "💡 Pro Tip: Try summarizing content in your own words to master it faster.",
  "📚 Keep your notes organized: Use headings, bullet points, and colors!",
  "🖊️ Writing things down boosts your focus — no more distractions!",
  "⏳ Did you know? It's scientifically proven: taking breaks helps learning!",
  "🎯 Pro Tip: Use flashcards to review key concepts and test yourself.",
  "🚀 Small steps = big progress! You're doing awesome!",
  "🌱 The more you learn, the more you grow. Keep it up!",
  "🌟 Learning takes time — stay patient, we've got your back!",
  "📝 Fun Fact: Studying in small, consistent chunks improves your memory!",
]

export default function PromptLoader({ number, children, userMessages }) {
  const pathname = usePathname()
  const prompt = usePrompt()

  const [loading, setLoading] = useState(prompt.summary === "")
  const [currentTip, setCurrentTip] = useState(tips[number])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      const random = tips[Math.floor(Math.random() * tips.length)]
      setCurrentTip(random)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (prompt.summary !== "") setLoading(false)
  }, [prompt])


  useEffect(() => {
    if (prompt.summary === "") document.title = "Loading"
  }, [pathname])

  if (!mounted) return null

  if (!loading) {
    if (pathname.includes("settings")) return children
    return (
      <>
        {children}
        <Chatbot userMessages={userMessages} />
      </>
    )
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen my-0 mx-auto text-center space-y-6">
      <h2 className="text-3xl font-semibold mt-25">
        We're working hard on your document... 🛠️
      </h2>
      <p className="text-lg max-w-md px-4">
        {currentTip}
      </p>
    </div>
  )
}