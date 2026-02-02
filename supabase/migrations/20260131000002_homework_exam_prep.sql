-- MindFoundry: Homework Helper & Exam Prep Feature
-- Migration: Create tables for AI-powered homework assistance and exam preparation
-- Date: 2026-01-31

-- ============================================================================
-- TABLES
-- ============================================================================

-- Homework/Exam Prep Sessions
-- Stores information about each homework helper or exam prep session
CREATE TABLE homework_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('hw_helper', 'exam_prep')),
  image_count INTEGER NOT NULL DEFAULT 0,
  extracted_problems JSONB DEFAULT '[]'::jsonb,
  topics_identified JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'completed', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE homework_sessions IS 'Stores homework helper and exam prep sessions for children';
COMMENT ON COLUMN homework_sessions.mode IS 'hw_helper: 1-4 images for help, exam_prep: 5-30 images for practice tests';
COMMENT ON COLUMN homework_sessions.extracted_problems IS 'JSON array of problems extracted from uploaded images';
COMMENT ON COLUMN homework_sessions.topics_identified IS 'JSON array of math topics identified in the homework';

-- Practice Tests (for Exam Prep mode)
-- Generated practice tests based on homework analysis
CREATE TABLE exam_prep_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES homework_sessions(id) ON DELETE CASCADE NOT NULL,
  generated_problems JSONB NOT NULL DEFAULT '[]'::jsonb,
  problem_count INTEGER NOT NULL,
  timer_enabled BOOLEAN DEFAULT false,
  time_limit_minutes INTEGER,
  difficulty_preference TEXT DEFAULT 'balanced' CHECK (difficulty_preference IN ('easier', 'balanced', 'harder')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE exam_prep_tests IS 'Practice tests generated from exam prep sessions';
COMMENT ON COLUMN exam_prep_tests.generated_problems IS 'JSON array of AI-generated practice problems';
COMMENT ON COLUMN exam_prep_tests.difficulty_preference IS 'Student preference for test difficulty';

-- Individual Problem Attempts (both modes)
-- Tracks student answers for homework helper and exam prep
CREATE TABLE homework_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES homework_sessions(id) ON DELETE CASCADE,
  test_id UUID REFERENCES exam_prep_tests(id) ON DELETE CASCADE,
  problem_index INTEGER NOT NULL,
  problem_text TEXT NOT NULL,
  problem_type TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  grade_level TEXT,
  correct_answer TEXT,
  student_answer TEXT,
  is_correct BOOLEAN,
  error_type TEXT CHECK (error_type IS NULL OR error_type IN (
    'calculation_error', 'conceptual_error', 'wrong_operation',
    'incomplete', 'misread_problem', 'other'
  )),
  time_spent_seconds INTEGER,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT has_parent CHECK (session_id IS NOT NULL OR test_id IS NOT NULL)
);

COMMENT ON TABLE homework_attempts IS 'Individual problem attempts for homework or practice tests';
COMMENT ON COLUMN homework_attempts.error_type IS 'Type of error made by student (for wrong answers)';
COMMENT ON COLUMN homework_attempts.needs_review IS 'Flag for problems student marked for review during test';

-- Review Sessions with Ms. Guide
-- Stores AI explanations and chat history for problem review
CREATE TABLE review_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES homework_attempts(id) ON DELETE CASCADE NOT NULL,
  explanation JSONB NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  chat_message_count INTEGER DEFAULT 0,
  audio_played BOOLEAN DEFAULT false,
  similar_problem_requested BOOLEAN DEFAULT false,
  similar_problem JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE review_sessions IS 'Ms. Guide review sessions for problem explanations and chat';
COMMENT ON COLUMN review_sessions.explanation IS 'JSON object with Ms. Guide explanation structure';
COMMENT ON COLUMN review_sessions.chat_history IS 'JSON array of chat messages between student and Ms. Guide';
COMMENT ON COLUMN review_sessions.similar_problem IS 'JSON object with generated similar problem for extra practice';

