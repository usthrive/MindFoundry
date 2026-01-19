/**
 * Celebration Trigger Service
 * Detects when achievements should be awarded based on session results and child progress
 */

import {
  Achievement,
  StreakMilestoneData,
  LevelCompleteData,
  SkillMasteryData,
  PerfectSessionData,
  SpeedMilestoneData,
  ProblemsMilestoneData,
  FirstProblemData,
} from '@/types/achievements';
import { PracticeSession, MasteryStatus, Child, KumonLevel } from '@/types';
import { achievementService } from './achievementService';

// ============================================
// Session Result Interface
// ============================================

export interface SessionResult {
  session: PracticeSession;
  child: Child;
  dailyStreak: number;
  masteryStatuses: MasteryStatus[];
  isFirstProblem: boolean;
  levelCompleted: boolean;
  previousLevel?: KumonLevel;
}

// ============================================
// Achievement Detection
// ============================================

/**
 * Streak milestone thresholds
 */
const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

/**
 * Problems milestone thresholds
 */
const PROBLEMS_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000];

/**
 * Target time multiplier for speed achievement (problems per minute)
 */
const SPEED_TARGET = 2; // 2 problems per minute is the target

/**
 * Check for all possible achievements after a session
 */
export async function checkForAchievements(result: SessionResult): Promise<Achievement[]> {
  const achievements: Achievement[] = [];

  // Run all achievement checks in parallel
  const checks = await Promise.all([
    checkFirstProblem(result),
    checkStreakMilestone(result),
    checkLevelComplete(result),
    checkSkillMastery(result),
    checkPerfectSession(result),
    checkSpeedMilestone(result),
    checkProblemsMilestone(result),
  ]);

  // Flatten and filter out nulls
  for (const check of checks) {
    if (Array.isArray(check)) {
      achievements.push(...check);
    } else if (check) {
      achievements.push(check);
    }
  }

  return achievements;
}

/**
 * Check for first problem achievement
 */
async function checkFirstProblem(result: SessionResult): Promise<Achievement | null> {
  if (!result.isFirstProblem) return null;

  // Check if already has this achievement
  const hasIt = await achievementService.hasAchievement(
    result.child.id,
    'first_problem'
  );

  if (hasIt) return null;

  const data: FirstProblemData = {
    problem_type: 'math',
  };

  return achievementService.createAchievement(
    result.child.id,
    'first_problem',
    data
  );
}

/**
 * Check for streak milestones
 */
async function checkStreakMilestone(result: SessionResult): Promise<Achievement | null> {
  const streak = result.dailyStreak;

  // Find the highest milestone achieved
  const milestone = STREAK_MILESTONES.filter(m => streak >= m).pop();

  if (!milestone) return null;

  // Check if already has this milestone
  const hasIt = await achievementService.hasAchievement(
    result.child.id,
    'streak_milestone',
    { streak_count: milestone }
  );

  if (hasIt) return null;

  const data: StreakMilestoneData = {
    streak_count: milestone,
  };

  return achievementService.createAchievement(
    result.child.id,
    'streak_milestone',
    data
  );
}

/**
 * Check for level completion
 */
async function checkLevelComplete(result: SessionResult): Promise<Achievement | null> {
  if (!result.levelCompleted || !result.previousLevel) return null;

  // Check if already has this achievement for this level
  const hasIt = await achievementService.hasAchievement(
    result.child.id,
    'level_complete',
    { level: result.previousLevel }
  );

  if (hasIt) return null;

  // Calculate accuracy for the level
  const levelMastery = result.masteryStatuses.find(
    m => m.level === result.previousLevel
  );

  const accuracy = levelMastery
    ? Math.round((levelMastery.problemsCorrect / levelMastery.problemsAttempted) * 100)
    : Math.round((result.session.problemsCorrect / result.session.problemsCompleted) * 100);

  const data: LevelCompleteData = {
    level: result.previousLevel,
    problems_completed: levelMastery?.problemsAttempted || result.session.problemsCompleted,
    accuracy,
  };

  return achievementService.createAchievement(
    result.child.id,
    'level_complete',
    data
  );
}

/**
 * Check for skill mastery (90%+ on a topic)
 */
