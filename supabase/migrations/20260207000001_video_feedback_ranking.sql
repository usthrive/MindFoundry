-- Video Feedback Ranking
-- Aggregate thumbs up/down feedback from video_views into video_library
-- so higher-rated videos are recommended first.

-- ============================================
-- Step 1: Add feedback aggregation columns
-- ============================================
ALTER TABLE video_library
  ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS not_helpful_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS feedback_score DECIMAL(5,2) DEFAULT NULL;

-- Index for sorting by feedback score
CREATE INDEX IF NOT EXISTS idx_video_library_feedback_score
  ON video_library(feedback_score DESC NULLS LAST);

-- ============================================
-- Step 2: Trigger function to recalculate feedback
-- ============================================
CREATE OR REPLACE FUNCTION update_video_feedback_counts()
RETURNS TRIGGER AS $$
DECLARE
  target_video_id UUID;
  h_count INTEGER;
  nh_count INTEGER;
  total INTEGER;
BEGIN
  -- Get the video_id from the updated row
  target_video_id := COALESCE(NEW.video_id, OLD.video_id);

  -- Count feedback for this video
  SELECT
    COUNT(*) FILTER (WHERE user_feedback = 'helpful'),
    COUNT(*) FILTER (WHERE user_feedback = 'not_helpful')
  INTO h_count, nh_count
  FROM video_views
  WHERE video_id = target_video_id
    AND user_feedback IS NOT NULL
    AND user_feedback != 'skipped';

  total := h_count + nh_count;

  -- Update video_library with aggregated counts
  UPDATE video_library
  SET
    helpful_count = h_count,
    not_helpful_count = nh_count,
    feedback_score = CASE
      WHEN total > 0 THEN ROUND((h_count * 100.0) / total, 2)
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = target_video_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Step 3: Create trigger on video_views
-- ============================================
DROP TRIGGER IF EXISTS trg_update_video_feedback ON video_views;

CREATE TRIGGER trg_update_video_feedback
  AFTER INSERT OR UPDATE OF user_feedback OR DELETE
  ON video_views
  FOR EACH ROW
  EXECUTE FUNCTION update_video_feedback_counts();

-- ============================================
-- Step 4: Backfill from existing data
-- ============================================
UPDATE video_library vl
SET
  helpful_count = stats.h_count,
  not_helpful_count = stats.nh_count,
  feedback_score = CASE
    WHEN (stats.h_count + stats.nh_count) > 0
    THEN ROUND((stats.h_count * 100.0) / (stats.h_count + stats.nh_count), 2)
    ELSE NULL
  END,
  updated_at = NOW()
FROM (
  SELECT
    video_id,
    COUNT(*) FILTER (WHERE user_feedback = 'helpful') AS h_count,
    COUNT(*) FILTER (WHERE user_feedback = 'not_helpful') AS nh_count
  FROM video_views
  WHERE user_feedback IS NOT NULL AND user_feedback != 'skipped'
  GROUP BY video_id
) stats
WHERE vl.id = stats.video_id;

-- ============================================
-- Log
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Video feedback ranking: columns added, trigger created, existing data backfilled';
END $$;