-- Temporary Image Storage Tracking (for 24h deletion)
-- Tracks uploaded images for privacy-compliant auto-deletion
CREATE TABLE homework_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES homework_sessions(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT,
  signed_url TEXT,
  signed_url_expires_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE homework_images IS 'Tracks uploaded homework images for 24-hour auto-deletion';
COMMENT ON COLUMN homework_images.storage_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN homework_images.scheduled_deletion_at IS 'When image should be deleted (24h from upload)';

-- AI Usage Tracking (cost monitoring)
-- Logs all AI API calls for cost tracking and abuse detection
CREATE TABLE homework_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES homework_sessions(id) ON DELETE SET NULL,
  feature TEXT NOT NULL CHECK (feature IN (
    'extraction', 'classification', 'generation',
    'evaluation', 'explanation', 'chat', 'audio'
  )),
  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  image_count INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,6),
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE homework_ai_usage IS 'Tracks AI API usage for cost monitoring and optimization';
COMMENT ON COLUMN homework_ai_usage.feature IS 'Which AI feature was used';
COMMENT ON COLUMN homework_ai_usage.estimated_cost IS 'Estimated cost in USD';

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE homework_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_prep_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_ai_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their children's homework sessions
CREATE POLICY "Users can view own children homework sessions"
  ON homework_sessions FOR SELECT
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

CREATE POLICY "Users can insert own children homework sessions"
  ON homework_sessions FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

CREATE POLICY "Users can update own children homework sessions"
  ON homework_sessions FOR UPDATE
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

CREATE POLICY "Users can delete own children homework sessions"
  ON homework_sessions FOR DELETE
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

