/**
 * SequenceAnimation - Visual representation of number sequences
 * Phase 1.12: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows numbers in sequence WITHOUT addition notation
 * - Used for concepts like "What comes next? 95, 96, 97, ?"
 * - Students at 5A and early 3A haven't learned addition yet
 * - CRITICAL: No "+" or "=" symbols shown
 *
 * Used for:
 * - Level 5A: number_sequences, sequence_to_30, sequence_to_40, sequence_to_50
 * - Level 3A (WS 1-70): sequence_to_100, sequence_to_120
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../core/types'

export default function SequenceAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
}: BaseAnimationProps) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [showAnswer, setShowAnswer] = useState(false)
  const { playPop, playSuccess } = useSoundEffects()

  // Extract data from problem
  // demoOperands: [startNumber, increment] e.g., [95, 3] means show 95, 96, 97, ? (increment by 1, show 3 numbers)
  const operands = problemData?.operands || [5, 3]
  const startNumber = operands[0]
  const howManyToShow = operands[1] || 3

  // Generate the sequence numbers
  const { sequenceNumbers, answer } = useMemo(() => {
    const numbers: number[] = []
    for (let i = 0; i < howManyToShow; i++) {
      numbers.push(startNumber + i)
    }
    return {
      sequenceNumbers: numbers,
      answer: startNumber + howManyToShow
    }
  }, [startNumber, howManyToShow])

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      setCurrentStep(-1)
      setShowAnswer(false)
      return
    }

    // Animate each number appearing
    const stepDelay = 800 // ms between each number

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next >= sequenceNumbers.length) {
          clearInterval(timer)
          // Show the answer after a pause
          setTimeout(() => {
            setShowAnswer(true)
            playSuccess()
            onComplete?.()
          }, 600)
          return prev
        }
        playPop()
        return next
      })
    }, stepDelay)

    // Start immediately with first number
    setCurrentStep(0)
    playPop()

    return () => clearInterval(timer)
  }, [showSolution, sequenceNumbers.length, onComplete, playPop, playSuccess])

  return (
    <div className={cn('w-full py-6', className)}>
      {/* Number Sequence Display */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4">
        {sequenceNumbers.map((num, index) => {
          const isVisible = showSolution ? index <= currentStep : true
          const isCurrent = showSolution && index === currentStep

          return (
            <div key={index} className="flex items-center">
              {/* Number box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{
                  opacity: isVisible ? 1 : 0.3,
                  scale: isCurrent ? 1.2 : 1,
                  y: isCurrent ? -5 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: showSolution ? 0 : index * 0.1,
                }}
                className={cn(
                  'relative flex items-center justify-center',
                  'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
                  'rounded-xl text-2xl sm:text-3xl md:text-4xl font-bold',
                  'transition-all',
                  isCurrent
                    ? 'bg-primary text-white shadow-lg ring-4 ring-yellow-400'
                    : isVisible
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                )}
              >
                {num}

                {/* Highlight effect for current number */}
                <AnimatePresence>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -bottom-6 text-lg"
                    >
                      👆
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Comma separator (not after last number) */}
              {index < sequenceNumbers.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0.3 }}
                  className="text-2xl sm:text-3xl text-gray-400 mx-1"
                >
                  ,
                </motion.span>
              )}
            </div>
          )
        })}

        {/* Comma before answer */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep >= sequenceNumbers.length - 1 ? 1 : 0.3 }}
          className="text-2xl sm:text-3xl text-gray-400 mx-1"
        >
          ,
        </motion.span>

        {/* Answer box (question mark or answer) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: showAnswer ? 1.15 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className={cn(
            'flex items-center justify-center',
            'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
            'rounded-xl text-2xl sm:text-3xl md:text-4xl font-bold',
            showAnswer
              ? 'bg-green-500 text-white shadow-lg ring-4 ring-green-300'
              : 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300 border-dashed'
          )}
        >
          <AnimatePresence mode="wait">
            {showAnswer ? (
              <motion.span
                key="answer"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {answer}
              </motion.span>
            ) : (
              <motion.span
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ?
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Instructional Text */}
      <div className="text-center mt-8">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              What number comes next?
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Count forward to find out!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {!showAnswer ? (
              <div>
                <p className="text-lg font-medium text-primary">
                  {sequenceNumbers.slice(0, currentStep + 1).join(', ')}...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Keep counting forward...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {sequenceNumbers.join(', ')}, {answer}!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Great counting!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
