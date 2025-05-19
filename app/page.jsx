import Link from "next/link"
import Menu from "@/components/Menu"
import { FaClone, FaGamepad, FaLongArrowAltRight, FaYoutube } from "react-icons/fa"
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaRobot } from "react-icons/fa6";

export default function HomePage() {
  return (
    <>
      <Menu />
      <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-center text-center lg:text-left py-28 px-6 sm:px-14 gap-15">
          {/* Text Content */}
          <div className="lg:w">
            <h1
              className="text-6xl font-extrabold mb-6 text-center leading-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            >
              Learn at the <span className="text-blue-600 dark:text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]">Speed of Light</span>⚡
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-center">
              Supercharge your learning with powerful tools like smart notes, flashcards, quizzes, and more.
            </p>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-200 cursor-pointer block mx-auto w-fit"
            >
              Get Started
            </Link>
          </div>

          {/* Video Player 
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              <video
                src="/demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-cover"
              />
            </div>
          </div>*/}
        </section>


        {/* Testimonials 
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
                  quote: "It's like having a tutor in my pocket. The chatbot is incredibly smart.",
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
        </section>*/}

{/* Features Section */}
<section className="py-20 px-6 bg-white dark:bg-gray-900 text-center">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold mb-10">Why Choose LearnQuick AI?</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
      {[
        {
          title: "Instant Video Notes",
          description: "Upload a video or paste a YouTube link and get smart notes in seconds.",
          icons: [<FaYoutube size={50} />, <FaLongArrowAltRight  size={50} />, <IoDocumentTextSharp size={45} />]
        },
        {
          title: "Smart Flashcards",
          description: "Auto-generate flashcards that actually help you remember things.",
          icons: [<FaClone size={50} /> ]
        },
        {
          title: "AI Chat Assistant",
          description: "Ask follow-up questions and get clarifications instantly.",
          icons: [<FaRobot size={55} /> ]
        },
        {
          title: "Gamified Quizzes",
          description: "Make learning fun with competitive, timed quizzes and leaderboards that keep you engaged.",
          icons: [<FaGamepad size={50} />]
        }
      ].map((item, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-400 ">
          <h3 className="text-xl font-semibold mb-2">
            {item.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
          <div className="flex gap-2 mx-auto w-fit mt-3 align-center">
            {item.icons.map((icon, i) => (
              <span key={i} className="text-blue-600 dark:text-blue-400">{icon}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 dark:text-gray-400 py-6 px-4 border-t border-gray-200 dark:border-gray-700">
          <p>
            © {new Date().getFullYear()} LearnQuick AI —{" "}
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