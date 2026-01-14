import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export interface TapToSelectProps {
  /** Array of number options to display (typically 3-4 options) */
  options: number[]
  /** Callback when user selects an option */
  onSelect: (value: number) => void
  /** The correct answer for visual feedback after selection */
  correctAnswer?: number
  /** Whether interaction is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Size variant for different screen sizes */
  size?: 'compact' | 'medium' | 'large' | 'auto'
  /** Whether to show feedback after selection (correct/incorrect colors) */
  showFeedback?: boolean
}

/**
 * TapToSelect Component for Pre-K Levels (7A, 6A)
 *
 * Large, touch-friendly number buttons for young children (ages 3-5)
 * who cannot reliably type numerals. Children tap their answer choice.
 *
 * Design considerations:
 * - Minimum 80x80px touch targets (exceeds Apple HIG 44x44px minimum)
 * - Large, clear numerals
 * - High contrast colors
 * - Visual feedback on selection
 * - Correct/incorrect feedback colors
 */
const TapToSelect = ({
  options,
  onSelect,
  correctAnswer,
  disabled = false,
  className,
  size = 'auto',
  showFeedback = false,
}: TapToSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Reset state when options change (new problem)
  useEffect(() => {
    setSelectedValue(null)
    setShowResult(false)
  }, [options])

  const handleSelect = (value: number) => {
    if (disabled || selectedValue !== null) return

    setSelectedValue(value)

    // If feedback is enabled, show result briefly before calling onSelect
    if (showFeedback && correctAnswer !== undefined) {
      setShowResult(true)
      // Brief delay to show correct/incorrect feedback
      setTimeout(() => {
        onSelect(value)
      }, 800)
    } else {
      onSelect(value)
    }
  }

  // Size-based classes for option buttons
  const getButtonSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'h-16 w-16 text-2xl'
      case 'medium':
        return 'h-20 w-20 text-3xl'
      case 'large':
        return 'h-24 w-24 text-4xl'
      case 'auto':
      default:
        // Responsive: phone -> tablet -> desktop
        return 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-2xl sm:text-3xl lg:text-4xl'
    }
  }

  // Gap sizes based on size
  const getGapClasses = () => {
    switch (size) {
      case 'compact':
        return 'gap-3'
      case 'medium':
        return 'gap-4'
      case 'large':
        return 'gap-5'
      case 'auto':
      default:
        return 'gap-3 sm:gap-4 lg:gap-5'
    }
  }

  const buttonSizeClasses = getButtonSizeClasses()
  const gapClasses = getGapClasses()

  // Determine button state and colors
  const getButtonClasses = (value: number) => {
    const isSelected = selectedValue === value
    const isCorrect = value === correctAnswer

    // Base styles
    const base = cn(
      'flex items-center justify-center rounded-2xl sm:rounded-3xl',
      'font-bold transition-all duration-200',
      'shadow-lg focus:outline-none',
      'touch-manipulation select-none',
      buttonSizeClasses
    )

    if (disabled) {
      return cn(base, 'bg-gray-200 text-gray-400 cursor-not-allowed')
    }

    // After selection with feedback
    if (showResult && selectedValue !== null) {
      if (isSelected) {
        return cn(
          base,
          isCorrect
            ? 'bg-success text-white scale-110 shadow-xl ring-4 ring-success/30'
            : 'bg-error text-white scale-95 shadow-sm'
        )
      }
      // Highlight correct answer if user was wrong
      if (!isCorrect) {
        return cn(base, 'bg-gray-100 text-gray-400 scale-95')
      }
      // Show correct answer with subtle highlight
      return cn(base, 'bg-success/20 text-success ring-2 ring-success/50')
    }

    // Selected state (before feedback)
    if (isSelected) {
      return cn(
        base,
        'bg-primary text-white scale-105 shadow-xl ring-4 ring-primary/30'
      )
    }

    // Default interactive state
    return cn(
      base,
      'bg-white text-gray-900',
      'hover:bg-gray-50 hover:scale-105',
      'active:scale-95 active:shadow-md',
      'focus:ring-4 focus:ring-primary/40'
    )
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Options grid */}
      <div className={cn('flex flex-wrap justify-center', gapClasses)}>
        {options.map((value) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            disabled={disabled || selectedValue !== null}
            className={getButtonClasses(value)}
            type="button"
            aria-label={`Select ${value}`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Feedback message for young children */}
      {showResult && selectedValue !== null && correctAnswer !== undefined && (
        <div
          className={cn(
            'mt-4 sm:mt-6 px-4 py-2 rounded-xl text-lg sm:text-xl font-bold',
            selectedValue === correctAnswer
              ? 'bg-success/10 text-success'
              : 'bg-error/10 text-error'
          )}
        >
          {selectedValue === correctAnswer ? 'Great job!' : `The answer is ${correctAnswer}`}
        </div>
      )}
    </div>
  )
}

export default TapToSelect
