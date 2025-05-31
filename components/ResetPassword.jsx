"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/actions/auth/forgot-password"

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  async function resetPasswordClient(e) {
    e.preventDefault()
    setError("")
    if (!password || !repeatPassword) {
      return setError("All fields are required")
    }

    if (password.length < 8 || /\s/.test(password)) {
      return setError("Password must be at least 8 characters and can not contain spaces")
    }

    if (password !== repeatPassword) {
      return setError("Passwords must be the same")
    }
    setLoading(true)
    await resetPassword(searchParams.get("email"), password)
    setLoading(false)
    router.push("/auth/login")
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
  <div className="w-sm mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300 mb-10 relative overflow-hidden">
    {loading && <div className="loading"></div>}

    <h2 className="text-2xl font-bold text-center text-black dark:text-white pt-2">
      Forgot Password
    </h2>

    {/* New Password */}
    <div>
      <Label htmlFor="password" className="mb-2">New Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter your password"
        onChange={e => setPassword(e.target.value)}
        onFocus={() => setError("")}
      />
    </div>

    {/* Repeat New Password */}
    <div>
      <Label htmlFor="repeat-password" className="mb-2">Repeat New Password</Label>
      <Input
        id="repeat-password"
        type="password"
        placeholder="Enter your password again"
        onChange={e => setRepeatPassword(e.target.value)}
        onFocus={() => setError("")}
      />
    </div>

    {/* Submit Button */}
    <Button className="w-full cursor-pointer" onClick={resetPasswordClient}>
      Submit
    </Button>

    <p className="text-sm text-red-700 mt-3 h-8">{error || ""}</p>
  </div>
</div>

  )
}