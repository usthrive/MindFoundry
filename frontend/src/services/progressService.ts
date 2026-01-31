import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import type { KumonLevel } from '@/types'
import { LEVEL_ORDER } from './generators/types'

type Child = Database['public']['Tables']['children']['Row']

// ============================================
// SCT (Standard Completion Time) Configuration
// ============================================

/**
 * Standard Completion Time (SCT) in seconds by Kumon level
 *
 * These are for a SINGLE PAGE (10 problems) - half of a full Kumon worksheet.
 * Full Kumon worksheets have sides a and b (20 problems total).
 * Times based on official Kumon SCT charts (halved for single page).
 *
 * See: /Requirements/KUMON-SCT-TIMING-REFERENCE.md
 */
export const SCT_BY_LEVEL: Record<string, { min: number; target: number; max: number }> = {
  // Pre-K (not timed officially, set generous defaults)
  '7A': { min: 60, target: 120, max: 300 },
  '6A': { min: 60, target: 120, max: 300 },
  '5A': { min: 60, target: 120, max: 300 },

  // Early Elementary - very fast for basic counting/addition
  '4A': { min: 15, target: 45, max: 60 },   // Number writing
  '3A': { min: 30, target: 45, max: 60 },   // Adding +1, +2, +3
  '2A': { min: 30, target: 45, max: 60 },   // Adding +4 to +10

  // Elementary - Addition/Subtraction
  'A':  { min: 30, target: 60, max: 90 },   // Subtraction intro
  'B':  { min: 60, target: 90, max: 150 },  // Vertical, regrouping

  // Elementary - Multiplication/Division/Fractions
  'C':  { min: 60, target: 90, max: 150 },  // Times tables, division
  'D':  { min: 90, target: 120, max: 180 }, // Long division, fractions intro
  'E':  { min: 90, target: 120, max: 180 }, // Fraction operations
  'F':  { min: 90, target: 150, max: 180 }, // Decimals, PEMDAS

  // Middle School - Algebra
  'G':  { min: 90, target: 150, max: 180 },  // Pre-algebra
  'H':  { min: 120, target: 150, max: 180 }, // Algebra I
  'I':  { min: 120, target: 150, max: 180 }, // Algebra I/II

  // High School - Advanced Algebra
  'J':  { min: 150, target: 240, max: 360 }, // Algebra II
  'K':  { min: 180, target: 300, max: 480 }, // Pre-calculus

  // Calculus (wide ranges)
  'L':  { min: 180, target: 480, max: 900 },  // Calculus basics
  'M':  { min: 180, target: 360, max: 720 },  // Trigonometry
  'N':  { min: 240, target: 600, max: 900 },  // Sequences, Series
  'O':  { min: 300, target: 600, max: 1200 }, // Advanced Calculus
}

/**
 * Get the target SCT for a given level (in seconds)
 * Returns 90 seconds as default for unknown levels (1.5 minutes)
 */
export function getSctForLevel(level: string): number {
  return SCT_BY_LEVEL[level]?.target || 90
}

/**
 * Get the full SCT config for a given level
 */
export function getSctConfigForLevel(level: string): { min: number; target: number; max: number } {
  return SCT_BY_LEVEL[level] || { min: 60, target: 90, max: 150 }
}

// ============================================
// Level Comparison Utilities
// ============================================

/**
 * Check if a child's current level is at or past a target level
 * Used for progression-based video unlocking
 */
export function isAtOrPastLevel(
  currentLevel: string,
  targetLevel: string
): boolean {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel as KumonLevel)
  const targetIndex = LEVEL_ORDER.indexOf(targetLevel as KumonLevel)
  if (currentIndex === -1 || targetIndex === -1) return false
  return currentIndex >= targetIndex
}
type WorksheetProgress = Database['public']['Tables']['worksheet_progress']['Row']
type PracticeSession = Database['public']['Tables']['practice_sessions']['Row']

/**
 * Get child's current position (level + worksheet)
 */
export async function getCurrentPosition(childId: string): Promise<{
  level: KumonLevel
  worksheet: number
} | null> {
  const { data, error } = await supabase
    .from('children')
    .select('current_level, current_worksheet')
    .eq('id', childId)
    .single()

  if (error) {
    console.error('Error fetching current position:', error)
    return null
  }

  return {
    level: data.current_level as KumonLevel,
    worksheet: data.current_worksheet
  }
}

