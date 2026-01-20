/**
 * useVideoSuggestion - Hook for video suggestion logic
 * Phase 1.18: YouTube Video Integration
 *
 * Tracks consecutive mistakes and determines when to suggest videos.
 * Manages suggestion state and cooldowns.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Video, VideoSuggestion, VideoPreferences } from '@/types'
import {
  getVideoPreferences,
  canSuggestVideo,
  getBestVideoForConcept,
} from '@/services/videoService'

interface UseVideoSuggestionOptions {
  childId: string
  childAge: number
  conceptId: string
  conceptName?: string
  enabled?: boolean
}

interface VideoSuggestionState {
  consecutiveMistakes: number
  suggestion: VideoSuggestion | null
  showSuggestion: boolean
  preferences: VideoPreferences | null
  dismissedConcepts: Set<string>
}

// Default thresholds
const DEFAULT_MISTAKE_THRESHOLD = 3
const SUGGESTION_COOLDOWN_MS = 60000 // 1 minute cooldown after dismissal

export function useVideoSuggestion(options: UseVideoSuggestionOptions) {
  const { childId, childAge, conceptId, conceptName, enabled = true } = options

  const [state, setState] = useState<VideoSuggestionState>({
    consecutiveMistakes: 0,
    suggestion: null,
    showSuggestion: false,
    preferences: null,
    dismissedConcepts: new Set(),
  })

  const lastDismissalRef = useRef<number>(0)
  const fetchingRef = useRef<boolean>(false)

  // Load preferences on mount
  useEffect(() => {
    if (!childId) return

    getVideoPreferences(childId).then((prefs) => {
      setState((prev) => ({ ...prev, preferences: prefs }))
    })
  }, [childId])

  // Reset consecutive mistakes when concept changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      consecutiveMistakes: 0,
      showSuggestion: false,
      suggestion: null,
    }))
  }, [conceptId])

  // Record correct answer (resets streak)
  const recordCorrectAnswer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      consecutiveMistakes: 0,
      showSuggestion: false,
    }))
  }, [])

  // Record incorrect answer (increments streak)
  const recordIncorrectAnswer = useCallback(async () => {
    if (!enabled || fetchingRef.current) return

    setState((prev) => {
      const newMistakes = prev.consecutiveMistakes + 1
      return {
        ...prev,
        consecutiveMistakes: newMistakes,
      }
    })

    // Check if we should suggest a video
    const threshold = state.preferences?.suggestThreshold ?? DEFAULT_MISTAKE_THRESHOLD
    const newMistakeCount = state.consecutiveMistakes + 1

    if (newMistakeCount >= threshold) {
      // Check cooldown
      const timeSinceDismissal = Date.now() - lastDismissalRef.current
      if (timeSinceDismissal < SUGGESTION_COOLDOWN_MS) {
        return
      }

      // Check if concept was already dismissed this session
      if (state.dismissedConcepts.has(conceptId)) {
        return
      }

      // Check if we can suggest (daily limits, etc.)
      const canSuggest = await canSuggestVideo(childId)
      if (!canSuggest) {
        return
      }

      // Fetch best video for this concept
      fetchingRef.current = true
      try {
        const video = await getBestVideoForConcept(conceptId, childAge, 'short')

        if (video) {
          const suggestion: VideoSuggestion = {
            video,
            conceptId,
            conceptName: conceptName || conceptId.replace(/_/g, ' '),
            triggerType: 'struggle_detected',
            reason: `You've had ${newMistakeCount} attempts at this concept`,
            urgency: newMistakeCount >= 5 ? 'recommended' : 'suggested',
            message: getEncouragingMessage(newMistakeCount),
          }

          setState((prev) => ({
            ...prev,
            suggestion,
            showSuggestion: true,
          }))
        }
      } catch (err) {
        console.error('Failed to fetch video suggestion:', err)
      } finally {
        fetchingRef.current = false
      }
    }
  }, [
    enabled,
    childId,
    childAge,
    conceptId,
    conceptName,
    state.consecutiveMistakes,
    state.preferences,
    state.dismissedConcepts,
  ])

  // Dismiss current suggestion
  const dismissSuggestion = useCallback(() => {
    lastDismissalRef.current = Date.now()
    setState((prev) => ({
      ...prev,
      showSuggestion: false,
      dismissedConcepts: new Set([...prev.dismissedConcepts, conceptId]),
    }))
  }, [conceptId])

  // Accept suggestion (user wants to watch)
  const acceptSuggestion = useCallback((): Video | null => {
    const video = state.suggestion?.video || null
    setState((prev) => ({
      ...prev,
      showSuggestion: false,
      consecutiveMistakes: 0, // Reset after accepting help
    }))
    return video
  }, [state.suggestion])

  // Reset all state (e.g., when session ends)
  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      consecutiveMistakes: 0,
      suggestion: null,
      showSuggestion: false,
      dismissedConcepts: new Set(),
    }))
    lastDismissalRef.current = 0
    fetchingRef.current = false
  }, [])

  return {
    consecutiveMistakes: state.consecutiveMistakes,
    suggestion: state.suggestion,
    showSuggestion: state.showSuggestion,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    dismissSuggestion,
    acceptSuggestion,
    reset,
  }
}

// Helper to generate encouraging messages
function getEncouragingMessage(mistakes: number): string {
  if (mistakes >= 5) {
    return "Let's take a quick break and watch a helpful video!"
  } else if (mistakes >= 4) {
    return 'A short video might help you understand this better.'
  } else {
    return 'Would you like to watch a video explanation?'
  }
}

export default useVideoSuggestion
