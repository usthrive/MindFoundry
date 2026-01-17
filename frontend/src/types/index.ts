// Core types for MindFoundry

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
