/**
 * Video Unlock System
 * Progressive unlock logic for the Video Library
 *
 * Children can see videos for their current level and 1 level ahead.
 * Videos beyond that appear locked, creating a game-like sense of progression.
 */

import type { KumonLevel } from '@/types'
import { VIDEO_CATEGORIES, type VideoCategory } from '@/config/videoCategories'

// Kumon level order from lowest to highest (for the main progression)
// Note: XV, XM, XP, XS are electives and not part of main progression
export const LEVEL_ORDER: KumonLevel[] = [
  '7A', '6A', '5A', '4A', '3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'
]

// Number of levels ahead a child can preview (unlock buffer)
const UNLOCK_BUFFER = 1

/**
 * Get the index of a level in the progression order
 * Returns -1 if level not found in main progression
 */
export function getLevelIndex(level: KumonLevel): number {
  return LEVEL_ORDER.indexOf(level)
}

/**
 * Get all levels that are unlocked for a child at the given level
 * Includes current level and 1 level ahead
 */
export function getUnlockedLevels(currentLevel: KumonLevel): KumonLevel[] {
  const currentIndex = getLevelIndex(currentLevel)
  if (currentIndex === -1) {
    // If level not in main progression (e.g., electives), only unlock that level
    return [currentLevel]
  }

  // Unlock from beginning up to current + buffer
  const maxIndex = Math.min(currentIndex + UNLOCK_BUFFER + 1, LEVEL_ORDER.length)
  return LEVEL_ORDER.slice(0, maxIndex)
}

/**
 * Check if a specific level is unlocked for a child
 */
export function isLevelUnlocked(targetLevel: KumonLevel, childLevel: KumonLevel): boolean {
  const unlockedLevels = getUnlockedLevels(childLevel)
  return unlockedLevels.includes(targetLevel)
}

/**
 * Check if a video at a given level is unlocked for a child
 */
export function isVideoUnlocked(videoLevel: KumonLevel, childLevel: KumonLevel): boolean {
  return isLevelUnlocked(videoLevel, childLevel)
}

/**
 * Get the level required to unlock a video
 * Returns null if already unlocked, otherwise returns the required level
 */
export function getUnlockRequirement(videoLevel: KumonLevel, childLevel: KumonLevel): KumonLevel | null {
  if (isVideoUnlocked(videoLevel, childLevel)) {
    return null
  }

  // The video unlocks when the child reaches a level that puts videoLevel within the buffer
  const videoIndex = getLevelIndex(videoLevel)
  const requiredIndex = Math.max(0, videoIndex - UNLOCK_BUFFER)
  return LEVEL_ORDER[requiredIndex]
}

/**
 * Check if a child is "almost there" (1 level away from unlocking)
 */
export function isAlmostUnlocked(videoLevel: KumonLevel, childLevel: KumonLevel): boolean {
  if (isVideoUnlocked(videoLevel, childLevel)) {
    return false // Already unlocked
  }

  const childIndex = getLevelIndex(childLevel)
  const videoIndex = getLevelIndex(videoLevel)

  if (childIndex === -1 || videoIndex === -1) {
    return false
  }

  // Child is "almost there" if they're 1 level away from having the video in range
  const levelsAway = videoIndex - childIndex - UNLOCK_BUFFER
  return levelsAway === 1
}

/**
 * Get how many levels away a video is from being unlocked
 * Returns 0 if already unlocked, positive number otherwise
 */
export function getLevelsUntilUnlock(videoLevel: KumonLevel, childLevel: KumonLevel): number {
  if (isVideoUnlocked(videoLevel, childLevel)) {
    return 0
  }

  const childIndex = getLevelIndex(childLevel)
  const videoIndex = getLevelIndex(videoLevel)

  if (childIndex === -1 || videoIndex === -1) {
    return 999 // Not in main progression
  }

  return Math.max(0, videoIndex - childIndex - UNLOCK_BUFFER)
}

// ============================================
// Parent View Helpers
// ============================================

/**
 * Get the highest level among all children (for parent view unlocking)
 * In parent view, content should be unlocked based on the most advanced child
 */
export function getHighestChildLevel(
  children: Array<{ current_level: string }>
): KumonLevel {
  if (!children || children.length === 0) {
    return '7A' // Default to lowest level
  }

  let highestIndex = 0
  for (const child of children) {
    const index = LEVEL_ORDER.indexOf(child.current_level as KumonLevel)
    if (index > highestIndex) {
      highestIndex = index
    }
  }

  return LEVEL_ORDER[highestIndex]
}

// ============================================
// Category Unlock Logic
// ============================================

