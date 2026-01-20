/**
 * Video Selection Service
 * Phase 1.18: YouTube Video Integration
 *
 * Smart video selection logic based on context, child profile, and viewing history.
 * Prioritizes age-appropriate content and varies suggestions based on trigger type.
 */

import type { Video, VideoTriggerType, VideoTier, Child, VideoSuggestion } from '@/types'
import { getVideosForConcept, getVideoPreferences, hasVideoForConcept } from './videoService'

// ============================================
// Context-Based Video Selection
// ============================================

interface VideoSelectionContext {
  conceptId: string
  conceptName?: string
  triggerType: VideoTriggerType
  child: Child
  sessionId?: string
  currentAccuracy?: number
  consecutiveMistakes?: number
}

/**
 * Select the best video for a given context
 * Considers age, trigger type, viewing history, and preferences
 */
export async function selectVideoForContext(
  context: VideoSelectionContext
): Promise<Video | null> {
  const { conceptId, triggerType, child } = context

  // Check if videos are enabled for this child
  const preferences = await getVideoPreferences(child.id)
  if (!preferences?.videosEnabled) {
    return null
  }

  // Determine preferred tier based on trigger type
  const preferredTier = getPreferredTier(triggerType)

  // Get videos for this concept filtered by age
  const { short, detailed } = await getVideosForConcept(conceptId, child.age)

  // No videos available
  if (!short && !detailed) {
    return null
  }

  // Return video based on preferred tier, with fallback
  if (preferredTier === 'short') {
    return short || detailed
  } else {
    return detailed || short
  }
}

/**
 * Get preferred video tier based on trigger type
 */
function getPreferredTier(triggerType: VideoTriggerType): VideoTier {
  switch (triggerType) {
    case 'concept_intro':
      // Short videos for introductions (less disruptive)
      return 'short'
    case 'struggle_detected':
      // Short videos initially, detailed if needed
      return 'short'
    case 'explicit_request':
      // User requested help, offer detailed explanation
      return 'detailed'
    case 'review_mode':
      // Review mode, can be more comprehensive
      return 'detailed'
    case 'parent_view':
      // Parent preview, show detailed for full picture
      return 'detailed'
    default:
      return 'short'
  }
}

// ============================================
// Suggestion Logic
// ============================================

/**
 * Determine if we should suggest a video based on performance
 */
export async function shouldSuggestVideo(
  childId: string,
  consecutiveMistakes: number,
  conceptId: string
): Promise<boolean> {
  // Get child preferences
  const preferences = await getVideoPreferences(childId)

  if (!preferences) {
    return false
  }

  // Check if videos are enabled
  if (!preferences.videosEnabled || !preferences.autoSuggestEnabled) {
    return false
  }

  // Check if we've hit the suggestion threshold
  if (consecutiveMistakes < preferences.suggestThreshold) {
    return false
  }

  // Check daily limits
  if (preferences.videosWatchedToday >= preferences.maxVideosPerDay) {
    return false
  }

  // Check if video exists for this concept
  const hasVideo = await hasVideoForConcept(conceptId)
  if (!hasVideo) {
    return false
  }

  return true
}

/**
 * Create a video suggestion object
 */
export async function createVideoSuggestion(
  video: Video,
  conceptId: string,
  conceptName: string,
  triggerType: VideoTriggerType,
  consecutiveMistakes?: number
): Promise<VideoSuggestion> {
  // Determine urgency based on context
  let urgency: 'gentle' | 'suggested' | 'recommended' = 'gentle'
  let message = 'Would you like to watch a quick video?'

  if (triggerType === 'struggle_detected' && consecutiveMistakes) {
    if (consecutiveMistakes >= 5) {
      urgency = 'recommended'
      message = "It looks like this concept is tricky. Let's watch a helpful video!"
    } else if (consecutiveMistakes >= 3) {
      urgency = 'suggested'
      message = 'A short video might help explain this better.'
    }
  } else if (triggerType === 'concept_intro') {
    message = `Learn about ${conceptName} with this video!`
    urgency = 'gentle'
  } else if (triggerType === 'explicit_request') {
    message = `Here's a video that explains ${conceptName}.`
    urgency = 'suggested'
  }

  return {
    video,
    conceptId,
    conceptName,
    triggerType,
    reason: getReason(triggerType, consecutiveMistakes),
    urgency,
    message,
  }
}

