"use client"
import { createContext, useContext, useState, useEffect } from "react"
import getQuestions from "@/actions/prompts/getQuestions"
import { usePathname } from "next/navigation"

const QuestionsContext = createContext(null)

export function QuestionsProvider({ promptId, initialQuestions, children }) {
  const pathname = usePathname()
  const [questions, setQuestions] = useState(initialQuestions)
  const [type, setType] = useState("id")

  useEffect(() => {
    if (pathname.includes("/gamify")) return setType(null)
    setType("id")
  }, [pathname])

  useEffect(() => {
    async function fetchData() {
      const result = await getQuestions(promptId, type)
      setQuestions(result)
    }
    fetchData()
  }, [type])

  return (
    <QuestionsContext.Provider value={{questions, setQuestions}}>
      {children}
    </QuestionsContext.Provider>
  )
}

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (context === null) {
    throw new Error("usePrompt must be used within a PromptProvider")
  }
  return context
}