"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendLink } from "@/actions/auth/forgot-password"
import Link from "next/link"

export default function ForgotPasswordEmail() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  async function sendLinkClient(e) {
    e.preventDefault()
    setError("")
    if (!email) {
      setError("All fields are required")
      return
    }
    setLoading(true)
    const data = await sendLink(email.toLowerCase().replace(/\s/g, ""))
    setLoading(false)
    setError(data)
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
  <div className="w-sm mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300 mb-10 relative overflow-hidden">
    {loading && <div className="loading"></div>}

    <h2 className="text-2xl font-bold text-center text-black dark:text-white pt-2">Forgot Password</h2>

    {/* Email Input */}
    <div>
      <Label htmlFor="email" className="mb-2">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setError("")}
      />
    </div>

    {/* Submit Button */}
    <Button className="w-full cursor-pointer" onClick={sendLinkClient}>Submit</Button>

    <span className="text-sm text-gray-700 dark:text-gray-400">
      Already have an account?{" "}
      <Link href="/auth/login" className="underline">
        Login
      </Link>
    </span>

    <p className="text-sm text-red-700 mt-3 h-8">{error || ""}</p>
  </div>
</div>

  )
}