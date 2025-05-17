"use client"
import { generateQuiz } from "@/actions/prompts/generateQuestions"
import { useState } from "react"
import { FaRegQuestionCircle, FaClipboardList, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"

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

export default function QuizClient({ promptId, questions }) {
  const [quizData, setQuizData] = useState(questions)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [quizStatus, setQuizStatus] = useState(null)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  async function handleGenerateQuiz() {
    setIsLoading(true)
    try {
      const generatedQuiz = await generateQuiz(promptId)
      setQuizData(generatedQuiz)
      setQuizStatus(null)
      setCurrentQuestionIndex(0)
      setCorrectAnswersCount(0)
      setUserAnswers({})
    } catch (error) {
      console.error("Quiz generation failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartQuiz = () => {
    if (!quizData) return
    setQuizData(shuffleQuestions(quizData))
    setIsQuizStarted(true)
    setUserAnswers({})
    setCorrectAnswersCount(0)
  }

  const handleAnswer = (answerId) => {
    const correct = answerId === quizData[currentQuestionIndex].answer

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: { answer: answerId, correct }
    }

    setUserAnswers(updatedAnswers)

    const newCorrectCount = Object.values(updatedAnswers).filter((entry) => entry.correct).length
    setCorrectAnswersCount(newCorrectCount)
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
    setQuizStatus(null)
    setCorrectAnswersCount(0)
    setIsQuizStarted(false)
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-12 bg-white dark:bg-gray-900 text-black dark:text-white space-y-6 items-center">
      {!isQuizStarted ? (
        <>
          <h2 className="text-3xl font-bold text-center mt-8">
            Generate Your Quiz or Start Interactive Quiz
          </h2>
          <div className="flex space-x-6 mt-6 justify-center">
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg flex items-center hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaClipboardList className="mr-2" />
              {isLoading ? "Generating..." : "Generate Quiz"}
            </button>
            <button
              onClick={handleStartQuiz}
              disabled={!quizData || isLoading}
              className={`bg-green-600 text-white px-8 py-4 rounded-lg flex items-center hover:bg-green-700 transition cursor-pointer ${
                !quizData || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaRegQuestionCircle className="mr-2" /> Start Interactive Quiz
            </button>
          </div>
          {isLoading && (
            <div className="text-lg mt-4">Loading quiz questions...</div>
          )}
        </>
      ) : (
        <>
          {quizStatus ? (
            <div className="text-lg font-semibold text-green-500">
              {quizStatus}
              <div className="mt-4">
                Your total score is: {correctAnswersCount} / {quizData.length}
              </div>
              <button
                onClick={handleRetryQuiz}
                className="mt-6 bg-yellow-500 text-white px-8 py-4 rounded-lg hover:bg-yellow-600 transition cursor-pointer"
              >
                Retry Quiz
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  Question {currentQuestionIndex + 1} / {quizData.length}
                </h2>
                <button
                  onClick={() => setQuizStatus("Completed! 🎉")}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition cursor-pointer"
                >
                  End Quiz
                </button>
              </div>
              <div className="text-xl mt-4 h-16 overflow-hidden">
                <MathJaxContext>
                  <MathJax inline dynamic>
                    <ReactMarkdown>{quizData[currentQuestionIndex].question}</ReactMarkdown>
                  </MathJax>
                </MathJaxContext>
              </div>
              <div className="space-y-4 mt-6">
                {quizData[currentQuestionIndex].options.map((option) => {
                  const answer = userAnswers[currentQuestionIndex]
                  const isCorrect = answer?.correct && option.id === quizData[currentQuestionIndex].answer
                  const isWrong = answer && !answer.correct && option.id === answer.answer

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className={`bg-gray-200 dark:bg-gray-700 text-black dark:text-white w-full py-4 text-lg rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer ${
                        isCorrect ? "border-4 border-green-500 animate-pulse" : ""
                      } ${isWrong ? "border-4 border-red-500 animate-pulse" : ""}`}
                      style={{ minHeight: "60px" }}
                    >
                      <MathJaxContext>
                        <MathJax inline dynamic>
                          <ReactMarkdown>{option.text}</ReactMarkdown>
                        </MathJax>
                      </MathJaxContext>
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 flex justify-between space-x-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 cursor-pointer flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex + 1 >= quizData.length}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center"
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}