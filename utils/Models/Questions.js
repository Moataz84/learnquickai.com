import { Schema, models, model } from "mongoose"

const schema = new Schema({
  promptId: String,
  userId: String,
  question: String,
  answer: String,
  options: Array,
  quizVisable: Boolean,
  flashcardVisable: Boolean
})

const Questions = models.questions || model("questions", schema)
export default Questions