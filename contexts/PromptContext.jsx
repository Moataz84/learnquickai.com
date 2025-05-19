"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { getPrompt } from "@/actions/prompts/getPrompt"
import { useRouter } from "next/navigation"

const PromptContext = createContext(null)

export function PromptProvider({ initialPrompt, children }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState(initialPrompt)

  useEffect(() => {
    async function fetchData() {
      const result = await getPrompt(prompt.promptId)
      setPrompt(result)
    }
    const dataInterval = setInterval(fetchData, 2000)

    if (prompt.summary !== "") {
      document.title = prompt.summary === "failed" ? "Note Failed" : prompt.title
      clearInterval(dataInterval)
      router.refresh()
    }

    return () => clearInterval(dataInterval)
  }, [prompt])

  return (
    <PromptContext.Provider value={{prompt, setPrompt}}>
      {children}
    </PromptContext.Provider>
  )
}

export function usePrompt() {
  const context = useContext(PromptContext)
  if (context === null) {
    throw new Error("usePrompt must be used within a PromptProvider")
  }
  return context
}