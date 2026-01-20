import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Database types for Supabase tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          user_type: 'parent' | 'student' | null
          tier: 'free' | 'basic' | 'plus' | 'premium'
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type?: 'parent' | 'student' | null
          tier?: 'free' | 'basic' | 'plus' | 'premium'
        }
        Update: {
          email?: string
          full_name?: string | null
          user_type?: 'parent' | 'student' | null
          tier?: 'free' | 'basic' | 'plus' | 'premium'
        }
      }
      children: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          grade_level: number
          avatar: string
          current_level: string
          current_worksheet: number
          tier: 'free' | 'basic' | 'plus' | 'premium'
          streak: number
          total_problems: number
          total_correct: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          grade_level: number
          avatar: string
          current_level?: string
          current_worksheet?: number
        }
        Update: {
          name?: string
          current_level?: string
          current_worksheet?: number
          total_problems?: number
          total_correct?: number
        }
      }
      worksheet_progress: {
        Row: {
          id: string
          child_id: string
          level: string
          worksheet_number: number
          status: 'not_started' | 'in_progress' | 'completed'
          times_attempted: number
          best_score: number
          best_score_total: number
          last_attempted_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          level: string
          worksheet_number: number
          status?: 'not_started' | 'in_progress' | 'completed'
        }
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed'
          times_attempted?: number
          best_score?: number
          best_score_total?: number
          last_attempted_at?: string | null
          completed_at?: string | null
        }
      }
      practice_sessions: {
        Row: {
          id: string
          child_id: string
          session_number: 1 | 2
          level: string
          started_at: string
          completed_at: string | null
          problems_completed: number
          problems_correct: number
          time_spent: number
          status: 'in_progress' | 'completed' | 'abandoned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          session_number: 1 | 2
          level: string
        }
        Update: {
          completed_at?: string | null
          problems_completed?: number
          problems_correct?: number
          time_spent?: number
          status?: 'in_progress' | 'completed' | 'abandoned'
        }
      }
      problem_attempts: {
        Row: {
          id: string
          session_id: string
          child_id: string
          problem_data: unknown
          student_answer: string
          is_correct: boolean
          time_spent: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          child_id: string
          problem_data: unknown
          student_answer: string
          is_correct: boolean
          time_spent?: number
        }
        Update: never
      }
      // YouTube Video Integration Tables
      video_library: {
        Row: {
          id: string
          youtube_id: string
          title: string
          channel_name: string
          duration_seconds: number
          thumbnail_url: string | null
          tier: 'short' | 'detailed'
          min_age: number
          max_age: number
          kumon_level: string
          score_age_appropriate: number | null
          score_educational: number | null
          score_production: number | null
          score_engagement: number | null
          score_safety: number | null
          score_overall: number | null
          teaching_style: string | null
          is_active: boolean
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          youtube_id: string
          title: string
          channel_name: string
          duration_seconds: number
          thumbnail_url?: string | null
          tier: 'short' | 'detailed'
          min_age?: number
          max_age?: number
          kumon_level: string
          score_overall?: number | null
          teaching_style?: string | null
        }
        Update: {
          title?: string
          thumbnail_url?: string | null
          is_active?: boolean
          verified_at?: string | null
        }
      }
      concept_videos: {
        Row: {
          id: string
          concept_id: string
          concept_name: string
          kumon_level: string
          short_video_id: string | null
          detailed_video_id: string | null
          show_at_introduction: boolean
          show_in_hints: boolean
          show_in_help_menu: boolean
          created_at: string
        }
        Insert: {
          id?: string
          concept_id: string
          concept_name: string
          kumon_level: string
          short_video_id?: string | null
          detailed_video_id?: string | null
          show_at_introduction?: boolean
          show_in_hints?: boolean
          show_in_help_menu?: boolean
        }
        Update: {
          short_video_id?: string | null
          detailed_video_id?: string | null
          show_at_introduction?: boolean
          show_in_hints?: boolean
          show_in_help_menu?: boolean
        }
      }
      video_views: {
        Row: {
          id: string
          child_id: string
          video_id: string
          concept_id: string
          trigger_type: 'concept_intro' | 'struggle_detected' | 'explicit_request' | 'review_mode' | 'parent_view'
          session_id: string | null
          started_at: string
          ended_at: string | null
          watch_duration_seconds: number
          completion_percentage: number
          user_feedback: 'helpful' | 'not_helpful' | 'skipped' | null
          accuracy_before_video: number | null
          accuracy_after_video: number | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          video_id: string
          concept_id: string
          trigger_type: 'concept_intro' | 'struggle_detected' | 'explicit_request' | 'review_mode' | 'parent_view'
          session_id?: string | null
          started_at?: string
          accuracy_before_video?: number | null
        }
        Update: {
          ended_at?: string | null
          watch_duration_seconds?: number
          completion_percentage?: number
          user_feedback?: 'helpful' | 'not_helpful' | 'skipped' | null
          accuracy_after_video?: number | null
        }
      }
      video_preferences: {
        Row: {
          id: string
          child_id: string
          videos_enabled: boolean
          auto_suggest_enabled: boolean
          suggest_threshold: number
          show_in_concept_intro: boolean
          show_in_review: boolean
          max_videos_per_day: number
          max_video_duration_minutes: number
          suggestions_dismissed_today: number
          videos_watched_today: number
          last_reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          videos_enabled?: boolean
          auto_suggest_enabled?: boolean
          suggest_threshold?: number
          show_in_concept_intro?: boolean
          show_in_review?: boolean
          max_videos_per_day?: number
          max_video_duration_minutes?: number
        }
        Update: {
          videos_enabled?: boolean
          auto_suggest_enabled?: boolean
          suggest_threshold?: number
          show_in_concept_intro?: boolean
          show_in_review?: boolean
          max_videos_per_day?: number
          max_video_duration_minutes?: number
          suggestions_dismissed_today?: number
          videos_watched_today?: number
        }
      }
    }
  }
}
