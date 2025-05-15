"use server"
import Prompts from "@/utils/Models/Prompts"

export async function getPrompt(promptId) {
  const prompt = await Prompts.findOne({promptId})
  if (!prompt) return null
  return {userId: prompt.userId, title: prompt.title, promptId: prompt.promptId, summary: prompt.summary.replace(/^\*\*Title:\*\*\s*\n.*/m, ""), public: prompt.public}
}