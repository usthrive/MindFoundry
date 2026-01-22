/**
 * VideoCard Component
 * Displays a video thumbnail with title, duration, and various states
 * States: unwatched, watched, locked, new (recently unlocked), recommended
 */

import { motion } from 'framer-motion'
import type { KumonLevel } from '@/types'
import { getYouTubeThumbnailUrl, formatVideoDuration } from '@/services/videoService'
import { getFriendlyLevelName } from '@/utils/videoUnlockSystem'

interface VideoCardProps {
  id: string
  youtubeId: string
  title: string
  channelName: string
  durationSeconds: number
  thumbnailUrl: string | null
  isUnlocked: boolean
  unlockLevel: KumonLevel | null
  isAlmostUnlocked: boolean
  isWatched: boolean
  isNew?: boolean // Recently unlocked
  isRecommended?: boolean
  onClick: () => void
  onLockedClick?: () => void
  size?: 'small' | 'normal' | 'large'
}

export default function VideoCard({
  youtubeId,
  title,
  channelName,
  durationSeconds,
  thumbnailUrl,
  isUnlocked,
  unlockLevel,
  isWatched,
  isNew = false,
  isRecommended = false,
  onClick,
  onLockedClick,
  size = 'normal',
}: VideoCardProps) {
  // Get thumbnail URL (prefer stored, fallback to YouTube)
  const thumbnail = thumbnailUrl || getYouTubeThumbnailUrl(youtubeId, 'medium')

  // Size classes
  const sizeClasses = {
    small: 'min-w-[140px] max-w-[160px]',
    normal: 'min-w-[160px] max-w-[280px]',
    large: 'min-w-[200px] max-w-[400px]',
  }

  // Handle click
  const handleClick = () => {
    if (!isUnlocked && onLockedClick) {
      onLockedClick()
    } else if (isUnlocked) {
      onClick()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`${sizeClasses[size]} w-full flex flex-col rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow text-left`}
      whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
      animate={!isUnlocked ? { x: [0, -3, 3, 0] } : {}}
      transition={!isUnlocked ? { duration: 0.3, repeat: 0 } : {}}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video bg-gray-200">
        {/* Thumbnail Image */}
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}
          loading="lazy"
        />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
          {formatVideoDuration(durationSeconds)}
        </div>

        {/* Watched Checkmark */}
        {isUnlocked && isWatched && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm">✓</span>
          </div>
        )}

        {/* Lock Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        )}

        {/* NEW Badge */}
        {isNew && isUnlocked && !isWatched && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            ✨ NEW ✨
          </div>
        )}

        {/* Recommended Star */}
        {isRecommended && isUnlocked && !isNew && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow">
            <span className="text-sm">⭐</span>
          </div>
        )}

        {/* Play Overlay on Hover (only for unlocked) */}
        {isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors opacity-0 hover:opacity-100">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl ml-1">▶</span>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3 flex-1">
        {/* Title */}
        <h3
          className={`text-sm font-medium line-clamp-2 leading-tight ${
            !isUnlocked ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          {title}
        </h3>

        {/* Channel Name or Unlock Hint */}
        {isUnlocked ? (
          <p className="text-xs text-gray-500 mt-1 truncate">{channelName}</p>
        ) : unlockLevel ? (
          <p className="text-xs text-gray-400 mt-1">
            Unlock at {getFriendlyLevelName(unlockLevel)}
          </p>
        ) : null}
      </div>
    </motion.button>
  )
}
