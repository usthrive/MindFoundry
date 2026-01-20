/**
 * FOILAnimation - Visual representation of FOIL method for polynomial multiplication
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - FOIL = First, Outer, Inner, Last
 * - Shows (a + b)(c + d) expansion step by step
 * - Color-coded arrows connecting terms
 * - SETUP MODE (default): Shows binomials and FOIL labels
 * - SOLUTION MODE: Animates each multiplication step
 *
 * Used for:
 * - Level I: polynomial_multiplication, foil, special_products
 * - Concept introductions for polynomial expansion
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface FOILAnimationProps extends BaseAnimationProps {
  showSpecialProduct?: boolean // For (a+b)² or (a-b)² patterns
}

interface FOILStep {
  name: string
  label: string
  color: string
  terms: [number, number] // indices into the 4 terms
}

const FOIL_STEPS: FOILStep[] = [
  { name: 'First', label: 'F', color: 'text-blue-600', terms: [0, 2] },
  { name: 'Outer', label: 'O', color: 'text-green-600', terms: [0, 3] },
  { name: 'Inner', label: 'I', color: 'text-orange-600', terms: [1, 2] },
  { name: 'Last', label: 'L', color: 'text-purple-600', terms: [1, 3] },
]

export default function FOILAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: FOILAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'foil' | 'combine' | 'complete'>('setup')
  const [currentStep, setCurrentStep] = useState(-1)
  const [products, setProducts] = useState<string[]>([])
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  const stepIndexRef = useRef(-1)
  const productsRef = useRef<string[]>([])

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract coefficients: [a, b, c, d] for (ax + b)(cx + d)
  // Default: (x + 2)(x + 3) = x² + 5x + 6
  // ROBUST VALIDATION: Each operand validated individually with safe defaults
  const operands = problemData?.operands || []
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 1
  const b = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 2
  const c = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 1
  const d = typeof operands[3] === 'number' && !isNaN(operands[3]) ? operands[3] : 3

  // Helper to format coefficient for x terms (handles 0, 1, -1 cases)
  const formatCoefForX = (coef: number, power: number): string => {
    if (coef === 0) return '0'
    const xPart = power === 2 ? 'x²' : power === 1 ? 'x' : ''
    if (power === 0) return `${coef}`
    if (coef === 1) return xPart
    if (coef === -1) return `-${xPart}`
    return `${coef}${xPart}`
  }

  // Calculate products with proper formatting
  const foilProducts = [
    { coef: a * c, power: 2, label: formatCoefForX(a * c, 2) }, // First: ax * cx
    { coef: a * d, power: 1, label: formatCoefForX(a * d, 1) }, // Outer: ax * d
    { coef: b * c, power: 1, label: formatCoefForX(b * c, 1) }, // Inner: b * cx
    { coef: b * d, power: 0, label: formatCoefForX(b * d, 0) }, // Last: b * d
  ]

  // Combine like terms (outer + inner)
  const middleTerm = a * d + b * c

  // Build final result with proper formatting
  const buildFinalResult = (): string => {
    const x2Coef = a * c
    const xCoef = middleTerm
    const constTerm = b * d

    let result = formatCoefForX(x2Coef, 2)

    // Add middle term
    if (xCoef !== 0) {
      if (xCoef > 0) {
        result += ` + ${formatCoefForX(xCoef, 1)}`
      } else {
        result += ` - ${formatCoefForX(Math.abs(xCoef), 1)}`
      }
    }

    // Add constant term
    if (constTerm !== 0) {
      if (constTerm > 0) {
        result += ` + ${constTerm}`
      } else {
        result += ` - ${Math.abs(constTerm)}`
      }
    }

    return result
  }

  const finalResult = buildFinalResult()

  // Educational scripts for each phase
  const scripts = {
    setup: `Let's multiply (${formatCoefForX(a, 1)} ${b >= 0 ? '+' : ''} ${b})(${formatCoefForX(c, 1)} ${d >= 0 ? '+' : ''} ${d}) using the FOIL method.`,
    first: `First: Multiply the First terms: ${formatCoefForX(a, 1)} × ${formatCoefForX(c, 1)} = ${foilProducts[0].label}`,
    outer: `Outer: Multiply the Outer terms: ${formatCoefForX(a, 1)} × ${d} = ${foilProducts[1].label}`,
    inner: `Inner: Multiply the Inner terms: ${b} × ${formatCoefForX(c, 1)} = ${foilProducts[2].label}`,
    last: `Last: Multiply the Last terms: ${b} × ${d} = ${foilProducts[3].label}`,
    combine: `Combine like terms: ${foilProducts[1].label} + ${foilProducts[2].label} = ${formatCoefForX(middleTerm, 1)}`,
    complete: `The answer is ${finalResult}.`,
  }

  // Format term for display
  const formatTerm = (coef: number, isX: boolean = false, showSign: boolean = false): string => {
    if (coef === 0) return '0'
    const sign = showSign ? (coef >= 0 ? ' + ' : ' - ') : (coef < 0 ? '-' : '')
    const absCoef = Math.abs(coef)
    if (isX) {
      if (absCoef === 1) return `${sign}x`
      return `${sign}${absCoef}x`
    }
    return `${sign}${absCoef}`
  }

  // Animation effect for solution mode - with pause support
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setCurrentStep(-1)
      setProducts([])
      stepIndexRef.current = -1
      productsRef.current = []
      return
    }

    // Clear any existing timers
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []

    // Use interval-based animation for pause support
    let tickCount = 0
    const TICK_MS = 100 // Check every 100ms
    const START_TICK = 8 // 800ms
    const STEP_INTERVAL = 25 // 2500ms between steps
    const COMBINE_TICK = START_TICK + 15 + 4 * STEP_INTERVAL + 5 // After all steps + 500ms
    const COMPLETE_TICK = COMBINE_TICK + 20 // 2000ms after combine

    const timer = setInterval(() => {
      // Skip if paused
      if (isPausedRef.current) return

      tickCount++

      // Start FOIL phase
      if (tickCount === START_TICK) {
        setPhase('foil')
        playWhoosh()
      }

      // FOIL steps
      for (let i = 0; i < 4; i++) {
        const stepTick = START_TICK + 15 + i * STEP_INTERVAL
        if (tickCount === stepTick && stepIndexRef.current < i) {
          stepIndexRef.current = i
          setCurrentStep(i)
          productsRef.current = [...productsRef.current, foilProducts[i].label]
          setProducts([...productsRef.current])
          playPop()
        }
      }

      // Combine phase
      if (tickCount === COMBINE_TICK) {
        setPhase('combine')
        playWhoosh()
      }

      // Complete
      if (tickCount === COMPLETE_TICK) {
        clearInterval(timer)
        setPhase('complete')
        playSuccess()
        onComplete?.()
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, onComplete, playPop, playSuccess, playWhoosh])

  // Render a binomial term
  const renderBinomial = (coef1: number, coef2: number, highlight?: number) => (
    <span className="inline-flex items-center">
      <span className="text-gray-600">(</span>
      <span className={cn(
        'transition-all duration-300',
        highlight === 0 && 'bg-yellow-200 rounded px-1'
      )}>
        {formatTerm(coef1, true)}
      </span>
      <span className="mx-1">{coef2 >= 0 ? '+' : ''}</span>
      <span className={cn(
        'transition-all duration-300',
        highlight === 1 && 'bg-yellow-200 rounded px-1'
      )}>
        {coef2}
      </span>
      <span className="text-gray-600">)</span>
    </span>
  )

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-6">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2 flex-wrap">
          {renderBinomial(a, b, phase === 'foil' && currentStep >= 0 ? FOIL_STEPS[currentStep].terms[0] : undefined)}
          <span className="text-gray-600">×</span>
          {renderBinomial(c, d, phase === 'foil' && currentStep >= 0 ? FOIL_STEPS[currentStep].terms[1] - 2 : undefined)}
          <span className="text-gray-600 mx-2">=</span>
          <span className="text-primary">
            {phase === 'complete' ? finalResult.replace(/\s+/g, ' ').trim() : '?'}
          </span>
        </div>
      </div>

      {/* Educational Script Display - shows step explanation */}
      {showSolution && phase !== 'setup' && (
        <motion.div
          key={phase + currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-3 mb-4 text-center"
        >
          <p className="text-sm text-blue-800">
            {phase === 'foil' && currentStep === 0 && scripts.first}
            {phase === 'foil' && currentStep === 1 && scripts.outer}
            {phase === 'foil' && currentStep === 2 && scripts.inner}
            {phase === 'foil' && currentStep === 3 && scripts.last}
            {phase === 'combine' && scripts.combine}
            {phase === 'complete' && scripts.complete}
          </p>
        </motion.div>
      )}

      {/* FOIL Visualization */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[200px]">
        {phase === 'setup' ? (
          /* Setup: Show FOIL acronym explanation */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">FOIL Method</div>
            <div className="grid grid-cols-2 gap-3 text-center">
              {FOIL_STEPS.map((step, i) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={cn(
                    'px-4 py-2 rounded-lg bg-white shadow-sm border-2',
                    step.color.replace('text-', 'border-')
                  )}
                >
                  <span className={cn('font-bold text-xl', step.color)}>{step.label}</span>
                  <span className="text-gray-600 ml-2">{step.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Multiply each pair of terms in order
            </p>
          </div>
        ) : phase === 'foil' ? (
          /* FOIL Animation: Show step-by-step multiplication */
          <div className="flex flex-col items-center gap-4">
            {/* Current step indicator */}
            <div className="flex gap-3">
              {FOIL_STEPS.map((step, i) => (
                <motion.div
                  key={step.name}
                  animate={{
                    scale: i === currentStep ? 1.2 : 1,
                    opacity: i <= currentStep ? 1 : 0.3,
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    i <= currentStep ? `bg-white shadow-md ${step.color}` : 'bg-gray-200 text-gray-400'
                  )}
                >
                  {step.label}
                </motion.div>
              ))}
            </div>

            {/* Current multiplication display */}
            {currentStep >= 0 && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className={cn('text-lg font-semibold', FOIL_STEPS[currentStep].color)}>
                  {FOIL_STEPS[currentStep].name}
                </div>
                <div className="text-2xl font-bold mt-2">
                  <span className="text-gray-600">
                    {currentStep === 0 && `${formatTerm(a, true)} × ${formatTerm(c, true)}`}
                    {currentStep === 1 && `${formatTerm(a, true)} × ${d}`}
                    {currentStep === 2 && `${b} × ${formatTerm(c, true)}`}
                    {currentStep === 3 && `${b} × ${d}`}
                  </span>
                  <span className="text-gray-400 mx-2">=</span>
                  <span className={FOIL_STEPS[currentStep].color}>
                    {foilProducts[currentStep].label}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Products collected so far */}
            <div className="flex gap-2 flex-wrap justify-center mt-4">
              <AnimatePresence>
                {products.map((product, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'px-3 py-1 rounded-lg bg-white shadow-sm font-mono text-lg',
                      FOIL_STEPS[i].color
                    )}
                  >
                    {i > 0 && '+ '}{product}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : phase === 'combine' ? (
          /* Combine: Show like terms being combined */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Combine Like Terms</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl"
            >
              <span className="text-blue-600">{foilProducts[0].label}</span>
              <span className="text-gray-400"> + </span>
              <motion.span
                animate={{
                  backgroundColor: ['transparent', '#fef3c7', 'transparent'],
                }}
                transition={{ duration: 1, repeat: 1 }}
                className="px-1 rounded"
              >
                <span className="text-green-600">{foilProducts[1].label}</span>
                <span className="text-gray-400"> + </span>
                <span className="text-orange-600">{foilProducts[2].label}</span>
              </motion.span>
              <span className="text-gray-400"> + </span>
              <span className="text-purple-600">{foilProducts[3].label}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500"
            >
              {a * d}x + {b * c}x = {middleTerm}x
            </motion.div>
          </div>
        ) : (
          /* Complete: Show final answer */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-green-600">Answer</div>
            <div className="text-3xl font-bold text-primary">
              {finalResult.replace(/\s+/g, ' ').trim()}
            </div>
          </motion.div>
        )}
      </div>

      {/* FOIL Legend */}
      <div className="flex justify-center gap-4 text-sm flex-wrap">
        {FOIL_STEPS.map(step => (
          <div key={step.name} className="flex items-center gap-1">
            <span className={cn('font-bold', step.color)}>{step.label}</span>
            <span className="text-gray-500">= {step.name}</span>
          </div>
        ))}
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
              Multiply the binomials using FOIL!
            </p>
            <p className="text-sm mt-1 text-gray-500">
              First, Outer, Inner, Last
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              {renderBinomial(a, b)} × {renderBinomial(c, d)} = {finalResult.replace(/\s+/g, ' ').trim()}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'foil' ? `Step: ${FOIL_STEPS[currentStep]?.name || 'Starting...'}` : 'Combining like terms...'}
          </p>
        )}
      </div>
    </div>
  )
}
