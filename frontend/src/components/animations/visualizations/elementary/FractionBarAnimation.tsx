/**
 * FractionBarAnimation - Visual representation of fractions using bars
 * Phase 1.13: Educational Animation System
 *
 * PEDAGOGICAL APPROACH:
 * - Fractions are "parts of a whole"
 * - Show the whole divided into equal parts
 * - Shade the numerator portions
 * - Compare fractions by comparing bar lengths
 * - SETUP MODE (default): Shows bars with question
 * - SOLUTION MODE: Animates shading and reveals answer
 *
 * Used for:
 * - Level D: fractions_intro, fraction_identification
 * - Level D: equivalent_fractions, reducing_fractions
 * - Concept introductions for fractions
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import AnimatedFraction, { FractionBar, FractionCircle } from '../../shared/AnimatedFraction'
import type { BaseAnimationProps } from '../../core/types'

export interface FractionBarAnimationProps extends BaseAnimationProps {
  /** Show pie/circle visualization instead of bar */
  showCircle?: boolean
  /** Show equivalent fraction comparison */
  showEquivalent?: boolean
}

export default function FractionBarAnimation({
  problemData,
  showSolution = false,
  onComplete,
  className,
  showCircle = false,
  showEquivalent: _showEquivalent = false,
}: FractionBarAnimationProps) {
  const [filledSections, setFilledSections] = useState(0)
  const [currentSection, setCurrentSection] = useState(-1)
  const [phase, setPhase] = useState<'setup' | 'filling' | 'complete'>('setup')
  const { playPop, playSuccess } = useSoundEffects()

  // Extract operands: [numerator, denominator] e.g., [3, 4] = 3/4
  // For equivalents: [num1, den1, num2, den2] e.g., [1, 2, 2, 4] = 1/2 = 2/4
  const operands = problemData?.operands || [3, 4]
  const numerator = operands[0]
  const denominator = operands[1]
  const hasSecondFraction = operands.length >= 4
  const numerator2 = hasSecondFraction ? operands[2] : undefined
  const denominator2 = hasSecondFraction ? operands[3] : undefined

  // Animation effect for solution mode
  useEffect(() => {
    if (!showSolution) {
      setFilledSections(0)
      setCurrentSection(-1)
      setPhase('setup')
      return
    }

    setPhase('filling')

    let section = 0
    const fillTimer = setInterval(() => {
      if (section >= numerator) {
        clearInterval(fillTimer)
        setPhase('complete')
        playSuccess()
        onComplete?.()
        return
      }

      setCurrentSection(section)
      setFilledSections(section + 1)
      playPop()
      section++
    }, 400)

    return () => clearInterval(fillTimer)
  }, [showSolution, numerator, onComplete, playPop, playSuccess])

  // Colors for the bars
  const primaryColor = '#3b82f6' // blue-500
  const secondaryColor = '#22c55e' // green-500

  return (
    <div className={cn('w-full py-4', className)}>
      {/* Fraction Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4">
          <AnimatedFraction
            numerator={numerator}
            denominator={denominator}
            size="xl"
            color={phase === 'complete' ? 'blue' : 'gray'}
            highlighted={phase === 'complete'}
          />

          {hasSecondFraction && numerator2 !== undefined && denominator2 !== undefined && (
            <>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl text-gray-400"
              >
                =
              </motion.span>
              <AnimatedFraction
                numerator={numerator2}
                denominator={denominator2}
                size="xl"
                color={phase === 'complete' ? 'green' : 'gray'}
                highlighted={phase === 'complete'}
              />
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {hasSecondFraction
            ? 'These fractions are equal!'
            : `${numerator} out of ${denominator} equal parts`}
        </p>
      </div>

      {/* Visual Representation */}
      <div className="flex flex-col items-center gap-6">
        {/* Primary Fraction Bar/Circle */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-2">
            {numerator}/{denominator}
          </p>
          {showCircle ? (
            <FractionCircle
              numerator={showSolution ? filledSections : numerator}
              denominator={denominator}
              size={150}
              fillColor={primaryColor}
              animateSlices={showSolution}
            />
          ) : (
            <FractionBar
              numerator={showSolution ? filledSections : numerator}
              denominator={denominator}
              barSize={Math.min(280, denominator * 50)}
              fillColor={primaryColor}
              animateFill={showSolution}
              highlightedSection={showSolution ? currentSection : undefined}
              showLabels={denominator <= 10}
            />
          )}
        </div>

        {/* Second Fraction (for equivalents) */}
        {hasSecondFraction && numerator2 !== undefined && denominator2 !== undefined && (
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-2">
              {numerator2}/{denominator2}
            </p>
            {showCircle ? (
              <FractionCircle
                numerator={phase === 'complete' ? numerator2 : 0}
                denominator={denominator2}
                size={150}
                fillColor={secondaryColor}
                animateSlices={phase === 'complete'}
              />
            ) : (
              <FractionBar
                numerator={phase === 'complete' ? numerator2 : 0}
                denominator={denominator2}
                barSize={Math.min(280, denominator2 * 50)}
                fillColor={secondaryColor}
                animateFill={phase === 'complete'}
                showLabels={denominator2 <= 10}
              />
            )}
          </div>
        )}

        {/* Equivalence Comparison Line */}
        {hasSecondFraction && phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg"
          >
            <span className="text-lg">✓</span>
            <span className="font-medium text-yellow-800">
              Same amount shaded - they're equal!
            </span>
          </motion.div>
        )}
      </div>

      {/* Section Counter */}
      {showSolution && phase !== 'setup' && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            {Array.from({ length: denominator }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  backgroundColor: i < filledSections ? primaryColor : '#e5e7eb',
                }}
                transition={{ delay: i * 0.05 }}
                className="w-3 h-3 rounded-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions / Status */}
      <div className="text-center mt-6">
        {!showSolution ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <p className="text-lg font-medium">
              What fraction is shaded?
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Count the shaded parts out of the total
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            {phase === 'filling' && (
              <div>
                <motion.p
                  key={filledSections}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-primary"
                >
                  {filledSections} of {denominator}
                </motion.p>
                <p className="text-sm text-gray-500 mt-1">
                  Shading each part...
                </p>
              </div>
            )}
            {phase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-xl font-bold text-green-600">
                  {numerator}/{denominator}
                  {hasSecondFraction && ` = ${numerator2}/${denominator2}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {hasSecondFraction
                    ? 'These fractions represent the same amount!'
                    : `${numerator} parts shaded out of ${denominator} total`}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
