import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export interface InputDisplayProps {
  value: string
  placeholder?: string
  showCursor?: boolean
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

const InputDisplay = ({
  value,
  placeholder = '?',
  showCursor = true,
  size = 'lg',
  className,
}: InputDisplayProps) => {
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    if (!showCursor) return

    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530) // Standard cursor blink rate

    return () => clearInterval(interval)
  }, [showCursor])

  const sizes = {
    md: 'text-2xl sm:text-3xl md:text-4xl min-h-[60px] sm:min-h-[70px] md:min-h-[80px]',
    lg: 'text-3xl sm:text-5xl md:text-6xl min-h-[70px] sm:min-h-[90px] md:min-h-[100px]',
    xl: 'text-4xl sm:text-6xl md:text-7xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px]',
  }

  const displayValue = value || placeholder
  const isEmpty = !value

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-3xl bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-lg',
        sizes[size],
        className
      )}
    >
      <div className="relative flex items-center">
        <span
          className={cn(
            'font-mono font-bold tabular-nums',
            isEmpty ? 'text-gray-300' : 'text-gray-900'
          )}
        >
          {displayValue}
        </span>
        {showCursor && !isEmpty && (
          <span
            className={cn(
              'ml-1 inline-block h-[0.8em] w-1 bg-primary transition-opacity',
              cursorVisible ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
    </div>
  )
}

export default InputDisplay
