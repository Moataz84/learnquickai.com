import { NextResponse } from "next/server"
import Users from "@/utils/Models/Users"
import { authConfig } from "@/utils/auth"
import { getServerSession } from "next-auth"
import connectDB from "@/utils/db"

export async function middleware(request) {
  const base = new URL(request.url)
  const headers = new Headers(request.headers)
  headers.set("x-current-path", request.nextUrl.pathname)
  if (request.headers.get("next-action")) {
    headers.set('content-type', 'text/x-component')
  }

  if (request.method === "POST" || base.pathname.includes("/api/")) {
    if (request.headers.get("sec-fetch-site") !== "same-origin") 
      return NextResponse.json({msg: "Forbiden"}, {status: 403, headers})
    return NextResponse.next({headers})
  }

  const session = await getServerSession(authConfig)
  const id = session?.user?.id
  await connectDB()
  const user = await Users.findOne({_id: id})

  if (!session) {
    if (["/dashboard", "/notes", "/account", "/auth/verify", "/auth/resend-code"].find(l => base.pathname.includes(l))) {
      return NextResponse.redirect(`${base.origin}/auth/login`, {headers})
    }
    return NextResponse.next({headers})
  }

  if (!user?.verified) {
    if (["/auth/verify", "/auth/resend-code"].includes(base.pathname)) {
      return NextResponse.next({headers})
    }
    return NextResponse.redirect(`${base.origin}/auth/verify`, {headers})
  }
  
  if (base.pathname.includes("/auth/")) {
    return NextResponse.redirect(`${base.origin}/dashboard`, {headers})
  }

  return NextResponse.next({headers})
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