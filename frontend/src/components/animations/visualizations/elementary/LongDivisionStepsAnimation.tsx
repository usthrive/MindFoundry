/**
 * LongDivisionStepsAnimation - Step-by-step long division algorithm
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Division algorithm: Divide, Multiply, Subtract, Bring down
 * - Show each step clearly with visual highlighting
 * - Build quotient digit by digit
 * - SETUP MODE (default): Shows division problem
 * - SOLUTION MODE: Animates each step of the algorithm
 *
 * Used for:
 * - Level C: division_2digit_by_1digit, division_3digit_by_1digit
 * - Level D: long_division, long_division_by_2digit
 * - Concept introductions for long division
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

interface DivisionStep {
  type: 'divide' | 'multiply' | 'subtract' | 'bringdown' | 'complete'
  description: string
  quotientDigit?: number
  quotientPosition?: number
  product?: number
  difference?: number
  broughtDown?: string
  columnEnd?: number  // Which column (0-indexed) this step ends at
}

// WorkLine tracks display with column-based positioning for traditional alignment
interface WorkLine {
  type: 'subtract' | 'difference' | 'bringdown'
  value: string
  columnEnd: number  // Right-most column this value occupies (0-indexed from left)
}

export default function LongDivisionStepsAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: BaseAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [visibleQuotientDigits, setVisibleQuotientDigits] = useState<number[]>([])
  const [workLines, setWorkLines] = useState<WorkLine[]>([])
  const [phase, setPhase] = useState<'setup' | 'solving' | 'complete'>('setup')
  const { playPop, playSuccess } = useSoundEffects()

  // Extract operands: [dividend, divisor] e.g., [48, 6] = 48 ÷ 6
  const operands = problemData?.operands || [48, 6]
  const dividend = operands[0]
  const divisor = operands[1]

  // Validate divisor is not zero (would cause division by zero)
  const isValidDivision = divisor !== 0 && !isNaN(dividend) && !isNaN(divisor)

  // Early return with educational error message if invalid
  if (!isValidDivision) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Cannot Divide by Zero</p>
          <p className="text-red-500 text-sm mt-2">
            {divisor === 0
              ? "We cannot divide by zero! Imagine trying to share cookies among zero friends - it doesn't make sense."
              : "Please enter valid numbers for the division problem."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>Division means splitting into equal groups. You need at least 1 group!</p>
          </div>
        </div>
      </div>
    )
  }

  const quotient = Math.floor(dividend / divisor)
  const remainder = dividend % divisor

  // Generate all steps for the long division
  // FIXED: For multi-digit divisors, look at enough digits first (no false "bring down" before first division)
  // FIXED: Track column positions for traditional visual alignment
  const steps = useMemo((): DivisionStep[] => {
    const stepList: DivisionStep[] = []
    const dividendStr = dividend.toString()
    let currentValue = 0
    let quotientDigits: number[] = []
    let digitIndex = 0
    // Track which column (0-indexed from left) the current work ends at
    // This is used for proper visual alignment under the dividend
    let currentColumnEnd = -1

    // Phase 1: Gather initial digits (silently, no "bring down" step)
    // For multi-digit divisors like 12, we need to look at multiple digits first
    // e.g., for 156 ÷ 12, we look at "15" first (not "1" then "bring down 5")
    while (digitIndex < dividendStr.length) {
      currentValue = currentValue * 10 + parseInt(dividendStr[digitIndex])
      currentColumnEnd = digitIndex  // Track the rightmost column we've looked at
      digitIndex++

      // Once we have enough digits to divide (or run out of digits), start dividing
      if (currentValue >= divisor || digitIndex >= dividendStr.length) {
        break
      }
      // Continue gathering digits silently (no step generated)
    }

    // Edge case: dividend < divisor entirely (e.g., 5 ÷ 12)
    if (currentValue < divisor && digitIndex >= dividendStr.length) {
      stepList.push({
        type: 'divide',
        description: `${currentValue} < ${divisor}, so quotient is 0`,
        quotientDigit: 0,
        quotientPosition: 0,
        columnEnd: currentColumnEnd,
      })
      stepList.push({
        type: 'complete',
        description: `Remainder: ${dividend}`,
      })
      return stepList
    }

    // Phase 2: Main division loop (Divide → Multiply → Subtract → Bring Down)
    while (true) {
      // Divide step
      const quotientDigit = Math.floor(currentValue / divisor)
      stepList.push({
        type: 'divide',
        description: `${currentValue} ÷ ${divisor} = ${quotientDigit}`,
        quotientDigit,
        quotientPosition: quotientDigits.length,
        columnEnd: currentColumnEnd,
      })
      quotientDigits.push(quotientDigit)

      // Multiply step - product aligns ending at currentColumnEnd
      const product = quotientDigit * divisor
      stepList.push({
        type: 'multiply',
        description: `${quotientDigit} × ${divisor} = ${product}`,
        product,
        columnEnd: currentColumnEnd,
      })

      // Subtract step - difference aligns ending at currentColumnEnd
      const difference = currentValue - product
      stepList.push({
        type: 'subtract',
        description: `${currentValue} - ${product} = ${difference}`,
        difference,
        columnEnd: currentColumnEnd,
      })

      currentValue = difference

      // Check if there are more digits to bring down
      if (digitIndex < dividendStr.length) {
        // Bring down the next digit - this moves currentColumnEnd to the right
        const nextDigit = dividendStr[digitIndex]
        currentColumnEnd = digitIndex  // Move to next column
        stepList.push({
          type: 'bringdown',
          description: `Bring down ${nextDigit}`,
          broughtDown: nextDigit,
          columnEnd: currentColumnEnd,
        })
        currentValue = currentValue * 10 + parseInt(nextDigit)
        digitIndex++

        // Handle case where after bringing down, we still can't divide (quotient has 0 in this position)
        // e.g., 1200 ÷ 12: after first division, bring down 0 → 0 < 12, so quotient digit is 0
        while (currentValue < divisor && digitIndex < dividendStr.length) {
          // Put a 0 in quotient
          stepList.push({
            type: 'divide',
            description: `${currentValue} < ${divisor}, quotient digit is 0`,
            quotientDigit: 0,
            quotientPosition: quotientDigits.length,
            columnEnd: currentColumnEnd,
          })
          quotientDigits.push(0)

          // Bring down another digit
          const anotherDigit = dividendStr[digitIndex]
          currentColumnEnd = digitIndex  // Move to next column
          stepList.push({
            type: 'bringdown',
            description: `Bring down ${anotherDigit}`,
            broughtDown: anotherDigit,
            columnEnd: currentColumnEnd,
          })
          currentValue = currentValue * 10 + parseInt(anotherDigit)
          digitIndex++
        }

        // If still < divisor after exhausting digits, we're done with remainder
        if (currentValue < divisor) {
          break
        }
      } else {
        // No more digits to bring down, we're done
        break
      }
    }

    stepList.push({
      type: 'complete',
      description: currentValue > 0 ? `Remainder: ${currentValue}` : 'Done!',
    })

    return stepList
  }, [dividend, divisor])

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null

  // Educational scripts for each step type
  const scripts = {
    setup: `Let's divide ${dividend} by ${divisor}. We'll use the long division method: Divide, Multiply, Subtract, Bring down.`,
    divide: `How many times does ${divisor} go into the number? This gives us a digit of the quotient.`,
    multiply: `Multiply the quotient digit by ${divisor} and write it below.`,
    subtract: `Subtract to find the difference.`,
    bringdown: `Bring down the next digit to continue.`,
    complete: remainder > 0
      ? `Done! The answer is ${quotient} with a remainder of ${remainder}.`
      : `Done! ${dividend} ÷ ${divisor} = ${quotient} exactly!`,
  }

  // Refs to track animation state across pauses
  const stepIdxRef = useRef(0)
  const quotientDigitsRef = useRef<number[]>([])
  const workRef = useRef<WorkLine[]>([])
  const isPausedRef = useRef(isPaused)
  const lastDifferenceRef = useRef(0) // Track last difference for bringdown calculation

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      // Only reset when showSolution changes to false AND we're starting fresh
      setCurrentStepIndex(-1)
      setVisibleQuotientDigits([])
      setWorkLines([])
      setPhase('setup')
      stepIdxRef.current = 0
      quotientDigitsRef.current = []
      workRef.current = []
      return
    }

    setPhase('solving')

    const stepTimer = setInterval(() => {
      // Skip this tick if paused
      if (isPausedRef.current) return

      if (stepIdxRef.current >= steps.length) {
        clearInterval(stepTimer)
        setPhase('complete')
        playSuccess()
        onComplete?.()
        return
      }

      const step = steps[stepIdxRef.current]
      setCurrentStepIndex(stepIdxRef.current)

      if (step.type === 'divide' && step.quotientDigit !== undefined) {
        quotientDigitsRef.current.push(step.quotientDigit)
        setVisibleQuotientDigits([...quotientDigitsRef.current])
      }

      if (step.type === 'multiply' && step.product !== undefined) {
        workRef.current.push({
          type: 'subtract',
          value: step.product.toString(),
          columnEnd: step.columnEnd ?? 0,
        })
        setWorkLines([...workRef.current])
      }

      if (step.type === 'subtract' && step.difference !== undefined) {
        workRef.current.push({
          type: 'difference',
          value: step.difference.toString(),
          columnEnd: step.columnEnd ?? 0,
        })
        setWorkLines([...workRef.current])
        // Track the difference for the next bringdown calculation
        lastDifferenceRef.current = step.difference
      }

      // Handle bringdown: show the combined number (difference × 10 + brought digit)
      if (step.type === 'bringdown' && step.broughtDown !== undefined) {
        const combinedNumber = lastDifferenceRef.current * 10 + parseInt(step.broughtDown)
        workRef.current.push({
          type: 'bringdown',
          value: combinedNumber.toString(),
          columnEnd: step.columnEnd ?? 0,
        })
        setWorkLines([...workRef.current])
      }

      playPop()
      stepIdxRef.current++
    }, 1200)

    return () => clearInterval(stepTimer)
  }, [showSolution, steps, onComplete, playPop, playSuccess])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-6">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
          {dividend} ÷ {divisor} = {phase === 'complete' ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-600"
            >
              {quotient}{remainder > 0 && <span className="text-orange-500"> R{remainder}</span>}
            </motion.span>
          ) : (
            <span className="text-primary">?</span>
          )}
        </div>
      </div>

      {/* Educational Script Display */}
      {showSolution && currentStep && (
        <motion.div
          key={currentStep.type}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-3 mb-4 text-center max-w-sm mx-auto"
        >
          <p className="text-sm text-blue-800">
            {scripts[currentStep.type as keyof typeof scripts]}
          </p>
        </motion.div>
      )}

      {/* Long Division Visualization - Traditional Layout */}
      <div className="flex justify-center">
        <div className="relative font-mono text-xl sm:text-2xl">
          {/* Main division structure */}
          <div className="flex items-start">
            {/* Divisor */}
            <div className="pr-2 text-blue-600 font-bold self-center">
              {divisor}
            </div>

            {/* Division bracket, quotient, dividend, and work area */}
            <div className="relative border-l-2 border-t-2 border-gray-800 pl-2 pt-1">
              {/* Quotient (above the bracket) */}
              <div className="absolute -top-8 left-2 flex text-green-600 font-bold">
                {showSolution && visibleQuotientDigits.map((digit, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-5 text-center"
                  >
                    {digit}
                  </motion.span>
                ))}
              </div>

              {/* Dividend and work area stacked vertically */}
              <div className="min-w-[80px]">
                {/* Dividend - each digit in fixed-width container */}
                <div className="text-gray-800 flex justify-end pr-1">
                  {dividend.toString().split('').map((digit, i) => (
                    <span key={i} className="w-5 text-center">{digit}</span>
                  ))}
                </div>

                {/* Work lines (directly under dividend) - COLUMN-BASED ALIGNMENT */}
                {/* Each digit column is 1.25rem (w-5). We use left padding to align values
                    so they end at the correct column position under the dividend. */}
                <AnimatePresence>
                  {workLines.map((line, i) => {
                    const valueLength = line.value.length
                    // Calculate left padding so the value ends at columnEnd
                    // columnEnd is 0-indexed from left, valueLength tells us how many columns the value spans
                    // The value should start at column (columnEnd - valueLength + 1)
                    const columnStart = line.columnEnd - valueLength + 1
                    // Convert to rem (1.25rem per column) + account for minus sign space (1rem)
                    const leftPaddingRem = Math.max(0, columnStart) * 1.25

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pr-1"
                      >
                        {line.type === 'subtract' && (
                          <div className="flex items-center">
                            <span className="text-red-500 w-4 text-right">−</span>
                            {/* Column-aligned subtraction value */}
                            <div
                              className="flex"
                              style={{ paddingLeft: `${leftPaddingRem}rem` }}
                            >
                              {line.value.split('').map((d, j) => (
                                <span key={j} className="w-5 text-center text-red-500">{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {line.type === 'difference' && (
                          <>
                            {/* Subtraction line - spans from the value start to dividend end */}
                            <div
                              className="border-t-2 border-gray-600 my-1"
                              style={{
                                marginLeft: `${1 + leftPaddingRem}rem`,  // 1rem for minus sign space
                                width: `${valueLength * 1.25 + 0.5}rem`
                              }}
                            />
                            {/* Column-aligned difference */}
                            <div
                              className="flex"
                              style={{ paddingLeft: `${1 + leftPaddingRem}rem` }}  // 1rem for minus sign space
                            >
                              {line.value.split('').map((d, j) => (
                                <span key={j} className="w-5 text-center text-gray-700 font-medium">{d}</span>
                              ))}
                            </div>
                          </>
                        )}
                        {/* Brought-down number: shows combined value after bringing down digit */}
                        {line.type === 'bringdown' && (
                          <div
                            className="flex"
                            style={{ paddingLeft: `${1 + leftPaddingRem}rem` }}  // 1rem for minus sign space
                          >
                            {line.value.split('').map((d, j) => (
                              <span key={j} className="w-5 text-center text-blue-600 font-bold">{d}</span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Final remainder display */}
                {phase === 'complete' && remainder > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-orange-500 text-right pr-1 text-sm mt-2 font-medium"
                  >
                    Remainder: {remainder}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Display */}
      <div className="mt-6 max-w-sm mx-auto">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Current Step</p>

          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                {/* Step Type Badge */}
                <div className={cn(
                  'inline-block px-3 py-1 rounded-full text-xs font-medium mb-2',
                  currentStep.type === 'divide' && 'bg-blue-100 text-blue-700',
                  currentStep.type === 'multiply' && 'bg-purple-100 text-purple-700',
                  currentStep.type === 'subtract' && 'bg-red-100 text-red-700',
                  currentStep.type === 'bringdown' && 'bg-yellow-100 text-yellow-700',
                  currentStep.type === 'complete' && 'bg-green-100 text-green-700'
                )}>
                  {currentStep.type === 'divide' && '1. Divide'}
                  {currentStep.type === 'multiply' && '2. Multiply'}
                  {currentStep.type === 'subtract' && '3. Subtract'}
                  {currentStep.type === 'bringdown' && '4. Bring Down'}
                  {currentStep.type === 'complete' && 'Complete!'}
                </div>

                {/* Step Description */}
                <p className="text-lg font-medium text-gray-700">
                  {currentStep.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!showSolution && (
            <div className="text-center text-gray-500">
              <p>Ready to solve step by step</p>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Steps Reference */}
      <div className="mt-4 flex justify-center gap-2">
        {['Divide', 'Multiply', 'Subtract', 'Bring Down'].map((step, i) => (
          <div
            key={step}
            className={cn(
              'px-2 py-1 text-xs rounded',
              currentStep?.type === step.toLowerCase().replace(' ', '') ||
              (currentStep?.type === 'bringdown' && step === 'Bring Down')
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500'
            )}
          >
            {i + 1}. {step}
          </div>
        ))}
      </div>

      {/* Instructions / Status */}
      <div className="text-center mt-6">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Long Division: {dividend} ÷ {divisor}
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Divide, Multiply, Subtract, Bring down - Repeat!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {phase === 'solving' && (
              <div>
                <p className="text-sm text-gray-500">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
            )}
            {phase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {dividend} ÷ {divisor} = {quotient}{remainder > 0 && ` R${remainder}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Great work following the steps!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
