import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

// Import new animation components (Phase 1.12)
import {
  NumberLineAnimation,
  CountingObjectsAnimation,
  TenFrameAnimation,
  PlaceValueAnimation,
} from '@/components/animations'

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
  // PHASE 1.12: Using new animation components from @/components/animations
  const renderAnimation = () => {
    // Convert problemData to the format expected by new animation components
    const animationProblemData = problemData ? {
      operands: problemData.operands,
      operation: problemData.operation as 'addition' | 'subtraction' | 'multiplication' | 'division' | undefined,
      correctAnswer: problemData.correctAnswer,
    } : undefined

    // PEDAGOGICAL: Pass showSolution=false to show SETUP only, not the answer
    switch (animationId) {
      // Number Line Animations (Levels 3A-A)
      case 'number-line-addition':
      case 'number-line-setup':
        return (
          <NumberLineAnimation
            problemData={animationProblemData}
            showSolution={showSolution}
          />
        )
      case 'number-line-subtraction':
      case 'number-line-setup-subtraction':
        return (
          <NumberLineAnimation
            problemData={animationProblemData}
            isSubtraction
            showSolution={showSolution}
          />
        )

      // Counting Animations (Levels 7A-6A)
      case 'counting-objects':
      case 'counting-objects-setup':
        return (
          <CountingObjectsAnimation
            problemData={animationProblemData}
            showSolution={showSolution}
          />
        )
      case 'dot-pattern':
      case 'dot-pattern-setup':
        return (
          <CountingObjectsAnimation
            problemData={animationProblemData}
            objectEmoji="⚫"
            showSolution={showSolution}
          />
        )

      // Ten Frame / Make-10 Animations (Level 2A)
      case 'ten-frame':
      case 'make-10-setup':
        return (
          <TenFrameAnimation
            problemData={animationProblemData}
            showSolution={showSolution}
          />
        )

      // Place Value / Regrouping Animations (Level B)
      case 'base-10-blocks':
      case 'place-value-setup':
        return (
          <PlaceValueAnimation
            problemData={animationProblemData}
            operationType="addition"
            showSolution={showSolution}
          />
        )
      case 'carrying-setup':
        return (
          <PlaceValueAnimation
            problemData={animationProblemData}
            operationType="addition"
            showRegrouping
            showSolution={showSolution}
          />
        )
      case 'borrowing-setup':
      case 'vertical-subtraction-setup':
        return (
          <PlaceValueAnimation
            problemData={animationProblemData}
            operationType="subtraction"
            showRegrouping
            showSolution={showSolution}
          />
        )

      // Subtraction with Objects (Level A)
      case 'objects-setup-subtraction':
        return <ObjectsSetupAnimation problemData={problemData} showSolution={showSolution} />

      // Multiplication Animations (Level C+) - Keep legacy for now
      case 'array-setup':
        return <ArraySetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'area-model-setup':
        return <AreaModelSetupAnimation problemData={problemData} showSolution={showSolution} />

      // Division Animations (Level C+) - Keep legacy for now
      case 'division-grouping-setup':
        return <DivisionGroupingSetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'long-division-setup':
        return <LongDivisionSetupAnimation problemData={problemData} showSolution={showSolution} />

      default:
        // Generic hint display if no specific animation
        return (
          <div className="flex items-center justify-center py-4">
            <span className="text-6xl">🔢</span>
          </div>
        )
    }
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

// ============================================
// LEGACY ANIMATION COMPONENTS (Level C+ - To be migrated in future phases)
// ============================================
// NOTE: NumberLineAnimation, CountingObjectsAnimation, TenFrameAnimation,
// and PlaceValueAnimation have been moved to @/components/animations/
// (Phase 1.12: Educational Animation System)
//
// The components below are kept for Level C+ problem types.
// They will be migrated to the new animation system in future phases.

interface AnimationProps {
  problemData?: {
    operands?: number[]
    operation?: string
    correctAnswer?: number | string
  }
  isSubtraction?: boolean
  /** PEDAGOGICAL: When false (default), shows setup only without solution */
  showSolution?: boolean
}

/**
 * ObjectsSetupAnimation - Shows objects for subtraction
 * SETUP MODE: Shows objects, highlights ones to remove (no result)
 */
function ObjectsSetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [8, 3]
  const total = operands[0]
  const toRemove = operands[1]

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'text-3xl',
              i >= total - toRemove ? 'opacity-50 line-through' : ''
            )}
          >
            🍎
          </span>
        ))}
      </div>
      <p className="text-gray-600">
        You have {total}. Cross out {toRemove}. How many are left?
      </p>
    </div>
  )
}

