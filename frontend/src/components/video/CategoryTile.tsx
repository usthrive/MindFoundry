/**
 * CategoryTile Component
 * Displays a math topic category with icon, progress, and lock state
 */

import { motion } from 'framer-motion'
import type { KumonLevel } from '@/types'
import { getFriendlyLevelName } from '@/utils/videoUnlockSystem'

interface CategoryTileProps {
  id: string
  icon: string
  label: string
  color: string
  isUnlocked: boolean
  unlockLevel: KumonLevel | null
  isAlmostUnlocked: boolean
  watchedCount: number
  totalCount: number
  onClick: () => void
}

export default function CategoryTile({
  icon,
  label,
  color,
  isUnlocked,
  unlockLevel,
  isAlmostUnlocked,
  watchedCount,
  totalCount,
  onClick,
}: CategoryTileProps) {
  // All videos watched state
  const allWatched = isUnlocked && totalCount > 0 && watchedCount >= totalCount

  // Background color based on state
  const getBackgroundStyle = () => {
    if (!isUnlocked) {
      // Locked state - gray background
      return {
        backgroundColor: isAlmostUnlocked ? '#E5E7EB' : '#F3F4F6',
        boxShadow: isAlmostUnlocked ? `0 0 20px ${color}40` : 'none',
      }
    }
    if (allWatched) {
      // All watched - gold/yellow background
      return {
        backgroundColor: '#FEF3C7',
        boxShadow: '0 0 20px #F59E0B40',
      }
    }
    // Normal unlocked state
    return {
      backgroundColor: `${color}15`,
    }
  }

  // Progress display text
  const getProgressText = () => {
    if (!isUnlocked) {
      return 'Locked'
    }
    if (totalCount === 0) {
      return 'Coming soon'
    }
    if (watchedCount > 0) {
      return `✓ ${watchedCount}/${totalCount}`
    }
    return `0/${totalCount}`
  }

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all w-full aspect-square min-h-[100px]"
      style={getBackgroundStyle()}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Lock icon for locked state */}
      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-lg">🔒</span>
        </div>
      )}

      {/* Star for all watched */}
      {allWatched && (
        <div className="absolute top-2 right-2">
          <span className="text-lg">⭐</span>
        </div>
      )}

      {/* Almost there glow indicator */}
      {isAlmostUnlocked && (
        <div className="absolute top-2 left-2">
          <span className="text-sm animate-pulse">✨</span>
        </div>
      )}

      {/* Category Icon */}
      <span
        className={`text-3xl mb-2 ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}
      >
        {icon}
      </span>

      {/* Category Label */}
      <span
        className={`text-sm font-semibold text-center leading-tight ${
          !isUnlocked ? 'text-gray-400' : 'text-gray-800'
        }`}
      >
        {label}
      </span>

      {/* Progress or Lock Status */}
      <span
        className={`text-xs mt-1 ${
          !isUnlocked
            ? 'text-gray-400'
            : watchedCount > 0
            ? 'text-green-600 font-medium'
            : 'text-gray-500'
        }`}
      >
        {getProgressText()}
      </span>

      {/* Unlock level hint for locked categories */}
      {!isUnlocked && unlockLevel && (
        <span className="text-[10px] text-gray-400 mt-1">
          {isAlmostUnlocked ? 'Almost there!' : `Unlock at ${getFriendlyLevelName(unlockLevel)}`}
        </span>
      )}

      {/* Celebration badge for all watched */}
      {allWatched && (
        <span className="absolute bottom-2 right-2 text-xs">🎉</span>
      )}
    </motion.button>
  )
}
