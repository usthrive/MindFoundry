-- MindFoundry YouTube Video Integration
-- Supplementary Learning Resources for Math Tutor Application
-- Phase: Educational Video System

-- ============================================
-- Table: video_library
-- Stores curated YouTube video metadata
-- ============================================
CREATE TABLE IF NOT EXISTS video_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- YouTube identifiers
  youtube_id VARCHAR(20) NOT NULL UNIQUE,

  -- Video information
  title VARCHAR(255) NOT NULL,
  channel_name VARCHAR(100) NOT NULL,
  duration_seconds INTEGER NOT NULL,
  thumbnail_url TEXT,

  -- Classification
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('short', 'detailed')),

  -- Target audience
  min_age INTEGER NOT NULL DEFAULT 5,
  max_age INTEGER NOT NULL DEFAULT 14,
  kumon_level VARCHAR(10) NOT NULL,

  -- Quality scores (1-10 scale)
  score_age_appropriate DECIMAL(3,1),
  score_educational DECIMAL(3,1),
  score_production DECIMAL(3,1),
  score_engagement DECIMAL(3,1),
  score_safety DECIMAL(3,1),
  score_overall DECIMAL(3,1),

  -- Teaching style: song, animation, whiteboard, visual_model, lecture, demonstration, drill
  teaching_style VARCHAR(50),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for video_library
CREATE INDEX idx_video_library_youtube_id ON video_library(youtube_id);
CREATE INDEX idx_video_library_level ON video_library(kumon_level);
CREATE INDEX idx_video_library_tier ON video_library(tier);
CREATE INDEX idx_video_library_age_range ON video_library(min_age, max_age);
CREATE INDEX idx_video_library_active ON video_library(is_active) WHERE is_active = TRUE;

-- ============================================
-- Table: concept_videos
-- Maps videos to mathematical concepts
-- Uses EXISTING concept IDs from concept-availability.ts
-- ============================================
CREATE TABLE IF NOT EXISTS concept_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Concept identifier (matches CONCEPT_INTRODUCTION keys in concept-availability.ts)
  concept_id VARCHAR(100) NOT NULL,
  concept_name VARCHAR(255) NOT NULL,
  kumon_level VARCHAR(10) NOT NULL,

  -- Video assignments (short = quick refresher, detailed = deep dive)
  short_video_id UUID REFERENCES video_library(id) ON DELETE SET NULL,
  detailed_video_id UUID REFERENCES video_library(id) ON DELETE SET NULL,

  -- Display settings
  show_at_introduction BOOLEAN DEFAULT TRUE,
  show_in_hints BOOLEAN DEFAULT TRUE,
  show_in_help_menu BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(concept_id)
);

-- Indexes for concept_videos
CREATE INDEX idx_concept_videos_concept ON concept_videos(concept_id);
CREATE INDEX idx_concept_videos_level ON concept_videos(kumon_level);
CREATE INDEX idx_concept_videos_short ON concept_videos(short_video_id);
CREATE INDEX idx_concept_videos_detailed ON concept_videos(detailed_video_id);

-- ============================================
-- Table: video_views
-- Tracks video watching activity
-- ============================================
CREATE TABLE IF NOT EXISTS video_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES video_library(id) ON DELETE CASCADE,
  concept_id VARCHAR(100) NOT NULL,

  -- Context: When/why was this video suggested?
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN (
    'concept_intro',      -- New concept introduction
    'struggle_detected',  -- 3+ wrong answers
    'explicit_request',   -- Help menu or button click
    'review_mode',        -- Post-session review
    'parent_view'         -- Parent dashboard preview
  )),

  -- Session context (optional - links to practice session)
  session_id UUID REFERENCES practice_sessions(id) ON DELETE SET NULL,

  -- Viewing data
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  watch_duration_seconds INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,

  -- Feedback
  user_feedback VARCHAR(20) CHECK (user_feedback IN ('helpful', 'not_helpful', 'skipped')),

  -- Performance context (for measuring effectiveness)
  accuracy_before_video DECIMAL(5,2),
  accuracy_after_video DECIMAL(5,2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for video_views
CREATE INDEX idx_video_views_child ON video_views(child_id);
CREATE INDEX idx_video_views_video ON video_views(video_id);
CREATE INDEX idx_video_views_concept ON video_views(concept_id);
CREATE INDEX idx_video_views_session ON video_views(session_id);
CREATE INDEX idx_video_views_trigger ON video_views(trigger_type);
CREATE INDEX idx_video_views_child_date ON video_views(child_id, created_at DESC);

-- ============================================
-- Table: video_preferences
-- Parental controls and child-specific settings
-- ============================================
CREATE TABLE IF NOT EXISTS video_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE UNIQUE,

  -- Master toggle
  videos_enabled BOOLEAN DEFAULT TRUE,

  -- Auto-suggestion settings
  auto_suggest_enabled BOOLEAN DEFAULT TRUE,
  suggest_threshold INTEGER DEFAULT 3,  -- Consecutive mistakes before suggesting

  -- Display settings
  show_in_concept_intro BOOLEAN DEFAULT TRUE,
  show_in_review BOOLEAN DEFAULT TRUE,

  -- Limits
  max_videos_per_day INTEGER DEFAULT 10,
  max_video_duration_minutes INTEGER DEFAULT 15,

  -- Tracking for daily limits
  suggestions_dismissed_today INTEGER DEFAULT 0,
  videos_watched_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for video_preferences
CREATE INDEX idx_video_preferences_child ON video_preferences(child_id);

-- Trigger for updated_at on video_preferences
CREATE TRIGGER update_video_preferences_updated_at BEFORE UPDATE ON video_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on video_library
CREATE TRIGGER update_video_library_updated_at BEFORE UPDATE ON video_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE video_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_preferences ENABLE ROW LEVEL SECURITY;

-- video_library: Public read access (all users can see available videos)
CREATE POLICY "Anyone can view active videos" ON video_library
  FOR SELECT USING (is_active = TRUE);

-- concept_videos: Public read access (all users can see concept-video mappings)
CREATE POLICY "Anyone can view concept video mappings" ON concept_videos
  FOR SELECT USING (TRUE);

-- video_views: Access through child ownership
CREATE POLICY "Users can view children's video views" ON video_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_views.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's video views" ON video_views
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_views.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's video views" ON video_views
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_views.child_id
      AND children.user_id = auth.uid()
    )
  );

