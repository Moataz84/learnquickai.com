"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { resendCode } from "@/actions/auth/verify-code"

export default function AddEmail() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleResendCode(e) {
    e.preventDefault()
    setError("")

    if (!email) {
      return setError("Email is required")
    }

    setLoading(true)
    const data = await resendCode(email)
    setLoading(false)

    if (data !== "success") {
      return setError(data)
    }

    router.push("/auth/verify")
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="w-sm mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300 mb-10 relative overflow-hidden">
        {loading && <div className="loading"></div>}

        <h2 className="text-2xl font-bold text-center text-black dark:text-white pt-2">
          Resend Verification Code
        </h2>

        <div>
          <Label htmlFor="email" className="mb-2">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <Button className="w-full cursor-pointer" onClick={handleResendCode}>
          Submit
        </Button>

        <span className="text-sm">
          Want to switch accounts?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Login
          </span>
        </span>

        <p className="text-sm text-red-700 mt-3 h-5">{error || ""}</p>
      </div>

      {/* Optional: Add this back if needed */}
      {/* <span className="text-sm text-gray-600 dark:text-gray-400">
        Have a verification code?{" "}
        <Link className="underline" href="/auth/verify">
          Verify
        </Link>
      </span> */}
    </div>
  )
}
