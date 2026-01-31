/**
 * useSessionPersistence Hook
 *
 * Persists active session state to localStorage to prevent progress loss
 * when the user navigates away or refreshes the page.
 *
 * Features:
 * - Auto-save session state after each answer
 * - Auto-restore session on page load
 * - Clear session on completion
 * - Child-specific session storage
 */

import { useCallback } from 'react'
import type { KumonLevel, HintLevel } from '@/types'
import type { Problem } from '@/services/generators/types'

// Worksheet page state for persistence (mirrors WorksheetView's PageState)
// We define it here to avoid circular imports
export interface PersistedPageState {
  problems: Problem[]
  answers: Record<number, string>
  submitted: boolean
  results: Record<number, boolean>
  attemptCounts: Record<number, number>
  hintLevels: Record<number, HintLevel | null>
  lockedProblems: Record<number, boolean>
  firstAttemptResults: Record<number, boolean | null>
  correctedProblems: Record<number, boolean>
}

const STORAGE_KEY = 'mindfoundry_active_session'

// Answer record for a single problem
export interface AnswerRecord {
  answer: string
  isCorrect: boolean
  timeSpent: number // seconds for this problem
  attemptCount: number
  hintLevelReached: string | null
}

// Timer state to persist
export interface TimerState {
  startTime: number        // Unix timestamp when session started
  focusedTime: number      // Accumulated focused seconds
  awayTime: number         // Accumulated away seconds
  lastActiveTime: number   // Last time user was active (for calculating delta)
}

// Distraction record
export interface DistractionRecord {
  leftAt: number           // Unix timestamp when user left
  returnedAt: number       // Unix timestamp when user returned
  duration: number         // Duration in seconds
}

// Full persisted session structure
export interface PersistedSession {
  // Identifiers
  childId: string
  sessionId: string

  // Position
  level: KumonLevel
  worksheet: number
  questionIndex: number

  // Current problem being worked on (DEPRECATED - use worksheetPageState instead)
  currentProblem?: Problem

  // Full worksheet page state for complete restoration
  // This includes problems, answers, results, hints - everything needed to restore the exact state
  worksheetPageState?: PersistedPageState

  // Answers given (legacy - now tracked in worksheetPageState)
  answers: Record<number, AnswerRecord>

  // Timer state
  timer: TimerState

  // Distraction tracking
  distractions: DistractionRecord[]

  // Progress counters
  problemsCompleted: number
  problemsCorrect: number
  firstTryCorrect: number
  withHintsCorrect: number
  totalIncorrect: number

  // Metadata
  createdAt: number        // Unix timestamp when session started
  lastSavedAt: number      // Unix timestamp of last save
}

/**
 * Hook for managing session persistence to localStorage
 */
export function useSessionPersistence() {
  /**
   * Save session state to localStorage
   */
  const saveSession = useCallback((session: PersistedSession): void => {
    try {
      const sessionWithTimestamp = {
        ...session,
        lastSavedAt: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionWithTimestamp))
    } catch (error) {
      console.error('Failed to save session to localStorage:', error)
    }
  }, [])

  /**
   * Load session from localStorage
   * Returns null if no session exists or if session is for a different child
   */
  const loadSession = useCallback((childId?: string): PersistedSession | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const session: PersistedSession = JSON.parse(stored)

      // If childId is provided, only return session if it matches
      if (childId && session.childId !== childId) {
        return null
      }

      // Check if session is stale (older than 24 hours)
      const staleThreshold = 24 * 60 * 60 * 1000 // 24 hours in ms
      if (Date.now() - session.lastSavedAt > staleThreshold) {
        clearSession()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to load session from localStorage:', error)
      return null
    }
  }, [])

  /**
   * Clear session from localStorage
   */
  const clearSession = useCallback((): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error)
    }
  }, [])

  /**
   * Check if an active session exists for the given child
   */
  const hasActiveSession = useCallback((childId: string): boolean => {
    const session = loadSession(childId)
    return session !== null
  }, [loadSession])

  /**
   * Create initial timer state
   */
  const createInitialTimerState = useCallback((): TimerState => {
    const now = Date.now()
    return {
      startTime: now,
      focusedTime: 0,
      awayTime: 0,
      lastActiveTime: now
    }
  }, [])

  /**
   * Create a new session object with initial values
   */
  const createNewSession = useCallback((
    childId: string,
    sessionId: string,
    level: KumonLevel,
    worksheet: number
  ): PersistedSession => {
    const now = Date.now()
    return {
      childId,
      sessionId,
      level,
      worksheet,
      questionIndex: 0,
      answers: {},
      timer: createInitialTimerState(),
      distractions: [],
      problemsCompleted: 0,
      problemsCorrect: 0,
      firstTryCorrect: 0,
      withHintsCorrect: 0,
      totalIncorrect: 0,
      createdAt: now,
      lastSavedAt: now
    }
  }, [createInitialTimerState])

  /**
   * Update session with a new answer
   */
  const recordAnswer = useCallback((
    session: PersistedSession,
    questionIndex: number,
    answer: AnswerRecord
  ): PersistedSession => {
    return {
      ...session,
      answers: {
        ...session.answers,
        [questionIndex]: answer
      },
      questionIndex: questionIndex + 1,
      problemsCompleted: session.problemsCompleted + 1,
      problemsCorrect: session.problemsCorrect + (answer.isCorrect ? 1 : 0),
      firstTryCorrect: session.firstTryCorrect + (answer.isCorrect && answer.attemptCount === 1 ? 1 : 0),
      withHintsCorrect: session.withHintsCorrect + (answer.isCorrect && answer.hintLevelReached ? 1 : 0),
      totalIncorrect: session.totalIncorrect + (!answer.isCorrect ? 1 : 0)
    }
  }, [])

  /**
   * Record a distraction (when user left and returned)
   */
  const recordDistraction = useCallback((
    session: PersistedSession,
    leftAt: number,
    returnedAt: number
  ): PersistedSession => {
    const duration = Math.floor((returnedAt - leftAt) / 1000) // Convert to seconds

    return {
      ...session,
      distractions: [
        ...session.distractions,
        { leftAt, returnedAt, duration }
      ],
      timer: {
        ...session.timer,
        awayTime: session.timer.awayTime + duration
      }
    }
  }, [])

  /**
   * Update focused time (call this periodically while user is active)
   */
  const updateFocusedTime = useCallback((
    session: PersistedSession,
    additionalSeconds: number
  ): PersistedSession => {
    return {
      ...session,
      timer: {
        ...session.timer,
        focusedTime: session.timer.focusedTime + additionalSeconds,
        lastActiveTime: Date.now()
      }
    }
  }, [])

  return {
    // Core operations
    saveSession,
    loadSession,
    clearSession,
    hasActiveSession,

    // Session creation
    createNewSession,
    createInitialTimerState,

    // Session updates
    recordAnswer,
    recordDistraction,
    updateFocusedTime
  }
}

export default useSessionPersistence
