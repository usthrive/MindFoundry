import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary/30 shadow-lg shadow-primary/25',
      secondary: 'bg-gradient-to-r from-secondary to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary/30 shadow-lg shadow-secondary/25',
      ghost: 'bg-transparent hover:bg-surface-hover text-text-primary focus:ring-gray-300',
      success: 'bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-success/30 shadow-lg shadow-success/25',
      error: 'bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-error/30 shadow-lg shadow-error/25',
    }

    const sizes = {
      sm: 'h-12 min-w-[48px] px-4 text-base', // 48px minimum touch target
      md: 'h-[60px] min-w-[60px] px-6 text-lg', // 60px ideal touch target
      lg: 'h-[72px] min-w-[72px] px-8 text-xl', // 72px large touch target
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
