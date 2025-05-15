"use client"
import { usePrompt } from "@/contexts/PromptContext"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"

export default function Note() {
  const prompt = usePrompt()

  return (
    <MathJaxContext>
      <MathJax inline dynamic>
        <div className="custom-html-styles p-12">
          <p className="note-title">{prompt.title}</p>
          <ReactMarkdown>
            {prompt.summary}
          </ReactMarkdown>
        </div>
      </MathJax>
    </MathJaxContext>
  )
}