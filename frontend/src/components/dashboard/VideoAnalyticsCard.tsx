/**
 * Video Analytics Card
 * Phase 1.18: YouTube Video Integration
 *
 * Displays video watching statistics on the parent dashboard.
 * Shows watch time, completion rates, and helpful videos.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { VideoAnalytics } from '@/types'
import { supabase } from '@/lib/supabase'

interface VideoAnalyticsCardProps {
  childId: string
}

export default function VideoAnalyticsCard({ childId }: VideoAnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true)
      try {
        // Get video views for this child
        const { data: views, error } = await supabase
          .from('video_views')
          .select(`
            id,
            video_id,
            watch_duration_seconds,
            completion_percentage,
            user_feedback,
            trigger_type,
            started_at
          `)
          .eq('child_id', childId)

        if (error) throw error

        if (!views || views.length === 0) {
          setAnalytics(null)
          setLoading(false)
          return
        }

        // Calculate analytics
        const totalVideosWatched = views.length
        const totalSecondsWatched = views.reduce(
          (sum, v) => sum + (v.watch_duration_seconds || 0),
          0
        )
        const totalMinutesWatched = Math.round(totalSecondsWatched / 60)

        const averageCompletion = Math.round(
          views.reduce((sum, v) => sum + (v.completion_percentage || 0), 0) / views.length
        )

        // Videos watched this week
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const recentViews = views.filter(
          (v) => new Date(v.started_at) >= oneWeekAgo
        )
        const videosWatchedThisWeek = recentViews.length
        const minutesWatchedThisWeek = Math.round(
          recentViews.reduce((sum, v) => sum + (v.watch_duration_seconds || 0), 0) / 60
        )

        // Count by trigger type
        const videosByTriggerType = views.reduce((acc, v) => {
          const type = v.trigger_type as keyof typeof acc
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        setAnalytics({
          totalVideosWatched,
          totalMinutesWatched,
          averageCompletion,
          videosWatchedThisWeek,
          minutesWatchedThisWeek,
          mostHelpfulVideos: [], // Would need to join with video_library
          conceptsReviewed: [],
          videosByTriggerType: videosByTriggerType as Record<any, number>,
        })
      } catch (err) {
        console.error('Failed to load video analytics:', err)
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    if (childId) {
      loadAnalytics()
    }
  }, [childId])

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  // Don't show card if no videos watched
  if (!analytics || analytics.totalVideosWatched === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📺</span>
        <h3 className="text-sm font-semibold text-gray-700">Video Learning</h3>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">
            {analytics.totalVideosWatched}
          </div>
          <div className="text-xs text-gray-500">Videos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {analytics.totalMinutesWatched}
          </div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {analytics.averageCompletion}%
          </div>
          <div className="text-xs text-gray-500">Avg Completion</div>
        </div>
      </div>

      {/* This Week */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">This Week</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-600">
              {analytics.videosWatchedThisWeek} videos
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {analytics.minutesWatchedThisWeek} min
            </span>
          </div>
        </div>
      </div>

      {/* Trigger Breakdown */}
      {Object.keys(analytics.videosByTriggerType).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">How videos were discovered:</p>
          <div className="flex flex-wrap gap-2">
            {analytics.videosByTriggerType.concept_intro > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                New concepts: {analytics.videosByTriggerType.concept_intro}
              </span>
            )}
            {analytics.videosByTriggerType.struggle_detected > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                Help needed: {analytics.videosByTriggerType.struggle_detected}
              </span>
            )}
            {analytics.videosByTriggerType.explicit_request > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Requested: {analytics.videosByTriggerType.explicit_request}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
