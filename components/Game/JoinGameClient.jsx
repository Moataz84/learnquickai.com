"use client"
import { io } from "socket.io-client"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import WaitingRoom from "@/components/Game/WaitingRoom"
import { useSession } from "next-auth/react"
import { usePrompt } from "@/contexts/PromptContext"

export default function JoinGameContent() {
  const { prompt } = usePrompt()
  const session = useSession()
  const [gameId, setGameId] = useState("")
  const socketRef = useRef(null)  
  const searchParams = useSearchParams()
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_ORIGIN, {
      path: "/socket.io",
    })
    socketRef.current.on("no-lobby", () => alert("This is not a valid game ID"))
    socketRef.current.on("joined-game", () => setWaiting(true))
    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    if (session.data?.user?.id) socketRef.current.emit("user-id", {userId: session?.data?.user?.id, name: session?.data?.user?.name})
  }, [session.data?.user?.id])

  useEffect(() => {
    const param = searchParams.get("gameId")
    if (param) {
      setGameId(param)
    }
  }, [searchParams])

  const handleJoin = () => {
    socketRef.current.emit("player-join", {gameId: gameId.toLowerCase().trim(), promptId: prompt.promptId})
  }

  return (
    <div className="flex flex-col items-start space-y-4 p-12 w-full">
    <WaitingRoom show={waiting} socket={socketRef?.current} gameId={gameId} />
    {!waiting?
      <div className=" shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-6 dark:bg-gray-800 mx-auto mt-15">
        <h1 className="text-3xl font-bold">Join a Game</h1>
        <input
          type="text"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Join Game
        </button>
      </div>
     : null}
    </div>
  )
}