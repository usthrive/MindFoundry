/**
 * VideoLibraryPage
 * Main video library landing page with category tiles and recommended videos
 * Supports viewing individual child or all children with a dropdown selector
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import type { KumonLevel } from '@/types'
import type { Database } from '@/lib/supabase'
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

type Child = Database['public']['Tables']['children']['Row']

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

  // Child selector state: specific child or 'all' for parent view
  const [viewingChild, setViewingChild] = useState<Child | 'all' | null>(null)

  // Initialize viewingChild based on context when component mounts or context changes
  useEffect(() => {
    if (!children || children.length === 0) return

    if (currentChild) {
      // Coming from child's study page - select that child
      setViewingChild(currentChild)
    } else if (children.length > 1) {
      // Coming from home page with multiple children - show all
      setViewingChild('all')
    } else {
      // Single child account - select that child
      setViewingChild(children[0])
    }
  }, [currentChild, children])

  // Parent view = "all children" selected AND multiple children exist
  const isParentView = viewingChild === 'all' && children && children.length > 1

  // Handle child selector change
  const handleChildChange = (value: string) => {
    if (value === 'all') {
      setViewingChild('all')
    } else {
      const child = children?.find(c => c.id === value)
      if (child) {
        setViewingChild(child)
      }
    }
  }

  // Load data based on viewingChild
  useEffect(() => {
    async function loadData() {
      // Wait for viewingChild to be initialized
      if (!viewingChild) return
      if (!children || children.length === 0) return

      // Determine the child to use for data fetching
      const childToUse = viewingChild === 'all' ? children[0] : viewingChild
      if (!childToUse) return

      setLoading(true)
      setError(null)

      try {
        const childLevel = childToUse.current_level as KumonLevel

        // For parent view, use the highest level among all children for unlocking
        const effectiveLevel = isParentView
          ? getHighestChildLevel(children.map(c => ({ current_level: c.current_level })))
          : childLevel

        // Fetch categories and recommended videos in parallel
        const [categoriesData, recommendedData] = await Promise.all([
          getCategoriesWithStats(childToUse.id, effectiveLevel),
          getRecommendedVideos(childToUse.id, effectiveLevel, 6),
        ])

        // For parent view, ensure categories are unlocked if ANY child can access them
        let finalCategories = categoriesData
        if (isParentView) {
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
  }, [viewingChild, children, isParentView])

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

  // No children available at all
  if (!children || children.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-4xl mb-4 block">👋</span>
          <p className="text-gray-600">Please add a child profile first</p>
          <button
            onClick={() => navigate('/select-child')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Get the effective child for display (for single child mode)
  const displayChild = viewingChild === 'all' ? null : viewingChild

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Math Videos
        </h1>

        {/* Child Selector Dropdown - only show if multiple children */}
        {children.length > 1 && (
          <div className="flex justify-center mt-3">
            <select
              value={viewingChild === 'all' ? 'all' : (viewingChild as Child)?.id || ''}
              onChange={(e) => handleChildChange(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">👨‍👩‍👧‍👦 All Children</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.avatar} {child.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
                    childName={displayChild?.name}
                    childrenStatus={
                      isParentView && children && children.length > 0
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
