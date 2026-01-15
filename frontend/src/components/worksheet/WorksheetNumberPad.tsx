import { cn } from '@/lib/utils'

export interface WorksheetNumberPadProps {
  onInput: (value: number | string) => void
  allowNegative?: boolean
  allowDecimal?: boolean
  allowFraction?: boolean
  disabled?: boolean
  /** Disable only the submit button (when not all questions answered) */
  submitDisabled?: boolean
  className?: string
  size?: 'compact' | 'medium' | 'large' | 'auto'
  /** Fixed to bottom of viewport */
  fixed?: boolean
}

/**
 * WorksheetNumberPad - A number pad for worksheet input with fixed positioning support
 *
 * Features:
 * - Sends string signals for special keys ('backspace', 'clear', 'negative', 'submit', etc.)
 * - Optional fixed positioning at bottom of viewport
 * - Dynamic button sizing based on viewport height
 * - Is designed to work with the WorksheetView component
 */
export default function WorksheetNumberPad({
  onInput,
  allowNegative = false,
  allowDecimal = false,
  allowFraction = false,
  disabled = false,
  submitDisabled = false,
  className,
  size = 'auto',
  fixed = false,
}: WorksheetNumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Dynamic sizing using viewport height for fixed mode
  // Button height: clamp(40px, 5.5vh, 48px) - compact scaling for fixed mode
  const getDynamicButtonClasses = () => {
    if (fixed) {
      // Smaller dynamic sizing for fixed mode
      return 'min-h-[40px] h-[clamp(40px,5.5vh,48px)] min-w-[44px] w-full text-[clamp(1rem,2vh,1.125rem)]'
    }
    return getButtonSizeClasses()
  }

  const getDynamicActionButtonClasses = () => {
    if (fixed) {
      return 'min-h-[36px] h-[clamp(36px,5vh,44px)] text-[clamp(0.75rem,1.8vh,0.875rem)]'
    }
    return getActionButtonSizeClasses()
  }

  // Size-based classes
  const getButtonSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'h-11 min-w-[44px] w-full text-lg'
      case 'medium':
        return 'h-14 min-w-[56px] w-full text-xl'
      case 'large':
        return 'h-16 min-w-[64px] w-full text-2xl'
      case 'auto':
      default:
        return 'h-11 sm:h-14 lg:h-16 min-w-[44px] sm:min-w-[56px] lg:min-w-[64px] w-full text-lg sm:text-xl lg:text-2xl'
    }
  }

  const getActionButtonSizeClasses = () => {
    switch (size) {
      case 'compact':
        return 'h-11 text-sm'
      case 'medium':
        return 'h-14 text-base'
      case 'large':
        return 'h-16 text-lg'
      case 'auto':
      default:
        return 'h-11 sm:h-14 lg:h-16 text-sm sm:text-base lg:text-lg'
    }
  }

  const getGapClasses = () => {
    switch (size) {
      case 'compact':
        return 'gap-1.5'
      case 'medium':
        return 'gap-2'
      case 'large':
        return 'gap-3'
      case 'auto':
      default:
        return fixed ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2.5 lg:gap-3'
    }
  }

  const buttonSizeClasses = getDynamicButtonClasses()
  const actionButtonSizeClasses = getDynamicActionButtonClasses()
  const gapClasses = getGapClasses()

  const numberButtonBase = cn(
    'flex items-center justify-center rounded-xl sm:rounded-2xl',
    'bg-white font-bold text-gray-900',
    'shadow-md transition-all duration-150',
    'hover:bg-gray-50 active:scale-95 active:shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 sm:focus:ring-4',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'touch-manipulation select-none'
  )

  const specialButtonBase = cn(
    'flex items-center justify-center rounded-xl sm:rounded-2xl',
    'bg-gray-100 font-bold text-gray-700',
    'shadow-md transition-all duration-150',
    'hover:bg-gray-200 active:scale-95 active:shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/40 sm:focus:ring-4',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'touch-manipulation select-none'
  )

  // Fixed container styles
  const fixedContainerClasses = fixed
    ? 'fixed bottom-0 left-0 right-0 bg-gray-50/95 backdrop-blur-sm border-t border-gray-200 p-2 sm:p-3 z-50 safe-area-pb'
    : ''

  // Inner content max-width
  const getMaxWidthClasses = () => {
    if (fixed) {
      // Compact width for fixed mode
      return 'max-w-[300px] sm:max-w-[360px] lg:max-w-[400px]'
    }
    switch (size) {
      case 'compact':
        return 'max-w-[200px]'
      case 'medium':
        return 'max-w-[280px]'
      case 'large':
        return 'max-w-[320px]'
      default:
        return 'max-w-[200px] sm:max-w-[280px] lg:max-w-[320px]'
    }
  }

  const content = (
    <div className={cn(
      'w-full mx-auto',
      getMaxWidthClasses(),
      !fixed && className
    )}>
      {/* Number grid: 3×4 layout */}
      <div className={cn('grid grid-cols-3', gapClasses)}>
        {/* Numbers 1-9 */}
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onInput(num)}
            disabled={disabled}
            className={cn(numberButtonBase, buttonSizeClasses)}
            type="button"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: special buttons */}
        {allowNegative ? (
          <button
            onClick={() => onInput('negative')}
            disabled={disabled}
            className={cn(specialButtonBase, buttonSizeClasses)}
            type="button"
            title="Toggle negative"
          >
            ±
          </button>
        ) : allowFraction ? (
          <button
            onClick={() => onInput('fraction')}
            disabled={disabled}
            className={cn(specialButtonBase, buttonSizeClasses)}
            type="button"
            title="Fraction"
          >
            /
          </button>
        ) : (
          <div className={cn(buttonSizeClasses, 'invisible')} />
        )}

        {/* Zero button */}
        <button
          onClick={() => onInput(0)}
          disabled={disabled}
          className={cn(numberButtonBase, buttonSizeClasses)}
          type="button"
        >
          0
        </button>

        {/* Decimal or empty */}
        {allowDecimal ? (
          <button
            onClick={() => onInput('decimal')}
            disabled={disabled}
            className={cn(specialButtonBase, buttonSizeClasses)}
            type="button"
          >
            .
          </button>
        ) : (
          <div className={cn(buttonSizeClasses, 'invisible')} />
        )}
      </div>

      {/* Action buttons: Clear, Backspace, and Submit */}
      <div className={cn('mt-1.5 sm:mt-2 flex', gapClasses)}>
        {/* Clear button */}
        <button
          onClick={() => onInput('clear')}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-xl sm:rounded-2xl',
            'bg-error/10 font-semibold text-error',
            'shadow-md transition-all duration-150',
            'hover:bg-error/20 active:scale-95 active:shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-error/40 sm:focus:ring-4',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none',
            actionButtonSizeClasses
          )}
          type="button"
        >
          <span className={fixed ? 'text-sm sm:text-base' : 'text-lg sm:text-xl lg:text-2xl'}>C</span>
        </button>

        {/* Backspace button */}
        <button
          onClick={() => onInput('backspace')}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-xl sm:rounded-2xl',
            'bg-gray-200 font-semibold text-gray-900',
            'shadow-md transition-all duration-150',
            'hover:bg-gray-300 active:scale-95 active:shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-gray-400 sm:focus:ring-4',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none',
            actionButtonSizeClasses
          )}
          type="button"
        >
          <span className={fixed ? 'text-sm sm:text-base' : 'text-lg sm:text-xl lg:text-2xl'}>⌫</span>
        </button>

        {/* Submit/Check button - disabled until all questions answered */}
        <button
          onClick={() => onInput('submit')}
          disabled={disabled || submitDisabled}
          className={cn(
            'flex flex-[1.5] items-center justify-center gap-1 rounded-xl sm:rounded-2xl',
            'bg-primary font-semibold text-white',
            'shadow-md transition-all duration-150',
            'hover:bg-primary/90 active:scale-95 active:shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 sm:focus:ring-4',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'touch-manipulation select-none',
            actionButtonSizeClasses
          )}
          type="button"
        >
          <span className={fixed ? 'text-sm sm:text-base' : 'text-lg sm:text-xl lg:text-2xl'}>✓</span>
          <span className="hidden sm:inline">Check</span>
        </button>
      </div>
    </div>
  )

  // Wrap in fixed container if needed
  if (fixed) {
    return (
      <div className={cn(fixedContainerClasses, className)}>
        {content}
      </div>
    )
  }

  return content
}
