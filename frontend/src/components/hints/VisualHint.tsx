import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import AnimationRenderer from './AnimationRenderer'

export interface VisualHintProps {
  /** Hint text description */
  text: string
  /** Animation ID to display (for future animation system) */
  animationId?: string
  /** Whether to show the hint */
  show: boolean
  /** Problem data for dynamic visualizations */
  problemData?: {
    operands?: number[]
    operation?: string
    correctAnswer?: number | string
  }
  /** Callback when hint is dismissed */
  onDismiss?: () => void
  /** Duration in seconds (default: 15) */
  duration?: number
  /** Additional className */
  className?: string
  /**
   * PEDAGOGICAL: Show only the setup, NOT the solution
   * Visual hints should prompt thinking, not give away answers
   * Default: false (setup only mode)
   */
  showSolution?: boolean
}

/**
 * VisualHint - Second-level hint shown after 2nd wrong answer
 *
 * PEDAGOGICAL PRINCIPLE: "Show setup, hide solution"
 * - Shows SETUP only (number line with starting point, objects without count)
 * - Does NOT show the answer or solution steps
 * - Prompts the student to complete the thinking themselves
 * - 5-15 second duration
 * - "Got it" button to dismiss
 * - Part of the 3-level graduated hint system
 */
export default function VisualHint({
  text,
  animationId,
  show,
  problemData,
  onDismiss,
  duration = 15,
  className,
  showSolution = false, // PEDAGOGICAL: Default to setup-only mode
}: VisualHintProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [canDismiss, setCanDismiss] = useState(false)

  // Minimum time before user can dismiss (3 seconds)
  const MIN_VIEW_TIME = 3

  useEffect(() => {
    if (!show) {
      setTimeRemaining(duration)
      setCanDismiss(false)
      return
    }

    // Enable dismiss after minimum view time
    const dismissTimer = setTimeout(() => {
      setCanDismiss(true)
    }, MIN_VIEW_TIME * 1000)

    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(dismissTimer)
      clearInterval(interval)
    }
  }, [show, duration])

  // Render the appropriate animation based on animationId
  // Uses centralized AnimationRenderer for consistent animation handling
  const renderAnimation = () => {
    // Convert problemData to the format expected by animation components
    const animationProblemData = problemData ? {
      operands: problemData.operands,
      operation: problemData.operation as 'addition' | 'subtraction' | 'multiplication' | 'division' | undefined,
      correctAnswer: problemData.correctAnswer,
    } : undefined

    // PEDAGOGICAL: showSolution=false shows SETUP only, not the answer
    return (
      <AnimationRenderer
        animationId={animationId}
        problemData={animationProblemData}
        showSolution={showSolution}
        operation={problemData?.operation}
      />
    )
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn('w-full overflow-hidden', className)}
        >
          <div
            className={cn(
              'rounded-2xl p-4 shadow-lg',
              'bg-gradient-to-br from-blue-50 to-teal-50',
              'border-2 border-teal-200'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="font-semibold text-teal-800">
                  Let me show you
                </span>
              </div>
              <span className="text-sm text-teal-600">
                {timeRemaining}s
              </span>
            </div>

            {/* Animation Area */}
            <div className="bg-white rounded-xl p-4 mb-3 min-h-[120px]">
              {renderAnimation()}
            </div>

            {/* Hint Text */}
            <p className="text-teal-800 text-base mb-4 text-center">
              {text}
            </p>

            {/* Dismiss Button */}
            <div className="flex justify-center">
              <Button
                variant={canDismiss ? 'primary' : 'ghost'}
                size="md"
                onClick={onDismiss}
                disabled={!canDismiss}
              >
                {canDismiss ? 'Got it!' : `Wait ${MIN_VIEW_TIME - (duration - timeRemaining)}s...`}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
