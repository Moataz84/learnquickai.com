import { MathJax, MathJaxContext } from "better-react-mathjax"
import ReactMarkdown from "react-markdown"

export default function MathRender({ children }) {
  return (
    <MathJaxContext>
      <MathJax inline dynamic>
        <ReactMarkdown>{children}</ReactMarkdown>
      </MathJax>
    </MathJaxContext>
  )
}