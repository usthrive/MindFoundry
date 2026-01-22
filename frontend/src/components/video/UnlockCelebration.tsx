/**
 * UnlockCelebration Component
 * Celebration modal shown when a child advances levels and unlocks new videos
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Video, KumonLevel } from '@/types'
import { getYouTubeThumbnailUrl, formatVideoDuration } from '@/services/videoService'
import { getFriendlyLevelName } from '@/utils/videoUnlockSystem'

interface UnlockCelebrationProps {
  isOpen: boolean
  onClose: () => void
  newLevel: KumonLevel
  unlockedVideos: Video[]
}

export default function UnlockCelebration({
  isOpen,
  onClose,
  newLevel,
  unlockedVideos,
}: UnlockCelebrationProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleWatchNow = () => {
    onClose()
    navigate('/videos')
  }

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
          className="absolute inset-0 bg-black/70"
          onClick={onClose}
        />

        {/* Confetti Animation Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeIn',
              }}
            >
              {['✨', '🎉', '⭐', '🌟', '🎊'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        >
          {/* Celebration Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-5xl mb-3">
              ✨ 🎉 ✨
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              New Videos Unlocked!
            </h2>
            <p className="text-gray-600">
              You reached <span className="font-semibold text-purple-600">{getFriendlyLevelName(newLevel)}</span>!
              {unlockedVideos.length > 0 && (
                <> {unlockedVideos.length} new video{unlockedVideos.length !== 1 ? 's' : ''} waiting for you!</>
              )}
            </p>
          </motion.div>

          {/* Unlocked Videos Preview */}
          {unlockedVideos.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {unlockedVideos.slice(0, 3).map((video, index) => (
                  <motion.div
                    key={video.id}
                    className="flex-shrink-0 w-32"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.15 }}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 mb-1">
                      <img
                        src={video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeId, 'medium')}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {/* NEW Badge */}
                      <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        ✨ NEW ✨
                      </div>
                      {/* Duration */}
                      <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-1 rounded">
                        {formatVideoDuration(video.durationSeconds)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2 leading-tight">
                      {video.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              {unlockedVideos.length > 3 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  +{unlockedVideos.length - 3} more videos!
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={handleWatchNow}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full transition-colors text-lg flex items-center justify-center gap-2"
            >
              <span>Watch Now!</span>
              <span>📺</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors"
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
