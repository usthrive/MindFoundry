-- Migration: Feature Management System
-- Purpose: Database-driven feature flags and tier entitlements for MathFoundry
-- This allows admin to manage which features are available at each subscription tier

-- =============================================================================
-- 1. CREATE FEATURES TABLE
-- =============================================================================
-- Master list of all features in the system

CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,                           -- e.g., 'ai_hints', 'voice_assistant'
  name TEXT NOT NULL,                            -- Human-readable name
  description TEXT,                              -- What the feature does
  category TEXT NOT NULL DEFAULT 'general',      -- Grouping: 'core', 'ai', 'premium', 'support'
  is_active BOOLEAN DEFAULT TRUE,                -- Global on/off switch
  preview_available BOOLEAN DEFAULT FALSE,       -- Allow preview for lower tiers
  display_order INTEGER DEFAULT 0,               -- For UI ordering
  icon TEXT,                                     -- Emoji or icon identifier
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_features_category ON features(category);
CREATE INDEX IF NOT EXISTS idx_features_active ON features(is_active);

-- =============================================================================
-- 2. CREATE FEATURE_TIER_MAPPINGS TABLE
-- =============================================================================
-- Maps features to subscription tiers (many-to-many with metadata)

CREATE TABLE IF NOT EXISTS feature_tier_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id TEXT REFERENCES features(id) ON DELETE CASCADE,
  tier_id TEXT REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT TRUE,               -- Is this feature enabled for this tier?
  usage_limit INTEGER,                           -- Optional: usage cap per period
  limit_period TEXT,                             -- 'daily', 'weekly', 'monthly', NULL for unlimited
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_id, tier_id)                    -- Each feature-tier combo is unique
);

