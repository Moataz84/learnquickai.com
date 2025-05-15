"use client"
import { useState } from "react"
import AudioUpload from "@/components/Uploads/AudioUpload"
import YoutubeUpload from "@/components/Uploads/YoutubeUpload"
import DocumentUpload from "@/components/Uploads/DocumentUpload"

export default function UploadSection() {
  const [modalError, setModalError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Start Summarizing</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload a file, paste a YouTube link, or use a document to quickly generate notes, flashcards, and quizzes.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <AudioUpload setModalError={setModalError} loading={loading} setLoading={setLoading} />
        <YoutubeUpload
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          setModalError={setModalError}
          loading={loading} 
          setLoading={setLoading}
        />
        <DocumentUpload setModalError={setModalError} loading={loading} setLoading={setLoading} />
      </div>

      {modalError && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm w-full text-center relative">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Upload Error</h2>
            <p className="text-gray-700 dark:text-gray-300">{modalError}</p>
            <button
              onClick={() => setModalError("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}