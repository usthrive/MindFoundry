/**
 * VideoLibraryPage
 * Main video library landing page with category tiles and recommended videos
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import type { KumonLevel } from '@/types'
import CategoryTile from '@/components/video/CategoryTile'
import VideoCard from '@/components/video/VideoCard'
import LockedVideoModal from '@/components/video/LockedVideoModal'
import {
  getCategoriesWithStats,
  getRecommendedVideos,
  getCategoryStatusForChildren,
  type CategoryWithStats,
  type VideoWithUnlockStatus,
} from '@/services/videoLibraryService'
import { VIDEO_CATEGORIES } from '@/config/videoCategories'
import { getHighestChildLevel, isCategoryUnlocked } from '@/utils/videoUnlockSystem'

export default function VideoLibraryPage() {
  const navigate = useNavigate()
  const { currentChild, children } = useAuth()

  // State
  const [categories, setCategories] = useState<CategoryWithStats[]>([])
  const [recommended, setRecommended] = useState<VideoWithUnlockStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Locked modal state
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [lockedUnlockLevel, setLockedUnlockLevel] = useState<KumonLevel | null>(null)
  const [lockedIsAlmost, setLockedIsAlmost] = useState(false)

  // Parent view = no child selected AND multiple children exist
  const isParentView = !currentChild && children && children.length > 1

  // Load data
  useEffect(() => {
    async function loadData() {
      if (!currentChild) return

      setLoading(true)
      setError(null)

      try {
        const childLevel = currentChild.current_level as KumonLevel

        // For parent view, use the highest level among all children for unlocking
        const effectiveLevel = isParentView && children
          ? getHighestChildLevel(children.map(c => ({ current_level: c.current_level })))
          : childLevel

        // Fetch categories and recommended videos in parallel
        const [categoriesData, recommendedData] = await Promise.all([
          getCategoriesWithStats(currentChild.id, effectiveLevel),
          getRecommendedVideos(currentChild.id, effectiveLevel, 6),
        ])

        // For parent view, ensure categories are unlocked if ANY child can access them
        let finalCategories = categoriesData
        if (isParentView && children) {
          finalCategories = categoriesData.map(category => {
            // Check if any child has this category unlocked
            const anyChildUnlocked = children.some(child =>
              isCategoryUnlocked(
                VIDEO_CATEGORIES.find(c => c.id === category.id) || category,
                child.current_level as KumonLevel
              )
            )
            return {
              ...category,
              isUnlocked: anyChildUnlocked || category.isUnlocked
            }
          })
        }

        setCategories(finalCategories)
        setRecommended(recommendedData)
      } catch (err) {
        console.error('Error loading video library:', err)
        setError('Failed to load videos. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentChild, children, isParentView])

  // Handle category click
  const handleCategoryClick = (category: CategoryWithStats) => {
    if (!category.isUnlocked) {
      // Show locked modal
      setLockedUnlockLevel(category.unlockLevel)
      setLockedIsAlmost(category.isAlmostUnlocked)
      setShowLockedModal(true)
      return
    }
    // Navigate to category page
    navigate(`/videos/category/${category.id}`)
  }

  // Handle video click
  const handleVideoClick = (video: VideoWithUnlockStatus) => {
    if (!video.isUnlocked) {
      setLockedUnlockLevel(video.unlockLevel)
      setLockedIsAlmost(video.isAlmostUnlocked)
      setShowLockedModal(true)
      return
    }
    navigate(`/videos/watch/${video.id}`)
  }

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
        <h1 className="text-xl font-bold text-center text-gray-800">
          Math Videos
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-gray-600">What do you want to learn today?</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {/* Skeleton Category Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">😢</span>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recommended Videos Section - NOW AT TOP */}
        {!loading && !error && recommended.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Recommended for You
            </h2>

            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {recommended.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex-shrink-0"
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
                    isRecommended={true}
                    language={video.language}
                    onClick={() => handleVideoClick(video)}
                    onLockedClick={() => {
                      setLockedUnlockLevel(video.unlockLevel)
                      setLockedIsAlmost(video.isAlmostUnlocked)
                      setShowLockedModal(true)
                    }}
                    size="small"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Grid - NOW BELOW RECOMMENDED */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Browse by Topic
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <CategoryTile
                    id={category.id}
                    icon={category.icon}
                    label={category.label}
                    color={category.color}
                    levelRange={category.levelRange}
                    isUnlocked={category.isUnlocked}
                    unlockLevel={category.unlockLevel}
                    isAlmostUnlocked={category.isAlmostUnlocked}
                    watchedCount={category.watchedCount}
                    totalCount={category.totalCount}
                    onClick={() => handleCategoryClick(category)}
                    status={category.status}
                    childName={currentChild?.name}
                    childrenStatus={
                      children && children.length > 0
                        ? getCategoryStatusForChildren(
                            VIDEO_CATEGORIES.find(c => c.id === category.id) || category,
                            children.map(c => ({
                              id: c.id,
                              name: c.name,
                              avatar: c.avatar,
                              current_level: c.current_level
                            }))
                          )
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Locked Video Modal */}
      <LockedVideoModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        unlockLevel={lockedUnlockLevel}
        isAlmostUnlocked={lockedIsAlmost}
      />
    </div>
  )
}