-- video_preferences: Access through child ownership
CREATE POLICY "Users can view children's video preferences" ON video_preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_preferences.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's video preferences" ON video_preferences
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_preferences.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's video preferences" ON video_preferences
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = video_preferences.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- Function: Reset daily video counters
-- Called when checking preferences if date changed
-- ============================================
CREATE OR REPLACE FUNCTION reset_daily_video_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_reset_date < CURRENT_DATE THEN
    NEW.suggestions_dismissed_today := 0;
    NEW.videos_watched_today := 0;
    NEW.last_reset_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER reset_video_counters_on_access
  BEFORE UPDATE ON video_preferences
  FOR EACH ROW EXECUTE FUNCTION reset_daily_video_counters();

-- ============================================
-- SEED DATA: Video Library
-- Curated educational videos from 18B document
-- ============================================

-- Level 7A-5A: Number Sense (Ages 5-7)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Counting 1-10
('Nh1QeH7PL5Y', 'Chicken Count | Count 1 to 10 | Math and Movement Song', 'Jack Hartmann Kids Music Channel', 145, 'short', 5, 7, '7A', 9.8, 'song'),
('610A2IzBm-I', 'Number Seven | Counting 1 to 10! | Part 4', 'Numberblocks', 300, 'detailed', 5, 7, '7A', 10.0, 'animation'),

-- Counting 1-100
('dNDMW2W4nQk', 'Counting 1 to 100 | Mini Math Movies', 'Scratch Garden', 165, 'short', 6, 7, '6A', 9.2, 'animation'),
('Tc3zFXVfYIg', 'COUNTING NUMBERS FOR KIDS 1 TO 100', 'Roonstudy', 360, 'detailed', 6, 7, '6A', 9.0, 'song'),

-- Number Recognition
('-zyqspTpKzM', 'PART 5 NUMBER RECOGNITION: Learn to count 1-10', 'Mister Kipley', 240, 'short', 5, 6, '7A', 10.0, 'lecture'),
('_uedvVJFeBU', '5 Fun number sense games to teach number recognition', 'Everything AJA', 525, 'detailed', 5, 6, '7A', 8.5, 'demonstration'),

-- Skip Counting
('TShHga40XgQ', 'Count by 10 Song | Skip Counting by 10', 'Jack Hartmann Kids Music Channel', 150, 'short', 6, 7, '5A', 9.8, 'song'),
('5FaBDqOmiyI', 'Skip Counting by 2s, 3s, 4s, 5s, 10s, and 100s', 'Jessalyn Saldo', 588, 'detailed', 6, 7, '5A', 8.8, 'visual_model'),

-- Number Comparison
('ka9zbPcqXBI', 'Greater Than Less Than Song for Kids', 'Silly School Songs', 200, 'short', 6, 7, '5A', 10.0, 'song'),
('rBkwSl8Tj98', 'Comparing Numbers for Kids (Grade 1)', 'Homeschool Pop', 420, 'detailed', 6, 7, '5A', 9.5, 'lecture');

-- Level 4A-2A: Basic Operations (Ages 6-8)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Addition Concept
('uONIJ5TQ2DA', 'Move and Add, Add and Move | Addition Song', 'Jack Hartmann', 225, 'short', 6, 7, '4A', 9.6, 'song'),
('kwphjyYokbY', 'Addition for Kids | Basic Addition for Kindergarten', 'Anikidz', 360, 'detailed', 6, 7, '4A', 8.8, 'animation'),

