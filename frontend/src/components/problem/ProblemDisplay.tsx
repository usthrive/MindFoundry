import { cn } from '@/lib/utils'
import type { AgeGroup, ProblemFormat } from '@/types'

// Accept a flexible Problem type that works with both type definitions
interface DisplayProblem {
  type: string
  operands?: number[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  correctAnswer: any
  displayFormat: ProblemFormat | string
  missingPosition?: number
  question?: string | { latex?: string; text?: string }
}

export interface ProblemDisplayProps {
  problem: DisplayProblem
  studentAnswer?: string
  ageGroup: AgeGroup
  showAnswer?: boolean
  className?: string
}

// Complex problem types that should display the question string directly
const COMPLEX_PROBLEM_TYPES = [
  'fraction', 'conversion', 'word_problem', 'decimal',
  'algebraic', 'equation', 'expression', 'polynomial',
  'quadratic', 'logarithm', 'trigonometry', 'calculus',
  'matrix', 'vector', 'statistics', 'probability'
]

const ProblemDisplay = ({
  problem,
  studentAnswer,
  ageGroup,
  showAnswer = false,
  className,
}: ProblemDisplayProps) => {
  // Font size based on age group with responsive breakpoints
  const fontSizes: Record<AgeGroup, string> = {
    preK: 'text-4xl sm:text-5xl md:text-6xl',
    grade1_2: 'text-3xl sm:text-4xl md:text-5xl',
    grade3_5: 'text-2xl sm:text-3xl md:text-4xl',
    grade5_6: 'text-2xl sm:text-3xl md:text-4xl',
    middle_school: 'text-xl sm:text-2xl md:text-3xl',
  }

  const fontSize = fontSizes[ageGroup]

  // Check if this is a complex problem type that should display the question string
  const isComplexType = COMPLEX_PROBLEM_TYPES.includes(problem.type)

  // Get the question string (handle both string and MathExpression types)
  const getQuestionText = (): string | null => {
    if (!problem.question) return null
    if (typeof problem.question === 'string') return problem.question
    if (problem.question.text) return problem.question.text
    if (problem.question.latex) return problem.question.latex
    return null
  }

  // Format answer for display (handles Fraction objects, numbers, and strings)
  const formatAnswer = (answer: unknown): string => {
    if (answer === null || answer === undefined) return '?'
    if (typeof answer === 'number') return answer.toString()
    if (typeof answer === 'string') return answer
    // Handle Fraction type { numerator, denominator }
    if (typeof answer === 'object' && 'numerator' in answer && 'denominator' in answer) {
      const frac = answer as { numerator: number; denominator: number }
      return `${frac.numerator}/${frac.denominator}`
    }
    return String(answer)
  }

  // Get operator symbol
  const operatorSymbols: Record<string, string> = {
    addition: '+',
    subtraction: '−', // Minus sign, not hyphen
    multiplication: '×',
    division: '÷',
  }

  const operator = operatorSymbols[problem.type] || '?'
  const operands = problem.operands || []

  // For counting problems (Level 7A, Pre-K), display question only
  // The visual assets and answer choices are handled by the parent component
  if (problem.type === 'counting') {
    const questionText = getQuestionText() || 'How many?'
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <p className={cn('font-semibold text-gray-700 text-center', 'text-xl sm:text-2xl md:text-3xl')}>
          {questionText}
        </p>
      </div>
    )
  }

  // For complex types, display the question string directly
  if (isComplexType && getQuestionText()) {
    const questionText = getQuestionText()!
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className={cn('font-mono font-bold text-center px-4', fontSize === fontSizes.middle_school ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl md:text-2xl')}>
          {/* Replace ___ placeholder with answer display */}
          {questionText.includes('___') ? (
            <span>
              {questionText.split('___')[0]}
              <span className={cn(
                'inline-block min-w-[3ch] px-2 mx-1 border-b-2 border-primary',
                studentAnswer || showAnswer ? 'text-gray-900' : 'text-gray-300'
              )}>
                {showAnswer ? formatAnswer(problem.correctAnswer) : (studentAnswer || '?')}
              </span>
              {questionText.split('___')[1] || ''}
            </span>
          ) : (
            <span>{questionText}</span>
          )}
        </div>
        {/* For problems without ___ placeholder, show answer separately */}
        {!questionText.includes('___') && (
          <div className="flex items-center gap-2">
            <span className={cn('font-bold text-primary', fontSize)}>
              Answer:
            </span>
            <span className={cn(
              'font-mono font-bold min-w-[3ch] px-2 border-b-2 border-primary',
              studentAnswer || showAnswer ? 'text-gray-900' : 'text-gray-300'
            )}>
              {showAnswer ? formatAnswer(problem.correctAnswer) : (studentAnswer || '?')}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Horizontal format (for early levels)
  if (problem.displayFormat === 'horizontal') {
    // Handle three-number addition (e.g., 3 + 5 + 2 = ?)
    if (operands.length === 3) {
      return (
        <div className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {operands[0]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            {operator}
          </span>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {operands[1]}
          </span>
          <span className={cn('font-bold text-primary', fontSize)}>
            {operator}
          </span>
          <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
            {operands[2]}
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
            {operands[0]}
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
            {operands[1]}
          </span>
        </div>
      )
    }

    // Standard two-operand horizontal format
    return (
      <div className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}>
        <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
          {operands[0]}
        </span>
        <span className={cn('font-bold text-primary', fontSize)}>
          {operator}
        </span>
        <span className={cn('font-mono font-bold tabular-nums', fontSize)}>
          {operands[1]}
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
        {operands[0]}
      </div>

      {/* Operator and second operand */}
      <div className={cn('flex items-center gap-3 font-mono font-bold tabular-nums', fontSize)}>
        <span className="text-primary">{operator}</span>
        <span className="text-right">{operands[1]}</span>
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
