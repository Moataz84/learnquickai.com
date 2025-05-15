"use server"

import { authConfig } from "@/utils/auth"
import Messages from "@/utils/Models/Messages"
import { getServerSession } from "next-auth"

export default async function getMessages(promptId) {
    const session = await getServerSession(authConfig)
    const messages = (await Messages.find({promptId, userId: session?.user?.id})).map(m => ({role: m.role, content: m.content}))
    return messages
}