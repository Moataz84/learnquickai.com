"use client"
import GamePageContent from "@/components/Game/GamifyClient"
import { SessionProvider } from "next-auth/react"

export default function GamePage() {
  return (
    <SessionProvider>
      <GamePageContent />
    </SessionProvider>
  )
}