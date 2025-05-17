"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"
import { generateQuiz } from "@/actions/prompts/generateQuestions"

export default function FlashcardUI({ flashCardsData, promptId }) {
  const [flashCards, setFlashCards] = useState(flashCardsData)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState(flashCardsData[0] || null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (flashCards?.length > 0) {
      setCurrentCard(flashCards[currentIndex])
    } else {
      setCurrentCard(null)
    }
  }, [flashCards, currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashCards.length)
    setIsFlipped(false)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? flashCards.length - 1 : prev - 1
    )
    setIsFlipped(false)
  }

  const handleGenerateFlashcards = async () => {
    setIsLoading(true)
    try {
      const generated = await generateQuiz(promptId)
      const formatted = generated.map((q) => ({
        question: q.question,
        answer: q.options.find((a) => a.id === q.answer).text,
      }))
      setFlashCards(formatted)
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
                <MathJaxContext>
                  <MathJax inline dynamic>
                    <ReactMarkdown>{currentCard.question}</ReactMarkdown>
                  </MathJax>
                </MathJaxContext>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-x-180 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-xl text-2xl text-center px-12"
              >
                <MathJaxContext>
                  <MathJax inline dynamic>
                    <ReactMarkdown>{currentCard.answer}</ReactMarkdown>
                  </MathJax>
                </MathJaxContext>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Click the card to flip
          </p>

          <Separator className="my-4 w-full" />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={handlePrev} className="cursor-pointer">
              Previous
            </Button>
            <span className="text-gray-700 dark:text-gray-300 text-lg">
              {currentIndex + 1} / {flashCards.length}
            </span>
            <Button className="cursor-pointer" onClick={handleNext}>Next</Button>
          </div>
        </>
      )}
    </div>
  )
}