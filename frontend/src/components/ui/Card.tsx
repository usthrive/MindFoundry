import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', rounded = 'lg', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/90 backdrop-blur-sm shadow-sm',
      elevated: 'bg-white shadow-xl shadow-gray-200/50',
      bordered: 'bg-white/90 backdrop-blur-sm border-2 border-primary/10',
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const roundness = {
      md: 'rounded-2xl', // 16px
      lg: 'rounded-3xl', // 24px
      xl: 'rounded-[32px]', // 32px
    }

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          paddings[padding],
          roundness[rounded],
          'transition-shadow',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
