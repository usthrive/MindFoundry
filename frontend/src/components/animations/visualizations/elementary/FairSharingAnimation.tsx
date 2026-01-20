/**
 * FairSharingAnimation - Visual representation of division as fair sharing
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Division is "sharing equally among groups"
 * - 12 ÷ 3 = "Share 12 items among 3 groups"
 * - Animate objects moving into groups one at a time (round-robin)
 * - Show remainder as leftover items
 * - SETUP MODE (default): Shows items to share and empty groups
 * - SOLUTION MODE: Animates distribution into groups
 *
 * Used for:
 * - Level C: division_intro, division_exact, division_with_remainder
 * - Concept introductions for division
 *
 * REWRITTEN: Fixed item tracking bugs where items weren't moving visually
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

// Fun emojis for sharing
const SHARING_OBJECTS = ['🍎', '🍪', '🌟', '🎈', '💎', '🧁', '🍬', '🎁', '🌸', '🦋']

// Item state for tracking distribution
interface ItemState {
  id: number
  location: 'source' | 'group' | 'remainder'
  groupIndex?: number
}

export default function FairSharingAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
}: BaseAnimationProps) {
  // Track each item's state individually
  const [items, setItems] = useState<ItemState[]>([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [phase, setPhase] = useState<'setup' | 'distributing' | 'complete'>('setup')
  const [distributedCount, setDistributedCount] = useState(0)

  const { playPop, playSuccess } = useSoundEffects()

  // Refs to avoid stale closures in interval
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasStartedRef = useRef(false)

  // Extract operands: [dividend, divisor] e.g., [12, 3] = 12 ÷ 3
  const operands = problemData?.operands || [12, 3]
  const dividend = operands[0] // Total items to share
  const divisor = operands[1] // Number of groups
  const quotient = Math.floor(dividend / divisor)
  const remainder = dividend % divisor
  const itemsToDistribute = dividend - remainder // Items that can be evenly distributed

  // Pick consistent emoji
  const emoji = useMemo(() => {
    const index = (dividend + divisor) % SHARING_OBJECTS.length
    return SHARING_OBJECTS[index]
  }, [dividend, divisor])

  // Educational scripts for each phase
  const scripts = {
    setup: `Let's share ${dividend} ${emoji} equally among ${divisor} groups. How many will each group get?`,
    distributing: `We give one ${emoji} to each group, then go around again. Watch as we share fairly!`,
    complete: remainder > 0
      ? `Each group gets ${quotient} ${emoji}. We have ${remainder} left over - that's the remainder!`
      : `Each group gets ${quotient} ${emoji}. ${dividend} ÷ ${divisor} = ${quotient}!`,
  }

  // Initialize items when problem changes
  useEffect(() => {
    const initialItems: ItemState[] = Array.from({ length: dividend }, (_, i) => ({
      id: i,
      location: 'source' as const,
    }))
    setItems(initialItems)
    setCurrentGroupIndex(0)
    setDistributedCount(0)
    setPhase('setup')
    hasStartedRef.current = false

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [dividend, divisor])

  // Reset when showSolution becomes false
  useEffect(() => {
    if (!showSolution) {
      const initialItems: ItemState[] = Array.from({ length: dividend }, (_, i) => ({
        id: i,
        location: 'source' as const,
      }))
      setItems(initialItems)
      setCurrentGroupIndex(0)
      setDistributedCount(0)
      setPhase('setup')
      hasStartedRef.current = false

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [showSolution, dividend, divisor])

  // Distribute one item - memoized to prevent recreation
  const distributeOneItem = useCallback((itemIndex: number, groupIndex: number) => {
    setItems(prev => prev.map(item =>
      item.id === itemIndex
        ? { ...item, location: 'group' as const, groupIndex }
        : item
    ))
    playPop()
  }, [playPop])

  // Mark remaining items
  const markRemainder = useCallback(() => {
    setItems(prev => prev.map(item =>
      item.location === 'source'
        ? { ...item, location: 'remainder' as const }
        : item
    ))
  }, [])

  // Animation effect for solution mode - NO phase in dependencies
  useEffect(() => {
    if (!showSolution) return
    if (hasStartedRef.current) return // Prevent re-running

    hasStartedRef.current = true
    setPhase('distributing')

    let currentItem = 0
    let currentGroup = 0

    // 500ms interval for pedagogically appropriate pacing
    timerRef.current = setInterval(() => {
      if (currentItem >= itemsToDistribute) {
        // All distributable items are done
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        // Mark remainder items
        if (remainder > 0) {
          markRemainder()
        }

        // Complete after a short pause
        setTimeout(() => {
          setPhase('complete')
          playSuccess()
          onComplete?.()
        }, 500)
        return
      }

      // Distribute the current item to current group
      distributeOneItem(currentItem, currentGroup)
      setDistributedCount(currentItem + 1)
      setCurrentGroupIndex(currentGroup)

      // Move to next item and next group (round-robin)
      currentItem++
      currentGroup = (currentGroup + 1) % divisor
    }, 500)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [showSolution, itemsToDistribute, divisor, remainder, distributeOneItem, markRemainder, playSuccess, onComplete])

  // Compute derived values for rendering
  const sourceItems = items.filter(item => item.location === 'source')
  const remainderItems = items.filter(item => item.location === 'remainder')
  const getGroupItems = (groupIndex: number) =>
    items.filter(item => item.location === 'group' && item.groupIndex === groupIndex)

  // Calculate sizes based on numbers
  const itemSize = useMemo(() => {
    if (quotient <= 5) return 'text-2xl sm:text-3xl'
    if (quotient <= 10) return 'text-xl sm:text-2xl'
    return 'text-lg sm:text-xl'
  }, [quotient])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Display */}
      <div className="text-center mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
          {dividend} ÷ {divisor} = {phase === 'complete' ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-600"
            >
              {quotient}{remainder > 0 && <span className="text-orange-500"> R{remainder}</span>}
            </motion.span>
          ) : (
            <span className="text-primary">?</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Share {dividend} {emoji} among {divisor} groups
        </p>
      </div>

      {/* Educational Script Display */}
      {showSolution && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-3 mb-4 text-center max-w-sm mx-auto"
        >
          <p className="text-sm text-blue-800">
            {scripts[phase]}
          </p>
        </motion.div>
      )}

      {/* Items to Distribute (shown at top) */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 text-center mb-2">
          {phase === 'setup'
            ? 'Items to share:'
            : phase === 'distributing'
              ? `Distributing... (${distributedCount}/${itemsToDistribute})`
              : 'All distributed!'}
        </p>
        <div className="flex flex-wrap justify-center gap-1 px-4 min-h-[3rem]">
          <AnimatePresence mode="popLayout">
            {sourceItems.map((item) => (
              <motion.span
                key={`source-${item.id}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  scale: 0.5,
                  opacity: 0,
                  y: 50,
                  transition: { duration: 0.3 }
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(itemSize)}
              >
                {emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Groups */}
      <div
        className={cn(
          'grid gap-3 sm:gap-4 px-4',
          divisor <= 3 ? 'grid-cols-3' : divisor <= 4 ? 'grid-cols-4' : 'grid-cols-5'
        )}
      >
        {Array.from({ length: divisor }, (_, groupIndex) => {
          const groupItems = getGroupItems(groupIndex)
          const isCurrentGroup = showSolution && currentGroupIndex === groupIndex && phase === 'distributing'

          return (
            <motion.div
              key={groupIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isCurrentGroup ? 1.05 : 1,
              }}
              transition={{ delay: groupIndex * 0.1 }}
              className={cn(
                'flex flex-col items-center p-2 sm:p-3 rounded-xl border-2',
                'min-h-[80px] sm:min-h-[100px]',
                isCurrentGroup
                  ? 'bg-primary/10 border-primary ring-2 ring-yellow-400'
                  : 'bg-gray-50 border-gray-200'
              )}
            >
              {/* Group Label */}
              <div className={cn(
                'text-xs font-medium mb-1 px-2 py-0.5 rounded',
                isCurrentGroup ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              )}>
                Group {groupIndex + 1}
              </div>

              {/* Items in Group */}
              <div className="flex flex-wrap justify-center gap-0.5 flex-1 items-center">
                <AnimatePresence>
                  {groupItems.map((item) => (
                    <motion.span
                      key={`group-${item.id}`}
                      initial={{ scale: 0, y: -30, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: 0.1 // Slight delay to show item "arriving"
                      }}
                      className={cn(
                        quotient <= 5 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                      )}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Count */}
              <div className="text-sm font-bold text-gray-700 mt-1">
                {groupItems.length}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Remainder */}
      {remainder > 0 && phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg border-2 border-orange-300">
            <span className="text-sm font-medium text-orange-700">Remainder:</span>
            <div className="flex gap-1">
              <AnimatePresence>
                {remainderItems.map((item) => (
                  <motion.span
                    key={`remainder-${item.id}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <span className="text-lg font-bold text-orange-600">= {remainder}</span>
          </div>
        </motion.div>
      )}

      {/* Instructions / Status */}
      <div className="text-center mt-6">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              How many {emoji} in each group?
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Share {dividend} items equally among {divisor} groups
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {phase === 'distributing' && (
              <div>
                <p className="text-lg font-medium text-primary">
                  Sharing one at a time...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Give one to each group, then repeat
                </p>
              </div>
            )}
            {phase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  Each group gets {quotient}!
                  {remainder > 0 && (
                    <span className="text-orange-500"> ({remainder} left over)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {dividend} ÷ {divisor} = {quotient}{remainder > 0 ? ` R${remainder}` : ''}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