-- Addition Facts 0-10
('zl5m4e_d3xg', 'Let''s All Do the 10 Dance | Number Bonds to 10', 'Jack Hartmann', 140, 'short', 6, 7, '3A', 9.8, 'song'),
('erJlnqRfUMM', 'Addition Facts 0-10 | Practice Drills', 'Rocking Dan Teaching Man', 300, 'detailed', 6, 7, '3A', 8.8, 'drill'),

-- Addition Facts 0-20
('L_m-3-ITiX8', 'Addition Facts 11-20', 'Math & Learning Videos 4 Kids', 240, 'short', 7, 8, '2A', 8.5, 'drill'),
('183gDLvCmmo', 'Making 10 Strategy for Addition', 'Math with Mr. J', 375, 'detailed', 7, 8, '2A', 9.0, 'whiteboard'),

-- Subtraction Concept
('y2Ntn69b8Cs', 'Basic Subtraction for Kids', 'Math Antics', 240, 'short', 6, 7, '4A', 9.8, 'animation'),
('eg9iSgMAJZc', 'Subtraction with Pictures', 'Harry Kindergarten', 330, 'detailed', 6, 7, '4A', 9.5, 'visual_model'),

-- Subtraction Facts 0-20
('dslT0LOTf5w', 'Subtraction Song | Minus 1', 'Jack Hartmann', 150, 'short', 7, 8, '2A', 9.5, 'song'),
('ohur61E569w', 'Subtraction Facts 0-20 Drill', 'Kids Pride', 300, 'detailed', 7, 8, '2A', 7.5, 'drill');

-- Level A-B: Multi-Digit Operations (Ages 7-9)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Two-Digit Addition (No Carrying)
('kmhdFjgFHA8', 'Two Digit Addition No Regrouping', 'Math Antics', 180, 'short', 7, 8, 'A', 10.0, 'animation'),
('G1cNKc3PD74', 'Adding Two-Digit Numbers', 'Khan Academy', 360, 'detailed', 7, 8, 'A', 9.0, 'whiteboard'),

-- Two-Digit Addition WITH Carrying
('pjhlq31kBho', 'Two Digit Addition with Regrouping', 'MatholiaChannel', 225, 'short', 7, 8, 'B', 9.8, 'visual_model'),

-- Two-Digit Subtraction (No Borrowing)
('fbykrBCqopk', '2-Digit Subtraction No Regrouping', 'Math Quiz for Kids', 210, 'short', 7, 8, 'A', 8.5, 'drill'),
('_CcdCmYP-Wo', 'Subtraction - Two Digits', 'MatholiaChannel', 360, 'detailed', 7, 8, 'A', 9.8, 'visual_model'),

-- Two-Digit Subtraction WITH Borrowing
('YJ6FIhwHVCs', 'Subtraction with Regrouping', 'MatholiaChannel', 240, 'short', 8, 9, 'B', 9.8, 'visual_model');

-- Level C: Multiplication (Ages 8-10)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Multiplication Concept
('fZFwHpiAVE0', 'What is Multiplication? | Arrays', 'Periwinkle', 353, 'short', 8, 9, 'C', 9.0, 'animation'),

-- Times Tables 2, 5, 10
('un-kKDVFlQg', '2 Times Table Song', 'Jack Hartmann', 165, 'short', 8, 9, 'C', 9.8, 'song'),
('C3PojOwjHcc', 'Multiplication Mash Up | 1-10 Tables', 'Silly School Songs', 1200, 'detailed', 8, 9, 'C', 9.5, 'song'),

-- Times Tables 3, 4, 6
('9XzfQUXqiYY', '3 Times Table Song (Uptown Funk Cover)', 'Mr. DeMaio', 210, 'short', 8, 9, 'C', 10.0, 'song'),

-- Times Tables 7, 8, 9
('7pbwAax2zU4', '7 Times Table Song', 'Jack Hartmann', 180, 'short', 9, 10, 'C', 9.5, 'song'),

-- Multi-Digit Multiplication
('CnY7jpHR_FU', 'Area Model Multiplication Explained', 'Math with Mr. C', 240, 'short', 9, 10, 'C', 9.2, 'visual_model');

-- Level D: Division (Ages 9-11)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Division Concept
('2muobEZUalE', 'Basic Division', 'Math Antics', 300, 'short', 9, 10, 'D', 10.0, 'animation'),
('SGEPOhQ09Rc', 'Division Concept | Periwinkle', 'Periwinkle', 505, 'detailed', 9, 10, 'D', 9.0, 'animation'),

-- Division Facts
('N_8YL_VdkSU', 'Division Tables 8 Mixed Up', 'Jack Hartmann', 180, 'short', 9, 10, 'D', 9.5, 'drill'),

-- Long Division (1-Digit Divisor)
('up_xKZ6GeUg', 'Long Division with Remainders (DMSB)', 'Math with Mr. J', 300, 'short', 10, 11, 'D', 9.8, 'whiteboard'),
('LGqDdbpnXFQ', 'Long Division', 'Math Antics', 600, 'detailed', 10, 11, 'D', 10.0, 'animation'),

