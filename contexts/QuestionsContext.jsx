"use client"
import { createContext, useContext, useState } from "react"

const QuestionsContext = createContext(null)

export function QuestionsProvider({ initialQuestions, children }) {
  const [questions, setQuestions] = useState(initialQuestions.questions)
  const [gameQuestions, setGameQuestions] = useState(initialQuestions.gameQuestions)

  return (
    <QuestionsContext.Provider value={{questions, setQuestions, gameQuestions, setGameQuestions}}>
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