/**
 * VideoWatchPage
 * Full-screen video playback page with progress tracking and related videos
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import type { KumonLevel } from '@/types'
import {
  getYouTubeEmbedUrl,
  recordVideoViewStart,
  updateVideoViewProgress,
  completeVideoView,
  formatVideoDuration,
} from '@/services/videoService'
import {
  getVideoById,
  getRelatedVideos,
  getCategoryForVideo,
  type VideoWithUnlockStatus,
} from '@/services/videoLibraryService'
import VideoCard from '@/components/video/VideoCard'
import LockedVideoModal from '@/components/video/LockedVideoModal'

export default function VideoWatchPage() {
  const navigate = useNavigate()
  const { videoId } = useParams<{ videoId: string }>()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const { currentChild } = useAuth()

  // Video state
  const [video, setVideo] = useState<VideoWithUnlockStatus | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<VideoWithUnlockStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Watch tracking state
  const [viewId, setViewId] = useState<string | null>(null)
  const [watchProgress, setWatchProgress] = useState(0)
  const startTimeRef = useRef<number>(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Locked modal state
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [lockedUnlockLevel, setLockedUnlockLevel] = useState<KumonLevel | null>(null)
  const [lockedIsAlmost, setLockedIsAlmost] = useState(false)

  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false)

  // Completion threshold
  const COMPLETION_THRESHOLD = 90

  // Load video data
  useEffect(() => {
    async function loadVideo() {
      if (!currentChild || !videoId) return

      setLoading(true)
      setError(null)

      try {
        const childLevel = currentChild.current_level as KumonLevel
        const videoData = await getVideoById(videoId, currentChild.id, childLevel)

        if (!videoData) {
          setError('Video not found')
          return
        }

        // Check if video is unlocked
        if (!videoData.isUnlocked) {
          setError('This video is locked')
          return
        }

        setVideo(videoData)

        // Load related videos
        const cat = getCategoryForVideo(videoData)
        if (cat) {
          const related = await getRelatedVideos(
            videoId,
            cat.id,
            currentChild.id,
            childLevel,
            6
          )
          setRelatedVideos(related)
        }
      } catch (err) {
        console.error('Error loading video:', err)
        setError('Failed to load video. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [currentChild, videoId])

  // Start watch tracking when video loads
  useEffect(() => {
    if (!video || !currentChild) return

    startTimeRef.current = Date.now()

    // Record view start
    const cat = getCategoryForVideo(video)
    recordVideoViewStart(
      currentChild.id,
      video.id,
      cat?.id || 'unknown',
      'explicit_request'
    ).then((id) => {
      if (id) setViewId(id)
    }).catch(console.error)

    // Start progress tracking interval
    progressIntervalRef.current = setInterval(() => {
      if (startTimeRef.current && video.durationSeconds > 0) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const progress = Math.min(100, (elapsed / video.durationSeconds) * 100)
        setWatchProgress(progress)

        // Update database
        if (viewId) {
          updateVideoViewProgress(viewId, Math.round(elapsed), Math.round(progress))
            .catch(console.error)
        }
      }
    }, 5000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [video, currentChild])

  // Update progress when viewId changes
  useEffect(() => {
    // The interval will use the updated viewId
  }, [viewId])

  // Handle close
  const handleClose = useCallback(async () => {
    // Stop progress tracking
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Complete the view record
    if (viewId && startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      await completeVideoView(viewId, Math.round(elapsed), Math.round(watchProgress))
        .catch(console.error)
    }

    // Navigate back
    if (categoryId) {
      navigate(`/videos/category/${categoryId}`)
    } else {
      navigate('/videos')
    }
  }, [viewId, watchProgress, categoryId, navigate])

  // Handle feedback
  const handleFeedback = async (feedback: 'helpful' | 'not_helpful') => {
    if (viewId && !feedbackGiven) {
      try {
        const { supabase } = await import('@/lib/supabase')
        await supabase
          .from('video_views')
          .update({ user_feedback: feedback })
          .eq('id', viewId)
        setFeedbackGiven(true)
      } catch (err) {
        console.error('Failed to submit feedback:', err)
      }
    }
  }

  // Handle related video click
  const handleRelatedVideoClick = async (relatedVideo: VideoWithUnlockStatus) => {
    if (!relatedVideo.isUnlocked) {
      setLockedUnlockLevel(relatedVideo.unlockLevel)
      setLockedIsAlmost(relatedVideo.isAlmostUnlocked)
      setShowLockedModal(true)
      return
    }

    // Complete current view
    if (viewId && startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      await completeVideoView(viewId, Math.round(elapsed), Math.round(watchProgress))
        .catch(console.error)
    }

    // Navigate to new video
    navigate(`/videos/watch/${relatedVideo.id}?category=${categoryId || ''}`)
  }

  // No child selected
  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-4xl mb-4 block">👋</span>
          <p className="text-gray-600">Please select a child first</p>
          <button
            onClick={() => navigate('/select-child')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
          >
            Select Child
          </button>
        </div>
      </div>
    )
  }

  // Progress bar color
  const isComplete = watchProgress >= COMPLETION_THRESHOLD

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Minimal, only X button for immersive viewing */}
      <div className="fixed top-0 left-0 z-10 p-4">
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <span className="text-white text-xl">&times;</span>
        </button>
      </div>

      {/* Main Content - reduced padding since no bottom bar */}
      <div className="pt-4 pb-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4" />
              <p>Loading video...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-64 px-4">
            <div className="text-white text-center">
              <span className="text-5xl mb-4 block">😢</span>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => navigate('/videos')}
                className="px-6 py-2 bg-white text-gray-800 rounded-full"
              >
                Back to Library
              </button>
            </div>
          </div>
        )}

        {/* Video Player */}
        {!loading && !error && video && (
          <>
            {/* YouTube Embed */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(video.youtubeId)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-700">
              <motion.div
                className={`h-full ${isComplete ? 'bg-green-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${watchProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Video Info */}
            <div className="bg-gray-800 p-4">
              <h1 className="text-lg font-semibold text-white mb-1">
                {video.title}
              </h1>
              <div className="flex items-center text-gray-400 text-sm">
                <span>{video.channelName}</span>
                <span className="mx-2">•</span>
                <span>{formatVideoDuration(video.durationSeconds)}</span>
              </div>

              {/* Feedback Section */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="text-gray-400 text-sm">Was this helpful?</span>
                <button
                  onClick={() => handleFeedback('helpful')}
                  disabled={feedbackGiven}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    feedbackGiven
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleFeedback('not_helpful')}
                  disabled={feedbackGiven}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    feedbackGiven
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  👎 No
                </button>
              </div>
            </div>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="p-4">
                <h2 className="text-white font-semibold mb-3">More Videos</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  {relatedVideos.map((relatedVideo) => (
                    <div key={relatedVideo.id} className="flex-shrink-0">
                      <VideoCard
                        id={relatedVideo.id}
                        youtubeId={relatedVideo.youtubeId}
                        title={relatedVideo.title}
                        channelName={relatedVideo.channelName}
                        durationSeconds={relatedVideo.durationSeconds}
                        thumbnailUrl={relatedVideo.thumbnailUrl}
                        isUnlocked={relatedVideo.isUnlocked}
                        unlockLevel={relatedVideo.unlockLevel}
                        isAlmostUnlocked={relatedVideo.isAlmostUnlocked}
                        isWatched={relatedVideo.isWatched}
                        language={relatedVideo.language}
                        onClick={() => handleRelatedVideoClick(relatedVideo)}
                        onLockedClick={() => {
                          setLockedUnlockLevel(relatedVideo.unlockLevel)
                          setLockedIsAlmost(relatedVideo.isAlmostUnlocked)
                          setShowLockedModal(true)
                        }}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </div>

      {/* Locked Video Modal */}
      <LockedVideoModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        unlockLevel={lockedUnlockLevel}
        isAlmostUnlocked={lockedIsAlmost}
      />
    </div>
  )
}
