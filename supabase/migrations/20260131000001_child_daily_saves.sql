-- ============================================
-- Child Daily Saves Tracking
-- ============================================
-- Tracks how many times a child has used "Save & Exit" per day
-- Limited to 2 saves per day to prevent misuse

-- Table to track daily saves per child
CREATE TABLE IF NOT EXISTS child_daily_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  saves_used INTEGER NOT NULL DEFAULT 0 CHECK (saves_used >= 0 AND saves_used <= 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, date)
);

-- Index for fast lookups by child and date
CREATE INDEX IF NOT EXISTS idx_child_daily_saves_child_date
ON child_daily_saves(child_id, date);

-- Enable RLS
ALTER TABLE child_daily_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Parents can view saves for their children
CREATE POLICY "Parents can view child saves" ON child_daily_saves
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = child_daily_saves.child_id
      AND c.user_id = auth.uid()
    )
  );

-- Parents can insert/update saves for their children
CREATE POLICY "Parents can manage child saves" ON child_daily_saves
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = child_daily_saves.child_id
      AND c.user_id = auth.uid()
    )
  );

-- ============================================
-- RPC Function: use_daily_save
-- ============================================
-- Atomically uses one daily save for a child
-- Returns: remaining saves (0, 1, or 2)
-- Returns -1 if no saves remaining (failed)

CREATE OR REPLACE FUNCTION use_daily_save(p_child_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_saves_used INTEGER;
  v_remaining INTEGER;
BEGIN
  -- Verify the child belongs to the authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM children c
    WHERE c.id = p_child_id
    AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Child does not belong to user';
  END IF;

  -- Insert or update the daily saves record
  INSERT INTO child_daily_saves (child_id, date, saves_used)
  VALUES (p_child_id, CURRENT_DATE, 1)
  ON CONFLICT (child_id, date) DO UPDATE
  SET
    saves_used = child_daily_saves.saves_used + 1,
    updated_at = NOW()
  WHERE child_daily_saves.saves_used < 2  -- Only update if under limit
  RETURNING saves_used INTO v_saves_used;

  -- If no row was updated/inserted, we're at the limit
  IF v_saves_used IS NULL THEN
    RETURN -1;  -- No saves remaining
  END IF;

  -- Calculate remaining saves
  v_remaining := 2 - v_saves_used;
  RETURN v_remaining;
END;
$$;

-- ============================================
-- RPC Function: get_remaining_daily_saves
-- ============================================
-- Gets the number of remaining saves for today

CREATE OR REPLACE FUNCTION get_remaining_daily_saves(p_child_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_saves_used INTEGER;
BEGIN
  -- Verify the child belongs to the authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM children c
    WHERE c.id = p_child_id
    AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Child does not belong to user';
  END IF;

  -- Get today's saves count (0 if no record exists)
  SELECT COALESCE(saves_used, 0) INTO v_saves_used
  FROM child_daily_saves
  WHERE child_id = p_child_id AND date = CURRENT_DATE;

  -- Return remaining (2 - used), default to 2 if no record
  RETURN 2 - COALESCE(v_saves_used, 0);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION use_daily_save(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_remaining_daily_saves(UUID) TO authenticated;

-- Comment on table
COMMENT ON TABLE child_daily_saves IS 'Tracks daily "Save & Exit" usage per child, limited to 2 per day';