async function checkSkillMastery(result: SessionResult): Promise<Achievement[]> {
  const achievements: Achievement[] = [];

  for (const mastery of result.masteryStatuses) {
    // Check if reached 90%+ mastery
    if (mastery.masteryPercentage < 90) continue;

    // Check if already has this achievement
    const hasIt = await achievementService.hasAchievement(
      result.child.id,
      'skill_mastery',
      { skill: mastery.topic, level: mastery.level }
    );

    if (hasIt) continue;

    const data: SkillMasteryData = {
      skill: mastery.topic,
      mastery_pct: Math.round(mastery.masteryPercentage),
      level: mastery.level,
    };

    const achievement = await achievementService.createAchievement(
      result.child.id,
      'skill_mastery',
      data
    );

    if (achievement) {
      achievements.push(achievement);
    }
  }

  return achievements;
}

/**
 * Check for perfect session (100% accuracy)
 */
async function checkPerfectSession(result: SessionResult): Promise<Achievement | null> {
  const { session } = result;

  // Need at least 5 problems to count as a "session"
  if (session.problemsCompleted < 5) return null;

  // Check for 100% accuracy
  if (session.problemsCorrect !== session.problemsCompleted) return null;

  const data: PerfectSessionData = {
    session_id: session.id,
    problems_count: session.problemsCompleted,
    time_spent: session.timeSpent,
  };

  return achievementService.createAchievement(
    result.child.id,
    'perfect_session',
    data
  );
}

/**
 * Check for speed milestone (completing problems faster than target)
 */
async function checkSpeedMilestone(result: SessionResult): Promise<Achievement | null> {
  const { session } = result;

  // Need at least 10 problems
  if (session.problemsCompleted < 10) return null;

  // Calculate problems per minute
  const minutes = session.timeSpent / 60;
  const problemsPerMinute = session.problemsCompleted / minutes;

  // Check if faster than target
  if (problemsPerMinute < SPEED_TARGET) return null;

  // Also need good accuracy (at least 80%)
  const accuracy = session.problemsCorrect / session.problemsCompleted;
  if (accuracy < 0.8) return null;

  const targetTime = (session.problemsCompleted / SPEED_TARGET) * 60;

  const data: SpeedMilestoneData = {
    target_time: targetTime,
    actual_time: session.timeSpent,
    problems_count: session.problemsCompleted,
  };

  return achievementService.createAchievement(
    result.child.id,
    'speed_milestone',
    data
  );
}

/**
 * Check for problems completed milestones
 */
async function checkProblemsMilestone(result: SessionResult): Promise<Achievement | null> {
  const totalProblems = result.child.totalProblems;

  // Find the highest milestone achieved
  const milestone = PROBLEMS_MILESTONES.filter(m => totalProblems >= m).pop();

  if (!milestone) return null;

  // Check if already has this milestone
  const hasIt = await achievementService.hasAchievement(
    result.child.id,
    'problems_milestone',
    { milestone }
  );

  if (hasIt) return null;

  const data: ProblemsMilestoneData = {
    total_problems: totalProblems,
    milestone,
  };

  return achievementService.createAchievement(
    result.child.id,
    'problems_milestone',
    data
  );
}

// ============================================
// Quick Achievement Triggers
// (For immediate triggers during gameplay)
// ============================================

/**
 * Trigger for first correct answer
 */
export async function triggerFirstCorrectAnswer(
  childId: string,
  problemType: string
): Promise<Achievement | null> {
  const hasIt = await achievementService.hasAchievement(childId, 'first_problem');
  if (hasIt) return null;

  const data: FirstProblemData = {
    problem_type: problemType,
  };

  return achievementService.createAchievement(childId, 'first_problem', data);
}

/**
 * Trigger for streak update
 */
export async function triggerStreakUpdate(
  childId: string,
  newStreak: number
): Promise<Achievement | null> {
  const milestone = STREAK_MILESTONES.find(m => m === newStreak);
  if (!milestone) return null;

  const data: StreakMilestoneData = {
    streak_count: milestone,
  };

  return achievementService.createAchievement(childId, 'streak_milestone', data);
}

// ============================================
// Export
// ============================================

export const celebrationTrigger = {
  checkForAchievements,
  triggerFirstCorrectAnswer,
  triggerStreakUpdate,
};

export default celebrationTrigger;
