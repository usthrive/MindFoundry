/**
 * RationalFunctionAnimation - Visual representation of rational functions
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows rational function on coordinate plane
 * - Highlights vertical and horizontal asymptotes
 * - Demonstrates behavior near asymptotes
 * - SETUP MODE (default): Shows equation and empty grid
 * - SOLUTION MODE: Animates curve drawing with asymptotes
 *
 * Used for:
 * - Level K: rational_functions
 * - Concept introductions for rational functions
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface RationalFunctionAnimationProps extends BaseAnimationProps {
  isPaused?: boolean
}

// Detailed phase type for step-by-step animation
type Phase =
  | 'setup'           // Explain rational function form
  | 'identify_params' // Identify a, h, k values
  | 'find_va'         // Find vertical asymptote
  | 'find_ha'         // Find horizontal asymptote
  | 'asymptotes'      // Show both asymptotes on graph
  | 'domain_range'    // Explain domain and range
  | 'curve_left'      // Draw left branch
  | 'curve_right'     // Draw right branch
  | 'behavior'        // Analyze end behavior
  | 'complete'

export default function RationalFunctionAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: RationalFunctionAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: f(x) = 1/(x-2) + 1
  // Vertical asymptote at x = 2, horizontal asymptote at y = 1
  const operands = problemData?.operands || [1, 2, 1]
  // Validate operands with safe defaults to prevent NaN
  const a = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 1
  const h = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 2
  const k = typeof operands[2] === 'number' && !isNaN(operands[2]) ? operands[2] : 1

  // SVG dimensions
  const width = 280
  const height = 280
  const padding = 30
  const scale = (width - 2 * padding) / 10 // -5 to 5 range

  const toSvgX = (x: number) => padding + (x + 5) * scale
  const toSvgY = (y: number) => height - padding - (y + 3) * scale

  // Generate curve points for left of asymptote
  const leftCurvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -5; x < h - 0.3; x += 0.1) {
      const y = a / (x - h) + k
      if (y >= -4 && y <= 6) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [a, h, k])

  // Generate curve points for right of asymptote
  const rightCurvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = h + 0.3; x <= 7; x += 0.1) {
      const y = a / (x - h) + k
      if (y >= -4 && y <= 6) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [a, h, k])

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // Total ~20 seconds with 10 phases at 2 seconds each
    const TICK_MS = 100
    const PHASE_TICKS = 20 // 2 seconds per phase

    const phases: Phase[] = [
      'setup',
      'identify_params',
      'find_va',
      'find_ha',
      'asymptotes',
      'domain_range',
      'curve_left',
      'curve_right',
      'behavior',
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
        if (newPhase === 'asymptotes' || newPhase === 'curve_left') {
          playWhoosh()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format the equation - handles negative h correctly
  const formatEquation = () => {
    let eq = 'f(x) = '
    if (a !== 1) eq += `${a}`
    eq += '/(x'
    // FIX: Handle negative h properly - "x - -4" should be "x + 4"
    if (h > 0) {
      eq += ` - ${h}`
    } else if (h < 0) {
      eq += ` + ${Math.abs(h)}`
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

      {/* Graph */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid lines */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i >= -3 && i <= 5 && (
                <line
                  x1={padding}
                  y1={toSvgY(i)}
                  x2={width - padding}
                  y2={toSvgY(i)}
                  stroke={i === 0 ? '#374151' : '#e5e7eb'}
                  strokeWidth={i === 0 ? 2 : 1}
                />
              )}
              {i !== 0 && i >= -4 && i <= 4 && (
                <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
            </g>
          ))}

          {/* Y-axis labels */}
          {[-2, -1, 1, 2, 3, 4].map(i => (
            <text key={`y-${i}`} x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Vertical asymptote - show from find_va phase onward */}
          {['find_va', 'find_ha', 'asymptotes', 'domain_range', 'curve_left', 'curve_right', 'behavior', 'complete'].includes(phase) && (
            <motion.line
              x1={toSvgX(h)}
              y1={padding}
              x2={toSvgX(h)}
              y2={height - padding}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Vertical asymptote label */}
          {['find_va', 'find_ha', 'asymptotes', 'domain_range', 'curve_left', 'curve_right', 'behavior', 'complete'].includes(phase) && (
            <motion.text
              x={toSvgX(h) + 5}
              y={padding + 15}
              className="text-sm fill-red-500 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              x = {h}
            </motion.text>
          )}

          {/* Horizontal asymptote - show from find_ha phase onward */}
          {['find_ha', 'asymptotes', 'domain_range', 'curve_left', 'curve_right', 'behavior', 'complete'].includes(phase) && (
            <motion.line
              x1={padding}
              y1={toSvgY(k)}
              x2={width - padding}
              y2={toSvgY(k)}
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Horizontal asymptote label */}
          {['find_ha', 'asymptotes', 'domain_range', 'curve_left', 'curve_right', 'behavior', 'complete'].includes(phase) && (
            <motion.text
              x={width - padding - 35}
              y={toSvgY(k) - 5}
              className="text-sm fill-orange-500 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              y = {k}
            </motion.text>
          )}

          {/* Left branch of curve */}
          {['curve_left', 'curve_right', 'behavior', 'complete'].includes(phase) && leftCurvePoints && (
            <motion.polyline
              points={leftCurvePoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Right branch of curve */}
          {['curve_right', 'behavior', 'complete'].includes(phase) && rightCurvePoints && (
            <motion.polyline
              points={rightCurvePoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Behavior arrows */}
          {['behavior', 'complete'].includes(phase) && (
            <>
              {/* Arrow showing approach to vertical asymptote from left */}
              <motion.text
                x={toSvgX(h) - 25}
                y={toSvgY(4)}
                className="text-xl fill-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ↗
              </motion.text>
              {/* Arrow showing approach from right */}
              <motion.text
                x={toSvgX(h) + 15}
                y={toSvgY(-2)}
                className="text-xl fill-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ↘
              </motion.text>
              {/* Arrow showing approach to horizontal asymptote */}
              <motion.text
                x={toSvgX(5)}
                y={toSvgY(k) + 20}
                className="text-xl fill-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                →
              </motion.text>
            </>
          )}
        </svg>
      </div>

      {/* Information Panel - Detailed step-by-step explanations */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Rational Functions</div>
            <div className="text-sm text-gray-600">
              <p className="font-mono text-base">f(x) = a/(x - h) + k</p>
              <p className="mt-2">Functions with polynomials in numerator and denominator</p>
              <p className="mt-1 text-xs text-gray-500">Let's learn to graph this step by step...</p>
            </div>
          </div>
        )}

        {phase === 'identify_params' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Identifying Parameters</div>
            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-bold text-blue-700">a = {a}</div>
                <div className="text-xs text-gray-500">Numerator</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="font-bold text-red-700">h = {h}</div>
                <div className="text-xs text-gray-500">Shift right</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="font-bold text-orange-700">k = {k}</div>
                <div className="text-xs text-gray-500">Shift up</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              From: {formatEquation()}
            </p>
          </motion.div>
        )}

        {phase === 'find_va' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-red-600 mb-2">Step 1: Find Vertical Asymptote</div>
            <div className="bg-red-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold">Set denominator = 0:</p>
              <div className="font-mono text-lg mt-2">
                x - {h} = 0
              </div>
              <div className="font-mono text-lg font-bold text-red-600 mt-1">
                x = {h}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                The function is undefined when x = {h}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'find_ha' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 2: Find Horizontal Asymptote</div>
            <div className="bg-orange-50 p-3 rounded-lg max-w-sm mx-auto">
              <p className="font-semibold">As x → ±∞:</p>
              <div className="text-sm mt-2">
                <p>{a}/(x - {h}) → 0 (approaches zero)</p>
                <p className="mt-1">So f(x) → 0 + {k} = {k}</p>
              </div>
              <div className="font-mono text-lg font-bold text-orange-600 mt-2">
                y = {k}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'asymptotes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Both Asymptotes Found</div>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-red-100 p-2 rounded">
                <div className="font-semibold text-red-700">Vertical</div>
                <div className="text-lg font-mono">x = {h}</div>
                <div className="text-xs text-gray-500">denominator = 0</div>
              </div>
              <div className="bg-orange-100 p-2 rounded">
                <div className="font-semibold text-orange-700">Horizontal</div>
                <div className="text-lg font-mono">y = {k}</div>
                <div className="text-xs text-gray-500">as x → ±∞</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'domain_range' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 3: Domain & Range</div>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="bg-purple-50 p-2 rounded">
                <div className="font-semibold text-purple-700">Domain</div>
                <div className="font-mono text-sm">x ≠ {h}</div>
                <div className="text-xs text-gray-500">All reals except {h}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">Range</div>
                <div className="font-mono text-sm">y ≠ {k}</div>
                <div className="text-xs text-gray-500">All reals except {k}</div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'curve_left' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 4: Draw Left Branch</div>
            <div className="text-sm text-gray-600">
              <p>For x &lt; {h}, the curve is on the left side</p>
              <p className="mt-1">It approaches the vertical asymptote but never touches it</p>
              <p className="mt-1 text-xs text-gray-500">
                {a > 0 ? 'Goes up toward +∞ as x → h⁻' : 'Goes down toward -∞ as x → h⁻'}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'curve_right' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 5: Draw Right Branch</div>
            <div className="text-sm text-gray-600">
              <p>For x &gt; {h}, the curve is on the right side</p>
              <p className="mt-1">Both branches approach the horizontal asymptote</p>
              <p className="mt-1 text-xs text-gray-500">
                {a > 0 ? 'Goes down toward -∞ as x → h⁺' : 'Goes up toward +∞ as x → h⁺'}
              </p>
            </div>
          </motion.div>
        )}

        {(phase === 'behavior' || phase === 'complete') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">End Behavior Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm max-w-sm mx-auto">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold">As x → {h}⁻</div>
                <div>f(x) → {a > 0 ? '+∞' : '-∞'}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold">As x → {h}⁺</div>
                <div>f(x) → {a > 0 ? '-∞' : '+∞'}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded col-span-2">
                <div className="font-semibold">As x → ±∞</div>
                <div>f(x) → {k} (horizontal asymptote)</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Asymptote Rules Reference */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-red-50 p-2 rounded text-center">
          <div className="font-bold text-red-700">Vertical Asymptote</div>
          <div className="text-red-600">Where denominator = 0</div>
        </div>
        <div className="bg-orange-50 p-2 rounded text-center">
          <div className="font-bold text-orange-700">Horizontal Asymptote</div>
          <div className="text-orange-600">Compare degrees of num/denom</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Graph the rational function</p>
            <p className="text-sm mt-1 text-gray-500">Find asymptotes and sketch the curve step by step</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Rational function graphed!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Understanding rational functions...'}
            {phase === 'identify_params' && 'Identifying parameters...'}
            {phase === 'find_va' && 'Finding vertical asymptote...'}
            {phase === 'find_ha' && 'Finding horizontal asymptote...'}
            {phase === 'asymptotes' && 'Reviewing both asymptotes...'}
            {phase === 'domain_range' && 'Determining domain and range...'}
            {phase === 'curve_left' && 'Drawing left branch...'}
            {phase === 'curve_right' && 'Drawing right branch...'}
            {phase === 'behavior' && 'Analyzing end behavior...'}
          </p>
        )}
      </div>
    </div>
  )
}
