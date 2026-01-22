/**
 * AnimatedFraction - Reusable animated fraction display
 * Phase 1.13: Educational Animation System
 *
 * Base component for:
 * - FractionBarAnimation
 * - FractionCircleAnimation
 * - FractionOperationAnimation
 * - Displaying fractions in equations
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AnimatedFractionProps {
  /** Numerator */
  numerator: number
  /** Denominator */
  denominator: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Highlight the fraction */
  highlighted?: boolean
  /** Color scheme */
  color?: 'primary' | 'green' | 'blue' | 'orange' | 'gray'
  /** Animate entry */
  animateEntry?: boolean
  /** Show as mixed number if applicable */
  showMixed?: boolean
  /** Additional CSS classes */
  className?: string
}

const SIZES = {
  sm: { text: 'text-lg', line: 'w-6', spacing: 'py-0.5' },
  md: { text: 'text-2xl', line: 'w-10', spacing: 'py-1' },
  lg: { text: 'text-3xl sm:text-4xl', line: 'w-14', spacing: 'py-1.5' },
  xl: { text: 'text-4xl sm:text-5xl', line: 'w-20', spacing: 'py-2' },
}

const COLORS = {
  primary: 'text-primary',
  green: 'text-green-600',
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  gray: 'text-gray-700',
}

export default function AnimatedFraction({
  numerator,
  denominator,
  size = 'lg',
  highlighted = false,
  color = 'gray',
  animateEntry = true,
  showMixed = false,
  className,
}: AnimatedFractionProps) {
  const sizeStyles = SIZES[size]
  const colorStyle = COLORS[color]

  // Calculate mixed number if needed
  const wholePart = showMixed && numerator >= denominator ? Math.floor(numerator / denominator) : 0
  const remainingNumerator = showMixed && wholePart > 0 ? numerator % denominator : numerator

  return (
    <motion.div
      initial={animateEntry ? { scale: 0, opacity: 0 } : undefined}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center gap-1',
        highlighted && 'bg-yellow-100 px-3 py-1 rounded-lg ring-2 ring-yellow-400',
        className
      )}
    >
      {/* Whole number part (for mixed fractions) */}
      {wholePart > 0 && (
        <span className={cn(sizeStyles.text, 'font-bold', colorStyle, 'mr-1')}>
          {wholePart}
        </span>
      )}

      {/* Fraction part (skip if numerator is 0 after extracting whole) */}
      {(remainingNumerator > 0 || wholePart === 0) && (
        <div className="inline-flex flex-col items-center">
          {/* Numerator */}
          <motion.span
            key={`num-${numerator}`}
            initial={animateEntry ? { y: -10, opacity: 0 } : undefined}
            animate={{ y: 0, opacity: 1 }}
            className={cn(sizeStyles.text, 'font-bold leading-tight', colorStyle)}
          >
            {remainingNumerator}
          </motion.span>

          {/* Fraction line */}
          <motion.div
            initial={animateEntry ? { scaleX: 0 } : undefined}
            animate={{ scaleX: 1 }}
            className={cn(sizeStyles.line, 'h-0.5 bg-current', colorStyle, sizeStyles.spacing)}
          />

          {/* Denominator */}
          <motion.span
            key={`den-${denominator}`}
            initial={animateEntry ? { y: 10, opacity: 0 } : undefined}
            animate={{ y: 0, opacity: 1 }}
            className={cn(sizeStyles.text, 'font-bold leading-tight', colorStyle)}
          >
            {denominator}
          </motion.span>
        </div>
      )}
    </motion.div>
  )
}

/**
 * FractionBar - Visual bar representation of a fraction
 */
export interface FractionBarProps {
  /** Numerator (shaded parts) */
  numerator: number
  /** Denominator (total parts) */
  denominator: number
  /** Bar orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Height/width of bar in pixels */
  barSize?: number
  /** Color for filled sections */
  fillColor?: string
  /** Color for empty sections */
  emptyColor?: string
  /** Animate the filling */
  animateFill?: boolean
  /** Currently highlighted section */
  highlightedSection?: number
  /** Show section numbers */
  showLabels?: boolean
  /** Additional CSS classes */
  className?: string
}