/**
 * Check if a category has ANY unlocked videos for a child
 * A category is "unlocked" if at least one of its levels is accessible
 */
export function isCategoryUnlocked(category: VideoCategory, childLevel: KumonLevel): boolean {
  const unlockedLevels = getUnlockedLevels(childLevel)
  return category.levels.some(level => unlockedLevels.includes(level as KumonLevel))
}

/**
 * Check if a category is "almost unlocked" (child is 1 level away)
 */
export function isCategoryAlmostUnlocked(category: VideoCategory, childLevel: KumonLevel): boolean {
  if (isCategoryUnlocked(category, childLevel)) {
    return false // Already unlocked
  }

  // Check if the first (lowest) level in the category is almost unlocked
  const firstLevel = category.levels[0] as KumonLevel
  return isAlmostUnlocked(firstLevel, childLevel)
}

/**
 * Get the level required to unlock a category
 * Returns null if already unlocked
 */
export function getCategoryUnlockRequirement(category: VideoCategory, childLevel: KumonLevel): KumonLevel | null {
  if (isCategoryUnlocked(category, childLevel)) {
    return null
  }

  // The category unlocks when the first level in it becomes accessible
  const firstLevel = category.levels[0] as KumonLevel
  return getUnlockRequirement(firstLevel, childLevel)
}

/**
 * Get all unlocked categories for a child
 */
export function getUnlockedCategories(childLevel: KumonLevel): VideoCategory[] {
  return VIDEO_CATEGORIES.filter(cat => isCategoryUnlocked(cat, childLevel))
}

/**
 * Get all locked categories for a child
 */
export function getLockedCategories(childLevel: KumonLevel): VideoCategory[] {
  return VIDEO_CATEGORIES.filter(cat => !isCategoryUnlocked(cat, childLevel))
}

/**
 * Get the count of unlocked videos in a category for a child
 * Returns { unlocked: number, total: number }
 */
export function getCategoryUnlockStats(
  categoryLevels: string[],
  childLevel: KumonLevel
): { unlocked: number; total: number } {
  const unlockedLevels = getUnlockedLevels(childLevel)
  const unlockedCount = categoryLevels.filter(level =>
    unlockedLevels.includes(level as KumonLevel)
  ).length

  return {
    unlocked: unlockedCount,
    total: categoryLevels.length
  }
}

// ============================================
// Unlock Celebration Logic
// ============================================

/**
 * Get newly unlocked levels when child advances from oldLevel to newLevel
 * Used to trigger unlock celebrations
 */
export function getNewlyUnlockedLevels(
  oldLevel: KumonLevel,
  newLevel: KumonLevel
): KumonLevel[] {
  const oldUnlocked = getUnlockedLevels(oldLevel)
  const newUnlocked = getUnlockedLevels(newLevel)

  // Return levels that are in newUnlocked but not in oldUnlocked
  return newUnlocked.filter(level => !oldUnlocked.includes(level))
}

/**
 * Get newly unlocked categories when child advances levels
 */
export function getNewlyUnlockedCategories(
  oldLevel: KumonLevel,
  newLevel: KumonLevel
): VideoCategory[] {
  const oldUnlockedCats = getUnlockedCategories(oldLevel)
  const newUnlockedCats = getUnlockedCategories(newLevel)

  // Return categories that are in newUnlockedCats but not in oldUnlockedCats
  const oldCatIds = new Set(oldUnlockedCats.map(c => c.id))
  return newUnlockedCats.filter(cat => !oldCatIds.has(cat.id))
}

/**
 * Check if advancing to a new level unlocks any new content
 */
export function hasNewUnlocks(oldLevel: KumonLevel, newLevel: KumonLevel): boolean {
  const newLevels = getNewlyUnlockedLevels(oldLevel, newLevel)
  return newLevels.length > 0
}

// ============================================
// Friendly Display Helpers
// ============================================

/**
 * Get a friendly name for a Kumon level
 * e.g., "4A" → "Level 4A", "C" → "Level C"
 */
export function getFriendlyLevelName(level: KumonLevel): string {
  return `Level ${level}`
}

/**
 * Get unlock message for a locked video
 */
export function getUnlockMessage(videoLevel: KumonLevel, childLevel: KumonLevel): string {
  const requirement = getUnlockRequirement(videoLevel, childLevel)
  if (!requirement) {
    return 'This video is unlocked!'
  }

  if (isAlmostUnlocked(videoLevel, childLevel)) {
    return `Almost there! Reach ${getFriendlyLevelName(requirement)} to unlock!`
  }

  return `Keep practicing to reach ${getFriendlyLevelName(requirement)} and unlock it!`
}
