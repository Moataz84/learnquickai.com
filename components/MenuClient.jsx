"use client"
import { useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const setCookie = (name, value, days) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

export default function MenuClient({ isDarkMode, user }) {
  const [darkMode, setDarkMode] = useState(isDarkMode)

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newDarkMode = !prev
      setCookie("darkMode", newDarkMode, 365)
      document.documentElement.classList.toggle("dark", newDarkMode)
      return newDarkMode
    })
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300 sticky top-0">
      {/* Left: Logo */}
      <Link href="/" className="text-lg font-semibold text-gray-800 dark:text-white">
        LearnQuickAI
      </Link>

      {/* Middle: Navigation Links */}
      <nav className="flex items-center gap-4 ml-auto">
        {/* Dark Mode Toggle */}
        <Button
          onClick={toggleDarkMode}
          className="p-0 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 outline-none cursor-pointer"
        >
          {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
        </Button>

        <Link
          href="/suggestions"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
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
