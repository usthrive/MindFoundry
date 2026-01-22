/**
 * LockedVideoModal Component
 * Friendly modal shown when a child taps a locked video
 * Encourages them to keep practicing to unlock it
 */

import { motion, AnimatePresence } from 'framer-motion'
import type { KumonLevel } from '@/types'
import { getFriendlyLevelName } from '@/utils/videoUnlockSystem'

interface LockedVideoModalProps {
  isOpen: boolean
  onClose: () => void
  unlockLevel: KumonLevel | null
  videoTitle?: string
  isAlmostUnlocked?: boolean
}

export default function LockedVideoModal({
  isOpen,
  onClose,
  unlockLevel,
  videoTitle,
  isAlmostUnlocked = false,
}: LockedVideoModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Lock Icon */}
          <div className="text-6xl mb-4">
            {isAlmostUnlocked ? '✨' : '🔒'}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isAlmostUnlocked ? 'Almost there!' : 'This video is locked!'}
          </h2>

          {/* Video Title (if provided) */}
          {videoTitle && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-1">
              "{videoTitle}"
            </p>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {isAlmostUnlocked ? (
              <>
                You're so close! Keep practicing to reach{' '}
                <span className="font-semibold text-purple-600">
                  {unlockLevel ? getFriendlyLevelName(unlockLevel) : 'the next level'}
                </span>{' '}
                and unlock this video!
              </>
            ) : (
              <>
                Keep practicing to reach{' '}
                <span className="font-semibold text-blue-600">
                  {unlockLevel ? getFriendlyLevelName(unlockLevel) : 'the next level'}
                </span>{' '}
                and unlock it!
              </>
            )}
          </p>

          {/* Encouragement */}
          <div className="mb-6 p-3 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-800">
              {isAlmostUnlocked
                ? 'Just a little more practice and you\'ll get there!'
                : 'Every problem you solve brings you closer!'}
            </p>
          </div>

          {/* Got it Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors text-lg"
          >
            Got it! 👍
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
