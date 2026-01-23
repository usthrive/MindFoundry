import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import WorksheetProblem from './WorksheetProblem'
import { MicroHint, VisualHint, FullTeaching } from '@/components/hints'
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
  onPageComplete: (results: {
    correct: number
    total: number
    answers: Record<number, string>
    problemAttempts: ProblemAttemptData[]  // Added for DB saving
  }) => void
  onWorksheetComplete: (totalCorrect: number, totalProblems: number) => void
  onAnswerChange?: (problemIndex: number, answer: string) => void
  onAllAnsweredChange?: (allAnswered: boolean) => void
  sessionActive: boolean
}

export interface WorksheetViewRef {
  handleInput: (value: number | string) => void
}

interface PageState {
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
 * WorksheetView - Multi-problem worksheet display
 *
 * Shows multiple problems per page based on level configuration.
 * Manages page navigation and problem submission.
 */
const WorksheetView = forwardRef<WorksheetViewRef, WorksheetViewProps>(({
  level,
  worksheetNumber,
  questionsPerPageMode = 'standard',
  onPageComplete,
  onWorksheetComplete,
  onAnswerChange,
  onAllAnsweredChange,
  sessionActive,
}, ref) => {
  const problemsPerPage = getProblemsPerPage(level, questionsPerPageMode)
  const totalPages = getTotalPages(level, questionsPerPageMode)

  const [currentPage, setCurrentPage] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [pageStates, setPageStates] = useState<Record<number, PageState>>({})
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  // Reset all state when worksheet or level changes (for next worksheet)
  useEffect(() => {
    setCurrentPage(1)
    setActiveIndex(0)
    setPageStates({})
    setTotalCorrect(0)
    setTotalAnswered(0)
  }, [worksheetNumber, level])

  // Generate problems for a page
  const generatePageProblems = useCallback((pageNum: number): Problem[] => {
    const problems: Problem[] = []
    const startIndex = (pageNum - 1) * problemsPerPage

    for (let i = 0; i < problemsPerPage && startIndex + i < 10; i++) {
      problems.push(generateProblem(level, worksheetNumber))
    }

    return problems
  }, [level, worksheetNumber, problemsPerPage])

  // Initialize or get page state
  useEffect(() => {
    if (!pageStates[currentPage]) {
      const problems = generatePageProblems(currentPage)
      setPageStates(prev => ({
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
        }
      }))
    }
  }, [currentPage, pageStates, generatePageProblems])

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
  }

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
  }, [currentPageState, currentPage, totalCorrect, totalAnswered, onPageComplete, totalPages, onWorksheetComplete, checkAnswer])

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

  // Expose handleInput method to parent via ref
  useImperativeHandle(ref, () => ({
    handleInput,
  }), [handleInput])

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
    </div>
  )
})

WorksheetView.displayName = 'WorksheetView'

export default WorksheetView

// Export the input handler type for parent component
export type WorksheetInputHandler = (num: number | string) => void
