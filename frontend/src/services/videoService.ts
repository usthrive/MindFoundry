/**
 * Video Service
 * YouTube Video Integration
 *
 * Provides CRUD operations for video-related tables:
 * - video_library: Video metadata
 * - concept_videos: Concept-to-video mappings
 * - video_views: Watch activity tracking
 * - video_preferences: Parental controls
 */

import { supabase } from '@/lib/supabase'
import type {
  Video,
  ConceptVideo,
  VideoView,
  VideoPreferences,
  VideoTier,
  VideoTriggerType,
  VideoFeedback,
  TeachingStyle,
} from '@/types'

// ============================================
// Type Converters (DB → Application)
// ============================================

function dbToVideo(row: any): Video {
  return {
    id: row.id,
    youtubeId: row.youtube_id,
    title: row.title,
    channelName: row.channel_name,
    durationSeconds: row.duration_seconds,
    thumbnailUrl: row.thumbnail_url,
    tier: row.tier as VideoTier,
    minAge: row.min_age,
    maxAge: row.max_age,
    kumonLevel: row.kumon_level,
    scoreOverall: row.score_overall,
    teachingStyle: row.teaching_style as TeachingStyle | null,
    isActive: row.is_active,
  }
}

function dbToConceptVideo(row: any): ConceptVideo {
  return {
    id: row.id,
    conceptId: row.concept_id,
    conceptName: row.concept_name,
    kumonLevel: row.kumon_level,
    shortVideoId: row.short_video_id,
    detailedVideoId: row.detailed_video_id,
    showAtIntroduction: row.show_at_introduction,
    showInHints: row.show_in_hints,
    showInHelpMenu: row.show_in_help_menu,
  }
}

function dbToVideoView(row: any): VideoView {
  return {
    id: row.id,
    childId: row.child_id,
    videoId: row.video_id,
    conceptId: row.concept_id,
    triggerType: row.trigger_type as VideoTriggerType,
    sessionId: row.session_id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    watchDurationSeconds: row.watch_duration_seconds,
    completionPercentage: row.completion_percentage,
    userFeedback: row.user_feedback as VideoFeedback | null,
    accuracyBeforeVideo: row.accuracy_before_video,
    accuracyAfterVideo: row.accuracy_after_video,
  }
}

function dbToVideoPreferences(row: any): VideoPreferences {
  return {
    id: row.id,
    childId: row.child_id,
    videosEnabled: row.videos_enabled,
    autoSuggestEnabled: row.auto_suggest_enabled,
    suggestThreshold: row.suggest_threshold,
    showInConceptIntro: row.show_in_concept_intro,
    showInReview: row.show_in_review,
    maxVideosPerDay: row.max_videos_per_day,
    maxVideoDurationMinutes: row.max_video_duration_minutes,
    suggestionsDismissedToday: row.suggestions_dismissed_today,
    videosWatchedToday: row.videos_watched_today,
  }
}

// ============================================
// Video Library Operations
// ============================================

/**
 * Get a video by ID
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .eq('id', videoId)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return dbToVideo(data)
}

/**
 * Get a video by YouTube ID
 */
export async function getVideoByYoutubeId(youtubeId: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .eq('youtube_id', youtubeId)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return dbToVideo(data)
}

/**
 * Get all videos for a Kumon level
 */
export async function getVideosForLevel(kumonLevel: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .eq('kumon_level', kumonLevel)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })

  if (error || !data) return []
  return data.map(dbToVideo)
}

/**
 * Get age-appropriate videos
 */
export async function getVideosForAge(childAge: number): Promise<Video[]> {
  const { data, error } = await supabase
    .from('video_library')
    .select('*')
    .lte('min_age', childAge)
    .gte('max_age', childAge)
    .eq('is_active', true)
    .order('score_overall', { ascending: false })

  if (error || !data) return []
  return data.map(dbToVideo)
}

// ============================================
// Concept-Video Mapping Operations
// ============================================

/**
 * Get concept-video mapping for a concept
 */
export async function getConceptVideoMapping(conceptId: string): Promise<ConceptVideo | null> {
  const { data, error } = await supabase
    .from('concept_videos')
    .select('*')
    .eq('concept_id', conceptId)
    .single()

  if (error || !data) return null
  return dbToConceptVideo(data)
}

/**
 * Check if a concept has any videos
 */
export async function hasVideoForConcept(conceptId: string): Promise<boolean> {
  const mapping = await getConceptVideoMapping(conceptId)
  return mapping !== null && (mapping.shortVideoId !== null || mapping.detailedVideoId !== null)
}

/**
 * Get videos for a concept (both short and detailed if available)
 */