/**
 * Get the reason string for a suggestion
 */
function getReason(triggerType: VideoTriggerType, consecutiveMistakes?: number): string {
  switch (triggerType) {
    case 'concept_intro':
      return 'New concept introduction'
    case 'struggle_detected':
      return consecutiveMistakes
        ? `${consecutiveMistakes} consecutive incorrect answers`
        : 'Detected difficulty with this concept'
    case 'explicit_request':
      return 'User requested help'
    case 'review_mode':
      return 'Post-session review'
    case 'parent_view':
      return 'Parent dashboard preview'
    default:
      return 'Video suggestion'
  }
}

// ============================================
// Help Menu Video Selection
// ============================================

/**
 * Get video options for the help menu
 * Returns up to 2 videos: one short and one detailed if available
 */
export async function getHelpMenuVideos(
  conceptId: string,
  childAge: number
): Promise<{ shortVideo: Video | null; detailedVideo: Video | null }> {
  const { short, detailed } = await getVideosForConcept(conceptId, childAge)

  return { shortVideo: short, detailedVideo: detailed }
}

// ============================================
// Video Effectiveness Tracking
// ============================================

/**
 * Calculate video effectiveness for a child
 * Compares accuracy before and after watching
 */
export function calculateVideoEffectiveness(
  _childId: string,
  _videoId: string,
  _conceptId: string,
  accuracyBefore: number,
  accuracyAfter: number
): {
  improvement: number
  wasHelpful: boolean
} {
  const improvement = accuracyAfter - accuracyBefore
  const wasHelpful = improvement > 0.1 // 10% improvement threshold

  // Store effectiveness data (could be used for future recommendations)
  // This is handled in videoService.completeVideoView

  return {
    improvement,
    wasHelpful,
  }
}

// ============================================
// Concept Detection Helpers
// ============================================

/**
 * Get the current concept based on problem data
 * This integrates with the existing concept system
 */
export function getConceptFromProblem(problem: {
  type: string
  level: string
  operands: number[]
  missingPosition?: number
}): string {
  // This maps problem characteristics to concept IDs
  // Uses the same concept IDs as CONCEPT_INTRODUCTION in concept-availability.ts

  const { type, level, operands } = problem
  const maxOperand = Math.max(...operands)

  // Basic counting
  if (type === 'addition' && level.includes('7A') && maxOperand <= 10) {
    return 'counting_to_10'
  }

  // Addition concepts by level
  if (type === 'addition') {
    if (level.includes('6A') || level.includes('5A')) {
      if (operands.some((o) => o === 1)) return 'addition_plus_1'
      if (operands.some((o) => o === 2)) return 'addition_plus_2'
      return 'addition'
    }
    if (level.includes('4A') || level.includes('3A')) {
      if (maxOperand > 10) return 'adding_double_digits'
      return 'making_10'
    }
    if (level.includes('2A') || level.includes('A')) {
      return 'addition_with_carrying'
    }
    if (level.includes('B')) {
      return 'addition_3_digit'
    }
  }

  // Subtraction concepts
  if (type === 'subtraction') {
    if (level.includes('A')) {
      return 'subtraction'
    }
    if (level.includes('B')) {
      return 'subtraction_with_borrowing'
    }
  }

  // Multiplication concepts
  if (type === 'multiplication') {
    if (level.includes('C')) {
      return 'multiplication'
    }
  }

  // Division concepts
  if (type === 'division') {
    if (level.includes('C') || level.includes('D')) {
      return 'division'
    }
  }

  // Default fallback - use the operation type
  return type
}
