/**
 * ExponentialLogAnimation - Visual representation of exponential and logarithmic functions
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows exponential growth/decay curves
 * - Demonstrates logarithm as inverse of exponential
 * - Shows reflection over y = x line
 * - SETUP MODE (default): Shows both function types
 * - SOLUTION MODE: Animates relationship between exp and log
 *
 * Used for:
 * - Level K: exponential_functions, logarithms
 * - Concept introductions for exp/log relationships
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface ExponentialLogAnimationProps extends BaseAnimationProps {
  showBoth?: boolean
}

export default function ExponentialLogAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  showBoth: _showBoth = true,
}: ExponentialLogAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'              // Introduce exp & log relationship
    | 'exp_explain'        // Explain y = b^x form
    | 'exp_draw'           // Draw exponential curve
    | 'exp_properties'     // Show domain, range, asymptote
    | 'inverse_explain'    // Explain inverse relationship
    | 'reflection_show'    // Show y = x reflection line
    | 'log_explain'        // Explain y = log_b(x) form
    | 'log_draw'           // Draw logarithm curve
    | 'log_properties'     // Show domain, range, asymptote
    | 'complete'           // Summary
  >('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Base of exponential/log: [base, showLog]
  // Default: base 2 (y = 2^x and y = log₂x)
  const operands = problemData?.operands || [2, 1]
  const [base] = operands

  // Validate base: must be positive and not equal to 1 (log base 1 is undefined)
  const isValidBase = base > 0 && base !== 1 && !isNaN(base)

  // Early return with educational error message if invalid
  if (!isValidBase) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Logarithm Base</p>
          <p className="text-red-500 text-sm mt-2">
            {base === 1
              ? "The base cannot be 1. log₁(x) is undefined because 1 raised to any power always equals 1."
              : base <= 0
              ? "The base must be positive. Logarithms are only defined for positive bases not equal to 1."
              : "Please enter a valid number for the base."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>For y = b^x and y = log_b(x), the base b must satisfy: b {'>'} 0 and b ≠ 1</p>
          </div>
        </div>
      </div>
    )
  }

  // SVG dimensions
  const width = 300
  const height = 300
  const padding = 35
  const scale = (width - 2 * padding) / 10 // -3 to 7 range

  const toSvgX = (x: number) => padding + (x + 3) * scale
  const toSvgY = (y: number) => height - padding - (y + 3) * scale

  // Generate exponential curve points (y = base^x)
  const expPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -3; x <= 3; x += 0.1) {
      const y = Math.pow(base, x)
      if (y <= 7 && y >= -3) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [base])

  // Generate logarithmic curve points (y = log_base(x))
  const logPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = 0.1; x <= 7; x += 0.1) {
      const y = Math.log(x) / Math.log(base)
      if (y >= -3 && y <= 5) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [base])

  // Generate y = x line points
  const lineYEqualsX = useMemo(() => {
    return `${toSvgX(-3)},${toSvgY(-3)} ${toSvgX(6)},${toSvgY(6)}`
  }, [])

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // 10 phases, ~20 seconds total
    const TICK_MS = 100
    const PHASE_DURATION = 20 // 2 seconds per phase

    type PhaseType = 'setup' | 'exp_explain' | 'exp_draw' | 'exp_properties' |
      'inverse_explain' | 'reflection_show' | 'log_explain' |
      'log_draw' | 'log_properties' | 'complete'

    const phases: PhaseType[] = [
      'setup', 'exp_explain', 'exp_draw', 'exp_properties',
      'inverse_explain', 'reflection_show', 'log_explain',
      'log_draw', 'log_properties', 'complete'
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
        if (newPhase === 'exp_draw' || newPhase === 'log_draw') {
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
      {/* Equations Display */}
      <div className="text-center mb-4">
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-blue-50 px-3 py-1 rounded">
            <span className="text-sm text-blue-600">Exponential: </span>
            <span className="font-mono font-bold text-blue-700">y = {base}ˣ</span>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded">
            <span className="text-sm text-green-600">Logarithm: </span>
            <span className="font-mono font-bold text-green-700">y = log₍{base}₎x</span>
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
          {[-2, -1, 0, 1, 2, 3, 4, 5, 6].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i >= -2 && i <= 5 && (
                <line
                  x1={padding}
                  y1={toSvgY(i)}
                  x2={width - padding}
                  y2={toSvgY(i)}
                  stroke={i === 0 ? '#374151' : '#e5e7eb'}
                  strokeWidth={i === 0 ? 2 : 1}
                />
              )}
              {i !== 0 && i >= -2 && i <= 5 && (
                <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
              {i !== 0 && i >= -2 && i <= 5 && (
                <text x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* y = x line (reflection line) */}
          {(phase === 'reflection_show' || phase === 'log_explain' || phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.polyline
              points={lineYEqualsX}
              fill="none"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5,5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* y = x label */}
          {(phase === 'reflection_show' || phase === 'log_explain' || phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.text
              x={toSvgX(4.5)}
              y={toSvgY(5)}
              className="text-xs fill-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              y = x
            </motion.text>
          )}

          {/* Exponential curve (y = base^x) */}
          {(phase === 'exp_draw' || phase === 'exp_properties' || phase === 'inverse_explain' || phase === 'reflection_show' || phase === 'log_explain' || phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.polyline
              points={expPoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Horizontal asymptote for exponential (y = 0) */}
          {(phase === 'exp_draw' || phase === 'exp_properties' || phase === 'inverse_explain' || phase === 'reflection_show' || phase === 'log_explain' || phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.line
              x1={padding}
              y1={toSvgY(0)}
              x2={toSvgX(-2)}
              y2={toSvgY(0)}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}

          {/* Logarithmic curve (y = log_base(x)) */}
          {(phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.polyline
              points={logPoints}
              fill="none"
              stroke="#10b981"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Vertical asymptote for log (x = 0) */}
          {(phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <motion.line
              x1={toSvgX(0)}
              y1={toSvgY(-2)}
              x2={toSvgX(0)}
              y2={height - padding}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}

          {/* Key points */}
          {(phase === 'exp_draw' || phase === 'exp_properties' || phase === 'inverse_explain' || phase === 'reflection_show' || phase === 'log_explain' || phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
            <>
              {/* (0, 1) on exponential */}
              <motion.circle
                cx={toSvgX(0)}
                cy={toSvgY(1)}
                r={5}
                fill="#3b82f6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
              {/* (1, 0) on logarithm */}
              {(phase === 'log_draw' || phase === 'log_properties' || phase === 'complete') && (
                <motion.circle
                  cx={toSvgX(1)}
                  cy={toSvgY(0)}
                  r={5}
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </>
          )}

          {/* Labels for key points */}
          {phase === 'complete' && (
            <>
              <text x={toSvgX(0) + 8} y={toSvgY(1) - 5} className="text-xs fill-blue-500">(0, 1)</text>
              <text x={toSvgX(1) + 8} y={toSvgY(0) - 5} className="text-xs fill-green-500">(1, 0)</text>
            </>
          )}
        </svg>
      </div>

      {/* Information Panel */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[120px]">
        {phase === 'setup' ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Exponential & Logarithmic Functions</div>
            <div className="text-sm text-gray-600">
              <p>y = bˣ and y = log_b(x) are inverse functions</p>
              <p className="mt-1">They are reflections of each other over y = x</p>
            </div>
          </div>
        ) : phase === 'exp_explain' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: The Exponential Function</div>
            <div className="text-sm">
              <p>The exponential function has the form:</p>
              <p className="font-mono text-xl mt-2 text-blue-700">y = {base}ˣ</p>
              <p className="mt-2 text-gray-600">The base {base} is raised to the power x</p>
              <p className="text-gray-600">As x increases, y grows {base > 1 ? 'exponentially' : 'smaller'}</p>
            </div>
          </motion.div>
        ) : phase === 'exp_draw' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 2: Drawing the Curve</div>
            <div className="text-sm">
              <p>Watch the exponential curve being drawn!</p>
              <p className="mt-1">Notice how it passes through the point <span className="font-bold">(0, 1)</span></p>
              <p className="mt-1 text-gray-600">This is because {base}⁰ = 1 for any base</p>
            </div>
          </motion.div>
        ) : phase === 'exp_properties' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 3: Exponential Properties</div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm max-w-xs mx-auto">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold">Domain</div>
                <div>All real numbers</div>
                <div className="text-xs text-gray-500">x can be anything</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold">Range</div>
                <div>y {'>'} 0</div>
                <div className="text-xs text-gray-500">Always positive</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Horizontal asymptote: y = 0</p>
          </motion.div>
        ) : phase === 'inverse_explain' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 4: Inverse Functions</div>
            <div className="text-sm">
              <p>The logarithm is the <span className="font-bold">inverse</span> of the exponential</p>
              <p className="mt-2 font-mono bg-purple-50 p-2 rounded">
                If y = {base}ˣ, then x = log₍{base}₎(y)
              </p>
              <p className="mt-2 text-gray-600">Inverse functions "undo" each other!</p>
            </div>
          </motion.div>
        ) : phase === 'reflection_show' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-gray-600 mb-2">Step 5: The Reflection Line</div>
            <div className="text-sm">
              <p>The dashed line <span className="font-mono">y = x</span> is the line of reflection</p>
              <p className="mt-1">When we reflect y = {base}ˣ over this line...</p>
              <p className="mt-1 text-gray-600">We get y = log₍{base}₎(x)!</p>
              <p className="mt-2 text-gray-500">Reflecting swaps x and y coordinates</p>
            </div>
          </motion.div>
        ) : phase === 'log_explain' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 6: The Logarithmic Function</div>
            <div className="text-sm">
              <p>The logarithm answers: "{base} to what power gives x?"</p>
              <p className="font-mono text-xl mt-2 text-green-700">y = log₍{base}₎(x)</p>
              <p className="mt-2 text-gray-600">Example: log₍{base}₎({base * base}) = 2 because {base}² = {base * base}</p>
            </div>
          </motion.div>
        ) : phase === 'log_draw' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 7: Drawing the Log Curve</div>
            <div className="text-sm">
              <p>Watch the logarithm curve being drawn!</p>
              <p className="mt-1">Notice how it passes through the point <span className="font-bold">(1, 0)</span></p>
              <p className="mt-1 text-gray-600">This is because log₍{base}₎(1) = 0 (since {base}⁰ = 1)</p>
            </div>
          </motion.div>
        ) : phase === 'log_properties' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 8: Logarithm Properties</div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm max-w-xs mx-auto">
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold">Domain</div>
                <div>x {'>'} 0</div>
                <div className="text-xs text-gray-500">Only positive x</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold">Range</div>
                <div>All real numbers</div>
                <div className="text-xs text-gray-500">y can be anything</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Vertical asymptote: x = 0</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Complete!</div>
            <div className="text-sm">
              <p className="font-bold">Key Relationship:</p>
              <p className="font-mono mt-1">{base}^(log₍{base}₎x) = x</p>
              <p className="font-mono">log₍{base}₎({base}ˣ) = x</p>
              <p className="mt-2 text-gray-600">Inverse functions undo each other!</p>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Key Properties Reference */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-bold text-blue-700 text-center">y = {base}ˣ passes through</div>
          <div className="text-blue-600 text-center">(0, 1) always</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-bold text-green-700 text-center">y = log₍{base}₎x passes through</div>
          <div className="text-green-600 text-center">(1, 0) always</div>
        </div>
      </div>

      {/* Inverse Relationship */}
      <div className="bg-purple-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-purple-800">
          <strong>Key Relationship:</strong> {base}^(log₍{base}₎x) = x and log₍{base}₎({base}ˣ) = x
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Explore exp & log functions</p>
            <p className="text-sm mt-1 text-gray-500">See how they are inverses of each other</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Inverse functions shown!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding exp & log...'}
            {phase === 'exp_explain' && 'Explaining exponential form...'}
            {phase === 'exp_draw' && 'Drawing exponential curve...'}
            {phase === 'exp_properties' && 'Showing exponential properties...'}
            {phase === 'inverse_explain' && 'Understanding inverse functions...'}
            {phase === 'reflection_show' && 'Showing reflection line...'}
            {phase === 'log_explain' && 'Explaining logarithm form...'}
            {phase === 'log_draw' && 'Drawing logarithm curve...'}
            {phase === 'log_properties' && 'Showing logarithm properties...'}
          </p>
        )}
      </div>
    </div>
  )
}
