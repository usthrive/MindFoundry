import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import WorksheetProblem from './WorksheetProblem'
import {
  getProblemsPerPage,
  getTotalPages,
  getGridLayout,
  getProblemSpacing,
} from '@/utils/worksheetConfig'
import { generateProblem } from '@/services/sessionManager'
import type { Problem } from '@/services/generators/types'
import type { KumonLevel } from '@/types'

export interface WorksheetViewProps {
  level: KumonLevel
  worksheetNumber: number
  onPageComplete: (results: { correct: number; total: number; answers: Record<number, string> }) => void
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
  onPageComplete,
  onWorksheetComplete,
  onAnswerChange,
  onAllAnsweredChange,
  sessionActive,
}, ref) => {
  const problemsPerPage = getProblemsPerPage(level)
  const totalPages = getTotalPages(level)

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
  }

  // Handle problem click - set active
  const handleProblemClick = (index: number) => {
    if (!currentPageState.submitted && sessionActive) {
      setActiveIndex(index)
    }
  }

  // Submit current page - defined before handleInput since it's called from there
  const handleSubmitPage = useCallback(() => {
    if (currentPageState.submitted) return

    const results: Record<number, boolean> = {}
    let pageCorrect = 0

    currentPageState.problems.forEach((problem, index) => {
      const answer = currentPageState.answers[index] || ''
      const correctAnswer = problem.correctAnswer

      let isCorrect = false
      if (typeof correctAnswer === 'number') {
        isCorrect = parseFloat(answer) === correctAnswer
      } else if (typeof correctAnswer === 'string') {
        isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase()
      } else if (typeof correctAnswer === 'object' && 'numerator' in correctAnswer) {
        const frac = correctAnswer as { numerator: number; denominator: number }
        if (frac.denominator === 1) {
          isCorrect = parseInt(answer, 10) === frac.numerator
        } else {
          const parts = answer.split('/')
          if (parts.length === 2) {
            const studentNum = parseInt(parts[0].trim(), 10)
            const studentDen = parseInt(parts[1].trim(), 10)
            if (!isNaN(studentNum) && !isNaN(studentDen) && studentDen !== 0) {
              isCorrect = studentNum * frac.denominator === frac.numerator * studentDen
            }
          }
        }
      }

      results[index] = isCorrect
      if (isCorrect) pageCorrect++
    })

    // Update page state with results
    setPageStates(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        submitted: true,
        results,
      }
    }))

    // Update totals
    const newTotalCorrect = totalCorrect + pageCorrect
    const newTotalAnswered = totalAnswered + currentPageState.problems.length
    setTotalCorrect(newTotalCorrect)
    setTotalAnswered(newTotalAnswered)

    // Notify parent
    onPageComplete({
      correct: pageCorrect,
      total: currentPageState.problems.length,
      answers: currentPageState.answers,
    })

    // Auto-advance: If this is the last page, automatically complete the worksheet after brief delay
    if (currentPage >= totalPages) {
      setTimeout(() => {
        onWorksheetComplete(newTotalCorrect, newTotalAnswered)
      }, 1200) // Brief delay to see results before advancing
    }
  }, [currentPageState, currentPage, totalCorrect, totalAnswered, onPageComplete, totalPages, onWorksheetComplete])

  // Handle number input (called from parent via ref)
  const handleInput = useCallback((num: number | string) => {
    // Handle submit separately - it triggers page submission
    if (num === 'submit') {
      handleSubmitPage()
      return
    }

    if (currentPageState.submitted || !sessionActive) return

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
  }, [currentPage, activeIndex, currentPageState.submitted, sessionActive, onAnswerChange, problemsPerPage, handleSubmitPage])

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

  // Check if all problems have answers
  const allAnswered = currentPageState.problems.length > 0 &&
    currentPageState.problems.every((_, index) =>
      (currentPageState.answers[index] || '').length > 0
    )

  // Notify parent when allAnswered status changes
  useEffect(() => {
    if (onAllAnsweredChange) {
      onAllAnsweredChange(allAnswered && !currentPageState.submitted)
    }
  }, [allAnswered, currentPageState.submitted, onAllAnsweredChange])

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
        getGridLayout(level),
        getProblemSpacing(level)
      )}>
        {currentPageState.problems.map((problem, index) => (
          <WorksheetProblem
            key={`${currentPage}-${index}`}
            problem={problem}
            problemNumber={(currentPage - 1) * problemsPerPage + index + 1}
            answer={currentPageState.answers[index] || ''}
            isActive={activeIndex === index && !currentPageState.submitted}
            isSubmitted={currentPageState.submitted}
            isCorrect={currentPageState.results[index]}
            onClick={() => handleProblemClick(index)}
            compact={problemsPerPage > 3}
          />
        ))}
      </div>

      {/* Navigation / Submit buttons */}
      <div className="flex justify-center gap-4 pt-4">
        {!currentPageState.submitted ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitPage}
            disabled={!allAnswered || !sessionActive}
          >
            Check Answers ({problemsOnThisPage})
          </Button>
        ) : currentPage < totalPages ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleNextPage}
          >
            Next Page →
          </Button>
        ) : (
          // Last page: auto-advances, show status
          <div className="text-lg font-medium text-primary animate-pulse">
            Loading next worksheet...
          </div>
        )}
      </div>

      {/* Score summary after submission */}
      {currentPageState.submitted && (
        <div className="text-center text-lg font-medium">
          <span className="text-green-600">
            {Object.values(currentPageState.results).filter(Boolean).length}
          </span>
          {' / '}
          <span>{currentPageState.problems.length}</span>
          {' correct on this page'}
        </div>
      )}
    </div>
  )
})

WorksheetView.displayName = 'WorksheetView'

export default WorksheetView

// Export the input handler type for parent component
export type WorksheetInputHandler = (num: number | string) => void
