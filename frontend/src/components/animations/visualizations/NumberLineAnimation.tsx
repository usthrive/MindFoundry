/**
 * NumberLineAnimation - Visual representation of addition/subtraction on a number line
 * Phase 1.12: Educational Animation System
 *
 * PEDAGOGICAL APPROACH (from Master Math Teacher):
 * - Concrete → Pictorial → Abstract (CPA progression)
 * - SETUP MODE (default): Shows starting position only, prompting student thinking
 * - SOLUTION MODE: Animates hops and shows final answer (for Full Teaching only)
 *
 * Used for:
 * - Level 3A: add_1_*, add_2_*, add_3_*
 * - Level A: subtract_1, subtract_2, subtract_3
 * - Sequences and number relationships
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { NumberLineAnimationProps } from '../core/types'

export default function NumberLineAnimation({
  problemData,
  isSubtraction = false,
  showSolution = false,
  range,
  onComplete,
  className,
}: NumberLineAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { playWhoosh, playSuccess } = useSoundEffects()

  // Extract operands from problem data
  const operands = problemData?.operands || [5, 3]
  const start = operands[0]
  const hopCount = operands[1]
  const direction = isSubtraction ? -1 : 1
  const end = start + hopCount * direction

  // Calculate number line range - limit to max 10 points for mobile responsiveness
  const { min, max, points } = useMemo(() => {
    const maxVisiblePoints = 10 // Limit for mobile screens (10 × 28px = 280px fits in 320px)

    // Center the range around the problem's start and end points
    const problemMin = Math.min(start, end)
    const problemMax = Math.max(start, end)
    const problemSpan = problemMax - problemMin

    // Calculate padding on each side (at least 1 number before/after)
    const availablePadding = maxVisiblePoints - problemSpan - 1
    const paddingBefore = Math.max(1, Math.floor(availablePadding / 2))
    const paddingAfter = Math.max(1, availablePadding - paddingBefore)

    // Determine visible range
    let minVal = Math.max(0, problemMin - paddingBefore)
    let maxVal = problemMax + paddingAfter

    // Apply custom range constraints if provided
    if (range) {
      minVal = Math.max(range.min, minVal)
      maxVal = Math.min(range.max, maxVal)
    }

    // Ensure we don't exceed maxVisiblePoints
    if (maxVal - minVal + 1 > maxVisiblePoints) {
      // Prioritize showing the problem range
      minVal = Math.max(0, problemMin - 1)
      maxVal = minVal + maxVisiblePoints - 1
    }

    // Generate points for the visible range
    const pts = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i)
    return { min: minVal, max: maxVal, points: pts }
  }, [start, end, range])

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) return

    setIsAnimating(true)
    const stepDelay = 800 // ms between each hop

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= hopCount) {
          clearInterval(timer)
          setIsAnimating(false)
          playSuccess() // Play success sound when complete
          onComplete?.()
          return prev
        }
        playWhoosh() // Play whoosh sound for each hop
        return prev + 1
      })
    }, stepDelay)

    return () => clearInterval(timer)
  }, [showSolution, hopCount, onComplete, playWhoosh, playSuccess])

  // Current position during animation
  const currentPosition = start + currentStep * direction

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Number Line Container - responsive with overflow scroll fallback */}
      <div className="relative w-full overflow-x-auto">
        {/* The Line */}
        <div className="relative h-14 sm:h-16 flex items-center min-w-fit">
          {/* Base line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gray-300 top-1/2 -translate-y-1/2" />

          {/* Number markers - responsive spacing */}
          <div className="relative w-full flex justify-between px-1 sm:px-2">
            {points.map((num) => {
              const isStart = num === start
              const isCurrent = showSolution && num === currentPosition && currentStep > 0
              const isEnd = showSolution && num === end && currentStep >= hopCount

              return (
                <div
                  key={num}
                  className="relative flex flex-col items-center"
                >
                  {/* Tick mark - responsive */}
                  <div
                    className={cn(
                      'w-0.5 h-2 sm:h-3 mb-0.5 sm:mb-1',
                      isStart || isCurrent || isEnd ? 'bg-primary' : 'bg-gray-400'
                    )}
                  />

                  {/* Number - responsive circle sizes */}
                  <motion.div
                    className={cn(
                      'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all',
                      isStart && 'bg-primary text-white ring-2 ring-primary/30',
                      isCurrent && !isEnd && 'bg-yellow-400 text-gray-900',
                      isEnd && 'bg-green-500 text-white ring-2 ring-green-300',
                      !isStart && !isCurrent && !isEnd && 'bg-gray-100 text-gray-700'
                    )}
                    animate={
                      isStart
                        ? { scale: [1, 1.1, 1] }
                        : isEnd
                          ? { scale: [1, 1.2, 1] }
                          : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {num}
                  </motion.div>

                  {/* Start label - responsive positioning */}
                  {isStart && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-4 sm:-top-5 md:-top-6 text-[10px] sm:text-xs text-primary font-medium whitespace-nowrap"
                    >
                      Start!
                    </motion.span>
                  )}

                  {/* End label (solution mode only) - responsive */}
                  {isEnd && currentStep >= hopCount && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-4 sm:-bottom-5 md:-bottom-6 text-[10px] sm:text-xs text-green-600 font-medium"
                    >
                      Answer!
                    </motion.span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Hop Arcs (solution mode only) - responsive */}
        <AnimatePresence>
          {showSolution && currentStep > 0 && (
            <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 pointer-events-none">
              {Array.from({ length: Math.min(currentStep, hopCount) }, (_, i) => {
                const hopStart = start + i * direction
                const hopEnd = start + (i + 1) * direction
                const startIndex = points.indexOf(hopStart)
                const endIndex = points.indexOf(hopEnd)

                if (startIndex === -1 || endIndex === -1) return null

                const startPercent = (startIndex / (points.length - 1)) * 100
                const endPercent = (endIndex / (points.length - 1)) * 100
                const width = Math.abs(endPercent - startPercent)
                const left = Math.min(startPercent, endPercent)

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute"
                    style={{
                      left: `calc(${left}% + 1rem)`,
                      width: `calc(${width}% - 0.5rem)`,
                      top: '0.25rem',
                    }}
                  >
                    {/* Arc - responsive height */}
                    <svg
                      viewBox="0 0 100 40"
                      className="w-full h-6 sm:h-7 md:h-8"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d={isSubtraction
                          ? "M100 35 Q 50 -10, 0 35"
                          : "M0 35 Q 50 -10, 100 35"
                        }
                        fill="none"
                        stroke="#00B2A9"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Arrow head */}
                      <motion.polygon
                        points={isSubtraction ? "5,30 0,35 5,40" : "95,30 100,35 95,40"}
                        fill="#00B2A9"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      />
                    </svg>

                    {/* Hop number - responsive */}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 sm:-translate-y-2 text-[10px] sm:text-xs font-bold text-primary bg-white px-0.5 sm:px-1 rounded"
                    >
                      {isSubtraction ? '-1' : '+1'}
                    </motion.span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructional Text */}
      <div className="text-center mt-4">
        {!showSolution ? (
          // SETUP MODE: Prompt thinking
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-base">
              Start at <span className="font-bold text-primary">{start}</span>.
            </p>
            <p className="text-sm mt-1">
              {isSubtraction
                ? `Which way do you go to subtract ${hopCount}?`
                : `Which way do you go to add ${hopCount}?`}
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-2xl">👈 Left?</span>
              <span className="text-2xl">👉 Right?</span>
            </div>
          </motion.div>
        ) : (
          // SOLUTION MODE: Show progress
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {currentStep < hopCount ? (
              <p className="text-lg">
                {start} {isSubtraction ? '-' : '+'} <span className="font-bold text-primary">{currentStep}</span> = {currentPosition}
                <span className="text-gray-400 ml-2">({hopCount - currentStep} more to go)</span>
              </p>
            ) : (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-green-600"
              >
                {start} {isSubtraction ? '-' : '+'} {hopCount} = {end}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