-- Divisibility Rules
('uiSDZ3zB_d4', 'Divisibility Rules for 2, 3, 5, 9, 10', 'Tutoring Hour', 180, 'short', 10, 11, 'D', 9.5, 'animation');

-- Level E: Fractions (Ages 9-11)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Fraction Concept
('5TaQc0HojSw', 'What is a Fraction?', 'Math and Science', 270, 'short', 9, 10, 'E', 8.8, 'lecture'),

-- Equivalent Fractions
('dBZ2QGZBH6M', 'Equivalent Fractions', 'Math with Mr. J', 300, 'short', 10, 11, 'E', 9.5, 'whiteboard'),

-- Adding Fractions (Unlike Denominators)
('7OGG9whj3CU', 'Adding Fractions with Unlike Denominators', 'Math with Mr. J', 300, 'short', 10, 11, 'E', 9.5, 'whiteboard'),

-- Multiplying Fractions
('qmfXyR7Z6Lk', 'Multiplying Fractions', 'Math Antics', 300, 'short', 11, 12, 'E', 10.0, 'animation'),

-- Dividing Fractions
('4lkq3DgvmJo', 'Dividing Fractions (Why Flip?)', 'Math Antics', 600, 'detailed', 11, 12, 'F', 10.0, 'animation'),

-- Mixed Numbers and Improper Fractions
('EpXCr2iax5E', 'Mixed Numbers to Improper Fractions', 'Math with Mr. J', 240, 'short', 10, 11, 'E', 9.5, 'whiteboard'),

-- LCM and GCF
('Y7Xav-XAhXs', 'LCM and GCF Difference', 'Math with Mr. J', 300, 'short', 11, 12, 'F', 9.5, 'whiteboard'),
('AHszBRnPbYM', 'Ladder Method for LCM and GCF', 'Kaffenate Math', 540, 'detailed', 11, 12, 'F', 9.0, 'whiteboard');

-- Level G-I: Pre-Algebra & Algebra (Ages 11-14)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Order of Operations
('dAgfnK528RA', 'Order of Operations | PEMDAS', 'Math Antics', 420, 'detailed', 11, 13, 'F', 10.0, 'animation'),

-- Integers
('XFKjQEFaEQM', 'What are Integers?', 'Math Antics', 360, 'detailed', 11, 13, 'G', 10.0, 'animation'),

-- Exponents
('-zUmvpkhvW8', 'What are Exponents?', 'Math Antics', 300, 'short', 11, 13, 'G', 10.0, 'animation'),

-- One-Step Equations
('l3XzepN03KQ', 'Solving Basic Equations', 'Math Antics', 480, 'detailed', 11, 13, 'G', 10.0, 'animation'),

-- Slope-Intercept Form
('MXV65i9g1Xg', 'Slope Intercept Form', 'Math Antics', 300, 'short', 12, 14, 'H', 10.0, 'animation');

-- Level I-L: Advanced Algebra (Ages 12-14)
INSERT INTO video_library (youtube_id, title, channel_name, duration_seconds, tier, min_age, max_age, kumon_level, score_overall, teaching_style) VALUES
-- Factoring Trinomials
('-4jANGlJRSY', 'Factoring Trinomials', 'The Organic Chemistry Tutor', 720, 'detailed', 13, 14, 'I', 9.5, 'whiteboard'),

-- Quadratic Formula
('F3eTBxCnzvI', 'Quadratic Formula', 'Brian McLogan', 600, 'detailed', 13, 14, 'I', 9.5, 'whiteboard'),
('c9iBIkclp_s', 'Quadratic Formula Song', 'Math with Mr. J', 240, 'short', 13, 14, 'I', 9.0, 'song'),

-- Polynomial Division
('8lT00iLntFc', 'Polynomial Long Division', 'The Organic Chemistry Tutor', 720, 'detailed', 13, 14, 'J', 9.5, 'whiteboard'),
('SbUiZx5a0Ok', 'Polynomial Division Basics', 'Brian McLogan', 300, 'short', 13, 14, 'J', 9.0, 'whiteboard');


-- ============================================
-- SEED DATA: Concept-Video Mappings
-- Maps videos to EXISTING concept IDs from concept-availability.ts
-- ============================================

