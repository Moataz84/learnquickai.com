"use client"
import { useEffect, useState, useRef } from "react"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { useQuestions } from "@/contexts/QuestionsContext"
import MathRender from "@/components/MathRender"

function shuffle(array) {
  const newArray = [...array]
  const length = newArray.length

  for (let start = 0; start < length; start++) {
    const randomPosition = Math.floor((newArray.length - start) * Math.random())
    const randomItem = newArray.splice(randomPosition, 1)
    newArray.push(...randomItem)
  }

  return newArray
}

function shuffleQuestions(questions) {
  return shuffle(questions).map(q => ({ ...q, options: shuffle(q.options) }))
}

export default function KahootGame({ gameId, socket, interval }) {
  const { questions:q } = useQuestions()
  const [questions, setQuestions] = useState(shuffleQuestions(q))
  const session = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion())
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const timerRef = useRef(null)

  const correctSound = useRef(null)
  const incorrectSound = useRef(null)

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3")
    incorrectSound.current = new Audio("/sounds/incorrect.mp3")
  }, []);

  function playSound(type) {
    const audio = type === "correct" ? correctSound.current : incorrectSound.current
    audio.currentTime = 0
    audio.play()
  }

  function getRandomQuestion(previousQuestion) {
    let newQuestion
    do {
      newQuestion = questions[Math.floor(Math.random() * questions.length)]
    } while (newQuestion === previousQuestion && questions.length > 1)
    return newQuestion
  }

  function nextQuestion() {
    setSelected(null)
    setCurrentQuestion(getRandomQuestion())
    startTimer()
  }

  function startTimer() {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      nextQuestion()
    }, interval * 1000)
  }

  function handleAnswer(option) {
    if (selected) return
    setSelected(option)
  
    const isCorrect = option.id === currentQuestion.answer
    const newScore = isCorrect ? score + 1 : score
    playSound(isCorrect? "correct" : "incorrect")

    if (isCorrect) {
      setScore(newScore)
    }
  
    socket.emit("answer-selected", {
      gameId,
      user: {
        id: session?.data?.user.id,
        name: session?.data?.user?.name,
        score: newScore,
      },
    })
  
    clearTimeout(timerRef.current)
    setTimeout(() => {
      nextQuestion()
    }, 800) // short delay to show feedback
  }

  useEffect(() => {
    startTimer()
    return () => clearTimeout(timerRef.current)
  }, [currentQuestion])

  return (
    <div className="w-full max-w-2xl p-8 rounded-xl shadow-md bg-white dark:bg-gray-900 text-black dark:text-white space-y-6">
  <h2 className="text-2xl font-bold min-h-[56px]">
    <MathRender>{currentQuestion?.question}</MathRender>
  </h2>

  <div className="space-y-4">
    {currentQuestion?.options.map((option) => {
      return (
        <button
          key={option.id}
          onClick={() => handleAnswer(option)}
          disabled={selected !== null}
          className={clsx(
            "w-full py-4 px-2 text-lg rounded-lg transition cursor-pointer",
            "text-white",
            {
              "bg-green-500 animate-pulse": selected?.id === option.id && option.id === currentQuestion?.answer,
              "bg-red-500 animate-pulse": selected?.id === option.id && option.id !== currentQuestion?.answer,
              "bg-blue-500 hover:bg-blue-600": selected === null,
              "bg-gray-400 cursor-not-allowed": selected !== null && selected?.id !== option.id
            }
          )}
          style={{ minHeight: "60px" }}
        >
          <MathRender>{option.text}</MathRender>
        </button>
      )
    })}
  </div>
  <div className="text-gray-400 text-sm">Auto-advances every {interval} seconds</div>
</div>

    )
}