-- Policy: Exam prep tests through session ownership
CREATE POLICY "Users can view own children exam tests"
  ON exam_prep_tests FOR SELECT
  USING (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can insert own children exam tests"
  ON exam_prep_tests FOR INSERT
  WITH CHECK (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can update own children exam tests"
  ON exam_prep_tests FOR UPDATE
  USING (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

-- Policy: Homework attempts through session/test ownership
CREATE POLICY "Users can view own children homework attempts"
  ON homework_attempts FOR SELECT
  USING (
    session_id IN (
      SELECT hs.id FROM homework_sessions hs
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
    OR test_id IN (
      SELECT ept.id FROM exam_prep_tests ept
      JOIN homework_sessions hs ON ept.session_id = hs.id
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own children homework attempts"
  ON homework_attempts FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT hs.id FROM homework_sessions hs
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
    OR test_id IN (
      SELECT ept.id FROM exam_prep_tests ept
      JOIN homework_sessions hs ON ept.session_id = hs.id
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own children homework attempts"
  ON homework_attempts FOR UPDATE
  USING (
    session_id IN (
      SELECT hs.id FROM homework_sessions hs
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
    OR test_id IN (
      SELECT ept.id FROM exam_prep_tests ept
      JOIN homework_sessions hs ON ept.session_id = hs.id
      JOIN children c ON hs.child_id = c.id
      WHERE c.parent_id = auth.uid()
    )
  );

-- Policy: Review sessions through attempt ownership
CREATE POLICY "Users can view own children review sessions"
  ON review_sessions FOR SELECT
  USING (attempt_id IN (
    SELECT ha.id FROM homework_attempts ha
    LEFT JOIN homework_sessions hs ON ha.session_id = hs.id
    LEFT JOIN exam_prep_tests ept ON ha.test_id = ept.id
    LEFT JOIN homework_sessions hs2 ON ept.session_id = hs2.id
    JOIN children c ON COALESCE(hs.child_id, hs2.child_id) = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can insert own children review sessions"
  ON review_sessions FOR INSERT
  WITH CHECK (attempt_id IN (
    SELECT ha.id FROM homework_attempts ha
    LEFT JOIN homework_sessions hs ON ha.session_id = hs.id
    LEFT JOIN exam_prep_tests ept ON ha.test_id = ept.id
    LEFT JOIN homework_sessions hs2 ON ept.session_id = hs2.id
    JOIN children c ON COALESCE(hs.child_id, hs2.child_id) = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can update own children review sessions"
  ON review_sessions FOR UPDATE
  USING (attempt_id IN (
    SELECT ha.id FROM homework_attempts ha
    LEFT JOIN homework_sessions hs ON ha.session_id = hs.id
    LEFT JOIN exam_prep_tests ept ON ha.test_id = ept.id
    LEFT JOIN homework_sessions hs2 ON ept.session_id = hs2.id
    JOIN children c ON COALESCE(hs.child_id, hs2.child_id) = c.id
    WHERE c.parent_id = auth.uid()
  ));

-- Policy: Homework images through session ownership
CREATE POLICY "Users can view own children homework images"
  ON homework_images FOR SELECT
  USING (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can insert own children homework images"
  ON homework_images FOR INSERT
  WITH CHECK (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can delete own children homework images"
  ON homework_images FOR DELETE
  USING (session_id IN (
    SELECT hs.id FROM homework_sessions hs
    JOIN children c ON hs.child_id = c.id
    WHERE c.parent_id = auth.uid()
  ));

-- Policy: AI usage through child ownership
CREATE POLICY "Users can view own children ai usage"
  ON homework_ai_usage FOR SELECT
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

CREATE POLICY "Users can insert own children ai usage"
  ON homework_ai_usage FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_homework_sessions_child ON homework_sessions(child_id);
CREATE INDEX idx_homework_sessions_status ON homework_sessions(status);
CREATE INDEX idx_homework_sessions_mode ON homework_sessions(mode);
CREATE INDEX idx_homework_sessions_created ON homework_sessions(created_at DESC);

CREATE INDEX idx_exam_prep_tests_session ON exam_prep_tests(session_id);
CREATE INDEX idx_exam_prep_tests_completed ON exam_prep_tests(completed_at) WHERE completed_at IS NOT NULL;

CREATE INDEX idx_homework_attempts_session ON homework_attempts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_homework_attempts_test ON homework_attempts(test_id) WHERE test_id IS NOT NULL;
CREATE INDEX idx_homework_attempts_incorrect ON homework_attempts(is_correct) WHERE is_correct = false;

CREATE INDEX idx_review_sessions_attempt ON review_sessions(attempt_id);

CREATE INDEX idx_homework_images_session ON homework_images(session_id);
CREATE INDEX idx_homework_images_deletion ON homework_images(scheduled_deletion_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_homework_ai_usage_child ON homework_ai_usage(child_id);
CREATE INDEX idx_homework_ai_usage_session ON homework_ai_usage(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_homework_ai_usage_created ON homework_ai_usage(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp for homework_sessions
CREATE OR REPLACE FUNCTION update_homework_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER homework_sessions_updated_at
  BEFORE UPDATE ON homework_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_homework_sessions_updated_at();

-- Auto-update updated_at timestamp for review_sessions
CREATE TRIGGER review_sessions_updated_at
  BEFORE UPDATE ON review_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_homework_sessions_updated_at();

-- Auto-increment chat message count on review session update
CREATE OR REPLACE FUNCTION update_review_session_chat_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.chat_message_count = jsonb_array_length(COALESCE(NEW.chat_history, '[]'::jsonb));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_sessions_chat_count
  BEFORE INSERT OR UPDATE ON review_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_review_session_chat_count();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get session statistics for a child
CREATE OR REPLACE FUNCTION get_homework_stats(p_child_id UUID)
RETURNS TABLE (
  total_sessions BIGINT,
  hw_helper_sessions BIGINT,
  exam_prep_sessions BIGINT,
  total_problems_helped BIGINT,
  total_tests_taken BIGINT,
  average_test_score DECIMAL,
  total_review_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT hs.id) as total_sessions,
    COUNT(DISTINCT hs.id) FILTER (WHERE hs.mode = 'hw_helper') as hw_helper_sessions,
    COUNT(DISTINCT hs.id) FILTER (WHERE hs.mode = 'exam_prep') as exam_prep_sessions,
    COUNT(ha.id) FILTER (WHERE hs.mode = 'hw_helper') as total_problems_helped,
    COUNT(DISTINCT ept.id) FILTER (WHERE ept.completed_at IS NOT NULL) as total_tests_taken,
    AVG(ept.score_percentage) FILTER (WHERE ept.completed_at IS NOT NULL) as average_test_score,
    COUNT(DISTINCT rs.id) as total_review_sessions
  FROM homework_sessions hs
  LEFT JOIN homework_attempts ha ON ha.session_id = hs.id
  LEFT JOIN exam_prep_tests ept ON ept.session_id = hs.id
  LEFT JOIN homework_attempts ha2 ON ha2.test_id = ept.id
  LEFT JOIN review_sessions rs ON rs.attempt_id = ha.id OR rs.attempt_id = ha2.id
  WHERE hs.child_id = p_child_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired homework images (called by cron)
CREATE OR REPLACE FUNCTION cleanup_expired_homework_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Mark images as deleted (actual storage deletion done by Edge Function)
  UPDATE homework_images
  SET deleted_at = NOW()
  WHERE scheduled_deletion_at < NOW()
    AND deleted_at IS NULL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STORAGE BUCKET (run in Supabase Dashboard if not using CLI)
-- ============================================================================

-- Note: Create storage bucket via Supabase Dashboard or CLI:
-- Bucket name: homework-images
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/heic, image/webp

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON homework_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON exam_prep_tests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON homework_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON review_sessions TO authenticated;
GRANT SELECT, INSERT, DELETE ON homework_images TO authenticated;
GRANT SELECT, INSERT ON homework_ai_usage TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_homework_stats(UUID) TO authenticated;
