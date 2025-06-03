"use client"
import { FaTrophy } from "react-icons/fa"
import { useEffect, useState } from "react"
import KahootGame from "@/components/Game"
import { usePrompt } from "@/contexts/PromptContext"

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function WaitingRoom({ socket, show, gameId }) {
  const { prompt } = usePrompt()
  const [players, setPlayers] = useState(0)
  const [gameStarted, setStarted] = useState(false)
  const [gameEnded, setEnded] = useState(false)
  const [time, setTime] = useState(0)
  const [leaderBoard, setLeaderBoard] = useState([])
  const [liveLeaderboard, setLiveLeaderboard] = useState([])
  const [interval, setInterval] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    socket?.on("player-joined", num => setPlayers(num))
    socket?.on("game-started", data => {
      setStarted(true)
      setLiveLeaderboard(data.users)
      setInterval(data.interval)
      setTime(data.time)
    })
    socket?.on("game-ended", data => {
      setStarted(false)
      setEnded(true)
      setLeaderBoard(data)
    })
    socket?.on("time", t => setTime(t))
    socket?.on("score", (scores) => {
      setLiveLeaderboard(scores)
    })
  }, [socket])

  const playAgain = () => (window.location.href = `/notes/${prompt.promptId}/gamify`)
  const exitGame = () => (window.location.href = `/notes/${prompt.promptId}`)

  const copyJoinLink = () => {
    const joinUrl = `${window.location.href}/play-game?gameId=${gameId}`
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!show) return null

  return (
    <div className="space-y-4 max-w-4xl w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono select-text gap-4 sm:gap-10">
        <div className="flex flex-col items-start gap-2">
          <span>Game Code: <b>{gameId}</b></span>
          <button
            onClick={copyJoinLink}
            className={`text-sm rounded transition cursor-pointer p-2 ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {copied ? '✅ Copied!' : '📋 Copy Join Link'}
          </button>
        </div>
        <button
          onClick={exitGame}
          className="px-3 py-3 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition cursor-pointer"
        >
          ❌ Exit Game
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mt-4 gap-2">
        <p className="font-medium text-blue-600">
          🧑‍🤝‍🧑 Players: <span className="font-semibold">{players}</span>
        </p>
        {gameStarted && (
          <p className="font-medium text-red-600">
            ⏱ Time Left: <span className="font-semibold">{formatTime(time)}</span>
          </p>
        )}
      </div>

      {!gameStarted && !gameEnded && players > 0 && (
        <div className="text-center mt-6 text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse">
          ⏳ Waiting for the host to start the game...
        </div>
      )}

      {gameStarted && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">🏆 Live Leaderboard</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-left">
            {liveLeaderboard.sort((a, b) => b.score - a.score).map((player, index) => (
              <li key={index} className="py-1 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  #{index + 1} {player.name}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {player.score} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {gameStarted && (
        <KahootGame gameId={gameId} socket={socket} show={show} interval={interval} />
      )}

      {gameEnded && (
        <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 mt-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <FaTrophy size={48} className="text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Game Over! 🏁</h1>
              <p className="text-gray-500 dark:text-gray-400">Here are the final scores:</p>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-left">
              {leaderBoard.sort((a, b) => b.score - a.score).map((player, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    #{index + 1} {player.name}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {player.score} pts
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={playAgain}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
            >
              🔁 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
