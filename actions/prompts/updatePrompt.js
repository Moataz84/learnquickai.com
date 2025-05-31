"use server"
import Messages from "@/utils/Models/Messages"
import Prompts from "@/utils/Models/Prompts"
import Questions from "@/utils/Models/Questions"

export async function updatePrompt(promptId, title, isPublic) {
  await Prompts.findOneAndUpdate({promptId}, {$set: {title, public: isPublic}})
}

export async function deletePrompt(promptId) {
  await Prompts.findOneAndDelete({promptId})
  await Questions.deleteMany({promptId})
  await Messages.deleteMany({promptId})
}