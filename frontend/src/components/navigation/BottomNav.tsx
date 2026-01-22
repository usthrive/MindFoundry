import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { FeedbackModal } from '@/components/feedback'
import { VideoPlayerModal } from '@/components/video'
import type { Video } from '@/types'
import { getHelpMenuVideos } from '@/services/videoSelectionService'
import { getVideoPreferences } from '@/services/videoService'

interface NavItem {
  icon: string
  label: string
  path: string
  requiresAuth: boolean
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, currentChild } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false)
  const [videosEnabled, setVideosEnabled] = useState(true)

  // Video player state
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [availableVideos, setAvailableVideos] = useState<{
    shortVideo: Video | null
    detailedVideo: Video | null
  }>({ shortVideo: null, detailedVideo: null })

  const navItems: NavItem[] = [
    { icon: '🏠', label: 'Home', path: '/select-child', requiresAuth: true },
    { icon: '📺', label: 'Videos', path: '/videos', requiresAuth: true },
    { icon: '📊', label: 'Progress', path: '/progress', requiresAuth: true }
  ]

  // Get current concept ID based on the page context
  // This is a simplified version - in a real implementation, you'd pass this from the parent
  const getCurrentConceptId = () => {
    // For now, use a general concept based on the child's current level
    if (currentChild?.current_level) {
      const level = currentChild.current_level
      if (['7A', '6A', '5A'].includes(level)) return 'counting_to_10'
      if (['4A', '3A'].includes(level)) return 'addition_plus_1'
      if (['2A', 'A'].includes(level)) return 'addition'
      if (level === 'B') return 'subtraction'
      if (level === 'C') return 'multiplication'
      if (['D', 'E'].includes(level)) return 'division'
    }
    return 'addition' // default fallback
  }

  // Load video preferences and available videos
  useEffect(() => {
    if (currentChild?.id && isHelpMenuOpen) {
      // Check if videos are enabled
      getVideoPreferences(currentChild.id).then((prefs) => {
        setVideosEnabled(prefs?.videosEnabled ?? true)
      })

      // Load available videos for current concept
      const conceptId = getCurrentConceptId()
      getHelpMenuVideos(conceptId, currentChild.age).then(setAvailableVideos)
    }
  }, [currentChild, isHelpMenuOpen])

  // Don't show nav on login/onboarding pages
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return null
  }

  // Don't show if not authenticated
  if (!user) {
    return null
  }

  // Get current worksheet progress for the mini progress bar
  const getProgressText = () => {
    if (location.pathname === '/study' && currentChild) {
      return `Level ${currentChild.current_level} • Worksheet ${currentChild.current_worksheet}/200`
    }
    return null
  }

  const progressText = getProgressText()

  const handleHelpClick = () => {
    setIsHelpMenuOpen(!isHelpMenuOpen)
  }

  const handleWatchVideo = (video: Video) => {
    setSelectedVideo(video)
    setShowVideoPlayer(true)
    setIsHelpMenuOpen(false)
  }

  const handleFeedback = () => {
    setIsFeedbackOpen(true)
    setIsHelpMenuOpen(false)
  }

  const hasAnyVideo = availableVideos.shortVideo || availableVideos.detailedVideo

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        {/* Mini progress indicator */}
        {progressText && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-1">
            <p className="text-xs text-center text-gray-600">{progressText}</p>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={!user && item.requiresAuth}
              >
                <span className={`text-2xl mb-1 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Help Button with Menu */}
          <div className="relative">
            <button
              onClick={handleHelpClick}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                isHelpMenuOpen ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl mb-1">💬</span>
              <span className="text-xs font-medium">Help</span>
            </button>

            {/* Help Menu Popup */}
            <AnimatePresence>
              {isHelpMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsHelpMenuOpen(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-40"
                  >
                    {/* Video Options (if enabled and available) */}
                    {videosEnabled && hasAnyVideo && (
                      <>
                        {availableVideos.shortVideo && (
                          <button
                            onClick={() => handleWatchVideo(availableVideos.shortVideo!)}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <span className="text-xl">📺</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Quick Video</p>
                              <p className="text-xs text-gray-500">
                                {Math.floor(availableVideos.shortVideo.durationSeconds / 60)}:{String(availableVideos.shortVideo.durationSeconds % 60).padStart(2, '0')} min
                              </p>
                            </div>
                          </button>
                        )}

                        {availableVideos.detailedVideo && (
                          <button
                            onClick={() => handleWatchVideo(availableVideos.detailedVideo!)}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                          >
                            <span className="text-xl">🎬</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Detailed Lesson</p>
                              <p className="text-xs text-gray-500">
                                {Math.floor(availableVideos.detailedVideo.durationSeconds / 60)}:{String(availableVideos.detailedVideo.durationSeconds % 60).padStart(2, '0')} min
                              </p>
                            </div>
                          </button>
                        )}

                        <div className="border-t border-gray-200" />
                      </>
                    )}

                    {/* Feedback Option */}
                    <button
                      onClick={handleFeedback}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">💭</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Give Feedback</p>
                        <p className="text-xs text-gray-500">Report an issue</p>
                      </div>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        childId={currentChild?.id}
      />

      {/* Video Player Modal */}
      {selectedVideo && currentChild && (
        <VideoPlayerModal
          show={showVideoPlayer}
          video={selectedVideo}
          conceptId={getCurrentConceptId()}
          triggerType="explicit_request"
          childId={currentChild.id}
          onClose={() => {
            setShowVideoPlayer(false)
            setSelectedVideo(null)
          }}
        />
      )}
    </>
  )
}
