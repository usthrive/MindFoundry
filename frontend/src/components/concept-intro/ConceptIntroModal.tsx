/**
 * Concept Introduction Modal
 * Phase 1.12: Educational Animation System
 *
 * Full-screen modal that introduces new mathematical concepts with animations.
 * Shows when students encounter new concepts at a worksheet.
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { KumonLevel } from '@/types'
import { getConceptAnimation, type ConceptIntroConfig } from '@/services/conceptAnimationMapping'
import AnimationPlayer from '@/components/animations/core/AnimationPlayer'
import CountingObjectsAnimation from '@/components/animations/visualizations/CountingObjectsAnimation'
import NumberLineAnimation from '@/components/animations/visualizations/NumberLineAnimation'
import TenFrameAnimation from '@/components/animations/visualizations/TenFrameAnimation'
import PlaceValueAnimation from '@/components/animations/visualizations/PlaceValueAnimation'
import SequenceAnimation from '@/components/animations/visualizations/SequenceAnimation'
// Level C-F animation imports
import ArrayGroupsAnimation from '@/components/animations/visualizations/elementary/ArrayGroupsAnimation'
import FairSharingAnimation from '@/components/animations/visualizations/elementary/FairSharingAnimation'
import LongDivisionStepsAnimation from '@/components/animations/visualizations/elementary/LongDivisionStepsAnimation'
import FractionBarAnimation from '@/components/animations/visualizations/elementary/FractionBarAnimation'
import FractionOperationAnimation from '@/components/animations/visualizations/elementary/FractionOperationAnimation'
// Level G-I algebra animation imports
import BalanceScaleAnimation from '@/components/animations/visualizations/algebra/BalanceScaleAnimation'
import AlgebraTilesAnimation from '@/components/animations/visualizations/algebra/AlgebraTilesAnimation'
import CoordinatePlotAnimation from '@/components/animations/visualizations/algebra/CoordinatePlotAnimation'

interface ConceptIntroModalProps {
  show: boolean
  concepts: string[]
  level: KumonLevel
  worksheet: number
  onComplete: () => void
}

export default function ConceptIntroModal({
  show,
  concepts,
  level: _level,
  worksheet: _worksheet,
  onComplete,
}: ConceptIntroModalProps) {
  // Note: _level and _worksheet are available for future enhancements (e.g., showing level info)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canContinue, setCanContinue] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)
  // For optional concepts: track if user chose to watch animation
  const [showingOptionalAnimation, setShowingOptionalAnimation] = useState(false)

  // Get current concept config
  const currentConcept = concepts[currentIndex]
  const config = currentConcept ? getConceptAnimation(currentConcept) : undefined
  const totalConcepts = concepts.length

  // Check if current concept is optional (can be skipped)
  const isOptionalConcept = config?.showMode === 'optional'
  // Should we show the animation? (mandatory always, optional only if user chose to watch)
  const shouldShowAnimation = !isOptionalConcept || showingOptionalAnimation

  // Reset state when modal opens or concepts change
  useEffect(() => {
    if (show && concepts.length > 0) {
      setCurrentIndex(0)
      setCanContinue(false)
      setIsReady(false)
      setAnimationKey(0)
      setHasPlayedOnce(false)
      setShowingOptionalAnimation(false)
      const initialTime = config?.minViewTime || 15
      setTimeRemaining(initialTime)
    }
  }, [show, concepts])

  // Track when animation has played at least once (timer completed)
  useEffect(() => {
    if (canContinue && !hasPlayedOnce) {
      setHasPlayedOnce(true)
    }
  }, [canContinue, hasPlayedOnce])

  // Ready state countdown (3 seconds before animation starts)
  // Only runs for mandatory concepts OR if user chose to watch optional animation
  useEffect(() => {
    if (!show || !config || !shouldShowAnimation) return

    setIsReady(false)
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 3000) // 3 seconds "Get Ready!" phase

    return () => clearTimeout(readyTimer)
  }, [show, currentIndex, config, animationKey, shouldShowAnimation])

  // Timer for minimum view time (starts after ready phase)
  useEffect(() => {
    if (!show || !config || !isReady) return

    setCanContinue(false)
    setTimeRemaining(config.minViewTime)

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanContinue(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [show, currentIndex, config, isReady, animationKey])

  // Handle replay button
  const handleReplay = useCallback(() => {
    setIsReady(false)
    setCanContinue(false)
    setAnimationKey((prev) => prev + 1)
    setTimeRemaining(config?.minViewTime || 15)
  }, [config])

  // Handle continue button (also used for close button)
  const handleContinue = useCallback(() => {
    // Allow continue if timer is done OR if user has played at least once (for close button)
    if (!canContinue && !hasPlayedOnce) return

    if (currentIndex < totalConcepts - 1) {
      // Move to next concept
      setCurrentIndex((prev) => prev + 1)
      setCanContinue(false)
      setShowingOptionalAnimation(false) // Reset for next concept
    } else {
      // All concepts viewed
      onComplete()
    }
  }, [canContinue, hasPlayedOnce, currentIndex, totalConcepts, onComplete])

  // Handle close button (always close when hasPlayedOnce, regardless of current concept)
  const handleClose = useCallback(() => {
    if (!hasPlayedOnce) return
    onComplete()
  }, [hasPlayedOnce, onComplete])

  // Handle "Watch Animation" button for optional concepts
  const handleWatchAnimation = useCallback(() => {
    setShowingOptionalAnimation(true)
  }, [])

  // Handle "I'm Ready!" button for optional concepts (skip animation)
  const handleSkipAnimation = useCallback(() => {
    // Mark as played (allows close button) and enable continue
    setHasPlayedOnce(true)
    setCanContinue(true)

    if (currentIndex < totalConcepts - 1) {
      // Move to next concept
      setCurrentIndex((prev) => prev + 1)
      setShowingOptionalAnimation(false)
      setCanContinue(false)
    } else {
      // All concepts viewed
      onComplete()
    }
  }, [currentIndex, totalConcepts, onComplete])

  // Handle escape key (allow escape after first play)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (canContinue || hasPlayedOnce)) {
        handleClose()
      }
    }

    if (show) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [show, canContinue, hasPlayedOnce, handleClose])

  // Render the appropriate animation based on type
  // The key prop forces re-render on replay
  const renderAnimation = (config: ConceptIntroConfig, key: number) => {
    const problemData = { operands: config.demoOperands }

    switch (config.animationId) {
      case 'counting-objects':
        return (
          <CountingObjectsAnimation
            key={`counting-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'number-line-addition':
        return (
          <NumberLineAnimation
            key={`numline-add-${key}`}
            problemData={problemData}
            isSubtraction={false}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'number-line-subtraction':
        return (
          <NumberLineAnimation
            key={`numline-sub-${key}`}
            problemData={problemData}
            isSubtraction={true}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'ten-frame':
        return (
          <TenFrameAnimation
            key={`tenframe-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'place-value':
        return (
          <PlaceValueAnimation
            key={`placevalue-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'sequence':
        return (
          <SequenceAnimation
            key={`sequence-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level C: Multiplication - Array Groups
      case 'array-groups':
        return (
          <ArrayGroupsAnimation
            key={`array-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level C: Division - Fair Sharing
      case 'fair-sharing':
        return (
          <FairSharingAnimation
            key={`sharing-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level C-D: Long Division Steps
      case 'long-division-steps':
        return (
          <LongDivisionStepsAnimation
            key={`longdiv-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level D: Fractions - Bar Visualization
      case 'fraction-bar':
        return (
          <FractionBarAnimation
            key={`fracbar-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level D: Equivalent Fractions - Bar Comparison
      case 'equivalent-fractions':
        return (
          <FractionBarAnimation
            key={`equivfrac-${key}`}
            problemData={problemData}
            showSolution={isReady}
            showEquivalent={true}
            className="mx-auto"
          />
        )

      // Level E: Fraction Operations (add/subtract/multiply/divide)
      case 'fraction-operation':
        return (
          <FractionOperationAnimation
            key={`fracop-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level G: Algebra Tiles (integers, polynomials)
      case 'algebra-tiles':
        return (
          <AlgebraTilesAnimation
            key={`tiles-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level G: Balance Scale (equation solving)
      case 'balance-scale':
        return (
          <BalanceScaleAnimation
            key={`balance-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level H: Coordinate Plotting (functions, systems)
      case 'coordinate-plot':
        return (
          <CoordinatePlotAnimation
            key={`coord-${key}`}
            problemData={problemData}
            showSolution={isReady}
            showSecondLine={config.demoOperands.length >= 4}
            className="mx-auto"
          />
        )

      // Level I: Placeholder animations (FOIL, factoring, parabolas)
      // These fall through to default for now - components to be created
      case 'foil-visual':
      case 'factoring-visual':
      case 'parabola-graph':
      case 'quadratic-formula':
        // Fallback to algebra tiles visualization for polynomial concepts
        return (
          <AlgebraTilesAnimation
            key={`placeholder-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      default:
        return null
    }
  }

  if (!show || concepts.length === 0) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sparkle decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl sm:text-3xl"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {i % 2 === 0 ? '✨' : '⭐'}
              </motion.div>
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full mx-4"
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent px-4 py-3 sm:px-6 sm:py-4 relative">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-2xl sm:text-3xl">🎓</span>
                  <span className="text-lg sm:text-xl font-bold text-white">New Concept!</span>
                </motion.div>

                {/* Progress dots */}
                {totalConcepts > 1 && (
                  <div className="flex gap-1.5 mr-8">
                    {[...Array(totalConcepts)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          i === currentIndex ? 'bg-white' : 'bg-white/40'
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Close button (visible after first play) */}
              <AnimatePresence>
                {hasPlayedOnce && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClose}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Close"
                  >
                    <span className="text-white text-xl leading-none">×</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {config ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentIndex}-${showingOptionalAnimation}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
                      {config.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                      {config.description}
                    </p>

                    {/* Optional Concept: Choice UI (before user chooses) */}
                    {isOptionalConcept && !showingOptionalAnimation ? (
                      <div className="text-center py-6">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl mb-6"
                        >
                          📚
                        </motion.div>
                        <p className="text-gray-600 mb-6">
                          You've seen this type of animation before.
                          <br />
                          Would you like to watch it again?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={handleWatchAnimation}
                            className="px-6 py-3 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <span className="mr-2">🎬</span>
                            Watch Animation
                          </button>
                          <button
                            onClick={handleSkipAnimation}
                            className="px-6 py-3 rounded-full font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg transition-all"
                          >
                            <span className="mr-2">✨</span>
                            I'm Ready!
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Animation Container with Get Ready overlay */}
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 relative min-h-[200px]">
                          {/* Get Ready Overlay */}
                          <AnimatePresence>
                            {!isReady && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gray-50 rounded-xl z-10 flex flex-col items-center justify-center"
                              >
                                <motion.div
                                  animate={{
                                    scale: [1, 1.1, 1],
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                  }}
                                  className="text-4xl sm:text-5xl mb-4"
                                >
                                  👀
                                </motion.div>
                                <motion.p
                                  animate={{
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                  }}
                                  className="text-xl sm:text-2xl font-bold text-primary"
                                >
                                  Get Ready!
                                </motion.p>
                                <p className="text-sm text-gray-500 mt-2">
                                  Watch carefully...
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Animation Content */}
                          <AnimationPlayer showControls={false} autoPlay={isReady}>
                            {renderAnimation(config, animationKey)}
                          </AnimationPlayer>
                        </div>

                        {/* Replay Button */}
                        <div className="flex justify-center mb-4">
                          <button
                            onClick={handleReplay}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <span className="text-lg">🔄</span>
                            Watch Again
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : (
                // Fallback for unmapped concepts
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📚</span>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    New Topic: {currentConcept?.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-gray-600">
                    Let's learn something new!
                  </p>
                </div>
              )}

              {/* Continue Button - only show for mandatory concepts or when watching optional animation */}
              {(!isOptionalConcept || showingOptionalAnimation) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={cn(
                      'w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-lg transition-all',
                      canContinue
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    {canContinue ? (
                      currentIndex < totalConcepts - 1 ? 'Next' : "Let's Practice!"
                    ) : (
                      `Wait ${timeRemaining}s...`
                    )}
                  </button>

                {/* Skip hint for multiple concepts */}
                {totalConcepts > 1 && (
                  <p className="text-xs text-gray-400">
                    {currentIndex + 1} of {totalConcepts} concepts
                  </p>
                )}
              </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
