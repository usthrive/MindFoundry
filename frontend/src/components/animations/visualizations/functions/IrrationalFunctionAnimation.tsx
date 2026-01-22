/**
 * IrrationalFunctionAnimation - Visual representation of irrational (root) functions
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows √x graph with domain restrictions
 * - Highlights starting point and curve direction
 * - Demonstrates transformations of root functions
 * - SETUP MODE (default): Shows equation and domain
 * - SOLUTION MODE: Animates curve plotting
 *
 * Used for:
 * - Level K: irrational_functions
 * - Concept introductions for root functions
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

// Detailed phase type for step-by-step animation
type Phase =
  | 'setup'           // Explain general form y = a√(x-h) + k
  | 'identify_params' // Identify a, h, k values from equation
  | 'find_domain'     // Find domain by solving x - h ≥ 0
  | 'domain_visual'   // Show domain on graph (shaded invalid region)
  | 'find_start'      // Calculate starting point (h, k)
  | 'startpoint'      // Show starting point on graph
  | 'curve_direction' // Explain curve direction based on 'a'
  | 'curve'           // Draw the curve
  | 'complete'

export interface IrrationalFunctionAnimationProps extends BaseAnimationProps {
  rootType?: 'square' | 'cube'
  isPaused?: boolean
}

export default function IrrationalFunctionAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  rootType: _rootType = 'square',
}: IrrationalFunctionAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract parameters: [a, h, k] for y = a√(x-h) + k
  // Default: y = √(x-1) + 2 (shift right 1, up 2)
  const operands = problemData?.operands || [1, 1, 2]
  // Validate operands with safe defaults to prevent NaN
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 1
  const h = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 1
  const k = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 2

  // SVG dimensions
  const width = 280
  const height = 280
  const padding = 30
  const scale = (width - 2 * padding) / 10 // -2 to 8 range horizontally

  const toSvgX = (x: number) => padding + (x + 2) * scale
  const toSvgY = (y: number) => height - padding - (y + 1) * scale

  // Generate curve points for √(x-h) + k
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = h; x <= 10; x += 0.1) {
      const y = a * Math.sqrt(x - h) + k
      if (y >= -1 && y <= 8) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [a, h, k])

  // Animation effect for solution mode - interval-based with tick counting for pause support
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // Total ~18 seconds with 9 phases at 2 seconds each
    const TICK_MS = 100
    const PHASE_TICKS = 20 // 2 seconds per phase

    const phases: Phase[] = [
      'setup',
      'identify_params',
      'find_domain',
      'domain_visual',
      'find_start',
      'startpoint',
      'curve_direction',
      'curve',
      'complete',
    ]

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const phaseIndex = Math.floor(tickRef.current / PHASE_TICKS)

      if (phaseIndex >= phases.length - 1) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
        return
      }

      const newPhase = phases[phaseIndex]
      if (newPhase && newPhase !== phase) {
        setPhase(newPhase)
        if (newPhase === 'domain_visual' || newPhase === 'curve') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format the equation
  const formatEquation = () => {
    let eq = 'y = '
    if (a !== 1 && a !== -1) eq += `${a}`
    if (a === -1) eq += '-'
    eq += '√('
    if (h === 0) {
      eq += 'x'
    } else {
      eq += `x ${h > 0 ? '-' : '+'} ${Math.abs(h)}`
    }
    eq += ')'
    if (k !== 0) eq += ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`
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

      {/* Domain Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 rounded-lg p-3 mb-4 text-center"
      >
        <div className="text-sm text-yellow-600 mb-1">Domain Restriction</div>
        <div className="text-lg font-mono font-bold text-yellow-700">
          x ≥ {h}
        </div>
        <div className="text-xs text-yellow-600 mt-1">
          (radicand must be ≥ 0)
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
          {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map(i => (
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
              {i !== 0 && i >= -1 && i <= 7 && (
                <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
              {i >= 1 && i <= 5 && (
                <text x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Domain boundary (vertical line at x = h) - show from domain_visual onward */}
          {['domain_visual', 'find_start', 'startpoint', 'curve_direction', 'curve', 'complete'].includes(phase) && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <line
                x1={toSvgX(h)}
                y1={padding}
                x2={toSvgX(h)}
                y2={height - padding}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
              <text
                x={toSvgX(h) - 5}
                y={height - padding + 25}
                textAnchor="middle"
                className="text-sm fill-amber-600 font-bold"
              >
                x = {h}
              </text>
              {/* Shaded invalid region */}
              <rect
                x={padding}
                y={padding}
                width={Math.max(0, toSvgX(h) - padding)}
                height={height - 2 * padding}
                fill="#fee2e2"
                opacity={0.3}
              />
              {h > -1 && (
                <text
                  x={padding + (toSvgX(h) - padding) / 2}
                  y={height / 2}
                  textAnchor="middle"
                  className="text-sm fill-red-500 font-medium"
                >
                  undefined
                </text>
              )}
            </motion.g>
          )}

          {/* Starting point - show from startpoint onward */}
          {['startpoint', 'curve_direction', 'curve', 'complete'].includes(phase) && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvgX(h)}
                cy={toSvgY(k)}
                r={7}
                fill="#10b981"
              />
              <text
                x={toSvgX(h) + 12}
                y={toSvgY(k) - 12}
                className="text-sm fill-green-600 font-bold"
              >
                ({h}, {k})
              </text>
            </motion.g>
          )}

          {/* Square root curve */}
          {['curve', 'complete'].includes(phase) && (
            <motion.polyline
              points={curvePoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          )}

          {/* Direction arrow during curve_direction phase */}
          {phase === 'curve_direction' && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Show direction indicator from starting point */}
              <line
                x1={toSvgX(h)}
                y1={toSvgY(k)}
                x2={toSvgX(h + 2)}
                y2={toSvgY(k + a * Math.sqrt(2))}
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="6,3"
                markerEnd="url(#arrowhead-blue)"
              />
            </motion.g>
          )}

          {/* Direction arrow after curve complete */}
          {phase === 'complete' && (
            <motion.text
              x={toSvgX(Math.min(6, h + 5))}
              y={toSvgY(a * Math.sqrt(Math.min(5, 6 - h)) + k) - 10}
              className="text-xl fill-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {a > 0 ? '↗' : '↘'}
            </motion.text>
          )}

          {/* Arrow marker for direction */}
          <defs>
            <marker
              id="arrowhead-blue"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Information Panel - Detailed step-by-step explanations */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Square Root Functions</div>
            <div className="text-sm text-gray-600">
              <p className="font-mono text-base">y = a√(x - h) + k</p>
              <p className="mt-2">y = √x is only defined for x ≥ 0</p>
              <p className="mt-1 text-xs text-gray-500">Let's graph this step by step...</p>
            </div>
          </div>
        )}

        {phase === 'identify_params' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Identifying Parameters</div>
            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
              <div className="bg-pink-50 p-2 rounded">
                <div className="font-bold text-pink-700">a = {a}</div>
                <div className="text-xs text-gray-500">{a < 0 ? 'Reflects' : 'Stretch'}</div>
              </div>
              <div className="bg-amber-50 p-2 rounded">
                <div className="font-bold text-amber-700">h = {h}</div>
                <div className="text-xs text-gray-500">Shift right</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-bold text-green-700">k = {k}</div>
                <div className="text-xs text-gray-500">Shift up</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              From: {formatEquation()}
            </p>
          </motion.div>
        )}

        {phase === 'find_domain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-amber-600 mb-2">Step 1: Find the Domain</div>
            <div className="bg-amber-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold">Radicand must be ≥ 0:</p>
              <div className="font-mono text-lg mt-2">x - {h} ≥ 0</div>
              <div className="font-mono text-lg font-bold text-amber-600 mt-1">x ≥ {h}</div>
              <p className="text-xs text-gray-600 mt-2">
                We cannot take the square root of negative numbers
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'domain_visual' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-amber-600 mb-2">Domain Visualization</div>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-red-50 p-2 rounded">
                <div className="font-semibold text-red-700">Undefined</div>
                <div className="font-mono text-sm">x &lt; {h}</div>
                <div className="text-xs text-gray-500">Shaded region</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">Defined</div>
                <div className="font-mono text-sm">x ≥ {h}</div>
                <div className="text-xs text-gray-500">Valid inputs</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'find_start' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Step 2: Find Starting Point</div>
            <div className="bg-green-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold">When x = {h} (domain boundary):</p>
              <div className="font-mono text-sm mt-2">
                y = {a === 1 ? '' : a}√({h} - {h}) + {k}
              </div>
              <div className="font-mono text-sm mt-1">
                y = {a === 1 ? '' : a}√(0) + {k}
              </div>
              <div className="font-mono text-lg font-bold text-green-600 mt-1">
                y = {k}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'startpoint' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Starting Point Located</div>
            <div className="bg-green-100 p-3 rounded-lg max-w-xs mx-auto">
              <div className="text-xl font-bold text-green-700">({h}, {k})</div>
              <p className="text-sm text-gray-600 mt-2">
                This is where the curve begins!
              </p>
              <p className="text-xs text-gray-500 mt-1">
                The square root of 0 is 0, so y starts at {k}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'curve_direction' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 3: Determine Direction</div>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-700">Horizontal</div>
                <div className="text-sm">Always extends right</div>
                <div className="text-xs text-gray-500">x increases from {h}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="font-semibold text-purple-700">Vertical</div>
                <div className="text-sm">{a > 0 ? 'Goes up' : 'Goes down'}</div>
                <div className="text-xs text-gray-500">a = {a} ({a > 0 ? '+' : '-'})</div>
              </div>
            </div>
          </motion.div>
        )}

        {(phase === 'curve' || phase === 'complete') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Curve Complete!</div>
            <div className="grid grid-cols-2 gap-2 text-sm max-w-xs mx-auto">
              <div className="bg-amber-50 p-2 rounded">
                <div className="font-semibold text-amber-700">Domain</div>
                <div>x ≥ {h}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="font-semibold text-purple-700">Range</div>
                <div>{a > 0 ? `y ≥ ${k}` : `y ≤ ${k}`}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">Start</div>
                <div>({h}, {k})</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-700">Direction</div>
                <div>{a > 0 ? 'Up & Right' : 'Down & Right'}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Properties Reference */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
        <div className="bg-amber-50 p-2 rounded text-center">
          <div className="font-bold text-amber-700">h shifts</div>
          <div className="text-amber-600">Start point</div>
        </div>
        <div className="bg-green-50 p-2 rounded text-center">
          <div className="font-bold text-green-700">k shifts</div>
          <div className="text-green-600">Vertical</div>
        </div>
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="font-bold text-blue-700">a reflects</div>
          <div className="text-blue-600">If negative</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Graph the root function</p>
            <p className="text-sm mt-1 text-gray-500">Find domain, starting point, and curve step by step</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Root function graphed!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding root functions...'}
            {phase === 'identify_params' && 'Identifying parameters...'}
            {phase === 'find_domain' && 'Finding the domain...'}
            {phase === 'domain_visual' && 'Visualizing domain restriction...'}
            {phase === 'find_start' && 'Calculating starting point...'}
            {phase === 'startpoint' && 'Locating starting point on graph...'}
            {phase === 'curve_direction' && 'Determining curve direction...'}
            {phase === 'curve' && 'Drawing the curve...'}
          </p>
        )}
      </div>
    </div>
  )
}
