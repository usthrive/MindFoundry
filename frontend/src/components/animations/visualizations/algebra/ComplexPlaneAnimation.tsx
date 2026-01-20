/**
 * ComplexPlaneAnimation - Visual representation of complex numbers
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows complex plane (Argand diagram)
 * - Real axis (horizontal) and imaginary axis (vertical)
 * - Plots complex numbers as points
 * - Shows magnitude and argument
 * - SETUP MODE (default): Shows axes and complex number
 * - SOLUTION MODE: Animates plotting and calculations
 *
 * Used for:
 * - Level J: complex_numbers
 * - Concept introductions for complex number operations
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface ComplexPlaneAnimationProps extends BaseAnimationProps {
  showMagnitude?: boolean
  showArgument?: boolean
  isPaused?: boolean
}

export default function ComplexPlaneAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  showMagnitude = true,
  showArgument = true,
}: ComplexPlaneAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'plot_real' | 'plot_imag' | 'connect' | 'magnitude' | 'complete'>('setup')
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract real and imaginary parts: [a, b] for a + bi
  // Default: 3 + 4i (gives magnitude 5)
  const operands = problemData?.operands || [3, 4]
  const [a, b] = operands

  // Calculate magnitude and argument
  const magnitude = Math.sqrt(a * a + b * b)
  const argument = Math.atan2(b, a) * (180 / Math.PI) // in degrees

  // SVG dimensions and scaling
  const width = 280
  const height = 280
  const padding = 40
  const maxRange = Math.max(Math.abs(a), Math.abs(b), 5) + 1
  const scale = (width - 2 * padding) / (2 * maxRange)

  const toSvgX = (x: number) => width / 2 + x * scale
  const toSvgY = (y: number) => height / 2 - y * scale

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      tickRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // Improved pacing: ~10 seconds total (was 5.6 seconds)
    const TICK_MS = 100
    const PLOT_REAL_TICK = 15        // 1.5 seconds - plot real component
    const PLOT_IMAG_TICK = 35        // 3.5 seconds - plot imaginary component
    const CONNECT_TICK = 55          // 5.5 seconds - connect to point
    const MAGNITUDE_TICK = 75        // 7.5 seconds - show magnitude
    const COMPLETE_TICK = 100        // 10 seconds - complete

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase 1: Plot real component
      if (tick === PLOT_REAL_TICK && phase === 'setup') {
        setPhase('plot_real')
        playPop()
      }

      // Phase 2: Plot imaginary component
      if (tick === PLOT_IMAG_TICK && phase === 'plot_real') {
        setPhase('plot_imag')
        playPop()
      }

      // Phase 3: Connect to point
      if (tick === CONNECT_TICK && phase === 'plot_imag') {
        setPhase('connect')
        playWhoosh()
      }

      // Phase 4: Show magnitude
      if (tick === MAGNITUDE_TICK && phase === 'connect') {
        setPhase('magnitude')
        playPop()
      }

      // Phase 5: Complete
      if (tick === COMPLETE_TICK) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format complex number
  const formatComplex = () => {
    if (b === 0) return `${a}`
    if (a === 0) return `${b}i`
    return `${a} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}i`
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Complex Number Display */}
      <div className="text-center mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 font-mono">
          z = {formatComplex()}
        </div>
      </div>

      {/* Complex Plane */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid lines */}
          {Array.from({ length: Math.ceil(maxRange) * 2 + 1 }, (_, i) => i - Math.ceil(maxRange)).map(i => (
            <g key={i}>
              {/* Vertical lines */}
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {/* Horizontal lines */}
              <line
                x1={padding}
                y1={toSvgY(i)}
                x2={width - padding}
                y2={toSvgY(i)}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={height / 2 + 4} className="text-sm fill-gray-700 font-medium">Re</text>
          <text x={width / 2 + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">Im</text>

          {/* Real component line (horizontal) */}
          {(phase === 'plot_real' || phase === 'plot_imag' || phase === 'connect' || phase === 'magnitude' || phase === 'complete') && (
            <motion.line
              initial={{ x2: toSvgX(0) }}
              animate={{ x2: toSvgX(a) }}
              transition={{ duration: 0.5 }}
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              y2={toSvgY(0)}
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="5,5"
            />
          )}

          {/* Imaginary component line (vertical) */}
          {(phase === 'plot_imag' || phase === 'connect' || phase === 'magnitude' || phase === 'complete') && (
            <motion.line
              initial={{ y2: toSvgY(0) }}
              animate={{ y2: toSvgY(b) }}
              transition={{ duration: 0.5 }}
              x1={toSvgX(a)}
              y1={toSvgY(0)}
              x2={toSvgX(a)}
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="5,5"
            />
          )}

          {/* Magnitude line (from origin to point) */}
          {(phase === 'connect' || phase === 'magnitude' || phase === 'complete') && showMagnitude && (
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(a)}
              y2={toSvgY(b)}
              stroke="#ef4444"
              strokeWidth={3}
            />
          )}

          {/* Angle arc */}
          {(phase === 'magnitude' || phase === 'complete') && showArgument && magnitude > 0 && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              d={`M ${toSvgX(0.8)} ${toSvgY(0)} A 0.8 0.8 0 ${Math.abs(argument) > 180 ? 1 : 0} ${b >= 0 ? 1 : 0} ${toSvgX(0.8 * Math.cos(argument * Math.PI / 180))} ${toSvgY(0.8 * Math.sin(argument * Math.PI / 180))}`}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={2}
              transform={`scale(${scale}, ${scale}) translate(${width / 2 / scale - 0.4}, ${-height / 2 / scale + 0.4})`}
            />
          )}

          {/* Point labels */}
          {(phase === 'plot_real' || phase === 'plot_imag' || phase === 'connect' || phase === 'magnitude' || phase === 'complete') && (
            <>
              {/* Real component label */}
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={toSvgX(a / 2)}
                y={toSvgY(0) + 20}
                textAnchor="middle"
                className="text-xs fill-blue-600 font-medium"
              >
                {a}
              </motion.text>
            </>
          )}

          {(phase === 'plot_imag' || phase === 'connect' || phase === 'magnitude' || phase === 'complete') && (
            /* Imaginary component label */
            <motion.text
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x={toSvgX(a) + 15}
              y={toSvgY(b / 2)}
              className="text-xs fill-green-600 font-medium"
            >
              {b}i
            </motion.text>
          )}

          {/* Complex point */}
          {(phase === 'connect' || phase === 'magnitude' || phase === 'complete') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvgX(a)}
                cy={toSvgY(b)}
                r={8}
                fill="#ef4444"
              />
              <text
                x={toSvgX(a) + 12}
                y={toSvgY(b) - 8}
                className="text-sm fill-red-600 font-medium"
              >
                ({a}, {b}i)
              </text>
            </motion.g>
          )}

          {/* Origin point */}
          <circle cx={toSvgX(0)} cy={toSvgY(0)} r={4} fill="#374151" />
        </svg>
      </div>

      {/* Information Panel */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500" />
            <span className="text-gray-600">Real part: <strong className="text-blue-600">{a}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500" />
            <span className="text-gray-600">Imaginary: <strong className="text-green-600">{b}i</strong></span>
          </div>
          {(phase === 'magnitude' || phase === 'complete') && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500" />
                <span className="text-gray-600">
                  Magnitude |z|: <strong className="text-red-600">{magnitude.toFixed(2)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-purple-500" />
                <span className="text-gray-600">
                  Argument θ: <strong className="text-purple-600">{argument.toFixed(1)}°</strong>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Formula Reference */}
      {(phase === 'magnitude' || phase === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-3 mb-4 text-center text-sm"
        >
          <div className="font-mono">
            |z| = √(a² + b²) = √({a}² + {b}²) = √{a * a + b * b} = {magnitude.toFixed(2)}
          </div>
        </motion.div>
      )}

      {/* Instructions / Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Plot the complex number
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Real part on x-axis, imaginary on y-axis
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-lg font-bold text-green-600">
              z = {formatComplex()} plotted on the complex plane!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'plot_real' && 'Plotting real component...'}
            {phase === 'plot_imag' && 'Plotting imaginary component...'}
            {phase === 'connect' && 'Connecting to origin...'}
            {phase === 'magnitude' && 'Calculating magnitude...'}
          </p>
        )}
      </div>
    </div>
  )
}
