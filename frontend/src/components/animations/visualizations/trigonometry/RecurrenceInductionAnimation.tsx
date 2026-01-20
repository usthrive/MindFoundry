/**
 * RecurrenceInductionAnimation - Visual representation of mathematical induction
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows base case verification
 * - Demonstrates inductive hypothesis and step
 * - Visualizes the "domino effect"
 * - SETUP MODE (default): Shows proposition
 * - SOLUTION MODE: Animates proof steps
 *
 * Used for:
 * - Level N: recurrence_relations, mathematical_induction
 * - Concept introductions for proof by induction
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface RecurrenceInductionAnimationProps extends BaseAnimationProps {}

export default function RecurrenceInductionAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: RecurrenceInductionAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'
    | 'domino_analogy'
    | 'base'
    | 'base_verify'
    | 'hypothesis'
    | 'step'
    | 'conclusion'
    | 'complete'
  >('setup')
  const [fallenDominoes, setFallenDominoes] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const dominoIndexRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Example: Prove 1 + 2 + 3 + ... + n = n(n+1)/2
  // We'll verify for n=1, n=2, n=3 and show inductive step

  // Animation effect for solution mode - converted to interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setFallenDominoes(0)
      tickRef.current = 0
      dominoIndexRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 30 // 3 seconds per phase (longer for understanding)

    // 8 phases, ~24 seconds total
    const phases: (typeof phase)[] = [
      'setup', 'domino_analogy', 'base', 'base_verify',
      'hypothesis', 'step', 'conclusion', 'complete'
    ]

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const phaseIndex = Math.floor(tickRef.current / PHASE_DURATION)

      // Handle domino animation in conclusion phase
      if (phase === 'conclusion') {
        if (tickRef.current % 5 === 0 && dominoIndexRef.current < 6) {
          dominoIndexRef.current++
          setFallenDominoes(dominoIndexRef.current)
          playPop()
        }
      }

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
        if (newPhase === 'base') {
          setFallenDominoes(1)
          playWhoosh()
        } else if (newPhase === 'conclusion') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Domino visualization
  const DominoRow = () => (
    <div className="flex justify-center gap-1 my-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <motion.div
          key={i}
          className={cn(
            'w-6 h-12 rounded-sm transition-all origin-bottom',
            i <= fallenDominoes ? 'bg-green-500' : 'bg-gray-300'
          )}
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: i <= fallenDominoes ? 60 : 0,
            backgroundColor: i <= fallenDominoes ? '#10b981' : '#d1d5db',
          }}
          transition={{ delay: (i - 1) * 0.1 }}
          style={{ transformStyle: 'preserve-3d' }}
        />
      ))}
      <span className="text-gray-400 self-center">...</span>
    </div>
  )

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Proposition */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
        <div className="text-sm text-blue-600 mb-1">Prove by Induction</div>
        <div className="font-mono text-lg text-blue-800">
          1 + 2 + 3 + ... + n = n(n+1)/2
        </div>
        <div className="text-xs text-gray-500 mt-1">for all positive integers n</div>
      </div>

      {/* Domino Effect Visualization */}
      {(phase === 'conclusion' || phase === 'complete') && <DominoRow />}

      {/* Proof Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[200px]">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-gray-700 mb-4">Mathematical Induction</div>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Step 1:</strong> Prove base case (n = 1)</p>
                <p><strong>Step 2:</strong> Assume true for n = k (hypothesis)</p>
                <p><strong>Step 3:</strong> Prove true for n = k + 1</p>
                <p><strong>Conclusion:</strong> True for all n ≥ 1</p>
              </div>
            </motion.div>
          )}

          {phase === 'domino_analogy' && (
            <motion.div
              key="domino_analogy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-yellow-700 mb-3">The Domino Analogy</div>
              <div className="flex justify-center gap-2 my-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-4 h-8 bg-gray-400 rounded-sm" />
                ))}
                <span className="text-gray-400 self-center">...</span>
              </div>
              <div className="text-sm space-y-1 bg-yellow-50 p-3 rounded-lg max-w-sm mx-auto">
                <p>🎯 <strong>Base case:</strong> Push the first domino (prove n=1 works)</p>
                <p>⚡ <strong>Inductive step:</strong> If any domino falls, the next one falls too</p>
                <p>✨ <strong>Result:</strong> ALL dominoes will fall!</p>
              </div>
            </motion.div>
          )}

          {phase === 'base' && (
            <motion.div
              key="base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Step 1: Base Case (n = 1)</div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="space-y-2 font-mono text-sm">
                  <div>Left side: 1 = <span className="text-green-600 font-bold">1</span></div>
                  <div>Right side: 1(1+1)/2 = 2/2 = <span className="text-green-600 font-bold">1</span></div>
                  <div className="text-green-600 font-bold text-lg mt-2">✓ Base case verified!</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'base_verify' && (
            <motion.div
              key="base_verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-teal-600 mb-2">Why Base Case Matters</div>
              <div className="bg-teal-50 p-4 rounded-lg max-w-sm mx-auto">
                <div className="space-y-2 text-sm">
                  <p>The base case is like <strong>pushing the first domino</strong>.</p>
                  <p className="mt-2">Without it, we have no starting point!</p>
                  <p className="mt-2 text-teal-600 font-medium">We proved n=1 works ✓</p>
                  <p className="text-xs text-gray-500 mt-2">This is the "first domino falls" part.</p>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'hypothesis' && (
            <motion.div
              key="hypothesis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-600 mb-2">Step 2: Inductive Hypothesis</div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">Assume the formula holds for some integer k:</div>
                  <div className="font-mono text-purple-700 text-lg py-2">
                    1 + 2 + ... + k = k(k+1)/2
                  </div>
                  <div className="text-gray-500 text-xs">This is our assumption</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'step' && (
            <motion.div
              key="step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-orange-600 mb-2">Step 3: Inductive Step</div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-2 text-sm font-mono">
                  <div>Prove for n = k + 1:</div>
                  <div className="text-gray-600">1 + 2 + ... + k + (k+1)</div>
                  <div className="text-purple-600">= [k(k+1)/2] + (k+1)</div>
                  <div className="text-gray-600">= (k+1)[k/2 + 1]</div>
                  <div className="text-gray-600">= (k+1)(k+2)/2</div>
                  <div className="text-orange-600 font-bold">= (k+1)((k+1)+1)/2 ✓</div>
                </div>
              </div>
            </motion.div>
          )}

          {(phase === 'conclusion' || phase === 'complete') && (
            <motion.div
              key="conclusion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Conclusion</div>
              <div className="bg-green-100 p-4 rounded-lg max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="text-green-800">
                    By the principle of mathematical induction:
                  </div>
                  <div className="font-mono text-green-700 text-lg font-bold">
                    1 + 2 + 3 + ... + n = n(n+1)/2
                  </div>
                  <div className="text-green-600">
                    is true for all positive integers n
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Induction Principle Reference */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-yellow-800">
          <strong>Domino Effect:</strong> If the first domino falls (base case) and each domino knocks the next (inductive step), then all dominoes fall!
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {['Intro', 'Base', 'Assume', 'Prove', 'QED'].map((step, i) => {
          const stepPhases = ['domino_analogy', 'base_verify', 'hypothesis', 'step', 'conclusion']
          const currentStepIndex = stepPhases.indexOf(phase)
          // Also consider phases that come after but aren't in the list
          const phaseOrder = ['setup', 'domino_analogy', 'base', 'base_verify', 'hypothesis', 'step', 'conclusion', 'complete']
          const currentPhaseOrder = phaseOrder.indexOf(phase)
          const stepPhaseOrder = phaseOrder.indexOf(stepPhases[i])
          const isComplete = currentPhaseOrder >= stepPhaseOrder && phase !== 'setup'
          return (
            <div
              key={step}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all',
                isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              )}
            >
              {step}
            </div>
          )
        })}
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Prove by induction</p>
            <p className="text-sm mt-1 text-gray-500">Follow the three steps</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              Q.E.D. - Proof Complete! ∎
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing mathematical induction...'}
            {phase === 'domino_analogy' && 'Understanding the domino analogy...'}
            {phase === 'base' && 'Verifying base case...'}
            {phase === 'base_verify' && 'Understanding why base case matters...'}
            {phase === 'hypothesis' && 'Setting up hypothesis...'}
            {phase === 'step' && 'Proving inductive step...'}
            {phase === 'conclusion' && 'Drawing conclusion...'}
          </p>
        )}
      </div>
    </div>
  )
}
