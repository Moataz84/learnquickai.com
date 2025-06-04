"use server"
import Questions from "@/utils/Models/Questions"

export async function deleteFlashcard(id) {
  const q = await Questions.findOneAndUpdate({_id: id}, {$set: {flashcardVisable: false}}, {new: true})
  if (!q.flashcardVisable && !q.quizVisable) await Questions.deleteOne({_id: id})
}

export async function deleteQuestion(id) {
  const q = await Questions.findOneAndUpdate({_id: id}, {$set: {quizVisable: false}}, {new: true})
  if (!q.flashcardVisable && !q.quizVisable) await Questions.deleteOne({_id: id})
}