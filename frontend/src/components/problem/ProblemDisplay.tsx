import { cn } from '@/lib/utils'
import type { Problem, AgeGroup } from '@/types'

export interface ProblemDisplayProps {
  problem: Problem
  studentAnswer?: string
  ageGroup: AgeGroup
  showAnswer?: boolean
  className?: string
}

const ProblemDisplay = ({
  problem,
  studentAnswer,
  ageGroup,
  showAnswer = false,
  className,
}: ProblemDisplayProps) => {
  // Font size based on age group with responsive breakpoints
  const fontSizes = {
    preK: 'text-4xl sm:text-5xl md:text-6xl',
    grade1_2: 'text-3xl sm:text-4xl md:text-5xl',
    grade3_5: 'text-2xl sm:text-3xl md:text-4xl',
  }

  const fontSize = fontSizes[ageGroup]

  // Get operator symbol
  const operatorSymbols = {
    addition: '+',
    subtraction: '−', // Minus sign, not hyphen
    multiplication: '×',
    division: '÷',
  }

  const operator = operatorSymbols[problem.type]

  // Horizontal format (for early levels)
  if (problem.displayFormat === 'horizontal') {
    // Handle three-number addition (e.g., 3 + 5 + 2 = ?)
    if (problem.operands.length === 3) {
      return (
        <div className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {problem.operands[0]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            {operator}
          </span>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {problem.operands[1]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            {operator}
          </span>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {problem.operands[2]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            =
          </span>
          <div className="relative">
            {studentAnswer || showAnswer ? (
              <span
                className={cn(
                  'font-mono font-bold tabular-nums',
                  fontSize,
                  showAnswer && studentAnswer !== problem.correctAnswer.toString()
                    ? 'text-error line-through'
                    : 'text-gray-900'
                )}
              >
                {showAnswer ? problem.correctAnswer : studentAnswer}
              </span>
            ) : (
              <span className={cn('font-mono font-bold text-gray-300', fontSize)}>
                ?
              </span>
            )}
          </div>
        </div>
      )
    }

    // Handle missing addend/subtrahend (e.g., 7 + __ = 15 or 15 - __ = 7)
    if (problem.missingPosition === 1) {
      return (
        <div className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {problem.operands[0]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            {operator}
          </span>
          <div className="relative">
            {studentAnswer || showAnswer ? (
              <span
                className={cn(
                  'font-mono font-bold tabular-nums',
                  fontSize,
                  showAnswer && studentAnswer !== problem.correctAnswer.toString()
                    ? 'text-error line-through'
                    : 'text-gray-900'
                )}
              >
                {showAnswer ? problem.correctAnswer : studentAnswer}
              </span>
            ) : (
              <span className={cn('font-mono font-bold text-gray-300', fontSize)}>
                ?
              </span>
            )}
          </div>
          <span className={cn('font-bold text-primary', fontSize)}>
            =
          </span>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {problem.operands[1]}
          </span>
        </div>
      )
    }

    // Standard two-operand horizontal format
    return (
      <div className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}>
        <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
          {problem.operands[0]}
        </span>
        <span className={cn('font-bold text-primary', fontSize)}>
          {operator}
        </span>
        <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
          {problem.operands[1]}
        </span>
        <span className={cn('font-bold text-primary', fontSize)}>
          =
        </span>
        <div className="relative">
          {studentAnswer || showAnswer ? (
            <span
              className={cn(
                'font-mono font-bold tabular-nums',
                fontSize,
                showAnswer && studentAnswer !== problem.correctAnswer.toString()
                  ? 'text-error line-through'
                  : 'text-gray-900'
              )}
            >
              {showAnswer ? problem.correctAnswer : studentAnswer}
            </span>
          ) : (
            <span className={cn('font-mono font-bold text-gray-300', fontSize)}>
              ?
            </span>
          )}
        </div>
      </div>
    )
  }

  // Vertical format (for higher levels with multi-digit numbers)
  return (
    <div className={cn('flex flex-col items-end', className)}>
      {/* First operand */}
      <div className={cn('font-mono font-bold tabular-nums text-right', fontSize)}>
        {problem.operands[0]}
      </div>

      {/* Operator and second operand */}
      <div className={cn('flex items-center gap-3 font-mono font-bold tabular-nums', fontSize)}>
        <span className="text-primary">{operator}</span>
        <span className="text-right">{problem.operands[1]}</span>
      </div>

      {/* Dividing line */}
      <div className="my-2 h-1 w-full bg-primary" />

      {/* Answer area */}
      <div className="relative">
        {studentAnswer || showAnswer ? (
          <span
            className={cn(
              'font-mono font-bold tabular-nums',
              fontSize,
              showAnswer && studentAnswer !== problem.correctAnswer.toString()
                ? 'text-error line-through'
                : 'text-gray-900'
            )}
          >
            {showAnswer ? problem.correctAnswer : studentAnswer}
          </span>
        ) : (
          <span
            className={cn('font-mono font-bold text-gray-300', fontSize)}
            style={{ minWidth: '2ch' }}
          >
            ?
          </span>
        )}
      </div>
    </div>
  )
}

export default ProblemDisplay
