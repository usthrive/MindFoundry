import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import type { KumonLevel } from '@/types'

type Child = Database['public']['Tables']['children']['Row']
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
 * Complete a practice session
 */
export async function completePracticeSession(
  sessionId: string,
  problemsCompleted: number,
  problemsCorrect: number,
  timeSpent: number,
  childId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('practice_sessions')
    .update({
      completed_at: new Date().toISOString(),
      problems_completed: problemsCompleted,
      problems_correct: problemsCorrect,
      time_spent: timeSpent,
      status: 'completed'
    })
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
