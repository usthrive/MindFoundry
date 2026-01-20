/**
 * UnitCircleAnimation - Visual representation of the unit circle and trigonometric ratios
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows unit circle with rotating angle
 * - Projects sin/cos onto axes
 * - Demonstrates relationship between angle and trig values
 * - SETUP MODE (default): Shows unit circle with reference
 * - SOLUTION MODE: Animates angle rotation with projections
 *
 * Used for:
 * - Level M: trigonometry, trig_ratios, trig_properties, trig_equations
 * - Concept introductions for unit circle trigonometry
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface UnitCircleAnimationProps extends BaseAnimationProps {}

export default function UnitCircleAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
}: UnitCircleAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'rotate' | 'project' | 'values' | 'complete'>('setup')
  const [angle, setAngle] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default angle: 30 degrees (π/6)
  const operands = problemData?.operands || [30]
  const targetAngle = operands[0]
  const targetRadians = (targetAngle * Math.PI) / 180

  // Calculate trig values
  const cosValue = Math.cos(targetRadians)
  const sinValue = Math.sin(targetRadians)
  const tanValue = Math.tan(targetRadians)

  // SVG dimensions
  const size = 280
  const center = size / 2
  const radius = 100

  // Convert angle to point on circle
  const angleRadians = (angle * Math.PI) / 180
  const pointX = center + radius * Math.cos(angleRadians)
  const pointY = center - radius * Math.sin(angleRadians) // SVG Y is inverted

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setAngle(0)
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    const TICK_MS = 50  // Smoother rotation animation
    const ROTATE_START_TICK = 16        // 0.8 seconds - start rotation
    const PROJECT_TICK = 80             // 4 seconds - start projecting
    const VALUES_TICK = 140             // 7 seconds - show values
    const COMPLETE_TICK = 200           // 10 seconds - complete

    // Calculate rotation duration in ticks
    const ROTATE_DURATION_TICKS = PROJECT_TICK - ROTATE_START_TICK - 10

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase: Start rotation
      if (tick === ROTATE_START_TICK && phase === 'setup') {
        setPhase('rotate')
        playWhoosh()
      }

      // Animate rotation smoothly to target angle
      if (phase === 'rotate' && tick > ROTATE_START_TICK && tick < PROJECT_TICK) {
        const ticksIntoRotate = tick - ROTATE_START_TICK
        const progress = Math.min(ticksIntoRotate / ROTATE_DURATION_TICKS, 1)
        const newAngle = Math.min(progress * targetAngle, targetAngle)
        setAngle(newAngle)
      }

      // Phase: Show projections
      if (tick === PROJECT_TICK && phase === 'rotate') {
        setPhase('project')
        setAngle(targetAngle) // Ensure we're at exact target
        playPop()
      }

      // Phase: Show values
      if (tick === VALUES_TICK && phase === 'project') {
        setPhase('values')
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
  }, [showSolution, phase, targetAngle, onComplete, playPop, playSuccess, playWhoosh])

  // Format angle display
  const formatAngle = (deg: number) => {
    const special: Record<number, string> = {
      0: '0',
      30: 'π/6',
      45: 'π/4',
      60: 'π/3',
      90: 'π/2',
      120: '2π/3',
      135: '3π/4',
      150: '5π/6',
      180: 'π',
    }
    return special[deg] || `${deg}°`
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Angle Display */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800">
          θ = <span className="text-primary">{targetAngle}°</span>
          <span className="text-gray-500 text-lg ml-2">= {formatAngle(targetAngle)} rad</span>
        </div>
      </div>

      {/* Unit Circle */}
      <div className="flex justify-center mb-4">
        <svg
          width={size}
          height={size}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid */}
          <line x1={center} y1={20} x2={center} y2={size - 20} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={20} y1={center} x2={size - 20} y2={center} stroke="#e5e7eb" strokeWidth={1} />

          {/* Axes */}
          <line x1={center} y1={20} x2={center} y2={size - 20} stroke="#374151" strokeWidth={2} />
          <line x1={20} y1={center} x2={size - 20} y2={center} stroke="#374151" strokeWidth={2} />

          {/* Axis labels */}
          <text x={size - 15} y={center - 10} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={center + 10} y={25} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Unit circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
          />

          {/* Key points on circle */}
          {[0, 90, 180, 270].map(deg => {
            const rad = (deg * Math.PI) / 180
            const x = center + radius * Math.cos(rad)
            const y = center - radius * Math.sin(rad)
            return (
              <circle key={deg} cx={x} cy={y} r={3} fill="#3b82f6" />
            )
          })}

          {/* Angle arc */}
          {(phase === 'rotate' || phase === 'project' || phase === 'values' || phase === 'complete') && (
            <motion.path
              d={`M ${center + 30} ${center} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${center + 30 * Math.cos(angleRadians)} ${center - 30 * Math.sin(angleRadians)}`}
              fill="none"
              stroke="#f97316"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Radius to point */}
          {(phase === 'rotate' || phase === 'project' || phase === 'values' || phase === 'complete') && (
            <motion.line
              x1={center}
              y1={center}
              x2={pointX}
              y2={pointY}
              stroke="#ef4444"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* Point on circle */}
          {(phase === 'rotate' || phase === 'project' || phase === 'values' || phase === 'complete') && (
            <motion.circle
              cx={pointX}
              cy={pointY}
              r={6}
              fill="#ef4444"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Cosine projection (x-axis) */}
          {(phase === 'project' || phase === 'values' || phase === 'complete') && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <line
                x1={pointX}
                y1={pointY}
                x2={pointX}
                y2={center}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              <line
                x1={center}
                y1={center}
                x2={pointX}
                y2={center}
                stroke="#10b981"
                strokeWidth={3}
              />
              <text x={(center + pointX) / 2} y={center + 20} textAnchor="middle" className="text-xs fill-green-600 font-bold">
                cos θ
              </text>
            </motion.g>
          )}

          {/* Sine projection (y-axis) */}
          {(phase === 'project' || phase === 'values' || phase === 'complete') && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <line
                x1={pointX}
                y1={pointY}
                x2={center}
                y2={pointY}
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              <line
                x1={center}
                y1={center}
                x2={center}
                y2={pointY}
                stroke="#8b5cf6"
                strokeWidth={3}
              />
              <text x={center - 25} y={(center + pointY) / 2} textAnchor="middle" className="text-xs fill-purple-600 font-bold">
                sin θ
              </text>
            </motion.g>
          )}

          {/* Angle label */}
          {(phase === 'rotate' || phase === 'project' || phase === 'values' || phase === 'complete') && (
            <text x={center + 40} y={center - 10} className="text-xs fill-orange-500 font-medium">
              θ = {Math.round(angle)}°
            </text>
          )}

          {/* Point coordinates */}
          {(phase === 'values' || phase === 'complete') && (
            <motion.text
              x={pointX + 10}
              y={pointY - 10}
              className="text-xs fill-red-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ({cosValue.toFixed(2)}, {sinValue.toFixed(2)})
            </motion.text>
          )}
        </svg>
      </div>

      {/* Trig Values */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        {phase === 'setup' ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">The Unit Circle</div>
            <div className="text-sm text-gray-600">
              <p>A circle with radius 1 centered at the origin</p>
              <p className="mt-1">Point (x, y) on circle: x = cos θ, y = sin θ</p>
            </div>
          </div>
        ) : phase === 'rotate' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Rotating to θ = {targetAngle}°</div>
            <div className="text-sm text-gray-600">
              <p>The angle is measured from the positive x-axis</p>
              <p>Counter-clockwise is positive</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-2 text-center"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-semibold">cos {targetAngle}°</div>
              <div className="text-xl font-bold text-green-700">{cosValue.toFixed(3)}</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-semibold">sin {targetAngle}°</div>
              <div className="text-xl font-bold text-purple-700">{sinValue.toFixed(3)}</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-semibold">tan {targetAngle}°</div>
              <div className="text-xl font-bold text-orange-700">{tanValue.toFixed(3)}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Identity */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-blue-800 font-mono">
          <strong>Pythagorean Identity:</strong> sin²θ + cos²θ = 1
        </div>
        {(phase === 'values' || phase === 'complete') && (
          <div className="text-xs text-blue-600 mt-1">
            {sinValue.toFixed(3)}² + {cosValue.toFixed(3)}² = {(sinValue * sinValue + cosValue * cosValue).toFixed(3)} ✓
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find sin, cos, tan at θ = {targetAngle}°</p>
            <p className="text-sm mt-1 text-gray-500">Using the unit circle</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-lg font-bold text-green-600">
              At {targetAngle}°: cos = {cosValue.toFixed(2)}, sin = {sinValue.toFixed(2)}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'rotate' && 'Rotating angle...'}
            {phase === 'project' && 'Projecting onto axes...'}
            {phase === 'values' && 'Reading values...'}
          </p>
        )}
      </div>
    </div>
  )
}
