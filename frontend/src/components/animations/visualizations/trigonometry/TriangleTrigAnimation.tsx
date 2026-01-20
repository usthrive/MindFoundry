/**
 * TriangleTrigAnimation - Visual representation of right triangle trigonometry
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows right triangle with labeled sides
 * - Demonstrates SOH-CAH-TOA relationships
 * - Can show law of sines/cosines for non-right triangles
 * - SETUP MODE (default): Shows triangle with measurements
 * - SOLUTION MODE: Animates ratio calculation
 *
 * Used for:
 * - Level M: trig_ratios, law_of_sines, law_of_cosines, area_triangle_trig
 * - Concept introductions for triangle trigonometry
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface TriangleTrigAnimationProps extends BaseAnimationProps {
  showLaws?: boolean
}

export default function TriangleTrigAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  showLaws = false,
}: TriangleTrigAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'
    | 'real_world_intro'
    | 'triangle_parts'
    | 'identify'
    | 'soh_explain'
    | 'soh_example'
    | 'cah_explain'
    | 'cah_example'
    | 'toa_explain'
    | 'toa_example'
    | 'memory_trick'
    | 'calculate'
    | 'result'
    | 'real_world_apply'
    | 'complete'
  >('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: 3-4-5 right triangle
  // operands: [opposite, adjacent, hypotenuse, angle in degrees]
  const operands = problemData?.operands || [3, 4, 5, 0]
  const [opposite, adjacent, hypotenuse, angleIdx] = operands

  // Validate triangle: hypotenuse must be positive (used in division for trig ratios)
  // Also, in a valid right triangle, hypotenuse should be the longest side
  const isValidTriangle = hypotenuse > 0 && opposite >= 0 && adjacent >= 0 &&
    !isNaN(hypotenuse) && !isNaN(opposite) && !isNaN(adjacent)

  // Early return with educational error message if invalid
  if (!isValidTriangle) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Triangle</p>
          <p className="text-red-500 text-sm mt-2">
            {hypotenuse <= 0
              ? "The hypotenuse must be positive. It's the longest side of a right triangle, opposite the right angle."
              : "All sides of a triangle must be non-negative numbers."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>In a right triangle, the hypotenuse is always the longest side and must be {'>'} 0</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate angle from sides
  const angleA = Math.atan(opposite / adjacent) * (180 / Math.PI)
  const angleB = 90 - angleA

  // Trig ratios
  const sinA = opposite / hypotenuse
  const cosA = adjacent / hypotenuse
  const tanA = opposite / adjacent

  // SVG dimensions
  const width = 300
  const height = 240
  const padding = 50

  // Scale triangle to fit
  const maxSide = Math.max(opposite, adjacent)
  const scale = (Math.min(width, height) - 2 * padding - 40) / maxSide

  // Triangle vertices (right angle at origin)
  const points = {
    A: { x: padding, y: height - padding }, // Right angle
    B: { x: padding + adjacent * scale, y: height - padding }, // Base
    C: { x: padding, y: height - padding - opposite * scale }, // Height
  }

  // Animation effect for solution mode - converted to interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 20 // 2 seconds per phase

    const phases: (typeof phase)[] = [
      'setup', 'real_world_intro', 'triangle_parts', 'identify',
      'soh_explain', 'soh_example', 'cah_explain', 'cah_example',
      'toa_explain', 'toa_example', 'memory_trick', 'calculate',
      'result', 'real_world_apply', 'complete'
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
        if (newPhase === 'identify' || newPhase === 'triangle_parts') {
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
      {/* Triangle Type */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-gray-800">
          Right Triangle Trigonometry
        </div>
        <div className="text-sm text-gray-500">
          Find sin, cos, tan of angle A
        </div>
      </div>

      {/* Triangle Visualization */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Triangle */}
          <polygon
            points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`}
            fill="#dbeafe"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Right angle marker */}
          <path
            d={`M ${points.A.x + 15} ${points.A.y} L ${points.A.x + 15} ${points.A.y - 15} L ${points.A.x} ${points.A.y - 15}`}
            fill="none"
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Angle A arc */}
          {(phase === 'identify' || phase === 'calculate' || phase === 'result' || phase === 'complete') && (
            <motion.path
              d={`M ${points.B.x - 25} ${points.B.y} A 25 25 0 0 1 ${points.B.x - 25 * Math.cos(angleA * Math.PI / 180)} ${points.B.y - 25 * Math.sin(angleA * Math.PI / 180)}`}
              fill="none"
              stroke="#f97316"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Side labels */}
          {/* Opposite (vertical) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== 'setup' ? 1 : 0.5 }}
          >
            <text
              x={points.A.x - 20}
              y={(points.A.y + points.C.y) / 2}
              textAnchor="end"
              className={cn(
                'text-sm font-bold',
                phase === 'identify' ? 'fill-purple-600' : 'fill-gray-700'
              )}
            >
              {opposite}
            </text>
            {phase === 'identify' && (
              <text
                x={points.A.x - 35}
                y={(points.A.y + points.C.y) / 2 + 15}
                textAnchor="end"
                className="text-xs fill-purple-500"
              >
                (opp)
              </text>
            )}
          </motion.g>

          {/* Adjacent (horizontal) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== 'setup' ? 1 : 0.5 }}
          >
            <text
              x={(points.A.x + points.B.x) / 2}
              y={points.A.y + 20}
              textAnchor="middle"
              className={cn(
                'text-sm font-bold',
                phase === 'identify' ? 'fill-green-600' : 'fill-gray-700'
              )}
            >
              {adjacent}
            </text>
            {phase === 'identify' && (
              <text
                x={(points.A.x + points.B.x) / 2}
                y={points.A.y + 35}
                textAnchor="middle"
                className="text-xs fill-green-500"
              >
                (adj)
              </text>
            )}
          </motion.g>

          {/* Hypotenuse */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== 'setup' ? 1 : 0.5 }}
          >
            <text
              x={(points.B.x + points.C.x) / 2 + 15}
              y={(points.B.y + points.C.y) / 2}
              className={cn(
                'text-sm font-bold',
                phase === 'identify' ? 'fill-red-600' : 'fill-gray-700'
              )}
            >
              {hypotenuse}
            </text>
            {phase === 'identify' && (
              <text
                x={(points.B.x + points.C.x) / 2 + 15}
                y={(points.B.y + points.C.y) / 2 + 15}
                className="text-xs fill-red-500"
              >
                (hyp)
              </text>
            )}
          </motion.g>

          {/* Vertex labels */}
          <text x={points.A.x - 15} y={points.A.y + 5} className="text-sm fill-gray-600 font-medium">90°</text>
          <text x={points.B.x + 10} y={points.B.y + 5} className="text-sm fill-orange-600 font-bold">A</text>
          <text x={points.C.x - 15} y={points.C.y} className="text-sm fill-gray-600 font-medium">B</text>

          {/* Angle value */}
          {(phase === 'calculate' || phase === 'result' || phase === 'complete') && (
            <motion.text
              x={points.B.x - 45}
              y={points.B.y - 10}
              className="text-xs fill-orange-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {angleA.toFixed(1)}°
            </motion.text>
          )}
        </svg>
      </div>

      {/* SOH-CAH-TOA */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-center text-lg font-bold text-blue-700 mb-2">SOH-CAH-TOA</div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className={cn(phase === 'calculate' ? 'bg-white rounded p-1 ring-2 ring-blue-500' : '')}>
            <div className="font-semibold">Sin = O/H</div>
            <div className="text-xs text-gray-500">opposite/hypotenuse</div>
          </div>
          <div className={cn(phase === 'calculate' ? 'bg-white rounded p-1 ring-2 ring-blue-500' : '')}>
            <div className="font-semibold">Cos = A/H</div>
            <div className="text-xs text-gray-500">adjacent/hypotenuse</div>
          </div>
          <div className={cn(phase === 'calculate' ? 'bg-white rounded p-1 ring-2 ring-blue-500' : '')}>
            <div className="font-semibold">Tan = O/A</div>
            <div className="text-xs text-gray-500">opposite/adjacent</div>
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Right Triangle Ratios</div>
            <div className="text-sm text-gray-600">
              <p>Given a right triangle with sides {opposite}, {adjacent}, {hypotenuse}</p>
              <p className="mt-1">Find the trigonometric ratios for angle A</p>
            </div>
          </div>
        )}

        {phase === 'real_world_intro' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-yellow-700 mb-2">Real-World Scenario: The Ladder Problem</div>
            <div className="text-center">
              <div className="text-4xl mb-2">🪜</div>
              <p className="text-sm">Imagine a ladder leaning against a wall.</p>
              <p className="text-sm mt-1">The <strong>ladder</strong> = <span className="text-red-600 font-medium">hypotenuse</span> (longest side)</p>
              <p className="text-sm">The <strong>wall</strong> = <span className="text-purple-600 font-medium">opposite side</span> (across from angle)</p>
              <p className="text-sm">The <strong>ground</strong> = <span className="text-green-600 font-medium">adjacent side</span> (next to angle)</p>
            </div>
          </motion.div>
        )}

        {phase === 'triangle_parts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-2">Parts of a Right Triangle</div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Right angle:</strong> The 90° corner (marked with a square)</p>
              <p><strong>Hypotenuse:</strong> The longest side, opposite the right angle</p>
              <p><strong>Opposite:</strong> The side across from the angle we're measuring</p>
              <p><strong>Adjacent:</strong> The side next to the angle (not the hypotenuse)</p>
            </div>
          </motion.div>
        )}

        {phase === 'identify' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Step 1: Identify the Sides</div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-purple-100 px-3 py-1 rounded">
                <span className="text-purple-600">Opposite: </span>
                <span className="font-bold">{opposite}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded">
                <span className="text-green-600">Adjacent: </span>
                <span className="font-bold">{adjacent}</span>
              </div>
              <div className="bg-red-100 px-3 py-1 rounded">
                <span className="text-red-600">Hypotenuse: </span>
                <span className="font-bold">{hypotenuse}</span>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'soh_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-2">
              <span className="text-2xl">S</span>OH: <span className="text-red-600">S</span>in = <span className="text-purple-600">O</span>pposite / <span className="text-red-600">H</span>ypotenuse
            </div>
            <div className="text-sm text-gray-600">
              <p>Sine tells you: "How tall is the opposite side compared to the hypotenuse?"</p>
              <p className="font-mono text-lg mt-2">sin(angle) = opposite ÷ hypotenuse</p>
              <p className="mt-2 text-blue-600">🎯 <strong>Use when you know:</strong> hypotenuse and need opposite (or vice versa)</p>
            </div>
          </motion.div>
        )}

        {phase === 'soh_example' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-2">Example: sin A</div>
            <div className="text-sm space-y-1">
              <p className="font-mono">sin A = opposite / hypotenuse</p>
              <p className="font-mono text-lg">sin A = {opposite} / {hypotenuse}</p>
              <p className="font-mono text-xl font-bold text-blue-600">sin A = {sinA.toFixed(3)}</p>
            </div>
          </motion.div>
        )}

        {phase === 'cah_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-700 mb-2">
              C<span className="text-2xl">A</span>H: <span className="text-green-600">C</span>os = <span className="text-green-600">A</span>djacent / <span className="text-red-600">H</span>ypotenuse
            </div>
            <div className="text-sm text-gray-600">
              <p>Cosine tells you: "How wide is the adjacent side compared to the hypotenuse?"</p>
              <p className="font-mono text-lg mt-2">cos(angle) = adjacent ÷ hypotenuse</p>
              <p className="mt-2 text-green-600">🎯 <strong>Use when you know:</strong> hypotenuse and need adjacent (or vice versa)</p>
            </div>
          </motion.div>
        )}

        {phase === 'cah_example' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-700 mb-2">Example: cos A</div>
            <div className="text-sm space-y-1">
              <p className="font-mono">cos A = adjacent / hypotenuse</p>
              <p className="font-mono text-lg">cos A = {adjacent} / {hypotenuse}</p>
              <p className="font-mono text-xl font-bold text-green-600">cos A = {cosA.toFixed(3)}</p>
            </div>
          </motion.div>
        )}

        {phase === 'toa_explain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-700 mb-2">
              T<span className="text-2xl">O</span>A: <span className="text-purple-600">T</span>an = <span className="text-purple-600">O</span>pposite / <span className="text-green-600">A</span>djacent
            </div>
            <div className="text-sm text-gray-600">
              <p>Tangent tells you: "How steep is the triangle? (ratio of height to width)"</p>
              <p className="font-mono text-lg mt-2">tan(angle) = opposite ÷ adjacent</p>
              <p className="mt-2 text-purple-600">🎯 <strong>Use when you know:</strong> both legs of the triangle (no hypotenuse)</p>
            </div>
          </motion.div>
        )}

        {phase === 'toa_example' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-purple-700 mb-2">Example: tan A</div>
            <div className="text-sm space-y-1">
              <p className="font-mono">tan A = opposite / adjacent</p>
              <p className="font-mono text-lg">tan A = {opposite} / {adjacent}</p>
              <p className="font-mono text-xl font-bold text-purple-600">tan A = {tanA.toFixed(3)}</p>
            </div>
          </motion.div>
        )}

        {phase === 'memory_trick' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-orange-700 mb-2">Memory Trick: SOH-CAH-TOA</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">SOH-CAH-TOA</div>
            <div className="text-sm space-y-1">
              <p><strong>S</strong>ome <strong>O</strong>ld <strong>H</strong>orse</p>
              <p><strong>C</strong>aught <strong>A</strong> <strong>H</strong>orse</p>
              <p><strong>T</strong>aking <strong>O</strong>ats <strong>A</strong>way</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">This silly sentence helps you remember which sides go with which function!</p>
          </motion.div>
        )}

        {phase === 'calculate' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Summary: All Three Ratios</div>
            <div className="grid grid-cols-3 gap-2 text-sm font-mono">
              <div className="bg-blue-100 p-2 rounded">sin A = {opposite}/{hypotenuse}</div>
              <div className="bg-green-100 p-2 rounded">cos A = {adjacent}/{hypotenuse}</div>
              <div className="bg-purple-100 p-2 rounded">tan A = {opposite}/{adjacent}</div>
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-100 p-2 rounded">
              <div className="text-sm text-blue-600 font-semibold">sin A</div>
              <div className="text-lg font-bold text-blue-700">{sinA.toFixed(3)}</div>
              <div className="text-xs text-gray-500">{opposite}/{hypotenuse}</div>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <div className="text-sm text-green-600 font-semibold">cos A</div>
              <div className="text-lg font-bold text-green-700">{cosA.toFixed(3)}</div>
              <div className="text-xs text-gray-500">{adjacent}/{hypotenuse}</div>
            </div>
            <div className="bg-purple-100 p-2 rounded">
              <div className="text-sm text-purple-600 font-semibold">tan A</div>
              <div className="text-lg font-bold text-purple-700">{tanA.toFixed(3)}</div>
              <div className="text-xs text-gray-500">{opposite}/{adjacent}</div>
            </div>
          </motion.div>
        )}

        {phase === 'real_world_apply' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-indigo-700 mb-2">Real-World Application</div>
            <div className="text-sm text-gray-600">
              <p>🪜 <strong>Ladder example:</strong> A {hypotenuse}m ladder leans against a wall.</p>
              <p className="mt-1">The base is {adjacent}m from the wall.</p>
              <p className="mt-1">Using cos A = {adjacent}/{hypotenuse} = {cosA.toFixed(3)}</p>
              <p className="mt-1 font-bold">The ladder makes a {angleA.toFixed(1)}° angle with the ground!</p>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">Excellent Work!</div>
            <div className="text-sm text-gray-600">
              <p>You've mastered SOH-CAH-TOA for this triangle!</p>
              <p className="mt-1">Angle A = {angleA.toFixed(1)}°</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Angle Result */}
      {(phase === 'result' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 rounded-lg p-3 mb-4 text-center"
        >
          <div className="text-sm text-orange-600">Angle A</div>
          <div className="text-xl font-bold text-orange-700">{angleA.toFixed(1)}°</div>
          <div className="text-xs text-gray-500">A = tan⁻¹({opposite}/{adjacent})</div>
        </motion.div>
      )}

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the trig ratios</p>
            <p className="text-sm mt-1 text-gray-500">Use SOH-CAH-TOA</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              Angle A = {angleA.toFixed(1)}° found!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing right triangle...'}
            {phase === 'real_world_intro' && 'Exploring real-world example...'}
            {phase === 'triangle_parts' && 'Learning triangle parts...'}
            {phase === 'identify' && 'Identifying sides...'}
            {phase === 'soh_explain' && 'Understanding sine (SOH)...'}
            {phase === 'soh_example' && 'Calculating sine...'}
            {phase === 'cah_explain' && 'Understanding cosine (CAH)...'}
            {phase === 'cah_example' && 'Calculating cosine...'}
            {phase === 'toa_explain' && 'Understanding tangent (TOA)...'}
            {phase === 'toa_example' && 'Calculating tangent...'}
            {phase === 'memory_trick' && 'Learning the memory trick...'}
            {phase === 'calculate' && 'Summarizing all ratios...'}
            {phase === 'result' && 'Showing final results...'}
            {phase === 'real_world_apply' && 'Applying to real world...'}
          </p>
        )}
      </div>
    </div>
  )
}
