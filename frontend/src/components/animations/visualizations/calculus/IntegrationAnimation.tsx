/**
 * IntegrationAnimation - Visual representation of integration and area under curves
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows function curve
 * - Demonstrates Riemann sums with rectangles
 * - Shows area filling under curve
 * - SETUP MODE (default): Shows function and integral notation
 * - SOLUTION MODE: Animates rectangle approximation → exact area
 *
 * Used for:
 * - Level L: integration, indefinite_integrals, definite_integrals, area_under_curve
 * - Concept introductions for integration
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface IntegrationAnimationProps extends BaseAnimationProps {
  numRectangles?: number
}

export default function IntegrationAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  numRectangles: initialRects = 4,
}: IntegrationAnimationProps) {
  const [phase, setPhase] = useState<
    | 'setup'
    | 'explain_area'
    | 'rectangles'
    | 'explain_riemann'
    | 'refine'
    | 'limit_concept'
    | 'antiderivative'
    | 'area'
    | 'ftc'
    | 'complete'
  >('setup')
  const [numRects, setNumRects] = useState(initialRects)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const rectIndexRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: ∫₀² x² dx = [x³/3]₀² = 8/3 ≈ 2.67
  const operands = problemData?.operands || [0, 2] // [lower bound, upper bound]
  // Validate each operand individually to prevent NaN
  const lower = typeof operands[0] === 'number' && !isNaN(operands[0]) ? operands[0] : 0
  const upper = typeof operands[1] === 'number' && !isNaN(operands[1]) ? operands[1] : 2

  // f(x) = x² for this example
  const f = (x: number) => x * x

  // Calculate exact integral: ∫ x² dx = x³/3
  const exactArea = (Math.pow(upper, 3) - Math.pow(lower, 3)) / 3

  // SVG dimensions
  const width = 300
  const height = 260
  const padding = 40
  const scale = (width - 2 * padding) / 5 // -1 to 4 range

  const toSvgX = (x: number) => padding + (x + 1) * scale
  const toSvgY = (y: number) => height - padding - (y) * scale / 1.2

  // Generate curve points
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = -0.5; x <= 3.5; x += 0.05) {
      const y = f(x)
      if (y <= 10) {
        pts.push(`${toSvgX(x)},${toSvgY(y)}`)
      }
    }
    return pts.join(' ')
  }, [])

  // Generate rectangles for Riemann sum
  const rectangles = useMemo(() => {
    const rects = []
    const dx = (upper - lower) / numRects
    for (let i = 0; i < numRects; i++) {
      const x = lower + i * dx
      const h = f(x + dx / 2) // Midpoint rule
      rects.push({
        x: toSvgX(x),
        y: toSvgY(h),
        width: dx * scale,
        height: h * scale / 1.2,
        value: h * dx,
      })
    }
    return rects
  }, [numRects, lower, upper, scale])

  // Calculate Riemann sum
  const riemannSum = rectangles.reduce((sum, r) => sum + r.value, 0)

  // Animation effect for solution mode - with pause support using setInterval + tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setNumRects(initialRects)
      tickRef.current = 0
      rectIndexRef.current = 0
      return
    }

    // Tick-based animation for proper pause support
    // Extended to 10 phases (~20 seconds) for better education
    const TICK_MS = 100
    const EXPLAIN_AREA_TICK = 20        // 2s - explain "area under curve"
    const RECTANGLES_TICK = 40          // 4s - show initial rectangles
    const EXPLAIN_RIEMANN_TICK = 60     // 6s - explain Riemann sum
    const REFINE_START_TICK = 80        // 8s - start refining
    const REFINE_INTERVAL = 8           // 0.8s between each refinement step
    const LIMIT_CONCEPT_TICK = 120      // 12s - explain limit concept
    const ANTIDERIVATIVE_TICK = 140     // 14s - show antiderivative
    const AREA_TICK = 160               // 16s - show exact area
    const FTC_TICK = 180                // 18s - Fundamental Theorem connection
    const COMPLETE_TICK = 200           // 20s - complete

    const rectIntervals = [4, 8, 16, 32]

    const timer = setInterval(() => {
      if (isPausedRef.current) return
      tickRef.current++

      const tick = tickRef.current

      // Phase: Explain area under curve
      if (tick === EXPLAIN_AREA_TICK && phase === 'setup') {
        setPhase('explain_area')
        playPop()
      }

      // Phase: Show initial rectangles
      if (tick === RECTANGLES_TICK && phase === 'explain_area') {
        setPhase('rectangles')
        playWhoosh()
      }

      // Phase: Explain Riemann sum
      if (tick === EXPLAIN_RIEMANN_TICK && phase === 'rectangles') {
        setPhase('explain_riemann')
        playPop()
      }

      // Phase: Refine - increase rectangle count progressively
      if (tick === REFINE_START_TICK && phase === 'explain_riemann') {
        setPhase('refine')
        rectIndexRef.current = 0
        setNumRects(rectIntervals[0])
        playPop()
      }

      // Continue refinement at intervals
      if (phase === 'refine' && tick > REFINE_START_TICK && tick < LIMIT_CONCEPT_TICK) {
        const ticksSinceRefine = tick - REFINE_START_TICK
        const expectedIndex = Math.floor(ticksSinceRefine / REFINE_INTERVAL)
        if (expectedIndex > rectIndexRef.current && expectedIndex < rectIntervals.length) {
          rectIndexRef.current = expectedIndex
          setNumRects(rectIntervals[expectedIndex])
          playPop()
        }
      }

      // Phase: Explain limit concept (as n → ∞)
      if (tick === LIMIT_CONCEPT_TICK && phase === 'refine') {
        setPhase('limit_concept')
        playPop()
      }

      // Phase: Show antiderivative F(x) = x³/3
      if (tick === ANTIDERIVATIVE_TICK && phase === 'limit_concept') {
        setPhase('antiderivative')
        playPop()
      }

      // Phase: Show exact area calculation
      if (tick === AREA_TICK && phase === 'antiderivative') {
        setPhase('area')
        playPop()
      }

      // Phase: Fundamental Theorem connection
      if (tick === FTC_TICK && phase === 'area') {
        setPhase('ftc')
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
  }, [showSolution, phase, initialRects, onComplete, playPop, playSuccess, playWhoosh])

  // Generate filled area path
  const areaPath = useMemo(() => {
    let d = `M ${toSvgX(lower)} ${toSvgY(0)}`
    for (let x = lower; x <= upper; x += 0.05) {
      d += ` L ${toSvgX(x)} ${toSvgY(f(x))}`
    }
    d += ` L ${toSvgX(upper)} ${toSvgY(0)} Z`
    return d
  }, [lower, upper])

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Integral Notation */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 font-mono flex items-center justify-center gap-1">
          <span className="text-3xl">∫</span>
          <span className="text-sm relative -top-3">{upper}</span>
          <span className="text-sm relative top-3 -ml-2">{lower}</span>
          <span className="ml-1">x² dx</span>
          <span className="text-gray-500 ml-2">=</span>
          <span className="text-primary ml-2">{phase === 'complete' ? exactArea.toFixed(2) : '?'}</span>
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
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <line
                x1={toSvgX(i)}
                y1={padding}
                x2={toSvgX(i)}
                y2={height - padding}
                stroke={i === 0 ? '#374151' : '#e5e7eb'}
                strokeWidth={i === 0 ? 2 : 1}
              />
              {i <= 4 && (
                <line
                  x1={padding}
                  y1={toSvgY(i)}
                  x2={width - padding}
                  y2={toSvgY(i)}
                  stroke={i === 0 ? '#374151' : '#e5e7eb'}
                  strokeWidth={i === 0 ? 2 : 1}
                />
              )}
              {i !== 0 && (
                <text x={toSvgX(i)} y={toSvgY(0) + 15} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
              )}
              {i !== 0 && i <= 4 && (
                <text x={toSvgX(0) - 10} y={toSvgY(i) + 4} textAnchor="end" className="text-xs fill-gray-500">{i}</text>
              )}
            </g>
          ))}

          {/* Axis labels */}
          <text x={width - padding + 5} y={toSvgY(0) + 4} className="text-sm fill-gray-700 font-medium">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} className="text-sm fill-gray-700 font-medium">y</text>

          {/* Rectangles for Riemann sum */}
          {(phase === 'rectangles' || phase === 'explain_riemann' || phase === 'refine' || phase === 'limit_concept') && (
            <AnimatePresence mode="wait">
              {rectangles.map((rect, i) => (
                <motion.rect
                  key={`${numRects}-${i}`}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  stroke="#3b82f6"
                  strokeWidth={1}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  style={{ originY: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Filled area under curve */}
          {(phase === 'area' || phase === 'ftc' || phase === 'complete') && (
            <motion.path
              d={areaPath}
              fill="#10b981"
              fillOpacity={0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Function curve */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Bounds indicators */}
          <line
            x1={toSvgX(lower)}
            y1={toSvgY(0)}
            x2={toSvgX(lower)}
            y2={toSvgY(f(lower))}
            stroke="#9ca3af"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <line
            x1={toSvgX(upper)}
            y1={toSvgY(0)}
            x2={toSvgX(upper)}
            y2={toSvgY(f(upper))}
            stroke="#9ca3af"
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {/* Bound labels */}
          <text x={toSvgX(lower)} y={height - padding + 25} textAnchor="middle" className="text-xs fill-gray-600">a = {lower}</text>
          <text x={toSvgX(upper)} y={height - padding + 25} textAnchor="middle" className="text-xs fill-gray-600">b = {upper}</text>
        </svg>
      </div>

      {/* Information Panel */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[120px]">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Definite Integration</div>
            <div className="text-sm text-gray-600">
              <p>The definite integral calculates the area under a curve</p>
              <p className="mt-1">between two bounds a and b</p>
            </div>
          </div>
        )}

        {phase === 'explain_area' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">What is "Area Under a Curve"?</div>
            <div className="text-sm text-gray-600">
              <p>Imagine filling the space between the curve y = x² and the x-axis</p>
              <p className="mt-1">from x = {lower} to x = {upper}</p>
              <p className="mt-2 text-blue-600 font-medium">🎯 This shaded region is what we want to calculate!</p>
            </div>
          </motion.div>
        )}

        {phase === 'rectangles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Starting with Rectangles</div>
            <div className="text-sm">
              <p>We approximate the area using {numRects} rectangles</p>
              <p className="font-mono mt-1">
                Sum of rectangle areas ≈ {riemannSum.toFixed(3)}
              </p>
              <p className="mt-1 text-gray-500">This is just an approximation!</p>
            </div>
          </motion.div>
        )}

        {phase === 'explain_riemann' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">The Riemann Sum</div>
            <div className="text-sm text-gray-600">
              <p>Named after mathematician Bernhard Riemann</p>
              <p className="font-mono mt-1">Sum = Σ f(xᵢ) × Δx</p>
              <p className="mt-2">Each rectangle has width Δx and height f(xᵢ)</p>
            </div>
          </motion.div>
        )}

        {phase === 'refine' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-blue-600 mb-2">Refining the Approximation</div>
            <div className="text-sm">
              <p>More rectangles = better approximation</p>
              <p className="font-mono mt-1">
                {numRects} rectangles: sum ≈ {riemannSum.toFixed(3)}
              </p>
              <p className="mt-1 text-gray-500">Watch how the sum gets closer to the true area!</p>
            </div>
          </motion.div>
        )}

        {phase === 'limit_concept' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-orange-600 mb-2">The Limit Process</div>
            <div className="text-sm text-gray-600">
              <p>As we use infinitely many rectangles (n → ∞)</p>
              <p className="font-mono mt-1 text-lg">lim<sub>n→∞</sub> Σ f(xᵢ) × Δx = ∫ f(x) dx</p>
              <p className="mt-2">The sum becomes the integral!</p>
            </div>
          </motion.div>
        )}

        {phase === 'antiderivative' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-purple-600 mb-2">Finding the Antiderivative</div>
            <div className="text-sm text-gray-600">
              <p>To find ∫ x² dx, we need F(x) where F'(x) = x²</p>
              <p className="font-mono mt-1 text-lg">F(x) = x³/3</p>
              <p className="mt-2">Because: d/dx (x³/3) = 3x²/3 = x² ✓</p>
            </div>
          </motion.div>
        )}

        {phase === 'area' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Calculating the Exact Area</div>
            <div className="text-sm">
              <p>Apply the bounds: F({upper}) - F({lower})</p>
              <p className="font-mono mt-1">
                = ({upper})³/3 - ({lower})³/3 = {(Math.pow(upper, 3) / 3).toFixed(2)} - {(Math.pow(lower, 3) / 3).toFixed(2)}
              </p>
              <p className="font-mono text-lg mt-1 font-bold text-green-600">
                = {exactArea.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'ftc' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-indigo-600 mb-2">Fundamental Theorem of Calculus</div>
            <div className="text-sm text-gray-600">
              <p>This powerful theorem connects differentiation and integration:</p>
              <p className="font-mono mt-1 text-lg">∫ₐᵇ f(x)dx = F(b) - F(a)</p>
              <p className="mt-2">where F'(x) = f(x)</p>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg font-semibold text-green-600 mb-2">Integration Complete!</div>
            <div className="text-sm">
              <p>The exact area under y = x² from x = {lower} to x = {upper} is:</p>
              <p className="font-mono text-lg mt-1 font-bold">
                ∫<sub>{lower}</sub><sup>{upper}</sup> x² dx = {exactArea.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fundamental Theorem Reference */}
      <div className="bg-purple-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-purple-800">
          <strong>Fundamental Theorem:</strong> ∫ₐᵇ f(x)dx = F(b) - F(a) where F'(x) = f(x)
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Calculate the definite integral</p>
            <p className="text-sm mt-1 text-gray-500">Watch Riemann sums approach the true area</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              ∫<sub>{lower}</sub><sup>{upper}</sup> x² dx = {exactArea.toFixed(2)}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Starting integration...'}
            {phase === 'explain_area' && 'Understanding the area concept...'}
            {phase === 'rectangles' && 'Approximating with rectangles...'}
            {phase === 'explain_riemann' && 'Understanding Riemann sums...'}
            {phase === 'refine' && 'Adding more rectangles...'}
            {phase === 'limit_concept' && 'Taking the limit...'}
            {phase === 'antiderivative' && 'Finding the antiderivative...'}
            {phase === 'area' && 'Calculating exact area...'}
            {phase === 'ftc' && 'Applying the Fundamental Theorem...'}
          </p>
        )}
      </div>
    </div>
  )
}
