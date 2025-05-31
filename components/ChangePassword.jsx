"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import changePassword from "@/actions/auth/change-password"

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState("")

  async function changePasswordClient(e) {
    e.preventDefault()
    setError("")
    if (!currentPassword || !password || !repeatPassword) {
      return setError("All fields are required")
    }

    if (password.length < 8 || /\s/.test(password)) {
      return setError("Password must be at least 8 characters and can not contain spaces")
    }

    if (password !== repeatPassword) {
      return setError("Passwords must be the same")
    }
    const msg = await changePassword(currentPassword, password)
    setError(msg)
  }

  return (
    <div className="border border-border p-4 rounded-lg text-left bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Change Password</h2>
      <form className="space-y-4 w-full max-w-sm">
        <div>
          <Label htmlFor="current-password" className="mb-2">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="Enter your current password"
            onChange={e => setCurrentPassword(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <div>
          <Label htmlFor="password" className="mb-2">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <div>
          <Label htmlFor="repeat-password" className="mb-2">Repeat New Password</Label>
          <Input
            id="repeat-password"
            type="password"
            placeholder="Enter your new password again"
            onChange={e => setRepeatPassword(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <Button type="submit" className="mt-2 w-full sm:w-auto cursor-pointer" onClick={changePasswordClient}>
          Update Password
        </Button>
        <p className="text-sm text-red-700">{error || ""}</p>
      </form>
    </div>
  )
}