/**
 * QuadraticFormulaAnimation - Visual representation of the quadratic formula
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows the quadratic formula: x = (-b ± √(b²-4ac)) / 2a
 * - Step-by-step substitution and simplification
 * - Highlights discriminant to determine number of roots
 * - SETUP MODE (default): Shows equation and formula
 * - SOLUTION MODE: Animates step-by-step solution
 *
 * Used for:
 * - Level I: quadratic_formula, square_roots, radicals
 * - Concept introductions for solving quadratics algebraically
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface QuadraticFormulaAnimationProps extends BaseAnimationProps {}

interface Step {
  label: string
  content: string
  highlight?: string
}

export default function QuadraticFormulaAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: QuadraticFormulaAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'identify' | 'substitute' | 'discriminant' | 'simplify' | 'complete'>('setup')
  const [currentStep, setCurrentStep] = useState(0)
  const { playPop, playSuccess } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const stepRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract coefficients: [a, b, c] for ax² + bx + c = 0
  // Default: 2x² - 7x + 3 = 0 (roots: x = 3, x = 0.5)
  const operands = problemData?.operands || [2, -7, 3]
  const [a, b, c] = operands

  // Validate coefficient a is not zero (would cause division by zero)
  const isValidQuadratic = a !== 0 && !isNaN(a) && !isNaN(b) && !isNaN(c)

  // Early return with educational error message if invalid
  if (!isValidQuadratic) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Equation</p>
          <p className="text-red-500 text-sm mt-2">
            {a === 0
              ? "The coefficient 'a' cannot be zero. That would make this a linear equation (bx + c = 0), not a quadratic equation."
              : "Please enter valid numbers for all coefficients."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate discriminant and roots
  const discriminant = b * b - 4 * a * c
  const sqrtDiscriminant = Math.sqrt(Math.abs(discriminant))

  // Calculate roots if real
  const hasRealRoots = discriminant >= 0
  const root1 = hasRealRoots ? (-b + sqrtDiscriminant) / (2 * a) : null
  const root2 = hasRealRoots ? (-b - sqrtDiscriminant) / (2 * a) : null

  // Format number for display
  const formatNum = (n: number, decimals: number = 2): string => {
    if (Number.isInteger(n)) return n.toString()
    return n.toFixed(decimals).replace(/\.?0+$/, '')
  }

  // Solution steps
  const steps: Step[] = [
    {
      label: 'Identify coefficients',
      content: `a = ${a}, b = ${b}, c = ${c}`,
      highlight: 'coefficients',
    },
    {
      label: 'Substitute into formula',
      content: `x = (${-b >= 0 ? -b : `(${-b})`} ± √(${b}² - 4·${a}·${c})) / (2·${a})`,
      highlight: 'substitute',
    },
    {
      label: 'Calculate discriminant',
      content: `b² - 4ac = ${b * b} - ${4 * a * c} = ${discriminant}`,
      highlight: 'discriminant',
    },
    {
      label: 'Simplify',
      content: discriminant >= 0
        ? `x = (${-b} ± ${formatNum(sqrtDiscriminant)}) / ${2 * a}`
        : `No real solutions (discriminant < 0)`,
      highlight: 'simplify',
    },
    {
      label: 'Find solutions',
      content: discriminant >= 0
        ? discriminant === 0
          ? `x = ${formatNum(root1!)}`
          : `x = ${formatNum(root1!)} or x = ${formatNum(root2!)}`
        : 'Complex roots only',
      highlight: 'solutions',
    },
  ]

  // Animation effect for solution mode - with pause support
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setCurrentStep(0)
      stepRef.current = 0
      return
    }

    // Use interval-based animation for pause support
    const TICK_MS = 100
    const STEP_DURATION = 22 // 2.2 seconds per step (increased from 1.5s)
    const START_DELAY = 8 // 0.8 seconds initial delay

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      stepRef.current++

      // Calculate which step we're on
      const ticksIntoAnimation = stepRef.current - START_DELAY
      if (ticksIntoAnimation <= 0) return

      const stepIndex = Math.floor(ticksIntoAnimation / STEP_DURATION)

      if (stepIndex >= steps.length) {
        // Complete
        if (phase !== 'complete') {
          setPhase('complete')
          playSuccess()
          onComplete?.()
        }
        clearInterval(timer)
        return
      }

      // Update step and phase
      if (stepIndex !== currentStep) {
        setCurrentStep(stepIndex)
        if (stepIndex === 0) setPhase('identify')
        if (stepIndex === 1) setPhase('substitute')
        if (stepIndex === 2) setPhase('discriminant')
        if (stepIndex === 3) setPhase('simplify')
        playPop()
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, currentStep, phase, onComplete, playPop, playSuccess, steps.length])

  // Format the original equation
  const formatEquation = () => {
    let eq = ''
    if (a !== 1 && a !== -1) eq += `${a}`
    if (a === -1) eq += '-'
    eq += 'x²'
    if (b !== 0) {
      eq += ` ${b >= 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`
    }
    if (c !== 0) {
      eq += ` ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`
    }
    eq += ' = 0'
    return eq
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">
          {formatEquation()}
        </div>
      </div>

      {/* Quadratic Formula Reference */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-sm text-blue-600 mb-1">Quadratic Formula</div>
        <div className="text-lg sm:text-xl font-mono">
          x = <span className="inline-flex flex-col items-center mx-1">
            <span>-b ± √(b² - 4ac)</span>
            <span className="border-t border-gray-600 w-full text-center">2a</span>
          </span>
        </div>
      </motion.div>

      {/* Solution Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[200px]">
        {phase === 'setup' ? (
          /* Setup: Show coefficient identification */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Identify the coefficients</div>
            <div className="flex gap-4 flex-wrap justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-blue-600 font-bold">a</span> = coefficient of x²
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-green-600 font-bold">b</span> = coefficient of x
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-purple-600 font-bold">c</span> = constant
              </motion.div>
            </div>
          </div>
        ) : (
          /* Solution steps animation */
          <div className="space-y-3">
            <AnimatePresence>
              {steps.slice(0, currentStep + 1).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'p-3 rounded-lg border-l-4 transition-all',
                    i === currentStep
                      ? 'bg-white shadow-sm border-primary'
                      : 'bg-gray-100 border-gray-300'
                  )}
                >
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Step {i + 1}: {step.label}
                  </div>
                  <div className={cn(
                    'font-mono text-lg',
                    i === currentStep ? 'text-primary' : 'text-gray-700'
                  )}>
                    {step.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Discriminant Indicator */}
      {(phase === 'discriminant' || phase === 'simplify' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-lg p-3 mb-4 text-center',
            discriminant > 0 ? 'bg-green-100' : discriminant === 0 ? 'bg-yellow-100' : 'bg-red-100'
          )}
        >
          <div className="text-sm font-medium">
            Discriminant (b² - 4ac) = {discriminant}
          </div>
          <div className={cn(
            'text-lg font-bold',
            discriminant > 0 ? 'text-green-600' : discriminant === 0 ? 'text-yellow-600' : 'text-red-600'
          )}>
            {discriminant > 0 && '2 distinct real roots'}
            {discriminant === 0 && '1 repeated real root'}
            {discriminant < 0 && 'No real roots (complex only)'}
          </div>
        </motion.div>
      )}

      {/* Final Answer */}
      {phase === 'complete' && hasRealRoots && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 rounded-lg p-4 text-center"
        >
          <div className="text-sm text-green-600 mb-1">Solutions</div>
          <div className="text-2xl font-bold text-green-700 font-mono">
            {discriminant === 0
              ? `x = ${formatNum(root1!)}`
              : `x = ${formatNum(root1!)}  or  x = ${formatNum(root2!)}`}
          </div>
        </motion.div>
      )}

      {/* Instructions / Status */}
      <div className="text-center mt-4">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Solve using the quadratic formula
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Identify a, b, c and substitute into the formula
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-lg font-bold text-green-600">
              {hasRealRoots
                ? `Solution${discriminant === 0 ? '' : 's'} found!`
                : 'No real solutions exist'}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'identify' && 'Identifying coefficients...'}
            {phase === 'substitute' && 'Substituting values...'}
            {phase === 'discriminant' && 'Calculating discriminant...'}
            {phase === 'simplify' && 'Simplifying...'}
          </p>
        )}
      </div>
    </div>
  )
}
