"use client"
import { useRouter } from "next/navigation"
import { FaExclamationTriangle } from "react-icons/fa"

export default function PromptError() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center min-h-screen my-0 mx-auto text-center space-y-6 justify-center">
      <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-3xl font-semibold">
        Sorry, we couldn't generate your notes 😔
      </h2>
      <p className="text-lg max-w-md px-4">
        This might be due to an issue with the file, link, or a temporary processing error. You can try uploading or linking a new video below.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-2 bg-blue-600 rounded-md text-sm hover:bg-blue-700 cursor-pointer text-white transition"
      >
        Try a New Video
      </button>
    </div>
  )
}