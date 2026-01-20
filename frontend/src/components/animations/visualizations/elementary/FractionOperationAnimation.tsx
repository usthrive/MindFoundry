/**
 * FractionOperationAnimation - Visual representation of fraction operations
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Addition: Combine shaded parts (same denominator) or find LCD
 * - Subtraction: Remove shaded parts
 * - Multiplication: Area model (overlap of two fractions)
 * - Division: "Keep, Change, Flip" then multiply
 * - SETUP MODE (default): Shows fractions and operation
 * - SOLUTION MODE: Animates the operation step by step
 *
 * Used for:
 * - Level E: fraction_addition, fraction_subtraction
 * - Level E: fraction_multiply, fraction_divide
 * - Concept introductions for fraction operations
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import AnimatedFraction, { FractionBar } from '../../shared/AnimatedFraction'
import type { BaseAnimationProps } from '../../core/types'

type FractionOperation = 'addition' | 'subtraction' | 'multiplication' | 'division'

// Extended phases for LCD visualization
type LCDPhase = 'setup' | 'showOriginal' | 'explainLCD' | 'showMultipliers' | 'convertFirst' | 'convertSecond' | 'showConverted' | 'operate' | 'complete'

export interface FractionOperationAnimationProps extends BaseAnimationProps {
  /** The operation to visualize */
  operation?: FractionOperation
}

