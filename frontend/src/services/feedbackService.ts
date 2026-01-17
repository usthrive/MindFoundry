import { supabase } from '@/lib/supabase'

// Feedback types
export type FeedbackType = 'enhancement' | 'qa_issue' | 'content'

export type FeedbackCategory =
  | 'ui'
  | 'problem_generator'
  | 'hints'
  | 'progress'
  | 'app_crash'
  | 'display'
  | 'general'
  | 'other'

export interface FeedbackSubmission {
  type: FeedbackType
  category?: FeedbackCategory
  title: string
  description: string
  screenshotUrl?: string
}

export interface FeedbackContext {
  pageUrl?: string
  userAgent?: string
  currentLevel?: string
  currentWorksheet?: number
  problemId?: string
}

export interface Feedback {
  id: string
  user_id: string | null
  child_id: string | null
  type: FeedbackType
  category: FeedbackCategory | null
  title: string
  description: string
  page_url: string | null
  user_agent: string | null
  current_level: string | null
  current_worksheet: number | null
  problem_id: string | null
  screenshot_url: string | null
  status: string
  priority: string | null
  dev_notes: string | null
  created_at: string
  updated_at: string
}

/**
 * Submit feedback from user
 */
export async function submitFeedback(
  submission: FeedbackSubmission,
  context: FeedbackContext,
  userId?: string,
  childId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('feedback').insert({
      user_id: userId || null,
      child_id: childId || null,
      type: submission.type,
      category: submission.category || null,
      title: submission.title,
      description: submission.description,
      page_url: context.pageUrl || null,
      user_agent: context.userAgent || null,
      current_level: context.currentLevel || null,
      current_worksheet: context.currentWorksheet || null,
      problem_id: context.problemId || null,
      screenshot_url: submission.screenshotUrl || null,
      status: 'new',
    })

    if (error) {
      console.error('Error submitting feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error submitting feedback:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all feedback for a user (their own submissions)
 */
export async function getUserFeedback(userId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user feedback:', error)
    return []
  }

  return data || []
}

/**
 * Get current context for feedback submission
 */
export function getCurrentContext(): FeedbackContext {
  return {
    pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  }
}

/**
 * Category options by feedback type
 */
export const CATEGORY_OPTIONS: Record<FeedbackType, { value: FeedbackCategory; label: string }[]> = {
  enhancement: [
    { value: 'ui', label: 'User Interface / Design' },
    { value: 'progress', label: 'Progress Tracking' },
    { value: 'hints', label: 'Hints / Teaching' },
    { value: 'general', label: 'General Feature' },
    { value: 'other', label: 'Other' },
  ],
  qa_issue: [
    { value: 'display', label: 'Display / Visual Issue' },
    { value: 'problem_generator', label: 'Problem Generator (wrong answer, etc.)' },
    { value: 'hints', label: 'Hints not helpful' },
    { value: 'progress', label: 'Progress not saving' },
    { value: 'app_crash', label: 'App crashes or freezes' },
    { value: 'other', label: 'Other' },
  ],
  content: [
    { value: 'problem_generator', label: 'Problem difficulty' },
    { value: 'hints', label: 'Hint quality' },
    { value: 'general', label: 'Level progression' },
    { value: 'other', label: 'Other' },
  ],
}

/**
 * Feedback type display info
 */
export const FEEDBACK_TYPES: {
  type: FeedbackType
  icon: string
  title: string
  description: string
}[] = [
  {
    type: 'enhancement',
    icon: '💡',
    title: 'Suggest a Feature',
    description: 'Have an idea to make MindFoundry better?',
  },
  {
    type: 'qa_issue',
    icon: '🐛',
    title: 'Report a Problem',
    description: 'Something not working right? Let us know!',
  },
  {
    type: 'content',
    icon: '📝',
    title: 'Math Content Feedback',
    description: 'Issue with a problem, hint, or difficulty?',
  },
]
