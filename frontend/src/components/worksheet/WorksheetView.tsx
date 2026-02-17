import { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import WorksheetProblem from './WorksheetProblem'
import { MicroHint, VisualHint, FullTeaching } from '@/components/hints'
import CarryTransitionModal from './CarryTransitionModal'
import {
  getProblemsPerPage,
  getTotalPages,
  getGridLayout,
  getProblemSpacing,
  type QuestionsPerPageMode,
} from '@/utils/worksheetConfig'
import { generateProblem } from '@/services/sessionManager'
import type { Problem } from '@/services/generators/types'
import type { KumonLevel, HintLevel } from '@/types'
import type { Stroke } from '@/components/ui/ScratchPad'

/**
 * Per-problem attempt data for tracking and saving
 */
export interface ProblemAttemptData {
  problem: Problem
  answer: string
  isCorrect: boolean
  attemptsCount: number        // Total attempts (1 = first try)
  firstAttemptCorrect: boolean
  hintLevelReached: HintLevel | null
}

export interface WorksheetViewProps {
  level: KumonLevel
  worksheetNumber: number
  questionsPerPageMode?: QuestionsPerPageMode
  initialPageState?: PageState  // For session restoration - bypasses problem regeneration
  onPageComplete: (results: {
    correct: number
    total: number
    answers: Record<number, string>
    problemAttempts: ProblemAttemptData[]  // Added for DB saving
  }) => void
  onWorksheetComplete: (totalCorrect: number, totalProblems: number) => void
  onAnswerChange?: (problemIndex: number, answer: string) => void
  onAllAnsweredChange?: (allAnswered: boolean) => void
  onPageStateChange?: (pageState: PageState) => void  // Callback when page state changes (for persistence)
  sessionActive: boolean
}

export interface WorksheetViewRef {
  handleInput: (value: number | string) => void
  getActiveProblem: () => { problem: Problem; index: number; pageIndex: number; totalProblems: number } | null
  getScratchPadStrokes: (problemIndex: number) => Stroke[]
  setScratchPadStrokes: (problemIndex: number, strokes: Stroke[]) => void
  setAnswerFromScratchPad: (answer: string) => void
  navigateToNextProblem: () => { problem: Problem; index: number; pageIndex: number } | null
  navigateToPreviousProblem: () => { problem: Problem; index: number; pageIndex: number } | null
}

// Exported so it can be used for session persistence
export interface PageState {
  problems: Problem[]
  answers: Record<number, string>
  submitted: boolean
  results: Record<number, boolean>
  // Hint system state
  attemptCounts: Record<number, number>  // Tracks wrong attempts per problem
  hintLevels: Record<number, HintLevel | null>  // Current hint to show per problem
  lockedProblems: Record<number, boolean>  // Problems that can't be retried (after teaching)
  // First attempt tracking (for score display)
  firstAttemptResults: Record<number, boolean | null>  // null=not attempted, true/false=first result
  correctedProblems: Record<number, boolean>  // Problems fixed after hints
  // Column-by-column input state for vertical problems
  columnDigits: Record<number, (string | null)[]>  // per-problem array of column digits (index 0 = ones)
  activeColumns: Record<number, number>             // per-problem active column index (0 = ones)
  carries: Record<number, (string | null)[]>        // carry indicators per column
  // Scratch pad state
  scratchPadStrokes: Record<number, Stroke[]>
}

/**
 * Format answer for display - handles fraction objects and primitives
 */
const formatAnswer = (answer: unknown): string => {
  if (answer === null || answer === undefined) return '?'
  if (typeof answer === 'number') return answer.toString()
  if (typeof answer === 'string') return answer
  if (typeof answer === 'object' && 'numerator' in answer && 'denominator' in answer) {
    const frac = answer as { numerator: number; denominator: number }
    return `${frac.numerator}/${frac.denominator}`
  }
  return String(answer)
}

/**
 * Get the digit at a specific place value (0 = ones, 1 = tens, 2 = hundreds, etc.)
 */
function getDigitAtPlace(num: number, place: number): number {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10
}

/**
 * Compute the number of answer columns needed for a vertical problem.
 * Based on the correct answer length (handles cases like 99+99=198 where answer has more digits than operands).
 */
function getAnswerColumnCount(problem: Problem): number {
  if (problem.displayFormat !== 'vertical' || !problem.operands?.length) return 0
  const correctAnswer = typeof problem.correctAnswer === 'number' ? problem.correctAnswer : 0
  return Math.max(
    String(Math.abs(Math.round(correctAnswer))).length,
    ...problem.operands.map(op => String(Math.abs(op)).length)
  )
}

/**
 * Compute carry values for addition based on entered column digits.
 * Returns an array where index = column position, value = carry digit string or null.
 * Only computes carries up to the last column the child has filled.
 */
function computeCarries(problem: Problem, columns: (string | null)[]): (string | null)[] {
  if (!problem.operands || problem.type !== 'addition') return new Array(columns.length).fill(null)

  const [num1, num2] = problem.operands
  const carries: (string | null)[] = new Array(columns.length).fill(null)

  let carry = 0
  for (let col = 0; col < columns.length; col++) {
    if (columns[col] === null) break // Stop computing past where child has entered
    const d1 = getDigitAtPlace(num1, col)
    const d2 = getDigitAtPlace(num2, col)
    const sum = d1 + d2 + carry
    carry = Math.floor(sum / 10)
    if (carry > 0 && col + 1 < columns.length) {
      carries[col + 1] = String(carry)
    }
  }
  return carries
}

/**
 * Create a default (empty) set of column fields for PageState initialization.
 */
function emptyColumnState() {
  return {
    columnDigits: {} as Record<number, (string | null)[]>,
    activeColumns: {} as Record<number, number>,
    carries: {} as Record<number, (string | null)[]>,
    scratchPadStrokes: {} as Record<number, Stroke[]>,
  }
}

/**
 * Pre-initialize column state for all vertical problems on a page.
 * Ensures column-aligned digit boxes render immediately, not just after first interaction.
 */
function initColumnStateForProblems(problems: Problem[]) {
  const columnDigits: Record<number, (string | null)[]> = {}
  const activeColumns: Record<number, number> = {}
  const carries: Record<number, (string | null)[]> = {}

  problems.forEach((problem, index) => {
    if (problem.displayFormat === 'vertical') {
      const colCount = getAnswerColumnCount(problem)
      if (colCount > 0) {
        columnDigits[index] = new Array(colCount).fill(null)
        activeColumns[index] = 0
        carries[index] = new Array(colCount).fill(null)
      }
    }
  })

  return { columnDigits, activeColumns, carries, scratchPadStrokes: {} as Record<number, Stroke[]> }
}

/**
 * Determine if manual carry mode should be active for a given worksheet.
 * Auto-carries are used for the first ~20% of carry worksheets, then manual carries kick in.
 *
 * Level B: carry worksheets span 41-70 (30 worksheets), 20% = 6 worksheets
 * So manual carry activates at worksheet 47+
 */
function isManualCarryMode(level: string, worksheetNumber: number): boolean {
  // Level B: carry starts at worksheet 41, manual after 20% (≈ worksheet 47)
  if (level === 'B') {
    // 2-digit carry range: 41-70 → manual at 47+
    if (worksheetNumber >= 47 && worksheetNumber <= 70) return true
    // 3-digit range (71-100) always manual
    if (worksheetNumber >= 71 && worksheetNumber <= 100) return true
    return false
  }
  // For levels C+ with vertical problems, always use manual carry
  const advancedLevels = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
  if (advancedLevels.includes(level)) return true
  return false
}

/** localStorage key for tracking whether the carry transition modal has been shown */
const CARRY_MODAL_SHOWN_KEY = 'mindfoundry_carry_modal_shown'

/**
 * WorksheetView - Multi-problem worksheet display
 *
 * Shows multiple problems per page based on level configuration.
 * Manages page navigation and problem submission.
 */
const WorksheetView = forwardRef<WorksheetViewRef, WorksheetViewProps>(({
  level,
  worksheetNumber,
  questionsPerPageMode = 'standard',
  initialPageState,
  onPageComplete,
  onWorksheetComplete,
  onAnswerChange,
  onAllAnsweredChange,
  onPageStateChange,
  sessionActive,
}, ref) => {
  const problemsPerPage = getProblemsPerPage(level, questionsPerPageMode)
  const totalPages = getTotalPages(level, questionsPerPageMode)

  const [currentPage, setCurrentPage] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [pageStates, setPageStates] = useState<Record<number, PageState>>({})
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  // Stable key for this worksheet (used for restore gating)
  const worksheetKey = `${level}:${worksheetNumber}`

  // Manual carry mode
  const manualCarry = isManualCarryMode(level, worksheetNumber)
  const [showCarryTransitionModal, setShowCarryTransitionModal] = useState(false)
  const [carryNudgeIndex, setCarryNudgeIndex] = useState<number | null>(null)

  // Show carry transition modal on first encounter of manual carry mode
  useEffect(() => {
    if (manualCarry) {
      try {
        const shown = localStorage.getItem(CARRY_MODAL_SHOWN_KEY)
        if (!shown) {
          setShowCarryTransitionModal(true)
          localStorage.setItem(CARRY_MODAL_SHOWN_KEY, 'true')
        }
      } catch {
        // localStorage may be unavailable
      }
    }
  }, [manualCarry])

  // Track if we've consumed the initialPageState to avoid re-using it
  const initialPageStateConsumed = useRef(false)
  // Track the level/worksheet that initialPageState was for
  const initialStateFor = useRef<{ level: string; worksheet: number } | null>(null)

  // NEW: Refs to gate the page-init effect during/after restoration
  // This prevents the init effect from generating problems when restore already set pageStates
  const restoredForKeyRef = useRef<string | null>(null)
  const restoringRef = useRef(false)

  // Reset all state when worksheet or level changes (for next worksheet)
  // BUT use initialPageState if provided for session restoration
  useEffect(() => {
    // FIX: If initialPageState is undefined but we have stale gates, clear them
    // This handles the case where user toggles view modes (Single ↔ Multi-Problem)
    if (!initialPageState && restoredForKeyRef.current === worksheetKey) {
      console.log('📂 WorksheetView: Clearing stale gates for', worksheetKey)
      restoredForKeyRef.current = null
      initialStateFor.current = null
      initialPageStateConsumed.current = false
      // Continue to the reset logic below (don't return)
    }

    // Check if we should restore from initialPageState
    // CRITICAL: Only restore if problems array has data - prevents overwriting
    // freshly generated problems with stale/empty localStorage data
    if (initialPageState && initialPageState.problems?.length > 0 && !initialPageStateConsumed.current) {
      // Normalize restored state to handle corrupted/legacy localStorage data
      // This ensures all required fields exist and problems is a valid array
      const normalizedProblems = Array.isArray(initialPageState.problems) ? initialPageState.problems : []

      // Only proceed if we have valid problems after normalization
      if (normalizedProblems.length === 0) {
        console.warn('⚠️ Restored state had no valid problems array, will generate fresh')
        // Don't consume or set gates - let normal generation flow happen
        return
      }

      const normalized: PageState = {
        problems: normalizedProblems,
        answers: initialPageState.answers ?? {},
        submitted: !!initialPageState.submitted,
        results: initialPageState.results ?? {},
        attemptCounts: initialPageState.attemptCounts ?? {},
        hintLevels: initialPageState.hintLevels ?? {},
        lockedProblems: initialPageState.lockedProblems ?? {},
        firstAttemptResults: initialPageState.firstAttemptResults ?? {},
        correctedProblems: initialPageState.correctedProblems ?? {},
        columnDigits: initialPageState.columnDigits ?? {},
        activeColumns: initialPageState.activeColumns ?? {},
        carries: initialPageState.carries ?? {},
        scratchPadStrokes: initialPageState.scratchPadStrokes ?? {},
      }

      // Backfill column state for vertical problems missing it (legacy sessions)
      normalizedProblems.forEach((problem, index) => {
        if (problem.displayFormat === 'vertical' && !normalized.columnDigits[index]) {
          const colCount = getAnswerColumnCount(problem)
          if (colCount > 0) {
            normalized.columnDigits[index] = new Array(colCount).fill(null)
            normalized.activeColumns[index] = normalized.activeColumns[index] ?? 0
            normalized.carries[index] = normalized.carries[index] ?? new Array(colCount).fill(null)
          }
        }
      })

      // Mark as consumed so we don't re-use on subsequent renders
      initialPageStateConsumed.current = true
      initialStateFor.current = { level, worksheet: worksheetNumber }

      // CRITICAL: Set restore gates BEFORE setting state
      // This prevents the page-init effect from generating problems
      restoredForKeyRef.current = worksheetKey
      restoringRef.current = true

      console.log('📂 WorksheetView: Restoring from initialPageState for', worksheetKey, 'with', normalized.problems.length, 'problems')

      // Use the normalized page state
      setPageStates({ 1: normalized })
      setCurrentPage(1)
      setActiveIndex(0)

      // Calculate progress from the restored state
      const correct = Object.values(normalized.results).filter(Boolean).length
      const answered = Object.keys(normalized.answers).length
      setTotalCorrect(correct)
      setTotalAnswered(answered)

      // Clear restoring flag after this effect finishes (using microtask)
      queueMicrotask(() => {
        restoringRef.current = false
      })
      return
    }

    // CRITICAL FIX: If we already restored for THIS level/worksheet, don't reset!
    // This prevents subsequent React renders (strict mode, state changes) from wiping the restored state
    if (initialStateFor.current &&
        initialStateFor.current.level === level &&
        initialStateFor.current.worksheet === worksheetNumber) {
      console.log('📂 WorksheetView: Skipping reset - already restored for this worksheet')
      return
    }

    // If level/worksheet changed from what initialPageState was for, reset the consumed flag
    // This allows a NEW initialPageState to be used if the user navigates to a different worksheet then back
    if (initialStateFor.current &&
        (initialStateFor.current.level !== level || initialStateFor.current.worksheet !== worksheetNumber)) {
      initialPageStateConsumed.current = false
      initialStateFor.current = null
      // Clear restore gates for new worksheet
      restoredForKeyRef.current = null
      restoringRef.current = false
    }

    // Normal reset for new worksheets (only if no initialPageState to restore)
    console.log('📂 WorksheetView: Resetting for new worksheet', worksheetKey)
    setCurrentPage(1)
    setActiveIndex(0)
    setPageStates({})
    setTotalCorrect(0)
    setTotalAnswered(0)
  }, [worksheetNumber, level, initialPageState, worksheetKey])

  // Generate problems for a page
  const generatePageProblems = useCallback((pageNum: number): Problem[] => {
    const problems: Problem[] = []
    const startIndex = (pageNum - 1) * problemsPerPage

    for (let i = 0; i < problemsPerPage && startIndex + i < 10; i++) {
      problems.push(generateProblem(level, worksheetNumber))
    }

    return problems
  }, [level, worksheetNumber, problemsPerPage])

  // Initialize page state if missing (for new worksheets, NOT for restored sessions)
  // CRITICAL: Uses functional setState to avoid reading stale pageStates closure
  // and gates on restore refs to prevent generation during/after restoration
  useEffect(() => {
    // Gate 1: Don't initialize during active restoration
    if (restoringRef.current) {
      console.log('📂 WorksheetView: Skipping init - restoration in progress')
      return
    }

    // Gate 2: Don't initialize if we already restored PAGE 1 for this worksheet
    // (Allow page 2+ to generate new problems normally)
    if (restoredForKeyRef.current === worksheetKey && currentPage === 1) {
      console.log('📂 WorksheetView: Skipping init - page 1 already restored for', worksheetKey)
      return
    }

    // Use functional setState to check AND update atomically
    // This avoids reading stale pageStates from closure
    setPageStates(prev => {
      // If page already exists, don't regenerate
      if (prev[currentPage]) {
        return prev
      }

      // Generate new problems for this page
      console.log('📂 WorksheetView: Generating new problems for page', currentPage)
      const problems = generatePageProblems(currentPage)
      return {
        ...prev,
        [currentPage]: {
          problems,
          answers: {},
          submitted: false,
          results: {},
          attemptCounts: {},
          hintLevels: {},
          lockedProblems: {},
          firstAttemptResults: {},
          correctedProblems: {},
          ...initColumnStateForProblems(problems),
        }
      }
    })
  }, [currentPage, worksheetKey, generatePageProblems])  // NOTE: pageStates removed from deps!

  // Get current page state
  const currentPageState = pageStates[currentPage] || {
    problems: [],
    answers: {},
    submitted: false,
    results: {},
    attemptCounts: {},
    hintLevels: {},
    lockedProblems: {},
    firstAttemptResults: {},
    correctedProblems: {},
    ...emptyColumnState(),
  }

  // Notify parent when page state changes (for session persistence)
  useEffect(() => {
    if (onPageStateChange && pageStates[currentPage]) {
      onPageStateChange(pageStates[currentPage])
    }
  }, [pageStates, currentPage, onPageStateChange])

  // State for showing full teaching modal
  const [showTeaching, setShowTeaching] = useState(false)
  const [teachingProblemIndex, setTeachingProblemIndex] = useState<number | null>(null)

  // Handle problem click - set active (allow clicking on non-locked problems even after first check)
  const handleProblemClick = (index: number) => {
    if (!sessionActive) return
    // Can click if: not yet checked, OR if checked but not correct and not locked
    const canEdit = !currentPageState.submitted ||
      (!currentPageState.results[index] && !currentPageState.lockedProblems[index])
    if (canEdit) {
      setActiveIndex(index)
    }
  }

  // Dismiss hint for a problem
  const dismissHint = useCallback((index: number) => {
    setPageStates(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        hintLevels: {
          ...prev[currentPage].hintLevels,
          [index]: null,
        },
      },
    }))
  }, [currentPage])

  // Check if an answer is correct
  const checkAnswer = useCallback((problem: Problem, answer: string): boolean => {
    const correctAnswer = problem.correctAnswer
    if (typeof correctAnswer === 'number') {
      return parseFloat(answer) === correctAnswer
    } else if (typeof correctAnswer === 'string') {
      return answer.toLowerCase() === correctAnswer.toLowerCase()
    } else if (typeof correctAnswer === 'object' && 'numerator' in correctAnswer) {
      const frac = correctAnswer as { numerator: number; denominator: number }

      // Try parsing as a fraction first (works for both "12/6" and simple fractions)
      const parts = answer.split('/')
      if (parts.length === 2) {
        const studentNum = parseInt(parts[0].trim(), 10)
        const studentDen = parseInt(parts[1].trim(), 10)
        if (!isNaN(studentNum) && !isNaN(studentDen) && studentDen !== 0) {
          // Cross-multiply to check equivalence: studentNum/studentDen = frac.numerator/frac.denominator
          return studentNum * frac.denominator === frac.numerator * studentDen
        }
      }

      // Try parsing as an integer (for whole number answers like "2" when answer is 2/1)
      const asInt = parseInt(answer.trim(), 10)
      if (!isNaN(asInt) && String(asInt) === answer.trim()) {
        // Integer is equivalent to fraction with denominator 1
        // asInt/1 = frac.numerator/frac.denominator
        return asInt * frac.denominator === frac.numerator
      }
    }
    return false
  }, [])

  // Submit current page with graduated hint system
  const handleSubmitPage = useCallback(() => {
    // In manual carry mode, check for missing carries before proceeding
    if (manualCarry) {
      for (let index = 0; index < currentPageState.problems.length; index++) {
        const problem = currentPageState.problems[index]
        // Only check addition problems in vertical format
        if (problem.type !== 'addition' || problem.displayFormat !== 'vertical') continue
        // Skip already-correct problems
        if (currentPageState.results[index] === true) continue

        const columns = currentPageState.columnDigits[index]
        if (!columns) continue

        // Compute what the carries should be
        const expectedCarries = computeCarries(problem, columns)
        // Check the current carries in state
        const currentCarries = currentPageState.carries[index]

        // Look for columns where a carry is expected but not entered
        for (let col = 0; col < expectedCarries.length; col++) {
          if (expectedCarries[col] && (!currentCarries || !currentCarries[col])) {
            // The child has the answer digit for the column that produced this carry
            // but hasn't entered the carry itself
            if (columns[col] !== null) {
              setCarryNudgeIndex(index)
              // Auto-dismiss after 5 seconds
              setTimeout(() => setCarryNudgeIndex(null), 5000)
              return // Don't submit — let the child fix the carry first
            }
          }
        }
      }
    }

    // Clear any lingering nudge
    setCarryNudgeIndex(null)

    const results: Record<number, boolean> = { ...currentPageState.results }
    const attemptCounts: Record<number, number> = { ...currentPageState.attemptCounts }
    const hintLevels: Record<number, HintLevel | null> = { ...currentPageState.hintLevels }
    const lockedProblems: Record<number, boolean> = { ...currentPageState.lockedProblems }
    const firstAttemptResults: Record<number, boolean | null> = { ...currentPageState.firstAttemptResults }
    const correctedProblems: Record<number, boolean> = { ...currentPageState.correctedProblems }

    let newlyCorrect = 0
    let needsTeaching: number | null = null

    currentPageState.problems.forEach((problem, index) => {
      // Skip already correct or locked problems
      if (results[index] === true || lockedProblems[index]) return

      const answer = currentPageState.answers[index] || ''
      const isCorrect = checkAnswer(problem, answer)

      // Track first attempt result (lock it in once set)
      if (firstAttemptResults[index] === undefined || firstAttemptResults[index] === null) {
        firstAttemptResults[index] = isCorrect
      }

      if (isCorrect) {
        results[index] = isCorrect
        newlyCorrect++
        hintLevels[index] = null  // Clear any hint

        // Mark as corrected if first attempt was wrong
        if (firstAttemptResults[index] === false) {
          correctedProblems[index] = true
        }
      } else {
        // Wrong answer - increment attempt count
        const currentAttempts = (attemptCounts[index] || 0) + 1
        attemptCounts[index] = currentAttempts
        results[index] = false

        // Determine hint level based on attempts
        if (currentAttempts === 1) {
          hintLevels[index] = 'micro'
        } else if (currentAttempts === 2) {
          hintLevels[index] = 'visual'
        } else if (currentAttempts >= 3) {
          // After 3rd wrong, show full teaching
          hintLevels[index] = 'teaching'
          if (needsTeaching === null) {
            needsTeaching = index  // Show teaching for first problem that needs it
          }
        }
      }
    })

    // Check if all problems are now resolved (correct or locked)
    const allResolved = currentPageState.problems.every(
      (_, index) => results[index] === true || lockedProblems[index]
    )

    // Update page state
    setPageStates(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        submitted: true,  // Mark as submitted (checked)
        results,
        attemptCounts,
        hintLevels,
        lockedProblems,
        firstAttemptResults,
        correctedProblems,
      },
    }))

    // Show teaching modal if needed
    if (needsTeaching !== null) {
      setTeachingProblemIndex(needsTeaching)
      setShowTeaching(true)
    }

    // Only update totals and notify parent when page is fully resolved
    if (allResolved) {
      const pageCorrect = Object.values(results).filter(Boolean).length
      const newTotalCorrect = totalCorrect + pageCorrect
      const newTotalAnswered = totalAnswered + currentPageState.problems.length
      setTotalCorrect(newTotalCorrect)
      setTotalAnswered(newTotalAnswered)

      // Build per-problem attempt data for DB saving
      const problemAttempts: ProblemAttemptData[] = currentPageState.problems.map((problem, index) => ({
        problem,
        answer: currentPageState.answers[index] || '',
        isCorrect: results[index] || false,
        attemptsCount: (attemptCounts[index] || 0) + 1,  // +1 because first attempt starts at 0
        firstAttemptCorrect: firstAttemptResults[index] === true,
        hintLevelReached: hintLevels[index] || null,
      }))

      onPageComplete({
        correct: pageCorrect,
        total: currentPageState.problems.length,
        answers: currentPageState.answers,
        problemAttempts,
      })

      // Auto-advance if last page
      if (currentPage >= totalPages) {
        setTimeout(() => {
          onWorksheetComplete(newTotalCorrect, newTotalAnswered)
        }, 1200)
      }
    }
  }, [currentPageState, currentPage, totalCorrect, totalAnswered, onPageComplete, totalPages, onWorksheetComplete, checkAnswer, manualCarry])

  // Handle completing full teaching (locks the problem and shows answer)
  const handleTeachingComplete = useCallback(() => {
    if (teachingProblemIndex === null) return

    // Clear hint level but DON'T lock - let user try 4th attempt
    // Problem will show answer after attemptCounts >= 4
    setPageStates(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        hintLevels: {
          ...prev[currentPage].hintLevels,
          [teachingProblemIndex]: null,
        },
      },
    }))

    setShowTeaching(false)
    setTeachingProblemIndex(null)

    // Check if there are more problems needing teaching
    const nextTeachingIndex = currentPageState.problems.findIndex((_, index) =>
      index !== teachingProblemIndex &&
      currentPageState.hintLevels[index] === 'teaching' &&
      !currentPageState.lockedProblems[index]
    )

    if (nextTeachingIndex !== -1) {
      // Show teaching for next problem
      setTimeout(() => {
        setTeachingProblemIndex(nextTeachingIndex)
        setShowTeaching(true)
      }, 500)
    }
  }, [currentPage, teachingProblemIndex, currentPageState])

  // Handle Enter key - navigate to next question or submit if all answered
  const handleEnterKey = useCallback(() => {
    // Check if ALL problems have answers
    const allAnswered = Object.values(currentPageState.answers).every(a => a && a.trim() !== '') &&
      Object.keys(currentPageState.answers).length >= currentPageState.problems.length

    if (allAnswered) {
      // All answered - submit the page
      handleSubmitPage()
    } else {
      // Move to next unanswered question
      const nextEmpty = currentPageState.problems.findIndex((_, i) =>
        i > activeIndex && (!currentPageState.answers[i] || currentPageState.answers[i].trim() === '')
      )
      if (nextEmpty !== -1) {
        setActiveIndex(nextEmpty)
      } else {
        // Wrap around to first unanswered
        const firstEmpty = currentPageState.problems.findIndex((_, i) =>
          !currentPageState.answers[i] || currentPageState.answers[i].trim() === ''
        )
        if (firstEmpty !== -1) {
          setActiveIndex(firstEmpty)
        }
      }
    }
  }, [currentPageState, activeIndex, handleSubmitPage])

  // Handle number input (called from parent via ref)
  const handleInput = useCallback((num: number | string) => {
    // Handle enter key - navigate or submit
    if (num === 'enter') {
      handleEnterKey()
      return
    }

    // Handle submit separately - it triggers page submission
    if (num === 'submit') {
      handleSubmitPage()
      return
    }

    if (!sessionActive) return

    // Check if the active problem can be edited
    // Can edit if: not yet submitted, OR if submitted but wrong and not locked
    const canEditActive = !currentPageState.submitted ||
      (!currentPageState.results[activeIndex] && !currentPageState.lockedProblems[activeIndex])

    if (!canEditActive) return

    setPageStates(prev => {
      const currentState = prev[currentPage]
      if (!currentState) return prev

      const activeProblem = currentState.problems[activeIndex]
      const isVertical = activeProblem?.displayFormat === 'vertical'

      // ── Vertical (column-by-column) input ──
      if (isVertical && activeProblem) {
        const columnCount = getAnswerColumnCount(activeProblem)
        const currentColumns = currentState.columnDigits[activeIndex] || new Array(columnCount).fill(null)
        const currentActiveCol = currentState.activeColumns[activeIndex] ?? 0
        let newColumns = [...currentColumns]
        // Ensure array length matches expected column count
        while (newColumns.length < columnCount) newColumns.push(null)
        let newActiveCol = currentActiveCol

        if (num === 'backspace') {
          if (newColumns[newActiveCol] !== null) {
            newColumns[newActiveCol] = null
          } else if (newActiveCol > 0) {
            newActiveCol = newActiveCol - 1
            newColumns[newActiveCol] = null
          }
        } else if (num === 'clear') {
          newColumns = new Array(columnCount).fill(null)
          newActiveCol = 0
        } else if (typeof num === 'number' || (typeof num === 'string' && /^\d$/.test(num))) {
          // Place digit in current column
          newColumns[newActiveCol] = String(num)
          // Auto-advance to next column (toward higher place values)
          if (newActiveCol < columnCount - 1) {
            newActiveCol = newActiveCol + 1
          }
        }
        // Ignore 'negative', 'decimal', 'fraction' for vertical problems

        // Compose answer string from columns (reverse: index 0=ones but string reads L→R)
        const answerStr = newColumns
          .slice()
          .reverse()
          .map(d => d ?? '')
          .join('')
          .replace(/^0+(?=\d)/, '') // strip leading zeros (keep "0" if only digit)

        // Compute carries for auto-carry display
        const newCarries = computeCarries(activeProblem, newColumns)

        const newAnswers = { ...currentState.answers, [activeIndex]: answerStr }
        const newColumnDigits = { ...currentState.columnDigits, [activeIndex]: newColumns }
        const newActiveColumns = { ...currentState.activeColumns, [activeIndex]: newActiveCol }
        const newCarriesState = { ...currentState.carries, [activeIndex]: newCarries }

        if (onAnswerChange) {
          onAnswerChange(activeIndex + (currentPage - 1) * problemsPerPage, answerStr)
        }

        return {
          ...prev,
          [currentPage]: {
            ...currentState,
            answers: newAnswers,
            columnDigits: newColumnDigits,
            activeColumns: newActiveColumns,
            carries: newCarriesState,
          }
        }
      }

      // ── Horizontal (standard string) input ──
      const currentAnswer = currentState.answers[activeIndex] || ''
      let newAnswer = currentAnswer

      if (num === 'backspace') {
        newAnswer = currentAnswer.slice(0, -1)
      } else if (num === 'clear') {
        newAnswer = ''
      } else if (num === 'negative') {
        newAnswer = currentAnswer.startsWith('-') ? currentAnswer.slice(1) : '-' + currentAnswer
      } else if (num === 'decimal') {
        if (!currentAnswer.includes('.')) {
          newAnswer = currentAnswer === '' ? '0.' : currentAnswer + '.'
        }
      } else if (num === 'fraction') {
        if (!currentAnswer.includes('/')) {
          newAnswer = currentAnswer + '/'
        }
      } else {
        newAnswer = currentAnswer + String(num)
      }

      const newAnswers = { ...currentState.answers, [activeIndex]: newAnswer }

      // Keep hints visible while typing - don't clear them

      // Notify parent of answer change
      if (onAnswerChange) {
        onAnswerChange(activeIndex + (currentPage - 1) * problemsPerPage, newAnswer)
      }

      return {
        ...prev,
        [currentPage]: {
          ...currentState,
          answers: newAnswers,
        }
      }
    })
  }, [currentPage, activeIndex, currentPageState, sessionActive, onAnswerChange, problemsPerPage, handleSubmitPage, handleEnterKey])

  // Go to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setActiveIndex(0)
    } else {
      // Worksheet complete
      onWorksheetComplete(totalCorrect, totalAnswered)
    }
  }

  // Calculate how many problems are on this page
  const problemsOnThisPage = Math.min(
    problemsPerPage,
    10 - (currentPage - 1) * problemsPerPage
  )

  // Check if all problems have answers (or are locked/correct)
  const allAnswered = currentPageState.problems.length > 0 &&
    currentPageState.problems.every((_, index) =>
      // Problem is "answered" if: has answer text, OR is correct, OR is locked
      (currentPageState.answers[index] || '').length > 0 ||
      currentPageState.results[index] === true ||
      currentPageState.lockedProblems[index]
    )

  // Check if all problems are resolved (correct or locked) - page can advance
  const allResolved = currentPageState.problems.length > 0 &&
    currentPageState.problems.every((_, index) =>
      currentPageState.results[index] === true || currentPageState.lockedProblems[index]
    )

  // Check if there are wrong answers that need retrying
  const hasWrongAnswers = currentPageState.submitted &&
    currentPageState.problems.some((_, index) =>
      currentPageState.results[index] === false &&
      !currentPageState.lockedProblems[index]
    )

  // Notify parent when allAnswered status changes
  useEffect(() => {
    if (onAllAnsweredChange) {
      // Can submit if all editable problems have answers
      const canSubmit = allAnswered && !allResolved
      onAllAnsweredChange(canSubmit)
    }
  }, [allAnswered, allResolved, onAllAnsweredChange])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    handleInput,
    getActiveProblem: () => {
      const problem = currentPageState.problems[activeIndex]
      if (!problem) return null
      return {
        problem,
        index: activeIndex,
        pageIndex: activeIndex + (currentPage - 1) * problemsPerPage,
        totalProblems: currentPageState.problems.length,
      }
    },
    navigateToNextProblem: () => {
      const nextIndex = activeIndex + 1
      if (nextIndex >= currentPageState.problems.length) return null
      setActiveIndex(nextIndex)
      const problem = currentPageState.problems[nextIndex]
      if (!problem) return null
      return {
        problem,
        index: nextIndex,
        pageIndex: nextIndex + (currentPage - 1) * problemsPerPage,
      }
    },
    navigateToPreviousProblem: () => {
      const prevIndex = activeIndex - 1
      if (prevIndex < 0) return null
      setActiveIndex(prevIndex)
      const problem = currentPageState.problems[prevIndex]
      if (!problem) return null
      return {
        problem,
        index: prevIndex,
        pageIndex: prevIndex + (currentPage - 1) * problemsPerPage,
      }
    },
    getScratchPadStrokes: (problemIndex: number) => {
      return currentPageState.scratchPadStrokes[problemIndex] || []
    },
    setScratchPadStrokes: (problemIndex: number, strokes: Stroke[]) => {
      setPageStates(prev => ({
        ...prev,
        [currentPage]: {
          ...prev[currentPage],
          scratchPadStrokes: {
            ...prev[currentPage]?.scratchPadStrokes,
            [problemIndex]: strokes,
          },
        },
      }))
    },
    setAnswerFromScratchPad: (answer: string) => {
      // Set the answer for the currently active problem
      const activeProblem = currentPageState.problems[activeIndex]
      const isVertical = activeProblem?.displayFormat === 'vertical'

      setPageStates(prev => {
        const currentState = prev[currentPage]
        if (!currentState) return prev

        const newAnswers = { ...currentState.answers, [activeIndex]: answer }

        // If vertical, also populate the column digits from the answer
        if (isVertical && activeProblem) {
          const columnCount = getAnswerColumnCount(activeProblem)
          const digits = answer.split('').reverse() // "82" → ["2", "8"]
          const newColumns = new Array(columnCount).fill(null).map((_, i) => digits[i] || null)
          const newCarries = computeCarries(activeProblem, newColumns)

          return {
            ...prev,
            [currentPage]: {
              ...currentState,
              answers: newAnswers,
              columnDigits: { ...currentState.columnDigits, [activeIndex]: newColumns },
              carries: { ...currentState.carries, [activeIndex]: newCarries },
              activeColumns: { ...currentState.activeColumns, [activeIndex]: Math.min(digits.length, columnCount - 1) },
            },
          }
        }

        return {
          ...prev,
          [currentPage]: {
            ...currentState,
            answers: newAnswers,
          },
        }
      })

      if (onAnswerChange) {
        onAnswerChange(activeIndex + (currentPage - 1) * problemsPerPage, answer)
      }
    },
  }), [handleInput, currentPageState, activeIndex, currentPage, problemsPerPage, onAnswerChange])

  return (
    <div className="space-y-4">
      {/* Page indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                i + 1 === currentPage
                  ? 'bg-primary'
                  : i + 1 < currentPage
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>

      {/* Problems grid */}
      <div className={cn(
        'grid',
        getGridLayout(level, questionsPerPageMode),
        getProblemSpacing(level, questionsPerPageMode)
      )}>
        {currentPageState.problems.map((problem, index) => {
          // Determine if this problem can be edited
          const isLocked = currentPageState.lockedProblems[index]
          const isCorrect = currentPageState.results[index] === true
          const canEdit = !isLocked && !isCorrect
          const isActive = activeIndex === index && canEdit

          // Get hint data for this problem
          const hintLevel = currentPageState.hintLevels[index]
          const hintData = hintLevel && problem.graduatedHints?.[hintLevel]

          return (
            <div key={`${currentPage}-${index}`} className="space-y-2">
              <WorksheetProblem
                problem={problem}
                problemNumber={(currentPage - 1) * problemsPerPage + index + 1}
                answer={currentPageState.answers[index] || ''}
                isActive={isActive}
                isSubmitted={currentPageState.submitted}
                isCorrect={currentPageState.results[index]}
                onClick={() => handleProblemClick(index)}
                compact={problemsPerPage > 3}
                columnDigits={problem.displayFormat === 'vertical' ? currentPageState.columnDigits[index] : undefined}
                activeColumn={isActive && problem.displayFormat === 'vertical' ? (currentPageState.activeColumns[index] ?? 0) : undefined}
                carries={problem.displayFormat === 'vertical' ? currentPageState.carries[index] : undefined}
                onColumnClick={isActive && problem.displayFormat === 'vertical' ? (col: number) => {
                  setPageStates(prev => ({
                    ...prev,
                    [currentPage]: {
                      ...prev[currentPage],
                      activeColumns: {
                        ...prev[currentPage].activeColumns,
                        [index]: col,
                      },
                    },
                  }))
                } : undefined}
                manualCarryMode={manualCarry && problem.displayFormat === 'vertical' && problem.type === 'addition'}
              />

              {/* Micro hint - shown as inline toast below problem */}
              {hintLevel === 'micro' && hintData && (
                <MicroHint
                  text={hintData.text}
                  show={true}
                  position="inline"
                  onDismiss={() => dismissHint(index)}
                  autoDismiss={false}
                />
              )}

              {/* Visual hint - shown inline with animation */}
              {hintLevel === 'visual' && hintData && (
                <VisualHint
                  text={hintData.text}
                  animationId={hintData.animationId}
                  show={true}
                  problemData={{
                    operands: problem.operands,
                    operation: problem.type,  // Use type as operation
                  }}
                  onDismiss={() => dismissHint(index)}
                />
              )}

              {/* Show correct answer after 4th wrong attempt (after all 3 hints) */}
              {(currentPageState.attemptCounts[index] || 0) >= 4 && !isCorrect && (
                <div className="text-center text-sm text-gray-500">
                  Answer: <span className="font-bold text-green-600">{formatAnswer(problem.correctAnswer)}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation / Submit buttons */}
      <div className="flex justify-center gap-4 pt-4">
        {!currentPageState.submitted ? (
          // First submission - check all answers
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitPage}
            disabled={!allAnswered || !sessionActive}
          >
            Check Answers ({problemsOnThisPage})
          </Button>
        ) : hasWrongAnswers ? (
          // Has wrong answers - allow retry
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitPage}
            disabled={!allAnswered || !sessionActive}
          >
            Try Again
          </Button>
        ) : allResolved && currentPage < totalPages ? (
          // All resolved - go to next page
          <Button
            variant="primary"
            size="lg"
            onClick={handleNextPage}
          >
            Next Page →
          </Button>
        ) : allResolved ? (
          // Last page, all resolved: auto-advances
          <div className="text-lg font-medium text-primary animate-pulse">
            Loading next worksheet...
          </div>
        ) : (
          // Waiting for teaching to complete
          <div className="text-lg font-medium text-gray-500">
            Complete the lesson to continue...
          </div>
        )}
      </div>

      {/* Show per-page score summary after submission */}
      {currentPageState.submitted && (() => {
        const firstAttemptCorrect = currentPageState.problems.filter(
          (_, index) => currentPageState.firstAttemptResults[index] === true
        ).length
        const totalProblems = currentPageState.problems.length
        const correctedCount = Object.values(currentPageState.correctedProblems).filter(Boolean).length

        return (
          <div className="text-center text-lg font-medium">
            {hasWrongAnswers ? (
              <span className="text-amber-600">
                Try the highlighted problems again!
              </span>
            ) : (
              <>
                <span className="text-green-600">
                  ✓ First try: {firstAttemptCorrect}/{totalProblems}
                </span>
                {correctedCount > 0 && (
                  <span className="text-blue-600 ml-2">
                    | Fixed with hints: {correctedCount}
                  </span>
                )}
              </>
            )}
          </div>
        )
      })()}

      {/* Full Teaching Modal - shown after 3rd wrong attempt */}
      {teachingProblemIndex !== null && currentPageState.problems[teachingProblemIndex] && (() => {
        const teachingProblem = currentPageState.problems[teachingProblemIndex]
        // Convert question to string
        const questionStr = typeof teachingProblem.question === 'string'
          ? teachingProblem.question
          : teachingProblem.question?.text || ''
        // Convert correctAnswer to string/number
        const answerValue = typeof teachingProblem.correctAnswer === 'object'
          ? 'numerator' in teachingProblem.correctAnswer
            ? `${teachingProblem.correctAnswer.numerator}/${teachingProblem.correctAnswer.denominator}`
            : (teachingProblem.correctAnswer as { text?: string }).text || ''
          : teachingProblem.correctAnswer

        return (
          <FullTeaching
            text={teachingProblem.graduatedHints?.teaching?.text || "Let's work through this step by step."}
            animationId={teachingProblem.graduatedHints?.teaching?.animationId}
            show={showTeaching}
            problemData={{
              question: questionStr,
              operands: teachingProblem.operands,
              operation: teachingProblem.type,
              correctAnswer: answerValue,
            }}
            onComplete={handleTeachingComplete}
            duration={30}
            minViewTime={10}
          />
        )
      })()}

      {/* Carry Transition Modal - shown once when manual carry mode starts */}
      <CarryTransitionModal
        show={showCarryTransitionModal}
        onDismiss={() => setShowCarryTransitionModal(false)}
      />

      {/* Carry Nudge Toast - shown when child skips carry entry in manual mode */}
      {carryNudgeIndex !== null && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 animate-bounce">
          <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
            Did you forget to carry?
          </div>
        </div>
      )}
    </div>
  )
})

WorksheetView.displayName = 'WorksheetView'

export default WorksheetView

// Export the input handler type for parent component
export type WorksheetInputHandler = (num: number | string) => void
