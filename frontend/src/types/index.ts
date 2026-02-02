// Core types for MindFoundry

// Export achievement types
export * from './achievements';

// Export homework helper & exam prep types
export * from './homework';

export type KumonLevel = '7A' | '6A' | '5A' | '4A' | '3A' | '2A' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'XV' | 'XM' | 'XP' | 'XS';

export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type ProblemFormat = 'horizontal' | 'vertical';

export type AgeGroup = 'preK' | 'grade1_2' | 'grade3_5' | 'grade5_6' | 'middle_school';

export type Tier = 'free' | 'basic' | 'plus' | 'premium';

// Hint System Types (Phase 1.8.2)
export type HintLevel = 'micro' | 'visual' | 'teaching';

export interface HintData {
  level: HintLevel;
  text: string;
  animationId?: string;
  duration?: number;
}

export interface ProblemHints {
  micro: HintData;
  visual: HintData;
  teaching: HintData;
}

// Problem structure
export interface Problem {
  id: string;
  type: MathOperation;
  level: KumonLevel;
  operands: number[];
  correctAnswer: number;
  displayFormat: ProblemFormat;
  difficulty: number; // 1-10 scale
  missingPosition?: number; // For missing addend/subtrahend problems (0-based index)
  graduatedHints?: ProblemHints; // 3-level graduated hint system
}

// Child profile
export interface Child {
  id: string;
  userId: string; // Parent's user ID
  name: string;
  age: number;
  gradeLevel: number;
  avatar: string; // Emoji
  currentLevel: KumonLevel;
  tier: Tier;
  streak: number;
  totalProblems: number;
  createdAt: string;
  updatedAt: string;
}

// Session configuration
export interface SessionConfig {
  ageGroup: AgeGroup;
  sessionDuration: number; // minutes
  problemsPerSession: number;
  brainBreakAt: number; // percentage (0-100)
}

// Practice session
export interface PracticeSession {
  id: string;
  childId: string;
  sessionNumber: 1 | 2; // First or second session of the day
  startedAt: string;
  completedAt?: string;
  problemsCompleted: number;
  problemsCorrect: number;
  timeSpent: number; // seconds
  status: 'in_progress' | 'completed' | 'abandoned';
}

// Problem attempt
export interface ProblemAttempt {
  id: string;
  sessionId: string;
  problemId: string;
  problem: Problem;
  studentAnswer: string;
  isCorrect: boolean;
  attemptNumber: number;
  timeSpent: number; // seconds
  hintsUsed: number;
  misconceptionDetected?: string;
  createdAt: string;
}

// Daily practice tracking
export interface DailyPractice {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  session1Completed: boolean;
  session2Completed: boolean;
  totalProblems: number;
  totalCorrect: number;
  totalTime: number; // seconds
  streakDay: number;
}

// Mastery status
export interface MasteryStatus {
  id: string;
  childId: string;
  level: KumonLevel;
  topic: MathOperation;
  masteryPercentage: number; // 0-100
  problemsAttempted: number;
  problemsCorrect: number;
  lastPracticed?: string;
  achievedAt?: string;
}

// Feedback types
export type FeedbackType = 'correct' | 'incorrect' | 'hint' | 'encouragement';

export interface Feedback {
  type: FeedbackType;
  message: string;
  animation?: string;
  audioUrl?: string;
}

// Session state
export interface SessionState {
  currentSession: PracticeSession | null;
  currentProblem: Problem | null;
  currentProblemIndex: number;
  problems: Problem[];
  attempts: ProblemAttempt[];
  studentAnswer: string;
  feedback: Feedback | null;
  showBrainBreak: boolean;
}

// ============================================
// YouTube Video Integration Types
// ============================================

export type VideoTier = 'short' | 'detailed';

export type VideoTriggerType =
  | 'concept_intro'      // New concept introduction
  | 'struggle_detected'  // 3+ wrong answers
  | 'explicit_request'   // Help menu or button click
  | 'review_mode'        // Post-session review
  | 'parent_view';       // Parent dashboard preview

export type VideoFeedback = 'helpful' | 'not_helpful' | 'skipped';

export type TeachingStyle =
  | 'song'
  | 'animation'
  | 'whiteboard'
  | 'visual_model'
  | 'lecture'
  | 'demonstration'
  | 'drill';

// Video language codes (ISO 639-1)
export type VideoLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'ja' | 'ko' | 'pt';

// Video metadata from video_library table
export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
  tier: VideoTier;
  minAge: number;
  maxAge: number;
  kumonLevel: string;
  scoreOverall: number | null;
  teachingStyle: TeachingStyle | null;
  isActive: boolean;
  language?: VideoLanguage; // ISO 639-1 language code (default: 'en')
}

// Concept-to-video mapping from concept_videos table
export interface ConceptVideo {
  id: string;
  conceptId: string;
  conceptName: string;
  kumonLevel: string;
  shortVideoId: string | null;
  detailedVideoId: string | null;
  showAtIntroduction: boolean;
  showInHints: boolean;
  showInHelpMenu: boolean;
}

// Video view record from video_views table
export interface VideoView {
  id: string;
  childId: string;
  videoId: string;
  conceptId: string;
  triggerType: VideoTriggerType;
  sessionId: string | null;
  startedAt: string;
  endedAt: string | null;
  watchDurationSeconds: number;
  completionPercentage: number;
  userFeedback: VideoFeedback | null;
  accuracyBeforeVideo: number | null;
  accuracyAfterVideo: number | null;
}

