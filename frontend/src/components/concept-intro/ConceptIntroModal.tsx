/**
 * Concept Introduction Modal
 * Phase 1.12: Educational Animation System
 * Phase 1.19: Step-Based Wizard with Video-First Flow
 *
 * Step-based modal that introduces new mathematical concepts:
 * 1. Intro Screen: Announces the new concept
 * 2. Videos Step: Shows 2 videos that must be watched
 * 3. Animation Step: Shows the educational animation
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { KumonLevel, Video } from '@/types'
import { getConceptAnimation, type ConceptIntroConfig } from '@/services/conceptAnimationMapping'
import { recordVideoViewStart, getVideosForConcept } from '@/services/videoService'
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

// ============ VideoCard Component ============
interface VideoCardProps {
  video: Video | null
  label: string
  isWatched: boolean
  onWatchComplete: () => void
  childId?: string
  conceptId?: string
}

function VideoCard({ video, label, isWatched, onWatchComplete, childId, conceptId }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [watchTimer, setWatchTimer] = useState<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (watchTimer) clearTimeout(watchTimer)
    }
  }, [watchTimer])

  const handlePlayClick = useCallback(() => {
    setIsPlaying(true)

    // Record video view start
    if (video && childId && conceptId) {
      recordVideoViewStart(childId, video.id, conceptId, 'concept_intro')
    }

    // Mark as watched after 5 seconds of viewing
    const timer = setTimeout(() => {
      onWatchComplete()
    }, 5000)
    setWatchTimer(timer)
  }, [video, childId, conceptId, onWatchComplete])

  // Format duration helper
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  if (!video) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="text-gray-400 text-3xl mb-2">📹</div>
        <p className="text-gray-400 text-sm">No video available</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm border-2 transition-all overflow-hidden',
      isWatched ? 'border-green-500' : 'border-gray-200'
    )}>
      {/* Video Label Header */}
      <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        {isWatched && (
          <span className="text-green-500 text-sm font-medium flex items-center gap-1">
            <span>✓</span> Watched
          </span>
        )}
      </div>

      {/* Video Player or Thumbnail */}
      <div className="aspect-video bg-black">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={handlePlayClick}
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-xl ml-1">▶</span>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{video.title}</h4>
        <p className="text-xs text-gray-500 mt-1">
          {video.channelName} • {formatDuration(video.durationSeconds)}
        </p>
      </div>
    </div>
  )
}

// ============ Main Modal Component ============
interface ConceptIntroModalProps {
  show: boolean
  concepts: string[]
  level: KumonLevel
  worksheet: number
  onComplete: () => void
  childId?: string
  childAge?: number
}

