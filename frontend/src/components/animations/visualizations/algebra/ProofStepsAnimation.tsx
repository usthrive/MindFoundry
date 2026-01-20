/**
 * ProofStepsAnimation - Visual representation of mathematical proofs
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows step-by-step logical proof
 * - Statement → Reason format
 * - Highlights deduction chain
 * - SETUP MODE (default): Shows theorem/goal
 * - SOLUTION MODE: Animates each proof step
 *
 * Used for:
 * - Level J: proofs
 * - Concept introductions for mathematical reasoning
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface ProofStepsAnimationProps extends BaseAnimationProps {
  proofType?: 'algebraic' | 'geometric' | 'induction'
}

interface ProofStep {
  statement: string
  reason: string
}

export default function ProofStepsAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
  proofType = 'algebraic',
}: ProofStepsAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'proving' | 'complete'>('setup')
  const [currentStep, setCurrentStep] = useState(-1)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Example proof: Show that if a = b, then a + c = b + c
  // This demonstrates the addition property of equality
  const theorem = 'If a = b, then a + c = b + c'
  const given = 'a = b'
  const toProve = 'a + c = b + c'

  const proofSteps: ProofStep[] = [
    {
      statement: 'a = b',
      reason: 'Given',
    },
    {
      statement: 'a + c = a + c',
      reason: 'Reflexive Property',
    },
    {
      statement: 'a + c = b + c',
      reason: 'Substitution (a = b)',
    },
    {
      statement: '∴ If a = b, then a + c = b + c',
      reason: 'Q.E.D.',
    },
  ]

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setCurrentStep(-1)
      return
    }

    // Start proving
    const startTimer = setTimeout(() => {
      setPhase('proving')
      playWhoosh()
    }, 800)

    // Animate each step
    const stepTimers: NodeJS.Timeout[] = []
    proofSteps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)
        playPop()
      }, 1500 + index * 1500)
      stepTimers.push(timer)
    })

    // Complete
    const completeTimer = setTimeout(() => {
      setPhase('complete')
      playSuccess()
      onComplete?.()
    }, 1500 + proofSteps.length * 1500 + 500)

    return () => {
      clearTimeout(startTimer)
      stepTimers.forEach(t => clearTimeout(t))
      clearTimeout(completeTimer)
    }
  }, [showSolution, onComplete, playPop, playSuccess, playWhoosh, proofSteps.length])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Theorem Display */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500 mb-1">Prove:</div>
        <div className="text-xl sm:text-2xl font-bold text-gray-800">
          {theorem}
        </div>
      </div>

      {/* Proof Structure */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[220px]">
        {phase === 'setup' ? (
          /* Setup: Show given and to prove */
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">Proof Structure</div>
            <div className="w-full max-w-sm space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600 font-semibold">Given:</div>
                <div className="font-mono text-lg">{given}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600 font-semibold">To Prove:</div>
                <div className="font-mono text-lg">{toProve}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Proof steps */
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-500 border-b pb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Statement</div>
              <div className="col-span-5">Reason</div>
            </div>
            <AnimatePresence>
              {proofSteps.slice(0, currentStep + 1).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'grid grid-cols-12 gap-2 p-2 rounded-lg transition-all',
                    i === currentStep ? 'bg-primary/10 shadow-sm' : 'bg-white',
                    i === proofSteps.length - 1 && 'bg-green-50'
                  )}
                >
                  <div className="col-span-1 font-mono text-gray-500">{i + 1}.</div>
                  <div className={cn(
                    'col-span-6 font-mono',
                    i === proofSteps.length - 1 ? 'text-green-700 font-bold' : 'text-gray-800'
                  )}>
                    {step.statement}
                  </div>
                  <div className={cn(
                    'col-span-5 text-sm',
                    i === currentStep ? 'text-primary font-medium' : 'text-gray-500'
                  )}>
                    {step.reason}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Proof Methods Reference */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-blue-800 text-center">
          <strong>Two-Column Proof:</strong> Each statement must be justified by a reason
        </div>
      </div>

      {/* Common Reasons Reference */}
      {phase === 'setup' && (
        <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded">Given</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Definition</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Substitution</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Reflexive</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Symmetric</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Transitive</span>
        </div>
      )}

      {/* Instructions / Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Write a two-column proof
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Start from given, work toward conclusion
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl font-bold text-green-600">
              Q.E.D. - Proof Complete!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            Step {currentStep + 1}: {proofSteps[currentStep]?.reason}
          </p>
        )}
      </div>
    </div>
  )
}
