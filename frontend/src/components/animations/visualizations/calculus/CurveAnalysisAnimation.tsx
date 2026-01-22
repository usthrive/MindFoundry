/**
 * CurveAnalysisAnimation - Visual representation of complete curve analysis
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows full curve with critical points
 * - Identifies inflection points and concavity
 * - Demonstrates first and second derivative tests
 * - SETUP MODE (default): Shows curve
 * - SOLUTION MODE: Animates analysis steps
 *
 * Used for:
 * - Level O: curve_sketching, concavity, advanced_maxima_minima
 * - Concept introductions for complete curve analysis
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface CurveAnalysisAnimationProps extends BaseAnimationProps {
  isPaused?: boolean
}

type Phase =
  | 'setup'
  | 'real_world'
  | 'first_derivative'
  | 'critical_explain'
  | 'critical_solve'
  | 'critical_identify'
  | 'second_derivative'
  | 'inflection_explain'
  | 'inflection_solve'
  | 'inflection_verify'
  | 'complete'

export default function CurveAnalysisAnimation({
  problemData: _problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: CurveAnalysisAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Example: f(x) = x³ - 3x² - 9x + 5
  // f'(x) = 3x² - 6x - 9 = 3(x-3)(x+1), critical points at x = -1, 3
  // f''(x) = 6x - 6 = 6(x-1), inflection at x = 1

  // SVG dimensions
  const width = 300
  const height = 260
  const padding = 40

  // Function definition: f(x) = x³ - 3x² - 9x + 5
  // Derivatives: f'(x) = 3x² - 6x - 9, f''(x) = 6x - 6
  const f = (x: number) => x * x * x - 3 * x * x - 9 * x + 5

  // Key points
  const criticalPoints = [
    { x: -1, y: f(-1), type: 'max' }, // Local max
    { x: 3, y: f(3), type: 'min' }, // Local min
  ]
  const inflectionPoint = { x: 1, y: f(1) }

  // Scale
  const xMin = -3, xMax = 5
  const yMin = -30, yMax = 15
  const xScale = (width - 2 * padding) / (xMax - xMin)
  const yScale = (height - 2 * padding) / (yMax - yMin)

  const toSvgX = (x: number) => padding + (x - xMin) * xScale
  const toSvgY = (y: number) => height - padding - (y - yMin) * yScale

  // Generate curve points
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = xMin; x <= xMax; x += 0.1) {
      const y = f(x)
      if (y >= yMin && y <= yMax) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [])

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 25 // 2.5 seconds per phase (~27.5 seconds total for 11 phases)

    const phases: Phase[] = [
      'setup', 'real_world', 'first_derivative', 'critical_explain', 'critical_solve',
      'critical_identify', 'second_derivative', 'inflection_explain', 'inflection_solve',
      'inflection_verify', 'complete'
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
        if (newPhase === 'inflection_solve') {
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
      {/* Function Display */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-gray-800 font-mono">
          f(x) = x³ - 3x² - 9x + 5
        </div>
      </div>

      {/* Graph */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid */}
          {[-2, -1, 0, 1, 2, 3, 4].map(x => (
            <line
              key={`v-${x}`}
              x1={toSvgX(x)}
              y1={padding}
              x2={toSvgX(x)}
              y2={height - padding}
              stroke={x === 0 ? '#374151' : '#e5e7eb'}
              strokeWidth={x === 0 ? 2 : 1}
            />
          ))}
          {[-20, -10, 0, 10].map(y => (
            <line
              key={`h-${y}`}
              x1={padding}
              y1={toSvgY(y)}
              x2={width - padding}
              y2={toSvgY(y)}
              stroke={y === 0 ? '#374151' : '#e5e7eb'}
              strokeWidth={y === 0 ? 2 : 1}
            />
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-xs fill-gray-700">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-xs fill-gray-700">y</text>

          {/* Concavity regions */}
          {(['second_derivative', 'inflection_explain', 'inflection_solve', 'inflection_verify', 'complete'] as Phase[]).includes(phase) && (
            <>
              {/* Concave down region (x < 1) */}
              <motion.rect
                x={padding}
                y={padding}
                width={toSvgX(1) - padding}
                height={height - 2 * padding}
                fill="#fecaca"
                fillOpacity={0.3}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              {/* Concave up region (x > 1) */}
              <motion.rect
                x={toSvgX(1)}
                y={padding}
                width={width - padding - toSvgX(1)}
                height={height - 2 * padding}
                fill="#bbf7d0"
                fillOpacity={0.3}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}

          {/* Curve */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Critical points */}
          {(['critical_identify', 'second_derivative', 'inflection_explain', 'inflection_solve', 'inflection_verify', 'complete'] as Phase[]).includes(phase) && (
            <>
              {criticalPoints.map((pt, i) => (
                <motion.g
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <circle
                    cx={toSvgX(pt.x)}
                    cy={toSvgY(pt.y)}
                    r={7}
                    fill={pt.type === 'max' ? '#10b981' : '#ef4444'}
                  />
                  <text
                    x={toSvgX(pt.x) + 10}
                    y={toSvgY(pt.y) - 10}
                    className={cn(
                      'text-xs font-bold',
                      pt.type === 'max' ? 'fill-green-600' : 'fill-red-600'
                    )}
                  >
                    {pt.type === 'max' ? 'Max' : 'Min'}
                  </text>
                </motion.g>
              ))}
            </>
          )}

          {/* Inflection point */}
          {(['inflection_verify', 'complete'] as Phase[]).includes(phase) && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvgX(inflectionPoint.x)}
                cy={toSvgY(inflectionPoint.y)}
                r={7}
                fill="#f97316"
              />
              <text
                x={toSvgX(inflectionPoint.x) + 10}
                y={toSvgY(inflectionPoint.y) + 15}
                className="text-xs fill-orange-600 font-bold"
              >
                Inflection
              </text>
            </motion.g>
          )}

          {/* Concavity labels */}
          {(['second_derivative', 'inflection_explain', 'inflection_solve', 'inflection_verify', 'complete'] as Phase[]).includes(phase) && (
            <>
              <motion.text
                x={toSvgX(-1)}
                y={padding + 20}
                textAnchor="middle"
                className="text-xs fill-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⌢ Concave Down
              </motion.text>
              <motion.text
                x={toSvgX(3)}
                y={padding + 20}
                textAnchor="middle"
                className="text-xs fill-green-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⌣ Concave Up
              </motion.text>
            </>
          )}
        </svg>
      </div>

      {/* Analysis Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-gray-700 mb-2">Curve Analysis</div>
              <div className="text-sm text-gray-600">
                <p>We'll find where the function:</p>
                <p>• Has maximum and minimum values</p>
                <p>• Changes from curving up to curving down</p>
              </div>
            </motion.div>
          )}

          {phase === 'real_world' && (
            <motion.div
              key="real_world"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-yellow-700 mb-2">Real-World Applications</div>
              <div className="grid grid-cols-3 gap-2 text-xs max-w-md mx-auto">
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-xl">📈</div>
                  <div className="font-medium">Business</div>
                  <div className="text-gray-500">Max profit</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-xl">🏗️</div>
                  <div className="font-medium">Engineering</div>
                  <div className="text-gray-500">Optimal design</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-xl">⚗️</div>
                  <div className="font-medium">Science</div>
                  <div className="text-gray-500">Peak reactions</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'first_derivative' && (
            <motion.div
              key="first_derivative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: First Derivative</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono text-sm space-y-1">
                  <div className="text-gray-600">f(x) = x³ - 3x² - 9x + 5</div>
                  <div className="text-blue-600 font-bold">f'(x) = 3x² - 6x - 9</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  The first derivative tells us where the slope is zero
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'critical_explain' && (
            <motion.div
              key="critical_explain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-600 mb-2">What are Critical Points?</div>
              <div className="bg-purple-50 p-3 rounded-lg max-w-sm mx-auto">
                <div className="text-sm space-y-2">
                  <p><strong>Critical points</strong> are where f'(x) = 0</p>
                  <p className="text-gray-600">At these points, the curve is momentarily flat</p>
                  <p className="text-purple-600">They can be maximums, minimums, or neither!</p>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'critical_solve' && (
            <motion.div
              key="critical_solve"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-600 mb-2">Step 2: Solve f'(x) = 0</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono text-sm space-y-1">
                  <div>3x² - 6x - 9 = 0</div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    3(x² - 2x - 3) = 0
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    3(x - 3)(x + 1) = 0
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="font-bold text-purple-600"
                  >
                    x = 3 or x = -1
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'critical_identify' && (
            <motion.div
              key="critical_identify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-600 mb-2">Critical Points Found</div>
              <div className="grid grid-cols-2 gap-2 text-sm max-w-xs mx-auto">
                <div className="bg-green-100 p-2 rounded">
                  <div className="font-bold">x = -1</div>
                  <div>f(-1) = 10</div>
                  <div className="text-green-600 font-medium">Local Maximum</div>
                </div>
                <div className="bg-red-100 p-2 rounded">
                  <div className="font-bold">x = 3</div>
                  <div>f(3) = -22</div>
                  <div className="text-red-600 font-medium">Local Minimum</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'second_derivative' && (
            <motion.div
              key="second_derivative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-orange-600 mb-2">Step 3: Second Derivative</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono text-sm space-y-1">
                  <div className="text-gray-600">f'(x) = 3x² - 6x - 9</div>
                  <div className="text-orange-600 font-bold">f''(x) = 6x - 6</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  The second derivative tells us about concavity
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'inflection_explain' && (
            <motion.div
              key="inflection_explain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-teal-600 mb-2">What are Inflection Points?</div>
              <div className="bg-teal-50 p-3 rounded-lg max-w-sm mx-auto">
                <div className="text-sm space-y-2">
                  <p><strong>Inflection points</strong> are where f''(x) = 0</p>
                  <p className="text-gray-600">At these points, the curve changes from:</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="text-red-500">⌢ curving down</div>
                    <div>↔</div>
                    <div className="text-green-500">⌣ curving up</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'inflection_solve' && (
            <motion.div
              key="inflection_solve"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-teal-600 mb-2">Step 4: Solve f''(x) = 0</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-gray-600">Set second derivative to zero:</div>
                  <div className="text-lg">f''(x) = 6x - 6 = 0</div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    6x = 6
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl font-bold text-teal-600"
                  >
                    x = 1
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'inflection_verify' && (
            <motion.div
              key="inflection_verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-teal-600 mb-2">Step 5: Verify Concavity Change</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-50 p-2 rounded">
                      <div className="font-mono">x = 0 (left of 1)</div>
                      <div className="font-mono text-red-600">f''(0) = -6 &lt; 0</div>
                      <div className="text-red-500 text-xs">Concave DOWN ⌢</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-mono">x = 2 (right of 1)</div>
                      <div className="font-mono text-green-600">f''(2) = 6 &gt; 0</div>
                      <div className="text-green-500 text-xs">Concave UP ⌣</div>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-2 rounded text-center mt-2">
                    <div className="font-bold text-orange-700">Inflection at x = 1</div>
                    <div className="text-xs text-gray-600">f(1) = -6</div>
                  </div>
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
              <div className="text-lg font-semibold text-green-600 mb-2">Complete Analysis</div>
              <div className="grid grid-cols-3 gap-2 text-xs max-w-md mx-auto">
                <div className="bg-green-100 p-2 rounded">
                  <div className="font-bold">Max at x=-1</div>
                  <div>y = 10</div>
                </div>
                <div className="bg-orange-100 p-2 rounded">
                  <div className="font-bold">Inflection at x=1</div>
                  <div>y = -6</div>
                </div>
                <div className="bg-red-100 p-2 rounded">
                  <div className="font-bold">Min at x=3</div>
                  <div>y = -22</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Maximum</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Minimum</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Inflection</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {["f'(x)", 'Critical', "f''(x)", 'Inflection', 'Complete'].map((label, i) => {
          const stepPhases: Phase[] = ['first_derivative', 'critical_identify', 'second_derivative', 'inflection_verify', 'complete']
          const phaseOrder: Phase[] = [
            'setup', 'real_world', 'first_derivative', 'critical_explain', 'critical_solve',
            'critical_identify', 'second_derivative', 'inflection_explain', 'inflection_solve',
            'inflection_verify', 'complete'
          ]
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

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Analyze the curve</p>
            <p className="text-sm mt-1 text-gray-500">Find extrema and inflection points</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Curve analysis complete!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing curve analysis...'}
            {phase === 'real_world' && 'Exploring real-world uses...'}
            {phase === 'first_derivative' && 'Finding first derivative...'}
            {phase === 'critical_explain' && 'Understanding critical points...'}
            {phase === 'critical_solve' && 'Solving for critical points...'}
            {phase === 'critical_identify' && 'Identifying max and min...'}
            {phase === 'second_derivative' && 'Finding second derivative...'}
            {phase === 'inflection_explain' && 'Understanding inflection points...'}
            {phase === 'inflection_solve' && 'Solving for inflection point...'}
            {phase === 'inflection_verify' && 'Verifying concavity change...'}
          </p>
        )}
      </div>
    </div>
  )
}
