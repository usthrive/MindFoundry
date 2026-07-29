import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import HandwritingAnswerStrip from './HandwritingAnswerStrip'

interface ScratchPadAnswerBarProps {
  /** Current answer value */
  answer: string
  /** Called when answer changes */
  onAnswerChange: (answer: string) => void
  /** Called when user taps Done - submits the answer back to the worksheet */
  onDone: () => void
  /** Whether the answer can be edited */
  disabled?: boolean
  className?: string
  /** Offer handwriting as well as the buttons. */
  allowHandwriting?: boolean
  /** How many characters the answer may have (one writing box each). */
  handwritingCells?: number
  /** Characters the recogniser should consider. */
  handwritingChars?: string[]
  /** Keys the per-child learned handwriting. */
  childId?: string
}

/**
 * ScratchPadAnswerBar - Compact horizontal numpad for entering answers within the scratch pad overlay.
 *
 * Displays digits 0-9 in a single row with backspace and Done buttons.
 * Shows the current answer above the numpad row.
 */
export default function ScratchPadAnswerBar({
  answer,
  onAnswerChange,
  onDone,
  disabled = false,
  className,
  allowHandwriting = false,
  handwritingCells = 4,
  handwritingChars,
  childId = 'default',
}: ScratchPadAnswerBarProps) {
  const [localAnswer, setLocalAnswer] = useState(answer)
  // Handwriting is the default when it is offered — a child doing their working with
  // a finger or a pencil should not have to switch to buttons to write the answer.
  const [mode, setMode] = useState<'write' | 'keys'>(allowHandwriting ? 'write' : 'keys')

  // Sync with external answer
  useEffect(() => {
    setLocalAnswer(answer)
  }, [answer])

  const handleDigit = (digit: number) => {
    const newAnswer = localAnswer + String(digit)
    setLocalAnswer(newAnswer)
    onAnswerChange(newAnswer)
  }

  const handleBackspace = () => {
    const newAnswer = localAnswer.slice(0, -1)
    setLocalAnswer(newAnswer)
    onAnswerChange(newAnswer)
  }

  const handleClear = () => {
    setLocalAnswer('')
    onAnswerChange('')
  }

  const buttonBase = cn(
    'flex items-center justify-center rounded-lg',
    'font-bold text-gray-900 bg-white',
    'shadow-sm border border-gray-200 transition-all duration-100',
    'active:scale-95 active:bg-gray-50',
    'touch-manipulation select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-[40px] h-[40px]'
  )

  if (allowHandwriting && mode === 'write') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <HandwritingAnswerStrip
          cellCount={handwritingCells}
          allowedChars={handwritingChars}
          childId={childId}
          disabled={disabled}
          onUseKeypad={() => setMode('keys')}
          onConfirm={(text) => {
            setLocalAnswer(text)
            onAnswerChange(text)
            onDone()
          }}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {allowHandwriting && (
        <button
          type="button"
          onClick={() => setMode('write')}
          className="self-center text-xs font-semibold text-primary underline touch-manipulation"
        >
          ✎ Write it instead
        </button>
      )}
      {/* Answer display */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500 font-medium">Answer:</span>
        <div className={cn(
          'min-w-[80px] px-4 py-1.5 rounded-lg border-2 text-center',
          'font-mono font-bold text-xl',
          localAnswer ? 'border-primary bg-blue-50 text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-400'
        )}>
          {localAnswer || '?'}
        </div>
      </div>

      {/* Single-row numpad: 1-9, 0, backspace, done */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            disabled={disabled}
            className={cn(buttonBase, 'flex-1 text-base')}
            type="button"
          >
            {digit}
          </button>
        ))}
        {/* Backspace */}
        <button
          onClick={handleBackspace}
          disabled={disabled || !localAnswer}
          className={cn(buttonBase, 'flex-1 text-sm bg-gray-100')}
          type="button"
          title="Backspace"
        >
          ⌫
        </button>
        {/* Clear */}
        <button
          onClick={handleClear}
          disabled={disabled || !localAnswer}
          className={cn(buttonBase, 'flex-1 text-sm bg-red-50 text-red-600 border-red-200')}
          type="button"
          title="Clear answer"
        >
          C
        </button>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className={cn(
          'w-full py-2.5 rounded-xl font-semibold text-white',
          'bg-primary shadow-md transition-all duration-150',
          'hover:bg-primary/90 active:scale-[0.98]',
          'touch-manipulation select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        disabled={disabled}
        type="button"
      >
        Done - Return to Worksheet
      </button>
    </div>
  )
}
