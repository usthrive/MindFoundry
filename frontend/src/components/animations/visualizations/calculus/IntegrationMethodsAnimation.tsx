/**
 * IntegrationMethodsAnimation - Visual representation of integration techniques
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows u-substitution method
 * - Demonstrates integration by parts
 * - Step-by-step transformation
 * - SETUP MODE (default): Shows integral
 * - SOLUTION MODE: Animates technique steps
 *
 * Used for:
 * - Level O: integration_by_substitution, integration_by_parts, advanced_definite_integrals, area_between_curves
 * - Concept introductions for integration techniques
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface IntegrationMethodsAnimationProps extends BaseAnimationProps {
  method?: 'substitution' | 'parts'
}

type Phase =
  | 'setup'
  | 'why_useful'
  | 'identify'
  | 'choose_u'
  | 'find_du'
  | 'spot_match'
  | 'substitute'
  | 'integrate'
  | 'back_substitute'
  | 'verify'
  | 'summary'
  | 'complete'

export default function IntegrationMethodsAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  method = 'substitution',
}: IntegrationMethodsAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Get problem details based on method
  const getProblemDetails = () => {
    if (method === 'substitution') {
      // ∫ 2x·e^(x²) dx, let u = x², du = 2x dx
      return {
        integral: '∫ 2x·e^(x²) dx',
        steps: [
          { phase: 'identify', title: 'Identify the Pattern', content: 'Look for f\'(x)·g(f(x)) form' },
          { phase: 'setup_method', title: 'Set Up Substitution', items: ['Let u = x²', 'du = 2x dx', 'du/2x = dx'] },
          { phase: 'transform', title: 'Transform Integral', content: '∫ 2x·e^(x²) dx = ∫ e^u du' },
          { phase: 'integrate', title: 'Integrate', content: '∫ e^u du = e^u + C' },
          { phase: 'back_substitute', title: 'Back-Substitute', content: 'e^u + C = e^(x²) + C' },
        ],
        result: 'e^(x²) + C',
        color: 'blue',
      }
    } else {
      // ∫ x·e^x dx, using integration by parts
      return {
        integral: '∫ x·e^x dx',
        steps: [
          { phase: 'identify', title: 'Identify u and dv', content: 'Use LIATE rule for choosing u' },
          { phase: 'setup_method', title: 'Set Up Parts', items: ['u = x, dv = e^x dx', 'du = dx, v = e^x', '∫ u dv = uv - ∫ v du'] },
          { phase: 'transform', title: 'Apply Formula', content: '∫ x·e^x dx = x·e^x - ∫ e^x dx' },
          { phase: 'integrate', title: 'Integrate Remaining', content: '= x·e^x - e^x + C' },
          { phase: 'back_substitute', title: 'Simplify', content: '= e^x(x - 1) + C' },
        ],
        result: 'e^x(x - 1) + C',
        color: 'purple',
      }
    }
  }

  const problem = getProblemDetails()

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
      'setup', 'why_useful', 'identify', 'choose_u', 'find_du', 'spot_match',
      'substitute', 'integrate', 'back_substitute', 'verify', 'summary', 'complete'
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
        if (newPhase === 'substitute' || newPhase === 'integrate') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', light: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', light: 'bg-purple-100' },
  }[problem.color] ?? { bg: 'bg-blue-50', text: 'text-blue-700', light: 'bg-blue-100' }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Method Title */}
      <div className="text-center mb-2">
        <div className="text-sm text-gray-500">
          {method === 'substitution' ? 'U-Substitution' : 'Integration by Parts'}
        </div>
      </div>

      {/* Integral Display */}
      <div className={cn('rounded-lg p-4 mb-4 text-center', colorClasses.bg)}>
        <div className="text-sm text-gray-500 mb-1">Evaluate</div>
        <div className={cn('text-2xl font-bold font-mono', colorClasses.text)}>
          {problem.integral}
        </div>
      </div>

      {/* Formula Reference */}
      <div className={cn('rounded-lg p-3 mb-4 text-center text-sm', colorClasses.light)}>
        {method === 'substitution' ? (
          <div className="font-mono">
            ∫ f(g(x))·g'(x) dx = ∫ f(u) du where u = g(x)
          </div>
        ) : (
          <div className="font-mono">
            ∫ u dv = uv - ∫ v du
          </div>
        )}
      </div>

      {/* Step Display */}
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
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {method === 'substitution' ? 'U-Substitution' : 'Integration by Parts'}
              </div>
              <div className="text-sm text-gray-600">
                {method === 'substitution' ? (
                  <p>Used when you can identify an inner function and its derivative</p>
                ) : (
                  <p>Used when integrating a product of functions</p>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'why_useful' && (
            <motion.div
              key="why_useful"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Why U-Substitution Works
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg max-w-md mx-auto">
                <div className="text-sm space-y-2">
                  <p className="font-medium text-yellow-800">It's the Chain Rule in Reverse!</p>
                  <div className="bg-white p-3 rounded mt-2">
                    <p className="text-gray-600 text-xs mb-2">Chain Rule (differentiation):</p>
                    <p className="font-mono">d/dx[f(g(x))] = f'(g(x)) · g'(x)</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600 text-xs mb-2">U-Substitution (integration):</p>
                    <p className="font-mono">∫ f'(g(x)) · g'(x) dx = f(g(x)) + C</p>
                  </div>
                </div>
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
                Step 1: Identify the Pattern
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-xl mb-3">{problem.integral}</div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Look for: <span className="font-mono text-purple-600">f(g(x)) · g'(x)</span></p>
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <p className="text-blue-700">Here we see <span className="font-bold">e^(x²)</span> and <span className="font-bold">2x</span></p>
                    <p className="text-xs text-gray-500 mt-1">The derivative of x² is 2x!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'choose_u' && (
            <motion.div
              key="choose_u"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 2: Choose u (the Inner Function)
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-xl mb-3">∫ 2x · <span className="bg-purple-200 px-1 rounded">e^(x²)</span> dx</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-100 p-3 rounded-lg mt-2"
                >
                  <p className="font-bold text-purple-700 text-lg">Let u = x²</p>
                  <p className="text-xs text-gray-600 mt-1">
                    We choose x² because its derivative (2x) appears in the integral!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {phase === 'find_du' && (
            <motion.div
              key="find_du"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 3: Find du
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-3 font-mono text-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span className="text-gray-500">If</span> u = x²
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <span className="text-gray-500">Then</span> du/dx = 2x
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-green-100 p-2 rounded"
                  >
                    <span className="text-green-700 font-bold">du = 2x dx</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'spot_match' && (
            <motion.div
              key="spot_match"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 4: Spot the Match!
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="font-mono text-xl mb-3">
                  ∫ <span className="bg-green-200 px-1 rounded">2x</span> · e^(x²) <span className="bg-green-200 px-1 rounded">dx</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 p-3 rounded-lg"
                >
                  <p className="text-green-700 font-bold">2x dx = du</p>
                  <p className="text-xs text-gray-600 mt-1">
                    The 2x dx in our integral is exactly du!
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 text-sm text-gray-600"
                >
                  Now we can substitute...
                </motion.div>
              </div>
            </motion.div>
          )}

          {phase === 'substitute' && (
            <motion.div
              key="substitute"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 5: Substitute
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-3 font-mono text-center">
                  <div className="text-gray-500 text-sm">Original:</div>
                  <div>∫ <span className="text-green-600">2x</span> · e^(<span className="text-purple-600">x²</span>) <span className="text-green-600">dx</span></div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl"
                  >
                    ↓
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-100 p-2 rounded text-xl font-bold text-blue-700"
                  >
                    ∫ e^u du
                  </motion.div>
                  <div className="text-xs text-gray-500">Much simpler!</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'integrate' && (
            <motion.div
              key="integrate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 6: Integrate
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-3 font-mono text-center">
                  <div>∫ e^u du</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl"
                  >
                    ↓
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl"
                  >
                    <span className="text-blue-700 font-bold">e^u + C</span>
                  </motion.div>
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    Remember: ∫ e^x dx = e^x + C
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'back_substitute' && (
            <motion.div
              key="back_substitute"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 7: Back-Substitute
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-3 font-mono text-center">
                  <div>e^<span className="text-purple-600">u</span> + C</div>
                  <div className="text-sm text-gray-500">Replace u with x²:</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-green-100 p-3 rounded text-xl font-bold text-green-700"
                  >
                    e^(x²) + C
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                Step 8: Verify by Differentiating
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-gray-500">Check: d/dx[e^(x²) + C]</div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    = e^(x²) · d/dx[x²]
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    = e^(x²) · 2x
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-green-100 p-2 rounded font-bold text-green-700"
                  >
                    = 2x · e^(x²) ✓
                  </motion.div>
                  <div className="text-xs text-gray-500 mt-2">
                    This matches our original integrand!
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className={cn('text-lg font-semibold mb-3', colorClasses.text)}>
                U-Substitution Summary
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <div className="font-bold text-purple-700">1. Choose u</div>
                    <div className="text-xs text-gray-600">Inner function</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="font-bold text-green-700">2. Find du</div>
                    <div className="text-xs text-gray-600">Differentiate u</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="font-bold text-blue-700">3. Substitute</div>
                    <div className="text-xs text-gray-600">Replace in integral</div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded text-center">
                    <div className="font-bold text-orange-700">4. Integrate</div>
                    <div className="text-xs text-gray-600">Solve simpler integral</div>
                  </div>
                </div>
                <div className="bg-teal-50 p-2 rounded text-center mt-2">
                  <div className="font-bold text-teal-700">5. Back-substitute</div>
                  <div className="text-xs text-gray-600">Replace u with original expression</div>
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
              <div className="text-lg font-semibold text-green-600 mb-3">Solution</div>
              <div className="bg-green-100 p-4 rounded-lg max-w-md mx-auto">
                <div className="text-sm text-gray-600 mb-2">{problem.integral} =</div>
                <div className="font-mono text-xl text-green-700 font-bold">
                  {problem.result}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {['Why', 'Identify', 'Choose u', 'Find du', 'Match', 'Sub', 'Integrate', 'Back', 'Verify'].map((label, i) => {
          const stepPhases = ['why_useful', 'identify', 'choose_u', 'find_du', 'spot_match', 'substitute', 'integrate', 'back_substitute', 'verify']
          const phaseOrder = ['setup', 'why_useful', 'identify', 'choose_u', 'find_du', 'spot_match', 'substitute', 'integrate', 'back_substitute', 'verify', 'summary', 'complete']
          const currentPhaseIndex = phaseOrder.indexOf(phase)
          const stepPhaseIndex = phaseOrder.indexOf(stepPhases[i])
          const isComplete = currentPhaseIndex >= stepPhaseIndex && phase !== 'setup'
          return (
            <div
              key={label}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-all',
                isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              )}
            >
              {label}
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-yellow-800">
          {method === 'substitution' ? (
            <strong>Tip:</strong>
          ) : (
            <strong>LIATE Rule:</strong>
          )}
          {method === 'substitution'
            ? ' Look for a function and its derivative in the integrand.'
            : ' Choose u in order: Logs, Inverse trig, Algebraic, Trig, Exponential'}
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Evaluate the integral</p>
            <p className="text-sm mt-1 text-gray-500">Using {method === 'substitution' ? 'u-substitution' : 'integration by parts'}</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className={cn('text-xl font-bold', colorClasses.text)}>
              = {problem.result}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing u-substitution...'}
            {phase === 'why_useful' && 'Understanding the concept...'}
            {phase === 'identify' && 'Identifying the pattern...'}
            {phase === 'choose_u' && 'Choosing u...'}
            {phase === 'find_du' && 'Finding du...'}
            {phase === 'spot_match' && 'Spotting the match...'}
            {phase === 'substitute' && 'Substituting...'}
            {phase === 'integrate' && 'Integrating...'}
            {phase === 'back_substitute' && 'Back-substituting...'}
            {phase === 'verify' && 'Verifying the answer...'}
            {phase === 'summary' && 'Summary of steps...'}
          </p>
        )}
      </div>
    </div>
  )
}
