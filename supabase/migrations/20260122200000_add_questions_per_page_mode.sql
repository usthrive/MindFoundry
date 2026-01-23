-- Add questions_per_page_mode to children table
-- Allows parents to customize how many questions are shown per page for each child

ALTER TABLE children
ADD COLUMN questions_per_page_mode TEXT DEFAULT 'standard'
CHECK (questions_per_page_mode IN ('one', 'standard', 'half'));

-- Add comment for documentation
COMMENT ON COLUMN children.questions_per_page_mode IS 'Controls questions per page: one (1 at a time), standard (level default), half (half of standard)';
