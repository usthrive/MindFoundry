/**
 * Concept Video Section
 * Phase 1.18: YouTube Video Integration
 *
 * Optional video section displayed in ConceptIntroModal after animation completes.
 * Offers students the choice to watch a video explanation before practicing.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Video } from '@/types'
import { getBestVideoForConcept, getYouTubeThumbnailUrl, formatVideoDuration } from '@/services/videoService'

interface ConceptVideoSectionProps {
  conceptId: string
  childAge: number
  onWatch: (video: Video) => void
  onSkip: () => void
  className?: string
}

export default function ConceptVideoSection({
  conceptId,
  childAge,
  onWatch,
  onSkip,
  className,
}: ConceptVideoSectionProps) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch video for this concept
  useEffect(() => {
    async function fetchVideo() {
      setLoading(true)
      try {
        // Prefer short videos for concept intro (they're less disruptive)
        const foundVideo = await getBestVideoForConcept(conceptId, childAge, 'short')
        setVideo(foundVideo)
      } catch (err) {
        console.error('Failed to fetch video for concept:', err)
        setVideo(null)
      } finally {
        setLoading(false)
      }
    }

    if (conceptId) {
      fetchVideo()
    }
  }, [conceptId, childAge])

  // Don't render if loading or no video available
  if (loading) {
    return (
      <div className={cn('py-4', className)}>
        <div className="animate-pulse flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    )
  }

  if (!video) {
    // No video available, just skip
    return null
  }

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeId, 'medium')

  return (
    <motion.div
      className={cn('py-4', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-500 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Video Offer */}
      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-24 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-gray-200">
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
            {/* Duration */}
            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-black/80 text-white text-[10px] font-medium rounded">
              {formatVideoDuration(video.durationSeconds)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Want a video explanation too?
            </p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {video.title}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onWatch(video)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>📺</span>
                Watch
              </motion.button>

              <button
                onClick={onSkip}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
