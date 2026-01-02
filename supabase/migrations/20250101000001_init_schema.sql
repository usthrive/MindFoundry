-- MindFoundry Database Schema
-- Phase 1 MVP - Core tables only

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'plus', 'premium')),
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children profiles
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 4 AND age <= 11),
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 6),
  avatar TEXT NOT NULL, -- Emoji
  current_level TEXT NOT NULL DEFAULT '6A', -- Kumon level
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'plus', 'premium')),
  streak INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily practice tracking
CREATE TABLE IF NOT EXISTS daily_practice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session1_completed BOOLEAN DEFAULT FALSE,
  session2_completed BOOLEAN DEFAULT FALSE,
  total_problems INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0, -- seconds
  streak_day INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, date)
);

-- Practice sessions
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  daily_practice_id UUID REFERENCES daily_practice(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL CHECK (session_number IN (1, 2)),
  level TEXT NOT NULL, -- Kumon level
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  problems_completed INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- seconds
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problem attempts
CREATE TABLE IF NOT EXISTS problem_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Problem details (stored as JSON to avoid creating thousands of problem rows)
  problem_data JSONB NOT NULL,

  student_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  time_spent INTEGER DEFAULT 0, -- seconds
  hints_used INTEGER DEFAULT 0,
  misconception_detected TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mastery status tracking
CREATE TABLE IF NOT EXISTS mastery_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  topic TEXT NOT NULL, -- addition, subtraction, etc.
  mastery_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (mastery_percentage >= 0 AND mastery_percentage <= 100),
  problems_attempted INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, level, topic)
);

-- Concept intros viewed (for animations)
CREATE TABLE IF NOT EXISTS concept_intros_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  intro_id TEXT NOT NULL, -- e.g., 'intro_subtraction_borrowing'
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, intro_id)
);

-- AI interactions tracking (for billing)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  session_id UUID REFERENCES practice_sessions(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('hint', 'explanation', 'feedback')),
  tokens_used INTEGER DEFAULT 0,
  model TEXT NOT NULL, -- 'claude-sonnet-4.5' or 'claude-haiku-4.0'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_daily_practice_child_date ON daily_practice(child_id, date DESC);
CREATE INDEX idx_practice_sessions_child ON practice_sessions(child_id, started_at DESC);
CREATE INDEX idx_problem_attempts_session ON problem_attempts(session_id);
CREATE INDEX idx_problem_attempts_child ON problem_attempts(child_id, created_at DESC);
CREATE INDEX idx_mastery_status_child ON mastery_status(child_id);
CREATE INDEX idx_ai_interactions_child ON ai_interactions(child_id, created_at DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_practice_updated_at BEFORE UPDATE ON daily_practice
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_sessions_updated_at BEFORE UPDATE ON practice_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mastery_status_updated_at BEFORE UPDATE ON mastery_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_intros_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Users: Can only see/edit their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Children: Parents can CRUD their children
CREATE POLICY "Users can view own children" ON children
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children" ON children
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children" ON children
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children" ON children
  FOR DELETE USING (auth.uid() = user_id);

-- Daily practice: Access through child ownership
CREATE POLICY "Users can view children's daily practice" ON daily_practice
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_practice.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's daily practice" ON daily_practice
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_practice.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's daily practice" ON daily_practice
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_practice.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Practice sessions: Access through child ownership
CREATE POLICY "Users can view children's sessions" ON practice_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = practice_sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's sessions" ON practice_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = practice_sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's sessions" ON practice_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = practice_sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Problem attempts: Access through child ownership
CREATE POLICY "Users can view children's attempts" ON problem_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = problem_attempts.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's attempts" ON problem_attempts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = problem_attempts.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Mastery status: Access through child ownership
CREATE POLICY "Users can view children's mastery" ON mastery_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = mastery_status.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's mastery" ON mastery_status
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = mastery_status.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's mastery" ON mastery_status
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = mastery_status.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Concept intros: Access through child ownership
CREATE POLICY "Users can view children's intros" ON concept_intros_viewed
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = concept_intros_viewed.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's intros" ON concept_intros_viewed
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = concept_intros_viewed.child_id
      AND children.user_id = auth.uid()
    )
  );

-- AI interactions: Access through child ownership
CREATE POLICY "Users can view children's AI interactions" ON ai_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = ai_interactions.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's AI interactions" ON ai_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = ai_interactions.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Comments
COMMENT ON TABLE users IS 'Parent/guardian accounts';
COMMENT ON TABLE children IS 'Child profiles linked to parent accounts';
COMMENT ON TABLE daily_practice IS 'Daily practice tracking (2 sessions per day)';
COMMENT ON TABLE practice_sessions IS 'Individual practice sessions';
COMMENT ON TABLE problem_attempts IS 'Each problem attempt within a session';
COMMENT ON TABLE mastery_status IS 'Track mastery of topics by level';
COMMENT ON TABLE concept_intros_viewed IS 'Track which concept intro animations have been shown';
COMMENT ON TABLE ai_interactions IS 'Track AI usage for billing purposes';
