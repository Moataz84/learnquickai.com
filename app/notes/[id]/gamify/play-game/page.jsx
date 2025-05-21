"use client"
import JoinGameContent from "@/components/Game/JoinGameClient"
import { SessionProvider } from "next-auth/react"

export default function JoinGamePage() {
  return (
    <SessionProvider>
      <JoinGameContent />
    </SessionProvider>
  )
}