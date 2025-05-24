"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import MathRender from "@/components/MathRender"
import { generateQuiz } from "@/actions/prompts/generateQuestions"
import { useQuestions } from "@/contexts/QuestionsContext"
import { usePrompt } from "@/contexts/PromptContext"

export default function FlashcardPage() {
  const { prompt } = usePrompt()
  const { questions, setQuestions } = useQuestions()
  const [flashCards, setFlashCards] = useState(questions.map(q => ({question: q.question, answer: q.options.find(a => a.id === q.answer).text})))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState(flashCards[0] || null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    if (!questions?.length) return
    const formatted = questions.map(q => ({
      question: q.question,
      answer: q.options.find(a => a.id === q.answer)?.text
    }))
    setFlashCards(formatted)
    setCurrentIndex(0)
    setCurrentCard(formatted[0] || null)
  }, [questions])

  useEffect(() => {
    if (flashCards?.length > 0) {
      setCurrentCard(flashCards[currentIndex])
    } else {
      setCurrentCard(null)
    }
  }, [flashCards, currentIndex])

  const handleNext = () => {
    setIsNavigating(true)
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashCards.length)
      setIsNavigating(false)
    }, 200)
  }

  const handlePrev = () => {
    setIsNavigating(true)
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? flashCards.length - 1 : prev - 1))
      setIsNavigating(false)
    }, 200)
  }

  const handleGenerateFlashcards = async () => {
    setIsLoading(true)
    try {
      const generated = await generateQuiz(prompt.promptId)
      const formatted = generated.map((q) => ({
        question: q.question,
        answer: q.options.find((a) => a.id === q.answer).text,
      }))
      setFlashCards(formatted)
      setQuestions(generated)
      setCurrentIndex(0)
      setCurrentCard(formatted[0] || null)
    } catch (err) {
      console.error("Failed to generate flashcards", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 md:p-14 dark:bg-gray-900 w-full">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Flashcards
      </h1>

      {!flashCards?.length || !currentCard ? (
        <div className="flex flex-col items-center justify-center space-y-6">
          <button
            onClick={handleGenerateFlashcards}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg disabled:opacity-50 cursor-pointer "
          >
            {isLoading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      ) : (
        <>
          {/* Flip Card Container */}
          <div className="w-full h-[300px] perspective mb-4">
            <div
              className={`relative w-full h-full duration-500 transform-style preserve-3d ${
                isFlipped ? "rotate-x-180" : ""
              } cursor-pointer`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-xl text-2xl text-center px-12 text-gray-900 dark:text-white">
                <MathRender>{currentCard.question}</MathRender>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-x-180 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-xl text-2xl text-center px-12">
                <MathRender>{currentCard.answer}</MathRender>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Click the card to flip
          </p>

          <Separator className="my-4 w-full" />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={handlePrev} className="cursor-pointer" disabled={isNavigating}>
              Previous
            </Button>
            <span className="text-gray-700 dark:text-gray-300 text-lg">
              {currentIndex + 1} / {flashCards.length}
            </span>
            <Button className="cursor-pointer" onClick={handleNext} disabled={isNavigating}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}