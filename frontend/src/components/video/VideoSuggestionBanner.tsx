/**
 * Video Suggestion Banner
 * Phase 1.18: YouTube Video Integration
 *
 * Non-intrusive banner that appears after consecutive incorrect answers.
 * Offers video help without blocking progress.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Video, VideoSuggestion } from '@/types'
import { getYouTubeThumbnailUrl, formatVideoDuration } from '@/services/videoService'

interface VideoSuggestionBannerProps {
  show: boolean
  suggestion: VideoSuggestion | null
  onWatch: (video: Video) => void
  onDismiss: () => void
  className?: string
}

export default function VideoSuggestionBanner({
  show,
  suggestion,
  onWatch,
  onDismiss,
  className,
}: VideoSuggestionBannerProps) {
  if (!show || !suggestion) return null

  const { video, message, urgency } = suggestion

  const urgencyStyles = {
    gentle: 'bg-blue-50 border-blue-200',
    suggested: 'bg-amber-50 border-amber-200',
    recommended: 'bg-green-50 border-green-200',
  }

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeId, 'default')

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'w-full rounded-xl border-2 p-3 shadow-md',
            urgencyStyles[urgency],
            className
          )}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <div className="flex items-start gap-3">
            {/* Video Thumbnail */}
            <div className="relative flex-shrink-0 w-20 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src={thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Duration Badge */}
              <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-black/80 text-white text-[10px] font-medium rounded">
                {formatVideoDuration(video.durationSeconds)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Message */}
              <p className="text-sm text-gray-700 mb-1.5">
                {message}
              </p>

              {/* Video Title */}
              <p className="text-xs font-medium text-gray-800 truncate mb-2">
                {video.title}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => onWatch(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>▶</span>
                  Watch
                </motion.button>

                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              aria-label="Dismiss suggestion"
            >
              <span className="text-gray-400 text-lg leading-none">&times;</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
