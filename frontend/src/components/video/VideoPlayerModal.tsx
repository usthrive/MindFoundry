/**
 * Video Player Modal
 * Phase 1.18: YouTube Video Integration
 *
 * Full-screen modal for playing educational YouTube videos.
 * Uses privacy-enhanced mode (youtube-nocookie.com) for embedding.
 * Tracks watch progress and handles user feedback.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Video, VideoTriggerType } from '@/types'
import {
  getYouTubeEmbedUrl,
  recordVideoViewStart,
  updateVideoViewProgress,
  completeVideoView,
} from '@/services/videoService'

interface VideoPlayerModalProps {
  show: boolean
  video: Video | null
  conceptId: string
  conceptName?: string
  triggerType: VideoTriggerType
  childId: string
  sessionId?: string
  accuracyBeforeVideo?: number
  onClose: () => void
  onComplete?: (viewId: string) => void
}

export default function VideoPlayerModal({
  show,
  video,
  conceptId,
  conceptName,
  triggerType,
  childId,
  sessionId,
  accuracyBeforeVideo,
  onClose,
  onComplete,
}: VideoPlayerModalProps) {
  // View tracking state
  const [viewId, setViewId] = useState<string | null>(null)
  const [watchProgress, setWatchProgress] = useState(0)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs for tracking
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Completion threshold (90%)
  const COMPLETION_THRESHOLD = 90

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start tracking when modal opens
  useEffect(() => {
    if (show && video && childId) {
      startTimeRef.current = Date.now()
      setWatchProgress(0)
      setError(null)
      setShowConfirmClose(false)

      // Record view start in database
      recordVideoViewStart(
        childId,
        video.id,
        conceptId,
        triggerType,
        sessionId || undefined,
        accuracyBeforeVideo || undefined
      )
        .then((id) => {
          if (id) {
            setViewId(id)
          }
        })
        .catch((err) => {
          console.error('Failed to record video view start:', err)
        })

      // Start progress tracking interval (every 5 seconds)
      progressIntervalRef.current = setInterval(() => {
        if (startTimeRef.current && video.durationSeconds > 0) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          const progress = Math.min(100, (elapsed / video.durationSeconds) * 100)
          setWatchProgress(progress)

          // Update database with progress
          if (viewId) {
            updateVideoViewProgress(viewId, Math.round(elapsed), Math.round(progress))
          }
        }
      }, 5000)

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    }
  }, [show, video, childId, conceptId, triggerType, sessionId, accuracyBeforeVideo])

  // Update view ID when it changes
  useEffect(() => {
    if (viewId && progressIntervalRef.current) {
      // The interval will now use the updated viewId
    }
  }, [viewId])

  // Handle close with confirmation
  const handleCloseAttempt = useCallback(() => {
    if (watchProgress < 50) {
      setShowConfirmClose(true)
    } else {
      handleClose()
    }
  }, [watchProgress])

  // Handle actual close
  const handleClose = useCallback(async () => {
    // Stop progress tracking
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Complete the view record
    if (viewId) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const isCompleted = watchProgress >= COMPLETION_THRESHOLD

      await completeVideoView(viewId, Math.round(elapsed), Math.round(watchProgress))
        .catch((err) => console.error('Failed to complete video view:', err))

      if (isCompleted && onComplete) {
        onComplete(viewId)
      }
    }

    setViewId(null)
    setShowConfirmClose(false)
    onClose()
  }, [viewId, watchProgress, onComplete, onClose])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        handleCloseAttempt()
      }
    }

    if (show) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [show, handleCloseAttempt])

  // Handle feedback submission
  const handleFeedback = async (feedback: 'helpful' | 'not_helpful' | 'skipped') => {
    if (viewId) {
      try {
        const { supabase } = await import('@/lib/supabase')
        await supabase
          .from('video_views')
          .update({ user_feedback: feedback })
          .eq('id', viewId)
      } catch (err) {
        console.error('Failed to submit feedback:', err)
      }
    }
  }

  if (!show || !video) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAttempt}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📺</span>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                    {video.title}
                  </span>
                  {conceptName && (
                    <span className="text-white/70 text-xs">
                      {conceptName}
                    </span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseAttempt}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close video"
              >
                <span className="text-white text-xl leading-none">&times;</span>
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black aspect-video w-full">
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white">
                    <span className="text-4xl mb-4 block">😢</span>
                    <p className="text-lg mb-2">Unable to load video</p>
                    <p className="text-sm text-gray-400">{error}</p>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={getYouTubeEmbedUrl(video.youtubeId)}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  onError={() => setError('Failed to load video')}
                />
              )}
            </div>

            {/* Video Info */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">
                    {video.channelName}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 text-sm">
                    {formatDuration(video.durationSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {watchProgress >= COMPLETION_THRESHOLD ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <span>✓</span> Completed
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {Math.round(watchProgress)}% watched
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Buttons */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-gray-500">Was this helpful?</span>
                <button
                  onClick={() => handleFeedback('helpful')}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleFeedback('not_helpful')}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  👎 No
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-4 bg-white border-t">
              <button
                onClick={handleCloseAttempt}
                className={cn(
                  'w-full py-3 rounded-full font-semibold text-lg transition-all',
                  watchProgress >= COMPLETION_THRESHOLD
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                {watchProgress >= COMPLETION_THRESHOLD
                  ? "Done! Let's Practice"
                  : 'Close Video'}
              </button>
            </div>
          </motion.div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmClose && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowConfirmClose(false)}
                />
                <motion.div
                  className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <div className="text-center">
                    <span className="text-4xl mb-4 block">🎬</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Still watching?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You've only watched {Math.round(watchProgress)}% of this video.
                      Would you like to keep watching?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowConfirmClose(false)}
                        className="flex-1 py-2.5 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Keep Watching
                      </button>
                      <button
                        onClick={() => {
                          handleFeedback('skipped')
                          handleClose()
                        }}
                        className="flex-1 py-2.5 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        Close Video
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
