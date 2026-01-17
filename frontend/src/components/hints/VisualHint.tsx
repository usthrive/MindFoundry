import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

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
  const renderAnimation = () => {
    // For now, render placeholder animations
    // These will be replaced with actual Lottie/Rive animations
    // PEDAGOGICAL: Pass showSolution=false to show SETUP only, not the answer
    switch (animationId) {
      case 'number-line-addition':
      case 'number-line-setup':
        return <NumberLineAnimation problemData={problemData} showSolution={showSolution} />
      case 'number-line-subtraction':
      case 'number-line-setup-subtraction':
        return <NumberLineAnimation problemData={problemData} isSubtraction showSolution={showSolution} />
      case 'counting-objects':
      case 'counting-objects-setup':
        return <CountingObjectsAnimation problemData={problemData} showSolution={showSolution} />
      case 'base-10-blocks':
      case 'place-value-setup':
        return <Base10BlocksAnimation problemData={problemData} showSolution={showSolution} />
      case 'make-10-setup':
        return <Make10SetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'objects-setup-subtraction':
        return <ObjectsSetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'borrowing-setup':
      case 'vertical-subtraction-setup':
        return <VerticalSetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'array-setup':
        return <ArraySetupAnimation problemData={problemData} showSolution={showSolution} />
      case 'area-model-setup':
        return <AreaModelSetupAnimation problemData={problemData} showSolution={showSolution} />
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
// PEDAGOGICAL ANIMATION COMPONENTS
// ============================================
// These animations follow the principle: "Show SETUP, hide SOLUTION"
// When showSolution=false (default), they show only the starting point
// to prompt student thinking, NOT the answer.

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
 * NumberLineAnimation - Shows number line with starting position
 * SETUP MODE: Shows starting number highlighted, no jumps or end position
 * SOLUTION MODE: Animates jumps and shows final answer (only for teaching)
 */
function NumberLineAnimation({ problemData, isSubtraction, showSolution = false }: AnimationProps) {
  const [step, setStep] = useState(0)
  const operands = problemData?.operands || [5, 3]
  const start = operands[0]
  const jumps = isSubtraction ? -operands[1] : operands[1]
  const end = start + jumps

  useEffect(() => {
    // Only animate if showing solution
    if (!showSolution) return

    const interval = setInterval(() => {
      setStep((prev) => (prev < Math.abs(jumps) ? prev + 1 : prev))
    }, 800)
    return () => clearInterval(interval)
  }, [jumps, showSolution])

  // Generate number line points
  const minVal = Math.min(0, start, end) - 1
  const maxVal = Math.max(10, start, end) + 1
  const points = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i)

  return (
    <div className="relative">
      {/* Number Line */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {points.map((n) => (
          <div
            key={n}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium',
              // SETUP: Only highlight starting position
              n === start ? 'bg-primary text-white' : '',
              // SOLUTION: Also highlight current position and end
              showSolution && n === start + (isSubtraction ? -step : step) && step > 0 ? 'bg-primary text-white' : '',
              showSolution && n === end && step >= Math.abs(jumps) ? 'bg-green-500 text-white' : ''
            )}
          >
            {n}
          </div>
        ))}
      </div>
      {/* Jump indicator - only shown in solution mode */}
      <div className="text-center text-lg">
        {!showSolution ? (
          // SETUP: Prompt for direction
          <span className="text-gray-500">
            Start here. Which way do you go?
          </span>
        ) : (
          <>
            {step > 0 && step <= Math.abs(jumps) && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-bold"
              >
                +{step} {isSubtraction ? '←' : '→'}
              </motion.span>
            )}
            {step >= Math.abs(jumps) && (
              <span className="text-green-600 font-bold">
                = {end}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * CountingObjectsAnimation - Shows objects to count
 * SETUP MODE: Shows all objects at once, no counting animation or total
 * SOLUTION MODE: Counts objects one by one and shows total
 */
function CountingObjectsAnimation({ problemData, showSolution = false }: AnimationProps) {
  const [count, setCount] = useState(0)
  const operands = problemData?.operands || [5, 3]
  const total = operands[0] + operands[1]

  useEffect(() => {
    // Only animate counting if showing solution
    if (!showSolution) return

    const interval = setInterval(() => {
      setCount((prev) => (prev < total ? prev + 1 : prev))
    }, 600)
    return () => clearInterval(interval)
  }, [total, showSolution])

  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {Array.from({ length: total }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: showSolution ? 0 : 1 }}
            animate={{ scale: showSolution ? (i < count ? 1 : 0) : 1 }}
            className="text-3xl"
          >
            🍎
          </motion.span>
        ))}
      </div>
      <div className="text-2xl font-bold text-primary">
        {showSolution ? `${count} / ${total}` : 'How many in total?'}
      </div>
    </div>
  )
}

/**
 * Base10BlocksAnimation - Shows place value blocks
 * SETUP MODE: Shows blocks for numbers separately, no combining
 * SOLUTION MODE: Animates combining blocks
 */
function Base10BlocksAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [23, 15]

  const renderBlocks = (num: number) => {
    const tens = Math.floor(num / 10)
    const ones = num % 10
    return (
      <div className="flex items-end gap-2">
        {/* Tens (rods) */}
        {Array.from({ length: tens }, (_, i) => (
          <div key={`ten-${i}`} className="w-3 h-16 bg-blue-400 rounded" />
        ))}
        {/* Ones (units) */}
        <div className="flex flex-wrap gap-0.5 w-8">
          {Array.from({ length: ones }, (_, i) => (
            <div key={`one-${i}`} className="w-3 h-3 bg-yellow-400 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4">
        {renderBlocks(operands[0])}
        <span className="text-2xl font-bold text-gray-600">+</span>
        {renderBlocks(operands[1])}
      </div>
      <div className="mt-2 text-gray-500">
        {showSolution ? '' : 'Add the ones first. Do you need to regroup?'}
      </div>
    </div>
  )
}

/**
 * Make10SetupAnimation - Shows 10-frame for make-10 strategy
 * SETUP MODE: Empty 10-frame, prompting student to fill
 */
function Make10SetupAnimation({ problemData, showSolution = false }: AnimationProps) {
  const operands = problemData?.operands || [8, 5]
  const num1 = operands[0]

  // Mark unused to avoid TS error
  void showSolution

  return (
    <div className="text-center">
      {/* 10-frame grid */}
      <div className="inline-grid grid-cols-5 gap-1 mb-3">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center',
              i < num1 ? 'bg-blue-100' : ''
            )}
          >
            {i < num1 && <span className="text-lg">●</span>}
          </div>
        ))}
      </div>
      <p className="text-gray-600">
        You have {num1}. How many more to make 10?
      </p>
    </div>
  )
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
