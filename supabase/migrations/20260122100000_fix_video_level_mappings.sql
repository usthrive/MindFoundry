-- Fix Video Level Mappings
-- Based on Kumon curriculum analysis:
-- - 4A = Writing numbers (NOT math operations!)
-- - 3A = FIRST addition (+1, +2, +3 only)
-- - 2A = Addition +4 through +10
-- - A = FIRST subtraction (single-digit)
-- - B = FIRST 2-digit operations (carrying/borrowing)
-- - E = Fraction operations (including division)
-- - F = Decimals, PEMDAS

-- ============================================
-- Fix Addition Videos (4A → 3A)
-- Addition starts at Level 3A, not 4A
-- Level 4A is for WRITING numbers, not math operations
-- ============================================
UPDATE video_library
SET kumon_level = '3A', updated_at = NOW()
WHERE youtube_id IN (
  'uONIJ5TQ2DA',  -- Move and Add, Add and Move | Addition Song
  'kwphjyYokbY'   -- Addition for Kids | Basic Addition for Kindergarten
);

-- ============================================
-- Fix Subtraction Concept Videos (4A → A)
-- Subtraction starts at Level A, not 4A!
-- ============================================
UPDATE video_library
SET kumon_level = 'A', updated_at = NOW()
WHERE youtube_id IN (
  'y2Ntn69b8Cs',  -- Basic Subtraction for Kids
  'eg9iSgMAJZc'   -- Subtraction with Pictures
);

-- ============================================
-- Fix Subtraction Facts Videos (2A → A)
-- Subtraction facts belong to Level A
-- ============================================
UPDATE video_library
SET kumon_level = 'A', updated_at = NOW()
WHERE youtube_id IN (
  'dslT0LOTf5w',  -- Subtraction Song | Minus 1
  'ohur61E569w'   -- Subtraction Facts 0-20 Drill
);

-- ============================================
-- Fix 2-Digit Operation Videos (A → B)
-- 2-digit operations start at Level B, not Level A
-- Level A is for single-digit subtraction only
-- ============================================
UPDATE video_library
SET kumon_level = 'B', updated_at = NOW()
WHERE youtube_id IN (
  'kmhdFjgFHA8',  -- Two Digit Addition No Regrouping
  'G1cNKc3PD74',  -- Adding Two-Digit Numbers
  'fbykrBCqopk',  -- 2-Digit Subtraction No Regrouping
  '_CcdCmYP-Wo'   -- Subtraction - Two Digits
);

-- ============================================
-- Fix Fraction Videos (F → E)
-- Fraction operations (including division) are Level E
-- Level F is for Decimals and PEMDAS
-- ============================================
UPDATE video_library
SET kumon_level = 'E', updated_at = NOW()
WHERE youtube_id IN (
  '4lkq3DgvmJo',  -- Dividing Fractions (Why Flip?)
  'Y7Xav-XAhXs',  -- LCM and GCF Difference
  'AHszBRnPbYM'   -- Ladder Method for LCM and GCF
);

-- ============================================
-- Log the changes
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Video level mappings have been corrected:';
  RAISE NOTICE '- 2 addition videos moved from 4A to 3A';
  RAISE NOTICE '- 2 subtraction concept videos moved from 4A to A';
  RAISE NOTICE '- 2 subtraction facts videos moved from 2A to A';
  RAISE NOTICE '- 4 two-digit operation videos moved from A to B';
  RAISE NOTICE '- 3 fraction operation videos moved from F to E';
END $$;
