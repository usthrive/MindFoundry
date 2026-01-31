-- Migration: Add focus time tracking to practice sessions
-- This enables tracking of focused vs away time during sessions

-- ============================================
-- Add time tracking columns to practice_sessions
-- ============================================

-- Focused time: seconds when app was visible and user was active
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS focused_time INTEGER;

-- Away time: seconds when app was backgrounded/hidden
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS away_time INTEGER;

-- Distraction count: number of times user left the app
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS distraction_count INTEGER DEFAULT 0;

-- Focus score: percentage of focused time (focused_time / total_time * 100)
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS focus_score DECIMAL(5,2);

-- Distractions detail: JSON array of distraction records
-- Each record: {leftAt: timestamp, returnedAt: timestamp, duration: seconds}
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS distractions JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- Add SCT comparison to worksheet_progress
-- ============================================

-- Standard Completion Time in seconds (from Kumon level config)
ALTER TABLE worksheet_progress
  ADD COLUMN IF NOT EXISTS sct_seconds INTEGER;

-- Actual time vs SCT ratio (1.0 = on target, <1.0 = faster, >1.0 = slower)
ALTER TABLE worksheet_progress
  ADD COLUMN IF NOT EXISTS time_vs_sct DECIMAL(5,2);

-- Average focus score for this worksheet (aggregated from sessions)
ALTER TABLE worksheet_progress
  ADD COLUMN IF NOT EXISTS avg_focus_score DECIMAL(5,2);

-- ============================================
-- Add aggregate time stats to children table
-- ============================================

-- Total focused time across all sessions (for analytics)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS total_focused_time INTEGER DEFAULT 0;

-- Total away time across all sessions (for analytics)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS total_away_time INTEGER DEFAULT 0;

-- Total distraction count across all sessions
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS total_distractions INTEGER DEFAULT 0;

-- ============================================
-- Create function to update child aggregate stats
-- ============================================

CREATE OR REPLACE FUNCTION update_child_time_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update child's aggregate time stats when a session is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE children
    SET
      total_focused_time = COALESCE(total_focused_time, 0) + COALESCE(NEW.focused_time, 0),
      total_away_time = COALESCE(total_away_time, 0) + COALESCE(NEW.away_time, 0),
      total_distractions = COALESCE(total_distractions, 0) + COALESCE(NEW.distraction_count, 0)
    WHERE id = NEW.child_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating child time stats
DROP TRIGGER IF EXISTS trigger_update_child_time_stats ON practice_sessions;
CREATE TRIGGER trigger_update_child_time_stats
  AFTER INSERT OR UPDATE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_child_time_stats();

-- ============================================
-- Create view for time analytics
-- ============================================

CREATE OR REPLACE VIEW session_time_analytics AS
SELECT
  ps.child_id,
  ps.id AS session_id,
  ps.level,
  ps.session_number,
  ps.time_spent AS total_time,
  ps.focused_time,
  ps.away_time,
  ps.distraction_count,
  ps.focus_score,
  ps.distractions,
  ps.completed_at,
  -- Calculate if this was a focused session (>= 80% focus)
  CASE
    WHEN ps.focus_score >= 80 THEN TRUE
    ELSE FALSE
  END AS is_focused_session,
  -- Calculate time efficiency vs average
  ps.time_spent / NULLIF(
    (SELECT AVG(time_spent) FROM practice_sessions
     WHERE child_id = ps.child_id AND level = ps.level AND status = 'completed'),
    0
  ) AS time_efficiency_ratio
FROM practice_sessions ps
WHERE ps.status = 'completed'
ORDER BY ps.completed_at DESC;

-- ============================================
-- Add comments for documentation
-- ============================================

COMMENT ON COLUMN practice_sessions.focused_time IS 'Seconds when app was visible and user was actively engaged';
COMMENT ON COLUMN practice_sessions.away_time IS 'Seconds when app was backgrounded or user left';
COMMENT ON COLUMN practice_sessions.distraction_count IS 'Number of times user left and returned to the app';
COMMENT ON COLUMN practice_sessions.focus_score IS 'Percentage of session time that was focused (0-100)';
COMMENT ON COLUMN practice_sessions.distractions IS 'JSON array of distraction records with timestamps and durations';

COMMENT ON COLUMN worksheet_progress.sct_seconds IS 'Standard Completion Time in seconds from Kumon curriculum';
COMMENT ON COLUMN worksheet_progress.time_vs_sct IS 'Ratio of actual time to SCT (1.0 = on target)';
COMMENT ON COLUMN worksheet_progress.avg_focus_score IS 'Average focus score across all sessions for this worksheet';

COMMENT ON COLUMN children.total_focused_time IS 'Lifetime total of focused learning time in seconds';
COMMENT ON COLUMN children.total_away_time IS 'Lifetime total of away/distracted time in seconds';
COMMENT ON COLUMN children.total_distractions IS 'Lifetime count of distractions across all sessions';
