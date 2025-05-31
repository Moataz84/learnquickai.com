import { NextResponse } from "next/server"
import Users from "@/utils/Models/Users"
import { authConfig } from "@/utils/auth"
import { getServerSession } from "next-auth"
import connectDB from "@/utils/db"

export async function middleware(request) {
  const base = new URL(request.url)

  if (request.method === "POST" || base.pathname.includes("/api/")) {
    if (request.headers.get("sec-fetch-site") !== "same-origin") 
      return NextResponse.json({msg: "Forbiden"}, {status: 403})
    return NextResponse.next()
  }

  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  await connectDB()
  const user = await Users.findOne({_id: id})

  if (!session) {
    if (["/dashboard", "/notes", "/account", "/auth/verify", "/auth/resend-code"].find(l => base.pathname.includes(l))) {
      return NextResponse.redirect(`${base.origin}/auth/login`)
    }
    return NextResponse.next()
  }

  if (!user?.verified) {
    if (["/auth/verify", "/auth/resend-code"].includes(base.pathname)) {
      return NextResponse.next()
    }
    return NextResponse.redirect(`${base.origin}/auth/verify`)
  }
  
  if (base.pathname.includes("/auth/")) {
    return NextResponse.redirect(`${base.origin}/dashboard`)
  }
}

export const config = {
  matcher: [
    "/",
    "/account",
    "/auth/:path*",
    "/dashboard",
    "/pricing",
    "/notes/:path*",
    "/api/stream"
  ], 
  runtime: "nodejs"
}