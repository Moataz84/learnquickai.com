"use server"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import { compare, hash } from "bcrypt"
import { getServerSession } from "next-auth"

export default async function changePassword(currentPassword, newPassword) {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const user = await Users.findOne({_id: id})
  const result = await compare(currentPassword, user.password)
  if (!result) {
    return "Current password is incorrect"
  }
  const hashedPassword = await hash(newPassword, 10)
  await Users.findOneAndUpdate({_id: id}, {$set: {password: hashedPassword}})
  return "Password updated successfully"
}