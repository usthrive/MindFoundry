import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

export interface FullTeachingProps {
  /** Teaching text/narration */
  text: string
  /** Animation ID for the teaching animation */
  animationId?: string
  /** Whether to show the teaching modal */
  show: boolean
  /** Problem data for personalized teaching */
  problemData?: {
    question?: string
    operands?: number[]
    operation?: string
    correctAnswer?: number | string
  }
  /**
   * PEDAGOGICAL: Similar problem to demonstrate (not the original!)
   * If not provided, one will be generated from the original operands
   */
  similarProblem?: {
    operands: number[]
    answer: number
    question: string
  }
  /** Callback when teaching is completed */
  onComplete?: () => void
  /** Duration in seconds (default: 30) */
  duration?: number
  /** Minimum time before skip is allowed (default: 10) */
  minViewTime?: number
  /** Additional className */
  className?: string
}

/**
 * FullTeaching - Third-level hint shown after 3rd wrong answer
 *
 * PEDAGOGICAL PRINCIPLE: "Similar Problem Demo"
 * - Demonstrates the solution using a DIFFERENT but similar problem
 * - Does NOT show the answer to the original problem
 * - Student must still solve the original problem themselves
 * - Preserves "productive struggle" while providing scaffolding
 *
 * Features:
 * - A fullscreen modal with animated teaching walkthrough
 * - Uses a similar problem for demonstration
 * - Cannot skip until minimum time (10 sec)
 * - At the end, prompts student to "Now try yours!"
 * - Part of the 3-level graduated hint system
 */
