import { Schema, models, model } from "mongoose"

const schema = new Schema({
  userId: String,
  promptId: String,
  dateTime: String,
  seconds: String,
  paidFor: Boolean
})

const Usages = models.usages || model("usages", schema)
export default Usages