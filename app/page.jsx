import Link from "next/link"
import Menu from "@/components/Menu"

export default function HomePage() {
  return (
    <>
      <Menu />
      <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 px-6 sm:px-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Learn at the <span className="text-blue-600 dark:text-blue-400">speed of light</span> 🚀
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
            Supercharge your learning with powerful tools like smart notes, flashcards, quizzes, and more.
          </p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-200 cursor-pointer">
            Get Started
          </Link>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">What learners are saying</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  name: "Alex T.",
                  quote: "This tool helped me ace my exams! The flashcards and quizzes are super helpful.",
                },
                {
                  name: "Jamie L.",
                  quote: "Turning videos into notes saved me so much time. Absolutely love it!",
                },
                {
                  name: "Morgan K.",
                  quote: "It’s like having a tutor in my pocket. The chatbot is incredibly smart.",
                },
                {
                  name: "Riley M.",
                  quote: "Highly recommend this to anyone who learns better visually and interactively.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                >
                  <p className="text-gray-800 dark:text-gray-200 italic">“{t.quote}”</p>
                  <p className="mt-4 font-semibold text-blue-600 dark:text-blue-400">– {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 dark:text-gray-400 py-6 px-4 border-t border-gray-200 dark:border-gray-700">
          <p>
            © {new Date().getFullYear()} LearnQuickAI —{" "}
            <Link href="/terms-of-service" className="underline hover:text-blue-600">
              Terms of Service
            </Link>
            {" | "}
            <Link href="/privacy-policy" className="underline hover:text-blue-600">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </main>
    </>
  )
}