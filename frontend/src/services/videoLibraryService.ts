/**
 * Video Library Service
 * Handles video library operations including:
 * - Fetching videos by category
 * - Personalized recommendations
 * - Watch progress tracking
 * - Category statistics
 */

import { supabase } from '@/lib/supabase'
import type { Video, KumonLevel } from '@/types'
import { VIDEO_CATEGORIES, type VideoCategory } from '@/config/videoCategories'
import {
  isVideoUnlocked,
  isCategoryUnlocked,
  getUnlockRequirement,
  isAlmostUnlocked,
  getUnlockedLevels,
} from '@/utils/videoUnlockSystem'

// ============================================
// Types
// ============================================

export interface VideoWithUnlockStatus extends Video {
  isUnlocked: boolean
  unlockLevel: KumonLevel | null
  isAlmostUnlocked: boolean
  isWatched: boolean
}

export interface CategoryWithStats extends VideoCategory {
  isUnlocked: boolean
  unlockLevel: KumonLevel | null
  isAlmostUnlocked: boolean
  watchedCount: number
  totalCount: number
  videos: VideoWithUnlockStatus[]
}

// ============================================
// Database Converters
// ============================================

function dbToVideo(row: any): Video {
  return {
    id: row.id,
    youtubeId: row.youtube_id,
    title: row.title,
    channelName: row.channel_name,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: row.thumbnail_url,
    tier: row.tier,
    minAge: row.min_age,
    maxAge: row.max_age,
    kumonLevel: row.kumon_level,
    scoreOverall: row.score_overall,
    teachingStyle: row.teaching_style,
    isActive: row.is_active,
  }
}

// ============================================
// Video Library Operations
// ============================================

/**
 * Get all video categories with stats for a child
 */
export async function getCategoriesWithStats(
  childId: string,
  childLevel: KumonLevel
): Promise<CategoryWithStats[]> {
  // Get watched video IDs for the child
  const watchedIds = await getWatchedVideoIds(childId)

  // Get all active videos
  const { data: videosData, error } = await supabase
    .from('video_library')
    .select('*')
    .eq('is_active', true)
    .order('score_overall', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  const allVideos = (videosData || []).map(dbToVideo)

  // Build category stats
  return VIDEO_CATEGORIES.map(category => {
    // Filter videos that belong to this category (by level)
    const categoryVideos = allVideos.filter(video =>
      category.levels.includes(video.kumonLevel)
    )

    // Add unlock and watch status to each video
    const videosWithStatus: VideoWithUnlockStatus[] = categoryVideos.map(video => ({
      ...video,
      isUnlocked: isVideoUnlocked(video.kumonLevel as KumonLevel, childLevel),
      unlockLevel: getUnlockRequirement(video.kumonLevel as KumonLevel, childLevel),
      isAlmostUnlocked: isAlmostUnlocked(video.kumonLevel as KumonLevel, childLevel),
      isWatched: watchedIds.has(video.id),
    }))

    // Count unlocked videos
    const unlockedVideos = videosWithStatus.filter(v => v.isUnlocked)
    const watchedCount = unlockedVideos.filter(v => v.isWatched).length

    // Get unlock requirement for category
    const categoryUnlocked = isCategoryUnlocked(category, childLevel)
    const firstLevel = category.levels[0] as KumonLevel
    const unlockLevel = categoryUnlocked ? null : getUnlockRequirement(firstLevel, childLevel)
    const almostUnlocked = !categoryUnlocked && isAlmostUnlocked(firstLevel, childLevel)

    return {
      ...category,
      isUnlocked: categoryUnlocked,
      unlockLevel,
      isAlmostUnlocked: almostUnlocked,
      watchedCount,
      totalCount: unlockedVideos.length,
      videos: videosWithStatus,
    }
  })
}

/**
 * Get videos for a specific category
 */
export async function getVideosForCategory(
  categoryId: string,
  childId: string,
  childLevel: KumonLevel
): Promise<{
  shortVideos: VideoWithUnlockStatus[]
  detailedVideos: VideoWithUnlockStatus[]
  totalWatched: number
  totalUnlocked: number
}> {
  const category = VIDEO_CATEGORIES.find(c => c.id === categoryId)
  if (!category) {
    return { shortVideos: [], detailedVideos: [], totalWatched: 0, totalUnlocked: 0 }
  }

  // Get watched video IDs
  const watchedIds = await getWatchedVideoIds(childId)

  // Fetch videos for this category's levels
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .in('kumon_level', category.levels)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })

  if (error) {
    console.error('Error fetching category videos:', error)
    return { shortVideos: [], detailedVideos: [], totalWatched: 0, totalUnlocked: 0 }
  }

  const videos = (data || []).map(dbToVideo)

  // Add status to each video
  const videosWithStatus: VideoWithUnlockStatus[] = videos.map(video => ({
    ...video,
    isUnlocked: isVideoUnlocked(video.kumonLevel as KumonLevel, childLevel),
    unlockLevel: getUnlockRequirement(video.kumonLevel as KumonLevel, childLevel),
    isAlmostUnlocked: isAlmostUnlocked(video.kumonLevel as KumonLevel, childLevel),
    isWatched: watchedIds.has(video.id),
  }))

  // Split by tier
  const shortVideos = videosWithStatus.filter(v => v.tier === 'short')
  const detailedVideos = videosWithStatus.filter(v => v.tier === 'detailed')

  // Calculate stats (only count unlocked videos)
  const unlocked = videosWithStatus.filter(v => v.isUnlocked)
  const watched = unlocked.filter(v => v.isWatched)

  return {
    shortVideos,
    detailedVideos,
    totalWatched: watched.length,
    totalUnlocked: unlocked.length,
  }
}