/**
 * Get worksheet progress for a specific level
 */
export async function getWorksheetProgress(
  childId: string,
  level: KumonLevel
): Promise<WorksheetProgress[]> {
  const { data, error } = await supabase
    .from('worksheet_progress')
    .select('*')
    .eq('child_id', childId)
    .eq('level', level)
    .order('worksheet_number', { ascending: true })

  if (error) {
    console.error('Error fetching worksheet progress:', error)
    return []
  }

  return data || []
}

/**
 * Get or create worksheet progress record
 */
export async function getOrCreateWorksheetProgress(
  childId: string,
  level: KumonLevel,
  worksheetNumber: number
): Promise<WorksheetProgress | null> {
  // Try to get existing record
  const { data: existing, error: fetchError } = await supabase
    .from('worksheet_progress')
    .select('*')
    .eq('child_id', childId)
    .eq('level', level)
    .eq('worksheet_number', worksheetNumber)
    .maybeSingle()

  if (fetchError) {
    console.error('Error fetching worksheet progress:', fetchError)
    return null
  }

  if (existing) {
    return existing
  }

  // Create new record
  const { data: newRecord, error: insertError } = await supabase
    .from('worksheet_progress')
    .insert({
      child_id: childId,
      level,
      worksheet_number: worksheetNumber,
      status: 'in_progress'
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating worksheet progress:', insertError)
    return null
  }

  return newRecord
}

/**
 * Update worksheet progress after completing a session
 */
export async function updateWorksheetProgress(
  childId: string,
  level: KumonLevel,
  worksheetNumber: number,
  score: number,
  total: number
): Promise<boolean> {
  // Get or create the progress record
  const progress = await getOrCreateWorksheetProgress(childId, level, worksheetNumber)
  if (!progress) return false

  const isCompleted = score >= total * 0.8 // 80% threshold for completion
  const newTimesAttempted = progress.times_attempted + 1
  const newBestScore = Math.max(progress.best_score, score)

  const updateData: Database['public']['Tables']['worksheet_progress']['Update'] = {
    status: isCompleted ? 'completed' : 'in_progress',
    times_attempted: newTimesAttempted,
    best_score: newBestScore,
    best_score_total: total,
    last_attempted_at: new Date().toISOString(),
    ...(isCompleted && !progress.completed_at && {
      completed_at: new Date().toISOString()
    })
  }

  const { error } = await supabase
    .from('worksheet_progress')
    .update(updateData)
    .eq('id', progress.id)

  if (error) {
    console.error('Error updating worksheet progress:', error)
    return false
  }

  return true
}

/**
 * Update child's current position
 */
export async function updateCurrentPosition(
  childId: string,
  level: KumonLevel,
  worksheetNumber: number
): Promise<boolean> {
  const { error } = await supabase
    .from('children')
    .update({
      current_level: level,
      current_worksheet: worksheetNumber
    })
    .eq('id', childId)

  if (error) {
    console.error('Error updating current position:', error)
    return false
  }

  return true
}

/**
 * Create a new practice session
 */
export async function createPracticeSession(
  childId: string,
  level: KumonLevel,
  sessionNumber: 1 | 2 = 1
): Promise<string | null> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      child_id: childId,
      session_number: sessionNumber,
      level,
      status: 'in_progress'
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating practice session:', error)
    return null
  }

  return data.id
}

/**
 * Calculate and update streak based on daily_practice records
 */
