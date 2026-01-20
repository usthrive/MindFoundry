/**
 * CountingObjectsAnimation - Visual representation of counting objects
 * Phase 1.12: Educational Animation System
 *
 * PEDAGOGICAL APPROACH (from Master Math Teacher):
 * - Concrete first: Real-world objects children can relate to
 * - One-to-one correspondence: Touch and count each object
 * - SETUP MODE (default): Shows all objects, prompts student to count
 * - SOLUTION MODE: Highlights objects one-by-one with counting animation
 *
 * Used for:
 * - Level 7A: count_pictures_to_5, count_pictures_to_10
 * - Level 6A: count_to_5, count_to_10, count_to_20, count_to_30
 * - Level 4A: write_number_*, match_number_to_objects
 * - Addition visualization with concrete objects
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { CountingObjectsAnimationProps } from '../core/types'

// Fun emoji objects for counting (age-appropriate, engaging)
const COUNTING_OBJECTS = ['🍎', '🌟', '🐻', '🦋', '🌸', '🎈', '🍪', '🐱', '🌈', '🎀']

export default function CountingObjectsAnimation({
  problemData,
  objectEmoji,
  showGroups = false,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: CountingObjectsAnimationProps) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [countDisplay, setCountDisplay] = useState(0)
  const { playPop, playSuccess } = useSoundEffects()

  // Refs for proper interval-based animation (sounds outside state updaters)
  const countRef = useRef(0)
  const isPausedRef = useRef(isPaused)

  // Keep isPausedRef in sync with prop
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract data from problem
  const operands = problemData?.operands || [5]
  const totalCount = operands.reduce((sum, n) => sum + n, 0)
  const hasMultipleGroups = operands.length > 1 && showGroups

  // Pick a random (but consistent) emoji for this animation
  const emoji = useMemo(() => {
    if (objectEmoji) return objectEmoji
    // Use total count as seed for consistent emoji per problem
    return COUNTING_OBJECTS[totalCount % COUNTING_OBJECTS.length]
  }, [objectEmoji, totalCount])

  // Animation effect for solution mode
  // FIXED: Sound effects moved OUTSIDE state updater callbacks (they should be pure)
  useEffect(() => {
    if (!showSolution) {
      // Reset refs when not in solution mode
      countRef.current = 0
      return
    }

    const countDelay = 600 // ms between each count

    // Start with first item immediately
    countRef.current = 1
    setHighlightedIndex(0)
    setCountDisplay(1)
    playPop() // Play pop for first item - OUTSIDE state updater

    const timer = setInterval(() => {
      // Skip if paused
      if (isPausedRef.current) return

      // Check if we're done
      if (countRef.current >= totalCount) {
        clearInterval(timer)
        playSuccess() // Play success sound - OUTSIDE state updater
        onComplete?.()
        return
      }

      // Increment count and update state
      countRef.current++
      setHighlightedIndex(countRef.current - 1)
      setCountDisplay(countRef.current)
      playPop() // Play pop sound - OUTSIDE state updater
    }, countDelay)

    return () => clearInterval(timer)
  }, [showSolution, totalCount, onComplete, playPop, playSuccess])

  // Generate object positions with nice layout
  const objects = useMemo(() => {
    const items: { index: number; group: number }[] = []
    let currentIndex = 0

    operands.forEach((count, groupIndex) => {
      for (let i = 0; i < count; i++) {
        items.push({ index: currentIndex++, group: groupIndex })
      }
    })

    return items
  }, [operands])

  // Grid columns based on total count - responsive for mobile
  // On small screens, use fewer columns to prevent overflow
  const baseGridCols = totalCount <= 5 ? totalCount : totalCount <= 10 ? 5 : totalCount <= 20 ? 5 : 6

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Objects Grid - responsive wrapper */}
      <div className="flex justify-center px-2">
        <div
          className="grid gap-1 sm:gap-2 w-full"
          style={{
            // Use auto-fit with minmax for responsive columns
            // On small screens (40px items + 4px gap) × 5 = 220px fits in 280px+
            gridTemplateColumns: `repeat(auto-fit, minmax(40px, 1fr))`,
            maxWidth: `${Math.min(baseGridCols * 52, 280)}px`, // Cap max width for centering
          }}
        >
          {objects.map(({ index, group }) => {
            const isHighlighted = showSolution && index <= highlightedIndex
            const isCurrentlyPointing = showSolution && index === highlightedIndex

            // Determine group-specific styling
            const groupStyles = hasMultipleGroups
              ? group === 0
                ? 'bg-blue-100 border-2 border-blue-400'
                : 'bg-green-100 border-2 border-green-400'
              : 'bg-gray-50 border border-gray-200'

            return (
              <motion.div
                key={index}
                className={cn(
                  'relative flex items-center justify-center',
                  // Responsive sizing: smaller on mobile, larger on desktop
                  'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg transition-all',
                  // Group coloring (always visible)
                  groupStyles,
                  // Highlight ring during counting (adds to group styling)
                  isHighlighted && 'ring-2 ring-yellow-400 ring-offset-1 sm:ring-offset-2'
                )}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isCurrentlyPointing ? 1.2 : 1,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: showSolution ? 0 : index * 0.05,
                }}
              >
                {/* The emoji object - responsive size */}
                <span className="text-2xl sm:text-2xl md:text-3xl">{emoji}</span>

                {/* Count badge (solution mode) - responsive */}
                <AnimatePresence>
                  {isHighlighted && showSolution && (
                    <motion.div
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold"
                    >
                      {index + 1}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pointing finger (current item in solution mode) */}
                <AnimatePresence>
                  {isCurrentlyPointing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -bottom-6 text-2xl"
                    >
                      👆
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Group Labels (for addition visualization) */}
      {hasMultipleGroups && (
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="text-blue-600 font-medium">{operands[0]}</div>
            <div className="text-xs text-gray-500">Group 1</div>
          </div>
          <div className="text-2xl text-gray-400">+</div>
          <div className="text-center">
            <div className="text-green-600 font-medium">{operands[1]}</div>
            <div className="text-xs text-gray-500">Group 2</div>
          </div>
        </div>
      )}

      {/* Instructional Text / Count Display */}
      <div className="text-center mt-4">
        {!showSolution ? (
          // SETUP MODE: Prompt counting
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              How many {emoji} do you see?
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Touch each one as you count!
            </p>
            {totalCount > 10 && (
              <p className="text-xs mt-2 text-gray-400">
                Tip: Group by 5s or 10s to make it easier!
              </p>
            )}
          </motion.div>
        ) : (
          // SOLUTION MODE: Show counting progress
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {highlightedIndex < totalCount - 1 ? (
              <div>
                <motion.p
                  key={countDisplay}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-primary"
                >
                  {countDisplay}
                </motion.p>
                <p className="text-sm text-gray-500 mt-1">
                  Keep counting...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {totalCount} {emoji}!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Great counting!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
