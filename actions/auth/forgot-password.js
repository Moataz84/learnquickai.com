"use server"
import Users from "@/utils/Models/Users"
import sendEmail from "@/actions/sendEmail"
import { hash } from "bcrypt"
import { randomBytes } from "crypto"

export async function sendLink(email) {
  const user = await Users.findOne({email, credentials: true})
  if (!user) return "This account doesn't exist"
  const forgotPasswordCode = randomBytes(32).toString("hex")
  await Users.findOneAndUpdate({email}, {$set: {forgotPasswordCode}})
  sendEmail(email, "Forgot Password", `This is a link to reset your password: ${process.env.NEXT_PUBLIC_ORIGIN}/auth/forgot-password?email=${email}&id=${forgotPasswordCode}.`)
  return "A link to reset your password has been sent to your email."  
}

export async function resetPassword(email, password) {
  const hashedPassword = await hash(password, 10)
  await Users.findOneAndUpdate({email}, {$set: {password: hashedPassword}})
}