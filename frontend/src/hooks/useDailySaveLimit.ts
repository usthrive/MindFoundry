/**
 * useDailySaveLimit Hook
 *
 * Manages the daily "Save & Exit" limit for children.
 * Children can save their progress up to 2 times per day.
 *
 * Features:
 * - Fetches remaining saves on mount
 * - Provides function to use a save
 * - Updates state after each save
 * - Synced to database (per-child, cross-device)
 */

import { useState, useEffect, useCallback } from 'react'
import { getRemainingDailySaves, useDailySave } from '@/services/progressService'

interface UseDailySaveLimitOptions {
  /** The child's ID to track saves for */
  childId: string | undefined
  /** Whether to fetch saves on mount (default: true) */
  fetchOnMount?: boolean
}

interface UseDailySaveLimitReturn {
  /** Number of saves remaining today (0, 1, or 2) */
  savesRemaining: number
  /** Whether the child can save (savesRemaining > 0) */
  canSave: boolean
  /** Use one of the daily saves. Returns true if successful, false if failed/no saves */
  consumeSave: () => Promise<boolean>
  /** Refresh the saves count from the database */
  refresh: () => Promise<void>
  /** Whether currently loading */
  isLoading: boolean
}

const MAX_DAILY_SAVES = 2

export function useDailySaveLimit({
  childId,
  fetchOnMount = true
}: UseDailySaveLimitOptions): UseDailySaveLimitReturn {
  const [savesRemaining, setSavesRemaining] = useState<number>(MAX_DAILY_SAVES)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch current saves remaining
  const refresh = useCallback(async () => {
    if (!childId) {
      setSavesRemaining(MAX_DAILY_SAVES)
      return
    }

    setIsLoading(true)
    try {
      const remaining = await getRemainingDailySaves(childId)
      setSavesRemaining(remaining)
    } catch (error) {
      console.error('Error fetching daily saves:', error)
      // Default to allowing saves on error (be permissive)
      setSavesRemaining(MAX_DAILY_SAVES)
    } finally {
      setIsLoading(false)
    }
  }, [childId])

  // Fetch on mount
  useEffect(() => {
    if (fetchOnMount && childId) {
      refresh()
    }
  }, [fetchOnMount, childId, refresh])

  // Use one save
  const consumeSave = useCallback(async (): Promise<boolean> => {
    if (!childId) {
      console.error('Cannot save: no child ID')
      return false
    }

    if (savesRemaining <= 0) {
      console.warn('No saves remaining today')
      return false
    }

    setIsLoading(true)
    try {
      const remaining = await useDailySave(childId)

      if (remaining === -1) {
        // No saves remaining (race condition or limit reached)
        setSavesRemaining(0)
        return false
      }

      setSavesRemaining(remaining)
      return true
    } catch (error) {
      console.error('Error using daily save:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [childId, savesRemaining])

  return {
    savesRemaining,
    canSave: savesRemaining > 0,
    consumeSave,
    refresh,
    isLoading
  }
}

export default useDailySaveLimit