export async function updateStreak(childId: string): Promise<number> {
  // Get all daily_practice records for this child, ordered by date descending
  const { data, error } = await supabase
    .from('daily_practice')
    .select('date, session1_completed, session2_completed')
    .eq('child_id', childId)
    .order('date', { ascending: false })
    .limit(100)

  if (error || !data || data.length === 0) {
    console.error('Error fetching daily practice for streak:', error)
    // Set streak to 0 if no data
    await supabase.from('children').update({ streak: 0 }).eq('id', childId)
    return 0
  }

  // Calculate streak - count consecutive days with at least one completed session
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < data.length; i++) {
    const recordDate = new Date(data[i].date)
    recordDate.setHours(0, 0, 0, 0)

    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)

    // Check if this is the expected consecutive day
    if (recordDate.getTime() !== expectedDate.getTime()) {
      break
    }

    // Check if at least one session was completed
    if (data[i].session1_completed || data[i].session2_completed) {
      streak++
    } else {
      break
    }
  }

  // Update the streak in children table
  const { error: updateError } = await supabase
    .from('children')
    .update({ streak })
    .eq('id', childId)

  if (updateError) {
    console.error('Error updating streak:', updateError)
  }

  console.log(`✅ Updated streak for child ${childId}: ${streak} days`)
  return streak
}

/**
 * Update or create daily practice record for today
 */
async function updateDailyPractice(
  childId: string,
  problemsCompleted: number,
  problemsCorrect: number,
  timeSpent: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Check if daily_practice record exists for today
  const { data: existingDaily, error: fetchError } = await supabase
    .from('daily_practice')
    .select('*')
    .eq('child_id', childId)
    .eq('date', today)
    .maybeSingle()

  if (fetchError) {
    console.error('Error fetching daily practice:', fetchError)
    return
  }

  if (existingDaily) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('daily_practice')
      .update({
        session1_completed: true,
        total_problems: existingDaily.total_problems + problemsCompleted,
        total_correct: existingDaily.total_correct + problemsCorrect,
        total_time: existingDaily.total_time + timeSpent
      })
      .eq('id', existingDaily.id)

    if (updateError) {
      console.error('Error updating daily practice:', updateError)
    }
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from('daily_practice')
      .insert({
        child_id: childId,
        date: today,
        session1_completed: true,
        total_problems: problemsCompleted,
        total_correct: problemsCorrect,
        total_time: timeSpent
      })

    if (insertError) {
      console.error('Error inserting daily practice:', insertError)
    }
  }
}

/**
 * Focus tracking metrics for session completion
 */
export interface FocusMetrics {
  focusedTime: number           // Seconds when app was visible
  awayTime: number              // Seconds when app was hidden
  distractionCount: number      // Number of times user left the app
  focusScore: number            // Percentage (0-100) of time focused
  distractions: Array<{         // Detailed distraction records
    leftAt: number
    returnedAt: number
    duration: number
  }>
}

/**
 * Complete a practice session
 */
export async function completePracticeSession(
  sessionId: string,
  problemsCompleted: number,
  problemsCorrect: number,
  timeSpent: number,
  childId?: string,
  focusMetrics?: FocusMetrics
): Promise<boolean> {
  // Debug: Log focus metrics
  console.log('[completePracticeSession] Focus metrics received:', focusMetrics)
  console.log('[completePracticeSession] Time spent:', timeSpent)

  // Build update object with optional focus tracking fields
  const updateData: Record<string, unknown> = {
    completed_at: new Date().toISOString(),
    problems_completed: problemsCompleted,
    problems_correct: problemsCorrect,
    time_spent: timeSpent,
    status: 'completed'
  }

  // Add focus tracking metrics if provided
  if (focusMetrics) {
    console.log('[completePracticeSession] Adding focus metrics to update:', {
      focused_time: focusMetrics.focusedTime,
      away_time: focusMetrics.awayTime,
      distraction_count: focusMetrics.distractionCount,
      focus_score: focusMetrics.focusScore
    })
    updateData.focused_time = focusMetrics.focusedTime
    updateData.away_time = focusMetrics.awayTime
    updateData.distraction_count = focusMetrics.distractionCount
    updateData.focus_score = focusMetrics.focusScore
    updateData.distractions = focusMetrics.distractions
  } else {
    console.warn('[completePracticeSession] No focus metrics provided!')
  }

  const { error } = await supabase
    .from('practice_sessions')
    .update(updateData)
    .eq('id', sessionId)

  if (error) {
    console.error('Error completing practice session:', error)
    return false
  }

  // If childId provided, update daily practice and streak
  if (childId) {
    await updateDailyPractice(childId, problemsCompleted, problemsCorrect, timeSpent)
    await updateStreak(childId)
  }

  return true
}

