// Achievement & Celebration Types for MindFoundry

// ============================================
// Achievement Types
// ============================================

/**
 * Types of achievements that can be earned
 */
export type AchievementType =
  | 'first_problem'      // First problem answered correctly
  | 'streak_milestone'   // Daily streak milestones (3, 7, 14, 30, 60, 100 days)
  | 'level_complete'     // Completed a Kumon level
  | 'skill_mastery'      // 90%+ mastery on a skill
  | 'perfect_session'    // 100% accuracy in a session
  | 'belt_earned'        // Earned a new belt rank
  | 'speed_milestone'    // Completed under target time
  | 'problems_milestone' // Total problems completed milestones
  | 'week_warrior'       // Practiced every day for a week
  | 'accuracy_champion'; // High accuracy over multiple sessions

/**
 * Celebration intensity levels
 * Determines animation duration and complexity
 */
export type CelebrationLevel = 'micro' | 'minor' | 'moderate' | 'major' | 'legendary';

/**
 * Celebration level configuration
 */
export interface CelebrationLevelConfig {
  level: CelebrationLevel;
  duration: number;        // milliseconds
  confettiCount: number;   // number of confetti particles
  soundEnabled: boolean;
  modalSize: 'small' | 'medium' | 'large' | 'fullscreen';
}

/**
 * Celebration level configurations
 */
export const CELEBRATION_CONFIGS: Record<CelebrationLevel, CelebrationLevelConfig> = {
  micro: {
    level: 'micro',
    duration: 1500,
    confettiCount: 20,
    soundEnabled: true,
    modalSize: 'small',
  },
  minor: {
    level: 'minor',
    duration: 4000,
    confettiCount: 50,
    soundEnabled: true,
    modalSize: 'medium',
  },
  moderate: {
    level: 'moderate',
    duration: 6500,
    confettiCount: 100,
    soundEnabled: true,
    modalSize: 'medium',
  },
  major: {
    level: 'major',
    duration: 10000,
    confettiCount: 200,
    soundEnabled: true,
    modalSize: 'large',
  },
  legendary: {
    level: 'legendary',
    duration: 13500,
    confettiCount: 500,
    soundEnabled: true,
    modalSize: 'fullscreen',
  },
};

/**
 * Achievement data variants based on achievement type
 */
export interface StreakMilestoneData {
  streak_count: number;
}

export interface LevelCompleteData {
  level: string;
  problems_completed: number;
  accuracy: number;
}

export interface SkillMasteryData {
  skill: string;
  mastery_pct: number;
  level: string;
}

export interface PerfectSessionData {
  session_id: string;
  problems_count: number;
  time_spent: number;
}

export interface BeltEarnedData {
  belt: string;
  belt_level: number;
}

export interface SpeedMilestoneData {
  target_time: number;
  actual_time: number;
  problems_count: number;
}

export interface ProblemsMilestoneData {
  total_problems: number;
  milestone: number;
}

export interface FirstProblemData {
  problem_type: string;
}

export type AchievementData =
  | StreakMilestoneData
  | LevelCompleteData
  | SkillMasteryData
  | PerfectSessionData
  | BeltEarnedData
  | SpeedMilestoneData
  | ProblemsMilestoneData
  | FirstProblemData;

/**
 * Achievement record stored in database
 */
export interface Achievement {
  id: string;
  childId: string;
  achievementType: AchievementType;
  achievementData: AchievementData;
  celebrationLevel: CelebrationLevel;
  earnedAt: string;
  shared: boolean;
  shareCount: number;
  createdAt: string;
}

/**
 * Achievement with display information
 */
export interface AchievementDisplay extends Achievement {
  title: string;
  description: string;
  icon: string;        // Emoji or icon name
  badgeColor: string;  // Tailwind color class
  quote?: string;      // Motivational quote
}

// ============================================
// Share Card Types
// ============================================

/**
 * Share card format types
 */
export type ShareCardFormat = 'square' | 'story' | 'wide';

/**
 * Share card dimensions
 */
export const SHARE_CARD_DIMENSIONS: Record<ShareCardFormat, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  wide: { width: 1200, height: 628 },
};

/**
 * Share card themes
 */
export type ShareCardTheme = 'default' | 'space' | 'ocean' | 'forest' | 'candy';

/**
 * Theme color configurations
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export const THEME_COLORS: Record<ShareCardTheme, ThemeColors> = {
  default: {
    primary: '#00B2A9',
    secondary: '#FFD966',
    background: '#F6F8FB',
    text: '#333333',
    accent: '#FF6F61',
  },
  space: {
    primary: '#7C3AED',
    secondary: '#F59E0B',
    background: '#1E1B4B',
    text: '#FFFFFF',
    accent: '#EC4899',
  },
  ocean: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    background: '#0C4A6E',
    text: '#FFFFFF',
    accent: '#22D3EE',
  },
  forest: {
    primary: '#22C55E',
    secondary: '#84CC16',
    background: '#14532D',
    text: '#FFFFFF',
    accent: '#FDE047',
  },
  candy: {
    primary: '#EC4899',
    secondary: '#F472B6',
    background: '#FDF2F8',
    text: '#831843',
    accent: '#A855F7',
  },
};

/**
 * Share card configuration
 */
