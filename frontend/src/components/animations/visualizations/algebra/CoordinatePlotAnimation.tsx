/**
 * CoordinatePlotAnimation - Visual representation of coordinate graphing
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Show the coordinate plane (x and y axes)
 * - Plot points step by step
 * - Draw lines through points (for linear functions)
 * - Show intersection for systems of equations
 * - SETUP MODE (default): Shows coordinate plane and equation
 * - SOLUTION MODE: Animates plotting points and drawing lines
 *
 * Used for:
 * - Level H: functions, function_graphing, simultaneous_equations
 * - Level I: quadratic_functions, parabolas
 * - Concept introductions for graphing
 */

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface CoordinatePlotAnimationProps extends BaseAnimationProps {
  /** Show a second line for systems */
  showSecondLine?: boolean
}

interface Point {
  x: number
  y: number
}

export default function CoordinatePlotAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
  showSecondLine = false,
}: CoordinatePlotAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'plotting' | 'drawing' | 'complete'>('setup')
  const [visiblePoints1, setVisiblePoints1] = useState<Point[]>([])
  const [visiblePoints2, setVisiblePoints2] = useState<Point[]>([])
  const [showLine1, setShowLine1] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [currentCalculation, setCurrentCalculation] = useState<string>('') // NEW: Show step-by-step calculation
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Extract line equations: y = mx + b format
  // operands: [m1, b1] for single line, [m1, b1, m2, b2] for systems
  const operands = problemData?.operands || [2, 1] // y = 2x + 1
  const m1 = operands[0]
  const b1 = operands[1]
  const m2 = operands[2] || 0
  const b2 = operands[3] || 0

  const hasSecondLine = showSecondLine || operands.length >= 4

  // Calculate dynamic grid range based on line coefficients
  const gridRange = useMemo(() => {
    // Calculate y values at x = -5 and x = 5 for both lines
    const yValues = [
      m1 * -5 + b1,
      m1 * 5 + b1,
    ]
    if (hasSecondLine) {
      yValues.push(m2 * -5 + b2, m2 * 5 + b2)
    }

    // Find the max absolute y value
    const maxAbsY = Math.max(...yValues.map(Math.abs))

    // Ensure at least 10, and add padding
    return Math.max(10, Math.ceil(maxAbsY * 1.2))
  }, [m1, b1, m2, b2, hasSecondLine])

  // Grid settings with dynamic range
  const gridSize = 200
  const scale = gridSize / (gridRange * 2)
  const centerX = gridSize / 2
  const centerY = gridSize / 2

  // Calculate points for the lines with dynamic range
  const calculatePoints = (m: number, b: number): Point[] => {
    const points: Point[] = []
    for (let x = -5; x <= 5; x += 1) {
      const y = m * x + b
      if (y >= -gridRange && y <= gridRange) {
        points.push({ x, y })
      }
    }
    return points
  }

  const line1Points = useMemo(() => calculatePoints(m1, b1), [m1, b1, gridRange])
  const line2Points = useMemo(() => hasSecondLine ? calculatePoints(m2, b2) : [], [m2, b2, hasSecondLine, gridRange])

  // Calculate intersection point
  const intersection = useMemo(() => {
    if (!hasSecondLine || m1 === m2) return null
    const x = (b2 - b1) / (m1 - m2)
    const y = m1 * x + b1
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
  }, [m1, b1, m2, b2, hasSecondLine])

  // Convert math coordinates to SVG coordinates
  const toSvg = (point: Point): Point => ({
    x: centerX + point.x * scale,
    y: centerY - point.y * scale, // SVG y is inverted
  })

  // Generate calculation string for a point
  const getCalculation = (x: number, m: number, b: number): string => {
    const y = m * x + b
    const bPart = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
    return `When x = ${x}: y = ${m}(${x}) ${b >= 0 ? '+' : ''} ${b} = ${m * x} ${bPart} = ${y}`
  }

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setVisiblePoints1([])
      setVisiblePoints2([])
      setShowLine1(false)
      setShowLine2(false)
      setCurrentCalculation('')
      return
    }

    // Phase 1: Plot points - 800ms per point for pedagogically appropriate pacing
    setPhase('plotting')
    let pointIndex = 0

    const plotInterval = setInterval(() => {
      if (pointIndex < line1Points.length) {
        const point = line1Points[pointIndex]
        setVisiblePoints1(prev => [...prev, point])
        // Show calculation step for this point
        setCurrentCalculation(getCalculation(point.x, m1, b1))
        playPop()
        pointIndex++
      } else if (hasSecondLine && pointIndex - line1Points.length < line2Points.length) {
        const idx = pointIndex - line1Points.length
        const point = line2Points[idx]
        setVisiblePoints2(prev => [...prev, point])
        // Show calculation step for second line
        setCurrentCalculation(getCalculation(point.x, m2, b2))
        playPop()
        pointIndex++
      } else {
        clearInterval(plotInterval)
        setCurrentCalculation('')

        // Phase 2: Draw lines
        setTimeout(() => {
          setPhase('drawing')
          setShowLine1(true)
          playWhoosh()

          if (hasSecondLine) {
            setTimeout(() => {
              setShowLine2(true)
              playWhoosh()
            }, 500)
          }

          // Phase 3: Complete
          setTimeout(() => {
            setPhase('complete')
            playSuccess()
            onComplete?.()
          }, hasSecondLine ? 1500 : 800)
        }, 500)
      }
    }, 800) // Changed from 200ms to 800ms - gives students time to understand each calculation

    return () => clearInterval(plotInterval)
  }, [showSolution, line1Points, line2Points, hasSecondLine, m1, b1, m2, b2, onComplete, playPop, playSuccess, playWhoosh])

  // Generate line path
  const generateLinePath = (points: Point[]): string => {
    if (points.length < 2) return ''
    const svgPoints = points.map(toSvg)
    return `M ${svgPoints.map(p => `${p.x},${p.y}`).join(' L ')}`
  }

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Equation Display */}
      <div className="text-center mb-4">
        <div className="flex flex-wrap justify-center gap-4 text-lg font-mono">
          <span className="text-blue-600 font-bold">
            y = {m1}x {b1 >= 0 ? '+' : ''} {b1}
          </span>
          {hasSecondLine && (
            <>
              <span className="text-gray-400">and</span>
              <span className="text-green-600 font-bold">
                y = {m2}x {b2 >= 0 ? '+' : ''} {b2}
              </span>
            </>
          )}
        </div>
        {hasSecondLine && intersection && (
          <p className="text-sm text-gray-500 mt-1">
            Find where the lines intersect
          </p>
        )}
      </div>

      {/* Calculation Display - Shows step-by-step working */}
      {showSolution && currentCalculation && (
        <motion.div
          key={currentCalculation}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-3 mb-4 text-center"
        >
          <p className="text-sm text-blue-800 font-mono">
            {currentCalculation}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Plot the point ({visiblePoints1.length > 0 ? visiblePoints1[visiblePoints1.length - 1]?.x : 0}, {visiblePoints1.length > 0 ? visiblePoints1[visiblePoints1.length - 1]?.y : 0})
          </p>
        </motion.div>
      )}

      {/* Coordinate Plane */}
      <div className="flex justify-center mb-4">
        <svg
          width={gridSize + 40}
          height={gridSize + 40}
          className="bg-gray-50 rounded-xl"
        >
          <g transform="translate(20, 20)">
            {/* Grid lines */}
            {Array.from({ length: gridRange * 2 + 1 }, (_, i) => {
              const pos = i * scale
              const num = i - gridRange
              return (
                <g key={i}>
                  {/* Vertical grid line */}
                  <line
                    x1={pos}
                    y1={0}
                    x2={pos}
                    y2={gridSize}
                    stroke={num === 0 ? '#374151' : '#e5e7eb'}
                    strokeWidth={num === 0 ? 2 : 0.5}
                  />
                  {/* Horizontal grid line */}
                  <line
                    x1={0}
                    y1={pos}
                    x2={gridSize}
                    y2={pos}
                    stroke={num === 0 ? '#374151' : '#e5e7eb'}
                    strokeWidth={num === 0 ? 2 : 0.5}
                  />
                  {/* X-axis labels */}
                  {num !== 0 && num % 2 === 0 && (
                    <text
                      x={pos}
                      y={centerY + 15}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#9ca3af"
                    >
                      {num}
                    </text>
                  )}
                  {/* Y-axis labels */}
                  {num !== 0 && num % 2 === 0 && (
                    <text
                      x={centerX - 10}
                      y={gridSize - pos + 3}
                      textAnchor="end"
                      fontSize="8"
                      fill="#9ca3af"
                    >
                      {num}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Axis labels */}
            <text x={gridSize - 5} y={centerY - 5} fontSize="10" fill="#374151">x</text>
            <text x={centerX + 5} y={10} fontSize="10" fill="#374151">y</text>

            {/* Line 1 */}
            {showLine1 && (
              <motion.path
                d={generateLinePath(line1Points)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* Line 2 */}
            {hasSecondLine && showLine2 && (
              <motion.path
                d={generateLinePath(line2Points)}
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* Points for Line 1 */}
            {visiblePoints1.map((point, i) => {
              const svgPoint = toSvg(point)
              return (
                <motion.circle
                  key={`p1-${i}`}
                  cx={svgPoint.x}
                  cy={svgPoint.y}
                  r={4}
                  fill="#3b82f6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />
              )
            })}

            {/* Points for Line 2 */}
            {visiblePoints2.map((point, i) => {
              const svgPoint = toSvg(point)
              return (
                <motion.circle
                  key={`p2-${i}`}
                  cx={svgPoint.x}
                  cy={svgPoint.y}
                  r={4}
                  fill="#22c55e"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />
              )
            })}

            {/* Intersection point */}
            {phase === 'complete' && intersection && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <circle
                  cx={toSvg(intersection).x}
                  cy={toSvg(intersection).y}
                  r={8}
                  fill="#fef08a"
                  stroke="#eab308"
                  strokeWidth={2}
                />
                <circle
                  cx={toSvg(intersection).x}
                  cy={toSvg(intersection).y}
                  r={3}
                  fill="#eab308"
                />
              </motion.g>
            )}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span className="text-xs text-gray-600">y = {m1}x + {b1}</span>
        </div>
        {hasSecondLine && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500" />
            <span className="text-xs text-gray-600">y = {m2}x + {b2}</span>
          </div>
        )}
      </div>

      {/* Instructions / Status */}
      <div className="text-center mt-4">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              {hasSecondLine ? 'Graph both lines!' : 'Graph the line!'}
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Plot points and connect them
            </p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {intersection ? (
              <>
                <p className="text-xl font-bold text-green-600">
                  Intersection: ({intersection.x}, {intersection.y})
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This is the solution to the system!
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-primary">
                  Line graphed!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Every point on the line satisfies the equation
                </p>
              </>
            )}
          </motion.div>
        ) : phase === 'plotting' ? (
          <p className="text-lg font-medium text-primary">
            Plotting points...
          </p>
        ) : (
          <p className="text-lg font-medium text-primary">
            Drawing line...
          </p>
        )}
      </div>
    </div>
  )
}