export default function FullTeaching({
  text,
  animationId,
  show,
  problemData,
  similarProblem,
  onComplete,
  duration = 30,
  minViewTime = 10,
  className,
}: FullTeachingProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [canSkip, setCanSkip] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  // PEDAGOGICAL: Generate or use provided similar problem for demonstration
  const demoProblem = similarProblem || generateSimilarProblem(
    problemData?.operands || [5, 3],
    problemData?.operation || 'addition'
  )

  // Generate teaching steps using the SIMILAR problem (not the original!)
  const teachingSteps = getTeachingSteps(demoProblem, problemData?.operation, animationId)

  useEffect(() => {
    if (!show) {
      setTimeRemaining(duration)
      setCanSkip(false)
      setCurrentStep(0)
      setShowAnswer(false)
      return
    }

    // Enable skip after minimum view time
    const skipTimer = setTimeout(() => {
      setCanSkip(true)
    }, minViewTime * 1000)

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setShowAnswer(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Step progression
    const stepDuration = (duration - 5) / teachingSteps.length // Leave 5s for answer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < teachingSteps.length - 1) {
          return prev + 1
        }
        setShowAnswer(true)
        return prev
      })
    }, stepDuration * 1000)

    return () => {
      clearTimeout(skipTimer)
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [show, duration, minViewTime, teachingSteps.length])

  const handleComplete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed inset-0 z-[60] flex items-center justify-center',
            'bg-black/70 backdrop-blur-sm',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'w-full max-w-lg mx-4 max-h-[90vh] overflow-auto',
              'bg-white rounded-3xl shadow-2xl'
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-teal-500 p-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <h2 className="text-xl font-bold text-white">
                    Let's Learn Together!
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {timeRemaining}s
                    </span>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={handleComplete}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-3">
                {teachingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index <= currentStep ? 'bg-white' : 'bg-white/40'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* PEDAGOGICAL: Show we're teaching with a SIMILAR problem */}
              <div className="mb-4 p-3 bg-blue-50 rounded-xl text-center border-2 border-blue-200">
                <span className="text-sm text-blue-600 font-medium">
                  Let me show you with a similar problem:
                </span>
                <p className="text-xl font-bold text-blue-800 mt-1">
                  {demoProblem.question}
                </p>
              </div>

              {/* Teaching step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[200px]"
                >
                  {!showAnswer ? (
                    <TeachingStep step={teachingSteps[currentStep]} />
                  ) : (
                    <NowTryYours
                      demoProblem={demoProblem}
                      originalQuestion={problemData?.question}
                      onContinue={handleComplete}
                      canContinue={canSkip}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Main text */}
              <p className="text-gray-700 text-base text-center mt-4 leading-relaxed">
                {text}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-center">
                <Button
                  variant={canSkip ? 'primary' : 'ghost'}
                  size="lg"
                  onClick={handleComplete}
                  disabled={!canSkip}
                  className="min-w-[200px]"
                >
                  {canSkip
                    ? (showAnswer ? 'I Understand!' : 'Skip to Answer')
                    : `Please wait ${minViewTime - (duration - timeRemaining)}s...`
                  }
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// PEDAGOGICAL HELPER: Generate Similar Problem
// ============================================
// Creates a different but similar problem for teaching demos
// This preserves "productive struggle" - we show HOW to solve,
// but not the answer to the original problem.

interface SimilarProblem {
  operands: number[]
  answer: number
  question: string
}

function generateSimilarProblem(operands: number[], operation: string): SimilarProblem {
  const [num1, num2] = operands

  switch (operation) {
    case 'addition': {
      const newNum1 = num1 <= 5 ? num1 + 1 : num1 - 1
      const newNum2 = num2 <= 5 ? num2 + 1 : num2 - 1
      return {
        operands: [newNum1, newNum2],
        answer: newNum1 + newNum2,
        question: `${newNum1} + ${newNum2}`,
      }
    }
    case 'subtraction': {
      const newNum1 = num1 + 1
      const newNum2 = Math.min(num2, newNum1 - 1)
      return {
        operands: [newNum1, newNum2],
        answer: newNum1 - newNum2,
        question: `${newNum1} - ${newNum2}`,
      }
    }
    case 'multiplication': {
      const newNum1 = num1 <= 5 ? num1 + 1 : num1 - 1
      const newNum2 = num2 <= 5 ? num2 + 1 : num2 - 1
      return {
        operands: [newNum1, newNum2],
        answer: newNum1 * newNum2,
        question: `${newNum1} × ${newNum2}`,
      }
    }
    case 'division': {
      const newDivisor = num2 <= 5 ? num2 + 1 : num2 - 1
      const newDividend = newDivisor * Math.floor(num1 / num2)
      return {
        operands: [newDividend, newDivisor],
        answer: newDividend / newDivisor,
        question: `${newDividend} ÷ ${newDivisor}`,
      }
    }
    default: {
      // For counting or other operations
      const newNum = num1 <= 5 ? num1 + 1 : num1 - 1
      return {
        operands: [newNum],
        answer: newNum,
        question: `Count ${newNum} objects`,
      }
    }
  }
}

// Helper function to generate teaching steps using the SIMILAR problem
function getTeachingSteps(
  demoProblem: SimilarProblem,
  operation?: string,
  animationId?: string
): TeachingStepData[] {
  const operands = demoProblem.operands
  const answer = demoProblem.answer

  // Addition teaching steps (using demo problem)
  if (operation === 'addition' || animationId?.includes('addition')) {
    return [
      {
        title: 'Step 1: Start with the bigger number',
        content: `We start with ${Math.max(...operands)}`,
        visual: '👆',
        highlight: Math.max(...operands),
      },
      {
        title: 'Step 2: Count up',
        content: `Now count up ${Math.min(...operands)} more`,
        visual: '🔢',
        animation: 'counting',
      },
      {
        title: 'Step 3: Find the answer',
        content: `${demoProblem.question} = ${answer}`,
        visual: '🎯',
      },
    ]
  }

  // Subtraction teaching steps
  if (operation === 'subtraction' || animationId?.includes('subtraction')) {
    return [
      {
        title: 'Step 1: Start with the first number',
        content: `We start with ${operands[0]}`,
        visual: '👆',
        highlight: operands[0],
      },
      {
        title: 'Step 2: Count down',
        content: `Now count down ${operands[1]}`,
        visual: '⬇️',
        animation: 'counting-down',
      },
      {
        title: 'Step 3: Find the answer',
        content: `${demoProblem.question} = ${answer}`,
        visual: '🎯',
      },
    ]
  }

  // Multiplication teaching steps
  if (operation === 'multiplication' || animationId?.includes('multiplication')) {
    return [
      {
        title: 'Step 1: Think of groups',
        content: `${operands[0]} × ${operands[1]} means ${operands[0]} groups of ${operands[1]}`,
        visual: '👥',
      },
      {
        title: 'Step 2: Count the groups',
        content: `Count: ${operands[1]}, ${operands[1] * 2}, ${operands[1] * 3}...`,
        visual: '🔢',
        animation: 'groups',
      },
      {
        title: 'Step 3: Find the total',
        content: `${demoProblem.question} = ${answer}`,
        visual: '🎯',
      },
    ]
  }

  // Division teaching steps
  if (operation === 'division' || animationId?.includes('division')) {
    return [
      {
        title: 'Step 1: Think of equal groups',
        content: `How many groups of ${operands[1]} fit into ${operands[0]}?`,
        visual: '📦',
      },
      {
        title: 'Step 2: Count the groups',
        content: `${operands[1]}, ${operands[1] * 2}, ${operands[1] * 3}... until we reach ${operands[0]}`,
        visual: '🔢',
        animation: 'grouping',
      },
      {
        title: 'Step 3: Find the answer',
        content: `${demoProblem.question} = ${answer}`,
        visual: '🎯',
      },
    ]
  }

  // Generic teaching steps
  return [
    {
      title: 'Step 1: Understand the problem',
      content: 'Let\'s break this down step by step',
      visual: '🤔',
    },
    {
      title: 'Step 2: Work through it',
      content: 'Follow along with me',
      visual: '✏️',
    },
    {
      title: 'Step 3: Find the answer',
      content: `${demoProblem.question} = ${answer}`,
      visual: '🎯',
    },
  ]
}

interface TeachingStepData {
  title: string
  content: string
  visual: string
  highlight?: number
  animation?: string
}

function TeachingStep({ step }: { step: TeachingStepData }) {
  return (
    <div className="text-center">
      <span className="text-6xl block mb-4">{step.visual}</span>
      <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
      <p className="text-xl text-gray-800 font-medium">{step.content}</p>
      {step.highlight !== undefined && (
        <div className="mt-4">
          <span className="inline-block bg-primary text-white text-3xl font-bold px-6 py-3 rounded-2xl">
            {step.highlight}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * NowTryYours - PEDAGOGICAL: Prompts student to try the original problem
 * After showing the demo solution, we encourage them to apply what they learned
 * to solve their original problem themselves.
 */
function NowTryYours({
  demoProblem,
  originalQuestion,
  onContinue: _onContinue,
  canContinue: _canContinue,
}: {
  demoProblem: SimilarProblem
  originalQuestion?: string
  onContinue?: () => void
  canContinue: boolean
}) {
  // Note: onContinue and canContinue reserved for future use
  void _onContinue
  void _canContinue

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="text-center"
    >
      <span className="text-6xl block mb-4">💪</span>

      {/* Show the demo answer */}
      <div className="mb-4 p-3 bg-green-50 rounded-xl border-2 border-green-200">
        <span className="text-sm text-green-600">We solved:</span>
        <p className="text-lg font-bold text-green-700">
          {demoProblem.question} = {demoProblem.answer}
        </p>
      </div>

      {/* PEDAGOGICAL: Now prompt them to try their own */}
      <h3 className="text-xl font-bold text-primary mb-3">
        Now you try yours!
      </h3>

      {originalQuestion && (
        <div className="inline-block bg-primary/10 text-primary text-2xl font-bold px-6 py-3 rounded-2xl">
          {originalQuestion}
        </div>
      )}

      <p className="text-gray-600 mt-4">
        Use the same steps we practiced!
      </p>
    </motion.div>
  )
}
