import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"

function wrapInlineMath(text) {
  return text.replace(/(\\[a-zA-Z]+(?:\{[^}]+\}){0,2})/g, (match, p1, offset, str) => {
    if (text.includes("\\\\\(")) {
      return match
    }
    return `\\\\\(${match}\\\\\)`
  })
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