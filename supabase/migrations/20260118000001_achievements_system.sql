-- MindFoundry Achievements & Celebrations System
-- Shareable Achievement Celebrations Feature

-- ============================================
-- Table: achievements
-- Stores all earned achievements for children
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Achievement type: streak_milestone, level_complete, skill_mastery,
  -- perfect_session, belt_earned, speed_milestone, first_problem
  achievement_type TEXT NOT NULL,

  -- Achievement-specific data (varies by type)
  -- For streak: { "streak_count": 7 }
  -- For level_complete: { "level": "6A" }
  -- For skill_mastery: { "skill": "addition", "mastery_pct": 95 }
  -- For perfect_session: { "session_id": "...", "problems_count": 20 }
  -- For belt_earned: { "belt": "white", "belt_level": 1 }
  achievement_data JSONB NOT NULL DEFAULT '{}',

  -- Celebration intensity level
  celebration_level TEXT NOT NULL CHECK (celebration_level IN ('micro', 'minor', 'moderate', 'major', 'legendary')),

  -- Tracking
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shared BOOLEAN DEFAULT FALSE,
  share_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for achievements
CREATE INDEX idx_achievements_child_id ON achievements(child_id);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
CREATE INDEX idx_achievements_earned_at ON achievements(earned_at DESC);
CREATE INDEX idx_achievements_celebration_level ON achievements(celebration_level);
CREATE INDEX idx_achievements_child_type ON achievements(child_id, achievement_type);

-- ============================================
-- Table: share_events
-- Tracks when and how achievements are shared
-- ============================================
CREATE TABLE IF NOT EXISTS share_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Share method: parent, save, native_share, copy_link
  share_method TEXT NOT NULL CHECK (share_method IN ('parent', 'save', 'native_share', 'copy_link')),

  -- Card format used (if applicable)
  card_format TEXT CHECK (card_format IN ('square', 'story', 'wide')),

  -- Theme used for share card
  card_theme TEXT DEFAULT 'default',

  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for share_events
CREATE INDEX idx_share_events_achievement ON share_events(achievement_id);
CREATE INDEX idx_share_events_child ON share_events(child_id);
CREATE INDEX idx_share_events_method ON share_events(share_method);
CREATE INDEX idx_share_events_shared_at ON share_events(shared_at DESC);

-- ============================================
-- Table: parent_achievement_notifications
-- Notifications sent to parents about child achievements
-- ============================================
CREATE TABLE IF NOT EXISTS parent_achievement_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Notification status
  read BOOLEAN DEFAULT FALSE,
  responded BOOLEAN DEFAULT FALSE,

  -- Parent response (encouragement back to child)
  response_type TEXT CHECK (response_type IN ('encouragement', 'reaction', 'message')),
  response_content TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ
);

-- Indexes for parent_achievement_notifications
CREATE INDEX idx_parent_notifications_parent ON parent_achievement_notifications(parent_id);
CREATE INDEX idx_parent_notifications_achievement ON parent_achievement_notifications(achievement_id);
CREATE INDEX idx_parent_notifications_child ON parent_achievement_notifications(child_id);
CREATE INDEX idx_parent_notifications_unread ON parent_achievement_notifications(parent_id) WHERE read = FALSE;
CREATE INDEX idx_parent_notifications_created ON parent_achievement_notifications(created_at DESC);

-- ============================================
-- Table: celebration_config
-- Configurable celebration settings per child
-- ============================================
CREATE TABLE IF NOT EXISTS celebration_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Enable/disable celebrations
  celebrations_enabled BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,

  -- Preferred theme: default, space, ocean, forest, candy
  preferred_theme TEXT DEFAULT 'default',

  -- Auto-share settings
  auto_notify_parent BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(child_id)
);

-- Trigger for updated_at
CREATE TRIGGER update_celebration_config_updated_at BEFORE UPDATE ON celebration_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_achievement_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE celebration_config ENABLE ROW LEVEL SECURITY;

-- Achievements: Access through child ownership
CREATE POLICY "Users can view children's achievements" ON achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = achievements.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's achievements" ON achievements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = achievements.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's achievements" ON achievements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = achievements.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Share events: Access through child ownership
CREATE POLICY "Users can view children's share events" ON share_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = share_events.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's share events" ON share_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = share_events.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Parent notifications: Parents can see their own notifications
CREATE POLICY "Parents can view own notifications" ON parent_achievement_notifications
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can update own notifications" ON parent_achievement_notifications
  FOR UPDATE USING (auth.uid() = parent_id);

-- Allow users to create notifications for themselves (as parent of the child)
CREATE POLICY "Users can create notifications for own children" ON parent_achievement_notifications
  FOR INSERT WITH CHECK (
    auth.uid() = parent_id AND
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = parent_achievement_notifications.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Celebration config: Access through child ownership
CREATE POLICY "Users can view children's celebration config" ON celebration_config
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = celebration_config.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert children's celebration config" ON celebration_config
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = celebration_config.child_id
      AND children.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update children's celebration config" ON celebration_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = celebration_config.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- Function: Update achievement share count
-- Called when a share event is created
-- ============================================
CREATE OR REPLACE FUNCTION increment_achievement_share_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE achievements
  SET share_count = share_count + 1, shared = TRUE
  WHERE id = NEW.achievement_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER increment_share_count_on_share
  AFTER INSERT ON share_events
  FOR EACH ROW EXECUTE FUNCTION increment_achievement_share_count();

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE achievements IS 'Stores all earned achievements for children';
COMMENT ON TABLE share_events IS 'Tracks when and how achievements are shared';
COMMENT ON TABLE parent_achievement_notifications IS 'Notifications sent to parents about child achievements';
COMMENT ON TABLE celebration_config IS 'Per-child celebration preferences and settings';

COMMENT ON COLUMN achievements.celebration_level IS 'Intensity: micro (1-2s), minor (3-5s), moderate (5-8s), major (8-12s), legendary (12-15s)';
COMMENT ON COLUMN achievements.achievement_data IS 'JSON data specific to achievement type';
COMMENT ON COLUMN share_events.card_format IS 'Image dimensions: square (1080x1080), story (1080x1920), wide (1200x628)';