/**
 * Hints/attempt metadata for tracking student performance
 */
export interface HintsData {
  attemptsCount: number        // Total attempts before final answer (1 = first try)
  firstAttemptCorrect: boolean // Was the first attempt correct?
  hintLevelReached: string | null  // 'micro', 'visual', 'teaching', or null
}

/**
 * Save a single problem attempt with optional hints/attempt tracking
 */
export async function saveProblemAttempt(
  sessionId: string,
  childId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  problem: any,
  studentAnswer: string,
  isCorrect: boolean,
  timeSpent: number,
  hintsData?: HintsData
): Promise<boolean> {
  const { error } = await supabase
    .from('problem_attempts')
    .insert({
      session_id: sessionId,
      child_id: childId,
      problem_data: problem,
      student_answer: studentAnswer,
      is_correct: isCorrect,
      time_spent: timeSpent,
      hints_used: hintsData ? {
        attemptsCount: hintsData.attemptsCount,
        firstAttemptCorrect: hintsData.firstAttemptCorrect,
        hintLevelReached: hintsData.hintLevelReached
      } : null
    })

  if (error) {
    console.error('Error saving problem attempt:', error)
    return false
  }

  return true
}

/**
 * Update child profile (name, age, grade, level, worksheet, questions per page mode)
 */
export async function updateChildProfile(
  childId: string,
  updates: {
    name?: string
    age?: number
    grade_level?: number
    current_level?: string
    current_worksheet?: number
    questions_per_page_mode?: 'one' | 'standard' | 'half'
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('children')
    .update(updates)
    .eq('id', childId)

  if (error) {
    console.error('Error updating child profile:', error)
    return false
  }

  return true
}

/**
 * Delete child profile
 */
export async function deleteChildProfile(childId: string): Promise<boolean> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)

  if (error) {
    console.error('Error deleting child profile:', error)
    return false
  }

  return true
}

/**
 * Get child profile by ID
 */
export async function getChildProfile(childId: string): Promise<Child | null> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single()

  if (error) {
    console.error('Error fetching child profile:', error)
    return null
  }

  return data
}

/**
 * Get all children for a user
 * Now uses direct PostgREST access (fixed with proper GRANTs)
 */
export async function getUserChildren(userId: string): Promise<Child[]> {
  // Try direct PostgREST access (should work now with proper grants)
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching children:', error)
    return []
  }

  console.log('✅ Successfully fetched children via PostgREST:', data?.length || 0)
  return data || []
}

/**
 * Update child's stats (total problems/correct)
 */
export async function updateChildStats(
  childId: string,
  problemsAdded: number,
  correctAdded: number
): Promise<boolean> {
  // First get current stats
  const child = await getChildProfile(childId)
  if (!child) return false

  const { error } = await supabase
    .from('children')
    .update({
      total_problems: child.total_problems + problemsAdded,
      total_correct: child.total_correct + correctAdded
    })
    .eq('id', childId)

  if (error) {
    console.error('Error updating child stats:', error)
    return false
  }

  return true
}

/**
 * Get practice sessions for a child (only completed sessions with data)
 */
export async function getPracticeSessions(
  childId: string,
  limit: number = 10
): Promise<PracticeSession[]> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('child_id', childId)
    .eq('status', 'completed')
    .gt('problems_completed', 0)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching practice sessions:', error)
    return []
  }

  console.log(`✅ Fetched ${data?.length || 0} completed sessions for child ${childId}`)
  return data || []
}

/**
 * Session attempt statistics from hints_used data
 */
export interface SessionAttemptStats {
  firstTryCorrect: number
  withHintsCorrect: number
  incorrect: number
  total: number
}

/**
 * Get detailed attempt statistics for a session
 * Queries problem_attempts and aggregates hints_used data
 */
