/**
 * TrigGraphAnimation - Visual representation of trigonometric function graphs
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows sine/cosine wave shapes
 * - Demonstrates amplitude, period, phase shift
 * - Highlights key points (max, min, zeros)
 * - SETUP MODE (default): Shows equation and axes
 * - SOLUTION MODE: Animates wave drawing
 *
 * Used for:
 * - Level M: trig_graphs, trig_inequalities
 * - Concept introductions for graphing trig functions
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface TrigGraphAnimationProps extends BaseAnimationProps {
  funcType?: 'sin' | 'cos' | 'tan'
}

export default function TrigGraphAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  funcType = 'sin',
}: TrigGraphAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'
    | 'real_world'
    | 'equation_explain'
    | 'amplitude_explain'
    | 'draw'
    | 'period_explain'
    | 'phase_explain'
    | 'vertical_explain'
    | 'features'
    | 'applications'
    | 'summary'
    | 'complete'
  >('setup')
  const [progress, setProgress] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Parameters: [amplitude, period multiplier, phase shift, vertical shift]
  // Default: y = 2sin(x) (amplitude 2, period 2π)
  const operands = problemData?.operands || [2, 1, 0, 0]
  // Validate each operand individually to prevent NaN/undefined
  const amplitude = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 2
  const periodMult = typeof operands[1] === 'number' && !isNaN(operands[1]) && operands[1] !== 0 ? operands[1] : 1
  const phaseShift = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 0
  const verticalShift = typeof operands[3] === 'number' && !isNaN(operands[3]) ? operands[3] : 0

  // Validate periodMult is not zero (would cause division by zero in period calculation)
  const isValidPeriod = periodMult !== 0

  // Early return with educational error message if invalid
  if (!isValidPeriod) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Period</p>
          <p className="text-red-500 text-sm mt-2">
            {periodMult === 0
              ? "The period multiplier (B) cannot be zero. This would make the period infinite, which isn't a valid trigonometric function."
              : "Please enter valid numbers for the function parameters."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>For y = A·{funcType}(Bx), the period = 2π/B, so B must be non-zero</p>
          </div>
        </div>
      </div>
    )
  }

  const period = (2 * Math.PI) / periodMult

  // SVG dimensions
  const width = 320
  const height = 220
  const padding = 40
  const xScale = (width - 2 * padding) / (4 * Math.PI) // Show -2π to 2π
  const yScale = (height - 2 * padding) / 6 // Show -3 to 3

  const toSvgX = (x: number) => padding + (x + 2 * Math.PI) * xScale
  const toSvgY = (y: number) => height / 2 - y * yScale

  // Generate wave points
  const wavePoints = useMemo(() => {
    const pts: string[] = []
    const endX = -2 * Math.PI + (4 * Math.PI) * progress
    for (let x = -2 * Math.PI; x <= endX; x += 0.05) {
      let y
      if (funcType === 'sin') {
        y = amplitude * Math.sin(periodMult * (x - phaseShift)) + verticalShift
      } else if (funcType === 'cos') {
        y = amplitude * Math.cos(periodMult * (x - phaseShift)) + verticalShift
      } else {
        y = amplitude * Math.tan(periodMult * (x - phaseShift)) + verticalShift
        if (Math.abs(y) > 5) continue // Skip asymptotic regions
      }
      pts.push(`${toSvgX(x)},${toSvgY(y)}`)
    }
    return pts.join(' ')
  }, [progress, amplitude, periodMult, phaseShift, verticalShift, funcType])

  // Key points (zeros, max, min for one period)
  const keyPoints = useMemo(() => {
    if (funcType === 'tan') return []

    const points = []
    if (funcType === 'sin') {
      points.push({ x: 0, y: verticalShift, label: 'zero' })
      points.push({ x: Math.PI / 2 / periodMult, y: amplitude + verticalShift, label: 'max' })
      points.push({ x: Math.PI / periodMult, y: verticalShift, label: 'zero' })
      points.push({ x: 3 * Math.PI / 2 / periodMult, y: -amplitude + verticalShift, label: 'min' })
    } else {
      points.push({ x: 0, y: amplitude + verticalShift, label: 'max' })
      points.push({ x: Math.PI / 2 / periodMult, y: verticalShift, label: 'zero' })
      points.push({ x: Math.PI / periodMult, y: -amplitude + verticalShift, label: 'min' })
      points.push({ x: 3 * Math.PI / 2 / periodMult, y: verticalShift, label: 'zero' })
    }
    return points
  }, [funcType, amplitude, periodMult, verticalShift])

  // Animate progress for wave drawing
  useEffect(() => {
    if (!showSolution) {
      setProgress(0)
      return
    }

    if (phase === 'draw') {
      const interval = setInterval(() => {
        if (isPausedRef.current) return
        setProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval)
            return 1
          }
          return prev + 0.02
        })
      }, 30)
      return () => clearInterval(interval)
    }
  }, [showSolution, phase])

  // Animation effect for solution mode - converted to interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setProgress(0)
      tickRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 20 // 2 seconds per phase

    const phases: (typeof phase)[] = [
      'setup', 'real_world', 'equation_explain', 'amplitude_explain',
      'draw', 'period_explain', 'phase_explain', 'vertical_explain',
      'features', 'applications', 'summary', 'complete'
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
        if (newPhase === 'draw') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format equation
  const formatEquation = () => {
    let eq = 'y = '
    if (amplitude !== 1) eq += amplitude
    eq += funcType
    eq += '('
    if (periodMult !== 1) eq += periodMult
    eq += 'x'
    if (phaseShift !== 0) eq += ` - ${phaseShift}`
    eq += ')'
    if (verticalShift !== 0) eq += ` ${verticalShift > 0 ? '+' : '-'} ${Math.abs(verticalShift)}`
    return eq
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono">
          {formatEquation()}
        </div>
      </div>

      {/* Graph */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid lines */}
          {[-Math.PI, 0, Math.PI].map(x => (
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
          {[-2, -1, 0, 1, 2].map(y => (
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

          {/* X-axis tick labels */}
          <text x={toSvgX(-Math.PI)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">-π</text>
          <text x={toSvgX(Math.PI)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">π</text>
          <text x={toSvgX(2 * Math.PI)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">2π</text>

          {/* Y-axis tick labels */}
          {[-2, -1, 1, 2].map(y => (
            <text key={`yl-${y}`} x={toSvgX(0) - 10} y={toSvgY(y) + 4} textAnchor="end" className="text-xs fill-gray-500">{y}</text>
          ))}

          {/* Amplitude lines */}
          {(phase === 'amplitude_explain' || phase === 'features' || phase === 'applications' || phase === 'summary' || phase === 'complete') && (
            <>
              <motion.line
                x1={padding}
                y1={toSvgY(amplitude + verticalShift)}
                x2={width - padding}
                y2={toSvgY(amplitude + verticalShift)}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="4,4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
              />
              <motion.line
                x1={padding}
                y1={toSvgY(-amplitude + verticalShift)}
                x2={width - padding}
                y2={toSvgY(-amplitude + verticalShift)}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="4,4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
              />
            </>
          )}

          {/* Wave */}
          {(phase === 'draw' || phase === 'period_explain' || phase === 'phase_explain' || phase === 'vertical_explain' || phase === 'features' || phase === 'applications' || phase === 'summary' || phase === 'complete') && (
            <motion.polyline
              points={wavePoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Key points */}
          {(phase === 'features' || phase === 'applications' || phase === 'summary' || phase === 'complete') && keyPoints.map((pt, i) => (
            <motion.g
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r={5}
                fill={pt.label === 'max' ? '#10b981' : pt.label === 'min' ? '#ef4444' : '#f97316'}
              />
            </motion.g>
          ))}

          {/* Period indicator */}
          {(phase === 'period_explain' || phase === 'features' || phase === 'applications' || phase === 'summary' || phase === 'complete') && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <line
                x1={toSvgX(0)}
                y1={height - padding + 25}
                x2={toSvgX(period)}
                y2={height - padding + 25}
                stroke="#8b5cf6"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-rev)"
              />
              <text x={toSvgX(period / 2)} y={height - padding + 38} textAnchor="middle" className="text-xs fill-purple-600 font-medium">
                Period = {period === 2 * Math.PI ? '2π' : `${(period / Math.PI).toFixed(1)}π`}
              </text>
            </motion.g>
          )}

          {/* Arrow markers */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#8b5cf6" />
            </marker>
            <marker id="arrowhead-rev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
              <polygon points="6 0, 0 3, 6 6" fill="#8b5cf6" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Properties */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[120px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Trigonometric Graphs</div>
            <div className="text-sm text-gray-600">
              <p>y = A·{funcType}(Bx - C) + D</p>
              <p className="mt-1">where A = amplitude, 2π/B = period</p>
            </div>
          </div>
        )}

        {phase === 'real_world' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-yellow-700 mb-2">Real-World Examples</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-white p-2 rounded text-center">
                <div className="text-2xl">🎵</div>
                <div className="font-medium">Sound Waves</div>
                <div className="text-xs text-gray-500">Music & Audio</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-2xl">🌊</div>
                <div className="font-medium">Ocean Tides</div>
                <div className="text-xs text-gray-500">Rise & Fall</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-2xl">☀️</div>
                <div className="font-medium">Daylight Hours</div>
                <div className="text-xs text-gray-500">Seasonal Change</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'equation_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-2">Understanding the Equation</div>
            <div className="text-sm text-gray-600">
              <p className="font-mono text-lg">y = A·{funcType}(Bx - C) + D</p>
              <p className="mt-2"><strong>A</strong> = Amplitude (how tall)</p>
              <p><strong>B</strong> = Frequency (how often it repeats)</p>
              <p><strong>C</strong> = Phase shift (left/right slide)</p>
              <p><strong>D</strong> = Vertical shift (up/down)</p>
            </div>
          </motion.div>
        )}

        {phase === 'amplitude_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-red-600 mb-2">Amplitude = {amplitude}</div>
            <div className="text-sm text-gray-600">
              <p>The <strong>amplitude</strong> tells you how tall the wave is.</p>
              <p className="mt-1">It measures the distance from the center line to the peak.</p>
              <p className="mt-2 font-medium">Wave goes from {-amplitude + verticalShift} to {amplitude + verticalShift}</p>
            </div>
          </motion.div>
        )}

        {phase === 'draw' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Drawing the {funcType} Wave</div>
            <div className="text-sm text-gray-600">
              <p>Watch as the wave takes shape!</p>
              <p className="mt-1">Notice how it oscillates between {-amplitude + verticalShift} and {amplitude + verticalShift}</p>
            </div>
          </motion.div>
        )}

        {phase === 'period_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-600 mb-2">Period = {period === 2 * Math.PI ? '2π' : `${(period / Math.PI).toFixed(1)}π`}</div>
            <div className="text-sm text-gray-600">
              <p>The <strong>period</strong> is how long before the pattern repeats.</p>
              <p className="mt-1 font-mono">Period = 2π / B = 2π / {periodMult}</p>
              <p className="mt-2">A larger B means more waves in the same space!</p>
            </div>
          </motion.div>
        )}

        {phase === 'phase_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-orange-600 mb-2">Phase Shift = {phaseShift}</div>
            <div className="text-sm text-gray-600">
              <p>The <strong>phase shift</strong> slides the wave left or right.</p>
              {phaseShift === 0 ? (
                <p className="mt-1">No shift - the wave starts at the origin.</p>
              ) : phaseShift > 0 ? (
                <p className="mt-1">Shifted {phaseShift} units to the RIGHT.</p>
              ) : (
                <p className="mt-1">Shifted {Math.abs(phaseShift)} units to the LEFT.</p>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'vertical_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Vertical Shift = {verticalShift}</div>
            <div className="text-sm text-gray-600">
              <p>The <strong>vertical shift</strong> moves the wave up or down.</p>
              {verticalShift === 0 ? (
                <p className="mt-1">No shift - the wave oscillates around y = 0.</p>
              ) : verticalShift > 0 ? (
                <p className="mt-1">Shifted {verticalShift} units UP. Center line is at y = {verticalShift}.</p>
              ) : (
                <p className="mt-1">Shifted {Math.abs(verticalShift)} units DOWN. Center line is at y = {verticalShift}.</p>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'features' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3 text-center"
          >
            <div className="bg-red-100 p-2 rounded">
              <div className="text-sm text-red-600 font-semibold">Amplitude</div>
              <div className="text-lg font-bold text-red-700">{amplitude}</div>
            </div>
            <div className="bg-purple-100 p-2 rounded">
              <div className="text-sm text-purple-600 font-semibold">Period</div>
              <div className="text-lg font-bold text-purple-700">
                {period === 2 * Math.PI ? '2π' : `${(period / Math.PI).toFixed(1)}π`}
              </div>
            </div>
            {phaseShift !== 0 && (
              <div className="bg-orange-100 p-2 rounded">
                <div className="text-sm text-orange-600 font-semibold">Phase Shift</div>
                <div className="text-lg font-bold text-orange-700">{phaseShift}</div>
              </div>
            )}
            {verticalShift !== 0 && (
              <div className="bg-blue-100 p-2 rounded">
                <div className="text-sm text-blue-600 font-semibold">Vertical Shift</div>
                <div className="text-lg font-bold text-blue-700">{verticalShift}</div>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'applications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-indigo-600 mb-2">Applications in Science & Engineering</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded">
                <div className="font-medium text-indigo-700">🎸 Music</div>
                <div className="text-gray-500">Musical notes are sine waves</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-medium text-indigo-700">📡 Radio</div>
                <div className="text-gray-500">Radio signals use sine waves</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-medium text-indigo-700">⚡ Electricity</div>
                <div className="text-gray-500">AC power is sinusoidal</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="font-medium text-indigo-700">🏥 Medical</div>
                <div className="text-gray-500">Heart rhythms (ECG)</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'summary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Summary</div>
            <div className="text-sm">
              <p className="font-mono">{formatEquation()}</p>
              <div className="grid grid-cols-4 gap-1 mt-2 text-xs">
                <div className="bg-red-100 p-1 rounded">A = {amplitude}</div>
                <div className="bg-purple-100 p-1 rounded">T = {period === 2 * Math.PI ? '2π' : `${(period / Math.PI).toFixed(1)}π`}</div>
                <div className="bg-orange-100 p-1 rounded">C = {phaseShift}</div>
                <div className="bg-blue-100 p-1 rounded">D = {verticalShift}</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Graph Complete!</div>
            <div className="text-sm text-gray-600">
              <p>You've mastered graphing {formatEquation()}</p>
              <p className="mt-1">Remember: Trig graphs model many real-world phenomena!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Points Legend */}
      {(phase === 'features' || phase === 'applications' || phase === 'summary' || phase === 'complete') && (
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
            <span>Zero</span>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Graph {formatEquation()}</p>
            <p className="text-sm mt-1 text-gray-500">Identify amplitude and period</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              {funcType} wave graphed!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Starting...'}
            {phase === 'real_world' && 'Exploring real-world applications...'}
            {phase === 'equation_explain' && 'Understanding the equation...'}
            {phase === 'amplitude_explain' && 'Learning about amplitude...'}
            {phase === 'draw' && 'Drawing the wave...'}
            {phase === 'period_explain' && 'Understanding the period...'}
            {phase === 'phase_explain' && 'Exploring phase shift...'}
            {phase === 'vertical_explain' && 'Understanding vertical shift...'}
            {phase === 'features' && 'Identifying key features...'}
            {phase === 'applications' && 'Seeing applications...'}
            {phase === 'summary' && 'Reviewing concepts...'}
          </p>
        )}
      </div>
    </div>
  )
}