/**
 * Get recommended videos for a child based on their level and struggles
 */
export async function getRecommendedVideos(
  childId: string,
  childLevel: KumonLevel,
  limit: number = 6
): Promise<VideoWithUnlockStatus[]> {
  const watchedIds = await getWatchedVideoIds(childId)
  const unlockedLevels = getUnlockedLevels(childLevel)

  // Fetch videos from unlocked levels
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .in('kumon_level', unlockedLevels)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })

  if (error) {
    console.error('Error fetching recommended videos:', error)
    return []
  }

  const videos = (data || []).map(dbToVideo)

  // Add status
  const videosWithStatus: VideoWithUnlockStatus[] = videos.map(video => ({
    ...video,
    isUnlocked: true, // All are unlocked since we filtered by unlocked levels
    unlockLevel: null,
    isAlmostUnlocked: false,
    isWatched: watchedIds.has(video.id),
  }))

  // Prioritize:
  // 1. Unwatched videos from current level
  // 2. Unwatched videos from nearby levels
  // 3. Watched videos (for re-watching)

  const childLevelIndex = unlockedLevels.indexOf(childLevel)

  const sortedVideos = videosWithStatus.sort((a, b) => {
    // Unwatched before watched
    if (a.isWatched !== b.isWatched) {
      return a.isWatched ? 1 : -1
    }

    // Closer levels first
    const aLevelIndex = unlockedLevels.indexOf(a.kumonLevel as KumonLevel)
    const bLevelIndex = unlockedLevels.indexOf(b.kumonLevel as KumonLevel)
    const aDistance = Math.abs(aLevelIndex - childLevelIndex)
    const bDistance = Math.abs(bLevelIndex - childLevelIndex)

    if (aDistance !== bDistance) {
      return aDistance - bDistance
    }

    // Higher score first
    return (b.scoreOverall || 0) - (a.scoreOverall || 0)
  })

  return sortedVideos.slice(0, limit)
}

/**
 * Get a single video by ID with unlock status
 */
