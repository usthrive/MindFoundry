import { motion, AnimatePresence } from 'framer-motion'
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
  /** Total answer columns — one per place value the answer can reach.
   *  May exceed the operand digit count (e.g. 3 for a 2-digit × 1-digit product). */
  answerColumnCount?: number
  // ── Subtraction regroup (borrow) annotations ──
  /** Replacement digit for the donor column (e.g., "3" written above a slashed "4"). */
  regroupStrikes?: (string | null)[]
  /** "+10" indicator for the receiver column (always "1", shown above the digit). */
  regroupAdds?: (string | null)[]
  /** When true, regroup annotations are tappable inputs (child performs the regroup manually). */
  manualRegroupMode?: boolean
  /** Tap handler for the donor-column strike target (passes column index of the donor). */
  onRegroupStrikeTap?: (column: number) => void
  /** Tap handler for the receiver-column "+10" target (passes column index of the receiver). */
  onRegroupAddTap?: (column: number) => void
  /** Columns where a donor strike is required by the problem (used to show tap targets only where needed). */
  regroupNeedsStrike?: number[]
  /** Columns where a "+10" receiver mark is required by the problem. */
  regroupNeedsAdd?: number[]
  /** When true, transient "-1" / "+10" operation chips animate over the regrouped row.
   *  Fires for ~1 second right after auto-regroup populates the values, then disappears.
   *  Used in the auto-demo phase (early worksheets) to teach what the regroup is doing. */
  showOperationChips?: boolean
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
  answerColumnCount,
  regroupStrikes,
  regroupAdds,
  manualRegroupMode = false,
  onRegroupStrikeTap,
  onRegroupAddTap,
  regroupNeedsStrike,
  regroupNeedsAdd,
  showOperationChips = false,
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
      if (isCorrect) return 'border-green-500 bg-green-50'
      // Wrong answer: show orange ring when active so child knows it's selected
      if (isActive) return 'border-red-500 bg-red-50 ring-2 ring-orange-400 ring-opacity-70 shadow-sm'
      return 'border-red-500 bg-red-50'
    }
    if (isActive) {
      return 'border-primary bg-blue-50 ring-2 ring-primary ring-opacity-50'
    }
    return 'border-gray-200 bg-white hover:border-gray-300'
  }

  // Font size based on compact mode
  // md: rolls back the sm: jump to prevent over-sizing on iPad and desktop (768px+)
  const fontSize = compact ? 'text-xl sm:text-2xl md:text-xl' : 'text-2xl sm:text-3xl md:text-2xl'
  const smallFontSize = compact ? 'text-lg sm:text-xl md:text-lg' : 'text-xl sm:text-2xl md:text-xl'

  // ── Column sizing for vertical problems ──
  // Every column is the SAME width. Each holds exactly one digit, so there is no
  // "wide last column" any more: the answer grid has one box per place value
  // (see getAnswerColumnCount in WorksheetView), which is what keeps the digits of a
  // number reading as one number and keeps the place-value labels honest.
  //
  // Wide problems (Level D's 3-digit × 2-digit reaches 5 places) step down a size so
  // the problem still fits inside its card instead of bursting out of it.
  const columnCount = problem.displayFormat === 'vertical'
    ? Math.max(
        answerColumnCount ?? 0,
        ...(problem.operands ?? []).map(op => String(Math.abs(op)).length)
      )
    : 0
  const narrowColumns = columnCount >= 5

  const cellGap = compact ? 'gap-1' : 'gap-1.5'
  const cellGapPx = compact ? 4 : 6

  // Width in rem at the mobile / sm: / md: breakpoints — kept in one place so the
  // divider-width calculation below can never drift out of sync with the boxes.
  const colWidthRem = compact
    ? (narrowColumns ? 2 : 2.5)
    : (narrowColumns ? 2.5 : 3)
  const colWidthClass = compact
    ? (narrowColumns ? 'w-8 sm:w-9 md:w-8' : 'w-10 sm:w-11 md:w-10')
    : (narrowColumns ? 'w-10 sm:w-12 md:w-10' : 'w-12 sm:w-14 md:w-12')
  const cellSize = compact
    ? (narrowColumns
        ? 'w-8 h-11 text-lg sm:w-9 sm:h-12 sm:text-xl md:w-8 md:h-11 md:text-lg'
        : 'w-10 h-11 text-xl sm:w-11 sm:h-12 sm:text-2xl md:w-10 md:h-11 md:text-xl')
    : (narrowColumns
        ? 'w-10 h-14 text-xl sm:w-12 sm:h-14 sm:text-2xl md:w-10 md:h-14 md:text-xl'
        : 'w-12 h-14 text-2xl sm:w-14 sm:h-14 sm:text-3xl md:w-12 md:h-14 md:text-2xl')

  // Operator gutter (the "×" / "+" column to the left of the digits)
  const operatorWidthClass = compact ? 'w-5' : 'w-6'
  const operatorWidthRem = compact ? 1.25 : 1.5

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

    // Every column is the same width — one digit per place value.
    const getColWidth = (_visualIdx: number): string => colWidthClass

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
                    getColWidth(visualIdx),
                    'text-center text-[10px] font-medium text-gray-400'
                  )}
                >
                  {placeLabels[colIndex] || ''}
                </div>
              )
            })}
          </div>
        )}

        {/* Top annotation row. Addition only: carry digit (red). Subtraction's regroup
            annotations are NOT placed here — they sit in a dedicated row between operand1
            and operand2 so all rows keep identical column widths (preserving alignment). */}
        {problem.type !== 'subtraction' && (
          <div className={cn('flex justify-end', cellGap)} style={{ minHeight: compact ? '1.25rem' : '1.5rem' }}>
            {/* Empty space for operator column */}
            <div className={operatorWidthClass} />
            {Array.from({ length: maxDigits }, (_, visualIdx) => {
              const colIndex = maxDigits - 1 - visualIdx
              const carry = carries?.[colIndex]
              const showCarryBox = manualCarryMode && isActive && colIndex > 0

              return (
                <div
                  key={`carry-${visualIdx}`}
                  className={cn(
                    getColWidth(visualIdx),
                    'text-center flex items-center justify-center'
                  )}
                >
                  {showCarryBox ? (
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
                    <span className={cn('text-xs font-bold text-red-500', 'animate-pulse')}>
                      {carry}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        {/* First operand row - digit by digit. For subtraction, the donor digit
            shows a diagonal strike to indicate "this value is replaced by the row below". */}
        <div className={cn('flex justify-end font-mono font-bold tabular-nums', cellGap)}>
          {/* Empty space for operator column */}
          <div className={operatorWidthClass} />
          {Array.from({ length: maxDigits }, (_, visualIdx) => {
            const colIndex = maxDigits - 1 - visualIdx
            const digitChar = padded1[visualIdx] !== ' ' ? padded1[visualIdx] : ''
            const struck = problem.type === 'subtraction' &&
              (!!regroupStrikes?.[colIndex] || !!regroupAdds?.[colIndex])

            return (
              <div
                key={`op1-${visualIdx}`}
                className={cn(
                  getColWidth(visualIdx),
                  'text-center flex items-center justify-center relative',
                  smallFontSize
                )}
              >
                <span className={cn(struck && 'text-gray-400')}>{digitChar}</span>
                {struck && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={cn(
                      'block h-0.5 bg-amber-600 rotate-[-22deg]',
                      compact ? 'w-6' : 'w-8'
                    )} />
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Regrouped values row (subtraction only). Sits directly below the original top
            number. Each cell shows the new value used in subtraction:
              - donor column → shows the reduced digit (e.g. "3" when 4 donated 1)
              - receiver-only column → shows the original digit with a small "1" prefix
                so it visually reads as "13" (the +10 belongs to that place, not a separate carry)
              - chain column (received AND donated) → shows the strike value, since it already
                reflects both transformations.
            In optional mode (no helpers required), this row is hidden when no values
            are populated — child enters the answer directly with no visual scaffolding. */}
        {problem.type === 'subtraction'
         && (manualRegroupMode
             || regroupStrikes?.some(v => !!v)
             || regroupAdds?.some(v => !!v)) && (
          <div className={cn('flex justify-end font-mono font-bold tabular-nums', cellGap)}
               style={{ minHeight: compact ? '1.5rem' : '1.75rem' }}>
            {/* Empty space for operator column */}
            <div className={operatorWidthClass} />
            {Array.from({ length: maxDigits }, (_, visualIdx) => {
              const colIndex = maxDigits - 1 - visualIdx
              const strike = regroupStrikes?.[colIndex]
              const add = regroupAdds?.[colIndex]
              const needsStrike = regroupNeedsStrike?.includes(colIndex) ?? false
              const needsAdd = regroupNeedsAdd?.includes(colIndex) ?? false
              const colNeedsRegroup = needsStrike || needsAdd
              const colIsFilled = (!needsStrike || !!strike) && (!needsAdd || !!add)
              const showTapTarget = manualRegroupMode && isActive && colNeedsRegroup && !colIsFilled
              const originalDigit = padded1[visualIdx] !== ' ' ? padded1[visualIdx] : ''

              // What to display in the regrouped row for this column.
              // `strike` is the main (ones) digit of the final value; `add` ("1") is the
              // small place-value prefix shown ONLY when the final value is two-digit.
              // Composing them always yields the correct value: "13", "9", "15", "1", "12".
              let display: React.ReactNode = null
              if (strike != null || add != null) {
                display = (
                  <span className="text-amber-600 inline-flex items-baseline">
                    {add != null && (
                      <span className="text-[0.6em] leading-none mr-0.5">{add}</span>
                    )}
                    <span>{strike ?? originalDigit}</span>
                  </span>
                )
              }

              // Operation chip — derived from how the final value differs from the original
              // digit, so it is correct even for across-zero chain columns (received +10 AND
              // donated −1, netting a single-digit value like 9).
              const finalValue = strike != null ? (add != null ? 10 : 0) + Number(strike) : null
              const origValue = originalDigit !== '' ? Number(originalDigit) : null
              const diff = finalValue != null && origValue != null ? finalValue - origValue : 0
              const chipLabel = diff === 10
                ? '+10'         // pure receiver
                : diff === -1
                  ? '−1'        // pure donor
                  : diff > 0
                    ? '+10 −1'  // chain: received and donated
                    : null

              return (
                <div
                  key={`regroup-${visualIdx}`}
                  onClick={showTapTarget ? (e) => {
                    e.stopPropagation()
                    // Apply whatever this column needs — one tap fills both strike and add
                    // if both are required (chain case).
                    if (needsStrike) onRegroupStrikeTap?.(colIndex)
                    if (needsAdd) onRegroupAddTap?.(colIndex)
                  } : undefined}
                  className={cn(
                    getColWidth(visualIdx),
                    'text-center flex items-center justify-center relative',
                    smallFontSize,
                    showTapTarget && 'cursor-pointer touch-manipulation rounded-md border-2 border-dashed border-amber-300 bg-amber-50/40'
                  )}
                  title={showTapTarget ? 'Tap to regroup this column' : undefined}
                >
                  {display}
                  <AnimatePresence>
                    {showOperationChips && chipLabel && (
                      <motion.span
                        key="chip"
                        initial={{ opacity: 0, y: -4, scale: 0.6 }}
                        animate={{ opacity: 1, y: -22, scale: 1 }}
                        exit={{ opacity: 0, y: -28, scale: 0.6 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className={cn(
                          'absolute left-1/2 -translate-x-1/2 pointer-events-none',
                          'text-[10px] font-bold text-amber-700',
                          'bg-amber-100 border border-amber-300 rounded px-1 leading-tight',
                          'whitespace-nowrap'
                        )}
                      >
                        {chipLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}

        {/* Second operand row with operator */}
        <div className={cn('flex items-center font-mono font-bold tabular-nums', cellGap)}>
          <div className={cn(
            operatorWidthClass,
            compact ? 'text-base' : 'text-lg',
            'text-primary text-center flex-shrink-0'
          )}>
            {operator}
          </div>
          {Array.from({ length: maxDigits }, (_, visualIdx) => (
            <div
              key={`op2-${visualIdx}`}
              className={cn(
                getColWidth(visualIdx),
                'text-center flex items-center justify-center',
                smallFontSize
              )}
            >
              {padded2[visualIdx] !== ' ' ? padded2[visualIdx] : ''}
            </div>
          ))}
        </div>

        {/* Divider line — spans the operator gutter plus every digit column and the
            gaps between them, so it lines up exactly with the answer boxes below.
            All columns are the same width now, so this is a single clean sum. It is
            exact at the mobile (<640) and md: (≥768) breakpoints; the sm: breakpoint
            (640-767px, phone landscape) has a small imperceptible mismatch. */}
        <div className={cn('my-1 h-0.5 bg-primary', cellGap)} style={{
          width: `calc(${operatorWidthRem}rem + ${maxDigits} * ${colWidthRem}rem + ${maxDigits * cellGapPx}px)`
        }} />

        {/* Answer row - individual digit boxes */}
        <div className={cn('flex justify-end', cellGap)}>
          {/* Empty space for operator column */}
          <div className={operatorWidthClass} />
          {Array.from({ length: maxDigits }, (_, visualIdx) => {
            const colIndex = maxDigits - 1 - visualIdx // Visual L→R to column index (ones=0)
            const digit = columnDigits[colIndex]
            const isActiveCol = activeColumn === colIndex && isActive

            return (
              <div
                key={`ans-${visualIdx}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()                  // Activate this problem card
                  onColumnClick?.(colIndex)  // Focus the tapped column
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
                      : isActiveCol
                        ? 'border-orange-500 bg-orange-100 text-red-700 ring-2 ring-orange-400/50 shadow-sm'
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
        'relative rounded-lg border-2 p-4 cursor-pointer touch-manipulation transition-colors duration-100',
        getContainerStyles()
      )}
    >
      {/* Problem number badge */}
      <div className={cn(
        'absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold pointer-events-none',
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
          'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm pointer-events-none',
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        )}>
          {isCorrect ? '✓' : '✗'}
        </div>
      )}
    </div>
  )
}
