"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FaClone, FaGamepad, FaLongArrowAltRight, FaYoutube } from "react-icons/fa"
import { IoDocumentTextSharp } from "react-icons/io5"
import { FaRobot } from "react-icons/fa6"

export default function LandingPage() {
  const features = [
    {
      title: "Instant Video Notes",
      description: "Upload a video or paste a YouTube link and get smart notes in seconds.",
      icons: [<FaYoutube size={50} />, <FaLongArrowAltRight size={50} />, <IoDocumentTextSharp size={45} />]
    },
    {
      title: "Smart Flashcards",
      description: "Auto-generate flashcards that actually help you remember things.",
      icons: [<FaClone size={50} />]
    },
    {
      title: "AI Chat Assistant",
      description: "Ask follow-up questions and get clarifications instantly.",
      icons: [<FaRobot size={55} />]
    },
    {
      title: "Gamified Quizzes",
      description: "Make learning fun with competitive, timed quizzes and leaderboards that keep you engaged.",
      icons: [<FaGamepad size={50} />]
    }
  ]

  const testimonials = [
    {
      name: "Saad K.",
      quote: "I’m in my first year of Social Sciences at McMaster, and LearnQuick AI has honestly been a lifesaver. It helps me keep up with lectures, study faster, and stress way less—I use it all the time.",
      major: "Social Science",
      university: "McMaster",
      logo: "/logos/mac.png"
    },
    {
      name: "",
      quote: "UofT can be overwhelming, especially in Life Sci, but LearnQuickAI helps me stay on top of everything. I use it to summarize lecture recordings and make flashcards—it saves so much time.",
      major: "Life Sciences Student",
      university: "University of Toronto",
      logo: "/logos/uoft.png"
    },
    {
      name: "",
      quote: "I’m in Health Sci at Mac, and LearnQuickAI has seriously made studying so much easier. It breaks down lectures into bite-sized pieces, and I use it to prep for almost every quiz or test.",
      major: "First-Year Health Sciences Student",
      university: "McMaster University",
      logo: "/logos/mac.png"
    },
    {
      name: "",
      quote: "Between lectures, labs, and side projects, LearnQuickAI helps me keep up without burning out. I just drop in a video and it gives me clean notes and questions to review with.",
      major: "Computer Science Student",
      university: "University of Waterloo",
      logo: "/logos/waterloo.png"
    },
    {
      name: "",
      quote: "Waterloo’s workload is no joke, but LearnQuickAI makes it manageable. I use it to break down lecture vids and get the key points fast—makes revision way more efficient.",
      major: "Mechatronics Engineering Student",
      university: "University of Waterloo",
      logo: "/logos/waterloo.png"
    },
    {
      name: "",
      quote: "LearnQuickAI is literally part of my daily routine now. I use it to prep for labs, review lectures, and test myself with auto-generated quizzes. It’s everything I needed in one app.",
      major: "Medical Sciences Student",
      university: "Western University",
      logo: "/logos/western.png"
    }
  ]

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <section className="w-full max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row justify-between items-start gap-12 py-20 px-6 sm:px-10 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="w-full lg:w-1/2 space-y-8 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Learn at the <span className="text-blue-600 dark:text-blue-400">Speed of Light</span>⚡
          </h1>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-md transition duration-200 inline-block w-fit mx-auto lg:mx-0"
          >
            Get Started
          </Link>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Master topics with notes, quizzes, and flashcards.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.6)] border-2 border-blue-400">
            <video
              src="/demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What students are saying</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: false, amount: 0.4 }}
                key={i}
                className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition hover:shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(0.5, Math.ceil((i+ 1) / 2) * 0.2) }}
                  viewport={{ once: false }}
                  className="flex items-center gap-4 mb-4"
                >
                  <img
                    src={t.logo}
                    alt={`${t.university} logo`}
                    className="w-12 h-12"
                  />
                  <div>
                    {/*<p className="font-semibold text-blue-600 dark:text-blue-400">{t.name}</p>*/}
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.major} at {t.university}</p>
                  </div>
                </motion.div>
                <p className="text-gray-800 dark:text-gray-200 italic">“{t.quote}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-10 md:px-16 bg-white dark:bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12"
          >
            Why Choose LearnQuick AI?
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.ceil((i+ 1) / 2) * 0.2, duration: 0.6 }}
                viewport={{ once: false }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                <div className="flex gap-2 mx-auto w-fit mt-3 align-center">
                  {item.icons.map((icon, i) => (
                    <span key={i} className="text-blue-600 dark:text-blue-400">{icon}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-600 dark:text-gray-400 py-6 px-4 border-t border-gray-200 dark:border-gray-700">
        <p>
          © {new Date().getFullYear()} LearnQuick AI —{' '}
          <Link href="/terms-of-service" className="underline hover:text-blue-600">
            Terms of Service
          </Link>{' '}
          |{' '}
          <Link href="/privacy-policy" className="underline hover:text-blue-600">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </main>
  )
}