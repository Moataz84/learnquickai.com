"use client"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import getQuestions from "@/actions/prompts/getQuestions"
import { usePathname } from "next/navigation"

const QuestionsContext = createContext(null)

export function QuestionsProvider({ promptId, initialQuestions, children }) {
  const pathname = usePathname()
  const [questions, setQuestions] = useState(initialQuestions)
  const [type, setType] = useState("")
  const hasMounted = useRef(false)

  useEffect(() => {
    const newPurpose = pathname.includes("quiz") ? "quiz" : pathname.includes("flashcards") ? "flashcards" : ""
    setType(newPurpose)
  }, [pathname])

  useEffect(() => {
    async function fetchData() {
      if (!hasMounted.current) {
        hasMounted.current = true
        return
      }
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
    throw new Error("useQuestions must be used within a QuestionsProvider")
  }
  return context
}