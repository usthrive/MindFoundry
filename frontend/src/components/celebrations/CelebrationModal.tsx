/**
 * Celebration Modal
 * Displays achievement celebrations with animations
 * Simplified with direct share button
 */

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCelebration } from '@/contexts/CelebrationContext';
import { CELEBRATION_CONFIGS } from '@/types/achievements';
import CelebrationAnimation from './CelebrationAnimation';
import AchievementBadge from './AchievementBadge';

export default function CelebrationModal() {
  const {
    isActive,
    currentAchievement,
    isSharing,
    dismissCelebration,
    shareAchievement,
  } = useCelebration();

  const [shareError, setShareError] = useState<string | null>(null);

  // Handle escape key to dismiss
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !isSharing) {
      dismissCelebration();
    }
  }, [isSharing, dismissCelebration]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  // Handle share click
  const handleShare = async () => {
    setShareError(null);
    try {
      await shareAchievement();
    } catch (error) {
      setShareError('Unable to share. The image was saved instead.');
      // Clear error after 3 seconds
      setTimeout(() => setShareError(null), 3000);
    }
  };

  if (!currentAchievement) return null;

  const config = CELEBRATION_CONFIGS[currentAchievement.celebrationLevel];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSharing ? dismissCelebration : undefined}
          />

          {/* Confetti Animation Layer */}
          <CelebrationAnimation
            level={currentAchievement.celebrationLevel}
            isActive={isActive && !isSharing}
          />

          {/* Modal Content */}
          <motion.div
            className={`
              relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden
              ${config.modalSize === 'small' ? 'max-w-sm' : ''}
              ${config.modalSize === 'medium' ? 'max-w-md' : ''}
              ${config.modalSize === 'large' ? 'max-w-lg' : ''}
              ${config.modalSize === 'fullscreen' ? 'max-w-2xl w-full mx-4' : ''}
            `}
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(0,178,169,0.2) 0%, transparent 50%, rgba(255,111,97,0.2) 100%)',
                  'linear-gradient(135deg, rgba(255,217,102,0.2) 0%, transparent 50%, rgba(0,178,169,0.2) 100%)',
                  'linear-gradient(135deg, rgba(0,178,169,0.2) 0%, transparent 50%, rgba(255,111,97,0.2) 100%)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative p-6 md:p-8">
              {/* Close Button */}
              <button
                onClick={dismissCelebration}
                disabled={isSharing}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                aria-label="Close celebration"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Achievement Badge */}
              <div className="flex justify-center mb-6">
                <AchievementBadge
                  achievement={currentAchievement}
                  size={config.modalSize === 'small' ? 'md' : 'lg'}
                  animate
                />
              </div>

              {/* Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentAchievement.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-600 text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentAchievement.description}
              </motion.p>

              {/* Quote */}
              {currentAchievement.quote && (
                <motion.p
                  className="text-sm text-primary italic text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  "{currentAchievement.quote}"
                </motion.p>
              )}

              {/* Share Error Message */}
              {shareError && (
                <motion.p
                  className="text-sm text-amber-600 text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {shareError}
                </motion.p>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSharing ? (
                    <>
                      <LoadingSpinner />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <ShareIcon />
                      Share
                    </>
                  )}
                </button>
                <button
                  onClick={dismissCelebration}
                  disabled={isSharing}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Share Icon Component
function ShareIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