export async function getVideoById(
  videoId: string,
  childId: string,
  childLevel: KumonLevel
): Promise<VideoWithUnlockStatus | null> {
  const watchedIds = await getWatchedVideoIds(childId)

  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .eq('id', videoId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('Error fetching video:', error)
    return null
  }

  const video = dbToVideo(data)

  return {
    ...video,
    isUnlocked: isVideoUnlocked(video.kumonLevel as KumonLevel, childLevel),
    unlockLevel: getUnlockRequirement(video.kumonLevel as KumonLevel, childLevel),
    isAlmostUnlocked: isAlmostUnlocked(video.kumonLevel as KumonLevel, childLevel),
    isWatched: watchedIds.has(video.id),
  }
}

/**
 * Get related videos (same category, excluding current video)
 */
export async function getRelatedVideos(
  currentVideoId: string,
  categoryId: string,
  childId: string,
  childLevel: KumonLevel,
  limit: number = 6
): Promise<VideoWithUnlockStatus[]> {
  const category = VIDEO_CATEGORIES.find(c => c.id === categoryId)
  if (!category) return []

  const watchedIds = await getWatchedVideoIds(childId)

  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .in('kumon_level', category.levels)
    .neq('id', currentVideoId)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related videos:', error)
    return []
  }

  const videos = (data || []).map(dbToVideo)

  return videos.map(video => ({
    ...video,
    isUnlocked: isVideoUnlocked(video.kumonLevel as KumonLevel, childLevel),
    unlockLevel: getUnlockRequirement(video.kumonLevel as KumonLevel, childLevel),
    isAlmostUnlocked: isAlmostUnlocked(video.kumonLevel as KumonLevel, childLevel),
    isWatched: watchedIds.has(video.id),
  }))
}

// ============================================
// Watch Progress Operations
// ============================================

/**
 * Get set of watched video IDs for a child
 * A video is considered "watched" if completion >= 80%
 */
export async function getWatchedVideoIds(childId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('video_views')
    .select('video_id')
    .eq('child_id', childId)
    .gte('completion_percentage', 80)

  if (error) {
    console.error('Error fetching watched videos:', error)
    return new Set()
  }

  return new Set((data || []).map(row => row.video_id))
}

/**
 * Get detailed watch history for a child
 */
export async function getWatchHistory(
  childId: string,
  limit: number = 20
): Promise<Array<{
  video: Video
  watchedAt: string
  completionPercentage: number
}>> {
  const { data, error } = await supabase
    .from('video_views')
    .select(`
      video_id,
      started_at,
      completion_percentage,
      video_library (*)
    `)
    .eq('child_id', childId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching watch history:', error)
    return []
  }

  return (data || [])
    .filter(row => row.video_library)
    .map(row => ({
      video: dbToVideo(row.video_library),
      watchedAt: row.started_at,
      completionPercentage: row.completion_percentage,
    }))
}

// ============================================
// Newly Unlocked Videos (for celebrations)
// ============================================

/**
 * Get videos that are newly unlocked when child advances from oldLevel to newLevel
 */
export async function getNewlyUnlockedVideos(
  oldLevel: KumonLevel,
  newLevel: KumonLevel
): Promise<Video[]> {
  // Find levels that are now unlocked but weren't before
  const oldUnlocked = getUnlockedLevels(oldLevel)
  const newUnlocked = getUnlockedLevels(newLevel)

  const newlyUnlockedLevels = newUnlocked.filter(level => !oldUnlocked.includes(level))

  if (newlyUnlockedLevels.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .in('kumon_level', newlyUnlockedLevels)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching newly unlocked videos:', error)
    return []
  }

  return (data || []).map(dbToVideo)
}

/**
 * Find which category a video belongs to
 */
export function getCategoryForVideo(video: Video): VideoCategory | undefined {
  return VIDEO_CATEGORIES.find(cat =>
    cat.levels.includes(video.kumonLevel)
  )
}
