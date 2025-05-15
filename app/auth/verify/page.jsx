"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { verifyCode } from "@/actions/auth/verify-code"

export default function VerifyCode() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleVerify(e) {
    e.preventDefault()
    setError("")
    if (!code) {
      return setError("Verification code is required")
    }

    setLoading(true)
    const data = await verifyCode(code)
    setLoading(false)

    if (data !== "success") {
      return setError(data)
    }

    router.push("/account")
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="w-sm mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300 mb-10 relative overflow-hidden">
        {loading && <div className="loading"></div>}

        <h2 className="text-2xl font-bold text-center text-black dark:text-white pt-2">
          Verify Email
        </h2>

        <div>
          <Label htmlFor="code" className="mb-2">
            Enter Verification Code
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="123456"
            onChange={(e) => setCode(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <Button className="w-full cursor-pointer" onClick={handleVerify}>
          Verify
        </Button>

        <span className="text-sm">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Login
          </span>
        </span>

        <p className="text-sm text-red-700 mt-3 h-5">{error || ""}</p>
      </div>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Didn&apos;t get the code?{" "}
        <Link className="underline" href="/auth/resend-code">
          Resend
        </Link>
      </span>
    </div>
  )
}
