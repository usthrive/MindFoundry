/**
 * useVisibilityTracking Hook
 *
 * Tracks document visibility changes to detect when the user
 * backgrounds or switches away from the app.
 *
 * Features:
 * - Detects when app becomes hidden (backgrounded)
 * - Detects when app becomes visible again
 * - Tracks total away time and distraction count
 * - Provides callbacks for visibility changes
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface VisibilityState {
  isVisible: boolean
  awayTime: number              // Total accumulated away time in seconds
  distractionCount: number      // Number of times app was backgrounded
  lastDistraction: {
    duration: number            // Duration of last distraction in seconds
    returnedAt: number          // Timestamp when user returned
  } | null
}

export interface UseVisibilityTrackingOptions {
  /** Called when app becomes hidden */
  onBecameHidden?: () => void

  /** Called when app becomes visible, with duration away in seconds */
  onBecameVisible?: (awayDurationSeconds: number) => void

  /** Minimum away duration (ms) to count as a distraction (default: 3000ms = 3 seconds) */
  minDistractionDuration?: number

  /** Whether tracking is enabled (default: true) */
  enabled?: boolean
}

/**
 * Hook for tracking document visibility changes
 */
export function useVisibilityTracking(options: UseVisibilityTrackingOptions = {}) {
  const {
    onBecameHidden,
    onBecameVisible,
    minDistractionDuration = 3000, // 3 seconds
    enabled = true
  } = options

  // State
  const [state, setState] = useState<VisibilityState>({
    isVisible: typeof document !== 'undefined' ? !document.hidden : true,
    awayTime: 0,
    distractionCount: 0,
    lastDistraction: null
  })

  // Refs to track when user left (to calculate duration)
  const leftAtRef = useRef<number | null>(null)
  const callbacksRef = useRef({ onBecameHidden, onBecameVisible })

  // Keep callbacks ref up to date
  useEffect(() => {
    callbacksRef.current = { onBecameHidden, onBecameVisible }
  }, [onBecameHidden, onBecameVisible])

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return

    const isNowVisible = !document.hidden

    if (!isNowVisible) {
      // User left - record the time
      leftAtRef.current = Date.now()

      // Call the hidden callback
      callbacksRef.current.onBecameHidden?.()

      setState(prev => ({
        ...prev,
        isVisible: false
      }))
    } else {
      // User returned
      const returnedAt = Date.now()
      const leftAt = leftAtRef.current

      if (leftAt) {
        const awayDurationMs = returnedAt - leftAt
        const awayDurationSeconds = Math.floor(awayDurationMs / 1000)

        // Only count as distraction if away for longer than minimum
        const countsAsDistraction = awayDurationMs >= minDistractionDuration

        // Call the visible callback with duration
        callbacksRef.current.onBecameVisible?.(awayDurationSeconds)

        setState(prev => ({
          isVisible: true,
          awayTime: prev.awayTime + awayDurationSeconds,
          distractionCount: countsAsDistraction
            ? prev.distractionCount + 1
            : prev.distractionCount,
          lastDistraction: countsAsDistraction
            ? { duration: awayDurationSeconds, returnedAt }
            : prev.lastDistraction
        }))
      } else {
        setState(prev => ({
          ...prev,
          isVisible: true
        }))
      }

      // Reset the leftAt ref
      leftAtRef.current = null
    }
  }, [enabled, minDistractionDuration])

  // Set up visibility change listener
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return

    // Set initial state
    setState(prev => ({
      ...prev,
      isVisible: !document.hidden
    }))

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, handleVisibilityChange])

  // Reset tracking (useful when starting a new session)
  const resetTracking = useCallback(() => {
    leftAtRef.current = null
    setState({
      isVisible: typeof document !== 'undefined' ? !document.hidden : true,
      awayTime: 0,
      distractionCount: 0,
      lastDistraction: null
    })
  }, [])

  // Get timestamp when user left (if currently away)
  const getLeftAt = useCallback((): number | null => {
    return leftAtRef.current
  }, [])

  return {
    ...state,
    resetTracking,
    getLeftAt
  }
}

export default useVisibilityTracking
