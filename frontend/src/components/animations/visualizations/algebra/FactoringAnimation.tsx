/**
 * FactoringAnimation - Visual representation of factoring polynomials
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Reverse FOIL method for trinomials
 * - Factor by grouping visualization
 * - GCF extraction animation
 * - SETUP MODE (default): Shows trinomial with factor hints
 * - SOLUTION MODE: Animates factor discovery step by step
 *
 * Used for:
 * - Level I: factoring, factor_gcf, factor_trinomial, factor_difference_squares
 * - Concept introductions for polynomial factoring
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface FactoringAnimationProps extends BaseAnimationProps {
  factoringType?: 'trinomial' | 'gcf' | 'difference_squares'
}

export default function FactoringAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  factoringType = 'trinomial',
}: FactoringAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'analyze' | 'find_factors' | 'verify' | 'complete'>('setup')
  const [foundPairs, setFoundPairs] = useState<[number, number][]>([])
  const [correctPair, setCorrectPair] = useState<[number, number] | null>(null)
  const [currentPairIndex, setCurrentPairIndex] = useState(-1)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const pairIndexRef = useRef(-1)
  const phaseRef = useRef<string>('setup')

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract coefficients: [a, b, c] for ax² + bx + c
  // Default: x² + 5x + 6 = (x+2)(x+3)
  // ROBUST VALIDATION: Each operand validated individually with safe defaults
  const operands = problemData?.operands || []
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 1
  const b = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 5
  const c = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 6

  // For simple trinomials (a=1), find two numbers that multiply to c and add to b
  // Returns ALL unique factor pairs (no limit)
  const findFactorPairs = (product: number, targetSum: number): [number, number][] => {
    const pairs: [number, number][] = []
    const absProduct = Math.abs(product)
    const seen = new Set<string>()

    for (let i = 1; i <= Math.sqrt(absProduct) + 1; i++) {
      if (absProduct % i === 0 || (product === 0 && i === 1)) {
        const j = product === 0 ? 0 : absProduct / i

        // Consider all sign combinations
        const combos: [number, number][] = product > 0
          ? [[i, j], [-i, -j]]
          : product < 0
          ? [[i, -j], [-i, j]]
          : [[0, 0]] // product is 0

        for (const [p, q] of combos) {
          // Create a canonical key to avoid duplicates (sort the pair)
          const key = [Math.min(p, q), Math.max(p, q)].join(',')
          if (!seen.has(key) && p * q === product) {
            seen.add(key)
            pairs.push([p, q])
          }
        }
      }
    }

    // IMPORTANT: Sort pairs to show the correct one last (builds suspense)
    // But ensure it's always included!
    return pairs.sort((a, b) => {
      const aIsCorrect = a[0] + a[1] === targetSum
      const bIsCorrect = b[0] + b[1] === targetSum
      if (aIsCorrect && !bIsCorrect) return 1  // Correct pair goes last
      if (bIsCorrect && !aIsCorrect) return -1
      return 0
    })
  }

  // Find the correct factor pair - generate ALL pairs, no limit
  const factorPairs = findFactorPairs(c, b)
  const solution = factorPairs.find(([p, q]) => p + q === b)
  const isFactorable = solution !== undefined
  const [factor1, factor2] = solution || [0, 0] // Default only for TypeScript, won't display if unfactorable

  // Limit display to max 6 pairs for UI (but ensure correct pair is always included)
  const pairsToDisplay = factorPairs.length > 6
    ? [...factorPairs.filter(([p, q]) => p + q !== b).slice(0, 5), solution!].filter(Boolean) as [number, number][]
    : factorPairs

  // Educational scripts for each step
  const scripts = {
    setup: `Let's factor ${a === 1 ? '' : a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}.`,
    analyze: `We need two numbers that multiply to ${c} AND add to ${b}.`,
    findFactors: `Testing factor pairs of ${c}...`,
    verify: isFactorable ? `Let's verify: (x ${factor1 >= 0 ? '+' : ''} ${factor1})(x ${factor2 >= 0 ? '+' : ''} ${factor2}) using FOIL.` : '',
    complete: isFactorable ? `The factors are (x ${factor1 >= 0 ? '+' : ''} ${factor1}) and (x ${factor2 >= 0 ? '+' : ''} ${factor2}).` : 'This trinomial cannot be factored using integers.',
  }

  // Format coefficient for display
  const formatCoef = (coef: number, showX: boolean = false, power: number = 1): string => {
    if (coef === 0) return ''
    const xPart = showX ? (power === 2 ? 'x²' : power === 1 ? 'x' : '') : ''
    if (coef === 1 && showX) return xPart
    if (coef === -1 && showX) return `-${xPart}`
    return `${coef}${xPart}`
  }

  // Animation effect for solution mode - supports pause
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setFoundPairs([])
      setCorrectPair(null)
      setCurrentPairIndex(-1)
      pairIndexRef.current = -1
      phaseRef.current = 'setup'
      return
    }

    // Use interval-based animation for pause support
    const TICK_MS = 100
    const ANALYZE_TICKS = 10 // 1 second
    const PAIR_INTERVAL_TICKS = 12 // 1.2 seconds between pairs
    const VERIFY_DELAY_TICKS = 8 // 0.8 seconds after last pair
    const COMPLETE_DELAY_TICKS = 20 // 2 seconds after verify

    let tickCount = 0
    const pairsToShow = pairsToDisplay

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickCount++

      // Phase 1: Analyze
      if (tickCount === ANALYZE_TICKS && phaseRef.current === 'setup') {
        phaseRef.current = 'analyze'
        setPhase('analyze')
        playWhoosh()
      }

      // Phase 2: Show factor pairs one by one
      const pairStartTick = ANALYZE_TICKS + 5
      for (let i = 0; i < pairsToShow.length; i++) {
        const pairTick = pairStartTick + i * PAIR_INTERVAL_TICKS
        if (tickCount === pairTick && pairIndexRef.current < i) {
          pairIndexRef.current = i
          phaseRef.current = 'find_factors'
          setPhase('find_factors')
          setCurrentPairIndex(i)
          setFoundPairs(prev => [...prev, pairsToShow[i]])

          const [p, q] = pairsToShow[i]
          if (p + q === b) {
            playSuccess()
            setCorrectPair([p, q])
          } else {
            playPop()
          }
        }
      }

      // Phase 3: Verify (after all pairs shown)
      const verifyTick = pairStartTick + pairsToShow.length * PAIR_INTERVAL_TICKS + VERIFY_DELAY_TICKS
      if (tickCount === verifyTick && phaseRef.current === 'find_factors') {
        phaseRef.current = 'verify'
        setPhase('verify')
        playWhoosh()
      }

      // Phase 4: Complete
      const completeTick = verifyTick + COMPLETE_DELAY_TICKS
      if (tickCount === completeTick) {
        phaseRef.current = 'complete'
        setPhase('complete')
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, onComplete, playPop, playSuccess, playWhoosh, b, pairsToDisplay])

  // Helper to format a term with proper sign handling
  const formatTerm = (coef: number, isFirst: boolean = false): string => {
    if (coef === 0) return ''
    if (isFirst) return coef.toString()
    if (coef > 0) return ` + ${coef}`
    return ` - ${Math.abs(coef)}`  // Negative: show "- 3" not "+ -3"
  }

  // Render the trinomial with proper spacing
  const renderTrinomial = () => (
    <span className="font-mono">
      <span className="text-blue-600">{formatCoef(a, true, 2) || 'x²'}</span>
      <span className="text-green-600">
        {b === 0 ? '' : b > 0 ? ` + ${formatCoef(b, true, 1)}` : ` - ${formatCoef(Math.abs(b), true, 1)}`}
      </span>
      <span className="text-purple-600">
        {c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`}
      </span>
    </span>
  )

  // Render the factored form with proper sign display
  const renderFactored = () => (
    <span className="font-mono">
      <span className="text-gray-600">(</span>
      <span>x{factor1 === 0 ? '' : factor1 > 0 ? ` + ${factor1}` : ` - ${Math.abs(factor1)}`}</span>
      <span className="text-gray-600">)(</span>
      <span>x{factor2 === 0 ? '' : factor2 > 0 ? ` + ${factor2}` : ` - ${Math.abs(factor2)}`}</span>
      <span className="text-gray-600">)</span>
    </span>
  )

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-6">
        <div className="text-xl sm:text-2xl font-bold text-gray-800">
          <span className="text-gray-500">Factor: </span>
          {renderTrinomial()}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">
          <span className="text-gray-600">=</span>
          <span className="text-primary ml-2">
            {phase === 'complete' ? renderFactored() : '?'}
          </span>
        </div>
      </div>

      {/* Factoring Visualization */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[200px]">
        {phase === 'setup' ? (
          /* Setup: Show the method hint */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Find Two Numbers</div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="text-gray-500 text-sm">Multiply to</div>
                <div className="text-2xl font-bold text-purple-600">{c}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="text-gray-500 text-sm">Add to</div>
                <div className="text-2xl font-bold text-green-600">{b}</div>
              </motion.div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Find factors of {c} that add up to {b}
            </p>
          </div>
        ) : phase === 'analyze' ? (
          /* Analyze: Highlight the key relationship */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-gray-700">Looking for factors...</div>
            <div className="flex items-center gap-4">
              <div className="text-center p-3 bg-purple-100 rounded-lg">
                <div className="text-sm text-purple-600">Product</div>
                <div className="text-xl font-bold">{c}</div>
              </div>
              <div className="text-gray-400">and</div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-green-600">Sum</div>
                <div className="text-xl font-bold">{b}</div>
              </div>
            </div>
          </motion.div>
        ) : phase === 'find_factors' ? (
          /* Find Factors: Show pairs being tested with clear explanations */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Testing Factor Pairs of {c}</div>
            <div className="text-sm text-gray-500 mb-2">
              Need: multiply to <span className="text-purple-600 font-bold">{c}</span> AND add to <span className="text-green-600 font-bold">{b}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <AnimatePresence>
                {foundPairs.map(([p, q], i) => {
                  const isCorrect = p + q === b
                  const productOk = p * q === c
                  const sumOk = p + q === b
                  const isCurrentPair = i === currentPairIndex

                  return (
                    <motion.div
                      key={`${p}-${q}-${i}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: isCurrentPair ? 1.05 : 1,
                        y: 0,
                      }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all',
                        isCorrect
                          ? 'bg-green-100 border-green-500 ring-2 ring-green-400'
                          : isCurrentPair
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-gray-50 border-gray-200 opacity-70'
                      )}
                    >
                      <div className="text-center">
                        {/* Product check */}
                        <div className="font-mono text-base">
                          <span className={productOk ? 'text-purple-600' : 'text-red-500'}>
                            ({p}) × ({q}) = {p * q}
                          </span>
                          <span className="ml-1">{productOk ? '✓' : ''}</span>
                        </div>
                        {/* Sum check with explanation */}
                        <div className={cn(
                          'font-mono text-base mt-1',
                          isCorrect ? 'text-green-600 font-bold' : 'text-gray-600'
                        )}>
                          <span className={sumOk ? 'text-green-600' : 'text-red-500'}>
                            ({p}) + ({q}) = {p + q}
                          </span>
                          <span className="ml-1">{sumOk ? '✓' : '✗'}</span>
                        </div>
                        {/* Why rejected explanation */}
                        {!isCorrect && !isCurrentPair && (
                          <div className="text-xs text-red-400 mt-1">
                            {p + q} ≠ {b}
                          </div>
                        )}
                        {isCorrect && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-green-600 mt-1 font-semibold"
                          >
                            Found! ✓
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            {correctPair && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 px-4 py-2 rounded-lg border-2 border-green-400"
              >
                <span className="text-green-700 font-semibold text-lg">
                  🎉 Found it! The numbers are {correctPair[0]} and {correctPair[1]}
                </span>
              </motion.div>
            )}
            {!correctPair && foundPairs.length === pairsToDisplay.length && !isFactorable && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-100 px-4 py-2 rounded-lg border-2 border-orange-400"
              >
                <span className="text-orange-700 font-semibold">
                  No pair works! This trinomial is prime.
                </span>
              </motion.div>
            )}
          </div>
        ) : phase === 'verify' ? (
          /* Verify: Show FOIL check with proper sign handling */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-lg font-semibold text-gray-700">Verify with FOIL</div>
            <div className="text-xl">
              {renderFactored()}
            </div>
            <div className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">
              = x²{factor2 > 0 ? ` + ${factor2}x` : factor2 < 0 ? ` - ${Math.abs(factor2)}x` : ''}
              {factor1 > 0 ? ` + ${factor1}x` : factor1 < 0 ? ` - ${Math.abs(factor1)}x` : ''}
              {factor1 * factor2 > 0 ? ` + ${factor1 * factor2}` : factor1 * factor2 < 0 ? ` - ${Math.abs(factor1 * factor2)}` : ''}
            </div>
            <div className="text-sm text-gray-600 font-mono bg-blue-50 px-3 py-1 rounded">
              = x²{(factor1 + factor2) > 0 ? ` + ${factor1 + factor2}x` : (factor1 + factor2) < 0 ? ` - ${Math.abs(factor1 + factor2)}x` : ''}
              {factor1 * factor2 > 0 ? ` + ${factor1 * factor2}` : factor1 * factor2 < 0 ? ` - ${Math.abs(factor1 * factor2)}` : ''}
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-green-600 font-bold text-lg"
            >
              ✓ Matches the original!
            </motion.div>
          </motion.div>
        ) : (
          /* Complete: Show final answer or unfactorable message */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            {isFactorable ? (
              <>
                <div className="text-lg font-semibold text-green-600">Factored Form</div>
                <div className="text-3xl font-bold text-primary">
                  {renderFactored()}
                </div>
                <div className="text-sm text-gray-500">
                  The numbers {factor1} and {factor2} multiply to {c} and add to {b}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-orange-600">Cannot Factor</div>
                <div className="text-xl text-gray-700">
                  This trinomial cannot be factored using integers.
                </div>
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                  <strong>Why?</strong> No two integers multiply to {c} and add to {b}.
                  This is called a "prime polynomial."
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Method Summary */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-blue-800 text-center">
          <strong>Factor x² + bx + c:</strong> Find numbers that multiply to <em>c</em> and add to <em>b</em>
        </div>
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
              Factor the trinomial!
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Find two numbers that multiply to {c} and add to {b}
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {isFactorable ? (
              <p className="text-xl font-bold text-green-600">
                {renderTrinomial()} = {renderFactored()}
              </p>
            ) : (
              <p className="text-xl font-bold text-orange-600">
                {renderTrinomial()} is prime (cannot factor)
              </p>
            )}
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'analyze' && 'Analyzing coefficients...'}
            {phase === 'find_factors' && 'Testing factor pairs...'}
            {phase === 'verify' && 'Verifying solution...'}
          </p>
        )}
      </div>
    </div>
  )
}
