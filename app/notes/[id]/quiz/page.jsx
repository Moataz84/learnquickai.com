"use client"
import { generateQuestions } from "@/actions/prompts/generateQuestions"
import { deleteQuestion } from "@/actions/prompts/generateQuestions"
import { useState, useEffect, useRef } from "react"
import { FaRegQuestionCircle, FaClipboardList } from "react-icons/fa"
import MathRender from "@/components/MathRender"
import { useQuestions } from "@/contexts/QuestionsContext"
import { usePrompt } from "@/contexts/PromptContext"
import { Button } from "@/components/ui/button"
import shuffle from "@/actions/shuffle"
import { useRouter } from "next/navigation"

function shuffleQuestions(questions) {
  return shuffle(questions).map(q => ({ ...q, options: shuffle(q.options) }))
}

export default function QuizPage() {
  const { prompt } = usePrompt()
  const { questions, setQuestions } = useQuestions()
  const [quizData, setQuizData] = useState(questions.length ? questions : null)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const correctSound = useRef(null)
  const incorrectSound = useRef(null)

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3")
    incorrectSound.current = new Audio("/sounds/incorrect.mp3")
  }, [])

  function playSound(type) {
    const audio = type === "correct" ? correctSound.current : incorrectSound.current
    audio.currentTime = 0
    audio.play()
  }

  useEffect(() => {
    if (questions.length > 0) {
      setQuizData(questions)
    }
  }, [questions])

  async function handleGenerateQuestions() {
    setIsLoading(true)
    try {
      const generatedQuiz = await generateQuestions(prompt.promptId)
      if (!generatedQuiz.length) {
        router.push("/pricing")
      }
      setQuestions(generatedQuiz)
      setQuizData(generatedQuiz)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
    } catch (error) {
      console.error("Quiz generation failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteQuestion(id) {
    try {
      await deleteQuestion(id)
      const updated = quizData.filter(q => q.id !== id)
      setQuestions(updated)
      setQuizData(updated)
      if (updated.length === 0) {
        setIsQuizStarted(false)
        setCurrentQuestionIndex(0)
      } else if (currentQuestionIndex >= updated.length) {
        setCurrentQuestionIndex(Math.max(0, updated.length - 1))
      }
    } catch (error) {
      console.error("Failed to delete question", error)
    }
  }

  const handleStartQuiz = () => {
    if (!quizData) return
    setQuizData(shuffleQuestions(quizData))
    setIsQuizStarted(true)
    setUserAnswers({})
  }

  const handleAnswer = (answerId) => {
    const correct = answerId === quizData[currentQuestionIndex].answer
    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: { answer: answerId, correct }
    }
    playSound(correct ? "correct" : "incorrect")
    setUserAnswers(updatedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex - 1 >= 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleRetryQuiz = () => {
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setIsQuizStarted(false)
  }

  return (
    <div className="flex flex-col min-h-screen w-full pt-26 md:pt-10 px-10 pb-10 bg-white dark:bg-gray-900 text-black dark:text-white space-y-6 items-center">
      {!isQuizStarted ? (
        <>
          <h2 className="text-3xl font-bold text-center mt-8">
            Generate Your Quiz or Start Interactive Quiz
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              className="cursor-pointer flex items-center gap-2"
              onClick={handleGenerateQuestions}
              disabled={isLoading}
            >
              <FaClipboardList />
              {isLoading ? "Generating..." : questions.length > 0? "Generate Additional Questions" : "Generate Flashcards"}
            </Button>
            <Button
              className="cursor-pointer flex items-center gap-2"
              onClick={handleStartQuiz}
              disabled={!quizData || isLoading}
            >
              <FaRegQuestionCircle />
              Start Quiz
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Question {currentQuestionIndex + 1} / {quizData.length}
            </h2>
            <Button
              variant="destructive"
              onClick={handleRetryQuiz}
              className="cursor-pointer"
            >
              End Quiz
            </Button>
          </div>

          <div className="text-xl mt-4 h-16 mb-6">
            <MathRender>{quizData[currentQuestionIndex].question}</MathRender>
          </div>

          <div className="space-y-4">
            {quizData[currentQuestionIndex].options.map((option) => {
              const answer = userAnswers[currentQuestionIndex]
              const isCorrect = answer?.correct && option.id === quizData[currentQuestionIndex].answer
              const isWrong = answer && !answer.correct && option.id === answer.answer
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`w-full py-4 px-2 text-lg rounded-lg transition cursor-pointer
                    ${isCorrect ? "border-4 border-green-500 animate-pulse" : ""}
                    ${isWrong ? "border-4 border-red-500 animate-pulse" : ""}
                    bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600`}
                >
                  <MathRender>{option.text}</MathRender>
                </button>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center justify-center gap-4 mt-8 max-w-3xl mx-auto">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <span className="text-gray-700 dark:text-gray-300 text-lg">
                {currentQuestionIndex + 1} / {quizData.length}
              </span>
              <Button
                className="cursor-pointer"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex + 1 >= quizData.length}
              >
                Next
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleDeleteQuestion(quizData[currentQuestionIndex].id)}
              >
                Delete Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}