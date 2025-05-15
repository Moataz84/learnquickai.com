"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaFileAlt } from "react-icons/fa"
import { uploadChunk, checkDocument, generateDocumentData } from "@/actions/uploads/documentUpload"

export default function DocumentUpload({ setModalError, loading, setLoading }) {
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

  const isValidDoc = (file) =>
    file &&
    [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint"
    ].includes(file.type)

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    setDragTarget(null)
    if (!file || !isValidDoc(file)) return setModalError("Only PDF, DOC/DOCX, or PPTX files are allowed")
    handleUpload({ target: { files: [file] } })
  }

  async function handleUpload(e) {
    if (loading) return
    setLoading(true)
    const file = e.target?.files?.[0]
    if (!file || !isValidDoc(file)) return setModalError("Only PDF, DOC/DOCX, or PPTX files are allowed")
    
    const MAX_FILE_SIZE = 20 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return setModalError("File size exceeds the 20MB limit. Please upload a smaller file")
    }
    setUploading(true)
    setUploadProgress(0)

    const CHUNK_SIZE = 1 * 1024 * 1024
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const fileExtension = file.name.split('.').pop().toLowerCase()

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      const isLast = totalChunks === i + 1

      const formData = new FormData()
      formData.append("chunk", chunk)
      formData.append("chunkFile", `${i}.${fileExtension}`)
      formData.append("fileId", fileId)
      await uploadChunk(formData)

      setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))

      if (isLast) {
        setUploading(false)
        document.getElementById("doc-upload").value = ""
        const result = await checkDocument(fileId, fileExtension)
        setLoading(false)
        if (result.msg === "success") {
          generateDocumentData(result.promptId, result.documentPath)
          return router.push(`/notes/${result.promptId}`)
        }
      }
    }
  }

  return (
    <div
      onClick={() => !uploading && document.getElementById("doc-upload")?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragTarget("doc")
      }}
      onDragLeave={() => setDragTarget(null)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center border-2 ${
        dragTarget === "doc" ? "border-green-500 border-dashed" : "border-transparent"
      }`}
      style={{ minWidth: "230px", flex: "1 1 230px", maxWidth: "100%" }}
    >
      <FaFileAlt size={40} className="mb-4 text-green-600" />
      <h3 className="text-xl font-semibold">Upload Document</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Click or drag & drop PDF, DOCX, or PPTX
      </p>
      <input
        id="doc-upload"
        type="file"
        accept=".pdf,.doc,.docx,.pptx"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-4 w-full">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Uploading... {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