export interface ShareCardConfig {
  achievement: Achievement;
  childAvatar: string;
  format: ShareCardFormat;
  theme: ShareCardTheme;
  showBranding: boolean;
  showQuote: boolean;
}

// ============================================
// Share Event Types
// ============================================

/**
 * Methods of sharing
 */
export type ShareMethod = 'parent' | 'save' | 'native_share' | 'copy_link';

/**
 * Share event record
 */
export interface ShareEvent {
  id: string;
  achievementId: string;
  childId: string;
  shareMethod: ShareMethod;
  cardFormat?: ShareCardFormat;
  cardTheme?: ShareCardTheme;
  sharedAt: string;
}

// ============================================
// Parent Notification Types
// ============================================

/**
 * Response types for parent encouragement
 */
export type ResponseType = 'encouragement' | 'reaction' | 'message';

/**
 * Predefined encouragement messages
 */
export const ENCOURAGEMENT_MESSAGES = [
  "Amazing job! I'm so proud of you!",
  "Keep up the great work!",
  "You're becoming a math superstar!",
  "Wow, that's incredible!",
  "I knew you could do it!",
  "You make me so happy!",
] as const;

/**
 * Predefined reactions
 */
export const REACTIONS = ['star', 'heart', 'thumbsup', 'clap', 'party', 'rocket'] as const;
export type ReactionEmoji = typeof REACTIONS[number];

/**
 * Parent notification record
 */
export interface ParentNotification {
  id: string;
  parentId: string;
  achievementId: string;
  childId: string;
  read: boolean;
  responded: boolean;
  responseType?: ResponseType;
  responseContent?: string;
  createdAt: string;
  readAt?: string;
  respondedAt?: string;
}

/**
 * Parent notification with achievement details
 */
export interface ParentNotificationWithAchievement extends ParentNotification {
  achievement: AchievementDisplay;
  childName: string;
  childAvatar: string;
}

// ============================================
// Celebration Config Types
// ============================================

/**
 * Per-child celebration configuration
 */
