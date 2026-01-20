/**
 * BalanceScaleAnimation - Visual representation of equation solving
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Equations are like balance scales - both sides must be equal
 * - To solve, do the same thing to both sides
 * - Show step-by-step isolation of the variable
 * - SETUP MODE (default): Shows the equation as a balanced scale
 * - SOLUTION MODE: Animates solving step by step
 *
 * Used for:
 * - Level G: linear_equations, solving_equations
 * - Level H: literal_equations
 * - Concept introductions for algebra
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface BalanceScaleAnimationProps extends BaseAnimationProps {
  isPaused?: boolean
}

export default function BalanceScaleAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: BalanceScaleAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'step1' | 'step2' | 'complete'>('setup')
  const [currentStep, setCurrentStep] = useState(0)
  const [scaleAngle, setScaleAngle] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract equation: ax + b = c → solve for x
  // operands: [coefficient, constant, result] e.g., [2, 3, 11] = 2x + 3 = 11
  // ROBUST VALIDATION: Each operand validated individually with safe defaults
  const operands = problemData?.operands || []
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) && operands[0] !== 0 ? operands[0] : 2
  const b = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 3
  const c = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 11

  // Validate: coefficient cannot be zero (would cause NaN)
  const isValidEquation = a !== 0

  // Calculate solution
  const solution = useMemo(() => {
    if (!isValidEquation) {
      return { step1Result: 0, answer: 0, isValid: false }
    }
    // 2x + 3 = 11 → 2x = 8 → x = 4
    const step1Result = c - b // subtract constant: c - b
    const answer = step1Result / a // divide by coefficient: (c - b) / a
    return { step1Result, answer, isValid: true }
  }, [a, b, c, isValidEquation])

  // Educational scripts for each step
  const scripts = {
    setup: `Let's solve ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}. Think of it like a balance scale - both sides must stay equal!`,
    step1: `First, subtract ${b} from both sides to isolate the term with x.`,
    step2: `Now divide both sides by ${a} to find the value of x.`,
    complete: `We found that x = ${solution.answer}. Let's verify: ${a}(${solution.answer}) + ${b} = ${c} ✓`,
  }

  // Return error state if equation is invalid
  if (!isValidEquation) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Equation</p>
          <p className="text-red-500 text-sm mt-2">
            The coefficient of x cannot be zero. Please use a different equation.
          </p>
        </div>
      </div>
    )
  }

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setCurrentStep(0)
      setScaleAngle(0)
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    const TICK_MS = 100
    const STEP1_TICK = 15        // 1.5 seconds - subtract constant
    const STEP2_TICK = 35        // 3.5 seconds - divide by coefficient
    const COMPLETE_TICK = 55     // 5.5 seconds - complete

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase 1: Subtract b from both sides
      if (tick === STEP1_TICK && phase === 'setup') {
        setPhase('step1')
        setCurrentStep(1)
        playPop()
      }

      // Phase 2: Divide both sides by a
      if (tick === STEP2_TICK && phase === 'step1') {
        setPhase('step2')
        setCurrentStep(2)
        playPop()
      }

      // Phase 3: Complete
      if (tick === COMPLETE_TICK) {
        setPhase('complete')
        setCurrentStep(3)
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess])

  // Wobble scale when step changes
  useEffect(() => {
    if (currentStep > 0 && phase !== 'complete') {
      setScaleAngle(-5)
      setTimeout(() => setScaleAngle(5), 150)
      setTimeout(() => setScaleAngle(-3), 300)
      setTimeout(() => setScaleAngle(0), 450)
      playWhoosh()
    }
  }, [currentStep, phase, playWhoosh])

  // Step descriptions
  const stepDescriptions = [
    '',
    `Subtract ${b} from both sides`,
    `Divide both sides by ${a}`,
    `x = ${solution.answer}`,
  ]

  // Left side content based on phase
  const leftSideContent = useMemo(() => {
    switch (phase) {
      case 'setup':
        return `${a}x + ${b}`
      case 'step1':
        return `${a}x`
      case 'step2':
      case 'complete':
        return 'x'
    }
  }, [phase, a, b])

  // Right side content based on phase
  const rightSideContent = useMemo(() => {
    switch (phase) {
      case 'setup':
        return `${c}`
      case 'step1':
        return `${solution.step1Result}`
      case 'step2':
      case 'complete':
        return `${solution.answer}`
    }
  }, [phase, c, solution])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-mono font-bold text-gray-800">
          <span className="text-blue-600">{a}x + {b}</span>
          <span className="text-gray-600"> = </span>
          <span className="text-green-600">{c}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Find the value of x
        </p>
      </div>

      {/* Educational Script */}
      {showSolution && currentStep > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-blue-800">
            {currentStep === 1 ? scripts.step1 : currentStep === 2 ? scripts.step2 : scripts.complete}
          </p>
        </div>
      )}

      {/* Balance Scale */}
      <div className="relative w-full max-w-md mx-auto h-48 mb-4">
        {/* Base/Stand */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-800 rounded-lg" />

        {/* Beam */}
        <motion.div
          animate={{ rotate: scaleAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 origin-center"
        >
          {/* Horizontal beam - responsive width */}
          <div className="relative w-full max-w-[250px] h-2 bg-amber-600 rounded-full mx-auto">
            {/* Center pivot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-700 rounded-full border-2 border-amber-500" />
          </div>

          {/* Left Pan */}
          <div className="absolute left-0 top-2 -translate-x-1/2">
            {/* Strings */}
            <div className="flex justify-between w-16 mx-auto">
              <div className="w-0.5 h-8 bg-amber-500" />
              <div className="w-0.5 h-8 bg-amber-500" />
            </div>
            {/* Pan */}
            <motion.div
              animate={{
                scale: phase === 'step1' ? [1, 1.1, 1] : 1,
                backgroundColor: phase === 'step1' ? '#fef08a' : '#fef3c7'
              }}
              className="w-20 h-8 bg-amber-100 border-2 border-amber-400 rounded-lg shadow-md flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={leftSideContent}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    'text-sm font-bold',
                    phase === 'complete' ? 'text-blue-600' : 'text-gray-700'
                  )}
                >
                  {leftSideContent}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Pan */}
          <div className="absolute right-0 top-2 translate-x-1/2">
            {/* Strings */}
            <div className="flex justify-between w-16 mx-auto">
              <div className="w-0.5 h-8 bg-amber-500" />
              <div className="w-0.5 h-8 bg-amber-500" />
            </div>
            {/* Pan */}
            <motion.div
              animate={{
                scale: phase === 'step1' ? [1, 1.1, 1] : 1,
                backgroundColor: phase === 'step1' ? '#bbf7d0' : '#dcfce7'
              }}
              className="w-20 h-8 bg-green-100 border-2 border-green-400 rounded-lg shadow-md flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={rightSideContent}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    'text-sm font-bold',
                    phase === 'complete' ? 'text-green-600' : 'text-gray-700'
                  )}
                >
                  {rightSideContent}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* = Sign in center */}
        <motion.div
          animate={{ scale: phase === 'complete' ? [1, 1.2, 1] : 1 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-400"
        >
          =
        </motion.div>
      </div>

      {/* Operation indicator */}
      <AnimatePresence mode="wait">
        {showSolution && currentStep > 0 && currentStep < 3 && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center gap-4 mb-4"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg">
              <span className="text-blue-600 font-medium">
                {currentStep === 1 ? `−${b}` : `÷${a}`}
              </span>
            </div>
            <div className="text-gray-400">both sides</div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
              <span className="text-green-600 font-medium">
                {currentStep === 1 ? `−${b}` : `÷${a}`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Progress */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map((step) => (
          <motion.div
            key={step}
            animate={{
              scale: currentStep === step ? 1.2 : 1,
              backgroundColor: currentStep >= step ? '#22c55e' : currentStep === step ? '#3b82f6' : '#e5e7eb',
            }}
            className="w-3 h-3 rounded-full"
          />
        ))}
      </div>

      {/* Step Description */}
      <div className="text-center min-h-[60px]">
        <AnimatePresence mode="wait">
          {showSolution && currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-50 px-4 py-2 rounded-lg inline-block"
            >
              <p className={cn(
                'text-lg font-medium',
                phase === 'complete' ? 'text-green-600' : 'text-gray-700'
              )}>
                {stepDescriptions[currentStep]}
              </p>
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
              Keep the scale balanced!
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Do the same thing to both sides
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              x = {solution.answer}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              The equation is solved!
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
