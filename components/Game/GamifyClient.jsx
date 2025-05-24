"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import WaitingRoom from "@/components/Game/WaitingRoom"
import Link from "next/link"
import { usePrompt } from "@/contexts/PromptContext"
import { useQuestions } from "@/contexts/QuestionsContext"
import { generateQuiz } from "@/actions/prompts/generateQuestions"

export default function GamePageContent() {
  const { prompt } = usePrompt()
  const { questions, setQuestions } = useQuestions()
  const session = useSession()
  const socketRef = useRef(null)

  const [waiting, setWaiting] = useState(false)
  const [gameId, setGameId] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [duration, setDuration] = useState(5)
  const [interval, setInterval] = useState(7)
  const isValid = duration >= 1 && duration <= 7 && interval >= 2 && interval <= 30

  // Setup socket connection
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_ORIGIN, {
      path: "/socket.io",
    })

    socketRef.current.on("send-game-link", (gameId) => {
      setGameId(gameId)
      setWaiting(true)
    })

    return () => socketRef.current.disconnect()
  }, [])

  // Emit user ID
  useEffect(() => {
    if (session.data?.user?.id) {
      socketRef.current.emit("user-id", {
        userId: session.data.user.id,
        name: session.data.user.name,
      })
    }
  }, [session.data?.user?.id])

  // Handle generating quiz
  async function handleGenerateQuestions() {
    setIsGenerating(true)
    try {
      const generated = await generateQuiz(prompt.promptId)
      setQuestions(generated)
    } catch (err) {
      console.error("Failed to generate quiz:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-start space-y-4 p-12 w-full">
      {questions.length === 0 && (
        <>
          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Questions"}
          </button>
          {isGenerating && (
            <div className="text-lg text-gray-500 mt-2">
              Loading your game questions...
            </div>
          )}
        </>
      )}

      {questions.length > 0 && !waiting && (
        <div className="flex gap-3 p-6">
          <button
            onClick={() => socketRef.current.emit("init-game")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Start New Game
          </button>
          <Link
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
            href={`/notes/${prompt.promptId}/gamify/play-game`}
          >
            Join Game
          </Link>
        </div>
      )}

      <WaitingRoom show={waiting} socket={socketRef?.current} gameId={gameId} />

      {questions.length > 0 && waiting && (
        <div className="flex flex-col gap-4 items-start">
          {/* Total Duration Field */}
          <div className="flex flex-col">
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
            
          {/* Time Between Questions Field */}
          <div className="flex flex-col">
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
            
          {/* Start Game Button */}
          <button
            onClick={(e) => {
              socketRef.current.emit("start-game", {gameId, duration, interval})
              e.target.parentElement.remove()
            }}
            disabled={!isValid}
            className={`px-6 py-3 rounded-md transition cursor-pointer ${
              isValid ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  )
}
