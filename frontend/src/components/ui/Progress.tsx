import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// Linear Progress Bar
export interface LinearProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ className, value, max = 100, showLabel = false, variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const variants = {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 text-center text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)

LinearProgress.displayName = 'LinearProgress'

// Circular Progress
export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  max?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    className,
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    showLabel = true,
    variant = 'default',
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    const variants = {
      default: 'stroke-primary',
      success: 'stroke-success',
      warning: 'stroke-warning',
      error: 'stroke-error',
    }

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="stroke-gray-200"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={cn('transition-all duration-300 ease-out', variants[variant])}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
            <span className="text-xs text-gray-600">
              {value}/{max}
            </span>
          </div>
        )}
      </div>
    )
  }
)

CircularProgress.displayName = 'CircularProgress'

// Session Progress Indicators (for problem tracking)
export interface SessionIndicatorsProps extends HTMLAttributes<HTMLDivElement> {
  total: number
  completed: number
  correct: number
}

export const SessionIndicators = forwardRef<HTMLDivElement, SessionIndicatorsProps>(
  ({ className, total, completed, correct, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-1.5', className)}
        {...props}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < completed
          const isCorrect = index < correct

          return (
            <div
              key={index}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                isCompleted
                  ? isCorrect
                    ? 'bg-success'
                    : 'bg-error'
                  : 'bg-gray-200'
              )}
            />
          )
        })}
      </div>
    )
  }
)

SessionIndicators.displayName = 'SessionIndicators'
