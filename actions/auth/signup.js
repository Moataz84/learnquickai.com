"use server"
import { hash } from "bcrypt"
import Users from "@/utils/Models/Users"
import { randomBytes } from "crypto"
import sendEmail from "@/actions/sendEmail"

export default async function signup(name, email, password) {
  
  const check = await Users.findOne({email})
  if (check) return "This email address is already in use"

  const hashedPassword = await hash(password, 10)
  const forgotPasswordCode = randomBytes(32).toString("hex")
  const code = randomBytes(3).toString("hex")
  
  await new Users({
    name, 
    email, 
    password: hashedPassword,
    forgotPasswordCode,
    verified: false,
    code,
    active: false,
    credentials: true,
    createdAt: Date.now().toString()
  }).save()
  
  sendEmail(email, "Verify Email", `Your verification code is ${code}.`)
  return "success"
}