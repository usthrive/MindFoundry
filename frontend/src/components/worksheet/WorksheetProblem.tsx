import { cn } from '@/lib/utils'
import type { Problem } from '@/services/generators/types'

export interface WorksheetProblemProps {
  problem: Problem
  problemNumber: number
  answer: string
  isActive: boolean
  isSubmitted: boolean
  isCorrect?: boolean
  onClick: () => void
  compact?: boolean
}

/**
 * WorksheetProblem - A compact problem display with inline answer input
 *
 * Shows the problem and answer input in a compact card format
 * suitable for displaying multiple problems on a single page.
 */
export default function WorksheetProblem({
  problem,
  problemNumber,
  answer,
  isActive,
  isSubmitted,
  isCorrect,
  onClick,
  compact = false,
}: WorksheetProblemProps) {
  // Get operator symbol
  const operatorSymbols: Record<string, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  }

  const operator = operatorSymbols[problem.type] || '?'
  const operands = problem.operands || []

  // Determine border/background color based on state
  const getContainerStyles = () => {
    if (isSubmitted) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50'
      } else {
        return 'border-red-500 bg-red-50'
      }
    }
    if (isActive) {
      return 'border-primary bg-blue-50 ring-2 ring-primary ring-opacity-50'
    }
    return 'border-gray-200 bg-white hover:border-gray-300'
  }

  // Font size based on compact mode
  const fontSize = compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
  const smallFontSize = compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'

  // Render horizontal format problem
  const renderHorizontalProblem = () => {
    // Handle missing addend format (e.g., 7 + ? = 15)
    if (problem.missingPosition === 1) {
      return (
        <div className={cn('flex items-center justify-center gap-2', fontSize)}>
          <span className="font-mono font-bold tabular-nums">{operands[0]}</span>
          <span className="font-bold text-primary">{operator}</span>
          <span className={cn(
            'font-mono font-bold tabular-nums min-w-[2ch] text-center border-b-2',
            isSubmitted
              ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700')
              : (isActive ? 'border-primary text-gray-900' : 'border-gray-300 text-gray-400')
          )}>
            {answer || '?'}
          </span>
          <span className="font-bold text-primary">=</span>
          <span className="font-mono font-bold tabular-nums">{operands[1]}</span>
        </div>
      )
    }

    // Standard format (e.g., 8 + 5 = ?)
    return (
      <div className={cn('flex items-center justify-center gap-2', fontSize)}>
        <span className="font-mono font-bold tabular-nums">{operands[0]}</span>
        <span className="font-bold text-primary">{operator}</span>
        <span className="font-mono font-bold tabular-nums">{operands[1]}</span>
        <span className="font-bold text-primary">=</span>
        <span className={cn(
          'font-mono font-bold tabular-nums min-w-[2ch] text-center border-b-2',
          isSubmitted
            ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700')
            : (isActive ? 'border-primary text-gray-900' : 'border-gray-300 text-gray-400')
        )}>
          {answer || '?'}
        </span>
      </div>
    )
  }

  // Render vertical format problem
  const renderVerticalProblem = () => (
    <div className={cn('flex flex-col items-end', smallFontSize)}>
      <div className="font-mono font-bold tabular-nums text-right">
        {operands[0]}
      </div>
      <div className="flex items-center gap-2 font-mono font-bold tabular-nums">
        <span className="text-primary">{operator}</span>
        <span className="text-right">{operands[1]}</span>
      </div>
      <div className="my-1 h-0.5 w-full bg-primary" />
      <div className={cn(
        'font-mono font-bold tabular-nums min-w-[2ch] text-right border-b-2',
        isSubmitted
          ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700')
          : (isActive ? 'border-primary text-gray-900' : 'border-gray-300 text-gray-400')
      )}>
        {answer || '?'}
      </div>
    </div>
  )

  // Render complex/question-based problem
  const renderQuestionProblem = () => {
    const questionText = typeof problem.question === 'string'
      ? problem.question
      : problem.question?.text || problem.question?.latex || ''

    return (
      <div className={cn('flex flex-col items-center gap-2', smallFontSize)}>
        <div className="font-mono text-center px-2 text-base sm:text-lg">
          {questionText.includes('___') ? (
            <span>
              {questionText.split('___')[0]}
              <span className={cn(
                'inline-block min-w-[2ch] px-1 mx-1 border-b-2',
                isSubmitted
                  ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700')
                  : (isActive ? 'border-primary text-gray-900' : 'border-gray-300 text-gray-400')
              )}>
                {answer || '?'}
              </span>
              {questionText.split('___')[1] || ''}
            </span>
          ) : (
            <>
              <span>{questionText}</span>
              <span className={cn(
                'block mt-2 font-bold min-w-[2ch] text-center border-b-2',
                isSubmitted
                  ? (isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700')
                  : (isActive ? 'border-primary text-gray-900' : 'border-gray-300 text-gray-400')
              )}>
                {answer || '?'}
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  // Choose render method based on display format
  const renderProblem = () => {
    // If it's a complex type with a question string, render that
    if (problem.question && typeof problem.question !== 'string' && problem.question.text) {
      return renderQuestionProblem()
    }
    if (typeof problem.question === 'string' && problem.question.length > 0) {
      return renderQuestionProblem()
    }

    // Otherwise use display format
    if (problem.displayFormat === 'vertical') {
      return renderVerticalProblem()
    }

    return renderHorizontalProblem()
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200',
        getContainerStyles()
      )}
    >
      {/* Problem number badge */}
      <div className={cn(
        'absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
        isSubmitted
          ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
          : (isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600')
      )}>
        {problemNumber}
      </div>

      {/* Problem content */}
      <div className="flex items-center justify-center min-h-[60px]">
        {renderProblem()}
      </div>

      {/* Checkmark or X indicator */}
      {isSubmitted && (
        <div className={cn(
          'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm',
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        )}>
          {isCorrect ? '✓' : '✗'}
        </div>
      )}
    </div>
  )
}
