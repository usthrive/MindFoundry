/**
 * ArrayGroupsAnimation - Visual representation of multiplication as arrays
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Multiplication is "groups of" - show rows/columns visually
 * - 3 × 4 = "3 rows of 4" or "3 groups of 4"
 * - Students see the array, then count by groups
 * - SETUP MODE (default): Shows empty grid with problem
 * - SOLUTION MODE: Fills in array row by row with counting
 *
 * Used for:
 * - Level C: times_table_2_3, times_table_4_5, times_table_6_7, times_table_8_9
 * - Level C: multiplication_2digit_by_1digit (conceptually)
 * - Concept introductions for multiplication
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

// Fun emojis for array objects
const ARRAY_OBJECTS = ['🔵', '🟢', '🟡', '🔴', '🟣', '⭐', '🌟', '💎', '🍎', '🌸']

export interface ArrayGroupsAnimationProps extends BaseAnimationProps {
  /** Use emoji instead of colored circles */
  useEmoji?: boolean
}

export default function ArrayGroupsAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  useEmoji = true,
}: ArrayGroupsAnimationProps) {
  const [currentRow, setCurrentRow] = useState(-1)
  const [filledCells, setFilledCells] = useState<Set<number>>(new Set())
  const [runningTotal, setRunningTotal] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<'building' | 'counting' | 'complete'>('building')
  // NEW: Track which cell is being pointed at during counting
  const [highlightedCellIndex, setHighlightedCellIndex] = useState(-1)
  const { playPop, playSuccess } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const rowIndexRef = useRef(0)
  const countRef = useRef(0)
  const filledCellsRef = useRef<Set<number>>(new Set())

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract operands: [multiplicand, multiplier] e.g., [4, 5] = 4 × 5
  const operands = problemData?.operands || [3, 4]
  const rows = operands[0] // Number of groups/rows
  const cols = operands[1] // Items per group/columns
  const product = rows * cols

  // Pick a consistent emoji based on operands
  const emoji = useMemo(() => {
    const index = (rows + cols) % ARRAY_OBJECTS.length
    return ARRAY_OBJECTS[index]
  }, [rows, cols])

  // Educational scripts for each phase
  const scripts = {
    setup: `We're going to multiply ${rows} × ${cols}. This means ${rows} groups of ${cols}.`,
    building: `Building ${rows} rows with ${cols} items in each row.`,
    counting: `Let's count all the ${emoji}. Count with me...`,
    complete: `${rows} groups of ${cols} equals ${product}! Great job!`,
  }

  // Animation effect for solution mode - IMPROVED PACING for children
  useEffect(() => {
    if (!showSolution) {
      setCurrentRow(-1)
      setFilledCells(new Set())
      setRunningTotal(0)
      setAnimationPhase('building')
      setHighlightedCellIndex(-1)
      rowIndexRef.current = 0
      countRef.current = 0
      filledCellsRef.current = new Set()
      return
    }

    // Phase 1: Build array row by row
    // IMPROVED: 1200ms between rows for better comprehension
    const buildDelay = 1200

    const buildTimer = setInterval(() => {
      // Skip if paused
      if (isPausedRef.current) return

      if (rowIndexRef.current >= rows) {
        clearInterval(buildTimer)
        setAnimationPhase('counting')

        // Phase 2: Show counting animation after a pause
        // IMPROVED: 800ms delay before counting starts
        setTimeout(() => {
          const countTimer = setInterval(() => {
            // Skip if paused
            if (isPausedRef.current) return

            // Highlight current cell being counted (0-indexed, countRef is 1-indexed after increment)
            setHighlightedCellIndex(countRef.current)
            countRef.current++
            setRunningTotal(countRef.current)
            playPop()

            if (countRef.current >= product) {
              clearInterval(countTimer)
              setAnimationPhase('complete')
              setHighlightedCellIndex(-1) // Clear highlight when complete
              playSuccess()
              onComplete?.()
            }
          }, 600)  // IMPROVED: 600ms per count for clear counting
        }, 800)
        return
      }

      // Fill in this row
      setCurrentRow(rowIndexRef.current)
      for (let c = 0; c < cols; c++) {
        filledCellsRef.current.add(rowIndexRef.current * cols + c)
      }
      setFilledCells(new Set(filledCellsRef.current))
      playPop()
      rowIndexRef.current++
    }, buildDelay)

    // Start first row immediately (but check pause)
    if (!isPausedRef.current) {
      setCurrentRow(0)
      for (let c = 0; c < cols; c++) {
        filledCellsRef.current.add(c)
      }
      setFilledCells(new Set(filledCellsRef.current))
      playPop()
      rowIndexRef.current = 1
    }

    return () => clearInterval(buildTimer)
  }, [showSolution, rows, cols, product, onComplete, playPop, playSuccess])

  // Calculate cell size based on array size
  const cellSize = useMemo(() => {
    const total = rows * cols
    if (total <= 12) return 'lg'
    if (total <= 30) return 'md'
    return 'sm'
  }, [rows, cols])

  const cellClasses = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7 text-sm',
    md: 'w-8 h-8 sm:w-10 sm:h-10 text-lg',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl',
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
          {rows} × {cols} = {showSolution && animationPhase === 'complete' ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-600"
            >
              {product}
            </motion.span>
          ) : (
            <span className="text-primary">?</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {rows} {rows === 1 ? 'group' : 'groups'} of {cols}
        </p>
      </div>

      {/* Educational Script */}
      {showSolution && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-blue-800">
            {animationPhase === 'building' ? scripts.building :
             animationPhase === 'counting' ? scripts.counting :
             animationPhase === 'complete' ? scripts.complete : scripts.setup}
          </p>
        </div>
      )}

      {/* Array Grid */}
      <div className="flex justify-center px-4">
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows * cols }, (_, index) => {
            const row = Math.floor(index / cols)
            const isFilled = showSolution ? filledCells.has(index) : false
            const isCurrentRow = showSolution && row === currentRow
            // NEW: Check if this cell is currently being pointed at during counting
            const isBeingCounted = showSolution && animationPhase === 'counting' && index === highlightedCellIndex

            return (
              <motion.div
                key={index}
                initial={!showSolution ? { scale: 0, opacity: 0 } : undefined}
                animate={{
                  scale: isBeingCounted ? 1.15 : (isFilled ? 1 : 0.8),
                  opacity: showSolution ? (isFilled ? 1 : 0.3) : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  delay: !showSolution ? index * 0.03 : 0,
                }}
                className={cn(
                  cellClasses[cellSize],
                  'rounded-lg flex items-center justify-center relative',
                  'border-2 transition-all',
                  isFilled
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-gray-100 border-gray-200 border-dashed',
                  isCurrentRow && isFilled && animationPhase === 'building' && 'ring-2 ring-yellow-400 ring-offset-1',
                  // Highlight currently counted cell
                  isBeingCounted && 'ring-4 ring-green-400 ring-offset-2 bg-green-100 border-green-500 z-10'
                )}
              >
                <AnimatePresence mode="wait">
                  {(isFilled || !showSolution) && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {useEmoji ? emoji : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary" />
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Pointing finger indicator during counting */}
                {isBeingCounted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 text-2xl z-20"
                  >
                    👆
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Row Labels */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: rows }, (_, r) => (
          <motion.div
            key={r}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: showSolution && r <= currentRow ? 1 : 0.4,
              y: 0,
            }}
            className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              showSolution && r === currentRow
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            Row {r + 1}: {cols}
          </motion.div>
        ))}
      </div>

      {/* Running Total / Instructions */}
      <div className="text-center mt-6">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              How many {emoji} in total?
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Count the array: {rows} rows with {cols} in each row
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {animationPhase === 'building' && (
              <div>
                <p className="text-lg font-medium text-primary">
                  Building rows...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentRow + 1} of {rows} rows shown
                </p>
              </div>
            )}
            {animationPhase === 'counting' && (
              <div>
                <motion.p
                  key={runningTotal}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-primary"
                >
                  {runningTotal}
                </motion.p>
                <p className="text-sm text-gray-500 mt-1">
                  Counting all {emoji}...
                </p>
              </div>
            )}
            {animationPhase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {rows} × {cols} = {product}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {rows} groups of {cols} equals {product}!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
