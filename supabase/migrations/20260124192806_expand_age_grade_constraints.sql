-- Migration: Expand age and grade level constraints
-- Purpose: Support students from Pre-K (age 3) through 12th grade (age 18)
-- This aligns with the full Kumon curriculum from level 7A through level O

-- Expand age constraint from 4-11 to 3-18
-- Allows Pre-K students (age 3) and high school students (up to age 18)
ALTER TABLE children DROP CONSTRAINT IF EXISTS children_age_check;
ALTER TABLE children ADD CONSTRAINT children_age_check CHECK (age >= 3 AND age <= 18);

-- Expand grade_level constraint from 0-6 to -2 to 12
-- -2 = Pre-K, -1 = Pre-K+, 0 = Kindergarten, 1-12 = 1st through 12th grade
ALTER TABLE children DROP CONSTRAINT IF EXISTS children_grade_level_check;
ALTER TABLE children ADD CONSTRAINT children_grade_level_check CHECK (grade_level >= -2 AND grade_level <= 12);
