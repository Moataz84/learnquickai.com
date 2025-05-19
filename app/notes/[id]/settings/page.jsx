"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { usePrompt } from "@/contexts/PromptContext"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updatePrompt, deletePrompt } from "@/actions/prompts/updatePrompt"

export default function PromptSettingsPage() {
  const router = useRouter()
  const { prompt, setPrompt } = usePrompt()

  const [title, setTitle] = useState(prompt?.title || "")
  const [isPublic, setIsPublic] = useState(prompt.public)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  async function handleSave() {
    await updatePrompt(prompt.promptId, title, isPublic)
    setPrompt(prompt => ({...prompt, public: isPublic}))
    router.push(`/notes/${prompt.promptId}`)
  }

  async function handleDelete() {
    setShowConfirmDelete(false)
    await deletePrompt(prompt.promptId)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen text-base relative w-[70%] max-w-[750px]">
      <div className="max-w-4xl w-full p-14">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Note Settings
        </h1>

        <div className="space-y-8">
          <div>
            <Label htmlFor="title" className="text-gray-900 dark:text-white text-sm">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 w-full text-sm px-4 py-3"
              placeholder="Enter note title"
            />
          </div>

          <div className="flex items-center gap-2 w-full">
            <Label htmlFor="publicToggle" className="text-gray-900 dark:text-white text-sm">
              Public Note
            </Label>
            <Switch
              id="publicToggle"
              className="cursor-pointer"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="pt-4 space-y-3 max-w-xs flex flex-col items-start gap-3">
            <Button onClick={handleSave} className="py-1 text-sm cursor-pointer">
              Save & Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowConfirmDelete(true)}
              className="py-1 text-sm cursor-pointer"
            >
              Delete Note
            </Button>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-red-600">Are you sure?</h2>
            <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
              This action is irreversible. The note will be permanently deleted.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmDelete(false)}
                className="text-base cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="text-base cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}