import { useState, useRef, useEffect } from 'react'
import type { SequenceItem } from '@/services/generators/types'

interface SequenceDisplayProps {
  sequenceData: SequenceItem[]
  onAnswerChange?: (answers: Record<number, string>) => void
  disabled?: boolean
  showFeedback?: boolean
  correctAnswers?: number[]
}

export default function SequenceDisplay({
  sequenceData,
  onAnswerChange,
  disabled = false,
  showFeedback = false,
  correctAnswers = [],
}: SequenceDisplayProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const missingIndices = sequenceData
    .map((item, idx) => (item.isMissing ? idx : -1))
    .filter(idx => idx !== -1)

  useEffect(() => {
    if (missingIndices.length > 0 && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [])

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = { ...answers, [index]: value }
    setAnswers(newAnswers)
    onAnswerChange?.(newAnswers)
  }

  const handleKeyDown = (e: React.KeyboardEvent, currentMissingIdx: number) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      const nextIdx = currentMissingIdx + 1
      if (nextIdx < missingIndices.length) {
        inputRefs.current[nextIdx]?.focus()
      }
    }
  }

  const getInputStatus = (index: number): 'correct' | 'incorrect' | 'neutral' => {
    if (!showFeedback) return 'neutral'
    const missingIdx = missingIndices.indexOf(index)
    if (missingIdx === -1) return 'neutral'

    const userAnswer = parseInt(answers[index] || '', 10)
    const correct = correctAnswers[missingIdx]

    if (isNaN(userAnswer)) return 'neutral'
    return userAnswer === correct ? 'correct' : 'incorrect'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {sequenceData.map((item, index) => {
          const isMissing = item.isMissing
          const missingIdx = missingIndices.indexOf(index)
          const status = getInputStatus(index)

          return (
            <div key={index} className="flex items-center">
              {/* Train car / number box */}
              <div
                className={`
                  relative flex items-center justify-center
                  w-12 h-14 sm:w-16 sm:h-18 rounded-xl
                  border-3 shadow-lg transition-all duration-200
                  ${isMissing
                    ? status === 'correct'
                      ? 'bg-green-100 border-green-500'
                      : status === 'incorrect'
                        ? 'bg-red-100 border-red-500'
                        : 'bg-yellow-50 border-yellow-400 hover:border-yellow-500'
                    : 'bg-blue-100 border-blue-400'
                  }
                `}
              >
                {isMissing ? (
                  <input
                    ref={(el) => {
                      if (missingIdx !== -1) {
                        inputRefs.current[missingIdx] = el
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={answers[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, missingIdx)}
                    disabled={disabled}
                    className={`
                      w-full h-full text-center text-xl sm:text-2xl font-bold
                      bg-transparent border-none outline-none
                      ${status === 'correct' ? 'text-green-700' : status === 'incorrect' ? 'text-red-700' : 'text-gray-800'}
                    `}
                    maxLength={3}
                    autoComplete="off"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-blue-700">
                    {item.value}
                  </span>
                )}

                {/* Wheel decorations for train car effect */}
                <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-500" />
                <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-500" />
              </div>

              {/* Connector between cars */}
              {index < sequenceData.length - 1 && (
                <div className="w-3 sm:w-4 h-1 bg-gray-400 rounded-full" />
              )}
            </div>
          )
        })}
      </div>

      {/* Helper text */}
      <p className="text-sm text-gray-500 text-center">
        {missingIndices.length === 1
          ? 'Fill in the missing number'
          : `Fill in the ${missingIndices.length} missing numbers`
        }
      </p>
    </div>
  )
}
