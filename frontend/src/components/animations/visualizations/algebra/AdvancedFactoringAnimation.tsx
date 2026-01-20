/**
 * AdvancedFactoringAnimation - Visual representation of advanced factoring techniques
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Factor by grouping
 * - Sum and difference of cubes
 * - Shows pattern recognition
 * - SETUP MODE (default): Shows polynomial and hints
 * - SOLUTION MODE: Animates grouping and factoring
 *
 * Used for:
 * - Level J: advanced_factoring, sum_difference_cubes
 * - Concept introductions for advanced polynomial factoring
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface AdvancedFactoringAnimationProps extends BaseAnimationProps {
  factoringType?: 'grouping' | 'sum_cubes' | 'diff_cubes'
}

// Extended phases for clearer step-by-step understanding
type FactoringPhase = 'setup' | 'identify_a' | 'identify_b' | 'show_formula' | 'substitute' | 'calculate_first' | 'calculate_second' | 'verify' | 'complete'

export default function AdvancedFactoringAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  factoringType = 'sum_cubes',
}: AdvancedFactoringAnimationProps) {
  const [phase, setPhase] = useState<FactoringPhase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: a³ + b³ = (a + b)(a² - ab + b²) with a=2, b=3
  // 8 + 27 = 2³ + 3³ = (2+3)(4-6+9) = 5 × 7 = 35
  const operands = problemData?.operands || [2, 3]
  const [a, b] = operands

  // Calculate values for sum of cubes
  const aCubed = a * a * a
  const bCubed = b * b * b
  const sum = aCubed + bCubed
  const firstFactor = a + b
  const aSquared = a * a
  const ab = a * b
  const bSquared = b * b
  const secondFactor = aSquared - ab + bSquared

  // Animation effect for solution mode - extended phases with proper pacing
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    // Extended phase sequence with generous timing for understanding
    const phases: FactoringPhase[] = [
      'identify_a',       // Identify a (cube root of first term)
      'identify_b',       // Identify b (cube root of second term)
      'show_formula',     // Show the formula a³ + b³ = (a+b)(a²-ab+b²)
      'substitute',       // Substitute values into formula
      'calculate_first',  // Calculate first factor (a + b)
      'calculate_second', // Calculate second factor (a² - ab + b²)
      'verify',           // Verify the result
      'complete',         // Done!
    ]

    const TICK_MS = 100
    const PHASE_DURATION = 25 // 2.5 seconds per phase (20 seconds total!)

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const phaseIndex = Math.floor(tickRef.current / PHASE_DURATION)

      if (phaseIndex >= phases.length) {
        clearInterval(timer)
        return
      }

      const newPhase = phases[phaseIndex]
      if (newPhase !== phase) {
        setPhase(newPhase)

        // Sound effects at phase transitions
        if (newPhase === 'complete') {
          playSuccess()
          onComplete?.()
        } else if (newPhase === 'show_formula' || newPhase === 'verify') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">Factor:</div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 font-mono">
          {aCubed} + {bCubed}
        </div>
      </div>

      {/* Formula Reference */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-sm text-blue-600 mb-1">Sum of Cubes Formula</div>
        <div className="text-lg font-mono">
          a³ + b³ = (a + b)(a² − ab + b²)
        </div>
      </motion.div>

      {/* Progress Indicator */}
      {showSolution && phase !== 'setup' && (
        <div className="flex justify-center gap-1 mb-3">
          {['identify_a', 'identify_b', 'show_formula', 'substitute', 'calculate_first', 'calculate_second', 'verify', 'complete'].map((p, i) => (
            <div
              key={p}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                phase === p
                  ? 'bg-primary scale-125'
                  : ['identify_a', 'identify_b', 'show_formula', 'substitute', 'calculate_first', 'calculate_second', 'verify', 'complete'].indexOf(phase) > i
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      )}

      {/* Main Content - Extended phases */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[220px]">
        {phase === 'setup' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">🔍 Is this a Sum of Cubes?</div>
            <div className="text-gray-600 text-center">
              <p className="font-mono text-xl">{aCubed} + {bCubed}</p>
              <p className="mt-2 text-sm">Let's check if each term is a perfect cube...</p>
            </div>
          </div>
        )}

        {phase === 'identify_a' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-blue-700">Step 1: Find 'a' - Cube Root of {aCubed}</div>
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
              <p className="text-center text-lg">What number cubed equals {aCubed}?</p>
              <p className="text-center font-mono text-2xl mt-2">
                <span className="text-blue-600 font-bold">{a}</span> × {a} × {a} = {aCubed}
              </p>
              <p className="text-center text-blue-700 font-bold text-xl mt-2">
                So a = {a}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'identify_b' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-green-700">Step 2: Find 'b' - Cube Root of {bCubed}</div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400">
              <p className="text-center text-lg">What number cubed equals {bCubed}?</p>
              <p className="text-center font-mono text-2xl mt-2">
                <span className="text-green-600 font-bold">{b}</span> × {b} × {b} = {bCubed}
              </p>
              <p className="text-center text-green-700 font-bold text-xl mt-2">
                So b = {b}
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="bg-blue-100 p-2 rounded-lg text-center">
                <div className="text-xs text-blue-600">a =</div>
                <div className="text-xl font-bold text-blue-700">{a}</div>
              </div>
              <div className="bg-green-100 p-2 rounded-lg text-center">
                <div className="text-xs text-green-600">b =</div>
                <div className="text-xl font-bold text-green-700">{b}</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'show_formula' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-purple-700">Step 3: Apply the Formula</div>
            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
              <p className="text-center text-sm text-purple-600 mb-2">Sum of Cubes Formula:</p>
              <p className="text-center font-mono text-xl font-bold text-purple-800">
                a³ + b³ = (a + b)(a² − ab + b²)
              </p>
            </div>
            <p className="text-sm text-gray-600">
              This formula ALWAYS works when factoring sum of cubes!
            </p>
          </motion.div>
        )}

        {phase === 'substitute' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-orange-700">Step 4: Substitute a={a}, b={b}</div>
            <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-400 font-mono">
              <p className="text-center text-lg">
                ({a})³ + ({b})³ = (<span className="text-blue-600">{a}</span> + <span className="text-green-600">{b}</span>)(<span className="text-blue-600">{a}</span>² − <span className="text-blue-600">{a}</span>·<span className="text-green-600">{b}</span> + <span className="text-green-600">{b}</span>²)
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'calculate_first' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-blue-700">Step 5: Calculate First Factor (a + b)</div>
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
              <p className="text-center font-mono text-xl">
                a + b = {a} + {b} = <span className="text-blue-800 font-bold text-2xl">{firstFactor}</span>
              </p>
            </div>
            <p className="text-sm text-gray-600">
              First factor: <strong>({firstFactor})</strong>
            </p>
          </motion.div>
        )}

        {phase === 'calculate_second' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-green-700">Step 6: Calculate Second Factor (a² − ab + b²)</div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400 space-y-2">
              <p className="text-center font-mono">
                a² = {a}² = <span className="font-bold">{aSquared}</span>
              </p>
              <p className="text-center font-mono">
                ab = {a} × {b} = <span className="font-bold">{ab}</span>
              </p>
              <p className="text-center font-mono">
                b² = {b}² = <span className="font-bold">{bSquared}</span>
              </p>
              <div className="border-t border-green-400 pt-2">
                <p className="text-center font-mono text-lg">
                  {aSquared} − {ab} + {bSquared} = <span className="text-green-800 font-bold text-xl">{secondFactor}</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Second factor: <strong>({secondFactor})</strong>
            </p>
          </motion.div>
        )}

        {phase === 'verify' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-purple-700">Step 7: Verify Our Answer</div>
            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
              <p className="text-center font-mono text-lg">
                ({firstFactor}) × ({secondFactor}) = <span className="text-purple-800 font-bold text-xl">{firstFactor * secondFactor}</span>
              </p>
              <p className="text-center mt-2 text-sm text-purple-600">
                {firstFactor * secondFactor} = {aCubed} + {bCubed} ✓
              </p>
            </div>
            <p className="text-green-600 font-bold">The answer checks out!</p>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-green-600">🎉 Factored Complete!</div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-500">
              <div className="font-mono text-xl text-center">
                <span className="text-gray-600">{aCubed} + {bCubed}</span>
                <span className="mx-2">=</span>
                <span className="text-green-700 font-bold">({firstFactor})({secondFactor})</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 text-center">
              <p>Using a = {a} and b = {b}</p>
              <p>a³ + b³ = (a+b)(a²−ab+b²)</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Formula Reference Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="font-bold text-blue-700">Sum of Cubes</div>
          <div className="font-mono text-blue-600">a³ + b³ = (a+b)(a²−ab+b²)</div>
        </div>
        <div className="bg-purple-50 p-2 rounded text-center">
          <div className="font-bold text-purple-700">Diff of Cubes</div>
          <div className="font-mono text-purple-600">a³ − b³ = (a−b)(a²+ab+b²)</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Factor using sum of cubes</p>
            <p className="text-sm mt-1 text-gray-500">Identify a and b, then apply the formula</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              {aCubed} + {bCubed} = ({firstFactor})({secondFactor})
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'identify_a' && 'Finding value of a...'}
            {phase === 'identify_b' && 'Finding value of b...'}
            {phase === 'show_formula' && 'Showing formula...'}
            {phase === 'substitute' && 'Substituting values...'}
            {phase === 'calculate_first' && 'Calculating first factor...'}
            {phase === 'calculate_second' && 'Calculating second factor...'}
            {phase === 'verify' && 'Verifying the result...'}
          </p>
        )}
      </div>
    </div>
  )
}
