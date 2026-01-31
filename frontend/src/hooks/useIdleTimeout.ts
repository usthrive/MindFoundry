/**
 * useIdleTimeout Hook
 *
 * Tracks user activity and triggers callbacks when user is idle for too long.
 * Used to auto-terminate forgotten sessions and show "are you still there?" warnings.
 *
 * Features:
 * - Tracks clicks, keypresses, touches, and mouse movements
 * - Optional warning callback before timeout
 * - Reset functionality for when user continues
 * - Pause/resume for when session is intentionally paused
 */

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseIdleTimeoutOptions {
  /** Total timeout duration in milliseconds (e.g., 15 min = 900000ms) */
  timeoutMs: number
  /** Optional: When to show warning (e.g., 12 min = 720000ms). If not set, no warning. */
  warningMs?: number
  /** Callback when warning threshold is reached */
  onWarning?: () => void
  /** Callback when full timeout is reached */
  onTimeout?: () => void
  /** Whether the timeout tracking is enabled (default: true) */
  enabled?: boolean
}

interface UseIdleTimeoutReturn {
  /** Reset the idle timer (call when user continues after warning) */
  reset: () => void
  /** Pause idle tracking (e.g., during intentional pause) */
  pause: () => void
  /** Resume idle tracking */
  resume: () => void
  /** Whether currently paused */
  isPaused: boolean
  /** Seconds remaining until timeout (for countdown display) */
  secondsUntilTimeout: number
  /** Whether warning has been triggered */
  isWarning: boolean
}

export function useIdleTimeout({
  timeoutMs,
  warningMs,
  onWarning,
  onTimeout,
  enabled = true
}: UseIdleTimeoutOptions): UseIdleTimeoutReturn {
  const lastActivityRef = useRef<number>(Date.now())
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [isPaused, setIsPaused] = useState(false)
  const [isWarning, setIsWarning] = useState(false)
  const [secondsUntilTimeout, setSecondsUntilTimeout] = useState(Math.floor(timeoutMs / 1000))

  const warningTriggeredRef = useRef(false)

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    if (warningIdRef.current) {
      clearTimeout(warningIdRef.current)
      warningIdRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  // Start the countdown display (updates every second)
  const startCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current
      const remaining = Math.max(0, Math.floor((timeoutMs - elapsed) / 1000))
      setSecondsUntilTimeout(remaining)

      if (remaining <= 0) {
        clearInterval(countdownIntervalRef.current!)
        countdownIntervalRef.current = null
      }
    }, 1000)
  }, [timeoutMs])

  // Schedule warning and timeout
  const scheduleTimers = useCallback(() => {
    clearAllTimers()

    if (!enabled || isPaused) return

    lastActivityRef.current = Date.now()
    warningTriggeredRef.current = false
    setIsWarning(false)
    setSecondsUntilTimeout(Math.floor(timeoutMs / 1000))

    // Schedule warning (if configured)
    if (warningMs && onWarning && warningMs < timeoutMs) {
      warningIdRef.current = setTimeout(() => {
        if (!warningTriggeredRef.current) {
          warningTriggeredRef.current = true
          setIsWarning(true)
          onWarning()
          startCountdown() // Start visible countdown after warning
        }
      }, warningMs)
    }

    // Schedule timeout
    timeoutIdRef.current = setTimeout(() => {
      onTimeout?.()
      setIsWarning(false)
    }, timeoutMs)

  }, [enabled, isPaused, timeoutMs, warningMs, onWarning, onTimeout, clearAllTimers, startCountdown])

  // Reset the timer (user showed activity)
  const handleActivity = useCallback(() => {
    if (isPaused || !enabled) return

    // Don't reset if we're in warning mode - user needs to explicitly click "Continue"
    if (isWarning) return

    lastActivityRef.current = Date.now()
    setSecondsUntilTimeout(Math.floor(timeoutMs / 1000))

    // Reschedule timers
    scheduleTimers()
  }, [isPaused, enabled, isWarning, timeoutMs, scheduleTimers])

  // Explicit reset (e.g., user clicked "I'm still here")
  const reset = useCallback(() => {
    setIsWarning(false)
    warningTriggeredRef.current = false
    scheduleTimers()
  }, [scheduleTimers])

  // Pause tracking
  const pause = useCallback(() => {
    setIsPaused(true)
    clearAllTimers()
  }, [clearAllTimers])

  // Resume tracking
  const resume = useCallback(() => {
    setIsPaused(false)
    scheduleTimers()
  }, [scheduleTimers])

  // Set up event listeners for activity tracking
  useEffect(() => {
    if (!enabled) {
      clearAllTimers()
      return
    }

    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove', 'scroll']

    // Throttle mousemove to avoid excessive calls
    let mouseMoveTimeout: ReturnType<typeof setTimeout> | null = null
    const throttledMouseMove = () => {
      if (mouseMoveTimeout) return
      mouseMoveTimeout = setTimeout(() => {
        handleActivity()
        mouseMoveTimeout = null
      }, 1000) // Throttle to once per second
    }

    const handleEvent = (e: Event) => {
      if (e.type === 'mousemove') {
        throttledMouseMove()
      } else {
        handleActivity()
      }
    }

    // Add listeners
    events.forEach(event => {
      document.addEventListener(event, handleEvent, { passive: true })
    })

    // Initial timer schedule
    scheduleTimers()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleEvent)
      })
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout)
      clearAllTimers()
    }
  }, [enabled, handleActivity, scheduleTimers, clearAllTimers])

  return {
    reset,
    pause,
    resume,
    isPaused,
    secondsUntilTimeout,
    isWarning
  }
}

export default useIdleTimeout
