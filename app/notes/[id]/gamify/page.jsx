"use client"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import WaitingRoom from "@/components/WaitingRoom"
import Link from "next/link"
import { usePrompt } from "@/contexts/PromptContext"
import { useQuestions } from "@/contexts/QuestionsContext"
import generateQuestions from "@/actions/prompts/generateQuestions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function GamePage() {
  const { prompt } = usePrompt()
  const { gameQuestions, setGameQuestions } = useQuestions()
  const session = useSession()
  const socketRef = useRef(null)
  const router = useRouter()

  const [waiting, setWaiting] = useState(false)
  const [gameId, setGameId] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [duration, setDuration] = useState(5)
  const [interval, setInterval] = useState(7)
  const [hideGenerate, setHideGenerate] = useState(gameQuestions.length === 30? true : false)

  const isValid = duration >= 1 && duration <= 7 && interval >= 2 && interval <= 30
  const canStartGame = isValid && !isGenerating && gameQuestions.length > 0

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_ORIGIN, { path: "/socket.io" })

    socketRef.current.on("send-game-link", (gameId) => {
      setGameId(gameId)
      setWaiting(true)
    })

    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    setHideGenerate(gameQuestions.length === 30? true : false)
  }, [gameQuestions])

  useEffect(() => {
    if (session.data?.user?.id) {
      socketRef.current.emit("user-id", {
        userId: session.data.user.id,
        name: session.data.user.name,
      })
    }
  }, [session.data?.user?.id])

  async function handleGenerateQuestions() {
    setIsGenerating(true)
    try {
      const generated = await generateQuestions(prompt.promptId)
      if (generated[0] === "exceeded") return router.push("/pricing")
      if (generated[0] === "rate-limit") return router.push("/rate-limit")
      setGameQuestions(prev => {
        const combined = [...prev, ...generated].slice(0, 30)
        if (combined.length >= 30) setHideGenerate(true)
        return combined
      })
    } catch (err) {
      console.error("Failed to generate quiz:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-start space-y-6 pt-28 md:pt-12 px-5 md:px-12 pb-12 w-full">
      {/* Generate Questions */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Multiplayer Game
      </h1>
      {!hideGenerate && (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            variant="outline"
            className="w-fit cursor-pointer"
          >
            {isGenerating ? "Generating..." : "Generate Questions"}
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Questions: {gameQuestions.length}
          </p>
        </div>
      )}

      {/* Start / Join Game Options */}
      {gameQuestions.length > 0 && !waiting && (
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => {
              setHideGenerate(true) // hide generate section when starting game
              socketRef.current.emit("init-game", prompt.promptId)
            }}
            disabled={isGenerating}
            className="cursor-pointer"
            variant="default"
          >
            Start New Game
          </Button>
          <Link
            href={`/notes/${prompt.promptId}/gamify/play-game`}
          >
            <Button variant="outline" className="cursor-pointer">Join Game</Button>
          </Link>
        </div>
      )}

      {/* Waiting Room */}
      <WaitingRoom show={waiting} socket={socketRef?.current} gameId={gameId} />

      {/* Game Configuration + Start Button */}
      {gameQuestions.length > 0 && waiting && (
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Total Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={7}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border rounded px-3 py-2 w-48"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Time Between Questions (seconds)</label>
            <input
              type="number"
              min={2}
              max={30}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="border rounded px-3 py-2 w-48"
            />
          </div>

          <Button
            onClick={(e) => {
              socketRef.current.emit("start-game", { gameId, duration, interval })
              e.target.closest("div").remove()
            }}
            disabled={!canStartGame}
            className="w-fit cursor-pointer"
            variant={canStartGame ? "default" : "outline"}
          >
            {isGenerating ? "Wait for Generation..." : "Start Game"}
          </Button>
        </div>
      )}
    </div>
  )
}