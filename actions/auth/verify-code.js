"use server"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import { getServerSession } from "next-auth"
import sendEmail from "@/actions/sendEmail"
import { randomBytes } from "crypto"

export async function verifyCode(code) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const user = await Users.findOne({_id: id})
  if (user.code !== code) {
    return "Code entered is incorrect"
  }
  await Users.findOneAndUpdate({_id: id}, {$set: {verified: true}})
  return "success"
}

export async function resendCode(email) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const code = randomBytes(3).toString("hex")
  const check = await Users.findOne({email})

  if (!check || check?.id === id) {
    await Users.findOneAndUpdate({_id: id}, {$set: {email, code}})
    sendEmail(email, "Verify Email", `Your verification code is ${code}.`)
    return "success"
  }

  return "Email address exists"
}