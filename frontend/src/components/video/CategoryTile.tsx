/**
 * CategoryTile Component
 * Displays a math topic category with icon, progress, and lock state
 */

import { motion } from 'framer-motion'
import type { KumonLevel } from '@/types'
import type { CategoryStatus, ChildCategoryStatus } from '@/services/videoLibraryService'
import { getFriendlyLevelName } from '@/utils/videoUnlockSystem'

interface CategoryTileProps {
  id: string
  icon: string
  label: string
  color: string
  levelRange?: string  // Display string for level range (e.g., "7A-5A")
  isUnlocked: boolean
  unlockLevel: KumonLevel | null
  isAlmostUnlocked: boolean
  watchedCount: number
  totalCount: number
  onClick: () => void
  status?: CategoryStatus  // Child's relationship to this category (single child)
  childName?: string  // For parent view personalization (single child)
  isParentView?: boolean  // Show parent-specific text
  childrenStatus?: ChildCategoryStatus[]  // All children's status (parent view with multiple children)
}

export default function CategoryTile({
  icon,
  label,
  color,
  levelRange,
  isUnlocked,
  unlockLevel,
  isAlmostUnlocked,
  watchedCount,
  totalCount,
  onClick,
  status,
  childName,
  isParentView = false,
  childrenStatus,
}: CategoryTileProps) {
  // All videos watched state
  const allWatched = isUnlocked && totalCount > 0 && watchedCount >= totalCount

  // Check if any child has a specific status (for multi-child view)
  const hasChildWithStatus = (targetStatus: CategoryStatus) => {
    if (childrenStatus && childrenStatus.length > 0) {
      return childrenStatus.some(cs => cs.status === targetStatus)
    }
    return status === targetStatus
  }

  // Background color based on state
  const getBackgroundStyle = () => {
    if (!isUnlocked) {
      // Locked state - gray background
      return {
        backgroundColor: isAlmostUnlocked ? '#E5E7EB' : '#F3F4F6',
        boxShadow: isAlmostUnlocked ? `0 0 20px ${color}40` : 'none',
      }
    }
    if (hasChildWithStatus('completed') || allWatched) {
      // Completed - gold/yellow background
      return {
        backgroundColor: '#FEF3C7',
        boxShadow: '0 0 20px #F59E0B40',
      }
    }
    if (hasChildWithStatus('current')) {
      // Current level - add green glow
      return {
        backgroundColor: `${color}15`,
        boxShadow: '0 0 20px #22C55E40',
      }
    }
    // Normal unlocked state (upcoming)
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

      {/* Almost there glow indicator (only show if not current/completed) */}
      {isAlmostUnlocked && status !== 'current' && status !== 'completed' && (
        <div className="absolute top-2 left-2">
          <span className="text-sm animate-pulse">✨</span>
        </div>
      )}

      {/* Status Badges - Show all children's status (parent view) or single child status */}
      {childrenStatus && childrenStatus.length > 0 ? (
        // Multiple children view - show stacked badges for children with current/completed status
        <div className="absolute top-1 left-1 flex flex-col gap-0.5 max-w-[90%]">
          {childrenStatus
            .filter(cs => cs.status === 'current' || cs.status === 'completed')
            .map(cs => (
              <div
                key={cs.childId}
                className={`text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow truncate ${
                  cs.status === 'current' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              >
                {cs.childAvatar} {cs.childName} {cs.status === 'current' ? 'is here' : 'completed'}
              </div>
            ))
          }
        </div>
      ) : (
        // Single child view - show single badge
        <>
          {status === 'current' && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
              {isParentView && childName ? `${childName} is here` : "You're here!"}
            </div>
          )}

          {status === 'completed' && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
              {isParentView && childName ? `${childName} completed` : 'Completed!'}
            </div>
          )}
        </>
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

      {/* Level Range */}
      {levelRange && (
        <span
          className={`text-[10px] ${
            !isUnlocked ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Level{levelRange.includes('-') ? 's' : ''} {levelRange}
        </span>
      )}

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
