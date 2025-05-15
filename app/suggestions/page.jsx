"use client"
import { useState } from "react"
import sendEmail from "@/actions/sendEmail"

export default function SuggestionsPage() {
  const [form, setForm] = useState({name: "", email: "", message: ""})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = e => {
    const {name, value} = e.target
    setForm(prev => ({ ...prev, [name]: value}))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form?.name || !form?.email || !form?.message) {
      setError("All fields are required")
      return
    }
    sendEmail("support@learnquickai.com", "Suggestion", `${form.name}\n${form.email}\n${form.message}`)
    setSubmitted(true)
  }

  return (
    <main className="dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">💡 Suggestions</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          We'd love to hear your thoughts, feedback, or any cool ideas you have to improve our platform!
        </p>
        {submitted ? (
          <div className="p-4 border border-green-500 rounded-md bg-green-100 dark:bg-green-800">
            Thank you for your suggestion!
          </div>
        ) : (
          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium" htmlFor="name">Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                onFocus={() => setError("")}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                onFocus={() => setError("")}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="message">Message</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                id="message"
                name="message"
                rows={4}
                required
                style={{ minHeight: "120px", maxHeight: "300px" }}
                value={form.message}
                onChange={handleChange}
                onFocus={() => setError("")}
              ></textarea>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer"
              onClick={handleSubmit}
            >
              Submit Suggestion
            </button>
          </form>
        )}
      <p className="text-sm text-red-700 mt-3 h-5">{error !== ""? error: ""}</p>
      </div>
    </main>
  )
}