export async function getSessionAttemptStats(sessionId: string): Promise<SessionAttemptStats> {
  const { data, error } = await supabase
    .from('problem_attempts')
    .select('is_correct, hints_used')
    .eq('session_id', sessionId)

  if (error || !data) {
    console.error('Error fetching session attempt stats:', error)
    return { firstTryCorrect: 0, withHintsCorrect: 0, incorrect: 0, total: 0 }
  }

  let firstTryCorrect = 0
  let withHintsCorrect = 0
  let incorrect = 0

  for (const attempt of data) {
    const hintsData = attempt.hints_used as { firstAttemptCorrect?: boolean } | null
    if (attempt.is_correct) {
      // Only classify as "with hints" if explicitly marked as NOT first attempt correct
      // Treat null hints_used (historical data) as first-try correct
      if (hintsData?.firstAttemptCorrect === false) {
        withHintsCorrect++
      } else {
        firstTryCorrect++
      }
    } else {
      incorrect++
    }
  }

  return { firstTryCorrect, withHintsCorrect, incorrect, total: data.length }
}

/**
 * Lifetime statistics for a child across all sessions
 */
export interface LifetimeStats {
  totalFirstTryCorrect: number
  totalWithHintsCorrect: number
  totalIncorrect: number
  totalProblems: number
  firstTryAccuracy: number      // percentage (0-100)
  overallAccuracy: number       // percentage (0-100)
  avgTimePerProblem: number     // seconds
}

/**
 * Get lifetime statistics for a child
 * Aggregates all problem_attempts and parses hints_used JSON
 */
export async function getLifetimeStats(childId: string): Promise<LifetimeStats> {
  const { data, error } = await supabase
    .from('problem_attempts')
    .select('is_correct, hints_used, time_spent')
    .eq('child_id', childId)

  if (error || !data || data.length === 0) {
    console.error('Error fetching lifetime stats:', error)
    return {
      totalFirstTryCorrect: 0,
      totalWithHintsCorrect: 0,
      totalIncorrect: 0,
      totalProblems: 0,
      firstTryAccuracy: 0,
      overallAccuracy: 0,
      avgTimePerProblem: 0
    }
  }

  let firstTryCorrect = 0
  let withHintsCorrect = 0
  let incorrect = 0
  let totalTime = 0

  for (const attempt of data) {
    const hintsData = attempt.hints_used as { firstAttemptCorrect?: boolean } | null
    const timeSpent = attempt.time_spent || 0
    totalTime += timeSpent

    if (attempt.is_correct) {
      // Only classify as "with hints" if explicitly marked as NOT first attempt correct
      // Treat null hints_used (historical data) as first-try correct
      if (hintsData?.firstAttemptCorrect === false) {
        withHintsCorrect++
      } else {
        firstTryCorrect++
      }
    } else {
      incorrect++
    }
  }

  const totalProblems = data.length
  const totalCorrect = firstTryCorrect + withHintsCorrect

  return {
    totalFirstTryCorrect: firstTryCorrect,
    totalWithHintsCorrect: withHintsCorrect,
    totalIncorrect: incorrect,
    totalProblems,
    firstTryAccuracy: totalProblems > 0 ? Math.round((firstTryCorrect / totalProblems) * 100) : 0,
    overallAccuracy: totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0,
    avgTimePerProblem: totalProblems > 0 ? Math.round(totalTime / totalProblems) : 0
  }
}

/**
 * Daily trend data point for charting
 */
export interface TrendDataPoint {
  date: string                  // YYYY-MM-DD
  firstTryCorrect: number
  withHintsCorrect: number
  incorrect: number
  total: number
  firstTryAccuracy: number      // percentage
}

/**
 * Get daily trend data for charting first-try accuracy over time
 */