export default function FractionOperationAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  operation = 'addition',
}: FractionOperationAnimationProps) {
  // Use extended phases for LCD cases, simple phases otherwise
  const [phase, setPhase] = useState<'setup' | 'step1' | 'step2' | 'step3' | 'complete'>('setup')
  const [lcdPhase, setLcdPhase] = useState<LCDPhase>('setup')
  const [currentStep, setCurrentStep] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const stepRef = useRef(0)
  const lcdStepRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract operands: [num1, den1, num2, den2]
  // e.g., [1, 4, 2, 4] = 1/4 + 2/4 or [2, 3, 3, 4] = 2/3 × 3/4
  const operands = problemData?.operands || [1, 4, 2, 4]
  const num1 = operands[0]
  const den1 = operands[1]
  const num2 = operands[2]
  const den2 = operands[3]

  // Detect operation from context if not provided (need this before validation)
  const actualOperation = problemData?.operation === 'multiplication'
    ? 'multiplication'
    : problemData?.operation === 'division'
    ? 'division'
    : problemData?.operation === 'subtraction'
    ? 'subtraction'
    : operation

  // Validate fractions: denominators cannot be zero
  const isValidFraction = den1 !== 0 && den2 !== 0 &&
    !isNaN(num1) && !isNaN(den1) && !isNaN(num2) && !isNaN(den2)
  // For division, the second fraction's numerator cannot be zero (dividing by 0/x = 0)
  const isValidDivision = actualOperation !== 'division' || num2 !== 0

  // Early return with educational error message if invalid fractions
  if (!isValidFraction) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Fraction</p>
          <p className="text-red-500 text-sm mt-2">
            Denominators cannot be zero. A fraction's denominator tells us how many equal parts the whole is divided into.
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Think about it:</p>
            <p>If you divide a pizza into 0 slices, how big is each slice? It doesn't make sense!</p>
          </div>
        </div>
      </div>
    )
  }

  // Early return with educational error if dividing by zero fraction
  if (!isValidDivision) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Cannot Divide by Zero</p>
          <p className="text-red-500 text-sm mt-2">
            When dividing by a fraction, the fraction cannot have a numerator of zero (that would be 0/{den2} = 0).
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>Dividing by zero is undefined - you can't split something into zero groups!</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if we need LCD conversion (different denominators for add/sub)
  const needsLCD = (actualOperation === 'addition' || actualOperation === 'subtraction') && den1 !== den2

  // Calculate LCD and multipliers
  const lcdInfo = useMemo(() => {
    if (!needsLCD) return null
    const lcd = (den1 * den2) / gcd(den1, den2)
    const mult1 = lcd / den1  // Multiplier for first fraction
    const mult2 = lcd / den2  // Multiplier for second fraction
    const newNum1 = num1 * mult1
    const newNum2 = num2 * mult2
    return { lcd, mult1, mult2, newNum1, newNum2 }
  }, [needsLCD, num1, den1, num2, den2])

  // Calculate result based on operation
  const result = useMemo(() => {
    let resultNum: number
    let resultDen: number

    switch (actualOperation) {
      case 'addition':
        if (den1 === den2) {
          resultNum = num1 + num2
          resultDen = den1
        } else {
          // Find LCD
          const lcd = (den1 * den2) / gcd(den1, den2)
          resultNum = (num1 * lcd / den1) + (num2 * lcd / den2)
          resultDen = lcd
        }
        break
      case 'subtraction':
        if (den1 === den2) {
          resultNum = num1 - num2
          resultDen = den1
        } else {
          const lcd = (den1 * den2) / gcd(den1, den2)
          resultNum = (num1 * lcd / den1) - (num2 * lcd / den2)
          resultDen = lcd
        }
        break
      case 'multiplication':
        resultNum = num1 * num2
        resultDen = den1 * den2
        break
      case 'division':
        // Keep, Change, Flip: a/b ÷ c/d = a/b × d/c
        resultNum = num1 * den2
        resultDen = den1 * num2
        break
      default:
        resultNum = 0
        resultDen = 1
    }

    // Simplify
    const g = gcd(Math.abs(resultNum), resultDen)
    return { num: resultNum / g, den: resultDen / g }
  }, [num1, den1, num2, den2, actualOperation])

  // Animation effect for solution mode - handles both simple and LCD cases
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setLcdPhase('setup')
      setCurrentStep(0)
      stepRef.current = 0
      lcdStepRef.current = 0
      return
    }

    // Use different animation flow for LCD cases
    if (needsLCD) {
      // Extended LCD animation with clear pedagogical steps
      const lcdPhases: LCDPhase[] = [
        'showOriginal',    // Show the original fractions
        'explainLCD',      // "We need same-size pieces to add/subtract"
        'showMultipliers', // Show what we multiply each fraction by
        'convertFirst',    // Animate first fraction converting
        'convertSecond',   // Animate second fraction converting
        'showConverted',   // Show both converted fractions
        'operate',         // Add or subtract
        'complete',        // Done!
      ]
      const LCD_STEP_DELAY = 1800 // Slower for comprehension

      const timer = setInterval(() => {
        if (isPausedRef.current) return

        if (lcdStepRef.current >= lcdPhases.length) {
          clearInterval(timer)
          return
        }

        const currentPhase = lcdPhases[lcdStepRef.current]
        setLcdPhase(currentPhase)
        setCurrentStep(lcdStepRef.current + 1)

        if (currentPhase === 'complete') {
          playSuccess()
          onComplete?.()
          clearInterval(timer)
        } else if (currentPhase === 'convertFirst' || currentPhase === 'convertSecond') {
          playWhoosh()
        } else {
          playPop()
        }

        lcdStepRef.current++
      }, LCD_STEP_DELAY)

      return () => clearInterval(timer)
    }

    // Simple animation for same denominator or mult/div
    const STEP_DELAY = 1200 // Increased from 700ms for better pacing

    const timer = setInterval(() => {
      if (isPausedRef.current) return

      stepRef.current++
      setCurrentStep(stepRef.current)
      playPop()

      if (stepRef.current === 1) setPhase('step1')
      else if (stepRef.current === 2) setPhase('step2')
      else if (stepRef.current === 3) setPhase('step3')
      else if (stepRef.current >= 4) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, STEP_DELAY)

    return () => clearInterval(timer)
  }, [showSolution, needsLCD, onComplete, playPop, playSuccess, playWhoosh])

  // Get operation symbol
  const operationSymbol = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  }[actualOperation]

  // Step descriptions - different for LCD vs simple cases
  const stepDescriptions = useMemo(() => {
    switch (actualOperation) {
      case 'addition':
        if (den1 === den2) {
          return ['Same denominators!', 'Add the numerators', `${num1} + ${num2} = ${num1 + num2}`, 'Simplify if needed']
        }
        // LCD case - extended descriptions
        return [
          `Different denominators: ${den1} and ${den2}`,
          'We need same-size pieces to add!',
          `Multiply each fraction to get ${lcdInfo?.lcd} pieces`,
          `${num1}/${den1} × ${lcdInfo?.mult1}/${lcdInfo?.mult1} = ${lcdInfo?.newNum1}/${lcdInfo?.lcd}`,
          `${num2}/${den2} × ${lcdInfo?.mult2}/${lcdInfo?.mult2} = ${lcdInfo?.newNum2}/${lcdInfo?.lcd}`,
          'Now both fractions have the same denominator!',
          `${lcdInfo?.newNum1}/${lcdInfo?.lcd} + ${lcdInfo?.newNum2}/${lcdInfo?.lcd}`,
          `= ${result.num}/${result.den}`,
        ]
      case 'subtraction':
        if (den1 === den2) {
          return ['Same denominators!', 'Subtract numerators', `${num1} - ${num2} = ${num1 - num2}`, 'Simplify if needed']
        }
        // LCD case - extended descriptions
        return [
          `Different denominators: ${den1} and ${den2}`,
          'We need same-size pieces to subtract!',
          `Multiply each fraction to get ${lcdInfo?.lcd} pieces`,
          `${num1}/${den1} × ${lcdInfo?.mult1}/${lcdInfo?.mult1} = ${lcdInfo?.newNum1}/${lcdInfo?.lcd}`,
          `${num2}/${den2} × ${lcdInfo?.mult2}/${lcdInfo?.mult2} = ${lcdInfo?.newNum2}/${lcdInfo?.lcd}`,
          'Now both fractions have the same denominator!',
          `${lcdInfo?.newNum1}/${lcdInfo?.lcd} - ${lcdInfo?.newNum2}/${lcdInfo?.lcd}`,
          `= ${result.num}/${result.den}`,
        ]
      case 'multiplication':
        return ['Multiply numerators', `${num1} × ${num2} = ${num1 * num2}`, 'Multiply denominators', `${den1} × ${den2} = ${den1 * den2}`]
      case 'division':
        return ['Keep first fraction', 'Change ÷ to ×', 'Flip second fraction', 'Now multiply!']
      default:
        return []
    }
  }, [actualOperation, num1, num2, den1, den2, lcdInfo, result])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Operation Display */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
        <AnimatedFraction
          numerator={num1}
          denominator={den1}
          size="lg"
          color="blue"
        />

        <motion.span
          className="text-3xl font-bold text-gray-600"
          animate={{
            scale: actualOperation === 'division' && phase === 'step2' ? [1, 1.3, 1] : 1,
            color: actualOperation === 'division' && phase === 'step2' ? '#ef4444' : '#4b5563',
          }}
        >
          {actualOperation === 'division' && phase === 'step2' ? '×' : operationSymbol}
        </motion.span>

        <AnimatedFraction
          numerator={actualOperation === 'division' && (phase === 'step3' || phase === 'complete') ? den2 : num2}
          denominator={actualOperation === 'division' && (phase === 'step3' || phase === 'complete') ? num2 : den2}
          size="lg"
          color="green"
          highlighted={actualOperation === 'division' && phase === 'step3'}
        />

        <motion.span className="text-3xl font-bold text-gray-400">=</motion.span>

        {phase === 'complete' ? (
          <AnimatedFraction
            numerator={result.num}
            denominator={result.den}
            size="lg"
            color="primary"
            highlighted
          />
        ) : (
          <span className="text-3xl font-bold text-primary">?</span>
        )}
      </div>

      {/* Visual Bars (for addition/subtraction with same denominator) */}
      {(actualOperation === 'addition' || actualOperation === 'subtraction') && den1 === den2 && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <FractionBar
            numerator={num1}
            denominator={den1}
            barSize={200}
            fillColor="#3b82f6"
            animateFill={showSolution}
          />
          <div className="text-2xl">{operationSymbol}</div>
          <FractionBar
            numerator={num2}
            denominator={den2}
            barSize={200}
            fillColor="#22c55e"
            animateFill={showSolution && currentStep >= 1}
          />
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-2xl">=</div>
              <FractionBar
                numerator={result.num}
                denominator={result.den}
                barSize={200}
                fillColor="#8b5cf6"
                animateFill
              />
            </motion.div>
          )}
        </div>
      )}

      {/* LCD Visual Explanation (for addition/subtraction with DIFFERENT denominators) */}
      {needsLCD && lcdInfo && showSolution && (
        <div className="bg-amber-50 rounded-xl p-4 mb-6 border-2 border-amber-200">
          {/* Phase 1-2: Show original fractions with different piece sizes */}
          {(lcdPhase === 'showOriginal' || lcdPhase === 'explainLCD') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-amber-800 mb-4">
                {lcdPhase === 'showOriginal' && '🍕 Look at the different piece sizes!'}
                {lcdPhase === 'explainLCD' && '🤔 We can\'t add/subtract different-sized pieces!'}
              </p>
              <div className="flex justify-center items-center gap-6">
                <div className="text-center">
                  <FractionBar
                    numerator={num1}
                    denominator={den1}
                    barSize={180}
                    fillColor="#3b82f6"
                    animateFill
                  />
                  <p className="text-sm text-blue-600 mt-1 font-medium">{num1}/{den1}</p>
                  <p className="text-xs text-gray-500">({den1} pieces)</p>
                </div>
                <span className="text-2xl">{operationSymbol}</span>
                <div className="text-center">
                  <FractionBar
                    numerator={num2}
                    denominator={den2}
                    barSize={180}
                    fillColor="#22c55e"
                    animateFill
                  />
                  <p className="text-sm text-green-600 mt-1 font-medium">{num2}/{den2}</p>
                  <p className="text-xs text-gray-500">({den2} pieces)</p>
                </div>
              </div>
              {lcdPhase === 'explainLCD' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-amber-700 mt-4 font-medium"
                >
                  We need to make both fractions have the same number of pieces!
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Phase 3: Show multipliers */}
          {lcdPhase === 'showMultipliers' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-amber-800 mb-4">
                ✨ Let's find a Common Denominator: {lcdInfo.lcd}
              </p>
              <div className="flex justify-center items-center gap-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-blue-100 p-3 rounded-lg border-2 border-blue-300"
                >
                  <p className="text-blue-700 font-bold text-lg">
                    {num1}/{den1} × <span className="text-purple-600">{lcdInfo.mult1}/{lcdInfo.mult1}</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Multiply by {lcdInfo.mult1} to get {lcdInfo.lcd} pieces
                  </p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-green-100 p-3 rounded-lg border-2 border-green-300"
                >
                  <p className="text-green-700 font-bold text-lg">
                    {num2}/{den2} × <span className="text-purple-600">{lcdInfo.mult2}/{lcdInfo.mult2}</span>
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Multiply by {lcdInfo.mult2} to get {lcdInfo.lcd} pieces
                  </p>
                </motion.div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                💡 Multiplying top and bottom by the same number keeps the fraction equal!
              </p>
            </motion.div>
          )}

          {/* Phase 4-5: Animate conversions */}
          {(lcdPhase === 'convertFirst' || lcdPhase === 'convertSecond') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-amber-800 mb-4">
                🔄 Converting to {lcdInfo.lcd} pieces...
              </p>
              <div className="flex justify-center items-center gap-6">
                {/* First fraction - converted or converting */}
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: lcdPhase === 'convertFirst' ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <FractionBar
                      numerator={lcdPhase === 'convertFirst' || lcdPhase === 'convertSecond' ? lcdInfo.newNum1 : num1}
                      denominator={lcdPhase === 'convertFirst' || lcdPhase === 'convertSecond' ? lcdInfo.lcd : den1}
                      barSize={180}
                      fillColor="#3b82f6"
                      animateFill
                    />
                  </motion.div>
                  <motion.p
                    className="text-blue-600 mt-1 font-bold"
                    animate={{
                      scale: lcdPhase === 'convertFirst' ? [1, 1.2, 1] : 1,
                    }}
                  >
                    {lcdInfo.newNum1}/{lcdInfo.lcd}
                    {lcdPhase === 'convertFirst' && ' ✓'}
                  </motion.p>
                </div>

                <span className="text-2xl">{operationSymbol}</span>

                {/* Second fraction - converting or waiting */}
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: lcdPhase === 'convertSecond' ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <FractionBar
                      numerator={lcdPhase === 'convertSecond' ? lcdInfo.newNum2 : num2}
                      denominator={lcdPhase === 'convertSecond' ? lcdInfo.lcd : den2}
                      barSize={180}
                      fillColor="#22c55e"
                      animateFill
                    />
                  </motion.div>
                  <motion.p
                    className="text-green-600 mt-1 font-bold"
                    animate={{
                      scale: lcdPhase === 'convertSecond' ? [1, 1.2, 1] : 1,
                    }}
                  >
                    {lcdPhase === 'convertSecond' ? `${lcdInfo.newNum2}/${lcdInfo.lcd} ✓` : `${num2}/${den2}`}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 6: Show converted fractions side by side */}
          {lcdPhase === 'showConverted' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-green-700 mb-4">
                ✅ Now both have {lcdInfo.lcd} pieces - same size!
              </p>
              <div className="flex justify-center items-center gap-6">
                <div className="text-center">
                  <FractionBar
                    numerator={lcdInfo.newNum1}
                    denominator={lcdInfo.lcd}
                    barSize={180}
                    fillColor="#3b82f6"
                    animateFill
                  />
                  <p className="text-blue-600 mt-1 font-bold">{lcdInfo.newNum1}/{lcdInfo.lcd}</p>
                </div>
                <span className="text-2xl">{operationSymbol}</span>
                <div className="text-center">
                  <FractionBar
                    numerator={lcdInfo.newNum2}
                    denominator={lcdInfo.lcd}
                    barSize={180}
                    fillColor="#22c55e"
                    animateFill
                  />
                  <p className="text-green-600 mt-1 font-bold">{lcdInfo.newNum2}/{lcdInfo.lcd}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 7-8: Operate and show result */}
          {(lcdPhase === 'operate' || lcdPhase === 'complete') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-purple-700 mb-4">
                {lcdPhase === 'operate'
                  ? `🧮 Now we can ${actualOperation === 'addition' ? 'add' : 'subtract'}!`
                  : '🎉 Done!'
                }
              </p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <div className="text-center">
                  <FractionBar
                    numerator={lcdInfo.newNum1}
                    denominator={lcdInfo.lcd}
                    barSize={140}
                    fillColor="#3b82f6"
                    animateFill
                  />
                  <p className="text-sm text-blue-600 mt-1">{lcdInfo.newNum1}/{lcdInfo.lcd}</p>
                </div>
                <span className="text-xl">{operationSymbol}</span>
                <div className="text-center">
                  <FractionBar
                    numerator={lcdInfo.newNum2}
                    denominator={lcdInfo.lcd}
                    barSize={140}
                    fillColor="#22c55e"
                    animateFill
                  />
                  <p className="text-sm text-green-600 mt-1">{lcdInfo.newNum2}/{lcdInfo.lcd}</p>
                </div>
                <span className="text-xl">=</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <FractionBar
                    numerator={result.num}
                    denominator={result.den}
                    barSize={140}
                    fillColor="#8b5cf6"
                    animateFill
                  />
                  <p className="text-purple-600 mt-1 font-bold text-lg">{result.num}/{result.den}</p>
                </motion.div>
              </div>
              {lcdPhase === 'complete' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 font-medium mt-4"
                >
                  {lcdInfo.newNum1} {actualOperation === 'addition' ? '+' : '-'} {lcdInfo.newNum2} = {actualOperation === 'addition' ? lcdInfo.newNum1 + lcdInfo.newNum2 : lcdInfo.newNum1 - lcdInfo.newNum2}
                  {' '}(keeping denominator {lcdInfo.lcd})
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Multiplication Area Model */}
      {actualOperation === 'multiplication' && (
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Grid representation */}
            <div
              className="grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${den2}, 1fr)`,
                width: '180px',
                height: '180px',
              }}
            >
              {Array.from({ length: den1 * den2 }, (_, i) => {
                const row = Math.floor(i / den2)
                const col = i % den2
                const isFirstFraction = row < num1
                const isSecondFraction = col < num2
                const isOverlap = isFirstFraction && isSecondFraction

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: showSolution ? 1 : 0.3,
                      backgroundColor: isOverlap
                        ? '#8b5cf6'
                        : isFirstFraction
                        ? '#93c5fd'
                        : isSecondFraction
                        ? '#86efac'
                        : '#f3f4f6',
                    }}
                    transition={{ delay: showSolution ? i * 0.02 : 0 }}
                    className="rounded-sm border border-gray-300"
                  />
                )
              })}
            </div>
            {/* Labels */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium">
              {num1}/{den1}
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-green-600 font-medium">
              {num2}/{den2}
            </div>
          </div>
        </div>
      )}

      {/* Division Keep-Change-Flip */}
      {actualOperation === 'division' && showSolution && (
        <div className="flex justify-center mb-4">
          <div className="flex gap-4 bg-yellow-50 px-4 py-2 rounded-lg">
            <motion.div
              animate={{ scale: phase === 'step1' ? 1.1 : 1 }}
              className={cn(
                'px-3 py-1 rounded',
                phase === 'step1' ? 'bg-blue-200' : 'bg-gray-100'
              )}
            >
              Keep
            </motion.div>
            <motion.div
              animate={{ scale: phase === 'step2' ? 1.1 : 1 }}
              className={cn(
                'px-3 py-1 rounded',
                phase === 'step2' ? 'bg-red-200' : 'bg-gray-100'
              )}
            >
              Change
            </motion.div>
            <motion.div
              animate={{ scale: phase === 'step3' ? 1.1 : 1 }}
              className={cn(
                'px-3 py-1 rounded',
                phase === 'step3' ? 'bg-green-200' : 'bg-gray-100'
              )}
            >
              Flip
            </motion.div>
          </div>
        </div>
      )}

      {/* Step Indicator - different count for LCD vs simple cases */}
      <div className="flex justify-center gap-2 mb-4">
        {stepDescriptions.slice(0, needsLCD ? 8 : 4).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: currentStep === i + 1 ? 1.2 : 1,
              backgroundColor: currentStep > i ? '#22c55e' : currentStep === i + 1 ? '#3b82f6' : '#e5e7eb',
            }}
            className="w-2.5 h-2.5 rounded-full"
          />
        ))}
      </div>

      {/* Current Step Description */}
      <div className="text-center min-h-[60px]">
        <AnimatePresence mode="wait">
          {showSolution && currentStep > 0 && currentStep <= stepDescriptions.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-50 px-4 py-2 rounded-lg inline-block"
            >
              <p className="text-lg font-medium text-gray-700">
                {stepDescriptions[currentStep - 1]}
              </p>
              {needsLCD && currentStep <= 3 && (
                <p className="text-sm text-gray-500 mt-1">
                  Step {currentStep} of 8
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions / Status */}
      <div className="text-center mt-4">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              {actualOperation === 'addition' && 'Add the fractions'}
              {actualOperation === 'subtraction' && 'Subtract the fractions'}
              {actualOperation === 'multiplication' && 'Multiply the fractions'}
              {actualOperation === 'division' && 'Divide the fractions'}
            </p>
            <p className="text-sm mt-1 text-gray-500">
              {actualOperation === 'addition' && (needsLCD ? 'Different denominators - find LCD first!' : 'Combine the parts')}
              {actualOperation === 'subtraction' && (needsLCD ? 'Different denominators - find LCD first!' : 'Take away parts')}
              {actualOperation === 'multiplication' && 'Multiply tops, multiply bottoms'}
              {actualOperation === 'division' && 'Keep, Change, Flip!'}
            </p>
          </motion.div>
        ) : (phase === 'complete' || lcdPhase === 'complete') ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              {num1}/{den1} {operationSymbol} {num2}/{den2} = {result.num}/{result.den}
            </p>
            {needsLCD && (
              <p className="text-sm text-gray-500 mt-1">
                Common denominator: {lcdInfo?.lcd}
              </p>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

// Helper: Greatest Common Divisor
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}
