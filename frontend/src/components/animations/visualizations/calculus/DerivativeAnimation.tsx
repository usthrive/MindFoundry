/**
 * DerivativeAnimation - Visual representation of derivatives and tangent lines
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows function curve
 * - Demonstrates secant line approaching tangent line
 * - Shows slope calculation
 * - SETUP MODE (default): Shows function and derivative notation
 * - SOLUTION MODE: Animates secant → tangent transition
 *
 * Used for:
 * - Level L: derivatives, tangent_lines, relative_extrema, absolute_extrema
 * - Concept introductions for differentiation
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface DerivativeAnimationProps extends BaseAnimationProps {}

export default function DerivativeAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: DerivativeAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'           // Explain derivative concept
    | 'formula'         // Show limit definition
    | 'secant'          // Draw initial secant line
    | 'explain_slope'   // Explain rise/run calculation
    | 'approach'        // Animate deltaX decreasing
    | 'limit_concept'   // Explain the limit process
    | 'tangent'         // Show final tangent line
    | 'result'          // Show derivative value
    | 'complete'
  >('setup')
  const [deltaX, setDeltaX] = useState(2)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: f(x) = x² at x = 1
  // f'(x) = 2x, so f'(1) = 2
  const operands = problemData?.operands || [1, 0, 0, 1] // [a, b, c, point] for ax² + bx + c
  // Validate each operand individually to prevent NaN
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 1
  const b = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 0
  const c = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 0
  const point = typeof operands[3] === 'number' && !isNaN(operands[3]) ? operands[3] : 1

  // Calculate derivative at point: f'(x) = 2ax + b
  const slope = 2 * a * point + b
  const yAtPoint = a * point * point + b * point + c

  // SVG dimensions
  const width = 280
  const height = 280
  const padding = 35
  const scale = (width - 2 * padding) / 8 // -2 to 6 range

  const toSvgX = (x: number) => padding + (x + 2) * scale
  const toSvgY = (y: number) => height - padding - (y + 1) * scale

  // f(x) = ax² + bx + c
  const f = (x: number) => a * x * x + b * x + c

  // Generate curve points
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -2; x <= 5; x += 0.1) {
      const y = f(x)
      if (y >= -1 && y <= 10) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [a, b, c])

  // Generate secant/tangent line
  const getLinePoints = (m: number, x0: number, y0: number) => {
    const x1 = -1
    const x2 = 4
    const y1 = y0 + m * (x1 - x0)
    const y2 = y0 + m * (x2 - x0)
    return `${toSvgX(x1)},${toSvgY(y1)} ${toSvgX(x2)},${toSvgY(y2)}`
  }

  // Calculate secant slope
  const x2 = point + deltaX
  const y2 = f(x2)
  const secantSlope = (y2 - yAtPoint) / (x2 - point)

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setDeltaX(2)
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // Extended to 9 phases for more educational content (~18 seconds)
    const TICK_MS = 100
    const FORMULA_TICK = 20          // 2s - show limit definition
    const SECANT_TICK = 40           // 4s - draw secant line
    const EXPLAIN_TICK = 60          // 6s - explain slope calculation
    const APPROACH_START_TICK = 80   // 8s - start approaching
    const APPROACH_STEP_TICKS = 4    // 0.4 seconds between deltaX reductions
    const LIMIT_TICK = 120           // 12s - explain limit concept
    const TANGENT_TICK = 140         // 14s - show tangent line
    const RESULT_TICK = 160          // 16s - show derivative value
    const COMPLETE_TICK = 180        // 18s - complete

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase: Show limit definition formula
      if (tick === FORMULA_TICK && phase === 'setup') {
        setPhase('formula')
        playPop()
      }

      // Phase: Draw secant line
      if (tick === SECANT_TICK && phase === 'formula') {
        setPhase('secant')
        playWhoosh()
      }

      // Phase: Explain slope calculation
      if (tick === EXPLAIN_TICK && phase === 'secant') {
        setPhase('explain_slope')
        playPop()
      }

      // Phase: Start approaching - animate deltaX decreasing
      if (tick === APPROACH_START_TICK && phase === 'explain_slope') {
        setPhase('approach')
        playPop()
      }

      // Animate deltaX during approach phase
      if (phase === 'approach' && tick > APPROACH_START_TICK && tick < LIMIT_TICK) {
        const ticksSinceApproach = tick - APPROACH_START_TICK
        if (ticksSinceApproach % APPROACH_STEP_TICKS === 0) {
          setDeltaX(prev => {
            if (prev <= 0.3) return 0.3
            return prev - 0.15
          })
        }
      }

      // Phase: Explain limit concept
      if (tick === LIMIT_TICK && phase === 'approach') {
        setPhase('limit_concept')
        setDeltaX(0.1)
        playPop()
      }

      // Phase: Show tangent line
      if (tick === TANGENT_TICK && phase === 'limit_concept') {
        setPhase('tangent')
        setDeltaX(0.01)
        playWhoosh()
      }

      // Phase: Show derivative result
      if (tick === RESULT_TICK && phase === 'tangent') {
        setPhase('result')
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
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Function and Derivative Display */}
      <div className="text-center mb-4">
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-blue-50 px-3 py-1 rounded">
            <span className="text-sm text-blue-600">f(x) = </span>
            <span className="font-mono font-bold text-blue-700">
              {a !== 1 ? a : ''}x² {b !== 0 ? `${b > 0 ? '+' : '-'} ${Math.abs(b)}x` : ''} {c !== 0 ? `${c > 0 ? '+' : '-'} ${Math.abs(c)}` : ''}
            </span>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded">
            <span className="text-sm text-green-600">f'({point}) = </span>
            <span className="font-mono font-bold text-green-700">{(phase === 'result' || phase === 'complete') ? slope : '?'}</span>
          </div>
        </div>
      </div>

      {/* Derivative Formula */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-50 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-sm text-purple-600 mb-1">Definition of Derivative</div>
        <div className="font-mono text-sm">
          f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h
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
          {[-1, 0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i >= 0 && i <= 6 && (
                <line
                  x1={padding}
                  y1={toSvgY(i)}
                  x2={width - padding}
                  y2={toSvgY(i)}
                  stroke={i === 0 ? '#374151' : '#e5e7eb'}
                  strokeWidth={i === 0 ? 2 : 1}
                />
              )}
              {i !== 0 && (
                <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
              {i >= 0 && i <= 5 && i !== 0 && (
                <text x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Function curve */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Secant line (orange) */}
          {(phase === 'secant' || phase === 'explain_slope' || phase === 'approach' || phase === 'limit_concept') && (
            <motion.polyline
              points={getLinePoints(secantSlope, point, yAtPoint)}
              fill="none"
              stroke="#f97316"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Rise/Run Triangle - shows slope calculation visually */}
          {(phase === 'secant' || phase === 'explain_slope' || phase === 'approach' || phase === 'limit_concept') && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Horizontal line (run = Δx) */}
              <line
                x1={toSvgX(point)}
                y1={toSvgY(yAtPoint)}
                x2={toSvgX(x2)}
                y2={toSvgY(yAtPoint)}
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              {/* Vertical line (rise = Δy) */}
              <line
                x1={toSvgX(x2)}
                y1={toSvgY(yAtPoint)}
                x2={toSvgX(x2)}
                y2={toSvgY(y2)}
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              {/* Δx label */}
              <text
                x={(toSvgX(point) + toSvgX(x2)) / 2}
                y={toSvgY(yAtPoint) + 15}
                textAnchor="middle"
                className="text-xs fill-purple-600 font-bold"
              >
                Δx = {deltaX.toFixed(1)}
              </text>
              {/* Δy label */}
              <text
                x={toSvgX(x2) + 8}
                y={(toSvgY(yAtPoint) + toSvgY(y2)) / 2}
                textAnchor="start"
                className="text-xs fill-pink-600 font-bold"
              >
                Δy = {(y2 - yAtPoint).toFixed(1)}
              </text>
            </motion.g>
          )}

          {/* Tangent line (green) */}
          {(phase === 'tangent' || phase === 'result' || phase === 'complete') && (
            <motion.polyline
              points={getLinePoints(slope, point, yAtPoint)}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Point on curve */}
          <circle
            cx={toSvgX(point)}
            cy={toSvgY(yAtPoint)}
            r={6}
            fill="#ef4444"
          />

          {/* Second point for secant */}
          {(phase === 'secant' || phase === 'explain_slope' || phase === 'approach' || phase === 'limit_concept') && (
            <motion.circle
              cx={toSvgX(x2)}
              cy={toSvgY(y2)}
              r={5}
              fill="#f97316"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Point labels */}
          <text x={toSvgX(point) + 10} y={toSvgY(yAtPoint) - 10} className="text-xs fill-red-500 font-medium">
            ({point}, {yAtPoint})
          </text>

          {(phase === 'secant' || phase === 'explain_slope' || phase === 'approach' || phase === 'limit_concept') && (
            <motion.text
              x={toSvgX(x2) + 10}
              y={toSvgY(y2) - 10}
              className="text-xs fill-orange-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ({x2.toFixed(1)}, {y2.toFixed(1)})
            </motion.text>
          )}
        </svg>
      </div>

      {/* Information Panel */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[100px]">
        {phase === 'setup' ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">The Derivative</div>
            <div className="text-sm text-gray-600">
              <p>The derivative measures the instantaneous rate of change</p>
              <p className="mt-1">It's the slope of the tangent line at a point</p>
            </div>
          </div>
        ) : phase === 'formula' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: The Limit Definition</div>
            <div className="text-sm">
              <p>The derivative is defined as a limit:</p>
              <p className="font-mono text-lg mt-2 bg-blue-50 p-2 rounded">
                f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h
              </p>
              <p className="mt-2 text-gray-600">This formula tells us to find the slope as two points get infinitely close.</p>
            </div>
          </motion.div>
        ) : phase === 'secant' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 2: Draw a Secant Line</div>
            <div className="text-sm">
              <p>We start by drawing a line through <span className="font-bold">two points</span> on the curve.</p>
              <p className="mt-1">This is called a <span className="text-orange-600 font-bold">secant line</span>.</p>
              <p className="mt-2">Points: ({point}, {yAtPoint.toFixed(1)}) and ({(point + deltaX).toFixed(1)}, {(f(point + deltaX)).toFixed(1)})</p>
            </div>
          </motion.div>
        ) : phase === 'explain_slope' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 3: Calculate the Slope</div>
            <div className="text-sm">
              <p>The slope of the secant line is:</p>
              <p className="font-mono text-lg mt-2">
                slope = <span className="text-pink-600">Δy</span>/<span className="text-purple-600">Δx</span> = <span className="text-pink-600">{(y2 - yAtPoint).toFixed(1)}</span>/<span className="text-purple-600">{deltaX.toFixed(1)}</span> = <span className="text-orange-600 font-bold">{secantSlope.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-gray-600">This is the average rate of change between the two points.</p>
            </div>
          </motion.div>
        ) : phase === 'approach' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 4: Making Δx Smaller</div>
            <div className="text-sm">
              <p>Watch as the second point slides closer to the first!</p>
              <p className="mt-1">The triangle shrinks, but the slope approaches a specific value.</p>
              <p className="font-mono mt-2 text-lg">
                Current: Δx = <span className="text-purple-600 font-bold">{deltaX.toFixed(2)}</span>, slope = <span className="text-orange-600 font-bold">{secantSlope.toFixed(2)}</span>
              </p>
            </div>
          </motion.div>
        ) : phase === 'limit_concept' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-indigo-600 mb-2">Step 5: The Limit</div>
            <div className="text-sm">
              <p>As Δx approaches 0, the secant line becomes the <span className="font-bold">tangent line</span>!</p>
              <p className="font-mono mt-2 text-lg">
                lim<sub>Δx→0</sub> (Δy/Δx) = <span className="text-green-600 font-bold">{slope}</span>
              </p>
              <p className="mt-2 text-gray-600">The tangent line touches the curve at exactly one point.</p>
            </div>
          </motion.div>
        ) : phase === 'tangent' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 6: The Tangent Line</div>
            <div className="text-sm">
              <p>The <span className="text-green-600 font-bold">green line</span> is the tangent line at x = {point}.</p>
              <p className="mt-1">Its slope is the derivative at that point.</p>
              <p className="font-mono text-lg mt-2">
                Slope of tangent = f'({point}) = <span className="text-green-600 font-bold">{slope}</span>
              </p>
            </div>
          </motion.div>
        ) : phase === 'result' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">The Derivative Value</div>
            <div className="text-sm">
              <p>Using the power rule: d/dx[{a}x²] = {2 * a}x</p>
              <p className="font-mono text-xl mt-2 font-bold text-green-600">
                f'({point}) = {2 * a}({point}){b !== 0 ? ` + ${b}` : ''} = {slope}
              </p>
              <p className="mt-2 text-gray-600">This tells us the instantaneous rate of change at x = {point}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Complete!</div>
            <div className="text-sm">
              <p>The derivative at x = {point} is the slope of the tangent line</p>
              <p className="font-mono text-xl mt-2 font-bold text-green-600">
                f'({point}) = {slope}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Derivative Rules Reference */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="font-bold text-blue-700">Power Rule</div>
          <div className="font-mono text-blue-600">d/dx[xⁿ] = nxⁿ⁻¹</div>
        </div>
        <div className="bg-green-50 p-2 rounded text-center">
          <div className="font-bold text-green-700">At x = {point}</div>
          <div className="font-mono text-green-600">f'({point}) = 2({point}) = {slope}</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the derivative</p>
            <p className="text-sm mt-1 text-gray-500">Watch the secant become tangent</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              f'({point}) = {slope}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding derivatives...'}
            {phase === 'formula' && 'Learning the limit definition...'}
            {phase === 'secant' && 'Drawing secant line...'}
            {phase === 'explain_slope' && 'Calculating slope...'}
            {phase === 'approach' && 'Making Δx smaller...'}
            {phase === 'limit_concept' && 'Taking the limit...'}
            {phase === 'tangent' && 'Tangent line found!'}
            {phase === 'result' && 'Calculating derivative value...'}
          </p>
        )}
      </div>
    </div>
  )
}
