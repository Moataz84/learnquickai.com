"use client"
import { FaExclamationTriangle } from "react-icons/fa"
import Link from "next/link"

export default function PromptError() {
  return (
    <div className="flex flex-col items-center mt-30 mx-auto text-center space-y-6">
      <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-3xl font-semibold">
        Sorry, we couldn't generate your notes 😔
      </h2>
      <p className="text-lg max-w-md px-4">
        This might be due to an issue with the file, link, or a temporary processing error. You can try uploading or linking a new video below.
      </p>
      <Link className="px-6 py-4 bg-blue-600 rounded-md text-sm hover:bg-blue-700 cursor-pointer text-white transition" href="/dashboard">
        Try a New Video
      </Link>
    </div>
  )
}