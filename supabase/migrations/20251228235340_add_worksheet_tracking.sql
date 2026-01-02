-- Add worksheet-level progress tracking
-- This allows tracking each individual worksheet (1-200) within each level

-- Add current_worksheet column to children table
ALTER TABLE children ADD COLUMN IF NOT EXISTS current_worksheet INTEGER DEFAULT 1 CHECK (current_worksheet >= 1 AND current_worksheet <= 200);

-- Create worksheet_progress table for detailed tracking
CREATE TABLE IF NOT EXISTS worksheet_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  worksheet_number INTEGER NOT NULL CHECK (worksheet_number >= 1 AND worksheet_number <= 200),

  -- Completion tracking
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  times_attempted INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  best_score_total INTEGER DEFAULT 10,

  -- Timestamps
  last_attempted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one record per child-level-worksheet combination
  UNIQUE(child_id, level, worksheet_number)
);

-- Indexes for performance
CREATE INDEX idx_worksheet_progress_child_level ON worksheet_progress(child_id, level, worksheet_number);
CREATE INDEX idx_worksheet_progress_status ON worksheet_progress(child_id, status);

-- Trigger for updated_at
CREATE TRIGGER update_worksheet_progress_updated_at BEFORE UPDATE ON worksheet_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE worksheet_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Parents can access their children's worksheet progress
CREATE POLICY "Users can view children's worksheet progress" ON worksheet_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = worksheet_progress.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's worksheet progress" ON worksheet_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = worksheet_progress.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's worksheet progress" ON worksheet_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = worksheet_progress.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Comment
COMMENT ON TABLE worksheet_progress IS 'Track completion status and scores for each individual worksheet (1-200) within each Kumon level';
COMMENT ON COLUMN children.current_worksheet IS 'Current worksheet number (1-200) within the current_level that the child is working on';