// Video preferences from video_preferences table
export interface VideoPreferences {
  id: string;
  childId: string;
  videosEnabled: boolean;
  autoSuggestEnabled: boolean;
  suggestThreshold: number;
  showInConceptIntro: boolean;
  showInReview: boolean;
  maxVideosPerDay: number;
  maxVideoDurationMinutes: number;
  suggestionsDismissedToday: number;
  videosWatchedToday: number;
}

// Video suggestion for UI components
export interface VideoSuggestion {
  video: Video;
  conceptId: string;
  conceptName: string;
  triggerType: VideoTriggerType;
  reason: string;
  urgency: 'gentle' | 'suggested' | 'recommended';
  message: string;
}

// Video analytics for parent dashboard
export interface VideoAnalytics {
  totalVideosWatched: number;
  totalMinutesWatched: number;
  averageCompletion: number;
  videosWatchedThisWeek: number;
  minutesWatchedThisWeek: number;
  mostHelpfulVideos: Array<{
    video: Video;
    timesWatched: number;
    averageCompletion: number;
    helpfulRating: number;
  }>;
  conceptsReviewed: string[];
  videosByTriggerType: Record<VideoTriggerType, number>;
}

// Video effectiveness data
export interface VideoEffectiveness {
  videoId: string;
  childId: string;
  conceptId: string;
  accuracyBefore: number;
  accuracyAfter: number;
  improvement: number;
  wasHelpful: boolean;
}

// ============================================
// Subscription System Types
// ============================================

export type SubscriptionStatus = 'free_period' | 'grace_period' | 'active' | 'expired' | 'cancelled';

export type SubscriptionTierId = 'foundation' | 'foundation_ai' | 'vip';

export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  description: string;
  enabled: boolean;
  monthlyPriceCents: number;
  annualPriceCents: number;
  stripeMonthlyPriceId: string | null;
  stripeAnnualPriceId: string | null;
  features: string[];
  displayOrder: number;
}

export interface UserSubscription {
  status: SubscriptionStatus;
  tier: SubscriptionTierId | null;
  billingCycle: BillingCycle | null;
  freePeriodEndsAt: string | null;
  gracePeriodEndsAt: string | null;
  currentPeriodEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  isFoundingSupporter: boolean;
  scholarshipCode: string | null;
  nudgesSent: Record<string, { sent: boolean; sentAt: string }>;
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  tier: SubscriptionTier | null;
  daysRemaining: number;
  daysSinceSignup: number;
  isInFreePeriod: boolean;
  isInGracePeriod: boolean;
  isActive: boolean;
  isExpired: boolean;
  canAccessApp: boolean;
  isFoundingSupporter: boolean;
  currentNudgeDay: number | null;
  shouldShowNudge: boolean;
  nudgeType: 'progress' | 'story' | 'reflection' | 'pricing_annual' | 'pricing_full' | 'grace' | null;
}

export interface ScholarshipRequest {
  id: string;
  userId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  couponCode: string | null;
  createdAt: string;
}

// Nudge schedule configuration
export interface NudgeConfig {
  day: number;
  type: 'progress' | 'story' | 'reflection' | 'pricing_annual' | 'pricing_full' | 'grace';
  showPricing: boolean;
  pricingType: 'none' | 'annual' | 'both';
}

export const NUDGE_SCHEDULE: NudgeConfig[] = [
  { day: 45, type: 'progress', showPricing: false, pricingType: 'none' },
  { day: 48, type: 'story', showPricing: false, pricingType: 'none' },
  { day: 52, type: 'reflection', showPricing: false, pricingType: 'none' },
  { day: 53, type: 'pricing_annual', showPricing: true, pricingType: 'annual' },
  { day: 56, type: 'pricing_full', showPricing: true, pricingType: 'both' },
  { day: 60, type: 'grace', showPricing: true, pricingType: 'both' },
  { day: 63, type: 'grace', showPricing: true, pricingType: 'both' },
  { day: 66, type: 'grace', showPricing: true, pricingType: 'both' },
  { day: 67, type: 'grace', showPricing: true, pricingType: 'both' },
];

// ============================================
// Feature Management Types
// ============================================

export type FeatureCategory = 'core' | 'ai' | 'premium' | 'support' | 'general';

export type FeatureLimitPeriod = 'daily' | 'weekly' | 'monthly' | null;

export interface Feature {
  id: string;
  name: string;
  description: string | null;
  category: FeatureCategory;
  isActive: boolean;
  previewAvailable: boolean;
  displayOrder: number;
  icon: string | null;
}

export interface FeatureTierMapping {
  id: string;
  featureId: string;
  tierId: SubscriptionTierId;
  isEnabled: boolean;
  usageLimit: number | null;
  limitPeriod: FeatureLimitPeriod;
}

export interface FeatureUsage {
  id: string;
  userId: string;
  featureId: string;
  usageCount: number;
  periodStart: string;
  periodEnd: string;
}

// Combined view for easier querying
export interface TierFeature {
  tierId: SubscriptionTierId;
  tierName: string;
  featureId: string;
  featureName: string;
  featureDescription: string | null;
  category: FeatureCategory;
  icon: string | null;
  featureActive: boolean;
  previewAvailable: boolean;
  displayOrder: number;
  isEnabled: boolean;
  usageLimit: number | null;
  limitPeriod: FeatureLimitPeriod;
}

// Feature access check result
export interface FeatureAccessResult {
  hasAccess: boolean;
  reason: 'granted' | 'tier_required' | 'feature_disabled' | 'usage_exceeded' | 'not_authenticated';
  requiredTier?: SubscriptionTierId;
  previewAvailable?: boolean;
  usageRemaining?: number;
}
