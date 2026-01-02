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
    }
  }
}
