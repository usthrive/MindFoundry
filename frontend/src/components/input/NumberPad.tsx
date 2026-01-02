import { cn } from '@/lib/utils'

export interface NumberPadProps {
  onNumberClick: (num: number) => void
  onBackspace: () => void
  onClear: () => void
  onSubmit: () => void
  allowNegative?: boolean
  allowDecimal?: boolean
  disabled?: boolean
  className?: string
}

const NumberPad = ({
  onNumberClick,
  onBackspace,
  onClear,
  onSubmit,
  allowNegative = false,
  allowDecimal = false,
  disabled = false,
  className,
}: NumberPadProps) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className={cn('w-full max-w-sm', className)}>
      {/* Number grid: 3×4 layout */}
      <div className="grid grid-cols-3 gap-3">
        {/* Numbers 1-9 */}
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className={cn(
              'flex h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px] items-center justify-center rounded-2xl',
              'bg-white text-xl sm:text-2xl font-bold text-gray-900',
              'shadow-md transition-all',
              'hover:bg-gray-50 active:scale-95',
              'focus:outline-none focus:ring-4 focus:ring-primary/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'touch-manipulation select-none'
            )}
            type="button"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: special buttons */}
        {/* Negative button (if allowed) or empty space */}
        {allowNegative ? (
          <button
            onClick={() => onNumberClick(-1)} // Signal for negative
            disabled={disabled}
            className={cn(
              'flex h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px] items-center justify-center rounded-2xl',
              'bg-gray-100 text-xl sm:text-2xl font-bold text-gray-700',
              'shadow-md transition-all',
              'hover:bg-gray-200 active:scale-95',
              'focus:outline-none focus:ring-4 focus:ring-primary/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'touch-manipulation select-none'
            )}
            type="button"
          >
            −
          </button>
        ) : (
          <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px]" /> // Empty space
        )}

        {/* Zero button */}
        <button
          onClick={() => onNumberClick(0)}
          disabled={disabled}
          className={cn(
            'flex h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px] items-center justify-center rounded-2xl',
            'bg-white text-xl sm:text-2xl font-bold text-gray-900',
            'shadow-md transition-all',
            'hover:bg-gray-50 active:scale-95',
            'focus:outline-none focus:ring-4 focus:ring-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none'
          )}
          type="button"
        >
          0
        </button>

        {/* Decimal button (if allowed) or empty space */}
        {allowDecimal ? (
          <button
            onClick={() => onNumberClick(-2)} // Signal for decimal
            disabled={disabled}
            className={cn(
              'flex h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px] items-center justify-center rounded-2xl',
              'bg-gray-100 text-xl sm:text-2xl font-bold text-gray-700',
              'shadow-md transition-all',
              'hover:bg-gray-200 active:scale-95',
              'focus:outline-none focus:ring-4 focus:ring-primary/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'touch-manipulation select-none'
            )}
            type="button"
          >
            .
          </button>
        ) : (
          <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-[60px] md:w-[60px]" /> // Empty space
        )}
      </div>

      {/* Action buttons below the number pad */}
      <div className="mt-4 flex gap-2 sm:gap-3">
        {/* Clear button */}
        <button
          onClick={onClear}
          disabled={disabled}
          className={cn(
            'flex h-12 sm:h-14 md:h-[60px] flex-1 items-center justify-center gap-1 sm:gap-2 rounded-2xl',
            'bg-error/10 text-sm sm:text-base md:text-lg font-semibold text-error',
            'shadow-md transition-all',
            'hover:bg-error/20 active:scale-95',
            'focus:outline-none focus:ring-4 focus:ring-error/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none'
          )}
          type="button"
        >
          <span className="text-xl sm:text-2xl">C</span>
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Backspace button */}
        <button
          onClick={onBackspace}
          disabled={disabled}
          className={cn(
            'flex h-12 sm:h-14 md:h-[60px] flex-1 items-center justify-center gap-1 sm:gap-2 rounded-2xl',
            'bg-gray-200 text-sm sm:text-base md:text-lg font-semibold text-gray-900',
            'shadow-md transition-all',
            'hover:bg-gray-300 active:scale-95',
            'focus:outline-none focus:ring-4 focus:ring-gray-300',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none'
          )}
          type="button"
        >
          <span className="text-xl sm:text-2xl">⌫</span>
          <span className="hidden sm:inline">Delete</span>
        </button>

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={cn(
            'flex h-12 sm:h-14 md:h-[60px] flex-1 items-center justify-center gap-1 sm:gap-2 rounded-2xl',
            'bg-primary text-sm sm:text-base md:text-lg font-semibold text-white',
            'shadow-md transition-all',
            'hover:bg-primary/90 active:scale-95',
            'focus:outline-none focus:ring-4 focus:ring-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none'
          )}
          type="button"
        >
          <span className="text-xl sm:text-2xl">✓</span>
          <span className="hidden sm:inline">Submit</span>
        </button>
      </div>
    </div>
  )
}

export default NumberPad
