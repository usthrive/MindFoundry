/**
 * DiscriminantAnimation - Visual representation of the discriminant
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows b² - 4ac calculation step-by-step
 * - Each calculation step is revealed progressively for better comprehension
 * - Demonstrates three cases: D > 0, D = 0, D < 0
 * - Visualizes on parabola graph
 * - SETUP MODE (default): Shows equation and formula
 * - SOLUTION MODE: Animates calculation step-by-step and interpretation
 *
 * Used for:
 * - Level J: discriminant, root_coefficient_relationships
 * - Concept introductions for analyzing quadratic solutions
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface DiscriminantAnimationProps extends BaseAnimationProps {}

// Phases for step-by-step calculation
type Phase =
  | 'setup'           // Show coefficients
  | 'formula'         // Show D = b² - 4ac
  | 'substitute'      // Show D = (b)² - 4(a)(c)
  | 'simplify_square' // Show D = b² - 4(a)(c)
  | 'simplify_product'// Show D = b² - 4ac
  | 'calculate_final' // Show D = result
  | 'interpret'       // Show meaning
  | 'visualize'       // Show parabola
  | 'complete'        // Done

export default function DiscriminantAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: DiscriminantAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support (interval-based animation)
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const lastPhaseRef = useRef<Phase>('setup')

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract coefficients: [a, b, c] for ax² + bx + c = 0
  // Default: x² - 5x + 6 = 0 (D = 1 > 0, two real roots)
  const operands = problemData?.operands || [1, -5, 6]
  const [a, b, c] = operands

  // Validate coefficient a is not zero (quadratic requires a != 0)
  const isValidQuadratic = a !== 0 && !isNaN(a) && !isNaN(b) && !isNaN(c)

  // Early return with educational error message if invalid
  if (!isValidQuadratic) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Quadratic Equation</p>
          <p className="text-red-500 text-sm mt-2">
            {a === 0
              ? "The coefficient 'a' cannot be zero. A quadratic equation must have ax² where a ≠ 0."
              : "Please enter valid numbers for all coefficients."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>The discriminant D = b² - 4ac only applies to quadratic equations (a ≠ 0)</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate discriminant and intermediate values
  const bSquared = b * b
  const fourAC = 4 * a * c
  const discriminant = bSquared - fourAC
  const sqrtDiscriminant = Math.sqrt(Math.abs(discriminant))

  // Determine case
  const caseType = discriminant > 0 ? 'two_roots' : discriminant === 0 ? 'one_root' : 'no_roots'

  // Calculate roots if real
  const root1 = discriminant >= 0 ? (-b + sqrtDiscriminant) / (2 * a) : null
  const root2 = discriminant >= 0 ? (-b - sqrtDiscriminant) / (2 * a) : null

  // SVG for mini parabola
  const width = 200
  const height = 120
  const points = useMemo(() => {
    const pts: string[] = []
    for (let x = -3; x <= 3; x += 0.2) {
      const y = a * x * x + b * x + c
      const svgX = width / 2 + x * 25
      const svgY = height - 20 - (y - Math.min(0, a * (-b / (2 * a)) * (-b / (2 * a)) + b * (-b / (2 * a)) + c)) * 10
      if (svgY > 0 && svgY < height) {
        pts.push(`${svgX},${svgY}`)
      }
    }
    return pts.join(' ')
  }, [a, b, c])

  // Animation effect for solution mode - INTERVAL-BASED for pause support
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      lastPhaseRef.current = 'setup'
      return
    }

    // Phase timing: 2 seconds per phase (20 ticks × 100ms)
    const TICK_MS = 100
    const PHASE_DURATION = 20 // 2 seconds per phase
    const phases: Phase[] = [
      'setup',
      'formula',
      'substitute',
      'simplify_square',
      'simplify_product',
      'calculate_final',
      'interpret',
      'visualize',
      'complete'
    ]

    const timer = setInterval(() => {
      // Skip if paused
      if (isPausedRef.current) return

      tickRef.current++

      // Calculate which phase we should be in
      const phaseIndex = Math.floor(tickRef.current / PHASE_DURATION)

      // Check if animation is complete
      if (phaseIndex >= phases.length - 1) {
        setPhase('complete')
        if (lastPhaseRef.current !== 'complete') {
          playSuccess()
          onComplete?.()
          lastPhaseRef.current = 'complete'
        }
        clearInterval(timer)
        return
      }

      // Update phase if changed
      const newPhase = phases[phaseIndex]
      if (newPhase && newPhase !== lastPhaseRef.current) {
        setPhase(newPhase)
        lastPhaseRef.current = newPhase

        // Play sounds based on phase
        if (newPhase === 'formula') {
          playWhoosh()
        } else if (newPhase === 'calculate_final') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, onComplete, playPop, playSuccess, playWhoosh])

  // Format equation
  const formatEquation = () => {
    let eq = ''
    if (a !== 1 && a !== -1) eq += `${a}`
    if (a === -1) eq += '-'
    eq += 'x²'
    if (b !== 0) eq += ` ${b >= 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`
    if (c !== 0) eq += ` ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`
    eq += ' = 0'
    return eq
  }

  // Check which calculation steps should be visible based on current phase
  const showFormula = ['formula', 'substitute', 'simplify_square', 'simplify_product', 'calculate_final', 'interpret', 'visualize', 'complete'].includes(phase)
  const showSubstitute = ['substitute', 'simplify_square', 'simplify_product', 'calculate_final', 'interpret', 'visualize', 'complete'].includes(phase)
  const showSimplifySquare = ['simplify_square', 'simplify_product', 'calculate_final', 'interpret', 'visualize', 'complete'].includes(phase)
  const showSimplifyProduct = ['simplify_product', 'calculate_final', 'interpret', 'visualize', 'complete'].includes(phase)
  const showFinalResult = ['calculate_final', 'interpret', 'visualize', 'complete'].includes(phase)
  const showInterpretation = ['interpret', 'visualize', 'complete'].includes(phase)
  const showVisualization = ['visualize', 'complete'].includes(phase)

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">
          {formatEquation()}
        </div>
      </div>

      {/* Coefficients (always visible) */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white p-2 px-3 rounded-lg shadow-sm text-center border-2 border-blue-200">
          <div className="text-xs text-gray-500">a</div>
          <div className="text-lg font-bold text-blue-600">{a}</div>
        </div>
        <div className="bg-white p-2 px-3 rounded-lg shadow-sm text-center border-2 border-green-200">
          <div className="text-xs text-gray-500">b</div>
          <div className="text-lg font-bold text-green-600">{b}</div>
        </div>
        <div className="bg-white p-2 px-3 rounded-lg shadow-sm text-center border-2 border-purple-200">
          <div className="text-xs text-gray-500">c</div>
          <div className="text-lg font-bold text-purple-600">{c}</div>
        </div>
      </div>

      {/* Main Content - Step-by-Step Calculation */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[200px]">
        {phase === 'setup' ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Discriminant Formula</div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-blue-700">
                D = b² − 4ac
              </div>
              <p className="text-sm text-blue-600 mt-2">
                The discriminant tells us how many real solutions exist
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-lg font-semibold text-gray-700">
              {showVisualization ? 'Visual Representation' :
               showInterpretation ? 'Interpretation' :
               'Calculate Discriminant'}
            </div>

            {/* Step-by-step calculation display */}
            {!showVisualization && (
              <div className="font-mono text-lg space-y-2 text-center w-full max-w-md">
                {/* Step 1: Formula */}
                {showFormula && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-2 rounded transition-all',
                      phase === 'formula' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                    )}
                  >
                    <span className="text-gray-500 text-sm mr-2">Step 1:</span>
                    <span className={phase === 'formula' ? 'text-blue-700 font-bold' : 'text-gray-600'}>
                      D = b² − 4ac
                    </span>
                  </motion.div>
                )}

                {/* Step 2: Substitute values */}
                {showSubstitute && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-2 rounded transition-all',
                      phase === 'substitute' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-100'
                    )}
                  >
                    <span className="text-gray-500 text-sm mr-2">Step 2:</span>
                    <span className={phase === 'substitute' ? 'text-green-700 font-bold' : 'text-gray-600'}>
                      D = (<span className="text-green-600">{b}</span>)² − 4(<span className="text-blue-600">{a}</span>)(<span className="text-purple-600">{c}</span>)
                    </span>
                  </motion.div>
                )}

                {/* Step 3: Calculate square */}
                {showSimplifySquare && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-2 rounded transition-all',
                      phase === 'simplify_square' ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-gray-100'
                    )}
                  >
                    <span className="text-gray-500 text-sm mr-2">Step 3:</span>
                    <span className={phase === 'simplify_square' ? 'text-orange-700 font-bold' : 'text-gray-600'}>
                      D = <span className="text-orange-600">{bSquared}</span> − 4({a})({c})
                    </span>
                    {phase === 'simplify_square' && (
                      <span className="text-xs text-orange-500 ml-2">← ({b})² = {bSquared}</span>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Calculate product */}
                {showSimplifyProduct && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-2 rounded transition-all',
                      phase === 'simplify_product' ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-100'
                    )}
                  >
                    <span className="text-gray-500 text-sm mr-2">Step 4:</span>
                    <span className={phase === 'simplify_product' ? 'text-purple-700 font-bold' : 'text-gray-600'}>
                      D = {bSquared} − <span className="text-purple-600">{fourAC}</span>
                    </span>
                    {phase === 'simplify_product' && (
                      <span className="text-xs text-purple-500 ml-2">← 4×{a}×{c} = {fourAC}</span>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Final result */}
                {showFinalResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'p-3 rounded-lg transition-all',
                      phase === 'calculate_final' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'
                    )}
                  >
                    <span className="text-gray-500 text-sm mr-2">Result:</span>
                    <motion.span
                      initial={{ scale: 1 }}
                      animate={phase === 'calculate_final' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className={cn(
                        'text-2xl font-bold',
                        discriminant > 0 ? 'text-green-600' : discriminant === 0 ? 'text-yellow-600' : 'text-red-600'
                      )}
                    >
                      D = {discriminant}
                    </motion.span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Interpretation panel */}
            {showInterpretation && !showVisualization && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-4 rounded-lg text-center w-full max-w-md mt-4',
                  discriminant > 0 ? 'bg-green-100 ring-2 ring-green-500' :
                  discriminant === 0 ? 'bg-yellow-100 ring-2 ring-yellow-500' :
                  'bg-red-100 ring-2 ring-red-500'
                )}
              >
                <div className={cn(
                  'text-xl font-bold mb-2',
                  discriminant > 0 ? 'text-green-700' : discriminant === 0 ? 'text-yellow-700' : 'text-red-700'
                )}>
                  D = {discriminant} {discriminant > 0 ? '> 0' : discriminant === 0 ? '= 0' : '< 0'}
                </div>
                <div className="text-gray-700 font-medium">
                  {discriminant > 0 && '✓ Two distinct real roots'}
                  {discriminant === 0 && '✓ One repeated real root'}
                  {discriminant < 0 && '✗ No real roots (complex only)'}
                </div>
              </motion.div>
            )}

            {/* Visualization panel */}
            {showVisualization && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                {/* Summary */}
                <div className={cn(
                  'px-4 py-2 rounded-lg text-center',
                  discriminant > 0 ? 'bg-green-100' : discriminant === 0 ? 'bg-yellow-100' : 'bg-red-100'
                )}>
                  <span className={cn(
                    'font-bold',
                    discriminant > 0 ? 'text-green-700' : discriminant === 0 ? 'text-yellow-700' : 'text-red-700'
                  )}>
                    D = {discriminant} → {discriminant > 0 ? 'Two' : discriminant === 0 ? 'One' : 'No'} real root{discriminant !== 0 && discriminant > 0 ? 's' : ''}
                  </span>
                </div>

                <div className="flex gap-6 items-center">
                  {/* Mini parabola */}
                  <svg width={width} height={height} className="bg-white rounded-lg shadow-sm border">
                    {/* X-axis */}
                    <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#9ca3af" strokeWidth="1" />
                    {/* Parabola */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    {/* Root indicators */}
                    {discriminant >= 0 && root1 !== null && (
                      <motion.circle
                        initial={{ r: 0 }}
                        animate={{ r: 5 }}
                        cx={width / 2 + root1 * 25}
                        cy={height - 20}
                        fill="#10b981"
                      />
                    )}
                    {discriminant > 0 && root2 !== null && (
                      <motion.circle
                        initial={{ r: 0 }}
                        animate={{ r: 5 }}
                        cx={width / 2 + root2 * 25}
                        cy={height - 20}
                        fill="#10b981"
                      />
                    )}
                  </svg>

                  {/* Root values */}
                  <div className="text-sm">
                    {discriminant > 0 && (
                      <div className="space-y-1">
                        <div className="text-green-600 font-medium">x₁ = {root1?.toFixed(2)}</div>
                        <div className="text-green-600 font-medium">x₂ = {root2?.toFixed(2)}</div>
                      </div>
                    )}
                    {discriminant === 0 && (
                      <div className="text-yellow-600 font-medium">x = {root1?.toFixed(2)}</div>
                    )}
                    {discriminant < 0 && (
                      <div className="text-red-600 font-medium">No real x-intercepts</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Three Cases Reference */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
        <div className={cn(
          'p-2 rounded text-center transition-all',
          caseType === 'two_roots' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'
        )}>
          <div className="font-bold text-green-600">D &gt; 0</div>
          <div className="text-gray-600">2 roots</div>
        </div>
        <div className={cn(
          'p-2 rounded text-center transition-all',
          caseType === 'one_root' ? 'bg-yellow-100 ring-2 ring-yellow-500' : 'bg-gray-100'
        )}>
          <div className="font-bold text-yellow-600">D = 0</div>
          <div className="text-gray-600">1 root</div>
        </div>
        <div className={cn(
          'p-2 rounded text-center transition-all',
          caseType === 'no_roots' ? 'bg-red-100 ring-2 ring-red-500' : 'bg-gray-100'
        )}>
          <div className="font-bold text-red-600">D &lt; 0</div>
          <div className="text-gray-600">0 real</div>
        </div>
      </div>

      {/* Phase indicator (for solution mode) */}
      {showSolution && phase !== 'setup' && phase !== 'complete' && (
        <div className="flex justify-center gap-1 mb-3">
          {['formula', 'substitute', 'simplify_square', 'simplify_product', 'calculate_final', 'interpret', 'visualize'].map((p, i) => (
            <div
              key={p}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                phase === p ? 'bg-primary scale-125' :
                ['formula', 'substitute', 'simplify_square', 'simplify_product', 'calculate_final', 'interpret', 'visualize'].indexOf(phase) > i
                  ? 'bg-green-500' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      )}

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the discriminant</p>
            <p className="text-sm mt-1 text-gray-500">Determine the number of real solutions</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              D = {discriminant}: {discriminant > 0 ? 'Two' : discriminant === 0 ? 'One' : 'No'} real root{discriminant !== 0 && discriminant >= 0 ? 's' : ''}!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'formula' && 'Step 1: Starting with the formula...'}
            {phase === 'substitute' && 'Step 2: Substituting values...'}
            {phase === 'simplify_square' && 'Step 3: Calculating the square...'}
            {phase === 'simplify_product' && 'Step 4: Calculating the product...'}
            {phase === 'calculate_final' && 'Step 5: Final calculation...'}
            {phase === 'interpret' && 'Interpreting the result...'}
            {phase === 'visualize' && 'Visualizing on the graph...'}
          </p>
        )}
      </div>
    </div>
  )
}