CREATE INDEX IF NOT EXISTS idx_feature_tier_mappings_feature ON feature_tier_mappings(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_tier_mappings_tier ON feature_tier_mappings(tier_id);

-- =============================================================================
-- 3. CREATE FEATURE_USAGE TABLE (for tracking usage limits)
-- =============================================================================

CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_id TEXT REFERENCES features(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_id);

-- =============================================================================
-- 4. SEED INITIAL FEATURES
-- =============================================================================

-- Core Features (Foundation tier - included in all tiers)
INSERT INTO features (id, name, description, category, icon, display_order, is_active)
VALUES
  ('basic_hints', 'Basic Hints', 'Static hint cards for problem solving', 'core', '💡', 10, true),
  ('progress_tracking', 'Progress Tracking', 'Track learning progress and worksheet completion', 'core', '📊', 20, true),
  ('animations', 'Animations', 'Visual animations for math concepts', 'core', '🎬', 30, true),
  ('parent_dashboard', 'Parent Dashboard', 'Dashboard for parents to monitor progress', 'core', '👨‍👩‍👧', 40, true),
  ('video_lessons', 'Video Lessons', 'Pre-recorded instructional videos', 'core', '🎥', 50, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- AI Features (Foundation AI tier)
INSERT INTO features (id, name, description, category, icon, display_order, is_active, preview_available)
VALUES
  ('ai_hints', 'AI Hints', 'AI-generated contextual hints based on specific mistakes', 'ai', '🤖', 110, true, true),
  ('ai_explanations', 'AI Explanations', 'AI explains why an answer is wrong and how to fix it', 'ai', '🧠', 120, true, true),
  ('voice_assistant', 'Voice Assistant', 'Voice-based help for reading problems and hints', 'ai', '🎤', 130, true, false),
  ('personalized_path', 'Personalized Learning', 'AI adjusts difficulty based on performance', 'ai', '🎯', 140, true, false),
  ('ai_problem_generator', 'AI Problem Generator', 'Generate custom practice problems', 'ai', '✨', 150, false, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  preview_available = EXCLUDED.preview_available,
  updated_at = NOW();

-- Premium Features (VIP tier)
INSERT INTO features (id, name, description, category, icon, display_order, is_active)
VALUES
  ('live_tutor', 'Live Tutor', 'Access to human tutors via chat or video', 'premium', '👨‍🏫', 210, true),
  ('priority_support', 'Priority Support', 'Fast response times for support requests', 'premium', '⚡', 220, true),
  ('custom_curriculum', 'Custom Curriculum', 'Create custom problem sets and learning paths', 'premium', '📝', 230, true),
  ('advanced_analytics', 'Advanced Analytics', 'Detailed performance analytics and reports', 'premium', '📈', 240, true),
  ('offline_mode', 'Offline Mode', 'Download content for offline learning', 'premium', '📱', 250, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- =============================================================================
-- 5. SEED FEATURE-TIER MAPPINGS
-- =============================================================================

-- Foundation tier gets core features
INSERT INTO feature_tier_mappings (feature_id, tier_id, is_enabled)
SELECT f.id, 'foundation', true
FROM features f
WHERE f.category = 'core' AND f.is_active = true
ON CONFLICT (feature_id, tier_id) DO UPDATE SET is_enabled = true, updated_at = NOW();

-- Foundation AI tier gets core + AI features
INSERT INTO feature_tier_mappings (feature_id, tier_id, is_enabled)
SELECT f.id, 'foundation_ai', true
FROM features f
WHERE f.category IN ('core', 'ai') AND f.is_active = true
ON CONFLICT (feature_id, tier_id) DO UPDATE SET is_enabled = true, updated_at = NOW();

-- VIP tier gets all features
INSERT INTO feature_tier_mappings (feature_id, tier_id, is_enabled)
SELECT f.id, 'vip', true
FROM features f
WHERE f.is_active = true
ON CONFLICT (feature_id, tier_id) DO UPDATE SET is_enabled = true, updated_at = NOW();

-- =============================================================================
-- 6. CREATE FUNCTION TO CHECK FEATURE ACCESS
-- =============================================================================

CREATE OR REPLACE FUNCTION user_has_feature(p_user_id UUID, p_feature_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier_id TEXT;
  v_is_enabled BOOLEAN;
  v_is_active BOOLEAN;
BEGIN
  -- Get user's current subscription tier
  SELECT subscription_tier INTO v_tier_id
  FROM users
  WHERE id = p_user_id;

  -- If no subscription, check if in free/grace period (give foundation access)
  IF v_tier_id IS NULL THEN
    SELECT subscription_status INTO v_tier_id
    FROM users
    WHERE id = p_user_id;

    IF v_tier_id IN ('free_period', 'grace_period') THEN
      v_tier_id := 'foundation';
    ELSE
      RETURN FALSE;
    END IF;
  END IF;

  -- Check if feature is globally active
  SELECT is_active INTO v_is_active
  FROM features
  WHERE id = p_feature_id;

  IF NOT v_is_active THEN
    RETURN FALSE;
  END IF;

  -- Check if feature is enabled for user's tier
  SELECT is_enabled INTO v_is_enabled
  FROM feature_tier_mappings
  WHERE feature_id = p_feature_id AND tier_id = v_tier_id;

  RETURN COALESCE(v_is_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 7. CREATE VIEW FOR EASY FEATURE QUERYING
-- =============================================================================

CREATE OR REPLACE VIEW tier_features AS
SELECT
  t.id AS tier_id,
  t.name AS tier_name,
  f.id AS feature_id,
  f.name AS feature_name,
  f.description AS feature_description,
  f.category,
  f.icon,
  f.is_active AS feature_active,
  f.preview_available,
  f.display_order,
  COALESCE(ftm.is_enabled, false) AS is_enabled,
  ftm.usage_limit,
  ftm.limit_period
FROM subscription_tiers t
CROSS JOIN features f
LEFT JOIN feature_tier_mappings ftm ON ftm.tier_id = t.id AND ftm.feature_id = f.id
WHERE t.enabled = true
ORDER BY t.display_order, f.display_order;

-- =============================================================================
-- 8. ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_tier_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Everyone can read features (needed for displaying upgrade prompts)
DROP POLICY IF EXISTS "Anyone can read features" ON features;
CREATE POLICY "Anyone can read features" ON features
  FOR SELECT USING (true);

-- Everyone can read feature mappings
DROP POLICY IF EXISTS "Anyone can read feature mappings" ON feature_tier_mappings;
CREATE POLICY "Anyone can read feature mappings" ON feature_tier_mappings
  FOR SELECT USING (true);

-- Users can read own usage
DROP POLICY IF EXISTS "Users can read own feature usage" ON feature_usage;
CREATE POLICY "Users can read own feature usage" ON feature_usage
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- 9. GRANTS
-- =============================================================================

GRANT SELECT ON features TO authenticated;
GRANT SELECT ON feature_tier_mappings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON feature_usage TO authenticated;
GRANT SELECT ON tier_features TO authenticated;

-- Service role needs full access for admin panel
GRANT ALL ON features TO service_role;
GRANT ALL ON feature_tier_mappings TO service_role;
GRANT ALL ON feature_usage TO service_role;
GRANT EXECUTE ON FUNCTION user_has_feature(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_feature(UUID, TEXT) TO service_role;
