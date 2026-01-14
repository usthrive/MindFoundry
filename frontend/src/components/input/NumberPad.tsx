import { cn } from '@/lib/utils'

export interface NumberPadProps {
  onNumberClick: (num: number) => void
  onBackspace: () => void
  onClear: () => void
  onSubmit: () => void
  allowNegative?: boolean
  allowDecimal?: boolean
  allowFraction?: boolean
  disabled?: boolean
  className?: string
  /** Size variant: 'compact' for phones, 'medium' for tablets, 'large' for desktop */
  size?: 'compact' | 'medium' | 'large' | 'auto'
}

/**
 * Responsive NumberPad Component
 *
 * Adapts to device size:
 * - Phone (< 640px): Compact buttons, fills available width
 * - Tablet (640px - 1024px): Medium buttons, comfortable touch targets
 * - Desktop (> 1024px): Large buttons, keyboard input available
 *
 * Minimum touch target: 44x44px (Apple HIG recommendation)
 */
const NumberPad = ({
  onNumberClick,
  onBackspace,
  onClear,
  onSubmit,
  allowNegative = false,
  allowDecimal = false,
  allowFraction = false,
  disabled = false,
  className,
  size = 'auto',
}: NumberPadProps) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Size-based classes for number buttons
  // 'auto' uses responsive breakpoints, others are fixed sizes
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
        // Responsive: phone -> tablet -> desktop
        // Phone: 44px height (min touch target), fills grid
        // Tablet: 56px height
        // Desktop: 64px height
        return 'h-11 sm:h-14 lg:h-16 min-w-[44px] sm:min-w-[56px] lg:min-w-[64px] w-full text-lg sm:text-xl lg:text-2xl'
    }
  }

  // Size-based classes for action buttons
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

  // Gap sizes based on device
  const getGapClasses = () => {
    switch (size) {
      case 'compact':
        return 'gap-1.5'
      case 'medium':
        return 'gap-2.5'
      case 'large':
        return 'gap-3'
      case 'auto':
      default:
        return 'gap-1.5 sm:gap-2.5 lg:gap-3'
    }
  }

  const buttonSizeClasses = getButtonSizeClasses()
  const actionButtonSizeClasses = getActionButtonSizeClasses()
  const gapClasses = getGapClasses()

  // Common button base styles
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

  return (
    <div className={cn(
      'w-full',
      // Max width based on size
      size === 'compact' ? 'max-w-[200px]' :
      size === 'medium' ? 'max-w-[280px]' :
      size === 'large' ? 'max-w-[320px]' :
      'max-w-[200px] sm:max-w-[280px] lg:max-w-[320px]',
      className
    )}>
      {/* Number grid: 3×4 layout */}
      <div className={cn('grid grid-cols-3', gapClasses)}>
        {/* Numbers 1-9 */}
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className={cn(numberButtonBase, buttonSizeClasses)}
            type="button"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: special buttons */}
        {/* Left slot: Negative, Fraction, or empty */}
        {allowNegative ? (
          <button
            onClick={() => onNumberClick(-1)} // Signal for negative
            disabled={disabled}
            className={cn(specialButtonBase, buttonSizeClasses)}
            type="button"
          >
            −
          </button>
        ) : allowFraction ? (
          <button
            onClick={() => onNumberClick(-3)} // Signal for fraction slash
            disabled={disabled}
            className={cn(specialButtonBase, buttonSizeClasses)}
            type="button"
            title="Fraction (press / on keyboard)"
          >
            /
          </button>
        ) : (
          <div className={cn(buttonSizeClasses, 'invisible')} />
        )}

        {/* Zero button */}
        <button
          onClick={() => onNumberClick(0)}
          disabled={disabled}
          className={cn(numberButtonBase, buttonSizeClasses)}
          type="button"
        >
          0
        </button>

        {/* Right slot: Decimal or empty */}
        {allowDecimal ? (
          <button
            onClick={() => onNumberClick(-2)} // Signal for decimal
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

      {/* Action buttons below the number pad */}
      <div className={cn('mt-2 sm:mt-3 lg:mt-4 flex', gapClasses)}>
        {/* Clear button */}
        <button
          onClick={onClear}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl',
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
          <span className="text-lg sm:text-xl lg:text-2xl">C</span>
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Backspace button */}
        <button
          onClick={onBackspace}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl',
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
          <span className="text-lg sm:text-xl lg:text-2xl">⌫</span>
          <span className="hidden sm:inline">Delete</span>
        </button>

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl',
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
          <span className="text-lg sm:text-xl lg:text-2xl">✓</span>
          <span className="hidden sm:inline">Submit</span>
        </button>
      </div>
    </div>
  )
}

export default NumberPad
