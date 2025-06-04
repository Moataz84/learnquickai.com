"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import MathRender from "@/components/MathRender"
import generateQuestions from "@/actions/prompts/generateQuestions"
import { deleteFlashcard } from "@/actions/prompts/deleteQuestions"
import { useQuestions } from "@/contexts/QuestionsContext"
import { usePrompt } from "@/contexts/PromptContext"
import shuffle from "@/actions/shuffle"
import { useRouter } from "next/navigation"

export default function FlashcardPage() {
  const { prompt } = usePrompt()
  const { questions, setQuestions } = useQuestions()
  const [flashCards, setFlashCards] = useState(shuffle(
    questions.filter(q => q.flashcardVisable !== false).map(q => ({
      ...q,
      answer: q.options.find((a) => a.id === q.answer)?.text
    }))
  ))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState(flashCards[0] || null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const formatted = questions.filter(q => q.flashcardVisable !== false).map((q) => ({
      ...q,
      answer: q.options.find((a) => a.id === q.answer)?.text
    }))
    setFlashCards(formatted)
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

  const addMoreFlashcards = async () => {
    setIsLoading(true)
    try {
      const generated = await generateQuestions(prompt.promptId)
      if (generated[0] === "exceeded") return router.push("/pricing")
      if (generated[0] === "rate-limit") return router.push("/rate-limit")
      setQuestions((prev) => [...prev, ...generated])
    } catch (err) {
      console.error("Failed to add flashcards", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFlashcard = async () => {
    setQuestions([
      ...questions.filter(q => q.id !== currentCard.id), 
      {...questions.find(q => q.id === currentCard.id), flashcardVisable: false}
    ])
    await deleteFlashcard(currentCard.id)
  }

  return (
    <div className="min-h-screen pt-26 px-10 md:pt-14 md:px-14 pb-10 dark:bg-gray-900 w-full">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Flashcards
      </h1>

      {!flashCards?.length || !currentCard ? (
        <div className="flex flex-col items-start justify-center space-y-6">
          <Button onClick={addMoreFlashcards} disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Generating..." : "Generate Flashcards"}
          </Button>
          <p className="text-muted-foreground text-base">
            😅 Looks like you have no flashcards yet. Click the button above to get started!
          </p>
        </div>
      ) : (
        <>
          {/* Flip Card Container */}
          <div className="w-full max-w-3xl h-[300px] perspective mb-4">
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

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-3xl">
            Click the card to flip
          </p>

          <Separator className="my-4 w-full max-w-3xl" />

          {/* Navigation & Actions */}
          <div className="flex flex-col items-center justify-center gap-4 max-w-3xl">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="cursor-pointer" onClick={handlePrev} disabled={isNavigating}>
                Previous
              </Button>
              <span className="text-gray-700 dark:text-gray-300 text-lg">
                {currentIndex + 1} / {flashCards.length}
              </span>
              <Button onClick={handleNext} className="cursor-pointer" disabled={isNavigating}>
                Next
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button variant="destructive" className="cursor-pointer" onClick={handleDeleteFlashcard}>
                Delete Flashcard
              </Button>
              <Button onClick={addMoreFlashcards} className="cursor-pointer" disabled={isLoading}>
                {isLoading ? "Adding..." : "Generate Additional Flashcards"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