/**
 * VerticalSetupAnimation - Shows vertical format for multi-digit operations
 * SETUP MODE: Shows numbers in columns, no answer
 */
function VerticalSetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [52, 17]
  const operation = problemData?.operation || 'subtraction'

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center font-mono text-2xl">
      <div className="inline-block text-right">
        <div>{operands[0]}</div>
        <div className="border-b-2 border-gray-400">
          {operation === 'subtraction' ? '-' : '+'} {operands[1]}
        </div>
        <div className="text-gray-400">?</div>
      </div>
      <p className="text-base text-gray-600 mt-2 font-sans">
        Start with the ones column.
      </p>
    </div>
  )
}

/**
 * ArraySetupAnimation - Shows array grid for multiplication
 * SETUP MODE: Empty grid, no total
 */
function ArraySetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [4, 3]
  const rows = Math.min(operands[0], 6)
  const cols = Math.min(operands[1], 6)

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center">
      <div
        className="inline-grid gap-1 mb-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div
            key={i}
            className="w-6 h-6 border border-blue-300 rounded bg-blue-50"
          />
        ))}
      </div>
      <p className="text-gray-600">
        {rows} rows × {cols} columns = ?
      </p>
    </div>
  )
}

/**
 * AreaModelSetupAnimation - Shows area model for larger multiplication
 * SETUP MODE: Divided rectangle, no values filled in
 */
function AreaModelSetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [23, 14]

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center">
      <div className="inline-block">
        {/* Top labels */}
        <div className="flex ml-8">
          <div className="w-16 text-center text-sm">{Math.floor(operands[1] / 10) * 10}</div>
          <div className="w-10 text-center text-sm">{operands[1] % 10}</div>
        </div>
        <div className="flex">
          {/* Left labels */}
          <div className="w-8 flex flex-col justify-around text-sm">
            <span>{Math.floor(operands[0] / 10) * 10}</span>
            <span>{operands[0] % 10}</span>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-2 border-2 border-gray-400">
            <div className="w-16 h-12 border border-gray-300 flex items-center justify-center text-gray-400">?</div>
            <div className="w-10 h-12 border border-gray-300 flex items-center justify-center text-gray-400">?</div>
            <div className="w-16 h-8 border border-gray-300 flex items-center justify-center text-gray-400">?</div>
            <div className="w-10 h-8 border border-gray-300 flex items-center justify-center text-gray-400">?</div>
          </div>
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        Fill in each box. Then add them all!
      </p>
    </div>
  )
}

/**
 * DivisionGroupingSetupAnimation - Shows objects for equal grouping
 * SETUP MODE: Objects shown, empty circles for groups
 */
function DivisionGroupingSetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [12, 3]
  const total = operands[0]
  const groupSize = operands[1]
  const numGroups = Math.floor(total / groupSize)

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center">
      {/* Objects to distribute */}
      <div className="flex flex-wrap justify-center gap-1 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="text-2xl">●</span>
        ))}
      </div>
      {/* Empty circles for groups */}
      <div className="flex justify-center gap-4">
        {Array.from({ length: numGroups }, (_, i) => (
          <div
            key={i}
            className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full"
          />
        ))}
      </div>
      <p className="text-gray-600 mt-2">
        Put {groupSize} in each circle. How many groups?
      </p>
    </div>
  )
}

/**
 * LongDivisionSetupAnimation - Shows long division format
 * SETUP MODE: Format only, no solution steps
 */
function LongDivisionSetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [84, 7]
  const dividend = operands[0]
  const divisor = operands[1]

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center font-mono text-2xl">
      <div className="inline-block">
        <div className="flex items-end">
          <span className="text-gray-400 mr-1">?</span>
          <div className="border-b-2 border-l-2 border-gray-600 pl-2 pb-1">
            {dividend}
          </div>
        </div>
        <div className="text-right pr-2">
          <span className="text-sm">{divisor} )</span>
        </div>
      </div>
      <p className="text-base text-gray-600 mt-2 font-sans">
        How many times does {divisor} go into {String(dividend)[0]}?
      </p>
    </div>
  )
}
