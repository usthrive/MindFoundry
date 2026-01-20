/**
 * AdvancedDifferentiationAnimation - Visual representation of advanced differentiation techniques
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows differentiation of trig, log, and exponential functions
 * - Demonstrates chain rule application
 * - Shows step-by-step derivative calculation
 * - SETUP MODE (default): Shows function
 * - SOLUTION MODE: Animates derivative steps
 *
 * Used for:
 * - Level N: trig_differentiation, log_differentiation, exponential_differentiation, higher_order_derivatives
 * - Concept introductions for advanced derivatives
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface AdvancedDifferentiationAnimationProps extends BaseAnimationProps {
  funcType?: 'trig' | 'log' | 'exp' | 'chain'
}

type Phase =
  | 'setup'
  | 'real_world'
  | 'why_useful'
  | 'identify'
  | 'outer_inner'
  | 'rule'
  | 'step_by_step'
  | 'apply_outer'
  | 'apply_inner'
  | 'multiply'
  | 'simplify'
  | 'complete'

export default function AdvancedDifferentiationAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  funcType = 'trig',
}: AdvancedDifferentiationAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Get function details based on type
  const getFunctionDetails = () => {
    switch (funcType) {
      case 'trig':
        return {
          f: 'sin(2x)',
          steps: [
            { label: 'Identify', content: 'f(x) = sin(u) where u = 2x' },
            { label: 'Chain Rule', content: 'd/dx[sin(u)] = cos(u) · du/dx' },
            { label: 'Apply', content: "f'(x) = cos(2x) · d/dx[2x]" },
            { label: 'Simplify', content: "f'(x) = cos(2x) · 2 = 2cos(2x)" },
          ],
          result: "2cos(2x)",
          color: 'blue',
        }
      case 'log':
        return {
          f: 'ln(x²)',
          steps: [
            { label: 'Identify', content: 'f(x) = ln(u) where u = x²' },
            { label: 'Chain Rule', content: 'd/dx[ln(u)] = (1/u) · du/dx' },
            { label: 'Apply', content: "f'(x) = (1/x²) · d/dx[x²]" },
            { label: 'Simplify', content: "f'(x) = (1/x²) · 2x = 2/x" },
          ],
          result: '2/x',
          color: 'green',
        }
      case 'exp':
        return {
          f: 'e^(3x)',
          steps: [
            { label: 'Identify', content: 'f(x) = e^u where u = 3x' },
            { label: 'Chain Rule', content: 'd/dx[e^u] = e^u · du/dx' },
            { label: 'Apply', content: "f'(x) = e^(3x) · d/dx[3x]" },
            { label: 'Simplify', content: "f'(x) = e^(3x) · 3 = 3e^(3x)" },
          ],
          result: '3e^(3x)',
          color: 'purple',
        }
      case 'chain':
        return {
          f: '(x² + 1)³',
          steps: [
            { label: 'Identify', content: 'f(x) = u³ where u = x² + 1' },
            { label: 'Power & Chain', content: 'd/dx[u³] = 3u² · du/dx' },
            { label: 'Apply', content: "f'(x) = 3(x² + 1)² · d/dx[x² + 1]" },
            { label: 'Simplify', content: "f'(x) = 3(x² + 1)² · 2x = 6x(x² + 1)²" },
          ],
          result: '6x(x² + 1)²',
          color: 'orange',
        }
      default:
        return getFunctionDetails()
    }
  }

  const funcDetails = getFunctionDetails()
  const progressPhases = ['identify', 'outer_inner', 'rule', 'apply_outer', 'apply_inner', 'multiply', 'simplify']
  const currentStepIndex = progressPhases.indexOf(phase)

  // Animation effect for solution mode - interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 20 // 2 seconds per phase

    const phases: Phase[] = [
      'setup', 'real_world', 'why_useful', 'identify', 'outer_inner',
      'rule', 'step_by_step', 'apply_outer', 'apply_inner', 'multiply',
      'simplify', 'complete'
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
        if (newPhase === 'identify' || newPhase === 'apply_outer') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Color classes based on function type
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500' },
  }[funcDetails.color] ?? { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Function Display */}
      <div className={cn('rounded-lg p-4 mb-4 text-center', colorClasses.bg)}>
        <div className="text-sm text-gray-500 mb-1">Differentiate</div>
        <div className={cn('text-2xl font-bold font-mono', colorClasses.text)}>
          f(x) = {funcDetails.f}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-4 px-2">
        {funcDetails.steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col items-center',
              i <= currentStepIndex && phase !== 'setup' && phase !== 'complete'
                ? 'opacity-100'
                : 'opacity-40'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1',
                i < currentStepIndex || (i === currentStepIndex && phase !== 'setup')
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {i + 1}
            </div>
            <div className="text-xs text-center">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[180px]">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-gray-700 mb-2">Chain Rule</div>
              <div className="text-sm text-gray-600">
                <p>For composite functions f(g(x)):</p>
                <p className="font-mono mt-2 text-lg">[f(g(x))]' = f'(g(x)) · g'(x)</p>
              </div>
            </motion.div>
          )}

          {phase === 'real_world' && (
            <motion.div
              key="real_world"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-yellow-700 mb-3">Real-World Chain Rule</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center shadow-sm">
                  <div className="text-2xl mb-1">🌡️</div>
                  <div className="font-medium">Temperature</div>
                  <div className="text-xs text-gray-500">Rate depends on surrounding temp</div>
                </div>
                <div className="bg-white p-2 rounded text-center shadow-sm">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="font-medium">Population</div>
                  <div className="text-xs text-gray-500">Growth rate depends on size</div>
                </div>
                <div className="bg-white p-2 rounded text-center shadow-sm">
                  <div className="text-2xl mb-1">🎸</div>
                  <div className="font-medium">Sound Waves</div>
                  <div className="text-xs text-gray-500">Frequency through mediums</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'why_useful' && (
            <motion.div
              key="why_useful"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-blue-700 mb-3">Why Chain Rule is Essential</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto text-sm space-y-2">
                <p>🔗 <strong>Composite functions</strong> appear everywhere in real problems!</p>
                <p>📐 Without chain rule, we can't differentiate: sin(x²), e^(2x), √(x³+1)</p>
                <p className="text-blue-600 font-medium">🚀 Chain rule breaks complex derivatives into simpler pieces</p>
              </div>
            </motion.div>
          )}

          {phase === 'identify' && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 1: Identify the Composite Function
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcDetails.steps[0].content}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'outer_inner' && (
            <motion.div
              key="outer_inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-700 mb-3">Identify Outer & Inner</div>
              <div className="flex justify-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <div className="text-blue-600 font-bold text-sm">Outer Function</div>
                  <div className="font-mono text-lg mt-1">
                    {funcType === 'trig' && 'f(u) = sin(u)'}
                    {funcType === 'log' && 'f(u) = ln(u)'}
                    {funcType === 'exp' && 'f(u) = eᵘ'}
                    {funcType === 'chain' && 'f(u) = u³'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">What you do LAST</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <div className="text-green-600 font-bold text-sm">Inner Function</div>
                  <div className="font-mono text-lg mt-1">
                    {funcType === 'trig' && 'g(x) = 2x'}
                    {funcType === 'log' && 'g(x) = x²'}
                    {funcType === 'exp' && 'g(x) = 3x'}
                    {funcType === 'chain' && 'g(x) = x² + 1'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">What's INSIDE</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'rule' && (
            <motion.div
              key="rule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 2: Chain Rule Formula
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcDetails.steps[1].content}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'step_by_step' && (
            <motion.div
              key="step_by_step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-orange-700 mb-3">Breaking Down the Formula</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-blue-100 px-2 py-1 rounded">f'(g(x))</span>
                    <span>×</span>
                    <span className="bg-green-100 px-2 py-1 rounded">g'(x)</span>
                  </div>
                  <div className="text-gray-600 text-xs mt-2">
                    Derivative of outer (keeping inner) × Derivative of inner
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'apply_outer' && (
            <motion.div
              key="apply_outer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-blue-700 mb-3">
                Step 3a: Derivative of Outer Function
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcType === 'trig' && "d/du[sin(u)] = cos(u) → cos(2x)"}
                  {funcType === 'log' && "d/du[ln(u)] = 1/u → 1/x²"}
                  {funcType === 'exp' && "d/du[eᵘ] = eᵘ → e^(3x)"}
                  {funcType === 'chain' && "d/du[u³] = 3u² → 3(x²+1)²"}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'apply_inner' && (
            <motion.div
              key="apply_inner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-700 mb-3">
                Step 3b: Derivative of Inner Function
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcType === 'trig' && "d/dx[2x] = 2"}
                  {funcType === 'log' && "d/dx[x²] = 2x"}
                  {funcType === 'exp' && "d/dx[3x] = 3"}
                  {funcType === 'chain' && "d/dx[x²+1] = 2x"}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'multiply' && (
            <motion.div
              key="multiply"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-700 mb-3">Step 4: Multiply Together</div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcDetails.steps[2].content}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'simplify' && (
            <motion.div
              key="simplify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 5: Simplify
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-lg">
                  {funcDetails.steps[3].content}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-3">Result</div>
              <div className="bg-green-100 p-4 rounded-lg max-w-md mx-auto">
                <div className="font-mono text-xl text-green-700">
                  f'(x) = {funcDetails.result}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reference Rules */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-bold text-blue-700">Trig Derivatives</div>
          <div className="font-mono text-blue-600">d/dx[sin x] = cos x</div>
          <div className="font-mono text-blue-600">d/dx[cos x] = -sin x</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-bold text-green-700">Exp/Log Derivatives</div>
          <div className="font-mono text-green-600">d/dx[eˣ] = eˣ</div>
          <div className="font-mono text-green-600">d/dx[ln x] = 1/x</div>
        </div>
      </div>

      {/* Chain Rule Reminder */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-yellow-800">
          <strong>Remember:</strong> "Derivative of outside × Derivative of inside"
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find f'(x)</p>
            <p className="text-sm mt-1 text-gray-500">Use chain rule if needed</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className={cn('text-xl font-bold', colorClasses.text)}>
              f'(x) = {funcDetails.result}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing chain rule...'}
            {phase === 'real_world' && 'Exploring real-world applications...'}
            {phase === 'why_useful' && 'Understanding why chain rule matters...'}
            {phase === 'identify' && 'Identifying composite function...'}
            {phase === 'outer_inner' && 'Separating outer and inner functions...'}
            {phase === 'rule' && 'Applying chain rule formula...'}
            {phase === 'step_by_step' && 'Breaking down the formula...'}
            {phase === 'apply_outer' && 'Differentiating outer function...'}
            {phase === 'apply_inner' && 'Differentiating inner function...'}
            {phase === 'multiply' && 'Multiplying derivatives together...'}
            {phase === 'simplify' && 'Simplifying the result...'}
          </p>
        )}
      </div>
    </div>
  )
}
