"use client"
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";

const q = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "22"],
    answer: "4",
  },
  {
    question: "What color is the sky?",
    options: ["Red", "Blue", "Green", "Purple"],
    answer: "Blue",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Tolstoy", "Hemingway", "Shakespeare", "Dickens"],
    answer: "Shakespeare",
  },
];

export default function KahootGame({ gameId, socket, show }) {
  const [questions, setQuestions] = useState(q)
  const session = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const timerRef = useRef(null);

  function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function nextQuestion() {
    setSelected(null);
    setCurrentQuestion(getRandomQuestion());
    startTimer();
  }

  function startTimer() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
    if (!selected && session?.data?.user?.id && show) {
      socket.emit('answer-selected', {
        gameId,
        user: {
          id: session.data.user.id,
          name: session.data.user.name,
          score: score
        },
      });
    }
      nextQuestion();
    }, 5000);
  }

  function handleAnswer(option) {
    if (selected) return;
    setSelected(option);
  
    const isCorrect = option === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;
  
    if (isCorrect) {
      setScore(newScore);
    }
  
    socket.emit('answer-selected', {
      gameId,
      user: {
        id: session?.data?.user.id,
        name: session?.data?.user?.name,
        score: newScore,
      },
    });
  
    clearTimeout(timerRef.current);
    setTimeout(() => {
      nextQuestion();
    }, 800); // short delay to show feedback
  }

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, [currentQuestion]);

  return (
<div className="p-6 rounded-xl shadow-md min-w-lg space-y-4 dark:bg-gray-800 min-h-[400px]">
  <h2 className="text-2xl font-semibold min-h-[56px]">
    {currentQuestion.question}
  </h2>

  <div className="grid grid-cols-1 gap-4">
    {currentQuestion.options.map((option) => (
      <button
        key={option}
        onClick={() => handleAnswer(option)}
        disabled={selected !== null}
        className={clsx(
          "px-4 py-2 rounded-md text-white transition font-medium w-full",
          selected === option
            ? option === currentQuestion.answer
              ? "bg-green-500"
              : "bg-red-500"
            : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {option}
      </button>
    ))}
  </div>

  <div className="text-purple-600 font-semibold">Score: {score}</div>
  <div className="text-gray-400 text-sm">Auto-advances every 5 seconds</div>
</div>

    )
}