-- Get video IDs for mapping
DO $$
DECLARE
  v_counting_to_10_short UUID;
  v_counting_to_10_detailed UUID;
  v_counting_to_100_short UUID;
  v_counting_to_100_detailed UUID;
  v_number_recognition_short UUID;
  v_number_recognition_detailed UUID;
  v_skip_counting_short UUID;
  v_skip_counting_detailed UUID;
  v_comparison_short UUID;
  v_comparison_detailed UUID;
  v_addition_concept_short UUID;
  v_addition_concept_detailed UUID;
  v_addition_facts_10_short UUID;
  v_addition_facts_10_detailed UUID;
  v_addition_facts_20_short UUID;
  v_addition_facts_20_detailed UUID;
  v_subtraction_concept_short UUID;
  v_subtraction_concept_detailed UUID;
  v_subtraction_facts_short UUID;
  v_subtraction_facts_detailed UUID;
  v_two_digit_add_no_carry_short UUID;
  v_two_digit_add_no_carry_detailed UUID;
  v_two_digit_add_carry_short UUID;
  v_two_digit_sub_no_borrow_short UUID;
  v_two_digit_sub_no_borrow_detailed UUID;
  v_two_digit_sub_borrow_short UUID;
  v_multiplication_concept_short UUID;
  v_times_table_2_5_10_short UUID;
  v_times_table_2_5_10_detailed UUID;
  v_times_table_3_4_6_short UUID;
  v_times_table_7_8_9_short UUID;
  v_multi_digit_mult_short UUID;
  v_division_concept_short UUID;
  v_division_concept_detailed UUID;
  v_division_facts_short UUID;
  v_long_division_short UUID;
  v_long_division_detailed UUID;
  v_divisibility_short UUID;
  v_fraction_concept_short UUID;
  v_equivalent_fractions_short UUID;
  v_adding_fractions_unlike_short UUID;
  v_multiplying_fractions_short UUID;
  v_dividing_fractions_detailed UUID;
  v_mixed_numbers_short UUID;
  v_lcm_gcf_short UUID;
  v_lcm_gcf_detailed UUID;
  v_order_of_ops_detailed UUID;
  v_integers_detailed UUID;
  v_exponents_short UUID;
  v_equations_detailed UUID;
  v_slope_intercept_short UUID;
  v_factoring_detailed UUID;
  v_quadratic_formula_detailed UUID;
  v_quadratic_formula_short UUID;
  v_polynomial_div_detailed UUID;
  v_polynomial_div_short UUID;
