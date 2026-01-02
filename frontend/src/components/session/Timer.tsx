import { useState, useEffect, useRef } from 'react'
import { formatTime, cn } from '@/lib/utils'

export interface TimerProps {
  isRunning?: boolean
  initialSeconds?: number
  onTick?: (seconds: number) => void
  className?: string
}

const Timer = ({
  isRunning = true,
  initialSeconds = 0,
  onTick,
  className,
}: TimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newValue = prev + 1
          onTick?.(newValue)
          return newValue
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, onTick])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xl">⏱️</span>
      <span className="font-mono text-xl font-semibold tabular-nums text-gray-900">
        {formatTime(seconds)}
      </span>
    </div>
  )
}

export default Timer
