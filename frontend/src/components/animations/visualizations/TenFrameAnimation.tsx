/**
 * TenFrameAnimation - Visual representation of the ten-frame for make-10 strategy
 * Phase 1.12: Educational Animation System
 *
 * PEDAGOGICAL APPROACH (from Master Math Teacher):
 * - The ten-frame is a foundational tool for number sense
 * - Helps students visualize numbers in relation to 10
 * - Supports the "make 10" strategy for efficient mental math
 * - SETUP MODE (default): Shows first addend filled, prompts "how many more to make 10?"
 * - SOLUTION MODE: Animates filling to 10, then shows extras
 *
 * Used for:
 * - Level 2A: add_4 through add_10, make-10 strategy
 * - Level A: addition_sums_to_15, addition_sums_to_18, addition_sums_to_20
 * - Understanding number bonds to 10
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { TenFrameAnimationProps } from '../core/types'

export default function TenFrameAnimation({
  problemData,
  showMake10 = true,
  filledColor = '#00B2A9',
  showSolution = false,
  onComplete,
  className,
}: TenFrameAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'fill-to-10' | 'show-extras' | 'complete'>('initial')
  const [filledCount, setFilledCount] = useState(0)
  const { playPop, playDing, playSuccess } = useSoundEffects()

  // Extract operands
  const operands = problemData?.operands || [8, 5]
  const firstNumber = operands[0]
  const secondNumber = operands[1]
  const total = firstNumber + secondNumber

  // Calculate make-10 breakdown
  const toMake10 = Math.min(10 - firstNumber, secondNumber)
  const extras = total > 10 ? total - 10 : 0

  // Initialize filled count
  useEffect(() => {
    setFilledCount(firstNumber)
    setAnimationPhase('initial')
  }, [firstNumber])

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) return

    // Phase 1: Fill to 10
    const fillTimer = setInterval(() => {
      setFilledCount((prev) => {
        if (prev >= Math.min(10, total)) {
          clearInterval(fillTimer)
          setAnimationPhase('fill-to-10')
          playDing() // Play ding when we reach 10

          // Phase 2: Show extras after a pause
          setTimeout(() => {
            setAnimationPhase('show-extras')
            setTimeout(() => {
              setAnimationPhase('complete')
              playSuccess() // Play success when complete
              onComplete?.()
            }, 1000)
          }, 500)

          return Math.min(10, total)
        }
        playPop() // Play pop for each cell fill
        return prev + 1
      })
    }, 400)

    return () => clearInterval(fillTimer)
  }, [showSolution, total, onComplete, playPop, playDing, playSuccess])

  // Render a single cell of the ten-frame - responsive sizing
  const renderCell = (index: number, isFilled: boolean, isNew: boolean, isHighlighted: boolean) => (
    <motion.div
      key={index}
      className={cn(
        // Responsive cell sizing: 32px on mobile, 36px on sm, 40px on md+
        'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border-2 rounded-lg flex items-center justify-center transition-colors',
        isFilled ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white',
        isHighlighted && 'ring-2 ring-yellow-400'
      )}
      initial={{ scale: 1 }}
      animate={isNew ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isFilled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              // Responsive inner circle: 20px on mobile, 22px on sm, 24px on md+
              'w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 rounded-full',
              isNew ? 'bg-yellow-400' : 'bg-primary'
            )}
            style={{ backgroundColor: isNew ? '#FBBF24' : filledColor }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Main Ten-Frame */}
      <div className="flex flex-col items-center">
        {/* Ten-Frame Grid (2 rows x 5 columns) - responsive gaps */}
        <div className="relative">
          {/* First row (1-5) */}
          <div className="flex gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            {[0, 1, 2, 3, 4].map((i) => {
              const cellIndex = i
              const isFilled = cellIndex < filledCount
              const isOriginal = cellIndex < firstNumber
              const isNew = showSolution && isFilled && !isOriginal
              const isHighlighted = !showSolution && cellIndex === firstNumber // Next empty cell
              return renderCell(cellIndex, isFilled, isNew, isHighlighted)
            })}
          </div>

          {/* Second row (6-10) */}
          <div className="flex gap-0.5 sm:gap-1">
            {[5, 6, 7, 8, 9].map((i) => {
              const cellIndex = i
              const isFilled = cellIndex < filledCount
              const isOriginal = cellIndex < firstNumber
              const isNew = showSolution && isFilled && !isOriginal
              const isHighlighted = !showSolution && cellIndex === firstNumber
              return renderCell(cellIndex, isFilled, isNew, isHighlighted)
            })}
          </div>

          {/* "10" label - responsive positioning */}
          <div className="absolute -right-6 sm:-right-7 md:-right-8 top-1/2 -translate-y-1/2 text-sm sm:text-base md:text-lg font-bold text-gray-400">
            10
          </div>
        </div>

        {/* Extras (numbers beyond 10) - responsive sizing */}
        {showSolution && extras > 0 && animationPhase !== 'initial' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 sm:mt-4"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-lg font-bold text-gray-600">+</span>
              <div className="flex gap-0.5 sm:gap-1">
                {Array.from({ length: extras }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-green-400 flex items-center justify-center"
                  >
                    <div className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-green-500" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-600">= {extras} extra</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructional Text */}
      <div className="text-center mt-6">
        {!showSolution ? (
          // SETUP MODE: Prompt make-10 thinking
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              You have <span className="text-primary font-bold">{firstNumber}</span> filled.
            </p>
            <p className="text-base mt-2">
              How many more to make <span className="font-bold">10</span>?
            </p>
            {showMake10 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-3 p-3 bg-yellow-50 rounded-lg inline-block"
              >
                <p className="text-sm text-yellow-800">
                  {10 - firstNumber} more makes 10!
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Then add the rest: {secondNumber - toMake10} more
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // SOLUTION MODE: Show make-10 process
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {animationPhase === 'initial' && (
              <p className="text-base">
                Starting with {firstNumber}...
              </p>
            )}

            {animationPhase === 'fill-to-10' && (
              <div>
                <p className="text-lg font-medium">
                  {firstNumber} + <span className="text-yellow-600">{toMake10}</span> = <span className="text-primary font-bold">10</span>
                </p>
                <p className="text-sm text-gray-500">
                  We made 10!
                </p>
              </div>
            )}

            {animationPhase === 'show-extras' && extras > 0 && (
              <div>
                <p className="text-lg font-medium">
                  10 + <span className="text-green-600">{extras}</span> = <span className="text-green-700 font-bold">{total}</span>
                </p>
              </div>
            )}

            {animationPhase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {firstNumber} + {secondNumber} = {total}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Make 10 first, then add the extras!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
