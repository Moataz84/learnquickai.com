"use server"
import Prompts from "@/utils/Models/Prompts"

export async function updatePrompt(promptId, title, isPublic) {
  await Prompts.findOneAndUpdate({promptId}, {$set: {title, public: isPublic}})
}

export async function deletePrompt(promptId) {
  await Prompts.findOneAndDelete({promptId})
  await Prompts.deleteMany({promptId})
}