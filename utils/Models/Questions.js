import { Schema, models, model } from "mongoose"

const schema = new Schema({
  promptId: String,
  userId: String,
  question: String,
  answer: String,
  options: Array
})

const Questions = models.questions || model("questions", schema)
export default Questions