"use client"
import { generateTranscriptAndData } from "@/actions/uploads/generateData"
import { checkVideo, uploadChunk } from "@/actions/uploads/audioUploads"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaUpload } from "react-icons/fa"

export default function AudioUpload({ setModalError, loading, setLoading }) {
  const router = useRouter()
  const [dragTarget, setDragTarget] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (uploading) {
        e.preventDefault()
        e.returnValue = "Upload in progress. Are you sure you want to leave?"
        return e.returnValue
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [uploading])

  useEffect(() => {
    const originalPush = router.push
    if (uploading) {
      router.push = (...args) => {
        const confirmLeave = window.confirm("Upload in progress. Are you sure you want to leave?")
        if (confirmLeave) {
          setUploading(false)
          return originalPush(...args)
        }
        return
      }
    }

    return () => {
      router.push = originalPush
    }
  }, [uploading, router])

  const isMP3 = (file) => file?.type === "audio/mpeg"

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    setDragTarget(null)
    if (!file || !isMP3(file)) return setModalError("Only MP3 files are allowed")
    handleUpload({ target: { files: [file] } })
  }

  async function handleUpload(e) {
    if (loading) return
    setLoading(true)
    const file = e.target?.files?.[0]
    if (!file || !isMP3(file)) return setModalError("Only MP3 files are allowed")

    setUploading(true)
    setUploadProgress(0)

    const CHUNK_SIZE = 1 * 1024 * 1024
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      const isLast = totalChunks === i + 1

      const formData = new FormData()
      formData.append("chunk", chunk)
      formData.append("chunkIndex", i)
      formData.append("fileId", fileId)
      await uploadChunk(formData)

      setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))

      if (isLast) {
        setUploading(false)
        document.getElementById("video-upload").value = ""
        const result = await checkVideo(fileId)
        setLoading(false)
        if (result.msg === "exceeded") return router.push("/pricing")
        if (result.msg === "success") {
          generateTranscriptAndData(result.promptId, result.videoPath, result.videoId)
          return router.push(`/notes/${result.promptId}`)
        }
      }
    }
  }

  return (
    <div
      onClick={() => !uploading && document.getElementById("video-upload")?.click()} // Disable click if uploading
      onDragOver={(e) => {
        e.preventDefault()
        setDragTarget("audio")
      }}
      onDragLeave={() => setDragTarget(null)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center border-2 ${dragTarget === "audio" ? "border-blue-500 border-dashed" : "border-transparent"}`}
      style={{ minWidth: "230px", flex: "1 1 230px", maxWidth: "100%" }}
    >
      <FaUpload size={40} className="mb-4 text-blue-600" />
      <h3 className="text-xl font-semibold">Upload Audio</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Click or drag & drop an MP3 file</p>
      <input
        id="video-upload"
        type="file"
        accept="audio/mpeg"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading} // Disable input while uploading
      />

      {uploading && (
        <div className="mt-4 w-full">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Uploading... {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
