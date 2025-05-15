"use server"
import { authConfig } from "@/utils/auth"
import Users from "@/utils/Models/Users"
import { getServerSession } from "next-auth"

export default async function getUser() {
  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  const user = await Users.findOne({_id: id})
  if (!user) return null
  return {
    name: user.name,
    id: user.id,
    email: user.email,
    active: user.active
  }
}