BEGIN
  -- Get video IDs
  SELECT id INTO v_counting_to_10_short FROM video_library WHERE youtube_id = 'Nh1QeH7PL5Y';
  SELECT id INTO v_counting_to_10_detailed FROM video_library WHERE youtube_id = '610A2IzBm-I';
  SELECT id INTO v_counting_to_100_short FROM video_library WHERE youtube_id = 'dNDMW2W4nQk';
  SELECT id INTO v_counting_to_100_detailed FROM video_library WHERE youtube_id = 'Tc3zFXVfYIg';
  SELECT id INTO v_number_recognition_short FROM video_library WHERE youtube_id = '-zyqspTpKzM';
  SELECT id INTO v_number_recognition_detailed FROM video_library WHERE youtube_id = '_uedvVJFeBU';
  SELECT id INTO v_skip_counting_short FROM video_library WHERE youtube_id = 'TShHga40XgQ';
  SELECT id INTO v_skip_counting_detailed FROM video_library WHERE youtube_id = '5FaBDqOmiyI';
  SELECT id INTO v_comparison_short FROM video_library WHERE youtube_id = 'ka9zbPcqXBI';
  SELECT id INTO v_comparison_detailed FROM video_library WHERE youtube_id = 'rBkwSl8Tj98';
  SELECT id INTO v_addition_concept_short FROM video_library WHERE youtube_id = 'uONIJ5TQ2DA';
  SELECT id INTO v_addition_concept_detailed FROM video_library WHERE youtube_id = 'kwphjyYokbY';
  SELECT id INTO v_addition_facts_10_short FROM video_library WHERE youtube_id = 'zl5m4e_d3xg';
  SELECT id INTO v_addition_facts_10_detailed FROM video_library WHERE youtube_id = 'erJlnqRfUMM';
  SELECT id INTO v_addition_facts_20_short FROM video_library WHERE youtube_id = 'L_m-3-ITiX8';
  SELECT id INTO v_addition_facts_20_detailed FROM video_library WHERE youtube_id = '183gDLvCmmo';
  SELECT id INTO v_subtraction_concept_short FROM video_library WHERE youtube_id = 'y2Ntn69b8Cs';
  SELECT id INTO v_subtraction_concept_detailed FROM video_library WHERE youtube_id = 'eg9iSgMAJZc';
  SELECT id INTO v_subtraction_facts_short FROM video_library WHERE youtube_id = 'dslT0LOTf5w';
  SELECT id INTO v_subtraction_facts_detailed FROM video_library WHERE youtube_id = 'ohur61E569w';
  SELECT id INTO v_two_digit_add_no_carry_short FROM video_library WHERE youtube_id = 'kmhdFjgFHA8';
  SELECT id INTO v_two_digit_add_no_carry_detailed FROM video_library WHERE youtube_id = 'G1cNKc3PD74';
  SELECT id INTO v_two_digit_add_carry_short FROM video_library WHERE youtube_id = 'pjhlq31kBho';
  SELECT id INTO v_two_digit_sub_no_borrow_short FROM video_library WHERE youtube_id = 'fbykrBCqopk';
  SELECT id INTO v_two_digit_sub_no_borrow_detailed FROM video_library WHERE youtube_id = '_CcdCmYP-Wo';
  SELECT id INTO v_two_digit_sub_borrow_short FROM video_library WHERE youtube_id = 'YJ6FIhwHVCs';
  SELECT id INTO v_multiplication_concept_short FROM video_library WHERE youtube_id = 'fZFwHpiAVE0';
  SELECT id INTO v_times_table_2_5_10_short FROM video_library WHERE youtube_id = 'un-kKDVFlQg';
  SELECT id INTO v_times_table_2_5_10_detailed FROM video_library WHERE youtube_id = 'C3PojOwjHcc';
  SELECT id INTO v_times_table_3_4_6_short FROM video_library WHERE youtube_id = '9XzfQUXqiYY';
  SELECT id INTO v_times_table_7_8_9_short FROM video_library WHERE youtube_id = '7pbwAax2zU4';
  SELECT id INTO v_multi_digit_mult_short FROM video_library WHERE youtube_id = 'CnY7jpHR_FU';
  SELECT id INTO v_division_concept_short FROM video_library WHERE youtube_id = '2muobEZUalE';
  SELECT id INTO v_division_concept_detailed FROM video_library WHERE youtube_id = 'SGEPOhQ09Rc';
  SELECT id INTO v_division_facts_short FROM video_library WHERE youtube_id = 'N_8YL_VdkSU';
  SELECT id INTO v_long_division_short FROM video_library WHERE youtube_id = 'up_xKZ6GeUg';
  SELECT id INTO v_long_division_detailed FROM video_library WHERE youtube_id = 'LGqDdbpnXFQ';
  SELECT id INTO v_divisibility_short FROM video_library WHERE youtube_id = 'uiSDZ3zB_d4';
  SELECT id INTO v_fraction_concept_short FROM video_library WHERE youtube_id = '5TaQc0HojSw';
  SELECT id INTO v_equivalent_fractions_short FROM video_library WHERE youtube_id = 'dBZ2QGZBH6M';
  SELECT id INTO v_adding_fractions_unlike_short FROM video_library WHERE youtube_id = '7OGG9whj3CU';
  SELECT id INTO v_multiplying_fractions_short FROM video_library WHERE youtube_id = 'qmfXyR7Z6Lk';
  SELECT id INTO v_dividing_fractions_detailed FROM video_library WHERE youtube_id = '4lkq3DgvmJo';
  SELECT id INTO v_mixed_numbers_short FROM video_library WHERE youtube_id = 'EpXCr2iax5E';
  SELECT id INTO v_lcm_gcf_short FROM video_library WHERE youtube_id = 'Y7Xav-XAhXs';
  SELECT id INTO v_lcm_gcf_detailed FROM video_library WHERE youtube_id = 'AHszBRnPbYM';
  SELECT id INTO v_order_of_ops_detailed FROM video_library WHERE youtube_id = 'dAgfnK528RA';
  SELECT id INTO v_integers_detailed FROM video_library WHERE youtube_id = 'XFKjQEFaEQM';
  SELECT id INTO v_exponents_short FROM video_library WHERE youtube_id = '-zUmvpkhvW8';
  SELECT id INTO v_equations_detailed FROM video_library WHERE youtube_id = 'l3XzepN03KQ';
  SELECT id INTO v_slope_intercept_short FROM video_library WHERE youtube_id = 'MXV65i9g1Xg';
  SELECT id INTO v_factoring_detailed FROM video_library WHERE youtube_id = '-4jANGlJRSY';
  SELECT id INTO v_quadratic_formula_detailed FROM video_library WHERE youtube_id = 'F3eTBxCnzvI';
  SELECT id INTO v_quadratic_formula_short FROM video_library WHERE youtube_id = 'c9iBIkclp_s';
  SELECT id INTO v_polynomial_div_detailed FROM video_library WHERE youtube_id = '8lT00iLntFc';
  SELECT id INTO v_polynomial_div_short FROM video_library WHERE youtube_id = 'SbUiZx5a0Ok';

  -- Insert concept-video mappings using EXISTING concept IDs from concept-availability.ts
  INSERT INTO concept_videos (concept_id, concept_name, kumon_level, short_video_id, detailed_video_id) VALUES
  -- Level 7A: Counting Basics
  ('counting_to_5', 'Counting to 5', '7A', v_counting_to_10_short, v_counting_to_10_detailed),
  ('counting_to_10', 'Counting to 10', '7A', v_counting_to_10_short, v_counting_to_10_detailed),
  ('number_recognition_to_10', 'Number Recognition 1-10', '7A', v_number_recognition_short, v_number_recognition_detailed),
  ('dot_pattern_recognition', 'Dot Patterns', '7A', v_number_recognition_short, v_number_recognition_detailed),

  -- Level 6A: Counting to 30
  ('counting_to_20', 'Counting to 20', '6A', v_counting_to_100_short, v_counting_to_100_detailed),
  ('counting_to_30', 'Counting to 30', '6A', v_counting_to_100_short, v_counting_to_100_detailed),
  ('number_reading_to_10', 'Reading Numbers to 10', '6A', v_number_recognition_short, v_number_recognition_detailed),

  -- Level 5A: Number Sequences
  ('number_sequences', 'Number Sequences', '5A', v_skip_counting_short, v_skip_counting_detailed),
  ('sequence_to_30', 'Sequences to 30', '5A', v_skip_counting_short, v_skip_counting_detailed),
  ('sequence_to_40', 'Sequences to 40', '5A', v_skip_counting_short, v_skip_counting_detailed),
  ('sequence_to_50', 'Sequences to 50', '5A', v_skip_counting_short, v_skip_counting_detailed),

  -- Level 3A: Adding 1, 2, 3
  ('addition_plus_1', 'Adding One', '3A', v_addition_concept_short, v_addition_concept_detailed),
  ('addition_plus_2', 'Adding Two', '3A', v_addition_concept_short, v_addition_concept_detailed),
  ('addition_plus_3', 'Adding Three', '3A', v_addition_concept_short, v_addition_concept_detailed),
  ('addition_mixed_1_2_3', 'Adding 1, 2, or 3', '3A', v_addition_facts_10_short, v_addition_facts_10_detailed),

  -- Level 2A: Adding 4-10
  ('addition_plus_4', 'Adding Four', '2A', v_addition_facts_10_short, v_addition_facts_10_detailed),
  ('addition_plus_5', 'Adding Five', '2A', v_addition_facts_10_short, v_addition_facts_10_detailed),
  ('addition_plus_6', 'Adding Six', '2A', v_addition_facts_20_short, v_addition_facts_20_detailed),
  ('addition_plus_7', 'Adding Seven', '2A', v_addition_facts_20_short, v_addition_facts_20_detailed),
  ('addition_plus_8', 'Adding Eight', '2A', v_addition_facts_20_short, v_addition_facts_20_detailed),
  ('addition_plus_9', 'Adding Nine', '2A', v_addition_facts_20_short, v_addition_facts_20_detailed),
  ('addition_plus_10', 'Adding Ten', '2A', v_addition_facts_20_short, v_addition_facts_20_detailed),
  ('addition_up_to_10', 'Sums to 10', '2A', v_addition_facts_10_short, v_addition_facts_10_detailed),

  -- Level A: Subtraction
  ('subtraction', 'Taking Away', 'A', v_subtraction_concept_short, v_subtraction_concept_detailed),
  ('subtraction_minus_1', 'Subtract One', 'A', v_subtraction_concept_short, v_subtraction_concept_detailed),
  ('subtraction_minus_2', 'Subtract Two', 'A', v_subtraction_concept_short, v_subtraction_concept_detailed),
  ('subtraction_minus_3', 'Subtract Three', 'A', v_subtraction_concept_short, v_subtraction_concept_detailed),
  ('subtraction_up_to_3', 'Subtracting 1, 2, 3', 'A', v_subtraction_facts_short, v_subtraction_facts_detailed),
  ('subtraction_up_to_5', 'Subtracting to 5', 'A', v_subtraction_facts_short, v_subtraction_facts_detailed),
  ('subtraction_from_10', 'From 10', 'A', v_subtraction_facts_short, v_subtraction_facts_detailed),
  ('subtraction_from_20', 'From 20', 'A', v_subtraction_facts_short, v_subtraction_facts_detailed),

  -- Level B: Multi-digit & Regrouping
  ('vertical_format', 'Stacking Numbers', 'B', v_two_digit_add_no_carry_short, v_two_digit_add_no_carry_detailed),
  ('vertical_addition', 'Adding in Columns', 'B', v_two_digit_add_no_carry_short, v_two_digit_add_no_carry_detailed),
  ('carrying', 'Carrying to Tens', 'B', v_two_digit_add_carry_short, v_two_digit_add_no_carry_detailed),
  ('addition_2digit', 'Two-Digit Addition', 'B', v_two_digit_add_carry_short, v_two_digit_add_no_carry_detailed),
  ('vertical_subtraction', 'Subtracting in Columns', 'B', v_two_digit_sub_no_borrow_short, v_two_digit_sub_no_borrow_detailed),
  ('borrowing', 'Borrowing from Tens', 'B', v_two_digit_sub_borrow_short, v_two_digit_sub_no_borrow_detailed),
  ('subtraction_2digit', 'Two-Digit Subtraction', 'B', v_two_digit_sub_borrow_short, v_two_digit_sub_no_borrow_detailed),

  -- Level C: Multiplication & Division
  ('multiplication', 'Groups and Arrays', 'C', v_multiplication_concept_short, v_times_table_2_5_10_detailed),
  ('times_table_2_3', '2s and 3s Tables', 'C', v_times_table_2_5_10_short, v_times_table_2_5_10_detailed),
  ('times_table_4_5', '4s and 5s Tables', 'C', v_times_table_2_5_10_short, v_times_table_2_5_10_detailed),
  ('times_table_6_7', '6s and 7s Tables', 'C', v_times_table_3_4_6_short, v_times_table_2_5_10_detailed),
  ('times_table_8_9', '8s and 9s Tables', 'C', v_times_table_7_8_9_short, v_times_table_2_5_10_detailed),
  ('multiplication_2digit_by_1digit', 'Bigger Multiplication', 'C', v_multi_digit_mult_short, v_times_table_2_5_10_detailed),
  ('division', 'Fair Sharing', 'C', v_division_concept_short, v_division_concept_detailed),
  ('division_with_remainder', 'Remainders', 'C', v_division_facts_short, v_division_concept_detailed),
  ('division_2digit_by_1digit', 'Long Division', 'C', v_long_division_short, v_long_division_detailed),

  -- Level D: Advanced Operations & Fractions Intro
  ('long_division', 'Long Division Mastery', 'D', v_long_division_short, v_long_division_detailed),
  ('long_division_by_2digit', 'Dividing by Two Digits', 'D', v_long_division_short, v_long_division_detailed),
  ('fractions_intro', 'Parts of a Whole', 'D', v_fraction_concept_short, v_equivalent_fractions_short),
  ('fraction_identification', 'Reading Fractions', 'D', v_fraction_concept_short, v_equivalent_fractions_short),
  ('equivalent_fractions', 'Equal Fractions', 'D', v_equivalent_fractions_short, v_equivalent_fractions_short),
  ('reducing_fractions', 'Simplifying Fractions', 'D', v_equivalent_fractions_short, v_equivalent_fractions_short),

  -- Level E: Fraction Operations
  ('fraction_addition', 'Adding Fractions', 'E', v_adding_fractions_unlike_short, v_adding_fractions_unlike_short),
  ('fraction_add_same_denom', 'Same Denominator Addition', 'E', v_adding_fractions_unlike_short, v_adding_fractions_unlike_short),
  ('fraction_add_diff_denom', 'Different Denominators', 'E', v_adding_fractions_unlike_short, v_adding_fractions_unlike_short),
  ('fraction_subtraction', 'Subtracting Fractions', 'E', v_adding_fractions_unlike_short, v_adding_fractions_unlike_short),
  ('fraction_multiply', 'Multiplying Fractions', 'E', v_multiplying_fractions_short, v_dividing_fractions_detailed),
  ('fraction_divide', 'Dividing Fractions', 'E', v_multiplying_fractions_short, v_dividing_fractions_detailed),
  ('four_operations_fractions', 'Fraction Mastery', 'E', v_multiplying_fractions_short, v_dividing_fractions_detailed),

  -- Level F: Order of Operations & Decimals
  ('order_of_operations', 'PEMDAS', 'F', v_order_of_ops_detailed, v_order_of_ops_detailed),
  ('order_of_operations_fractions', 'Order with Fractions', 'F', v_order_of_ops_detailed, v_order_of_ops_detailed),

  -- Level G: Integers & Pre-Algebra
  ('negative_numbers', 'Negative Numbers', 'G', v_integers_detailed, v_integers_detailed),
  ('integer_addition', 'Adding Integers', 'G', v_integers_detailed, v_integers_detailed),
  ('integer_subtraction', 'Subtracting Integers', 'G', v_integers_detailed, v_integers_detailed),
  ('linear_equations', 'Solving Equations', 'G', v_equations_detailed, v_equations_detailed),

  -- Level H: Systems & Functions
  ('simultaneous_equations', 'Systems of Equations', 'H', v_slope_intercept_short, v_equations_detailed),
  ('system_2_variables', 'Two-Variable Systems', 'H', v_slope_intercept_short, v_equations_detailed),

  -- Level I: Quadratics
  ('factoring', 'Factoring', 'I', v_factoring_detailed, v_factoring_detailed),
  ('factor_trinomial', 'Factoring Trinomials', 'I', v_factoring_detailed, v_factoring_detailed),
  ('quadratic_equations', 'Quadratic Equations', 'I', v_quadratic_formula_short, v_quadratic_formula_detailed),
  ('quadratic_formula', 'The Quadratic Formula', 'I', v_quadratic_formula_short, v_quadratic_formula_detailed),

  -- Level J: Advanced Algebra
  ('polynomial_division', 'Polynomial Division', 'J', v_polynomial_div_short, v_polynomial_div_detailed);

END $$;

-- ============================================
-- Grant permissions for service role
-- ============================================
GRANT ALL ON video_library TO service_role;
GRANT ALL ON concept_videos TO service_role;
GRANT ALL ON video_views TO service_role;
GRANT ALL ON video_preferences TO service_role;

GRANT SELECT ON video_library TO anon;
GRANT SELECT ON concept_videos TO anon;

-- Success message
DO $$ BEGIN RAISE NOTICE 'YouTube Video Integration migration completed successfully'; END $$;
