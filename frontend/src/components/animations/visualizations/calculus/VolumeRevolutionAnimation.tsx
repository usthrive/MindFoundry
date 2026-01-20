/**
 * VolumeRevolutionAnimation - Visual representation of solids of revolution
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Shows 2D region being rotated around an axis
 * - Demonstrates disk/washer method (perpendicular slices)
 * - Shows shell method (cylindrical shells)
 * - SETUP MODE (default): Shows 2D region
 * - SOLUTION MODE: Animates rotation and volume formula
 *
 * Used for:
 * - Level O: volume_disk_washer, volume_shell, arc_length
 * - Concept introductions for 3D calculus applications
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import type { BaseAnimationProps } from '../../core/types'

export interface VolumeRevolutionAnimationProps extends BaseAnimationProps {
  method?: 'disk' | 'washer' | 'shell'
}

type Phase =
  | 'setup'
  | 'real_world'
  | 'region_intro'
  | 'region_show'
  | 'axis_explain'
  | 'rotation_start'
  | 'rotation_half'
  | 'rotation_full'
  | 'solid_reveal'
  | 'slice_intro'
  | 'slice_show'
  | 'slice_measure'
  | 'formula_derive'
  | 'integrate'
  | 'result'
  | 'complete'

export default function VolumeRevolutionAnimation({
  problemData,
  showSolution = false,
  isPaused = false,
  onComplete,
  className,
  method = 'disk',
}: VolumeRevolutionAnimationProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [rotationAngle, setRotationAngle] = useState(0)
  const { playPop, playSuccess, playWhoosh } = useSoundEffects()

  // Refs for pause support
  const isPausedRef = useRef(isPaused)
  const tickRef = useRef(0)
  const rotationTickRef = useRef(0)

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // Default: y = √x from x = 0 to x = 4, rotated around x-axis
  // operands: [function coefficient, lower bound, upper bound]
  const operands = problemData?.operands || [1, 0, 4]
  const [a, lower, upper] = operands

  // SVG dimensions
  const width = 300
  const height = 260
  const centerX = width / 2
  const centerY = height / 2 + 20
  const scale = 25

  // Generate curve points for y = √x
  const curvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = lower; x <= upper; x += 0.1) {
      const y = a * Math.sqrt(x)
      pts.push(`${centerX + x * scale},${centerY - y * scale}`)
    }
    return pts.join(' ')
  }, [a, lower, upper, centerX, centerY, scale])

  // Generate reflected curve for 3D effect
  const reflectedCurvePoints = useMemo(() => {
    const pts: string[] = []
    for (let x = lower; x <= upper; x += 0.1) {
      const y = a * Math.sqrt(x)
      pts.push(`${centerX + x * scale},${centerY + y * scale}`)
    }
    return pts.join(' ')
  }, [a, lower, upper, centerX, centerY, scale])

  // Animate rotation during rotation phases
  useEffect(() => {
    if (phase === 'rotation_start' || phase === 'rotation_half' || phase === 'rotation_full') {
      const targetAngle = phase === 'rotation_start' ? 120 : phase === 'rotation_half' ? 240 : 360
      const interval = setInterval(() => {
        if (isPausedRef.current) return
        setRotationAngle(prev => {
          if (prev >= targetAngle) {
            clearInterval(interval)
            return targetAngle
          }
          return prev + 6
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Animation effect for solution mode - interval-based with tick counting
  useEffect(() => {
    if (!showSolution) {
      setPhase('setup')
      setRotationAngle(0)
      tickRef.current = 0
      return
    }

    const TICK_MS = 100
    const PHASE_DURATION = 22 // 2.2 seconds per phase (~35 seconds total for 16 phases)

    const phases: Phase[] = [
      'setup', 'real_world', 'region_intro', 'region_show', 'axis_explain',
      'rotation_start', 'rotation_half', 'rotation_full', 'solid_reveal',
      'slice_intro', 'slice_show', 'slice_measure', 'formula_derive',
      'integrate', 'result', 'complete'
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
        if (newPhase === 'rotation_start' || newPhase === 'rotation_half' || newPhase === 'rotation_full') {
          playWhoosh()
        } else if (newPhase === 'solid_reveal') {
          playSuccess()
        } else {
          playPop()
        }
      }
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [showSolution, phase, onComplete, playPop, playSuccess, playWhoosh])

  // Calculate disk radius at different x values
  const getDiskRadius = (x: number) => a * Math.sqrt(x) * scale

  // Method-specific formulas
  const getFormula = () => {
    if (method === 'disk') {
      return {
        setup: 'V = π∫[r(x)]² dx',
        specific: `V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx`,
        result: 'V = π[x²/2]₀⁴ = 8π',
      }
    } else if (method === 'washer') {
      return {
        setup: 'V = π∫([R(x)]² - [r(x)]²) dx',
        specific: 'V = π∫(outer² - inner²) dx',
        result: 'V = calculated area',
      }
    } else {
      return {
        setup: 'V = 2π∫ x·f(x) dx',
        specific: `V = 2π∫₀⁴ x·√x dx = 2π∫₀⁴ x^(3/2) dx`,
        result: 'V = 2π[2x^(5/2)/5]₀⁴ = 128π/5',
      }
    }
  }

  const formula = getFormula()

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Method Title */}
      <div className="text-center mb-2">
        <div className="text-xl font-bold text-gray-800">
          {method === 'disk' ? 'Disk Method' : method === 'washer' ? 'Washer Method' : 'Shell Method'}
        </div>
        <div className="text-sm text-gray-500">
          Rotating y = √x around the x-axis
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="flex justify-center mb-4">
        <svg
          width={width}
          height={height}
          className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border"
        >
          {/* Axes */}
          <line x1={centerX - 30} y1={centerY} x2={centerX + 130} y2={centerY} stroke="#374151" strokeWidth={2} />
          <line x1={centerX} y1={centerY + 60} x2={centerX} y2={centerY - 80} stroke="#374151" strokeWidth={2} />

          {/* Axis labels */}
          <text x={centerX + 135} y={centerY + 5} className="text-sm fill-gray-700">x</text>
          <text x={centerX + 5} y={centerY - 85} className="text-sm fill-gray-700">y</text>

          {/* X-axis tick marks */}
          {[1, 2, 3, 4].map(i => (
            <g key={i}>
              <line x1={centerX + i * scale} y1={centerY - 4} x2={centerX + i * scale} y2={centerY + 4} stroke="#374151" strokeWidth={1} />
              <text x={centerX + i * scale} y={centerY + 18} textAnchor="middle" className="text-xs fill-gray-500">{i}</text>
            </g>
          ))}

          {/* 2D Region (shaded area under curve) */}
          {(['region_show', 'axis_explain', 'rotation_start', 'rotation_half', 'rotation_full', 'solid_reveal',
             'slice_intro', 'slice_show', 'slice_measure', 'formula_derive', 'integrate', 'result', 'complete'] as Phase[]).includes(phase) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Fill under curve */}
              <path
                d={`M ${centerX},${centerY} ${curvePoints} L ${centerX + upper * scale},${centerY} Z`}
                fill="#93c5fd"
                opacity={0.4}
              />
            </motion.g>
          )}

          {/* Original curve (top) */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          {/* Reflected curve (bottom) - shows 3D effect */}
          {(['rotation_start', 'rotation_half', 'rotation_full', 'solid_reveal', 'slice_intro', 'slice_show',
             'slice_measure', 'formula_derive', 'integrate', 'result', 'complete'] as Phase[]).includes(phase) && (
            <motion.polyline
              points={reflectedCurvePoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="4,2"
              initial={{ opacity: 0 }}
              animate={{ opacity: rotationAngle > 90 ? 0.6 : 0 }}
            />
          )}

          {/* 3D solid outline when rotated */}
          {(['rotation_half', 'rotation_full', 'solid_reveal', 'slice_intro', 'slice_show',
             'slice_measure', 'formula_derive', 'integrate', 'result', 'complete'] as Phase[]).includes(phase) && rotationAngle > 180 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
              {/* Ellipses at key points to show 3D shape */}
              {[1, 2, 3, 4].map(x => {
                const r = getDiskRadius(x)
                const ellipseRatio = Math.abs(Math.cos((rotationAngle * Math.PI) / 180)) * 0.3 + 0.1
                return (
                  <ellipse
                    key={x}
                    cx={centerX + x * scale}
                    cy={centerY}
                    rx={4}
                    ry={r}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                )
              })}
            </motion.g>
          )}

          {/* Disk/Slice visualization */}
          {(['slice_show', 'slice_measure', 'formula_derive', 'integrate', 'result', 'complete'] as Phase[]).includes(phase) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {method === 'disk' || method === 'washer' ? (
                // Disk at x = 2
                <>
                  <ellipse
                    cx={centerX + 2 * scale}
                    cy={centerY}
                    rx={8}
                    ry={getDiskRadius(2)}
                    fill="#ef4444"
                    opacity={0.4}
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <line
                    x1={centerX + 2 * scale}
                    y1={centerY}
                    x2={centerX + 2 * scale}
                    y2={centerY - getDiskRadius(2)}
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <text
                    x={centerX + 2 * scale + 10}
                    y={centerY - getDiskRadius(2) / 2}
                    className="text-xs fill-red-600 font-medium"
                  >
                    r = √x
                  </text>
                </>
              ) : (
                // Shell at x = 2
                <>
                  <rect
                    x={centerX + 2 * scale - 3}
                    y={centerY - getDiskRadius(2)}
                    width={6}
                    height={getDiskRadius(2)}
                    fill="#10b981"
                    opacity={0.4}
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <text
                    x={centerX + 2 * scale + 10}
                    y={centerY - getDiskRadius(2) / 2}
                    className="text-xs fill-green-600 font-medium"
                  >
                    h = √x
                  </text>
                </>
              )}
            </motion.g>
          )}

          {/* Rotation arrow indicator */}
          {(['rotation_start', 'rotation_half', 'rotation_full'] as Phase[]).includes(phase) && (
            <motion.g
              animate={{ rotate: rotationAngle }}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            >
              <path
                d={`M ${centerX - 40} ${centerY - 50} A 50 50 0 0 1 ${centerX + 40} ${centerY - 50}`}
                fill="none"
                stroke="#f97316"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            </motion.g>
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
            </marker>
          </defs>

          {/* Rotation angle display */}
          {(['rotation_start', 'rotation_half', 'rotation_full'] as Phase[]).includes(phase) && (
            <text x={centerX} y={30} textAnchor="middle" className="text-sm fill-orange-600 font-bold">
              {rotationAngle}°
            </text>
          )}
        </svg>
      </div>

      {/* Formula Display */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[140px]">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-gray-700 mb-2">Solid of Revolution</div>
              <div className="text-sm text-gray-600">
                <p>When a 2D region is rotated around an axis,</p>
                <p>it creates a 3D solid with calculable volume</p>
              </div>
            </motion.div>
          )}

          {phase === 'real_world' && (
            <motion.div
              key="real_world"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-yellow-700 mb-2">Real-World Applications</div>
              <div className="grid grid-cols-4 gap-2 text-xs max-w-md mx-auto">
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-2xl">🍶</div>
                  <div className="font-medium">Vases</div>
                  <div className="text-gray-500">Pottery design</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-2xl">🚀</div>
                  <div className="font-medium">Rockets</div>
                  <div className="text-gray-500">Nose cones</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-2xl">🍷</div>
                  <div className="font-medium">Glasses</div>
                  <div className="text-gray-500">Wine glasses</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm text-center">
                  <div className="text-2xl">🔧</div>
                  <div className="font-medium">Pipes</div>
                  <div className="text-gray-500">Engineering</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'region_intro' && (
            <motion.div
              key="region_intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-blue-600 mb-2">Step 1: Start with a 2D Curve</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-sm text-gray-600 mb-2">We begin with a simple function:</div>
                <div className="font-mono text-xl text-blue-700">y = √x</div>
                <div className="text-xs text-gray-500 mt-1">This is the square root function</div>
              </div>
            </motion.div>
          )}

          {phase === 'region_show' && (
            <motion.div
              key="region_show"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-blue-600 mb-2">Step 2: Define the Region</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono">y = √x from x = 0 to x = 4</div>
                <div className="text-sm text-gray-500 mt-1">The shaded area under the curve</div>
                <div className="bg-blue-50 p-2 rounded mt-2 text-xs">
                  This 2D region will become a 3D solid!
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'axis_explain' && (
            <motion.div
              key="axis_explain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-orange-600 mb-2">Step 3: Choose Rotation Axis</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="font-mono text-lg">Rotate around the x-axis</div>
                <div className="text-sm text-gray-500 mt-2">
                  Like spinning a lathe or pottery wheel!
                </div>
                <div className="bg-orange-50 p-2 rounded mt-2 text-xs">
                  The curve sweeps out a 3D surface as it rotates 360°
                </div>
              </div>
            </motion.div>
          )}

          {(phase === 'rotation_start' || phase === 'rotation_half' || phase === 'rotation_full') && (
            <motion.div
              key="rotating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-orange-600 mb-2">Step 4: Rotate 360°</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-4xl font-bold text-orange-500">{rotationAngle}°</div>
                <div className="text-sm text-gray-500 mt-1">
                  {rotationAngle < 180 ? 'Creating the first half...' :
                   rotationAngle < 360 ? 'Almost complete...' : 'Full rotation!'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(rotationAngle / 360) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'solid_reveal' && (
            <motion.div
              key="solid_reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-purple-600 mb-2">3D Solid Formed!</div>
              <div className="bg-purple-50 p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-sm">The 2D region is now a 3D solid</div>
                <div className="text-xs text-gray-500 mt-1">
                  Shape: Like a paraboloid or bullet nose
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'slice_intro' && (
            <motion.div
              key="slice_intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-red-600 mb-2">Step 5: The Disk Method</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-sm text-gray-600 mb-2">To find volume, we slice the solid into thin disks</div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="font-mono text-red-700">Think of it like sliced bread!</div>
                  <div className="text-xs text-gray-500">Each slice is a circular disk</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'slice_show' && (
            <motion.div
              key="slice_show"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-red-600 mb-2">Step 6: Examine One Disk</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-sm mb-2">At position x, the disk has:</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-red-50 p-2 rounded">
                    <div className="font-bold text-red-700">Radius</div>
                    <div className="font-mono">r = √x</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="font-bold text-gray-700">Thickness</div>
                    <div className="font-mono">dx</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'slice_measure' && (
            <motion.div
              key="slice_measure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-red-600 mb-2">Step 7: Disk Volume</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-gray-600">Area of circle = πr²</div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    = π(√x)²
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg font-bold text-red-600"
                  >
                    = πx
                  </motion.div>
                  <div className="bg-red-50 p-2 rounded mt-2">
                    <div className="text-xs text-gray-600">Volume of thin disk:</div>
                    <div className="font-bold text-red-700">dV = πx · dx</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'formula_derive' && (
            <motion.div
              key="formula_derive"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Step 8: Set Up the Integral</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-sm text-gray-600 mb-2">Add up all the thin disks from x=0 to x=4:</div>
                <div className="font-mono text-lg text-green-700">
                  V = ∫₀⁴ πx dx
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  The integral sums infinitely many infinitely thin disks
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'integrate' && (
            <motion.div
              key="integrate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Step 9: Integrate</div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="space-y-2 font-mono text-sm">
                  <div>V = π ∫₀⁴ x dx</div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    = π [x²/2]₀⁴
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    = π (16/2 - 0)
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-lg font-bold text-green-600"
                  >
                    = 8π
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Final Answer</div>
              <div className="bg-green-100 p-4 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-3xl font-bold text-green-700 font-mono">V = 8π</div>
                <div className="text-sm text-gray-600 mt-2">≈ 25.13 cubic units</div>
                <div className="text-xs text-gray-500 mt-1">
                  The volume of y=√x rotated around x-axis from 0 to 4
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-lg font-semibold text-green-600 mb-2">Solution Complete!</div>
              <div className="bg-green-100 p-4 rounded-lg shadow-sm max-w-sm mx-auto">
                <div className="text-2xl font-bold text-green-700 font-mono">{formula.result}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Method Comparison */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className={cn(
          'p-2 rounded text-center',
          method === 'disk' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-red-50'
        )}>
          <div className="font-bold text-red-700">Disk Method</div>
          <div className="font-mono text-red-600">V = π∫r² dx</div>
          <div className="text-red-500">⊥ to axis</div>
        </div>
        <div className={cn(
          'p-2 rounded text-center',
          method === 'shell' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-green-50'
        )}>
          <div className="font-bold text-green-700">Shell Method</div>
          <div className="font-mono text-green-600">V = 2π∫rh dx</div>
          <div className="text-green-500">∥ to axis</div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-center">
        <div className="text-sm text-yellow-800">
          <strong>Key:</strong> Choose method based on which gives simpler integral!
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {['Region', 'Rotate', 'Solid', 'Slice', 'Formula', 'Result'].map((label, i) => {
          const stepPhases = ['region_show', 'rotation_full', 'solid_reveal', 'slice_measure', 'integrate', 'result']
          const phaseOrder: Phase[] = ['setup', 'real_world', 'region_intro', 'region_show', 'axis_explain',
            'rotation_start', 'rotation_half', 'rotation_full', 'solid_reveal', 'slice_intro', 'slice_show',
            'slice_measure', 'formula_derive', 'integrate', 'result', 'complete']
          const currentPhaseIndex = phaseOrder.indexOf(phase)
          const stepPhaseIndex = phaseOrder.indexOf(stepPhases[i] as Phase)
          const isComplete = currentPhaseIndex >= stepPhaseIndex && phase !== 'setup'
          return (
            <div
              key={label}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-all',
                isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              )}
            >
              {label}
            </div>
          )
        })}
      </div>

      {/* Status */}
      <div className="text-center">
        {!showSolution ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            <p className="text-lg font-medium">Find the volume of revolution</p>
            <p className="text-sm mt-1 text-gray-500">Using the {method} method</p>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <p className="text-xl font-bold text-green-600">
              {formula.result}
            </p>
          </motion.div>
        ) : (
          <p className="text-lg font-medium text-primary">
            {phase === 'setup' && 'Introducing volume of revolution...'}
            {phase === 'real_world' && 'Exploring real-world applications...'}
            {phase === 'region_intro' && 'Starting with the curve...'}
            {phase === 'region_show' && 'Defining the region...'}
            {phase === 'axis_explain' && 'Choosing rotation axis...'}
            {phase === 'rotation_start' && 'Starting rotation...'}
            {phase === 'rotation_half' && 'Continuing rotation...'}
            {phase === 'rotation_full' && 'Completing rotation...'}
            {phase === 'solid_reveal' && '3D solid formed!'}
            {phase === 'slice_intro' && 'Introducing the disk method...'}
            {phase === 'slice_show' && 'Examining a disk slice...'}
            {phase === 'slice_measure' && 'Calculating disk volume...'}
            {phase === 'formula_derive' && 'Setting up the integral...'}
            {phase === 'integrate' && 'Computing the integral...'}
            {phase === 'result' && 'Final answer!'}
          </p>
        )}
      </div>
    </div>
  )
}
