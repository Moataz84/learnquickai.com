import { Schema, models, model } from "mongoose"

const schema = new Schema({
  promptId: String,
  userId: String,
  role: String,
  content: String
})

const Messages = models.messages || model("messages", schema)
export default Messages