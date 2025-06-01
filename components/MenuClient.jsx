"use client"
import { useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Logo from "@/components/Logo"

const setCookie = (name, value, days) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

export default function MenuClient({ isLightMode, user }) {
  const [lightMode, setLightMode] = useState(isLightMode)

  const togglelightMode = () => {
    setLightMode((prev) => {
      const newlightMode = !prev
      setCookie("lightMode", newlightMode, 365)
      document.documentElement.classList.toggle("dark", !newlightMode)
      return newlightMode
    })
  }

  return (
    <header className="z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300 sticky top-0">
      {/* Left: Logo (hide text on mobile) */}
      <div className="flex items-center w-auto">
        <div className="block sm:hidden">
          <Logo isLightMode={lightMode} minimal />
        </div>
        <div className="hidden sm:block">
          <Logo isLightMode={lightMode} />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button
          onClick={togglelightMode}
          className="p-0 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 outline-none cursor-pointer hidden min-[355px]:block"
        >
          {!lightMode ? <FaSun size={14} /> : <FaMoon size={14} />}
        </Button>

        {/* Suggestions Link - hidden on small screens */}
        <Link
          href="/suggestions"
          className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
        >
          Suggestions
        </Link>

        {/* Right: Auth Button */}
        <Link href={user ? "/account" : "/auth/signup"}>
          <Button className="cursor-pointer text-sm">
            {user ? "My Account" : "Get Started"}
          </Button>
        </Link>
      </nav>
    </header>
  )
}
