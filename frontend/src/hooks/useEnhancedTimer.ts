/**
 * useEnhancedTimer Hook
 *
 * Enhanced timer that tracks both focused time (when app is visible)
 * and away time (when app is backgrounded).
 *
 * Features:
 * - Tracks focused time vs away time separately
 * - Pauses when app is backgrounded
 * - Resumes when app becomes visible
 * - Calculates focus score (focused / total)
 * - Can be restored from persisted state
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useVisibilityTracking } from './useVisibilityTracking'
import type { TimerState } from './useSessionPersistence'

export interface EnhancedTimerState {
  focusedTime: number     // Seconds when app was visible
  awayTime: number        // Seconds when app was hidden
  totalTime: number       // focusedTime + awayTime
  isPaused: boolean       // Whether timer is currently paused
  focusScore: number      // Percentage (0-100) of time focused
}

export interface UseEnhancedTimerOptions {
  /** Initial timer state (for restoring from persistence) */
  initialState?: Partial<TimerState>

  /** Called when visibility changes */
  onVisibilityChange?: (isVisible: boolean, awayDurationSeconds?: number) => void

  /** Called on each timer tick (every second) */
  onTick?: (state: EnhancedTimerState) => void

  /** Whether timer should auto-start (default: true) */
  autoStart?: boolean
}

/**
 * Hook for enhanced timer with focus tracking
 */
export function useEnhancedTimer(options: UseEnhancedTimerOptions = {}) {
  const {
    initialState,
    onVisibilityChange,
    onTick,
    autoStart = true
  } = options

  // Timer state
  const [focusedTime, setFocusedTime] = useState(initialState?.focusedTime ?? 0)
  const [awayTime, setAwayTime] = useState(initialState?.awayTime ?? 0)
  const [isPaused, setIsPaused] = useState(!autoStart)
  const [isRunning, setIsRunning] = useState(autoStart)

  // Refs for interval and callbacks
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastTickRef = useRef<number>(Date.now())
  const onTickRef = useRef(onTick)

  // Keep callback ref up to date
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Calculate derived values
  const totalTime = focusedTime + awayTime
  const focusScore = totalTime > 0 ? Math.round((focusedTime / totalTime) * 100) : 100

  // Current state object
  const currentState: EnhancedTimerState = {
    focusedTime,
    awayTime,
    totalTime,
    isPaused,
    focusScore
  }

  // Handle visibility changes
  const handleBecameHidden = useCallback(() => {
    setIsPaused(true)
    onVisibilityChange?.(false)
  }, [onVisibilityChange])

  const handleBecameVisible = useCallback((awayDurationSeconds: number) => {
    if (isRunning) {
      setIsPaused(false)
    }
    setAwayTime(prev => prev + awayDurationSeconds)
    onVisibilityChange?.(true, awayDurationSeconds)
  }, [isRunning, onVisibilityChange])

  // Use visibility tracking
  const {
    isVisible,
    distractionCount,
    lastDistraction,
    resetTracking: resetVisibilityTracking
  } = useVisibilityTracking({
    onBecameHidden: handleBecameHidden,
    onBecameVisible: handleBecameVisible,
    enabled: isRunning
  })

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Start the interval
    lastTickRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - lastTickRef.current) / 1000)

      if (elapsed > 0) {
        lastTickRef.current = now
        setFocusedTime(prev => {
          const newFocusedTime = prev + elapsed
          // Call onTick with updated state
          onTickRef.current?.({
            focusedTime: newFocusedTime,
            awayTime,
            totalTime: newFocusedTime + awayTime,
            isPaused: false,
            focusScore: Math.round((newFocusedTime / (newFocusedTime + awayTime)) * 100)
          })
          return newFocusedTime
        })
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isPaused, awayTime])

  // Start the timer
  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
    lastTickRef.current = Date.now()
  }, [])

  // Stop the timer completely
  const stop = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Pause the timer (still tracking but not incrementing focused time)
  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  // Resume the timer
  const resume = useCallback(() => {
    if (isRunning) {
      setIsPaused(false)
      lastTickRef.current = Date.now()
    }
  }, [isRunning])

  // Reset the timer to initial state
  const reset = useCallback((newInitialState?: Partial<TimerState>) => {
    setFocusedTime(newInitialState?.focusedTime ?? 0)
    setAwayTime(newInitialState?.awayTime ?? 0)
    setIsPaused(!autoStart)
    setIsRunning(autoStart)
    lastTickRef.current = Date.now()
    resetVisibilityTracking()
  }, [autoStart, resetVisibilityTracking])

  // Get timer state for persistence
  const getTimerState = useCallback((): TimerState => {
    return {
      startTime: initialState?.startTime ?? Date.now() - (totalTime * 1000),
      focusedTime,
      awayTime,
      lastActiveTime: Date.now()
    }
  }, [initialState?.startTime, focusedTime, awayTime, totalTime])

  // Restore timer from persisted state
  const restoreFromState = useCallback((state: TimerState) => {
    setFocusedTime(state.focusedTime)
    setAwayTime(state.awayTime)
    lastTickRef.current = Date.now()
  }, [])

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Format time as more detailed string
  const formatTimeDetailed = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (secs === 0) {
      return `${mins} minute${mins !== 1 ? 's' : ''}`
    }
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`
  }, [])

  return {
    // State
    focusedTime,
    awayTime,
    totalTime,
    isPaused,
    isRunning,
    focusScore,
    isVisible,
    distractionCount,
    lastDistraction,

    // Controls
    start,
    stop,
    pause,
    resume,
    reset,

    // Persistence helpers
    getTimerState,
    restoreFromState,

    // Formatting
    formatTime,
    formatTimeDetailed,

    // Current state object
    currentState
  }
}

export default useEnhancedTimer