export default function ConceptIntroModal({
  show,
  concepts,
  level,
  worksheet: _worksheet,
  onComplete,
  childId,
  childAge = 7,
}: ConceptIntroModalProps) {
  // Step-based flow state
  type ModalStep = 'intro' | 'videos' | 'animation'
  const [currentStep, setCurrentStep] = useState<ModalStep>('intro')

  // Multi-concept tracking
  const [currentIndex, setCurrentIndex] = useState(0)

  // Video watching state
  const [videosWatched, setVideosWatched] = useState({ video1: false, video2: false })
  const [shortVideo, setShortVideo] = useState<Video | null>(null)
  const [detailedVideo, setDetailedVideo] = useState<Video | null>(null)
  const [hasVideos, setHasVideos] = useState(false)
  const [videosLoading, setVideosLoading] = useState(true)

  // Animation state
  const [animationKey, setAnimationKey] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // Close button state (functional after 3 seconds)
  const [canClose, setCanClose] = useState(false)

  // Get current concept config
  const currentConcept = concepts[currentIndex]
  const config = currentConcept ? getConceptAnimation(currentConcept) : undefined
  const totalConcepts = concepts.length

  // Compute video progress
  const videoCount = (shortVideo ? 1 : 0) + (detailedVideo ? 1 : 0)
  const watchedCount = (videosWatched.video1 ? 1 : 0) + (videosWatched.video2 ? 1 : 0)
  const allVideosWatched = videoCount > 0 ? watchedCount >= videoCount : true

  // Reset state when modal opens or concepts change
  useEffect(() => {
    if (show && concepts.length > 0) {
      setCurrentIndex(0)
      setCurrentStep('intro')
      setVideosWatched({ video1: false, video2: false })
      setShortVideo(null)
      setDetailedVideo(null)
      setHasVideos(false)
      setVideosLoading(true)
      setAnimationKey(0)
      setIsReady(false)
      setCanClose(false)
    }
  }, [show, concepts])

  // Enable close button after 3 seconds
  useEffect(() => {
    if (!show) return

    const closeTimer = setTimeout(() => {
      setCanClose(true)
    }, 3000)

    return () => clearTimeout(closeTimer)
  }, [show, currentIndex])

  // Load videos for current concept
  useEffect(() => {
    if (show && currentConcept) {
      setVideosLoading(true)
      console.log('[ConceptIntro] Loading videos for concept:', currentConcept, 'childAge:', childAge, 'level:', level)

      getVideosForConcept(currentConcept, childAge, level)
        .then(({ short, detailed }) => {
          console.log('[ConceptIntro] Videos result:', {
            short: !!short,
            detailed: !!detailed,
            shortTitle: short?.title,
            detailedTitle: detailed?.title
          })
          setShortVideo(short)
          setDetailedVideo(detailed)
          setHasVideos(short !== null || detailed !== null)
          setVideosLoading(false)
        })
        .catch((err) => {
          console.error('[ConceptIntro] Video loading error:', err)
          setShortVideo(null)
          setDetailedVideo(null)
          setHasVideos(false)
          setVideosLoading(false)
        })
    }
  }, [show, currentConcept, childAge, level])

  // Auto-skip to animation if no videos available
  useEffect(() => {
    console.log('[ConceptIntro] Auto-skip check:', { currentStep, videosLoading, hasVideos })
    if (currentStep === 'videos' && !videosLoading && !hasVideos) {
      console.log('[ConceptIntro] AUTO-SKIPPING to animation (no videos)')
      setCurrentStep('animation')
    }
  }, [currentStep, videosLoading, hasVideos])

  // Start animation after entering animation step
  useEffect(() => {
    if (currentStep !== 'animation') return

    setIsReady(false)
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 2000) // 2 seconds "Get Ready" phase

    return () => clearTimeout(readyTimer)
  }, [currentStep, animationKey])

  // Handle close button
  const handleClose = useCallback(() => {
    if (!canClose) return
    onComplete()
  }, [canClose, onComplete])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canClose) {
        handleClose()
      }
    }

    if (show) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [show, canClose, handleClose])

  // Handle step navigation
  const handleStartClick = useCallback(() => {
    console.log('[ConceptIntro] Start button clicked:', { hasVideos, videosLoading, shortVideo: !!shortVideo, detailedVideo: !!detailedVideo })
    if (hasVideos) {
      console.log('[ConceptIntro] Going to videos step')
      setCurrentStep('videos')
    } else {
      console.log('[ConceptIntro] Skipping to animation step (no videos)')
      setCurrentStep('animation')
    }
  }, [hasVideos, videosLoading, shortVideo, detailedVideo])

  const handleNextToAnimation = useCallback(() => {
    setCurrentStep('animation')
  }, [])

  const handleReplay = useCallback(() => {
    setIsReady(false)
    setAnimationKey((prev) => prev + 1)
  }, [])

  const handleComplete = useCallback(() => {
    if (currentIndex < totalConcepts - 1) {
      // Move to next concept
      setCurrentIndex((prev) => prev + 1)
      setCurrentStep('intro')
      setVideosWatched({ video1: false, video2: false })
      setShortVideo(null)
      setDetailedVideo(null)
      setHasVideos(false)
      setVideosLoading(true)
      setAnimationKey(0)
      setIsReady(false)
    } else {
      // All concepts viewed
      onComplete()
    }
  }, [currentIndex, totalConcepts, onComplete])

  // Render the appropriate animation based on type
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

      case 'array-groups':
        return (
          <ArrayGroupsAnimation
            key={`array-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'fair-sharing':
        return (
          <FairSharingAnimation
            key={`sharing-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'long-division-steps':
        return (
          <LongDivisionStepsAnimation
            key={`longdiv-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'fraction-bar':
        return (
          <FractionBarAnimation
            key={`fracbar-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

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

      case 'fraction-operation':
        return (
          <FractionOperationAnimation
            key={`fracop-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'algebra-tiles':
        return (
          <AlgebraTilesAnimation
            key={`tiles-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'balance-scale':
        return (
          <BalanceScaleAnimation
            key={`balance-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

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

      // Level I+ placeholders — algebraic concepts
      case 'foil-visual':
      case 'factoring-visual':
      case 'parabola-graph':
      case 'quadratic-formula':
      case 'advanced-factoring':
      case 'discriminant':
        return (
          <AlgebraTilesAnimation
            key={`alg-placeholder-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level J+ — complex plane and polynomial division
      case 'complex-plane':
        return (
          <CoordinatePlotAnimation
            key={`complex-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'polynomial-division':
        return (
          <LongDivisionStepsAnimation
            key={`polydiv-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'proof-steps':
        return (
          <BalanceScaleAnimation
            key={`proof-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level K+ — function and graph types
      case 'function-graph':
      case 'function-transform':
      case 'exponential-graph':
      case 'exponential-log':
      case 'rational-function':
      case 'irrational-function':
        return (
          <CoordinatePlotAnimation
            key={`func-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level L+ — calculus types
      case 'limit-approach':
      case 'tangent-line':
      case 'area-under-curve':
      case 'optimization':
        return (
          <CoordinatePlotAnimation
            key={`calc-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level M+ — trigonometry types
      case 'unit-circle':
      case 'trig-graph':
      case 'triangle-trig':
        return (
          <CoordinatePlotAnimation
            key={`trig-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level N+ — sequences and advanced differentiation
      case 'sequence-series':
      case 'recurrence-induction':
        return (
          <SequenceAnimation
            key={`seq-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      case 'advanced-differentiation':
        return (
          <CoordinatePlotAnimation
            key={`adv-diff-${key}`}
            problemData={problemData}
            showSolution={isReady}
            className="mx-auto"
          />
        )

      // Level O — advanced calculus types
      case 'curve-analysis':
      case 'integration-methods':
      case 'volume-revolution':
        return (
          <CoordinatePlotAnimation
            key={`adv-calc-${key}`}
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
                className="absolute text-2xl"
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

          {/* Modal Content - Responsive with constrained height */}
          <motion.div
            className={cn(
              'relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden',
              'w-full max-w-lg mx-4',
              'max-h-[85vh] flex flex-col'
            )}
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 bg-gradient-to-r from-primary to-accent px-4 py-3 relative">
              <div className="flex items-center justify-between pr-10">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-2xl">🎓</span>
                  <span className="text-lg font-bold text-white">New Concept!</span>
                </motion.div>

                {/* Step indicator */}
                <div className="flex gap-1.5">
                  {['intro', 'videos', 'animation'].map((step, i) => (
                    <div
                      key={step}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        currentStep === step ? 'bg-white' :
                        (['intro', 'videos', 'animation'].indexOf(currentStep) > i) ? 'bg-white/80' : 'bg-white/30'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Close button - Always visible */}
              <button
                onClick={handleClose}
                disabled={!canClose}
                className={cn(
                  'absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full transition-all z-10',
                  canClose
                    ? 'bg-white/20 hover:bg-white/30 cursor-pointer'
                    : 'bg-white/10 cursor-not-allowed opacity-50'
                )}
                aria-label={canClose ? 'Close' : 'Close (available in a moment)'}
              >
                <span className="text-white text-2xl leading-none">&times;</span>
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {/* ============ INTRO STEP ============ */}
                {currentStep === 'intro' && (
                  <motion.div
                    key="intro-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      📚
                    </motion.div>

                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {config?.title || currentConcept?.replace(/_/g, ' ')}
                    </h2>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      You will be learning about{' '}
                      <strong className="text-primary">{config?.title || currentConcept?.replace(/_/g, ' ')}</strong>.
                      <br />
                      Please review the videos and the animation.
                    </p>

                    {config?.description && (
                      <p className="text-sm text-gray-500 mb-6 italic">
                        {config.description}
                      </p>
                    )}

                    <motion.button
                      whileHover={!videosLoading ? { scale: 1.02 } : {}}
                      whileTap={!videosLoading ? { scale: 0.98 } : {}}
                      onClick={handleStartClick}
                      disabled={videosLoading}
                      className={cn(
                        'px-8 py-3 font-semibold rounded-full shadow-lg transition-colors',
                        videosLoading
                          ? 'bg-gray-300 text-gray-500 cursor-wait'
                          : 'bg-primary text-white hover:bg-primary/90'
                      )}
                    >
                      {videosLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Loading videos...
                        </span>
                      ) : (
                        "Let's Start! →"
                      )}
                    </motion.button>

                    {/* Multi-concept indicator */}
                    {totalConcepts > 1 && (
                      <p className="text-xs text-gray-400 mt-4">
                        Concept {currentIndex + 1} of {totalConcepts}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* ============ VIDEOS STEP ============ */}
                {currentStep === 'videos' && (
                  <motion.div
                    key="videos-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-center mb-1">
                      Step 1: Watch the Videos
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {watchedCount}/{videoCount} videos completed
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${videoCount > 0 ? (watchedCount / videoCount) * 100 : 0}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {videosLoading ? (
                      <div className="text-center py-8">
                        <div className="text-4xl animate-pulse mb-2">📹</div>
                        <p className="text-gray-500">Loading videos...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Video 1 - Short/Quick intro video */}
                        {shortVideo && (
                          <VideoCard
                            video={shortVideo}
                            label="Video 1: Quick Introduction"
                            isWatched={videosWatched.video1}
                            onWatchComplete={() => setVideosWatched(prev => ({ ...prev, video1: true }))}
                            childId={childId}
                            conceptId={currentConcept}
                          />
                        )}

                        {/* Video 2 - Detailed explanation video */}
                        {detailedVideo && (
                          <VideoCard
                            video={detailedVideo}
                            label="Video 2: Detailed Explanation"
                            isWatched={videosWatched.video2}
                            onWatchComplete={() => setVideosWatched(prev => ({ ...prev, video2: true }))}
                            childId={childId}
                            conceptId={currentConcept}
                          />
                        )}

                        {/* Only one video available */}
                        {!shortVideo && !detailedVideo && (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No videos available for this concept.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Next button */}
                    <div className="mt-6 flex justify-center">
                      <motion.button
                        whileHover={allVideosWatched ? { scale: 1.02 } : {}}
                        whileTap={allVideosWatched ? { scale: 0.98 } : {}}
                        onClick={handleNextToAnimation}
                        disabled={!allVideosWatched}
                        className={cn(
                          'px-8 py-3 rounded-full font-semibold transition-all',
                          allVideosWatched
                            ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        )}
                      >
                        {allVideosWatched ? 'Next: Watch Animation →' : `Watch ${videoCount - watchedCount} more video${videoCount - watchedCount > 1 ? 's' : ''}`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ============ ANIMATION STEP ============ */}
                {currentStep === 'animation' && (
                  <motion.div
                    key="animation-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-center mb-1">
                      Step 2: Watch the Animation
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {config?.title || currentConcept?.replace(/_/g, ' ')}
                    </p>

                    {/* Animation Container - constrained height */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 relative" style={{ minHeight: '200px', maxHeight: '45vh', overflow: 'auto' }}>
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
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="text-5xl mb-4"
                            >
                              👀
                            </motion.div>
                            <motion.p
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-2xl font-bold text-primary"
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
                      {config && (
                        <AnimationPlayer showControls={true} autoPlay={isReady}>
                          {renderAnimation(config, animationKey)}
                        </AnimationPlayer>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={handleReplay}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <span>🔄</span>
                        Watch Again
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-colors"
                      >
                        <span>✨</span>
                        {currentIndex < totalConcepts - 1 ? 'Next Concept' : "Let's Practice!"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
