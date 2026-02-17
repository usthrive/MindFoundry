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
  // Column input for vertical problems
  columnDigits?: (string | null)[]    // Array of per-column digits (index 0 = ones)
  activeColumn?: number               // Currently focused column index
  carries?: (string | null)[]         // Carry indicators per column
  onColumnClick?: (column: number) => void  // Handler when a column box is tapped
  /** When true, carry boxes are tappable inputs (child enters carry manually) */
  manualCarryMode?: boolean
}

/**
 * WorksheetProblem - A compact problem display with inline answer input
 *
 * Shows the problem and answer input in a compact card format
 * suitable for displaying multiple problems on a single page.
 * For vertical (stacked) problems, renders column-aligned digit boxes
 * that support right-to-left input (ones → tens → hundreds).
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
  columnDigits,
  activeColumn,
  carries,
  onColumnClick,
  manualCarryMode = false,
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

  // Column cell sizing for vertical problems
  const cellSize = compact ? 'w-8 h-9 text-lg sm:w-9 sm:h-10 sm:text-xl' : 'w-10 h-11 text-xl sm:w-11 sm:h-12 sm:text-2xl'
  const cellGap = compact ? 'gap-0.5' : 'gap-1'

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

  // Render vertical format problem with column-aligned digit boxes
  const renderVerticalProblem = () => {
    const hasColumnInput = columnDigits !== undefined

    const operand1Str = String(operands[0] ?? '')
    const operand2Str = String(operands[1] ?? '')
    const maxDigits = hasColumnInput
      ? columnDigits.length
      : Math.max(operand1Str.length, operand2Str.length)

    // If no column input data, pad operands for basic alignment
    if (!hasColumnInput) {
      return (
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
    }

    // Pad operand strings to align with column count
    const padded1 = operand1Str.padStart(maxDigits, ' ')
    const padded2 = operand2Str.padStart(maxDigits, ' ')

    // Place value labels
    const placeLabels = ['O', 'T', 'H', 'Th', 'TTh']

    return (
      <div className="flex flex-col items-end">
        {/* Place value labels (only when active) */}
        {isActive && (
          <div className={cn('flex justify-end', cellGap)} style={{ marginRight: 0 }}>
            {Array.from({ length: maxDigits }, (_, visualIdx) => {
              const colIndex = maxDigits - 1 - visualIdx // visual L→R to column index (R→L)
              return (
                <div
                  key={`label-${visualIdx}`}
                  className={cn(
                    cellSize.split(' ').filter(c => c.startsWith('w-')).join(' '),
                    'text-center text-[10px] font-medium text-gray-400'
                  )}
                >
                  {placeLabels[colIndex] || ''}
                </div>
              )
            })}
          </div>
        )}

        {/* Carry row */}
        <div className={cn('flex justify-end', cellGap)} style={{ minHeight: compact ? '1.25rem' : '1.5rem' }}>
          {/* Empty space for operator column */}
          <div className={compact ? 'w-5' : 'w-6'} />
          {Array.from({ length: maxDigits }, (_, visualIdx) => {
            const colIndex = maxDigits - 1 - visualIdx
            const carry = carries?.[colIndex]
            // In manual mode for addition, show tappable carry boxes above columns > 0
            const showCarryBox = manualCarryMode && isActive && colIndex > 0

            return (
              <div
                key={`carry-${visualIdx}`}
                className={cn(
                  cellSize.split(' ').filter(c => c.startsWith('w-')).join(' '),
                  'text-center flex items-center justify-center'
                )}
              >
                {showCarryBox ? (
                  // Manual carry mode: tappable carry box
                  <div
                    className={cn(
                      'w-5 h-5 text-[10px] font-bold rounded border cursor-pointer',
                      'flex items-center justify-center touch-manipulation',
                      carry
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-dashed border-gray-300 text-gray-300'
                    )}
                    title="Tap to toggle carry"
                  >
                    {carry || ''}
                  </div>
                ) : carry ? (
                  // Auto carry mode: display only
                  <span className={cn(
                    'text-xs font-bold text-red-500',
                    'animate-pulse'
                  )}>
                    {carry}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* First operand row - digit by digit */}
        <div className={cn('flex justify-end font-mono font-bold tabular-nums', cellGap)}>
          {/* Empty space for operator column */}
          <div className={compact ? 'w-5' : 'w-6'} />
          {Array.from({ length: maxDigits }, (_, visualIdx) => (
            <div
              key={`op1-${visualIdx}`}
              className={cn(
                cellSize.split(' ').filter(c => c.startsWith('w-')).join(' '),
                'text-center flex items-center justify-center',
                smallFontSize
              )}
            >
              {padded1[visualIdx] !== ' ' ? padded1[visualIdx] : ''}
            </div>
          ))}
        </div>

        {/* Second operand row with operator */}
        <div className={cn('flex items-center font-mono font-bold tabular-nums', cellGap)}>
          <div className={cn(
            compact ? 'w-5 text-base' : 'w-6 text-lg',
            'text-primary text-center flex-shrink-0'
          )}>
            {operator}
          </div>
          {Array.from({ length: maxDigits }, (_, visualIdx) => (
            <div
              key={`op2-${visualIdx}`}
              className={cn(
                cellSize.split(' ').filter(c => c.startsWith('w-')).join(' '),
                'text-center flex items-center justify-center',
                smallFontSize
              )}
            >
              {padded2[visualIdx] !== ' ' ? padded2[visualIdx] : ''}
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className={cn('my-1 h-0.5 bg-primary', cellGap)} style={{
          width: `calc(${compact ? '1.25rem' : '1.5rem'} + ${maxDigits} * ${compact ? '2.25rem' : '2.75rem'} + ${(maxDigits - 1) * (compact ? 2 : 4)}px)`
        }} />

        {/* Answer row - individual digit boxes */}
        <div className={cn('flex justify-end', cellGap)}>
          {/* Empty space for operator column */}
          <div className={compact ? 'w-5' : 'w-6'} />
          {Array.from({ length: maxDigits }, (_, visualIdx) => {
            const colIndex = maxDigits - 1 - visualIdx // Visual L→R to column index (ones=0)
            const digit = columnDigits[colIndex]
            const isActiveCol = activeColumn === colIndex && isActive

            return (
              <div
                key={`ans-${visualIdx}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onColumnClick?.(colIndex)
                }}
                className={cn(
                  cellSize,
                  'flex items-center justify-center',
                  'font-mono font-bold tabular-nums text-center',
                  'border-2 rounded-md cursor-pointer transition-all',
                  'touch-manipulation select-none',
                  isSubmitted
                    ? (isCorrect
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700')
                    : isActiveCol
                      ? 'border-primary bg-blue-100 ring-2 ring-primary/50 text-gray-900 shadow-sm'
                      : digit !== null
                        ? 'border-gray-400 bg-gray-50 text-gray-900'
                        : isActive
                          ? 'border-gray-300 bg-white text-gray-400'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                )}
              >
                {digit ?? ''}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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
