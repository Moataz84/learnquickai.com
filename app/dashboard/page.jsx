import SideMenu from "@/components/SideMenu"
import UploadSection from "@/components/Uploads/UploadSection"
import { authConfig } from "@/utils/auth"
import Prompts from "@/utils/Models/Prompts"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { FaFileAlt, FaMicrophone, FaYoutube } from "react-icons/fa"

export const metadata = {
  title: "Dashboard"
}

export default async function Dashboard() {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const prompts = await Prompts.find({userId: id, summary: {$nin: ["", "failed"]}}).select("promptId title type")

  return (
    <div className="flex">
      <SideMenu />
      <div className="min-h-screen p-10 flex-1 max-w-[80rem] mx-0">
        <UploadSection />
        {prompts.length === 0 ? (
          <p className="text-xl font-bold text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span role="img" aria-label="No notes" className="text-3xl">
              📝
            </span>
            You have no notes yet. Start adding some!
          </p>
        ) : (
          <><h2 className="text-2xl font-bold mb-4">Your Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, idx) => (
              <Link href={`/notes/${prompt.promptId}`} key={idx}>
                <div className="h-40 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-center items-center text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                    {
                      prompt.type === "yt" ? (
                        <FaYoutube size={30} className="text-3xl text-red-600" />
                      ) : prompt.type === "audio" ? (
                        <FaMicrophone size={30} className="text-3xl text-purple-600" />
                      ) : (
                        <FaFileAlt size={30} className="text-3xl text-green-600" />
                      )
                    }
                  </div>
                  <h4 className="text-lg font-medium truncate max-w-full">{prompt.title}</h4>
                  </div>
              </Link>
            ))}
          </div></>
        )}
      </div>
    </div>
  )
}