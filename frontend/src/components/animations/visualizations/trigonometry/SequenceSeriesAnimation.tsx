/**
 * SequenceSeriesAnimation - Visual representation of sequences and series
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows sequence terms appearing
 * - Demonstrates pattern recognition
 * - Visualizes partial sums for series
 * - SETUP MODE (default): Shows sequence pattern
 * - SOLUTION MODE: Animates term generation and summation
 *
 * Used for:
 * - Level N: sequences, arithmetic_sequences, geometric_sequences, infinite_sequences, infinite_series, convergence
 * - Concept introductions for sequences and series
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface SequenceSeriesAnimationProps extends BaseAnimationProps {
  sequenceType?: 'arithmetic' | 'geometric'
  showSeries?: boolean
}

export default function SequenceSeriesAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  sequenceType = 'arithmetic',
  showSeries = false,
}: SequenceSeriesAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'
    | 'what_is_sequence'
    | 'terms'
    | 'pattern_find'
    | 'pattern'
    | 'formula_intro'
    | 'formula'
    | 'formula_apply'
    | 'series_intro'
    | 'complete'
  >('setup')
  const [visibleTerms, setVisibleTerms] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const termIndexRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Arithmetic: a, a+d, a+2d, ... (first term, common difference)
  // Geometric: a, ar, ar², ... (first term, common ratio)
  // Default: arithmetic sequence 2, 5, 8, 11, ... (a=2, d=3)
  const operands = problemData?.operands || [2, 3]
  const [firstTerm, commonValue] = operands

  // Generate sequence terms
  const terms = useMemo(() => {
    const result: number[] = []
    for (let n = 0; n < 8; n++) {
      if (sequenceType === 'arithmetic') {
        result.push(firstTerm + n * commonValue)
      } else {
        result.push(firstTerm * Math.pow(commonValue, n))
      }
    }
    return result
  }, [firstTerm, commonValue, sequenceType])

  // Calculate partial sums
  const partialSums = useMemo(() => {
    const sums: number[] = []
    let sum = 0
    for (const term of terms) {
      sum += term
      sums.push(sum)
    }
    return sums
  }, [terms])

  // Nth term formula
  const nthTermFormula = sequenceType === 'arithmetic'
    ? `aₙ = ${firstTerm} + (n-1)·${commonValue} = ${firstTerm - commonValue} + ${commonValue}n`
    : `aₙ = ${firstTerm}·${commonValue}^(n-1)`

  // Sum formula (for arithmetic)
  const sumFormula = sequenceType === 'arithmetic'
    ? `Sₙ = n/2·(2a + (n-1)d) = n/2·(${2 * firstTerm} + (n-1)·${commonValue})`
    : `Sₙ = a·(rⁿ-1)/(r-1) = ${firstTerm}·(${commonValue}ⁿ-1)/${commonValue - 1}`

  // Animate terms appearing - SLOWER (800ms instead of 400ms)
  useEffect(() => {
    if (!showSolution) {
      setVisibleTerms(0)
      termIndexRef.current = 0
      return
    }

    if (phase === 'terms') {
      const interval = setInterval(() => {
        if (isPausedRef.current) return

        termIndexRef.current++
        if (termIndexRef.current > 6) {
          clearInterval(interval)
          return
        }
        setVisibleTerms(termIndexRef.current)
        playPop()
      }, 800) // SLOWER: 800ms instead of 400ms
      return () => clearInterval(interval)
    }
  }, [showSolution, phase, playPop])

  // Animation effect for solution mode - converted to interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      termIndexRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 25 // 2.5 seconds per phase

    // 10 phases, ~25 seconds total
    const phases: (typeof phase)[] = [
      'setup', 'what_is_sequence', 'terms', 'pattern_find', 'pattern',
      'formula_intro', 'formula', 'formula_apply', 'series_intro', 'complete'
    ]

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const phaseIndex = Math.floor(tickRef.current / PHASE_DURATION)

      if (phaseIndex >= phases.length - 1) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
        return
      }

      const newPhase = phases[phaseIndex]
      if (newPhase !== phase) {
        setPhase(newPhase)
        if (newPhase === 'terms') {
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
      {/* Sequence Type */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-gray-800">
          {sequenceType === 'arithmetic' ? 'Arithmetic' : 'Geometric'} Sequence
        </div>
        <div className="text-sm text-gray-500">
          {sequenceType === 'arithmetic'
            ? `First term: ${firstTerm}, Common difference: ${commonValue}`
            : `First term: ${firstTerm}, Common ratio: ${commonValue}`}
        </div>
      </div>

      {/* Sequence Terms Visualization */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <AnimatePresence>
            {terms.slice(0, phase === 'setup' ? 4 : visibleTerms + 1).map((term, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: phase === 'setup' ? i * 0.1 : 0 }}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg',
                  i < visibleTerms ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                )}
              >
                {term}
              </motion.div>
            ))}
            {phase !== 'setup' && visibleTerms < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-12 h-12 flex items-center justify-center text-gray-400"
              >
                ...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Index labels */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          {terms.slice(0, phase === 'setup' ? 4 : visibleTerms + 1).map((_, i) => (
            <div key={i} className="w-12 text-center">
              a<sub>{i + 1}</sub>
            </div>
          ))}
        </div>
      </div>

      {/* What is a Sequence */}
      {phase === 'what_is_sequence' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-2">What is a Sequence?</div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>A <strong>sequence</strong> is an ordered list of numbers that follow a pattern.</p>
              <p className="mt-2">Each number in the list is called a <strong>term</strong>.</p>
              <p className="font-mono text-lg mt-2 text-blue-600">a₁, a₂, a₃, a₄, ... aₙ</p>
              <p className="text-xs text-gray-500 mt-1">The subscript tells you the position (1st, 2nd, 3rd...)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pattern Find Challenge */}
      {phase === 'pattern_find' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-700 mb-2">🔍 Find the Pattern!</div>
            <div className="text-sm text-gray-600">
              <p>Look at the numbers: <span className="font-mono font-bold">{terms.slice(0, 4).join(', ')}, ...</span></p>
              <p className="mt-2">What do you do to get from one number to the next?</p>
              <p className="mt-2 text-yellow-600 font-medium">
                {sequenceType === 'arithmetic'
                  ? `Hint: Try adding the same number each time!`
                  : `Hint: Try multiplying by the same number each time!`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pattern Identification */}
      {(phase === 'pattern' || phase === 'formula_intro' || phase === 'formula' || phase === 'formula_apply' || phase === 'series_intro' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-sm text-purple-600 font-semibold mb-2">Pattern Identified</div>
            <div className="flex justify-center items-center gap-2 text-lg">
              {terms.slice(0, 4).map((term, i) => (
                <span key={i}>
                  <span className="font-bold">{term}</span>
                  {i < 3 && (
                    <span className="text-purple-500 mx-1">
                      {sequenceType === 'arithmetic' ? `+${commonValue}` : `×${commonValue}`}
                    </span>
                  )}
                </span>
              ))}
              <span className="text-gray-400">...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formula Intro */}
      {phase === 'formula_intro' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-indigo-700 mb-2">Why Do We Need a Formula?</div>
            <div className="text-sm text-gray-600">
              <p>Instead of writing out every term, we can find <strong>any term</strong> with a formula!</p>
              <p className="mt-2">The formula tells us how to calculate the <strong>nth term</strong> (aₙ).</p>
              <p className="mt-2 text-indigo-600 font-mono">
                {sequenceType === 'arithmetic'
                  ? 'aₙ = a + (n-1)·d'
                  : 'aₙ = a·r^(n-1)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {sequenceType === 'arithmetic'
                  ? 'a = first term, d = common difference'
                  : 'a = first term, r = common ratio'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formula */}
      {(phase === 'formula' || phase === 'formula_apply' || phase === 'series_intro' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-sm text-green-600 font-semibold mb-2">Nth Term Formula</div>
            <div className="font-mono text-lg text-green-700">{nthTermFormula}</div>
          </div>
        </motion.div>
      )}

      {/* Formula Apply */}
      {phase === 'formula_apply' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-teal-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-teal-700 mb-2">Let's Test It! Find the 10th Term</div>
            <div className="text-sm space-y-1 font-mono">
              {sequenceType === 'arithmetic' ? (
                <>
                  <p>a₁₀ = {firstTerm} + (10-1)·{commonValue}</p>
                  <p>a₁₀ = {firstTerm} + 9·{commonValue}</p>
                  <p>a₁₀ = {firstTerm} + {9 * commonValue}</p>
                  <p className="text-xl font-bold text-teal-600">a₁₀ = {firstTerm + 9 * commonValue}</p>
                </>
              ) : (
                <>
                  <p>a₁₀ = {firstTerm}·{commonValue}^(10-1)</p>
                  <p>a₁₀ = {firstTerm}·{commonValue}^9</p>
                  <p className="text-xl font-bold text-teal-600">a₁₀ = {firstTerm * Math.pow(commonValue, 9)}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Series Intro */}
      {phase === 'series_intro' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-700 mb-2">What is a Series?</div>
            <div className="text-sm text-gray-600">
              <p>A <strong>series</strong> is when you ADD the terms of a sequence together.</p>
              <p className="mt-2 font-mono">S = a₁ + a₂ + a₃ + ... + aₙ</p>
              <p className="mt-2">For our sequence: <span className="font-mono">{terms.slice(0, 4).join(' + ')} + ...</span></p>
              <p className="mt-1 font-bold text-orange-600">S₄ = {partialSums[3]}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Series Sum (if enabled) */}
      {showSeries && (phase === 'formula' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 rounded-lg p-4 mb-4"
        >
          <div className="text-center">
            <div className="text-sm text-orange-600 font-semibold mb-2">Sum of First n Terms</div>
            <div className="font-mono text-sm text-orange-700">{sumFormula}</div>
            <div className="mt-2 text-sm">
              S<sub>6</sub> = {partialSums[5]}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reference Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="font-bold text-blue-700">Arithmetic</div>
          <div className="font-mono text-blue-600">aₙ = a + (n-1)d</div>
        </div>
        <div className="bg-purple-50 p-2 rounded text-center">
          <div className="font-bold text-purple-700">Geometric</div>
          <div className="font-mono text-purple-600">aₙ = a·r^(n-1)</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Identify the pattern</p>
            <p className="text-sm mt-1 text-gray-500">Find the nth term formula</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              {sequenceType === 'arithmetic' ? 'Arithmetic' : 'Geometric'} sequence identified!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing sequences...'}
            {phase === 'what_is_sequence' && 'Understanding sequences...'}
            {phase === 'terms' && 'Generating terms...'}
            {phase === 'pattern_find' && 'Can you find the pattern?'}
            {phase === 'pattern' && 'Revealing the pattern...'}
            {phase === 'formula_intro' && 'Introducing the formula...'}
            {phase === 'formula' && 'Deriving formula...'}
            {phase === 'formula_apply' && 'Applying the formula...'}
            {phase === 'series_intro' && 'Understanding series...'}
          </p>
        )}
      </div>
    </div>
  )
}
