/**
 * OptimizationAnimation - Visual representation of optimization problems
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows real-world context (maximize area, minimize cost)
 * - Sets up equation and constraint
 * - Finds critical points using derivative
 * - SETUP MODE (default): Shows problem setup
 * - SOLUTION MODE: Animates finding max/min
 *
 * Used for:
 * - Level L: optimization
 * - Concept introductions for practical calculus applications
 */

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface OptimizationAnimationProps extends BaseAnimationProps {
  problemType?: 'area' | 'cost' | 'distance'
}

export default function OptimizationAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
  problemType: _problemType = 'area',
}: OptimizationAnimationProps) {
  const [phase, setPhase] = useState<'setup' | 'equation' | 'derivative' | 'critical' | 'verify' | 'complete'>('setup')
  const [currentWidth, setCurrentWidth] = useState(20)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Default: Maximize area of rectangle with perimeter P = 100
  // A = x(50-x) = 50x - x², A' = 50 - 2x = 0, x = 25
  const operands = problemData?.operands || [100] // Perimeter constraint
  const [perimeter] = operands

  // Validate perimeter is positive (used in division for graph scaling)
  const isValidPerimeter = perimeter > 0 && !isNaN(perimeter)

  // Early return with educational error message if invalid
  if (!isValidPerimeter) {
    return (
      <div className={cn('w-full py-4', className)}>
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg">Invalid Perimeter</p>
          <p className="text-red-500 text-sm mt-2">
            {perimeter <= 0
              ? "The perimeter must be a positive number. We need fence material to enclose an area!"
              : "Please enter a valid number for the perimeter."}
          </p>
          <div className="mt-4 text-gray-600 text-sm">
            <p className="font-medium">Remember:</p>
            <p>Perimeter is the total length around a shape - it must be {'>'} 0</p>
          </div>
        </div>
      </div>
    )
  }

  const halfPerimeter = perimeter / 2 // 50
  const optimalWidth = halfPerimeter / 2 // 25
  const optimalHeight = halfPerimeter - optimalWidth // 25
  const maxArea = optimalWidth * optimalHeight // 625

  // Calculate current area based on width
  const currentHeight = halfPerimeter - currentWidth
  const currentArea = currentWidth * currentHeight

  // SVG dimensions for graph
  const graphWidth = 260
  const graphHeight = 180
  const padding = 35

  const toSvgX = (x: number) => padding + (x / halfPerimeter) * (graphWidth - 2 * padding)
  const toSvgY = (y: number) => graphHeight - padding - (y / maxArea) * (graphHeight - 2 * padding)

  // Generate area function points A(x) = x(halfPerimeter - x)
  const areaPoints = useMemo(() => {
    const pts: string[] = []
    for (let x = 0; x <= halfPerimeter; x += 1) {
      const y = x * (halfPerimeter - x)
      pts.push(`${toSvgX(x)},${toSvgY(y)}`)
    }
    return pts.join(' ')
  }, [halfPerimeter, maxArea])

  // Animate width changing to find max
  useEffect(() => {
    if (!showSolution) {
      setCurrentWidth(20)
      return
    }

    if (phase === 'critical') {
      setCurrentWidth(5)
      const interval = setInterval(() => {
        setCurrentWidth(prev => {
          if (prev >= optimalWidth) {
            clearInterval(interval)
            return optimalWidth
          }
          return prev + 1
        })
      }, 80)
      return () => clearInterval(interval)
    }
  }, [showSolution, phase, optimalWidth])

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      return
    }

    const equationTimer = setTimeout(() => {
      setPhase('equation')
      playWhoosh()
    }, 800)

    const derivativeTimer = setTimeout(() => {
      setPhase('derivative')
      playPop()
    }, 3000)

    const criticalTimer = setTimeout(() => {
      setPhase('critical')
      playPop()
    }, 5000)

    const verifyTimer = setTimeout(() => {
      setPhase('verify')
      playPop()
    }, 8000)

    const completeTimer = setTimeout(() => {
      setPhase('complete')
      playSuccess()
      onComplete?.()
    }, 10000)

    return () => {
      clearTimeout(equationTimer)
      clearTimeout(derivativeTimer)
      clearTimeout(criticalTimer)
      clearTimeout(verifyTimer)
      clearTimeout(completeTimer)
    }
  }, [showSolution, onComplete, playPop, playSuccess, playWhoosh])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Problem Statement */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-blue-600 mb-1">Optimization Problem</div>
        <div className="text-gray-800">
          Find the <strong>maximum area</strong> of a rectangle with perimeter {perimeter}
        </div>
      </div>

      {/* Rectangle Visualization */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Rectangle */}
          <motion.div
            className="border-4 border-blue-500 bg-blue-100 flex items-center justify-center"
            animate={{
              width: currentWidth * 3,
              height: currentHeight * 3,
            }}
            transition={{ duration: 0.1 }}
          >
            <span className="text-xs font-bold text-blue-700">
              A = {currentArea.toFixed(0)}
            </span>
          </motion.div>
          {/* Width label */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
            w = {currentWidth.toFixed(0)}
          </div>
          {/* Height label */}
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-600">
            h = {currentHeight.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Graph of A(x) */}
      <div className="flex justify-center mb-4">
        <svg
          width={graphWidth}
          height={graphHeight}
          className="bg-white rounded-lg shadow-sm border"
        >
          {/* Grid */}
          <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="#374151" strokeWidth={2} />
          <line x1={padding} y1={padding} x2={padding} y2={graphHeight - padding} stroke="#374151" strokeWidth={2} />

          {/* Axis labels */}
          <text x={graphWidth - padding + 10} y={graphHeight - padding + 4} className="text-xs fill-gray-700">w</text>
          <text x={padding - 5} y={padding - 10} className="text-xs fill-gray-700">A</text>

          {/* Area function curve */}
          <polyline
            points={areaPoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
          />

          {/* Current point on curve */}
          {(phase === 'critical' || phase === 'verify' || phase === 'complete') && (
            <motion.circle
              cx={toSvgX(currentWidth)}
              cy={toSvgY(currentArea)}
              r={6}
              fill="#ef4444"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Maximum point indicator */}
          {(phase === 'verify' || phase === 'complete') && (
            <>
              <line
                x1={toSvgX(optimalWidth)}
                y1={graphHeight - padding}
                x2={toSvgX(optimalWidth)}
                y2={toSvgY(maxArea)}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
              <circle
                cx={toSvgX(optimalWidth)}
                cy={toSvgY(maxArea)}
                r={8}
                fill="#10b981"
              />
              <text x={toSvgX(optimalWidth)} y={toSvgY(maxArea) - 12} textAnchor="middle" className="text-xs fill-green-600 font-bold">
                Max!
              </text>
            </>
          )}

          {/* X-axis labels */}
          <text x={toSvgX(0)} y={graphHeight - padding + 15} textAnchor="middle" className="text-xs fill-gray-500">0</text>
          <text x={toSvgX(optimalWidth)} y={graphHeight - padding + 15} textAnchor="middle" className="text-xs fill-gray-500">{optimalWidth}</text>
          <text x={toSvgX(halfPerimeter)} y={graphHeight - padding + 15} textAnchor="middle" className="text-xs fill-gray-500">{halfPerimeter}</text>
        </svg>
      </div>

      {/* Step-by-step Solution */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        {phase === 'setup' ? (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Optimization Steps</div>
            <div className="text-sm text-gray-600">
              <p>1. Write equation for quantity to optimize</p>
              <p>2. Express in terms of one variable</p>
              <p>3. Find critical points (set derivative = 0)</p>
              <p>4. Verify it's a maximum or minimum</p>
            </div>
          </div>
        ) : phase === 'equation' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: Set Up Equations</div>
            <div className="space-y-2 text-sm font-mono">
              <div>Perimeter: 2w + 2h = {perimeter}</div>
              <div>Solve for h: h = {halfPerimeter} - w</div>
              <div className="text-primary font-bold">Area: A = w({halfPerimeter} - w) = {halfPerimeter}w - w²</div>
            </div>
          </motion.div>
        ) : phase === 'derivative' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">Step 2: Find Derivative</div>
            <div className="space-y-2 text-sm font-mono">
              <div>A(w) = {halfPerimeter}w - w²</div>
              <div>A'(w) = {halfPerimeter} - 2w</div>
              <div className="text-purple-600 font-bold">Set A'(w) = 0 to find critical points</div>
            </div>
          </motion.div>
        ) : phase === 'critical' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">Step 3: Solve for Critical Point</div>
            <div className="space-y-2 text-sm font-mono">
              <div>{halfPerimeter} - 2w = 0</div>
              <div>2w = {halfPerimeter}</div>
              <div className="text-orange-600 font-bold">w = {optimalWidth}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Step 4: Verify Maximum</div>
            <div className="space-y-2 text-sm">
              <div>A''(w) = -2 {'<'} 0 ✓ (concave down = maximum)</div>
              <div className="font-mono">
                At w = {optimalWidth}: h = {optimalHeight}, A = {maxArea}
              </div>
              <div className="text-green-600 font-bold text-lg mt-2">
                Maximum area = {maxArea} square units
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Insight */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-yellow-800">
          <strong>Key Insight:</strong> A square ({optimalWidth} × {optimalHeight}) gives maximum area for fixed perimeter!
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the optimal dimensions</p>
            <p className="text-sm mt-1 text-gray-500">Use calculus to maximize area</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              Maximum Area = {maxArea} (when w = h = {optimalWidth})
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'equation' && 'Setting up equations...'}
            {phase === 'derivative' && 'Finding derivative...'}
            {phase === 'critical' && 'Finding critical point...'}
            {phase === 'verify' && 'Verifying maximum...'}
          </p>
        )}
      </div>
    </div>
  )
}
