import { Schema, models, model } from "mongoose"

const schema = new Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean,
  code: String,
  forgotPasswordCode: String,
  active: Boolean,
  credentials: Boolean,
  createdAt: String
})

const Users = models.users || model("users", schema)
export default Users