/**
 * VideoCategoryPage
 * Shows all videos within a specific category, split by tier (short/detailed)
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import type { KumonLevel } from '@/types'
import { getCategoryById, type VideoCategory } from '@/config/videoCategories'
import VideoCard from '@/components/video/VideoCard'
import LockedVideoModal from '@/components/video/LockedVideoModal'
import {
  getVideosForCategory,
  type VideoWithUnlockStatus,
} from '@/services/videoLibraryService'

export default function VideoCategoryPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()
  const { currentChild } = useAuth()

  // State
  const [category, setCategory] = useState<VideoCategory | null>(null)
  const [shortVideos, setShortVideos] = useState<VideoWithUnlockStatus[]>([])
  const [detailedVideos, setDetailedVideos] = useState<VideoWithUnlockStatus[]>([])
  const [totalWatched, setTotalWatched] = useState(0)
  const [totalUnlocked, setTotalUnlocked] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Locked modal state
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [lockedUnlockLevel, setLockedUnlockLevel] = useState<KumonLevel | null>(null)
  const [lockedVideoTitle, setLockedVideoTitle] = useState<string | undefined>()
  const [lockedIsAlmost, setLockedIsAlmost] = useState(false)

  // Load category data
  useEffect(() => {
    if (!categoryId) return

    const cat = getCategoryById(categoryId)
    if (!cat) {
      setError('Category not found')
      setLoading(false)
      return
    }
    setCategory(cat)
  }, [categoryId])

  // Load videos
  useEffect(() => {
    async function loadVideos() {
      if (!currentChild || !categoryId) return

      setLoading(true)
      setError(null)

      try {
        const childLevel = currentChild.current_level as KumonLevel
        const result = await getVideosForCategory(categoryId, currentChild.id, childLevel)

        setShortVideos(result.shortVideos)
        setDetailedVideos(result.detailedVideos)
        setTotalWatched(result.totalWatched)
        setTotalUnlocked(result.totalUnlocked)
      } catch (err) {
        console.error('Error loading category videos:', err)
        setError('Failed to load videos. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [currentChild, categoryId])

  // Handle video click
  const handleVideoClick = (video: VideoWithUnlockStatus) => {
    navigate(`/videos/watch/${video.id}?category=${categoryId}`)
  }

  // Handle locked video click
  const handleLockedClick = (video: VideoWithUnlockStatus) => {
    setLockedUnlockLevel(video.unlockLevel)
    setLockedVideoTitle(video.title)
    setLockedIsAlmost(video.isAlmostUnlocked)
    setShowLockedModal(true)
  }

  // Calculate progress percentage
  const progressPercent = totalUnlocked > 0 ? Math.round((totalWatched / totalUnlocked) * 100) : 0

  // All videos watched
  const allWatched = totalUnlocked > 0 && totalWatched >= totalUnlocked

  // No child selected
  if (!currentChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-4xl mb-4 block">👋</span>
          <p className="text-gray-600">Please select a child first</p>
          <button
            onClick={() => navigate('/select-child')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
          >
            Select Child
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate('/videos')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="text-xl mr-1">←</span>
            <span className="text-sm">Back</span>
          </button>

          {/* Category Title */}
          <h1 className="text-lg font-bold text-gray-800">
            {category?.label || 'Videos'}
          </h1>

          {/* Category Icon */}
          <span className="text-2xl">{category?.icon || '📺'}</span>
        </div>
      </div>

      {/* Progress Bar Section */}
      {!loading && !error && totalUnlocked > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          {allWatched ? (
            <div className="text-center">
              <span className="text-lg">🎉</span>
              <span className="text-green-600 font-medium ml-2">
                Amazing! You watched all videos!
              </span>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">
                {totalWatched} of {totalUnlocked} videos watched
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 max-w-5xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {/* Skeleton Section */}
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">😢</span>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/videos')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Go Back to Library
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && shortVideos.length === 0 && detailedVideos.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📺</span>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No videos here yet!
            </h2>
            <p className="text-gray-600 mb-6">
              We're adding new videos all the time. Check back soon!
            </p>
            <button
              onClick={() => navigate('/videos')}
              className="px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Go Back to Library
            </button>
          </div>
        )}

        {/* Quick Videos Section */}
        {!loading && !error && shortVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Quick Videos <span className="text-gray-400 font-normal">(under 3 min)</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {shortVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard
                    id={video.id}
                    youtubeId={video.youtubeId}
                    title={video.title}
                    channelName={video.channelName}
                    durationSeconds={video.durationSeconds}
                    thumbnailUrl={video.thumbnailUrl}
                    isUnlocked={video.isUnlocked}
                    unlockLevel={video.unlockLevel}
                    isAlmostUnlocked={video.isAlmostUnlocked}
                    isWatched={video.isWatched}
                    targetLevel={video.kumonLevel as KumonLevel}
                    childLevel={currentChild?.current_level as KumonLevel}
                    showLevelBadge={true}
                    language={video.language}
                    onClick={() => handleVideoClick(video)}
                    onLockedClick={() => handleLockedClick(video)}
                    size="normal"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Videos Section */}
        {!loading && !error && detailedVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Learn More <span className="text-gray-400 font-normal">(detailed lessons)</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {detailedVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <VideoCard
                    id={video.id}
                    youtubeId={video.youtubeId}
                    title={video.title}
                    channelName={video.channelName}
                    durationSeconds={video.durationSeconds}
                    thumbnailUrl={video.thumbnailUrl}
                    isUnlocked={video.isUnlocked}
                    unlockLevel={video.unlockLevel}
                    isAlmostUnlocked={video.isAlmostUnlocked}
                    isWatched={video.isWatched}
                    targetLevel={video.kumonLevel as KumonLevel}
                    childLevel={currentChild?.current_level as KumonLevel}
                    showLevelBadge={true}
                    language={video.language}
                    onClick={() => handleVideoClick(video)}
                    onLockedClick={() => handleLockedClick(video)}
                    size="normal"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Watched Encouragement */}
        {!loading && !error && allWatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-yellow-50 rounded-2xl text-center"
          >
            <p className="text-yellow-800">
              Tap any video to watch it again!
            </p>
          </motion.div>
        )}
      </div>

      {/* Locked Video Modal */}
      <LockedVideoModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        unlockLevel={lockedUnlockLevel}
        videoTitle={lockedVideoTitle}
        isAlmostUnlocked={lockedIsAlmost}
      />
    </div>
  )
}
