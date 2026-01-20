/**
 * PlaceValueAnimation - Visual representation of place value for vertical operations
 * Phase 1.12: Educational Animation System
 *
 * PEDAGOGICAL APPROACH (from Master Math Teacher):
 * - Understanding place value is foundational for multi-digit operations
 * - Shows ones, tens, hundreds as separate columns
 * - Visualizes carrying (regrouping) and borrowing
 * - SETUP MODE: Shows the problem setup, highlights active column
 * - SOLUTION MODE: Animates the step-by-step process
 *
 * Used for:
 * - Level B: vertical_addition_2digit_*, vertical_subtraction_2digit_*
 * - Carrying and borrowing visualization
 * - Base-10 block representation
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { PlaceValueAnimationProps } from '../core/types'

type AnimationStep =
  | 'setup'
  | 'highlight-ones'
  | 'borrow'
  | 'add-ones'
  | 'carry'
  | 'highlight-tens'
  | 'add-tens'
  | 'highlight-hundreds'
  | 'add-hundreds'
  | 'complete'

export default function PlaceValueAnimation({
  problemData,
  showRegrouping = true,
  operationType = 'addition',
  showSolution = false,
  onComplete,
  className,
}: PlaceValueAnimationProps) {
  const [currentStep, setCurrentStep] = useState<AnimationStep>('setup')
  const [carryValue, setCarryValue] = useState<number | null>(null)
  const [borrowActive, setBorrowActive] = useState(false)
  const { playClick, playBorrow, playCarry, playSuccess } = useSoundEffects()

  // Extract operands
  const operands = problemData?.operands || [47, 35]
  const isSubtraction = operationType === 'subtraction'
  const num1 = operands[0]
  const num2 = operands[1]
  const result = isSubtraction ? num1 - num2 : num1 + num2

  // Break down numbers into place values
  const breakdown = useMemo(() => {
    const getDigits = (n: number) => ({
      ones: n % 10,
      tens: Math.floor((n % 100) / 10),
      hundreds: Math.floor(n / 100),
    })

    const n1 = getDigits(num1)
    const n2 = getDigits(num2)
    const res = getDigits(Math.abs(result))

    // Check if carrying/borrowing is needed
    const needsCarryOnes = !isSubtraction && n1.ones + n2.ones >= 10
    const needsCarryTens = !isSubtraction && n1.tens + n2.tens + (needsCarryOnes ? 1 : 0) >= 10
    const needsBorrowOnes = isSubtraction && n1.ones < n2.ones
    const needsBorrowTens = isSubtraction && (n1.tens - (needsBorrowOnes ? 1 : 0)) < n2.tens

    return {
      num1: n1,
      num2: n2,
      result: res,
      needsCarryOnes,
      needsCarryTens,
      needsBorrowOnes,
      needsBorrowTens,
    }
  }, [num1, num2, result, isSubtraction])

  // Animation sequence for solution mode
  useEffect(() => {
    if (!showSolution) return

    const steps: AnimationStep[] = ['highlight-ones']

    // Add borrow step for subtraction if needed
    if (breakdown.needsBorrowOnes) {
      steps.push('borrow')
    }

    steps.push('add-ones')

    if (breakdown.needsCarryOnes) {
      steps.push('carry')
    }

    steps.push('highlight-tens', 'add-tens')

    if (breakdown.num1.hundreds > 0 || breakdown.num2.hundreds > 0) {
      steps.push('highlight-hundreds', 'add-hundreds')
    }

    steps.push('complete')

    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval)
        onComplete?.()
        return
      }

      const step = steps[stepIndex]
      setCurrentStep(step)

      // Play appropriate sound for each step
      if (step === 'carry') {
        setCarryValue(1)
        playCarry() // Ascending tone for carrying
      } else if (step === 'borrow') {
        setBorrowActive(true)
        playBorrow() // Descending tone for borrowing
      } else if (step === 'complete') {
        playSuccess() // Cheerful success sound
      } else {
        playClick() // Click sound for other steps
      }

      stepIndex++
    }, 700) // Reduced from 1200ms to 700ms for better pedagogical pacing

    return () => clearInterval(interval)
  }, [showSolution, breakdown, onComplete, playClick, playBorrow, playCarry, playSuccess])

  // Helper to render a place value column - responsive sizing
  const renderColumn = (
    label: string,
    digit1: number,
    digit2: number,
    resultDigit: number,
    isActive: boolean,
    showResult: boolean
  ) => (
    <div className="flex flex-col items-center">
      {/* Column label - responsive */}
      <div className={cn(
        'text-[10px] sm:text-xs font-medium mb-1 sm:mb-2 px-1.5 sm:px-2 py-0.5 rounded',
        isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
      )}>
        {label}
      </div>

      {/* First number digit - responsive sizing */}
      <motion.div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-lg sm:text-xl font-bold rounded',
          isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
        )}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      >
        {digit1}
      </motion.div>

      {/* Second number digit - responsive sizing */}
      <motion.div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-lg sm:text-xl font-bold rounded',
          isActive ? 'bg-green-100 text-green-700' : 'text-gray-700'
        )}
      >
        {digit2}
      </motion.div>

      {/* Divider line - responsive width */}
      <div className="w-8 sm:w-9 md:w-10 h-0.5 bg-gray-400 my-0.5 sm:my-1" />

      {/* Result digit - responsive sizing */}
      <motion.div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-lg sm:text-xl font-bold rounded',
          showResult ? 'bg-yellow-100 text-yellow-700' : 'text-transparent'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: showResult ? 1 : 0 }}
      >
        {resultDigit}
      </motion.div>
    </div>
  )

  const showOnesResult = ['add-ones', 'carry', 'highlight-tens', 'add-tens', 'highlight-hundreds', 'add-hundreds', 'complete'].includes(currentStep)
  const showTensResult = ['add-tens', 'highlight-hundreds', 'add-hundreds', 'complete'].includes(currentStep)
  const showHundredsResult = ['add-hundreds', 'complete'].includes(currentStep)

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Vertical Problem Layout */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Carry indicator (for addition) - responsive */}
          <AnimatePresence>
            {carryValue && showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-6 sm:-top-7 md:-top-8 right-10 sm:right-11 md:right-12 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold"
              >
                {carryValue}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Borrow indicator (for subtraction) - responsive */}
          <AnimatePresence>
            {borrowActive && showSolution && (
              <>
                {/* Small "1" being borrowed shown above ones column */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 sm:-top-7 md:-top-8 right-0 w-7 h-5 sm:w-8 sm:h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold"
                >
                  +10
                </motion.div>
                {/* Crossed out from tens - responsive */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 sm:-top-7 md:-top-8 right-11 sm:right-12 md:right-14 w-5 h-5 sm:w-6 sm:h-6 bg-orange-300 text-orange-800 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold"
                >
                  -1
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Place Value Columns - responsive gap */}
          <div className="flex gap-1 sm:gap-1.5 md:gap-2">
            {/* Hundreds column (if needed) */}
            {(breakdown.num1.hundreds > 0 || breakdown.num2.hundreds > 0 || breakdown.result.hundreds > 0) && (
              renderColumn(
                'Hundreds',
                breakdown.num1.hundreds,
                breakdown.num2.hundreds,
                breakdown.result.hundreds,
                currentStep === 'highlight-hundreds' || currentStep === 'add-hundreds',
                showHundredsResult
              )
            )}

            {/* Tens column */}
            {renderColumn(
              'Tens',
              breakdown.num1.tens,
              breakdown.num2.tens,
              breakdown.result.tens,
              currentStep === 'highlight-tens' || currentStep === 'add-tens',
              showTensResult
            )}

            {/* Ones column */}
            {renderColumn(
              'Ones',
              breakdown.num1.ones,
              breakdown.num2.ones,
              breakdown.result.ones,
              currentStep === 'highlight-ones' || currentStep === 'add-ones',
              showOnesResult
            )}
          </div>

          {/* Operation sign - responsive */}
          <div className="absolute left-0 top-10 sm:top-11 md:top-12 -translate-x-6 sm:-translate-x-7 md:-translate-x-8 text-xl sm:text-2xl font-bold text-gray-600">
            {isSubtraction ? '−' : '+'}
          </div>
        </div>

        {/* Base-10 Blocks Visualization (simplified) */}
        {showRegrouping && !showSolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4 justify-center">
              {/* Tens (rods) */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(breakdown.num1.tens, 5) }, (_, i) => (
                  <div key={i} className="w-2 h-12 bg-blue-400 rounded" />
                ))}
                {breakdown.num1.tens > 5 && (
                  <span className="text-xs text-gray-500">+{breakdown.num1.tens - 5}</span>
                )}
              </div>

              {/* Ones (cubes) */}
              <div className="flex flex-wrap gap-1 w-16">
                {Array.from({ length: breakdown.num1.ones }, (_, i) => (
                  <div key={i} className="w-3 h-3 bg-yellow-400 rounded" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Blue rods = tens, Yellow cubes = ones
            </p>
          </motion.div>
        )}
      </div>

      {/* Instructional Text */}
      <div className="text-center mt-6">
        {!showSolution ? (
          // SETUP MODE
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              {num1} {isSubtraction ? '−' : '+'} {num2} = ?
            </p>
            <p className="text-base mt-2">
              Start with the <span className="font-bold text-primary">ones</span> column.
            </p>
            {isSubtraction ? (
              <p className="text-sm mt-1 text-gray-500">
                Can you subtract {breakdown.num2.ones} from {breakdown.num1.ones}?
                {breakdown.needsBorrowOnes && ' You might need to borrow!'}
              </p>
            ) : (
              <p className="text-sm mt-1 text-gray-500">
                What is {breakdown.num1.ones} + {breakdown.num2.ones}?
                {breakdown.needsCarryOnes && ' Will you need to carry?'}
              </p>
            )}
          </motion.div>
        ) : (
          // SOLUTION MODE
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {currentStep === 'highlight-ones' && (
              <p className="text-base">
                First, look at the ones: {breakdown.num1.ones} {isSubtraction ? '−' : '+'} {breakdown.num2.ones}
                {breakdown.needsBorrowOnes && (
                  <span className="text-orange-600 ml-2">
                    (Can't subtract {breakdown.num2.ones} from {breakdown.num1.ones}!)
                  </span>
                )}
              </p>
            )}

            {currentStep === 'borrow' && (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-base text-orange-600 font-medium"
              >
                Borrow 1 ten from the tens column! Now we have {breakdown.num1.ones + 10} ones.
              </motion.p>
            )}

            {currentStep === 'add-ones' && (
              <p className="text-base">
                {isSubtraction && breakdown.needsBorrowOnes ? (
                  <>
                    Ones: <span className="text-orange-600">{breakdown.num1.ones + 10}</span> − {breakdown.num2.ones} = {breakdown.result.ones}
                  </>
                ) : (
                  <>
                    Ones: {breakdown.num1.ones} {isSubtraction ? '−' : '+'} {breakdown.num2.ones} = {breakdown.result.ones}
                    {breakdown.needsCarryOnes && <span className="text-red-600 ml-2">(carry the 1!)</span>}
                  </>
                )}
              </p>
            )}

            {currentStep === 'carry' && (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-base text-red-600 font-medium"
              >
                Carry 1 ten to the tens column!
              </motion.p>
            )}

            {currentStep === 'highlight-tens' && (
              <p className="text-base">
                Now the tens:{' '}
                {isSubtraction && borrowActive ? (
                  <>
                    <span className="text-orange-600">{breakdown.num1.tens - 1}</span> − {breakdown.num2.tens}
                    <span className="text-gray-500 text-sm ml-2">(after borrowing)</span>
                  </>
                ) : (
                  <>
                    {breakdown.num1.tens} {isSubtraction ? '−' : '+'} {breakdown.num2.tens}
                    {carryValue && <span className="text-red-600"> + {carryValue}</span>}
                  </>
                )}
              </p>
            )}

            {currentStep === 'add-tens' && (
              <p className="text-base">
                Tens: {breakdown.result.tens}
              </p>
            )}

            {currentStep === 'complete' && (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-green-600"
              >
                {num1} {isSubtraction ? '−' : '+'} {num2} = {result}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