export interface CelebrationConfig {
  id: string;
  childId: string;
  celebrationsEnabled: boolean;
  soundEnabled: boolean;
  preferredTheme: ShareCardTheme;
  autoNotifyParent: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Celebration State Types
// ============================================

/**
 * Current celebration state for UI
 */
export interface CelebrationState {
  isActive: boolean;
  currentAchievement: AchievementDisplay | null;
  showShareOptions: boolean;
  shareCardGenerated: boolean;
  shareCardBlob?: Blob;
}

/**
 * Celebration context actions
 */
export interface CelebrationActions {
  triggerCelebration: (achievement: Achievement) => void;
  dismissCelebration: () => void;
  showSharePanel: () => void;
  hideSharePanel: () => void;
  generateShareCard: (format: ShareCardFormat, theme: ShareCardTheme) => Promise<Blob>;
  shareToParent: () => Promise<void>;
  saveToPhotos: () => Promise<void>;
  nativeShare: () => Promise<void>;
  copyLink: () => Promise<void>;
}

// ============================================
// Achievement Display Helpers
// ============================================

/**
 * Get display information for an achievement
 */
export function getAchievementDisplay(achievement: Achievement): AchievementDisplay {
  const baseDisplay = {
    ...achievement,
    title: '',
    description: '',
    icon: '',
    badgeColor: 'bg-primary',
  };

  switch (achievement.achievementType) {
    case 'first_problem':
      return {
        ...baseDisplay,
        title: 'First Step!',
        description: 'Solved your very first problem!',
        icon: '1',
        badgeColor: 'bg-green-500',
        quote: 'Every expert was once a beginner!',
      };

    case 'streak_milestone': {
      const data = achievement.achievementData as StreakMilestoneData;
      const streakTitles: Record<number, string> = {
        3: 'Hat Trick!',
        7: 'Week Warrior!',
        14: 'Two Week Champion!',
        30: 'Monthly Master!',
        60: 'Super Streak!',
        100: 'Legendary Learner!',
      };
      return {
        ...baseDisplay,
        title: streakTitles[data.streak_count] || `${data.streak_count} Day Streak!`,
        description: `Practiced for ${data.streak_count} days in a row!`,
        icon: 'flame',
        badgeColor: data.streak_count >= 30 ? 'bg-orange-500' : 'bg-yellow-500',
        quote: 'Consistency is the key to success!',
      };
    }

    case 'level_complete': {
      const data = achievement.achievementData as LevelCompleteData;
      return {
        ...baseDisplay,
        title: `Level ${data.level} Complete!`,
        description: `Completed ${data.problems_completed} problems with ${data.accuracy}% accuracy!`,
        icon: 'trophy',
        badgeColor: 'bg-blue-500',
        quote: 'Onwards and upwards!',
      };
    }

    case 'skill_mastery': {
      const data = achievement.achievementData as SkillMasteryData;
      return {
        ...baseDisplay,
        title: `${data.skill} Master!`,
        description: `Achieved ${data.mastery_pct}% mastery in ${data.skill}!`,
        icon: 'brain',
        badgeColor: 'bg-purple-500',
        quote: 'Knowledge is power!',
      };
    }

    case 'perfect_session': {
      const data = achievement.achievementData as PerfectSessionData;
      return {
        ...baseDisplay,
        title: 'Perfect Score!',
        description: `Got all ${data.problems_count} problems correct!`,
        icon: 'perfect',
        badgeColor: 'bg-pink-500',
        quote: 'Practice makes perfect!',
      };
    }

    case 'belt_earned': {
      const data = achievement.achievementData as BeltEarnedData;
      const beltColors: Record<string, string> = {
        white: 'bg-gray-100',
        yellow: 'bg-yellow-400',
        orange: 'bg-orange-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        brown: 'bg-amber-700',
        black: 'bg-gray-900',
      };
      return {
        ...baseDisplay,
        title: `${data.belt.charAt(0).toUpperCase() + data.belt.slice(1)} Belt Earned!`,
        description: `You've earned your ${data.belt} belt!`,
        icon: 'belt',
        badgeColor: beltColors[data.belt] || 'bg-gray-500',
        quote: 'Rising through the ranks!',
      };
    }

    case 'speed_milestone': {
      const data = achievement.achievementData as SpeedMilestoneData;
      // Rotating titles for variety - each speed milestone gets a fun, engaging message
      const speedTitles = [
        { title: 'Lightning Learner!', icon: 'bolt', quote: 'Fast and focused!' },
        { title: 'Swift Scholar!', icon: 'star', quote: 'Quick thinking pays off!' },
        { title: 'Turbo Thinker!', icon: 'rocket', quote: 'Zooming through math!' },
        { title: 'Speed Star!', icon: 'star', quote: 'Shining bright and fast!' },
        { title: 'Quick Calculator!', icon: 'calculator', quote: 'Numbers are your friends!' },
        { title: 'Blazing Brain!', icon: 'brain', quote: 'Your mind is amazing!' },
        { title: 'Rapid Genius!', icon: 'sparkles', quote: 'Brilliance at full speed!' },
        { title: 'Flash Finisher!', icon: 'sparkle', quote: 'Done in a flash!' },
      ];
      const selection = speedTitles[data.problems_count % speedTitles.length];
      return {
        ...baseDisplay,
        title: selection.title,
        description: `Completed ${data.problems_count} problems in ${Math.round(data.actual_time / 60)} minutes!`,
        icon: selection.icon,
        badgeColor: 'bg-cyan-500',
        quote: selection.quote,
      };
    }

    case 'problems_milestone': {
      const data = achievement.achievementData as ProblemsMilestoneData;
      return {
        ...baseDisplay,
        title: `${data.milestone} Problems Solved!`,
        description: `You've solved ${data.total_problems} problems total!`,
        icon: 'calculator',
        badgeColor: 'bg-indigo-500',
        quote: 'Every problem solved is progress!',
      };
    }

    default:
      return {
        ...baseDisplay,
        title: 'Achievement Unlocked!',
        description: 'You did something awesome!',
        icon: 'star',
        badgeColor: 'bg-primary',
      };
  }
}

/**
 * Get celebration level for an achievement type
 */
export function getCelebrationLevel(
  type: AchievementType,
  data: AchievementData
): CelebrationLevel {
  switch (type) {
    case 'first_problem':
      return 'micro';

    case 'streak_milestone': {
      const streakData = data as StreakMilestoneData;
      if (streakData.streak_count >= 100) return 'legendary';
      if (streakData.streak_count >= 60) return 'major';
      if (streakData.streak_count >= 30) return 'moderate';
      if (streakData.streak_count >= 7) return 'minor';
      return 'micro';
    }

    case 'level_complete':
      return 'moderate';

    case 'skill_mastery':
      return 'major';

    case 'perfect_session':
      return 'major';

    case 'belt_earned': {
      const beltData = data as BeltEarnedData;
      if (beltData.belt === 'black') return 'legendary';
      if (['brown', 'purple'].includes(beltData.belt)) return 'major';
      return 'moderate';
    }

    case 'speed_milestone':
      return 'moderate';

    case 'problems_milestone': {
      const problemsData = data as ProblemsMilestoneData;
      if (problemsData.milestone >= 10000) return 'legendary';
      if (problemsData.milestone >= 1000) return 'major';
      if (problemsData.milestone >= 100) return 'moderate';
      return 'minor';
    }

    default:
      return 'micro';
  }
}
