/**
 * Video Thumbnail Component
 * Phase 1.18: YouTube Video Integration
 *
 * Reusable thumbnail component for displaying video previews.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Video } from '@/types'
import { getYouTubeThumbnailUrl, formatVideoDuration } from '@/services/videoService'

interface VideoThumbnailProps {
  video: Video
  size?: 'sm' | 'md' | 'lg'
  showDuration?: boolean
  showChannel?: boolean
  onClick?: () => void
  className?: string
}

export default function VideoThumbnail({
  video,
  size = 'md',
  showDuration = true,
  showChannel = false,
  onClick,
  className,
}: VideoThumbnailProps) {
  const sizeClasses = {
    sm: 'w-24 h-auto',
    md: 'w-40 h-auto',
    lg: 'w-56 h-auto',
  }

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeId, 'medium')

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative group rounded-lg overflow-hidden bg-gray-100',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
    >
      {/* Thumbnail Image */}
      <div className="relative aspect-video">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Play Button Overlay */}
        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <motion.div
              className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <svg
                className="w-5 h-5 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </motion.div>
          </div>
        )}

        {/* Duration Badge */}
        {showDuration && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
            {formatVideoDuration(video.durationSeconds)}
          </span>
        )}
      </div>

      {/* Video Info */}
      <div className="p-2 text-left">
        <p className={cn(
          'font-medium text-gray-800 line-clamp-2',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {video.title}
        </p>
        {showChannel && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {video.channelName}
          </p>
        )}
      </div>
    </motion.button>
  )
}
