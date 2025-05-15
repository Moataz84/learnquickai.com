"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import signup from "@/actions/auth/signup"
import { signIn } from "next-auth/react"

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function signupClient(e) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      return setError("All fields are required")
    }

    if (password.length < 8 || /\s/.test(password)) {
      return setError("Password must be at least 8 characters and cannot contain spaces")
    }

    setLoading(true)

    const data = await signup(
      name,
      email.toLowerCase().replace(/\s/g, ""),
      password
    )

    setLoading(false)

    if (data !== "success") {
      return setError(data)
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    router.push("/account")
  }

  async function googleLogin(e) {
    e.preventDefault()
    await signIn("google", { redirect: false })
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="w-sm mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300 mb-10 relative overflow-hidden">
        {loading && <div className="loading"></div>}

        <h2 className="text-2xl font-bold text-center text-black dark:text-white pt-2">Sign Up</h2>

        <div>
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            onChange={e => setName(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

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

        <div>
          <Label htmlFor="password" className="mb-2">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setError("")}
          />
        </div>

        <Button className="w-full cursor-pointer" onClick={signupClient}>
          Sign Up
        </Button>

        <div className="flex items-center">
          <hr className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
          <span className="mx-4 uppercase text-sm">or continue with</span>
          <hr className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        </div>

        <Button
          onClick={googleLogin}
          className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          <FaGoogle className="h-5 w-5" />
          <span>Google</span>
        </Button>

        <span className="text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </span>

        <p className="text-sm text-red-700 mt-3 h-5">{error || ""}</p>
      </div>

      <span className="text-sm text-gray-600 dark:text-gray-400 px-4 text-center">
        By creating an account, you agree to our{" "}
        <Link className="underline" href="/terms-of-service">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className="underline" href="/privacy-policy">
          Privacy Policy
        </Link>.
      </span>
    </div>
  )
}
