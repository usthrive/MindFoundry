/**
 * AlgebraTilesAnimation - Visual representation of integer operations
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Positive numbers shown as blue/green tiles
 * - Negative numbers shown as red tiles
 * - Zero pairs (+ and -) cancel out
 * - Visual model for integer addition/subtraction
 * - SETUP MODE (default): Shows the tiles for both numbers
 * - SOLUTION MODE: Animates combining and canceling
 *
 * Used for:
 * - Level G: negative_numbers, integer_addition, integer_subtraction
 * - Level G: integer_multiplication, algebraic_expressions
 * - Concept introductions for integers
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

type Operation = 'addition' | 'subtraction'

export interface AlgebraTilesAnimationProps extends BaseAnimationProps {
  operation?: Operation
  isPaused?: boolean
}

interface Tile {
  id: string
  value: 1 | -1
  canceled?: boolean
  position?: { x: number; y: number }
}

export default function AlgebraTilesAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  operation = 'addition',
}: AlgebraTilesAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'combining' | 'canceling' | 'complete'>('setup')
  const [tiles, setTiles] = useState<Tile[]>([])
  const [canceledPairs, setCanceledPairs] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const pairsCanceledRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract operands: [num1, num2] e.g., [-3, 5] = -3 + 5
  const operands = problemData?.operands || [-3, 5]
  const num1 = operands[0]
  const num2 = operands[1]

  // Detect operation from context
  const actualOperation = problemData?.operation === 'subtraction' ? 'subtraction' : operation

  // Adjusted num2 for subtraction (subtract = add opposite)
  const effectiveNum2 = actualOperation === 'subtraction' ? -num2 : num2

  // Calculate result
  const result = num1 + effectiveNum2

  // Create tiles based on numbers
  const createTiles = (n: number, prefix: string): Tile[] => {
    const count = Math.abs(n)
    const value = n >= 0 ? 1 : -1
    return Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${i}`,
      value: value as 1 | -1,
    }))
  }

  // Initialize tiles
  useEffect(() => {
    const tiles1 = createTiles(num1, 'a')
    const tiles2 = createTiles(effectiveNum2, 'b')
    setTiles([...tiles1, ...tiles2])
    setPhase('setup')
    setCanceledPairs(0)
  }, [num1, effectiveNum2])

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      const tiles1 = createTiles(num1, 'a')
      const tiles2 = createTiles(effectiveNum2, 'b')
      setTiles([...tiles1, ...tiles2])
      setPhase('setup')
      setCanceledPairs(0)
      tickRef.current = 0
      pairsCanceledRef.current = 0
      return
    }

    // Calculate pairs to cancel
    const positives = tiles.filter(t => t.value === 1).length
    const negatives = tiles.filter(t => t.value === -1).length
    const pairsToCancel = Math.min(positives, negatives)

    // Tick-based animation for proper pause support
    const TICK_MS = 100
    const COMBINE_TICK = 20             // 2 seconds - start combining
    const CANCEL_START_TICK = 40        // 4 seconds - start canceling
    const CANCEL_PAIR_TICKS = 10        // 1 second per pair (improved from 400ms)
    const COMPLETE_DELAY_TICKS = 20     // 2 seconds after last cancel

    // Calculate complete tick based on number of pairs
    const COMPLETE_TICK = CANCEL_START_TICK + (pairsToCancel * CANCEL_PAIR_TICKS) + COMPLETE_DELAY_TICKS

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase 1: Combining
      if (tick === COMBINE_TICK && phase === 'setup') {
        setPhase('combining')
        playWhoosh()
      }

      // Phase 2: Start canceling
      if (tick === CANCEL_START_TICK && phase === 'combining') {
        setPhase('canceling')
        pairsCanceledRef.current = 0
      }

      // Cancel pairs one by one (every CANCEL_PAIR_TICKS)
      if (phase === 'canceling' && tick > CANCEL_START_TICK) {
        const ticksIntoCanceling = tick - CANCEL_START_TICK
        const expectedPairs = Math.floor(ticksIntoCanceling / CANCEL_PAIR_TICKS)

        if (expectedPairs > pairsCanceledRef.current && pairsCanceledRef.current < pairsToCancel) {
          setTiles(prev => {
            const newTiles = [...prev]
            // Find first uncanceled positive and negative
            const posIdx = newTiles.findIndex(t => t.value === 1 && !t.canceled)
            const negIdx = newTiles.findIndex(t => t.value === -1 && !t.canceled)

            if (posIdx !== -1 && negIdx !== -1) {
              newTiles[posIdx] = { ...newTiles[posIdx], canceled: true }
              newTiles[negIdx] = { ...newTiles[negIdx], canceled: true }
            }
            return newTiles
          })

          pairsCanceledRef.current++
          setCanceledPairs(pairsCanceledRef.current)
          playPop()
        }
      }

      // Phase 3: Complete
      if (tick >= COMPLETE_TICK) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, tiles.length, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Separate tiles by source for display
  const tiles1 = tiles.filter(t => t.id.startsWith('a'))
  const tiles2 = tiles.filter(t => t.id.startsWith('b'))
  const remainingTiles = tiles.filter(t => !t.canceled)

  // Operation symbol
  const opSymbol = actualOperation === 'subtraction' ? '−' : '+'

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
          <span className={num1 >= 0 ? 'text-blue-600' : 'text-red-600'}>
            {num1 >= 0 ? num1 : `(${num1})`}
          </span>
          <span className="text-gray-600 mx-2">{opSymbol}</span>
          <span className={num2 >= 0 ? 'text-blue-600' : 'text-red-600'}>
            {num2 >= 0 ? num2 : `(${num2})`}
          </span>
          <span className="text-gray-600 mx-2">=</span>
          <span className="text-primary">
            {phase === 'complete' ? result : '?'}
          </span>
        </div>
        {actualOperation === 'subtraction' && (
          <p className="text-sm text-orange-600 mt-1">
            Subtracting = Adding the opposite
          </p>
        )}
      </div>

      {/* Tiles Display */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[160px]">
        {phase === 'setup' ? (
          /* Setup: Show two groups of tiles */
          <div className="flex justify-center gap-8">
            {/* First number tiles */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-2">
                {num1 >= 0 ? num1 : `(${num1})`}
              </p>
              <div className="flex flex-wrap gap-1 justify-center max-w-[100px]">
                {tiles1.map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm',
                      tile.value === 1 ? 'bg-blue-500' : 'bg-red-500'
                    )}
                  >
                    {tile.value === 1 ? '+' : '−'}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Operation symbol */}
            <div className="flex items-center text-2xl text-gray-400">
              {opSymbol}
            </div>

            {/* Second number tiles */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-2">
                {actualOperation === 'subtraction' ? (
                  <span className="text-orange-600">
                    flip to {effectiveNum2 >= 0 ? effectiveNum2 : `(${effectiveNum2})`}
                  </span>
                ) : (
                  num2 >= 0 ? num2 : `(${num2})`
                )}
              </p>
              <div className="flex flex-wrap gap-1 justify-center max-w-[100px]">
                {tiles2.map((tile, i) => (
                  <motion.div
                    key={tile.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: tiles1.length * 0.05 + i * 0.05 }}
                    className={cn(
                      'w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm',
                      tile.value === 1 ? 'bg-blue-500' : 'bg-red-500'
                    )}
                  >
                    {tile.value === 1 ? '+' : '−'}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Combining/Canceling: Show combined tiles */
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2">
              {phase === 'canceling' ? 'Canceling zero pairs...' : 'Combined'}
            </p>
            <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
              <AnimatePresence>
                {tiles.map((tile) => (
                  <motion.div
                    key={tile.id}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                      scale: tile.canceled ? 0 : 1,
                      opacity: tile.canceled ? 0 : 1,
                      rotate: tile.canceled ? 180 : 0,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm',
                      tile.value === 1 ? 'bg-blue-500' : 'bg-red-500',
                      tile.canceled && 'ring-2 ring-yellow-400'
                    )}
                  >
                    {tile.value === 1 ? '+' : '−'}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Zero pairs counter */}
            {canceledPairs > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-lg"
              >
                <span className="text-sm text-yellow-800">
                  {canceledPairs} zero pair{canceledPairs > 1 ? 's' : ''} canceled
                </span>
                <span className="text-yellow-600">(+1 + −1 = 0)</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Result visualization */}
      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-4"
        >
          <p className="text-xs text-gray-500 mb-2">Remaining tiles:</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {remainingTiles.length === 0 ? (
              <div className="text-2xl text-gray-400">0</div>
            ) : (
              remainingTiles.map((tile) => (
                <motion.div
                  key={tile.id}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm',
                    tile.value === 1 ? 'bg-blue-500' : 'bg-red-500'
                  )}
                >
                  {tile.value === 1 ? '+' : '−'}
                </motion.div>
              ))
            )}
          </div>
          <p className="text-lg font-bold mt-2 text-primary">
            = {result}
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-xs text-gray-600">= +1</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-xs text-gray-600">= −1</span>
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
              Combine the tiles!
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Opposite tiles cancel each other out
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              {num1} {opSymbol} {num2 >= 0 ? num2 : `(${num2})`} = {result}
            </p>
          </motion.div>
        ) : phase === 'canceling' ? (
          <p className="text-lg font-medium text-orange-600">
            Finding zero pairs...
          </p>
        ) : (
          <p className="text-lg font-medium text-primary">
            Combining tiles...
          </p>
        )}
      </div>
    </div>
  )
}
