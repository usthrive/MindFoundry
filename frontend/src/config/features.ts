/**
 * Feature Configuration
 * Central definition of all features and their tier requirements
 *
 * This file provides constants for feature IDs and tier hierarchy.
 * The actual feature-to-tier mappings are stored in the database
 * and fetched at runtime, allowing admin to modify without code changes.
 *
 * These constants are used for:
 * - Type safety when referencing features
 * - Fallback when database is unavailable
 * - Development and testing
 */

import type { SubscriptionTierId, FeatureCategory } from '@/types'

// ============================================
// Feature IDs - Add new features here as you build them
// ============================================

export const FEATURES = {
  // Core Features (Foundation tier - included in all)
  BASIC_HINTS: 'basic_hints',
  PROGRESS_TRACKING: 'progress_tracking',
  ANIMATIONS: 'animations',
  PARENT_DASHBOARD: 'parent_dashboard',
  VIDEO_LESSONS: 'video_lessons',

  // AI Features (Foundation AI tier)
  AI_HINTS: 'ai_hints',
  AI_EXPLANATIONS: 'ai_explanations',
  VOICE_ASSISTANT: 'voice_assistant',
  PERSONALIZED_PATH: 'personalized_path',
  AI_PROBLEM_GENERATOR: 'ai_problem_generator',

  // Premium Features (VIP tier)
  LIVE_TUTOR: 'live_tutor',
  PRIORITY_SUPPORT: 'priority_support',
  CUSTOM_CURRICULUM: 'custom_curriculum',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  OFFLINE_MODE: 'offline_mode',
} as const

export type FeatureId = typeof FEATURES[keyof typeof FEATURES]

// ============================================
// Tier Hierarchy
// ============================================

export const TIER_LEVELS: Record<SubscriptionTierId, number> = {
  foundation: 1,
  foundation_ai: 2,
  vip: 3,
}

export const TIER_NAMES: Record<SubscriptionTierId, string> = {
  foundation: 'Foundation',
  foundation_ai: 'Foundation AI',
  vip: 'VIP',
}

// ============================================
// Feature Categories for UI grouping
// ============================================

export const FEATURE_CATEGORIES: Record<FeatureCategory, { name: string; description: string; icon: string }> = {
  core: {
    name: 'Core Features',
    description: 'Essential features included in all plans',
    icon: '🎯',
  },
  ai: {
    name: 'AI Features',
    description: 'AI-powered learning enhancements',
    icon: '🤖',
  },
  premium: {
    name: 'Premium Features',
    description: 'Advanced features for premium subscribers',
    icon: '⭐',
  },
  support: {
    name: 'Support Features',
    description: 'Support and assistance options',
    icon: '🛟',
  },
  general: {
    name: 'General Features',
    description: 'Other platform features',
    icon: '📦',
  },
}

// ============================================
// Fallback Feature-Tier Mappings
// Used when database is unavailable
// ============================================

export const DEFAULT_FEATURE_TIERS: Record<FeatureId, SubscriptionTierId> = {
  // Core features - Foundation
  [FEATURES.BASIC_HINTS]: 'foundation',
  [FEATURES.PROGRESS_TRACKING]: 'foundation',
  [FEATURES.ANIMATIONS]: 'foundation',
  [FEATURES.PARENT_DASHBOARD]: 'foundation',
  [FEATURES.VIDEO_LESSONS]: 'foundation',

  // AI features - Foundation AI
  [FEATURES.AI_HINTS]: 'foundation_ai',
  [FEATURES.AI_EXPLANATIONS]: 'foundation_ai',
  [FEATURES.VOICE_ASSISTANT]: 'foundation_ai',
  [FEATURES.PERSONALIZED_PATH]: 'foundation_ai',
  [FEATURES.AI_PROBLEM_GENERATOR]: 'foundation_ai',

  // Premium features - VIP
  [FEATURES.LIVE_TUTOR]: 'vip',
  [FEATURES.PRIORITY_SUPPORT]: 'vip',
  [FEATURES.CUSTOM_CURRICULUM]: 'vip',
  [FEATURES.ADVANCED_ANALYTICS]: 'vip',
  [FEATURES.OFFLINE_MODE]: 'vip',
}

// ============================================
// Feature Metadata for UI
// ============================================

export interface FeatureMetadata {
  id: FeatureId
  name: string
  description: string
  category: FeatureCategory
  icon: string
  previewAvailable: boolean
}

