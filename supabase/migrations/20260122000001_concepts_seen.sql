-- Migration: concepts_seen
-- Phase 1.19: Database-backed concept tracking
--
-- This table tracks which concept introduction modals each child has seen.
-- Previously this was localStorage only, causing issues with:
-- - Lost tracking when browser cache is cleared
-- - No cross-device sync
-- - Concepts marked as seen unintentionally

-- Create the concepts_seen table
CREATE TABLE IF NOT EXISTS concepts_seen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  concept_id VARCHAR(100) NOT NULL,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each child can only see a concept once
  UNIQUE(child_id, concept_id)
);

-- Index for fast lookups by child
CREATE INDEX IF NOT EXISTS idx_concepts_seen_child ON concepts_seen(child_id);

-- Index for analytics queries (e.g., which concepts are most viewed)
CREATE INDEX IF NOT EXISTS idx_concepts_seen_concept ON concepts_seen(concept_id);

-- Enable Row Level Security
ALTER TABLE concepts_seen ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own children's seen concepts
CREATE POLICY "Users can view own children's seen concepts"
  ON concepts_seen
  FOR SELECT
  USING (
    child_id IN (
      SELECT id FROM children WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert seen concepts for their own children
CREATE POLICY "Users can insert own children's seen concepts"
  ON concepts_seen
  FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT id FROM children WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete seen concepts for their own children (for reset functionality)
CREATE POLICY "Users can delete own children's seen concepts"
  ON concepts_seen
  FOR DELETE
  USING (
    child_id IN (
      SELECT id FROM children WHERE user_id = auth.uid()
    )
  );

-- Grant access to authenticated users
GRANT SELECT, INSERT, DELETE ON concepts_seen TO authenticated;

-- Comment on table for documentation
COMMENT ON TABLE concepts_seen IS 'Tracks which concept introduction modals each child has viewed. Used to prevent showing the same concept intro twice.';
COMMENT ON COLUMN concepts_seen.child_id IS 'Reference to the child who saw the concept';
COMMENT ON COLUMN concepts_seen.concept_id IS 'The concept identifier (e.g., addition_plus_1, subtraction_minus_2)';
COMMENT ON COLUMN concepts_seen.seen_at IS 'Timestamp when the concept intro was shown';
