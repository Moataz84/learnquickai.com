import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"

function wrapInlineMath(text) {
  const match = text?.match(/(\\[a-zA-Z]+(?:\{[^}]+\}){0,2})/g)
  if (match === null || text?.includes("\\\(")) {
    return text
  }
  return `\\\\\(${text}\\\\\)`
}


export default function MathRender({ children }) {
  return (
    <MathJaxContext>
      <MathJax inline dynamic>
        <ReactMarkdown>{wrapInlineMath(children)}</ReactMarkdown>
      </MathJax>
    </MathJaxContext>
  )
}