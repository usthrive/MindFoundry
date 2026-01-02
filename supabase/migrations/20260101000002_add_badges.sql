-- Badge System for MindFoundry
-- Supports both level-based badges and milestone badges

-- Badge definitions table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('level', 'milestone')),

  -- For level badges
  level_range_start TEXT,
  level_range_end TEXT,

  -- For milestone badges
  milestone_type TEXT CHECK (milestone_type IN ('problems', 'streak', 'accuracy')),
  milestone_value INTEGER,

  -- Appearance
  color TEXT NOT NULL CHECK (color IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  tier INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Child's earned badges
CREATE TABLE IF NOT EXISTS child_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_child_badges_child ON child_badges(child_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);

-- RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_badges ENABLE ROW LEVEL SECURITY;

-- Badges are public (read-only for all authenticated users)
CREATE POLICY "Badges are viewable by all" ON badges
  FOR SELECT USING (true);

-- Child badges follow child ownership
CREATE POLICY "Users can view children's badges" ON child_badges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children WHERE children.id = child_badges.child_id AND children.user_id = auth.uid())
  );

CREATE POLICY "Users can insert children's badges" ON child_badges
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children WHERE children.id = child_badges.child_id AND children.user_id = auth.uid())
  );

-- Seed level-based badges
INSERT INTO badges (name, display_name, description, icon, badge_type, level_range_start, level_range_end, color, tier) VALUES
  ('level_bronze', 'Bronze Scholar', 'Reached levels 7A-5A', '🥉', 'level', '7A', '5A', 'bronze', 1),
  ('level_silver', 'Silver Scholar', 'Reached levels 4A-2A', '🥈', 'level', '4A', '2A', 'silver', 2),
  ('level_gold', 'Gold Scholar', 'Reached levels A-C', '🥇', 'level', 'A', 'C', 'gold', 3),
  ('level_platinum', 'Platinum Scholar', 'Reached levels D-F', '🏆', 'level', 'D', 'F', 'platinum', 4),
  ('level_diamond', 'Diamond Scholar', 'Reached level G and beyond', '💎', 'level', 'G', 'O', 'diamond', 5)
ON CONFLICT (name) DO NOTHING;

-- Seed milestone badges (problems solved)
INSERT INTO badges (name, display_name, description, icon, badge_type, milestone_type, milestone_value, color, tier) VALUES
  ('problems_100', 'Problem Solver', 'Solved 100 problems', '💯', 'milestone', 'problems', 100, 'bronze', 1),
  ('problems_500', 'Math Warrior', 'Solved 500 problems', '⚔️', 'milestone', 'problems', 500, 'silver', 2),
  ('problems_1000', 'Math Master', 'Solved 1000 problems', '🧙', 'milestone', 'problems', 1000, 'gold', 3),
  ('problems_5000', 'Math Legend', 'Solved 5000 problems', '👑', 'milestone', 'problems', 5000, 'platinum', 4)
ON CONFLICT (name) DO NOTHING;

-- Seed milestone badges (streaks)
INSERT INTO badges (name, display_name, description, icon, badge_type, milestone_type, milestone_value, color, tier) VALUES
  ('streak_7', 'Week Warrior', '7-day practice streak', '🔥', 'milestone', 'streak', 7, 'bronze', 1),
  ('streak_14', 'Fortnight Fighter', '14-day practice streak', '⚡', 'milestone', 'streak', 14, 'silver', 2),
  ('streak_30', 'Month Master', '30-day practice streak', '🌟', 'milestone', 'streak', 30, 'gold', 3),
  ('streak_100', 'Century Champion', '100-day practice streak', '🏅', 'milestone', 'streak', 100, 'diamond', 4)
ON CONFLICT (name) DO NOTHING;

-- Seed milestone badges (accuracy)
INSERT INTO badges (name, display_name, description, icon, badge_type, milestone_type, milestone_value, color, tier) VALUES
  ('accuracy_80', 'Focused Mind', '80% accuracy (min 50 problems)', '🎯', 'milestone', 'accuracy', 80, 'bronze', 1),
  ('accuracy_90', 'Sharp Mind', '90% accuracy (min 100 problems)', '🧠', 'milestone', 'accuracy', 90, 'silver', 2),
  ('accuracy_95', 'Brilliant Mind', '95% accuracy (min 200 problems)', '✨', 'milestone', 'accuracy', 95, 'gold', 3)
ON CONFLICT (name) DO NOTHING;

-- Comments
COMMENT ON TABLE badges IS 'Badge definitions for achievements';
COMMENT ON TABLE child_badges IS 'Badges earned by each child';
