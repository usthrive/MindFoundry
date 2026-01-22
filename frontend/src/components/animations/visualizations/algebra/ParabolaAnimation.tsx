/**
 * ParabolaAnimation - Visual representation of quadratic functions
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows parabola on coordinate plane
 * - Highlights vertex, axis of symmetry, roots
 * - Demonstrates how coefficients affect shape
 * - SETUP MODE (default): Shows equation and empty grid
 * - SOLUTION MODE: Animates plotting points and drawing curve
 *
 * Used for:
 * - Level I: quadratic_equations, quadratic_functions, parabolas
 * - Concept introductions for graphing quadratics
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface ParabolaAnimationProps extends BaseAnimationProps {
  showRoots?: boolean
  showVertex?: boolean
}

export default function ParabolaAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  showRoots = true,
  showVertex = true,
}: ParabolaAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'vertex' | 'points' | 'curve' | 'features' | 'complete'>('setup')
  const [visiblePoints, setVisiblePoints] = useState<number>(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Extract coefficients: [a, b, c] for y = ax² + bx + c
  // Default: y = x² - 2x - 3 (roots at x=-1 and x=3, vertex at (1, -4))
  const operands = problemData?.operands || [1, -2, -3]
  const [a, b, c] = operands

  // Validate coefficient a is not zero (parabola requires a != 0)
  const isValidParabola = a !== 0 && !isNaN(a) && !isNaN(b) && !isNaN(c)

  // Early return with educational error message if invalid
  if (!isValidParabola) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Parabola</p>
          <p className="text-red-500 text-sm mt-2">
            {a === 0
              ? "The coefficient 'a' cannot be zero. When a=0, the graph would be a straight line (y = bx + c), not a parabola."
              : "Please enter valid numbers for all coefficients."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>A parabola is the graph of y = ax² + bx + c where a ≠ 0</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate vertex: x = -b/(2a), y = f(x)
  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c

  // Calculate discriminant and roots
  const discriminant = b * b - 4 * a * c
  const hasRealRoots = discriminant >= 0
  const root1 = hasRealRoots ? (-b - Math.sqrt(discriminant)) / (2 * a) : null
  const root2 = hasRealRoots ? (-b + Math.sqrt(discriminant)) / (2 * a) : null

  // Calculate dynamic range based on vertex and roots
  const graphRange = useMemo(() => {
    // Include vertex, roots, and some padding
    let xMin = -5, xMax = 5
    let yMin = -5, yMax = 5

    // Ensure vertex is visible with padding
    if (Math.abs(vertexX) > 4) {
      xMin = Math.min(xMin, vertexX - 1)
      xMax = Math.max(xMax, vertexX + 1)
    }
    if (Math.abs(vertexY) > 4) {
      yMin = Math.min(yMin, vertexY - 1)
      yMax = Math.max(yMax, vertexY + 1)
    }

    // Ensure roots are visible
    if (hasRealRoots) {
      if (root1 !== null && Math.abs(root1) > 4) {
        xMin = Math.min(xMin, root1 - 0.5)
        xMax = Math.max(xMax, root1 + 0.5)
      }
      if (root2 !== null && Math.abs(root2) > 4) {
        xMin = Math.min(xMin, root2 - 0.5)
        xMax = Math.max(xMax, root2 + 0.5)
      }
    }

    return { xMin, xMax, yMin, yMax }
  }, [vertexX, vertexY, hasRealRoots, root1, root2])

  // Generate points for the parabola with dynamic range
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const { xMin, xMax, yMin, yMax } = graphRange
    const step = (xMax - xMin) / 40 // 40 points for smooth curve

    for (let x = xMin; x <= xMax; x += step) {
      const y = a * x * x + b * x + c
      if (y >= yMin - 1 && y <= yMax + 1) { // Include points within visible range with buffer
        pts.push({ x, y })
      }
    }
    return pts
  }, [a, b, c, graphRange])

  // SVG dimensions and scaling with dynamic range
  const width = 280
  const height = 280
  const padding = 30
  const { xMin, xMax, yMin, yMax } = graphRange
  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const scaleX = (width - 2 * padding) / xRange
  const scaleY = (height - 2 * padding) / yRange

  const toSvgX = (x: number) => padding + (x - xMin) * scaleX
  const toSvgY = (y: number) => height - padding - (y - yMin) * scaleY

  // Generate path for parabola
  const pathD = useMemo(() => {
    if (points.length < 2) return ''
    const visiblePts = showSolution && phase !== 'setup' && phase !== 'vertex'
      ? points.slice(0, Math.max(2, Math.floor(points.length * (visiblePoints / 100))))
      : points

    let d = `M ${toSvgX(visiblePts[0].x)} ${toSvgY(visiblePts[0].y)}`
    for (let i = 1; i < visiblePts.length; i++) {
      d += ` L ${toSvgX(visiblePts[i].x)} ${toSvgY(visiblePts[i].y)}`
    }
    return d
  }, [points, visiblePoints, showSolution, phase, toSvgX, toSvgY])

  // Animation effect for solution mode - with pause support
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setVisiblePoints(0)
      tickRef.current = 0
      return
    }

    // Use interval-based animation for pause support
    const TICK_MS = 100
    const VERTEX_TICK = 10     // 1 second
    const POINTS_TICK = 22     // 2.2 seconds
    const CURVE_START_TICK = 25
    const CURVE_END_TICK = 55  // ~3 seconds to draw
    const FEATURES_TICK = 60   // 6 seconds
    const COMPLETE_TICK = 80   // 8 seconds total

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase transitions
      if (tick === VERTEX_TICK && phase === 'setup') {
        setPhase('vertex')
        playPop()
      }

      if (tick === POINTS_TICK && phase === 'vertex') {
        setPhase('points')
        playWhoosh()
      }

      // Animate curve drawing during points phase
      if (tick >= CURVE_START_TICK && tick <= CURVE_END_TICK) {
        const progress = ((tick - CURVE_START_TICK) / (CURVE_END_TICK - CURVE_START_TICK)) * 100
        setVisiblePoints(Math.min(100, progress))
      }

      if (tick === CURVE_END_TICK && phase === 'points') {
        setPhase('curve')
        setVisiblePoints(100)
      }

      if (tick === FEATURES_TICK && phase === 'curve') {
        setPhase('features')
        playPop()
      }

      if (tick === COMPLETE_TICK) {
        setPhase('complete')
        playSuccess()
        onComplete?.()
        clearInterval(timer)
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Format the equation
  const formatEquation = () => {
    let eq = 'y = '
    if (a !== 1 && a !== -1) eq += `${a}`
    if (a === -1) eq += '-'
    eq += 'x²'
    if (b !== 0) {
      eq += ` ${b >= 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`
    }
    if (c !== 0) {
      eq += ` ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`
    }
    return eq
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 font-mono">
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
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => (
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
              {/* X-axis labels */}
              {i !== 0 && (
                <text
                  x={toSvgX(i)}
                  y={toSvgY(0) + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {i}
                </text>
              )}
              {/* Y-axis labels */}
              {i !== 0 && (
                <text
                  x={toSvgX(0) - 10}
                  y={toSvgY(i) + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {i}
                </text>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Axis of symmetry (dashed line) - stays visible after vertex is shown */}
          {phase !== 'setup' && showVertex && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              x1={toSvgX(vertexX)}
              y1={padding}
              x2={toSvgX(vertexX)}
              y2={height - padding}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          )}

          {/* Parabola curve */}
          {(phase === 'points' || phase === 'curve' || phase === 'features' || phase === 'complete') && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase === 'points' ? visiblePoints / 100 : 1 }}
              transition={{ duration: 0.1 }}
            />
          )}

          {/* Vertex point */}
          {(phase === 'vertex' || phase === 'features' || phase === 'complete') && showVertex && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvgX(vertexX)}
                cy={toSvgY(vertexY)}
                r={6}
                fill="#ef4444"
              />
              <text
                x={toSvgX(vertexX) + 10}
                y={toSvgY(vertexY) - 10}
                className="text-xs fill-red-500 font-medium"
              >
                ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
              </text>
            </motion.g>
          )}

          {/* Root points */}
          {(phase === 'features' || phase === 'complete') && showRoots && hasRealRoots && (
            <>
              {root1 !== null && Math.abs(root1) <= 5 && (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <circle
                    cx={toSvgX(root1)}
                    cy={toSvgY(0)}
                    r={5}
                    fill="#10b981"
                  />
                  <text
                    x={toSvgX(root1)}
                    y={toSvgY(0) + 18}
                    textAnchor="middle"
                    className="text-xs fill-green-600 font-medium"
                  >
                    x={root1.toFixed(1)}
                  </text>
                </motion.g>
              )}
              {root2 !== null && Math.abs(root2) <= 5 && Math.abs(root1! - root2) > 0.1 && (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <circle
                    cx={toSvgX(root2)}
                    cy={toSvgY(0)}
                    r={5}
                    fill="#10b981"
                  />
                  <text
                    x={toSvgX(root2)}
                    y={toSvgY(0) + 18}
                    textAnchor="middle"
                    className="text-xs fill-green-600 font-medium"
                  >
                    x={root2.toFixed(1)}
                  </text>
                </motion.g>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Key Information */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">
              Vertex: ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">
              Opens: {a > 0 ? 'Up ↑' : 'Down ↓'}
            </span>
          </div>
          {hasRealRoots && root1 !== null && root2 !== null && (
            <div className="flex items-center gap-2 col-span-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">
                {Math.abs(root1 - root2) < 0.1
                  ? `Root: x = ${root1.toFixed(1)} (double)`
                  : `Roots: x = ${root1.toFixed(1)}, x = ${root2.toFixed(1)}`}
              </span>
            </div>
          )}
          {!hasRealRoots && (
            <div className="col-span-2 text-gray-500 text-center">
              No real roots (parabola doesn't cross x-axis)
            </div>
          )}
        </div>
      </div>

      {/* Instructions / Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              Graph the quadratic function
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Find the vertex, roots, and shape
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-lg font-bold text-green-600">
              Parabola complete!
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'vertex' && 'Finding vertex...'}
            {phase === 'points' && 'Plotting points...'}
            {phase === 'curve' && 'Drawing curve...'}
            {phase === 'features' && 'Identifying features...'}
          </p>
        )}
      </div>
    </div>
  )
}