export const FEATURE_METADATA: Record<FeatureId, FeatureMetadata> = {
  [FEATURES.BASIC_HINTS]: {
    id: FEATURES.BASIC_HINTS,
    name: 'Basic Hints',
    description: 'Static hint cards for problem solving',
    category: 'core',
    icon: '💡',
    previewAvailable: false,
  },
  [FEATURES.PROGRESS_TRACKING]: {
    id: FEATURES.PROGRESS_TRACKING,
    name: 'Progress Tracking',
    description: 'Track learning progress and worksheet completion',
    category: 'core',
    icon: '📊',
    previewAvailable: false,
  },
  [FEATURES.ANIMATIONS]: {
    id: FEATURES.ANIMATIONS,
    name: 'Animations',
    description: 'Visual animations for math concepts',
    category: 'core',
    icon: '🎬',
    previewAvailable: false,
  },
  [FEATURES.PARENT_DASHBOARD]: {
    id: FEATURES.PARENT_DASHBOARD,
    name: 'Parent Dashboard',
    description: 'Dashboard for parents to monitor progress',
    category: 'core',
    icon: '👨‍👩‍👧',
    previewAvailable: false,
  },
  [FEATURES.VIDEO_LESSONS]: {
    id: FEATURES.VIDEO_LESSONS,
    name: 'Video Lessons',
    description: 'Pre-recorded instructional videos',
    category: 'core',
    icon: '🎥',
    previewAvailable: false,
  },
  [FEATURES.AI_HINTS]: {
    id: FEATURES.AI_HINTS,
    name: 'AI Hints',
    description: 'AI-generated contextual hints based on specific mistakes',
    category: 'ai',
    icon: '🤖',
    previewAvailable: true,
  },
  [FEATURES.AI_EXPLANATIONS]: {
    id: FEATURES.AI_EXPLANATIONS,
    name: 'AI Explanations',
    description: 'AI explains why an answer is wrong and how to fix it',
    category: 'ai',
    icon: '🧠',
    previewAvailable: true,
  },
  [FEATURES.VOICE_ASSISTANT]: {
    id: FEATURES.VOICE_ASSISTANT,
    name: 'Voice Assistant',
    description: 'Voice-based help for reading problems and hints',
    category: 'ai',
    icon: '🎤',
    previewAvailable: false,
  },
  [FEATURES.PERSONALIZED_PATH]: {
    id: FEATURES.PERSONALIZED_PATH,
    name: 'Personalized Learning',
    description: 'AI adjusts difficulty based on performance',
    category: 'ai',
    icon: '🎯',
    previewAvailable: false,
  },
  [FEATURES.AI_PROBLEM_GENERATOR]: {
    id: FEATURES.AI_PROBLEM_GENERATOR,
    name: 'AI Problem Generator',
    description: 'Generate custom practice problems',
    category: 'ai',
    icon: '✨',
    previewAvailable: false,
  },
  [FEATURES.LIVE_TUTOR]: {
    id: FEATURES.LIVE_TUTOR,
    name: 'Live Tutor',
    description: 'Access to human tutors via chat or video',
    category: 'premium',
    icon: '👨‍🏫',
    previewAvailable: false,
  },
  [FEATURES.PRIORITY_SUPPORT]: {
    id: FEATURES.PRIORITY_SUPPORT,
    name: 'Priority Support',
    description: 'Fast response times for support requests',
    category: 'support',
    icon: '⚡',
    previewAvailable: false,
  },
  [FEATURES.CUSTOM_CURRICULUM]: {
    id: FEATURES.CUSTOM_CURRICULUM,
    name: 'Custom Curriculum',
    description: 'Create custom problem sets and learning paths',
    category: 'premium',
    icon: '📝',
    previewAvailable: false,
  },
  [FEATURES.ADVANCED_ANALYTICS]: {
    id: FEATURES.ADVANCED_ANALYTICS,
    name: 'Advanced Analytics',
    description: 'Detailed performance analytics and reports',
    category: 'premium',
    icon: '📈',
    previewAvailable: false,
  },
  [FEATURES.OFFLINE_MODE]: {
    id: FEATURES.OFFLINE_MODE,
    name: 'Offline Mode',
    description: 'Download content for offline learning',
    category: 'premium',
    icon: '📱',
    previewAvailable: false,
  },
}

// ============================================
// Helper Functions
// ============================================

/**
 * Check if tier A is equal to or higher than tier B
 */
export function tierIncludesFeature(userTier: SubscriptionTierId, requiredTier: SubscriptionTierId): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier]
}

/**
 * Get all features available at a given tier (fallback)
 */
export function getFeaturesByTier(tier: SubscriptionTierId): FeatureId[] {
  return Object.entries(DEFAULT_FEATURE_TIERS)
    .filter(([_, requiredTier]) => tierIncludesFeature(tier, requiredTier))
    .map(([featureId]) => featureId as FeatureId)
}

/**
 * Get the minimum tier required for a feature (fallback)
 */
export function getRequiredTier(featureId: FeatureId): SubscriptionTierId {
  return DEFAULT_FEATURE_TIERS[featureId]
}

/**
 * Get feature metadata
 */
export function getFeatureMetadata(featureId: FeatureId): FeatureMetadata {
  return FEATURE_METADATA[featureId]
}

/**
 * Get all features in a category
 */
export function getFeaturesByCategory(category: FeatureCategory): FeatureMetadata[] {
  return Object.values(FEATURE_METADATA).filter(f => f.category === category)
}
