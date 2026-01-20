/**
 * AnimationPlayer - Wrapper component for educational animations
 * Phase 1.12: Educational Animation System
 *
 * Provides:
 * - Play/pause controls (true pause, not restart)
 * - Progress indicator
 * - Accessibility support (reduced motion)
 * - Auto-play and loop options
 * - Context for child animations to access pause state
 */

import { useState, useEffect, useCallback, useRef, createContext, useContext, cloneElement, isValidElement, Children, ReactElement } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { AnimationPlayerProps, AnimationState } from './types'

// Context to share pause state with child animations
interface AnimationContextValue {
  isPaused: boolean
  isPlaying: boolean
}

const AnimationContext = createContext<AnimationContextValue>({
  isPaused: false,
  isPlaying: true,
})

/**
 * Hook for child animations to access pause state from AnimationPlayer
 */
export function useAnimationPause() {
  return useContext(AnimationContext)
}

export default function AnimationPlayer({
  children,
  showControls = true,
  showProgress = false,
  autoPlay = true,
  loop = false,
  onComplete,
  className,
}: AnimationPlayerProps) {
  const [state, setState] = useState<AnimationState>(autoPlay ? 'playing' : 'idle')
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handlePlay = useCallback(() => {
    setState('playing')
  }, [])

  const handlePause = useCallback(() => {
    setState('paused')
  }, [])

  const handleReset = useCallback(() => {
    setProgress(0)
    setState(autoPlay ? 'playing' : 'idle')
  }, [autoPlay])

  // Progress simulation (for demo purposes - real animations would track their own progress)
  useEffect(() => {
    if (state === 'playing' && showProgress) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (loop) {
              return 0
            }
            setState('complete')
            onComplete?.()
            return 100
          }
          return prev + 1
        })
      }, 100)
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
    }
  }, [state, showProgress, loop, onComplete])

  // Derive isPaused from state
  const isPaused = state === 'paused'
  const isPlaying = state === 'playing'

  // Clone children to inject isPaused prop
  const childrenWithPause = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<{ isPaused?: boolean }>, {
        isPaused,
      })
    }
    return child
  })

  // Context value for animations that use the hook
  const contextValue: AnimationContextValue = {
    isPaused,
    isPlaying,
  }

  // If user prefers reduced motion, show static version
  if (prefersReducedMotion) {
    return (
      <AnimationContext.Provider value={contextValue}>
        <div className={cn('relative', className)}>
          <div className="text-center text-sm text-gray-500 mb-2">
            Animation paused (reduced motion enabled)
          </div>
          {childrenWithPause}
        </div>
      </AnimationContext.Provider>
    )
  }

  return (
    <AnimationContext.Provider value={contextValue}>
      <div className={cn('relative', className)}>
        {/* Animation Content - no AnimatePresence to prevent remount on pause */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {childrenWithPause}
        </motion.div>

      {/* Controls - responsive with flex-wrap */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3">
          {state === 'playing' ? (
            <button
              onClick={handlePause}
              className={cn(
                'flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full',
                'bg-gray-100 hover:bg-gray-200 transition-colors',
                'text-xs sm:text-sm text-gray-700'
              )}
              aria-label="Pause animation"
            >
              <PauseIcon />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className={cn(
                'flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full',
                'bg-primary/10 hover:bg-primary/20 transition-colors',
                'text-xs sm:text-sm text-primary'
              )}
              aria-label="Play animation"
            >
              <PlayIcon />
              <span>Play</span>
            </button>
          )}

          {state === 'complete' && (
            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full',
                'bg-gray-100 hover:bg-gray-200 transition-colors',
                'text-xs sm:text-sm text-gray-700'
              )}
              aria-label="Replay animation"
            >
              <ReplayIcon />
              <span>Replay</span>
            </button>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}
      </div>
    </AnimationContext.Provider>
  )
}

// Icon components
function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block"
    >
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  )
}

// Export animation state hook for child components
export function useAnimationState() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [step, setStep] = useState(0)

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const reset = useCallback(() => {
    setStep(0)
    setIsPlaying(true)
  }, [])
  const nextStep = useCallback(() => setStep((s) => s + 1), [])

  return {
    isPlaying,
    step,
    play,
    pause,
    reset,
    nextStep,
    setStep,
  }
}
