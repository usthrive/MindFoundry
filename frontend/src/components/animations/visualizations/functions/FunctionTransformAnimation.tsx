/**
 * FunctionTransformAnimation - Visual representation of function transformations
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows parent function and transformed function
 * - Demonstrates shifts (horizontal/vertical)
 * - Shows stretches and reflections
 * - SETUP MODE (default): Shows parent function
 * - SOLUTION MODE: Animates transformation step by step
 *
 * Used for:
 * - Level K: quadratic_function_graphing, maxima_minima
 * - Concept introductions for function transformations
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface FunctionTransformAnimationProps extends BaseAnimationProps {
  transformType?: 'shift' | 'stretch' | 'reflect'
  isPaused?: boolean
}

// Phase type for detailed step-by-step animation
type Phase =
  | 'setup'           // Show general form y = a(x-h)² + k
  | 'identify_a'      // Explain what 'a' does (stretch/reflect)
  | 'identify_h'      // Explain what 'h' does (horizontal shift)
  | 'identify_k'      // Explain what 'k' does (vertical shift)
  | 'parent'          // Show parent function y = x²
  | 'apply_a'         // Apply stretch/reflect transformation
  | 'apply_h'         // Apply horizontal shift
  | 'apply_k'         // Apply vertical shift
  | 'final_graph'     // Show final transformed graph
  | 'vertex'          // Highlight new vertex position
  | 'complete'

export default function FunctionTransformAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  transformType = 'shift',
}: FunctionTransformAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract transformation parameters: [a, h, k] for y = a(x-h)² + k
  // Default: y = 2(x-3)² + 1 (stretch by 2, shift right 3, up 1)
  const operands = problemData?.operands || [2, 3, 1]
  // Validate operands with safe defaults to prevent NaN
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 2
  const h = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 3
  const k = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 1

  // SVG dimensions
  const width = 280
  const height = 280
  const padding = 30
  const scale = (width - 2 * padding) / 10 // -5 to 5 range

  const toSvgX = (x: number) => padding + (x + 5) * scale
  const toSvgY = (y: number) => height - padding - (y + 2) * scale // Adjusted for better visibility

  // Generate parent function points (y = x²)
  const parentPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -4; x <= 4; x += 0.2) {
      const y = x * x
      if (y <= 8) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [])

  // Generate transformed function points (y = a(x-h)² + k)
  const transformedPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -4; x <= 6; x += 0.2) {
      const y = a * Math.pow(x - h, 2) + k
      if (y >= -2 && y <= 8) {
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
    // Total ~22 seconds with 11 phases at 2 seconds each
    const TICK_MS = 100
    const PHASE_TICKS = 20 // 2 seconds per phase

    const phases: Phase[] = [
      'setup',
      'identify_a',
      'identify_h',
      'identify_k',
      'parent',
      'apply_a',
      'apply_h',
      'apply_k',
      'final_graph',
      'vertex',
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
        if (newPhase === 'parent') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format the transformed equation
  const formatEquation = () => {
    let eq = 'y = '
    if (a !== 1) eq += `${a}`
    eq += '(x'
    if (h !== 0) eq += ` ${h > 0 ? '-' : '+'} ${Math.abs(h)}`
    eq += ')²'
    if (k !== 0) eq += ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`
    return eq
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equations Display */}
      <div className="text-center mb-4">
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-blue-50 px-3 py-1 rounded">
            <span className="text-sm text-blue-600">Parent: </span>
            <span className="font-mono font-bold text-blue-700">y = x²</span>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded">
            <span className="text-sm text-green-600">Transformed: </span>
            <span className="font-mono font-bold text-green-700">{formatEquation()}</span>
          </div>
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
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              <line
                x1={padding}
                y1={toSvgY(i)}
                x2={width - padding}
                y2={toSvgY(i)}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i !== 0 && (
                <>
                  <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
                  <text x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
                </>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Parent function (y = x²) - dashed blue */}
          {['parent', 'apply_a', 'apply_h', 'apply_k', 'final_graph', 'vertex', 'complete'].includes(phase) && (
            <motion.polyline
              points={parentPoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5,5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Parent function vertex (0, 0) */}
          {['parent', 'apply_a'].includes(phase) && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <circle cx={toSvgX(0)} cy={toSvgY(0)} r={5} fill="#3b82f6" />
              <text x={toSvgX(0) - 10} y={toSvgY(0) - 10} className="text-xs fill-blue-500 font-medium">(0, 0)</text>
            </motion.g>
          )}

          {/* Transformed function - solid green */}
          {['final_graph', 'vertex', 'complete'].includes(phase) && (
            <motion.polyline
              points={transformedPoints}
              fill="none"
              stroke="#10b981"
              strokeWidth={3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Horizontal shift arrow (during apply_h phase) */}
          {phase === 'apply_h' && h !== 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(h)}
                y2={toSvgY(0)}
                stroke="#f97316"
                strokeWidth={3}
                markerEnd="url(#arrowhead)"
              />
              <text x={toSvgX(h / 2)} y={toSvgY(0) + 20} textAnchor="middle" className="text-sm fill-orange-600 font-bold">
                {h > 0 ? `→ ${h}` : `← ${Math.abs(h)}`}
              </text>
              {/* Show intermediate point */}
              <circle cx={toSvgX(h)} cy={toSvgY(0)} r={5} fill="#f97316" />
            </motion.g>
          )}

          {/* Vertical shift arrow (during apply_k phase) */}
          {phase === 'apply_k' && k !== 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line
                x1={toSvgX(h)}
                y1={toSvgY(0)}
                x2={toSvgX(h)}
                y2={toSvgY(k)}
                stroke="#9333ea"
                strokeWidth={3}
                markerEnd="url(#arrowhead-purple)"
              />
              <text x={toSvgX(h) + 20} y={toSvgY(k / 2)} className="text-sm fill-purple-600 font-bold">
                {k > 0 ? `↑ ${k}` : `↓ ${Math.abs(k)}`}
              </text>
              {/* Show vertex position */}
              <circle cx={toSvgX(h)} cy={toSvgY(k)} r={5} fill="#9333ea" />
            </motion.g>
          )}

          {/* Vertex point of transformed function (final phases) */}
          {['final_graph', 'vertex', 'complete'].includes(phase) && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvgX(h)}
                cy={toSvgY(k)}
                r={7}
                fill="#ef4444"
              />
              <text
                x={toSvgX(h) + 12}
                y={toSvgY(k) - 12}
                className="text-sm fill-red-500 font-bold"
              >
                ({h}, {k})
              </text>
            </motion.g>
          )}

          {/* Transformation arrows showing full journey (final phases) */}
          {['final_graph', 'vertex', 'complete'].includes(phase) && (h !== 0 || k !== 0) && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            >
              {/* Horizontal arrow */}
              {h !== 0 && (
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(h)}
                  y2={toSvgY(0)}
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
              )}
              {/* Vertical arrow */}
              {k !== 0 && (
                <line
                  x1={toSvgX(h)}
                  y1={toSvgY(0)}
                  x2={toSvgX(h)}
                  y2={toSvgY(k)}
                  stroke="#9333ea"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
              )}
            </motion.g>
          )}

          {/* Arrow marker definitions */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#f97316"
              />
            </marker>
            <marker
              id="arrowhead-purple"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#9333ea"
              />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Transformation Info - Detailed step-by-step explanations */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Function Transformations</div>
            <div className="text-sm text-gray-600">
              <p className="font-mono text-base">y = a(x - h)² + k</p>
              <p className="mt-2">This transforms the parent function y = x²</p>
              <p className="mt-1 text-xs text-gray-500">Let's explore each parameter...</p>
            </div>
          </div>
        )}

        {phase === 'identify_a' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-pink-600 mb-2">Understanding "a" = {a}</div>
            <div className="bg-pink-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold text-pink-700">Vertical Stretch/Reflect</p>
              <div className="text-sm mt-2 space-y-1">
                {Math.abs(a) > 1 && <p>• |a| = {Math.abs(a)} &gt; 1: Graph is <span className="font-bold">narrower</span> (stretched)</p>}
                {Math.abs(a) < 1 && Math.abs(a) > 0 && <p>• |a| = {Math.abs(a)} &lt; 1: Graph is <span className="font-bold">wider</span> (compressed)</p>}
                {Math.abs(a) === 1 && <p>• |a| = 1: Graph has <span className="font-bold">same width</span> as parent</p>}
                {a < 0 && <p>• a &lt; 0: Graph is <span className="font-bold text-red-600">reflected</span> over x-axis</p>}
                {a > 0 && <p>• a &gt; 0: Graph <span className="font-bold">opens upward</span></p>}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'identify_h' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-orange-600 mb-2">Understanding "h" = {h}</div>
            <div className="bg-orange-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold text-orange-700">Horizontal Shift</p>
              <div className="text-sm mt-2 space-y-1">
                <p>• The graph shifts <span className="font-bold">{h > 0 ? `RIGHT by ${h}` : h < 0 ? `LEFT by ${Math.abs(h)}` : 'no horizontal shift'}</span></p>
                <p className="text-xs text-gray-600 mt-2">Note: (x - h) means opposite direction!</p>
                <p className="text-xs text-gray-600">When h = {h}, we write (x - {h})</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'identify_k' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-600 mb-2">Understanding "k" = {k}</div>
            <div className="bg-purple-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold text-purple-700">Vertical Shift</p>
              <div className="text-sm mt-2 space-y-1">
                <p>• The graph shifts <span className="font-bold">{k > 0 ? `UP by ${k}` : k < 0 ? `DOWN by ${Math.abs(k)}` : 'no vertical shift'}</span></p>
                <p className="text-xs text-gray-600 mt-2">k is added at the end: + {k}</p>
                <p className="text-xs text-gray-600">This moves the whole graph vertically</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'parent' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: Parent Function</div>
            <div className="font-mono text-2xl text-blue-700">y = x²</div>
            <div className="text-sm text-gray-500 mt-2">
              <p>Vertex at origin <span className="font-bold">(0, 0)</span></p>
              <p className="text-xs mt-1">This is our starting point</p>
            </div>
          </motion.div>
        )}

        {phase === 'apply_a' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-pink-600 mb-2">Step 2: Apply Stretch (a = {a})</div>
            <div className="bg-pink-50 p-3 rounded-lg max-w-sm mx-auto">
              <div className="font-mono text-lg">y = x² → y = {a}x²</div>
              <div className="text-sm mt-2">
                {a !== 1 ? (
                  <p>Multiply all y-values by {a}</p>
                ) : (
                  <p>No stretch needed (a = 1)</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'apply_h' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 3: Apply Horizontal Shift (h = {h})</div>
            <div className="bg-orange-50 p-3 rounded-lg max-w-sm mx-auto">
              <div className="font-mono text-lg">y = {a}x² → y = {a}(x - {h})²</div>
              <div className="text-sm mt-2">
                <p>Shift {h > 0 ? 'right' : h < 0 ? 'left' : 'no shift'} by {Math.abs(h)} {Math.abs(h) === 1 ? 'unit' : 'units'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'apply_k' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 4: Apply Vertical Shift (k = {k})</div>
            <div className="bg-purple-50 p-3 rounded-lg max-w-sm mx-auto">
              <div className="font-mono text-lg">{formatEquation()}</div>
              <div className="text-sm mt-2">
                <p>Shift {k > 0 ? 'up' : k < 0 ? 'down' : 'no shift'} by {Math.abs(k)} {Math.abs(k) === 1 ? 'unit' : 'units'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'final_graph' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Final Transformed Graph</div>
            <div className="font-mono text-xl text-green-700">{formatEquation()}</div>
            <div className="grid grid-cols-3 gap-2 text-xs mt-3 max-w-xs mx-auto">
              <div className="bg-pink-100 p-1 rounded"><span className="font-bold">a={a}</span></div>
              <div className="bg-orange-100 p-1 rounded"><span className="font-bold">h={h}</span></div>
              <div className="bg-purple-100 p-1 rounded"><span className="font-bold">k={k}</span></div>
            </div>
          </motion.div>
        )}

        {(phase === 'vertex' || phase === 'complete') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Result: New Vertex</div>
            <div className="font-mono text-xl text-green-600">{formatEquation()}</div>
            <div className="bg-red-50 p-2 rounded-lg mt-2 max-w-xs mx-auto">
              <p className="text-red-600 font-semibold">Vertex: ({h}, {k})</p>
              <p className="text-xs text-gray-500 mt-1">
                Moved from (0, 0) to ({h}, {k})
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Transformation Rules Reference */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
        <div className="bg-orange-50 p-2 rounded text-center">
          <div className="font-bold text-orange-700">h shifts</div>
          <div className="text-orange-600">Left/Right</div>
        </div>
        <div className="bg-purple-50 p-2 rounded text-center">
          <div className="font-bold text-purple-700">k shifts</div>
          <div className="text-purple-600">Up/Down</div>
        </div>
        <div className="bg-pink-50 p-2 rounded text-center">
          <div className="font-bold text-pink-700">a stretches</div>
          <div className="text-pink-600">Vertical</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Transform the function</p>
            <p className="text-sm mt-1 text-gray-500">See how a, h, and k change the graph step by step</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Transformation complete!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding the general form...'}
            {phase === 'identify_a' && 'Learning about parameter a...'}
            {phase === 'identify_h' && 'Learning about parameter h...'}
            {phase === 'identify_k' && 'Learning about parameter k...'}
            {phase === 'parent' && 'Starting with parent function...'}
            {phase === 'apply_a' && 'Applying vertical stretch...'}
            {phase === 'apply_h' && 'Applying horizontal shift...'}
            {phase === 'apply_k' && 'Applying vertical shift...'}
            {phase === 'final_graph' && 'Viewing final graph...'}
            {phase === 'vertex' && 'Identifying new vertex...'}
          </p>
        )}
      </div>
    </div>
  )
}