export function FractionBar({
  numerator,
  denominator,
  orientation = 'horizontal',
  barSize = 200,
  fillColor = '#3b82f6',
  emptyColor = '#e5e7eb',
  animateFill = true,
  highlightedSection,
  showLabels = false,
  className,
}: FractionBarProps) {
  const isHorizontal = orientation === 'horizontal'
  const sectionSize = barSize / denominator

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-lg border-2 border-gray-300',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={{
        width: isHorizontal ? barSize : sectionSize * 1.5,
        height: isHorizontal ? sectionSize * 1.5 : barSize,
      }}
    >
      {Array.from({ length: denominator }, (_, index) => {
        const isFilled = index < numerator
        const isHighlighted = index === highlightedSection

        return (
          <motion.div
            key={index}
            initial={animateFill ? { opacity: 0 } : undefined}
            animate={{
              opacity: 1,
              scale: isHighlighted ? 1.05 : 1,
            }}
            transition={{
              delay: animateFill ? index * 0.1 : 0,
              type: 'spring',
              stiffness: 300,
            }}
            className={cn(
              'flex items-center justify-center relative',
              'border-gray-300',
              isHorizontal ? 'border-r last:border-r-0' : 'border-b last:border-b-0',
              isHighlighted && 'ring-2 ring-yellow-400 ring-inset z-10'
            )}
            style={{
              width: isHorizontal ? sectionSize : '100%',
              height: isHorizontal ? '100%' : sectionSize,
              backgroundColor: isFilled ? fillColor : emptyColor,
            }}
          >
            {showLabels && (
              <span className={cn(
                'text-xs font-bold',
                isFilled ? 'text-white' : 'text-gray-400'
              )}>
                {index + 1}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * FractionCircle - Pie chart representation of a fraction
 */
export interface FractionCircleProps {
  /** Numerator (shaded slices) */
  numerator: number
  /** Denominator (total slices) */
  denominator: number
  /** Circle diameter */
  size?: number
  /** Fill color */
  fillColor?: string
  /** Empty color */
  emptyColor?: string
  /** Animate the slices */
  animateSlices?: boolean
  /** Additional CSS classes */
  className?: string
}

export function FractionCircle({
  numerator,
  denominator,
  size = 150,
  fillColor = '#3b82f6',
  emptyColor = '#e5e7eb',
  animateSlices = true,
  className,
}: FractionCircleProps) {
  const radius = size / 2
  const center = radius

  // Generate pie slices using SVG
  const createSlicePath = (index: number) => {
    const startAngle = (index / denominator) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((index + 1) / denominator) * 2 * Math.PI - Math.PI / 2

    const x1 = center + radius * Math.cos(startAngle)
    const y1 = center + radius * Math.sin(startAngle)
    const x2 = center + radius * Math.cos(endAngle)
    const y2 = center + radius * Math.sin(endAngle)

    const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius - 2}
        fill={emptyColor}
        stroke="#d1d5db"
        strokeWidth={2}
      />

      {/* Slices */}
      {Array.from({ length: denominator }, (_, index) => {
        const isFilled = index < numerator

        return (
          <motion.path
            key={index}
            d={createSlicePath(index)}
            fill={isFilled ? fillColor : 'transparent'}
            initial={animateSlices ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: animateSlices ? index * 0.1 : 0,
              type: 'spring',
              stiffness: 300,
            }}
          />
        )
      })}

      {/* Slice divider lines */}
      {Array.from({ length: denominator }, (_, index) => {
        const angle = (index / denominator) * 2 * Math.PI - Math.PI / 2
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)

        return (
          <line
            key={`line-${index}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#9ca3af"
            strokeWidth={1}
          />
        )
      })}
    </svg>
  )
}
