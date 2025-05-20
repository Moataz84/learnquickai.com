"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import WaitingRoom from "@/components/Game/WaitingRoom";
import Link from "next/link";
import { usePrompt } from "@/contexts/PromptContext";

export default function GamePageContent() {
  const { prompt } = usePrompt()
  const session = useSession();
  const socketRef = useRef(null);
  const [waiting, setWaiting] = useState(false);
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_ORIGIN, {
      path: "/socket.io",
    });
    socketRef.current.on("send-game-link", (gameId) => {
      setGameId(gameId);
      setWaiting(true);
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (session.data?.user?.id) socketRef.current.emit("user-id", session?.data?.user?.id)
  }, [session.data?.user?.id])

  return (
    <div className="flex flex-col items-start space-y-4 p-12 w-full">
      {!waiting ? (
        <div className="flex gap-3 p-6">
        <button
          onClick={() => socketRef.current.emit("init-game")}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Initialize New Game
        </button>
        <Link className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer" href={`/notes/${prompt.promptId}/gamify/play-game`}>Join Game</Link>
        </div>
      ) : (
        <button
          onClick={(e) => {
            socketRef.current.emit("start-game", gameId);
            e.target.remove();
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
        >
          Start Game
        </button>
      )}

      <WaitingRoom show={waiting} socket={socketRef?.current} gameId={gameId} />
    </div>
  );
}