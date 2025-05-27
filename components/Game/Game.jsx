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

export default function KahootGame({ gameId, socket, interval }) {
  const { questions:q } = useQuestions()
  const [questions, setQuestions] = useState(q)
  const session = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(questions[Math.floor(Math.random() * questions.length)])
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

  function getRandomQuestion() {
    const previousQuestion = currentQuestion
    let newQuestion 
    do {
      newQuestion = questions[Math.floor(Math.random() * questions.length)]
    } while (newQuestion.answer === previousQuestion?.answer && questions.length > 1)
    return {...newQuestion, options: shuffle(newQuestion.options)}
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
    <div className="w-2xl p-8 rounded-xl shadow-md bg-white dark:bg-gray-900 text-black dark:text-white space-y-6 animate-fade-in">
      {/* Question */}
      <h2 className="text-2xl font-bold min-h-[56px] animate-fade-in duration-500">
        <MathRender>{currentQuestion?.question}</MathRender>
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {currentQuestion?.options.map((option) => {
          const isSelected = selected?.id === option.id
          const isCorrect = option.id === currentQuestion?.answer
          const isWrong = isSelected && !isCorrect
        
          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={clsx(
                "w-full py-4 px-2 text-lg rounded-lg transition-all duration-300 ease-in-out transform",
                "text-white cursor-pointer",
                {
                  "bg-green-500 animate-pulse scale-105": isSelected && isCorrect,
                  "bg-red-500 animate-pulse scale-105": isWrong,
                  "bg-blue-500 hover:bg-blue-600 hover:scale-[1.01]": selected === null,
                  "bg-gray-400 cursor-not-allowed": selected !== null && !isSelected
                }
              )}
              style={{ minHeight: "60px" }}
            >
              <MathRender>{option.text}</MathRender>
            </button>
          )
        })}
      </div>
      
      {/* Auto-advance Info */}
      <div className="text-gray-400 text-sm animate-fade-in delay-500">
        Auto-advances every {interval} seconds
      </div>
    </div>
    )
}