export async function getDailyTrendData(
  childId: string,
  days: number = 30
): Promise<TrendDataPoint[]> {
  // Calculate the start date
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString()

  const { data, error } = await supabase
    .from('problem_attempts')
    .select('is_correct, hints_used, created_at')
    .eq('child_id', childId)
    .gte('created_at', startDateStr)
    .order('created_at', { ascending: true })

  if (error || !data) {
    console.error('Error fetching daily trend data:', error)
    return []
  }

  // Group by date (use local date to match chart component)
  const dateMap: Record<string, { firstTry: number; withHints: number; incorrect: number }> = {}

  for (const attempt of data) {
    // Use local date format to match DailyPracticeChart's date generation
    const attemptDate = new Date(attempt.created_at)
    const date = `${attemptDate.getFullYear()}-${String(attemptDate.getMonth() + 1).padStart(2, '0')}-${String(attemptDate.getDate()).padStart(2, '0')}`
    if (!dateMap[date]) {
      dateMap[date] = { firstTry: 0, withHints: 0, incorrect: 0 }
    }

    const hintsData = attempt.hints_used as { firstAttemptCorrect?: boolean } | null
    if (attempt.is_correct) {
      // Only classify as "with hints" if explicitly marked as NOT first attempt correct
      // Treat null hints_used (historical data) as first-try correct
      if (hintsData?.firstAttemptCorrect === false) {
        dateMap[date].withHints++
      } else {
        dateMap[date].firstTry++
      }
    } else {
      dateMap[date].incorrect++
    }
  }

  // Convert to array sorted by date
  return Object.entries(dateMap)
    .map(([date, counts]) => {
      const total = counts.firstTry + counts.withHints + counts.incorrect
      return {
        date,
        firstTryCorrect: counts.firstTry,
        withHintsCorrect: counts.withHints,
        incorrect: counts.incorrect,
        total,
        firstTryAccuracy: total > 0 ? Math.round((counts.firstTry / total) * 100) : 0
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Session time data for time analytics chart
 */
export interface SessionTimeData {
  sessionId: string
  date: string           // Display date (e.g., "Jan 15")
  totalTime: number      // Total time in seconds
  focusedTime: number    // Focused time in seconds
  awayTime: number       // Away time in seconds
  focusScore: number     // 0-100
  distractionCount: number
}

/**
 * Get session time analytics for a child
 * Returns time tracking data for recent sessions
 */
export async function getSessionTimeAnalytics(
  childId: string,
  limit: number = 10
): Promise<SessionTimeData[]> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('id, time_spent, focused_time, away_time, focus_score, distraction_count, completed_at')
    .eq('child_id', childId)
    .eq('status', 'completed')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('Error fetching session time analytics:', error)
    return []
  }

  return data.map(session => {
    const date = new Date(session.completed_at)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    return {
      sessionId: session.id,
      date: dateStr,
      totalTime: session.time_spent || 0,
      focusedTime: session.focused_time || session.time_spent || 0,
      awayTime: session.away_time || 0,
      focusScore: session.focus_score || 100,
      distractionCount: session.distraction_count || 0
    }
  })
}

/**
 * Get aggregate focus stats for a child
 */
export interface FocusStats {
  avgFocusScore: number
  avgTimeVsSct: number
  totalDistractions: number
  totalFocusedTime: number
  totalAwayTime: number
  sessionsWithTimeData: number
}

export async function getChildFocusStats(childId: string): Promise<FocusStats> {
  // Get child's aggregate stats
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('total_focused_time, total_away_time, total_distractions')
    .eq('id', childId)
    .single()

  // Get average focus score from sessions
  const { data: sessions, error: sessionError } = await supabase
    .from('practice_sessions')
    .select('focus_score, time_spent, focused_time, away_time')
    .eq('child_id', childId)
    .eq('status', 'completed')
    .not('focused_time', 'is', null)

  if (childError || sessionError) {
    console.error('Error fetching focus stats:', childError || sessionError)
    return {
      avgFocusScore: 0,
      avgTimeVsSct: 0,
      totalDistractions: 0,
      totalFocusedTime: 0,
      totalAwayTime: 0,
      sessionsWithTimeData: 0
    }
  }

  const sessionsWithData = sessions?.filter(s => s.focus_score !== null) || []
  const avgFocusScore = sessionsWithData.length > 0
    ? Math.round(sessionsWithData.reduce((acc, s) => acc + (s.focus_score || 0), 0) / sessionsWithData.length)
    : 0

  return {
    avgFocusScore,
    avgTimeVsSct: 100, // Would need SCT comparison logic
    totalDistractions: child?.total_distractions || 0,
    totalFocusedTime: child?.total_focused_time || 0,
    totalAwayTime: child?.total_away_time || 0,
    sessionsWithTimeData: sessionsWithData.length
  }
}

/**
 * Per-level statistics
 */
export interface LevelStats {
  level: string
  totalProblems: number
  firstTryCorrect: number
  withHintsCorrect: number
  incorrect: number
  firstTryAccuracy: number
  overallAccuracy: number
  lastPracticed: string | null
}

/**
 * Get performance breakdown by level
 * Joins practice_sessions with problem_attempts to group by level
 */
export async function getLevelBreakdown(childId: string): Promise<LevelStats[]> {
  // Get all sessions with their levels
  const { data: sessions, error: sessionError } = await supabase
    .from('practice_sessions')
    .select('id, level, created_at')
    .eq('child_id', childId)
    .eq('status', 'completed')

  if (sessionError || !sessions || sessions.length === 0) {
    console.error('Error fetching sessions for level breakdown:', sessionError)
    return []
  }

  // Create a map of session_id to level
  const sessionLevelMap: Record<string, string> = {}
  const levelLastPracticed: Record<string, string> = {}

  for (const session of sessions) {
    sessionLevelMap[session.id] = session.level
    // Track most recent session per level
    if (!levelLastPracticed[session.level] || session.created_at > levelLastPracticed[session.level]) {
      levelLastPracticed[session.level] = session.created_at
    }
  }

  // Get all problem attempts for these sessions
  const sessionIds = sessions.map(s => s.id)
  const { data: attempts, error: attemptError } = await supabase
    .from('problem_attempts')
    .select('session_id, is_correct, hints_used')
    .in('session_id', sessionIds)

  if (attemptError || !attempts) {
    console.error('Error fetching attempts for level breakdown:', attemptError)
    return []
  }

  // Aggregate by level
  const levelMap: Record<string, { firstTry: number; withHints: number; incorrect: number }> = {}

  for (const attempt of attempts) {
    const level = sessionLevelMap[attempt.session_id]
    if (!level) continue

    if (!levelMap[level]) {
      levelMap[level] = { firstTry: 0, withHints: 0, incorrect: 0 }
    }

    const hintsData = attempt.hints_used as { firstAttemptCorrect?: boolean } | null
    if (attempt.is_correct) {
      // Only classify as "with hints" if explicitly marked as NOT first attempt correct
      // Treat null hints_used (historical data) as first-try correct
      if (hintsData?.firstAttemptCorrect === false) {
        levelMap[level].withHints++
      } else {
        levelMap[level].firstTry++
      }
    } else {
      levelMap[level].incorrect++
    }
  }

  // Convert to array and sort by level order
  const levelOrder = ['7A', '6A', '5A', '4A', '3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']

  return Object.entries(levelMap)
    .map(([level, counts]) => {
      const total = counts.firstTry + counts.withHints + counts.incorrect
      const correct = counts.firstTry + counts.withHints
      return {
        level,
        totalProblems: total,
        firstTryCorrect: counts.firstTry,
        withHintsCorrect: counts.withHints,
        incorrect: counts.incorrect,
        firstTryAccuracy: total > 0 ? Math.round((counts.firstTry / total) * 100) : 0,
        overallAccuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        lastPracticed: levelLastPracticed[level] || null
      }
    })
    .sort((a, b) => {
      const aIndex = levelOrder.indexOf(a.level)
      const bIndex = levelOrder.indexOf(b.level)
      return aIndex - bIndex
    })
}

/**
 * Performance trend data point for charts
 * Combines time efficiency and first-try accuracy per session
 */
export interface PerformanceTrendData {
  sessionId: string
  date: string              // Display date (e.g., "Jan 15")
  firstTryAccuracy: number  // 0-100%
  timeEfficiency: number    // % of SCT (100 = on target)
  totalProblems: number
  sctSeconds?: number       // Standard Completion Time for this level
}

/**
 * Get performance trend data for visualization charts
 * Fetches sessions with time and accuracy metrics
 * Uses level-appropriate SCT values from SCT_BY_LEVEL
 */
export async function getPerformanceTrendData(
  childId: string,
  days: number = 30
): Promise<PerformanceTrendData[]> {
  // Calculate the start date
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString()

  // Get completed sessions with time data
  const { data: sessions, error: sessionError } = await supabase
    .from('practice_sessions')
    .select('id, time_spent, problems_completed, problems_correct, completed_at, level')
    .eq('child_id', childId)
    .eq('status', 'completed')
    .gte('completed_at', startDateStr)
    .gt('problems_completed', 0)
    .order('completed_at', { ascending: true })

  if (sessionError || !sessions || sessions.length === 0) {
    console.error('Error fetching sessions for performance trend:', sessionError)
    return []
  }

  // Get problem attempts for first-try accuracy calculation
  const sessionIds = sessions.map(s => s.id)
  const { data: attempts, error: attemptError } = await supabase
    .from('problem_attempts')
    .select('session_id, is_correct, hints_used')
    .in('session_id', sessionIds)

  if (attemptError) {
    console.error('Error fetching attempts for performance trend:', attemptError)
  }

  // Group attempts by session
  const sessionAttempts: Record<string, { firstTry: number; total: number }> = {}
  for (const attempt of attempts || []) {
    if (!sessionAttempts[attempt.session_id]) {
      sessionAttempts[attempt.session_id] = { firstTry: 0, total: 0 }
    }
    sessionAttempts[attempt.session_id].total++

    const hintsData = attempt.hints_used as { firstAttemptCorrect?: boolean } | null
    // Count as first-try if correct AND (no hints data OR firstAttemptCorrect is true)
    if (attempt.is_correct && hintsData?.firstAttemptCorrect !== false) {
      sessionAttempts[attempt.session_id].firstTry++
    }
  }

  // Build performance trend data
  return sessions.map(session => {
    const date = new Date(session.completed_at)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // Calculate first-try accuracy from attempts
    const attemptData = sessionAttempts[session.id] || { firstTry: 0, total: session.problems_completed || 0 }
    const firstTryAccuracy = attemptData.total > 0
      ? Math.round((attemptData.firstTry / attemptData.total) * 100)
      : 0

    // Get level-appropriate SCT for this session
    const sctSeconds = getSctForLevel(session.level)

    // Calculate time efficiency as speed score (higher = faster)
    // 100% = exactly on target (took SCT seconds)
    // >100% = faster than target (e.g., 150% = finished in 2/3 of SCT)
    // <100% = slower than target (e.g., 50% = took twice as long)
    const timeSpent = session.time_spent || 0
    const timeEfficiency = sctSeconds > 0 && timeSpent > 0
      ? Math.min(200, Math.round((sctSeconds / timeSpent) * 100))
      : 100

    return {
      sessionId: session.id,
      date: dateStr,
      firstTryAccuracy,
      timeEfficiency,
      totalProblems: session.problems_completed || 0,
      sctSeconds
    }
  })
}

/**
 * Quadrant data for performance scatter plot
 */
export interface QuadrantSessionData {
  sessionId: string
  date: string
  firstTryAccuracy: number  // 0-100
  timeEfficiency: number    // % of SCT
}

/**
 * Get quadrant analysis data for sessions
 * Returns sessions categorized by accuracy and time performance
 * Uses level-appropriate SCT values from SCT_BY_LEVEL
 */
export async function getQuadrantData(
  childId: string,
  days: number = 60
): Promise<QuadrantSessionData[]> {
  // Reuse performance trend data (now uses level-aware SCT)
  const trendData = await getPerformanceTrendData(childId, days)

  return trendData.map(d => ({
    sessionId: d.sessionId,
    date: d.date,
    firstTryAccuracy: d.firstTryAccuracy,
    timeEfficiency: d.timeEfficiency
  }))
}

// ============================================
// Daily Save Limit Functions
// ============================================

/**
 * Get remaining daily saves for a child
 * Children can use "Save & Exit" up to 2 times per day
 */
export async function getRemainingDailySaves(childId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_remaining_daily_saves', {
    p_child_id: childId
  })

  if (error) {
    console.error('Error getting remaining saves:', error)
    return 2 // Default to 2 if error (be permissive)
  }

  return data ?? 2
}

/**
 * Use one of the child's daily saves
 * Returns: remaining saves (0 or 1), or -1 if no saves remaining
 */
export async function useDailySave(childId: string): Promise<number> {
  const { data, error } = await supabase.rpc('use_daily_save', {
    p_child_id: childId
  })

  if (error) {
    console.error('Error using daily save:', error)
    return -1 // Indicate failure
  }

  return data ?? -1
}