export async function getVideosForConcept(
  conceptId: string,
  childAge?: number,
  tier?: VideoTier
): Promise<{ short: Video | null; detailed: Video | null }> {
  const mapping = await getConceptVideoMapping(conceptId)
  if (!mapping) return { short: null, detailed: null }

  let shortVideo: Video | null = null
  let detailedVideo: Video | null = null

  // Get short video
  if (mapping.shortVideoId && (!tier || tier === 'short')) {
    shortVideo = await getVideoById(mapping.shortVideoId)
    // Check age appropriateness
    if (shortVideo && childAge !== undefined) {
      if (childAge < shortVideo.minAge || childAge > shortVideo.maxAge) {
        shortVideo = null
      }
    }
  }

  // Get detailed video
  if (mapping.detailedVideoId && (!tier || tier === 'detailed')) {
    detailedVideo = await getVideoById(mapping.detailedVideoId)
    // Check age appropriateness
    if (detailedVideo && childAge !== undefined) {
      if (childAge < detailedVideo.minAge || childAge > detailedVideo.maxAge) {
        detailedVideo = null
      }
    }
  }

  return { short: shortVideo, detailed: detailedVideo }
}

/**
 * Get the best video for a concept based on context
 */
export async function getBestVideoForConcept(
  conceptId: string,
  childAge: number,
  preferredTier: VideoTier = 'short'
): Promise<Video | null> {
  const videos = await getVideosForConcept(conceptId, childAge)

  // Return preferred tier if available, otherwise the other
  if (preferredTier === 'short') {
    return videos.short || videos.detailed
  } else {
    return videos.detailed || videos.short
  }
}

/**
 * Get all concept-video mappings for a level
 */
export async function getConceptVideosForLevel(kumonLevel: string): Promise<ConceptVideo[]> {
  const { data, error } = await supabase
    .from('concept_videos')
    .select('*')
    .eq('kumon_level', kumonLevel)

  if (error || !data) return []
  return data.map(dbToConceptVideo)
}

// ============================================
// Video Views Operations
// ============================================

/**
 * Record the start of a video view
 */
export async function recordVideoViewStart(
  childId: string,
  videoId: string,
  conceptId: string,
  triggerType: VideoTriggerType,
  sessionId?: string,
  accuracyBeforeVideo?: number
): Promise<string | null> {
  const { data, error } = await supabase
    .from('video_views')
    .insert({
      child_id: childId,
      video_id: videoId,
      concept_id: conceptId,
      trigger_type: triggerType,
      session_id: sessionId || null,
      accuracy_before_video: accuracyBeforeVideo ?? null,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Error recording video view start:', error)
    return null
  }
  return data.id
}

/**
 * Update video view progress
 */
export async function updateVideoViewProgress(
  viewId: string,
  watchDurationSeconds: number,
  completionPercentage: number
): Promise<boolean> {
  const { error } = await supabase
    .from('video_views')
    .update({
      watch_duration_seconds: watchDurationSeconds,
      completion_percentage: completionPercentage,
    })
    .eq('id', viewId)

  if (error) {
    console.error('Error updating video view progress:', error)
    return false
  }
  return true
}

/**
 * Complete a video view
 */
export async function completeVideoView(
  viewId: string,
  watchDurationSeconds: number,
  completionPercentage: number,
  userFeedback?: VideoFeedback
): Promise<boolean> {
  const { error } = await supabase
    .from('video_views')
    .update({
      ended_at: new Date().toISOString(),
      watch_duration_seconds: watchDurationSeconds,
      completion_percentage: completionPercentage,
      user_feedback: userFeedback || null,
    })
    .eq('id', viewId)

  if (error) {
    console.error('Error completing video view:', error)
    return false
  }

  // Increment videos_watched_today in preferences
  await incrementVideosWatchedToday(viewId)

  return true
}

/**
 * Set video feedback
 */
export async function setVideoFeedback(
  viewId: string,
  feedback: VideoFeedback
): Promise<boolean> {
  const { error } = await supabase
    .from('video_views')
    .update({ user_feedback: feedback })
    .eq('id', viewId)

  if (error) {
    console.error('Error setting video feedback:', error)
    return false
  }
  return true
}

/**
 * Update accuracy after video (for effectiveness tracking)
 */
export async function updateAccuracyAfterVideo(
  viewId: string,
  accuracyAfterVideo: number
): Promise<boolean> {
  const { error } = await supabase
    .from('video_views')
    .update({ accuracy_after_video: accuracyAfterVideo })
    .eq('id', viewId)

  if (error) {
    console.error('Error updating accuracy after video:', error)
    return false
  }
  return true
}

/**
 * Get video views for a child
 */
export async function getVideoViewsForChild(
  childId: string,
  limit: number = 10
): Promise<VideoView[]> {
  const { data, error } = await supabase
    .from('video_views')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data.map(dbToVideoView)
}

/**
 * Get video views for a concept
 */
export async function getVideoViewsForConcept(
  childId: string,
  conceptId: string
): Promise<VideoView[]> {
  const { data, error } = await supabase
    .from('video_views')
    .select('*')
    .eq('child_id', childId)
    .eq('concept_id', conceptId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbToVideoView)
}

/**
 * Check if child has watched a video for a concept recently (last 7 days)
 */
export async function hasWatchedVideoRecently(
  childId: string,
  conceptId: string,
  days: number = 7
): Promise<boolean> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('video_views')
    .select('id')
    .eq('child_id', childId)
    .eq('concept_id', conceptId)
    .gte('created_at', cutoffDate.toISOString())
    .limit(1)

  if (error) return false
  return data !== null && data.length > 0
}

