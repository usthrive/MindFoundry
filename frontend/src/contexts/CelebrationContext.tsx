/**
 * Celebration Context
 * Manages global celebration state for achievements
 * Simplified to use native share only
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  Achievement,
  AchievementDisplay,
  CelebrationConfig,
  getAchievementDisplay,
  CELEBRATION_CONFIGS,
} from '@/types/achievements';
import { achievementService } from '@/services/achievements';
import { useAuth } from './AuthContext';

// ============================================
// Context Types
// ============================================

interface CelebrationState {
  isActive: boolean;
  currentAchievement: AchievementDisplay | null;
  isSharing: boolean;
}

interface CelebrationActions {
  triggerCelebration: (achievement: Achievement) => void;
  dismissCelebration: () => void;
  shareAchievement: () => Promise<void>;
}

interface CelebrationContextType extends CelebrationState, CelebrationActions {
  config: CelebrationConfig | null;
  pendingAchievements: AchievementDisplay[];
  celebrationQueue: Achievement[];
}

const defaultState: CelebrationState = {
  isActive: false,
  currentAchievement: null,
  isSharing: false,
};

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface CelebrationProviderProps {
  children: ReactNode;
}

export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const { currentChild } = useAuth();

  // State
  const [state, setState] = useState<CelebrationState>(defaultState);
  const [config, setConfig] = useState<CelebrationConfig | null>(null);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [pendingAchievements, setPendingAchievements] = useState<AchievementDisplay[]>([]);

  // Load celebration config when child changes
  const loadConfig = useCallback(async () => {
    if (!currentChild) {
      setConfig(null);
      return;
    }

    const childConfig = await achievementService.getCelebrationConfig(currentChild.id);
    setConfig(childConfig);
  }, [currentChild]);

  // Effect to load config when child changes
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // ============================================
  // Actions
  // ============================================

  /**
   * Trigger a celebration for an achievement
   */
  const triggerCelebration = useCallback((achievement: Achievement) => {
    // Check if celebrations are enabled
    if (config && !config.celebrationsEnabled) {
      // Still track the achievement but don't show celebration
      const display = getAchievementDisplay(achievement);
      setPendingAchievements(prev => [...prev, display]);
      return;
    }

    // Add to queue if a celebration is already active
    if (state.isActive) {
      setCelebrationQueue(prev => [...prev, achievement]);
      return;
    }

    // Show the celebration
    const display = getAchievementDisplay(achievement);
    setState({
      isActive: true,
      currentAchievement: display,
      isSharing: false,
    });

    // Auto-dismiss based on celebration level
    const celebrationConfig = CELEBRATION_CONFIGS[achievement.celebrationLevel];
    const autoDismissTimer = setTimeout(() => {
      // Don't auto-dismiss if sharing is in progress
      setState(prev => {
        if (prev.isSharing) return prev;
        return { ...prev, isActive: false };
      });
    }, celebrationConfig.duration + 2000); // Extra 2 seconds for user to interact

    // Cleanup on unmount
    return () => clearTimeout(autoDismissTimer);
  }, [config, state.isActive]);

  /**
   * Dismiss the current celebration
   */
  const dismissCelebration = useCallback(() => {
    setState(defaultState);

    // Process next in queue
    if (celebrationQueue.length > 0) {
      const [next, ...rest] = celebrationQueue;
      setCelebrationQueue(rest);

      // Small delay before showing next
      setTimeout(() => {
        triggerCelebration(next);
      }, 500);
    }
  }, [celebrationQueue, triggerCelebration]);

  /**
   * Share achievement - generates card and uses native share
   */
  const shareAchievement = useCallback(async () => {
    if (!state.currentAchievement || !currentChild) {
      throw new Error('No achievement or child selected');
    }

    setState(prev => ({ ...prev, isSharing: true }));

    try {
      // Import the share card generator dynamically to reduce bundle size
      const { generateShareCardBlob } = await import('@/services/achievements/shareCardGenerator');

      // Generate the share card
      const blob = await generateShareCardBlob({
        achievement: state.currentAchievement,
        childAvatar: currentChild.avatar,
      });

      // Check if Web Share API is available with files support
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'mindfoundry-achievement.png', { type: 'image/png' });
        const shareData = {
          title: state.currentAchievement.title,
          text: `I earned "${state.currentAchievement.title}" on MindFoundry! ${state.currentAchievement.description}`,
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);

          // Record share event
          await achievementService.recordShareEvent(
            state.currentAchievement.id,
            currentChild.id,
            'native_share'
          );

          return;
        }
      }

      // Fallback: download the image if native share not supported
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindfoundry-achievement-${state.currentAchievement.achievementType}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record share event as save
      await achievementService.recordShareEvent(
        state.currentAchievement.id,
        currentChild.id,
        'save'
      );
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
        throw error;
      }
    } finally {
      setState(prev => ({ ...prev, isSharing: false }));
    }
  }, [state.currentAchievement, currentChild]);

  // ============================================
  // Context Value
  // ============================================

  const contextValue: CelebrationContextType = {
    // State
    ...state,
    config,
    pendingAchievements,
    celebrationQueue,

    // Actions
    triggerCelebration,
    dismissCelebration,
    shareAchievement,
  };

  return (
    <CelebrationContext.Provider value={contextValue}>
      {children}
    </CelebrationContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (context === undefined) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
}

export default CelebrationContext;
