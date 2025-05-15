"use server"
import Users from "@/utils/Models/Users"
import sendEmail from "@/actions/sendEmail"
import { hash } from "bcrypt"
import { randomBytes } from "crypto"
import { headers } from "next/headers"

async function sendLink(email) {
  const user = await Users.findOne({email, credentials: true})
  if (!user) return "This account doesn't exist"
  const forgotPasswordCode = randomBytes(32).toString("hex")
  await Users.findOneAndUpdate({email}, {$set: {forgotPasswordCode}})
  sendEmail(email, "Forgot Password", `This is a link to reset your password: ${headers().get("referer")}?email=${email}&id=${forgotPasswordCode}.`)
  return "A link to reset your password has been sent to your email."  
}

async function resetPassword(email, password) {
  const hashedPassword = await hash(password, 10)
  await Users.findOneAndUpdate({email}, {$set: {password: hashedPassword}})
}

export { sendLink, resetPassword }