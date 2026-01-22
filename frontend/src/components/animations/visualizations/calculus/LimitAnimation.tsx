/**
 * LimitAnimation - Visual representation of limits
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows function approaching a value
 * - Demonstrates left and right limits
 * - Shows point approaching on graph
 * - SETUP MODE (default): Shows function and limit notation
 * - SOLUTION MODE: Animates approach from both sides
 *
 * Used for:
 * - Level L: limits, special_limits, continuity
 * - Concept introductions for limit concepts
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface LimitAnimationProps extends BaseAnimationProps {
  limitType?: 'finite' | 'infinite' | 'one_sided'
}

export default function LimitAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  limitType: _limitType = 'finite',
}: LimitAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'              // Introduce limit concept
    | 'explain_notation'   // Explain lim notation
    | 'identify_hole'      // Show where function is undefined
    | 'left_explain'       // Explain approaching from left
    | 'left_approach'      // Animate left approach
    | 'left_value'         // Show left limit value
    | 'right_explain'      // Explain approaching from right
    | 'right_approach'     // Animate right approach
    | 'right_value'        // Show right limit value
    | 'converge'           // Show both limits equal
    | 'complete'
  >('setup')
  const [approachValue, setApproachValue] = useState(-2)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: lim(x→2) (x² - 4)/(x - 2) = 4
  // This simplifies to x + 2, so limit is 4
  const operands = problemData?.operands || [2, 4] // [approach point, limit value]
  const [a, L] = operands

  // SVG dimensions
  const width = 280
  const height = 280
  const padding = 35
  const scale = (width - 2 * padding) / 8 // -1 to 7 range

  const toSvgX = (x: number) => padding + (x + 1) * scale
  const toSvgY = (y: number) => height - padding - (y - 1) * scale

  // Generate curve points for f(x) = x + 2 (simplified form)
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -1; x <= 6; x += 0.1) {
      if (Math.abs(x - a) > 0.1) { // Skip near the hole
        const y = x + 2
        if (y >= 1 && y <= 8) {
          pts.push(`${toSvgX(x)},${toSvgY(y)}`)
        }
      }
    }
    return pts.join(' ')
  }, [a])

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  // Extended to 11 phases for more educational content (~22 seconds)
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setApproachValue(a - 2)
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    const TICK_MS = 100
    const EXPLAIN_NOTATION_TICK = 20   // 2s - explain limit notation
    const HOLE_TICK = 40               // 4s - identify the hole
    const LEFT_EXPLAIN_TICK = 60       // 6s - explain left approach
    const LEFT_START_TICK = 80         // 8s - start left approach
    const LEFT_STEP_TICKS = 2          // 0.2 seconds between approach steps
    const LEFT_VALUE_TICK = 100        // 10s - show left value
    const RIGHT_EXPLAIN_TICK = 120     // 12s - explain right approach
    const RIGHT_START_TICK = 140       // 14s - start right approach
    const RIGHT_VALUE_TICK = 160       // 16s - show right value
    const CONVERGE_TICK = 180          // 18s - show convergence
    const COMPLETE_TICK = 220          // 22s - complete

    // Calculate approach progress based on ticks
    const LEFT_DURATION_TICKS = LEFT_VALUE_TICK - LEFT_START_TICK - 5
    const RIGHT_DURATION_TICKS = RIGHT_VALUE_TICK - RIGHT_START_TICK - 5

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase: Explain limit notation
      if (tick === EXPLAIN_NOTATION_TICK && phase === 'setup') {
        setPhase('explain_notation')
        playPop()
      }

      // Phase: Identify the hole
      if (tick === HOLE_TICK && phase === 'explain_notation') {
        setPhase('identify_hole')
        playPop()
      }

      // Phase: Explain left approach
      if (tick === LEFT_EXPLAIN_TICK && phase === 'identify_hole') {
        setPhase('left_explain')
        playPop()
      }

      // Phase: Start left approach
      if (tick === LEFT_START_TICK && phase === 'left_explain') {
        setPhase('left_approach')
        setApproachValue(a - 2)  // Start from far left
        playWhoosh()
      }

      // Animate left approach: from (a - 2) towards (a - 0.1)
      if (phase === 'left_approach' && tick > LEFT_START_TICK && tick < LEFT_VALUE_TICK) {
        const ticksIntoLeft = tick - LEFT_START_TICK
        if (ticksIntoLeft % LEFT_STEP_TICKS === 0) {
          const progress = Math.min(ticksIntoLeft / LEFT_DURATION_TICKS, 1)
          const newValue = (a - 2) + progress * 1.9
          setApproachValue(Math.min(newValue, a - 0.1))
        }
      }

      // Phase: Show left value
      if (tick === LEFT_VALUE_TICK && phase === 'left_approach') {
        setPhase('left_value')
        setApproachValue(a - 0.1)
        playPop()
      }

      // Phase: Explain right approach
      if (tick === RIGHT_EXPLAIN_TICK && phase === 'left_value') {
        setPhase('right_explain')
        playPop()
      }

      // Phase: Start right approach
      if (tick === RIGHT_START_TICK && phase === 'right_explain') {
        setPhase('right_approach')
        setApproachValue(a + 2)  // Start from far right
        playWhoosh()
      }

      // Animate right approach: from (a + 2) towards (a + 0.1)
      if (phase === 'right_approach' && tick > RIGHT_START_TICK && tick < RIGHT_VALUE_TICK) {
        const ticksIntoRight = tick - RIGHT_START_TICK
        if (ticksIntoRight % LEFT_STEP_TICKS === 0) {
          const progress = Math.min(ticksIntoRight / RIGHT_DURATION_TICKS, 1)
          const newValue = (a + 2) - progress * 1.9
          setApproachValue(Math.max(newValue, a + 0.1))
        }
      }

      // Phase: Show right value
      if (tick === RIGHT_VALUE_TICK && phase === 'right_approach') {
        setPhase('right_value')
        setApproachValue(a + 0.1)
        playPop()
      }

      // Phase: Show convergence
      if (tick === CONVERGE_TICK && phase === 'right_value') {
        setPhase('converge')
        playPop()
      }

      // Phase: Complete
      if (tick === COMPLETE_TICK) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, a, onComplete, playPop, playSuccess, playWhoosh])

  // Calculate y value at approach point
  const currentY = approachValue + 2

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Limit Notation */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">
          <span className="text-sm align-sub">lim</span>
          <span className="text-sm align-sub text-gray-500"> x→{a}</span>
          <span className="mx-2">f(x)</span>
          <span className="text-gray-500">=</span>
          <span className="text-primary ml-2">{phase === 'complete' ? L : '?'}</span>
        </div>
      </div>

      {/* Function Definition */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-sm text-blue-600 mb-1">Function</div>
        <div className="font-mono">
          f(x) = (x² - 4)/(x - {a})
        </div>
        <div className="text-xs text-gray-500 mt-1">
          = (x + 2) when x ≠ {a}
        </div>
      </motion.div>

      {/* Graph */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i + 2 <= 7 && (
                <line
                  x1={padding}
                  y1={toSvgY(i + 2)}
                  x2={width - padding}
                  y2={toSvgY(i + 2)}
                  stroke={(i + 2) === 0 ? '#374151' : '#e5e7eb'}
                  strokeWidth={(i + 2) === 0 ? 2 : 1}
                />
              )}
              {i !== 0 && (
                <text x={toSvgX(i)} y={toSvgY(2) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
              {i + 2 <= 7 && i + 2 !== 2 && (
                <text x={toSvgX(0) - 10} y={toSvgY(i + 2) + 4} textAnchor="end" className="text-xs fill-gray-500">{i + 2}</text>
              )}
            </g>
          ))}

          {/* X-axis at y=2 */}
          <line
            x1={padding}
            y1={toSvgY(2)}
            x2={width - padding}
            y2={toSvgY(2)}
            stroke="#374151"
            strokeWidth={1}
          />

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(2) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Function curve */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
          />

          {/* Hole at x = a */}
          <circle
            cx={toSvgX(a)}
            cy={toSvgY(L)}
            r={5}
            fill="white"
            stroke="#3b82f6"
            strokeWidth={2}
          />

          {/* Vertical line at x = a (approach point) */}
          {(phase === 'identify_hole' || phase === 'left_explain' || phase === 'left_approach' || phase === 'left_value' || phase === 'right_explain' || phase === 'right_approach' || phase === 'right_value' || phase === 'converge' || phase === 'complete') && (
            <motion.line
              x1={toSvgX(a)}
              y1={padding}
              x2={toSvgX(a)}
              y2={height - padding}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Horizontal line at y = L (limit value) */}
          {(phase === 'converge' || phase === 'complete') && (
            <motion.line
              x1={padding}
              y1={toSvgY(L)}
              x2={width - padding}
              y2={toSvgY(L)}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Moving point */}
          {(phase === 'left_approach' || phase === 'left_value' || phase === 'right_approach' || phase === 'right_value') && (
            <motion.circle
              cx={toSvgX(approachValue)}
              cy={toSvgY(currentY)}
              r={6}
              fill={(phase === 'left_approach' || phase === 'left_value') ? '#ef4444' : '#f97316'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Labels */}
          {(phase === 'converge' || phase === 'complete') && (
            <>
              <text x={toSvgX(a)} y={height - padding + 20} textAnchor="middle" className="text-xs fill-gray-600 font-medium">x = {a}</text>
              <text x={width - padding - 5} y={toSvgY(L) - 5} textAnchor="end" className="text-xs fill-green-600 font-medium">y = {L}</text>
            </>
          )}
        </svg>
      </div>

      {/* Information Panel */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[120px]">
        {phase === 'setup' ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Understanding Limits</div>
            <div className="text-sm text-gray-600">
              <p>A limit describes what value f(x) approaches</p>
              <p className="mt-1">as x gets closer and closer to a specific value</p>
            </div>
          </div>
        ) : phase === 'explain_notation' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: Limit Notation</div>
            <div className="text-sm">
              <p>The notation <span className="font-mono">lim<sub>x→{a}</sub> f(x)</span> means:</p>
              <p className="mt-1 text-gray-600">"What value does f(x) approach as x gets closer to {a}?"</p>
              <p className="mt-2 bg-blue-50 p-2 rounded">
                We <span className="font-bold">don't care</span> what f({a}) equals —
                only what f(x) <span className="font-bold">approaches</span>!
              </p>
            </div>
          </motion.div>
        ) : phase === 'identify_hole' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 2: The "Hole"</div>
            <div className="text-sm">
              <p>Notice the <span className="font-bold">open circle</span> at x = {a}</p>
              <p className="mt-1">This is because f(x) = (x² - 4)/(x - {a}) is <span className="text-red-600">undefined</span> at x = {a}</p>
              <p className="mt-2 text-gray-600">The denominator would be zero! (Division by zero is undefined)</p>
              <p className="mt-1 bg-purple-50 p-2 rounded">
                But we can still find what value f(x) <span className="font-bold">approaches</span>!
              </p>
            </div>
          </motion.div>
        ) : phase === 'left_explain' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-red-600 mb-2">Step 3: Left-Hand Limit</div>
            <div className="text-sm">
              <p>We approach x = {a} from the <span className="font-bold">left side</span></p>
              <p className="mt-1">This means using x values <span className="text-red-600">less than {a}</span></p>
              <p className="mt-2 font-mono bg-red-50 p-2 rounded">
                x → {a}<sup>−</sup> means x approaches {a} from below
              </p>
            </div>
          </motion.div>
        ) : phase === 'left_approach' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-red-600 mb-2">Step 4: Approaching from Left</div>
            <div className="text-sm">
              <p>Watch the point slide toward x = {a}!</p>
              <p className="font-mono mt-2 text-lg">
                x = <span className="text-red-600 font-bold">{approachValue.toFixed(2)}</span>, f(x) = <span className="text-blue-600 font-bold">{currentY.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-gray-600">As x gets closer to {a}, f(x) gets closer to {L}</p>
            </div>
          </motion.div>
        ) : phase === 'left_value' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-red-600 mb-2">Left-Hand Limit Value</div>
            <div className="text-sm">
              <p>From the left, f(x) approaches:</p>
              <p className="font-mono text-xl mt-2 text-red-600 font-bold">
                lim<sub>x→{a}<sup>−</sup></sub> f(x) = {L}
              </p>
            </div>
          </motion.div>
        ) : phase === 'right_explain' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 5: Right-Hand Limit</div>
            <div className="text-sm">
              <p>Now we approach x = {a} from the <span className="font-bold">right side</span></p>
              <p className="mt-1">This means using x values <span className="text-orange-600">greater than {a}</span></p>
              <p className="mt-2 font-mono bg-orange-50 p-2 rounded">
                x → {a}<sup>+</sup> means x approaches {a} from above
              </p>
            </div>
          </motion.div>
        ) : phase === 'right_approach' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 6: Approaching from Right</div>
            <div className="text-sm">
              <p>Watch the point slide toward x = {a}!</p>
              <p className="font-mono mt-2 text-lg">
                x = <span className="text-orange-600 font-bold">{approachValue.toFixed(2)}</span>, f(x) = <span className="text-blue-600 font-bold">{currentY.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-gray-600">From this side too, f(x) approaches {L}</p>
            </div>
          </motion.div>
        ) : phase === 'right_value' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Right-Hand Limit Value</div>
            <div className="text-sm">
              <p>From the right, f(x) approaches:</p>
              <p className="font-mono text-xl mt-2 text-orange-600 font-bold">
                lim<sub>x→{a}<sup>+</sup></sub> f(x) = {L}
              </p>
            </div>
          </motion.div>
        ) : phase === 'converge' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 7: Limit Exists!</div>
            <div className="text-sm">
              <p><span className="text-red-600">Left limit</span> = <span className="text-orange-600">Right limit</span> = <span className="text-green-600 font-bold">{L}</span></p>
              <p className="mt-2 text-gray-600">When both one-sided limits are equal, the two-sided limit exists!</p>
              <p className="font-mono text-lg mt-2 bg-green-50 p-2 rounded font-bold">
                lim<sub>x→{a}</sub> f(x) = {L}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Complete!</div>
            <div className="text-sm">
              <p>Even though f({a}) is undefined (there's a "hole"),</p>
              <p className="mt-1">the limit tells us what value f(x) approaches!</p>
              <p className="font-mono text-xl mt-2 font-bold text-green-600">
                lim<sub>x→{a}</sub> f(x) = {L}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the limit</p>
            <p className="text-sm mt-1 text-gray-500">Watch as x approaches {a}</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              lim<sub>x→{a}</sub> f(x) = {L}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding limits...'}
            {phase === 'explain_notation' && 'Learning limit notation...'}
            {phase === 'identify_hole' && 'Finding the hole...'}
            {phase === 'left_explain' && 'Preparing left approach...'}
            {phase === 'left_approach' && 'Approaching from the left...'}
            {phase === 'left_value' && 'Left limit found!'}
            {phase === 'right_explain' && 'Preparing right approach...'}
            {phase === 'right_approach' && 'Approaching from the right...'}
            {phase === 'right_value' && 'Right limit found!'}
            {phase === 'converge' && 'Both sides converge!'}
          </p>
        )}
      </div>
    </div>
  )
}
