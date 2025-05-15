import { Schema, models, model } from "mongoose"

const schema = new Schema({
  userId: String,
  promptId: String,
  title: String,
  summary: String,
  type: String,
  public: Boolean
})

const Prompts = models.prompts || model("prompts", schema)
export default Prompts