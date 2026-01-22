/**
 * PolynomialDivisionAnimation - Visual representation of polynomial long division
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Step-by-step polynomial long division with VISUAL WORK AREA
 * - Shows divide, multiply, subtract cycle with traditional format
 * - Work area shows actual term alignment like arithmetic long division
 * - Highlights each term being processed
 * - SETUP MODE (default): Shows division setup
 * - SOLUTION MODE: Animates each step with visual work
 *
 * Used for:
 * - Level J: polynomial_division, remainder_theorem, factor_theorem
 * - Concept introductions for polynomial division
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface PolynomialDivisionAnimationProps extends BaseAnimationProps {}

interface DivisionStep {
  quotientTerm: string
  multiplicationResult: string  // What we write under dividend
  subtraction: string           // Full subtraction explanation
  remainder: string             // Result after subtraction
}

// Work line types for visual display
interface WorkLine {
  type: 'multiply' | 'line' | 'remainder'
  value: string
  step: number
}

// Sub-phases within each step
type SubPhase = 'divide' | 'multiply' | 'subtract' | 'bringdown'

export default function PolynomialDivisionAnimation({
  problemData: _problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: PolynomialDivisionAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'dividing' | 'complete'>('setup')
  const [currentStep, setCurrentStep] = useState(0)
  const [subPhase, setSubPhase] = useState<SubPhase>('divide')
  const [workLines, setWorkLines] = useState<WorkLine[]>([])
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const workLinesRef = useRef<WorkLine[]>([])
  const lastStepRef = useRef(-1)
  const lastSubPhaseRef = useRef<SubPhase | null>(null)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: (x² + 3x + 2) ÷ (x + 1) = x + 2
  const dividend = 'x² + 3x + 2'
  const divisor = 'x + 1'
  const quotient = 'x + 2'
  const finalRemainder = '0'

  // Division steps with visual values for work area
  const steps: DivisionStep[] = [
    {
      quotientTerm: 'x',
      multiplicationResult: 'x² + x',
      subtraction: '(x² + 3x) − (x² + x) = 2x',
      remainder: '2x + 2',
    },
    {
      quotientTerm: '+ 2',
      multiplicationResult: '2x + 2',
      subtraction: '(2x + 2) − (2x + 2) = 0',
      remainder: '0',
    },
  ]

  // Animation effect for solution mode - with sub-phases for clarity
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setCurrentStep(0)
      setSubPhase('divide')
      setWorkLines([])
      workLinesRef.current = []
      lastStepRef.current = -1
      lastSubPhaseRef.current = null
      tickRef.current = 0
      return
    }

    // Use interval-based animation for pause support
    // Each sub-phase gets 2.5 seconds for proper understanding
    const TICK_MS = 100
    const START_DELAY = 10 // 1 second before starting
    const SUB_PHASE_DURATION = 25 // 2.5 seconds per sub-phase
    const subPhases: SubPhase[] = ['divide', 'multiply', 'subtract', 'bringdown']

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      // Start dividing
      if (tickRef.current === START_DELAY) {
        setPhase('dividing')
        playWhoosh()
      }

      // Calculate which step and sub-phase we're on
      const ticksIntoAnimation = tickRef.current - START_DELAY
      if (ticksIntoAnimation > 0) {
        const ticksPerStep = SUB_PHASE_DURATION * subPhases.length
        const stepIndex = Math.floor(ticksIntoAnimation / ticksPerStep)
        const ticksIntoStep = ticksIntoAnimation % ticksPerStep
        const subPhaseIndex = Math.floor(ticksIntoStep / SUB_PHASE_DURATION)

        // Check if we're done
        if (stepIndex >= steps.length) {
          setPhase('complete')
          playSuccess()
          onComplete?.()
          clearInterval(timer)
          return
        }

        // Update step if changed
        if (stepIndex !== currentStep) {
          setCurrentStep(stepIndex)
        }

        // Update sub-phase and work lines if changed
        const newSubPhase = subPhases[subPhaseIndex]
        if (newSubPhase && (newSubPhase !== lastSubPhaseRef.current || stepIndex !== lastStepRef.current)) {
          setSubPhase(newSubPhase)
          lastSubPhaseRef.current = newSubPhase
          lastStepRef.current = stepIndex

          // Add work lines based on sub-phase
          if (newSubPhase === 'multiply') {
            // Add multiplication line (what we subtract from)
            workLinesRef.current.push({
              type: 'multiply',
              value: steps[stepIndex].multiplicationResult,
              step: stepIndex
            })
            setWorkLines([...workLinesRef.current])
            playPop()
          } else if (newSubPhase === 'subtract') {
            // Add subtraction line
            workLinesRef.current.push({
              type: 'line',
              value: '',
              step: stepIndex
            })
            workLinesRef.current.push({
              type: 'remainder',
              value: steps[stepIndex].remainder,
              step: stepIndex
            })
            setWorkLines([...workLinesRef.current])
            playWhoosh()
          } else if (newSubPhase === 'divide') {
            playPop()
          } else if (newSubPhase === 'bringdown') {
            playPop()
          }
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, currentStep, onComplete, playPop, playSuccess, playWhoosh, steps.length])

  // Build quotient string progressively
  const buildQuotient = () => {
    let q = ''
    for (let i = 0; i <= currentStep; i++) {
      if (i < currentStep || (i === currentStep && subPhase !== 'divide')) {
        q += (i === 0 ? '' : ' ') + steps[i].quotientTerm
      }
    }
    return q || '_'
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-4">
        <div className="text-lg sm:text-xl font-bold text-gray-800 font-mono">
          ({dividend}) ÷ ({divisor})
        </div>
      </div>

      {/* Long Division Visualization */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[280px]">
        {phase === 'setup' ? (
          /* Setup: Show division layout */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Long Division Setup</div>
            <div className="bg-white p-6 rounded-lg shadow-sm font-mono text-lg">
              {/* Traditional long division format */}
              <div className="relative">
                {/* Quotient placeholder */}
                <div className="text-center mb-1 text-gray-400">
                  <span className="border-b-2 border-transparent px-2">?</span>
                </div>
                {/* Division bar */}
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">{divisor}</span>
                  <span className="text-gray-400 text-2xl mr-1">⟌</span>
                  <span className="border-t-2 border-gray-600 px-3">{dividend}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Divide the leading term, multiply, subtract, bring down
            </div>
          </div>
        ) : phase === 'dividing' ? (
          /* Division steps animation - with VISUAL WORK AREA */
          <div className="space-y-3">
            {/* Step and Sub-phase indicators */}
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="flex gap-1">
                {['divide', 'multiply', 'subtract', 'bringdown'].map((sp) => (
                  <div
                    key={sp}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium transition-all',
                      subPhase === sp
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {sp === 'divide' && 'Div'}
                    {sp === 'multiply' && 'Mul'}
                    {sp === 'subtract' && 'Sub'}
                    {sp === 'bringdown' && 'Next'}
                  </div>
                ))}
              </div>
            </div>

            {/* TRADITIONAL LONG DIVISION VISUAL FORMAT */}
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200 font-mono overflow-x-auto">
              <div className="min-w-[280px]">
                {/* Quotient row (builds progressively) */}
                <div className="flex justify-center mb-1">
                  <div className="relative" style={{ marginLeft: '80px' }}>
                    <motion.span
                      key={`q-${currentStep}-${subPhase}`}
                      className="text-xl font-bold text-primary"
                    >
                      {buildQuotient()}
                    </motion.span>
                    {subPhase === 'divide' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xl font-bold text-green-500 ml-1"
                      >
                        {steps[currentStep].quotientTerm}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Division bar: divisor ⟌ dividend */}
                <div className="flex items-start mb-2">
                  <span className="text-blue-600 text-lg w-16 text-right pr-2">{divisor}</span>
                  <span className="text-gray-400 text-2xl">⟌</span>
                  <div className="flex-1 border-t-2 border-gray-600 pt-1 pl-2">
                    <span className="text-lg">{dividend}</span>
                  </div>
                </div>

                {/* WORK AREA - Shows multiplication and subtraction work */}
                <div className="ml-20 space-y-0">
                  <AnimatePresence mode="sync">
                    {workLines.map((line, index) => (
                      <motion.div
                        key={`work-${index}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex"
                      >
                        {line.type === 'multiply' && (
                          <div className={cn(
                            'text-lg pl-1',
                            line.step === currentStep && subPhase === 'multiply'
                              ? 'text-orange-600 font-bold'
                              : 'text-gray-700'
                          )}>
                            <span className="text-red-500 mr-1">−</span>
                            <span className="border-b border-gray-400 pb-0.5">{line.value}</span>
                          </div>
                        )}
                        {line.type === 'line' && (
                          <div className="w-full border-t border-gray-400 my-1" />
                        )}
                        {line.type === 'remainder' && (
                          <div className={cn(
                            'text-lg pl-3',
                            line.step === currentStep && (subPhase === 'subtract' || subPhase === 'bringdown')
                              ? 'text-purple-600 font-bold'
                              : 'text-gray-700'
                          )}>
                            {line.value}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Current operation explanation */}
            <motion.div
              key={`explain-${currentStep}-${subPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'p-3 rounded-lg border-2 text-center',
                subPhase === 'divide' && 'bg-blue-50 border-blue-300',
                subPhase === 'multiply' && 'bg-orange-50 border-orange-300',
                subPhase === 'subtract' && 'bg-purple-50 border-purple-300',
                subPhase === 'bringdown' && 'bg-green-50 border-green-300'
              )}
            >
              {subPhase === 'divide' && (
                <div>
                  <div className="font-semibold text-blue-700">1. DIVIDE</div>
                  <div className="text-sm text-blue-600 mt-1">
                    What times <span className="font-mono">x</span> gives the leading term?
                  </div>
                  <div className="font-mono font-bold text-blue-800 mt-1">
                    → Quotient term: <span className="text-green-600">{steps[currentStep].quotientTerm}</span>
                  </div>
                </div>
              )}
              {subPhase === 'multiply' && (
                <div>
                  <div className="font-semibold text-orange-700">2. MULTIPLY</div>
                  <div className="text-sm text-orange-600 mt-1">
                    Multiply divisor by quotient term:
                  </div>
                  <div className="font-mono font-bold text-orange-800 mt-1">
                    {steps[currentStep].quotientTerm.replace('+', '').trim()} × ({divisor}) = {steps[currentStep].multiplicationResult}
                  </div>
                </div>
              )}
              {subPhase === 'subtract' && (
                <div>
                  <div className="font-semibold text-purple-700">3. SUBTRACT</div>
                  <div className="text-sm text-purple-600 mt-1">
                    Subtract to find the remainder:
                  </div>
                  <div className="font-mono font-bold text-purple-800 mt-1">
                    {steps[currentStep].subtraction}
                  </div>
                </div>
              )}
              {subPhase === 'bringdown' && (
                <div>
                  <div className="font-semibold text-green-700">4. BRING DOWN</div>
                  <div className="text-sm text-green-600 mt-1">
                    Current remainder: <strong className="font-mono">{steps[currentStep].remainder}</strong>
                  </div>
                  {currentStep < steps.length - 1 ? (
                    <div className="text-sm text-green-600 mt-1">
                      → Continue with next term...
                    </div>
                  ) : steps[currentStep].remainder === '0' ? (
                    <div className="text-sm text-green-700 mt-1 font-bold">
                      ✓ No remainder! Division complete.
                    </div>
                  ) : (
                    <div className="text-sm text-green-600 mt-1">
                      → Final remainder: {steps[currentStep].remainder}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Step progress indicator */}
            <div className="flex justify-center gap-3">
              {steps.map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full transition-all',
                      i < currentStep
                        ? 'bg-green-500'
                        : i === currentStep
                        ? 'bg-primary'
                        : 'bg-gray-300'
                    )}
                  />
                  <span className="text-xs text-gray-500">Step {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Complete: Show final answer with work */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-green-600">✓ Division Complete!</div>

            {/* Final traditional format display */}
            <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 font-mono">
              <div className="min-w-[280px]">
                {/* Final quotient */}
                <div className="flex justify-center mb-1">
                  <div className="relative" style={{ marginLeft: '80px' }}>
                    <span className="text-xl font-bold text-primary">{quotient}</span>
                  </div>
                </div>

                {/* Division bar */}
                <div className="flex items-start mb-2">
                  <span className="text-blue-600 text-lg w-16 text-right pr-2">{divisor}</span>
                  <span className="text-gray-400 text-2xl">⟌</span>
                  <div className="flex-1 border-t-2 border-gray-600 pt-1 pl-2">
                    <span className="text-lg">{dividend}</span>
                  </div>
                </div>

                {/* Complete work area */}
                <div className="ml-20 space-y-0">
                  {workLines.map((line, index) => (
                    <div key={`final-${index}`} className="flex">
                      {line.type === 'multiply' && (
                        <div className="text-lg pl-1 text-gray-700">
                          <span className="text-red-500 mr-1">−</span>
                          <span className="border-b border-gray-400 pb-0.5">{line.value}</span>
                        </div>
                      )}
                      {line.type === 'line' && (
                        <div className="w-full border-t border-gray-400 my-1" />
                      )}
                      {line.type === 'remainder' && (
                        <div className="text-lg pl-3 text-gray-700">
                          {line.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Final answer */}
            <div className="text-center">
              <div className="text-gray-600 text-sm mb-1">({dividend}) ÷ ({divisor})</div>
              <div className="text-2xl font-bold text-primary font-mono">= {quotient}</div>
              {finalRemainder !== '0' && (
                <div className="text-sm text-gray-500 mt-1">
                  Remainder: {finalRemainder}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Method Summary */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-blue-800 text-center">
          <strong>Polynomial Long Division:</strong> Divide → Multiply → Subtract → Repeat
        </div>
      </div>

      {/* Instructions / Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Divide the polynomials
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Use long division to find quotient and remainder
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              ({dividend}) ÷ ({divisor}) = {quotient}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            Step {currentStep + 1}: {steps[currentStep]?.quotientTerm}
          </p>
        )}
      </div>
    </div>
  )
}
