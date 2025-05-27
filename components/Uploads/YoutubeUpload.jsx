"use client"
import { checkYTVideo, uploadYoutubeVideo } from "@/actions/uploads/ytVideos"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaYoutube, FaTimes } from "react-icons/fa"

export default function YoutubeUpload({isDialogOpen, setIsDialogOpen, setModalError, loading, setLoading}) {
  const router = useRouter()
  const [youtubeLink, setYoutubeLink] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (!youtubeLink.length) return setModalError("Enter a YouTube link")
    setLoading(true)
    const result = await checkYTVideo(youtubeLink)
    setLoading(false)
    if (result.msg === "exceeded") return router.push("/pricing")
    if (result.msg === "limit") return setModalError("Video must not exceed 10 hours in duration")
    if (result.msg === "success") {
      uploadYoutubeVideo(result.promptId, `https://www.youtube.com/watch?v=${result.ytVideoId}`, result.length)
      return router.push(`/notes/${result.promptId}`)
    }
  }

  return (
    <>
      <div
        onClick={() => {if (loading) return; setIsDialogOpen(true)}}
        className="flex flex-col items-center justify-center p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
        style={{ minWidth: "230px", flex: "1 1 230px", maxWidth: "100%" }}
      >
        <FaYoutube size={40} className="mb-4 text-red-600" />
        <h3 className="text-xl font-semibold">YouTube Link</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Paste a YouTube link to generate summaries and notes.
        </p>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 overflow-hidden">
            { loading? <div className="loading"></div> : <></> }   
            <button
              className="absolute top-2 right-2 text-gray-600 text-2xl cursor-pointer"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Paste YouTube Link</h2>
            <input
              type="text"
              placeholder="Enter YouTube link..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  )
}