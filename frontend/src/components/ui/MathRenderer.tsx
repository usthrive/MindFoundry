import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathRendererProps {
  expression: string
  displayMode?: boolean
  className?: string
  errorColor?: string
}

export default function MathRenderer({
  expression,
  displayMode = false,
  className = '',
  errorColor = '#cc0000',
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (containerRef.current && expression) {
      try {
        katex.render(expression, containerRef.current, {
          displayMode,
          throwOnError: false,
          errorColor,
          trust: false,
          strict: false,
        })
      } catch (error) {
        if (containerRef.current) {
          containerRef.current.textContent = expression
        }
      }
    }
  }, [expression, displayMode, errorColor])

  if (!expression) {
    return null
  }

  return (
    <span
      ref={containerRef}
      className={`math-renderer ${className}`}
      aria-label={`Mathematical expression: ${expression}`}
    />
  )
}

interface MathBlockProps {
  expression: string
  className?: string
}

export function MathBlock({ expression, className = '' }: MathBlockProps) {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <MathRenderer expression={expression} displayMode={true} />
    </div>
  )
}

export function InlineMath({ expression, className = '' }: MathBlockProps) {
  return <MathRenderer expression={expression} displayMode={false} className={className} />
}

export function parseMathExpression(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      parts.push(<MathBlock key={match.index} expression={match[1]} />)
    } else if (match[2]) {
      parts.push(<InlineMath key={match.index} expression={match[2]} />)
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export function MathText({ children }: { children: string }) {
  const parsed = parseMathExpression(children)
  return <>{parsed}</>
}