// ============================================
// Video Preferences Operations
// ============================================

/**
 * Get video preferences for a child (creates default if not exists)
 */
export async function getVideoPreferences(childId: string): Promise<VideoPreferences> {
  const { data, error } = await supabase
    .from('video_preferences')
    .select('*')
    .eq('child_id', childId)
    .single()

  if (error || !data) {
    // Create default preferences
    return await createDefaultVideoPreferences(childId)
  }

  return dbToVideoPreferences(data)
}

/**
 * Create default video preferences for a child
 */
async function createDefaultVideoPreferences(childId: string): Promise<VideoPreferences> {
  const defaultPrefs = {
    child_id: childId,
    videos_enabled: true,
    auto_suggest_enabled: true,
    suggest_threshold: 3,
    show_in_concept_intro: true,
    show_in_review: true,
    max_videos_per_day: 10,
    max_video_duration_minutes: 15,
  }

  const { data, error } = await supabase
    .from('video_preferences')
    .insert(defaultPrefs)
    .select()
    .single()

  if (error || !data) {
    // Return default values if insert fails
    console.error('Error creating default video preferences:', error)
    return {
      id: '',
      childId,
      videosEnabled: true,
      autoSuggestEnabled: true,
      suggestThreshold: 3,
      showInConceptIntro: true,
      showInReview: true,
      maxVideosPerDay: 10,
      maxVideoDurationMinutes: 15,
      suggestionsDismissedToday: 0,
      videosWatchedToday: 0,
    }
  }

  return dbToVideoPreferences(data)
}

/**
 * Update video preferences
 */
export async function updateVideoPreferences(
  childId: string,
  updates: Partial<{
    videosEnabled: boolean
    autoSuggestEnabled: boolean
    suggestThreshold: number
    showInConceptIntro: boolean
    showInReview: boolean
    maxVideosPerDay: number
    maxVideoDurationMinutes: number
  }>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {}

  if (updates.videosEnabled !== undefined) dbUpdates.videos_enabled = updates.videosEnabled
  if (updates.autoSuggestEnabled !== undefined) dbUpdates.auto_suggest_enabled = updates.autoSuggestEnabled
  if (updates.suggestThreshold !== undefined) dbUpdates.suggest_threshold = updates.suggestThreshold
  if (updates.showInConceptIntro !== undefined) dbUpdates.show_in_concept_intro = updates.showInConceptIntro
  if (updates.showInReview !== undefined) dbUpdates.show_in_review = updates.showInReview
  if (updates.maxVideosPerDay !== undefined) dbUpdates.max_videos_per_day = updates.maxVideosPerDay
  if (updates.maxVideoDurationMinutes !== undefined) dbUpdates.max_video_duration_minutes = updates.maxVideoDurationMinutes

  const { error } = await supabase
    .from('video_preferences')
    .update(dbUpdates)
    .eq('child_id', childId)

  if (error) {
    console.error('Error updating video preferences:', error)
    return false
  }
  return true
}

/**
 * Increment suggestions dismissed today
 */
export async function incrementSuggestionsDismissed(childId: string): Promise<boolean> {
  const prefs = await getVideoPreferences(childId)

  const { error } = await supabase
    .from('video_preferences')
    .update({
      suggestions_dismissed_today: prefs.suggestionsDismissedToday + 1,
    })
    .eq('child_id', childId)

  if (error) {
    console.error('Error incrementing suggestions dismissed:', error)
    return false
  }
  return true
}

/**
 * Increment videos watched today (called from completeVideoView)
 */
async function incrementVideosWatchedToday(viewId: string): Promise<void> {
  // Get the view to find the child_id
  const { data: view } = await supabase
    .from('video_views')
    .select('child_id')
    .eq('id', viewId)
    .single()

  if (!view) return

  const prefs = await getVideoPreferences(view.child_id)

  await supabase
    .from('video_preferences')
    .update({
      videos_watched_today: prefs.videosWatchedToday + 1,
    })
    .eq('child_id', view.child_id)
}

/**
 * Check if video suggestions are allowed (based on preferences and limits)
 */
export async function canSuggestVideo(childId: string): Promise<boolean> {
  const prefs = await getVideoPreferences(childId)

  // Check if videos are enabled
  if (!prefs.videosEnabled) return false

  // Check if auto-suggest is enabled
  if (!prefs.autoSuggestEnabled) return false

  // Check daily limit
  if (prefs.videosWatchedToday >= prefs.maxVideosPerDay) return false

  return true
}

// ============================================
// YouTube URL Helpers
// ============================================

/**
 * Get YouTube embed URL with privacy-enhanced mode
 */
export function getYouTubeEmbedUrl(youtubeId: string): string {
  const params = new URLSearchParams({
    autoplay: '0',
    rel: '0',
    modestbranding: '1',
    controls: '1',
    fs: '1',
    playsinline: '1',
    iv_load_policy: '3',
    enablejsapi: '1',
  })

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  }
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`
}

/**
 * Format duration in seconds to mm:ss or hh:mm:ss
 */
export function formatVideoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
