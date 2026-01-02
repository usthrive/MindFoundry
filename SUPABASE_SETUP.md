# MindFoundry - Supabase Database Setup Guide

**Date:** January 1, 2026
**Status:** Frontend code complete, database migrations pending

---

## Overview

This document contains the SQL migrations that need to be run in your Supabase project to enable:
1. **Parent PIN Protection** - 4-digit PIN to prevent children from switching profiles
2. **Badge System** - Level-based and milestone-based achievement badges

---

## How to Run These Migrations

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your MindFoundry project
3. Navigate to **SQL Editor** (left sidebar)
4. Copy and paste each migration below
5. Click **Run** to execute

---

## Migration 1: Parent PIN Protection

**Purpose:** Adds a `parent_pin` column to the `users` table for protecting child profile switching.

```sql
-- Add parent_pin column to users table for child profile switching protection
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_pin TEXT;

-- Add check constraint for 4-digit PIN format (digits only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'parent_pin_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT parent_pin_format
      CHECK (parent_pin IS NULL OR parent_pin ~ '^[0-9]{4}$');
  END IF;
END $$;

COMMENT ON COLUMN users.parent_pin IS '4-digit PIN for parent verification when switching child profiles';
```

---

## Migration 2: Badge System

**Purpose:** Creates the badge system with level-based and milestone badges.

```sql
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
```

---

## Code Changes Already Completed

All frontend code changes have been made and will persist. Here's what was implemented:

### New Files Created:
| File | Purpose |
|------|---------|
| `frontend/src/components/auth/PinEntryModal.tsx` | 4-digit PIN entry modal |
| `frontend/src/components/auth/PinSetup.tsx` | PIN creation during onboarding |
| `frontend/src/components/badges/BadgeDisplay.tsx` | Badge display components |
| `frontend/src/utils/badgeSystem.ts` | Badge logic and color mappings |
| `supabase/migrations/20260101000001_add_parent_pin.sql` | Parent PIN migration |
| `supabase/migrations/20260101000002_add_badges.sql` | Badge system migration |

### Modified Files:
| File | Changes |
|------|---------|
| `frontend/src/components/navigation/BottomNav.tsx` | Removed duplicate nav buttons |
| `frontend/src/pages/ChildSelectPage.tsx` | Added PIN modal, mobile responsive |
| `frontend/src/pages/StudyPage.tsx` | Badge checking, mobile responsive |
| `frontend/src/pages/OnboardingPage.tsx` | PIN setup step for parents |
| `frontend/src/services/userService.ts` | PIN functions added |
| `frontend/src/services/progressService.ts` | Streak calculation, daily practice |
| `frontend/src/components/children/ChildSelector.tsx` | Badge-colored borders |

---

## Badge System Details

### Level Badges (Based on Kumon Level)
| Badge | Levels | Color | Icon |
|-------|--------|-------|------|
| Bronze Scholar | 7A-5A | Bronze | 🥉 |
| Silver Scholar | 4A-2A | Silver | 🥈 |
| Gold Scholar | A-C | Gold | 🥇 |
| Platinum Scholar | D-F | Platinum | 🏆 |
| Diamond Scholar | G+ | Diamond | 💎 |

### Milestone Badges
| Category | Badge | Requirement | Color |
|----------|-------|-------------|-------|
| Problems | Problem Solver | 100 solved | Bronze |
| Problems | Math Warrior | 500 solved | Silver |
| Problems | Math Master | 1000 solved | Gold |
| Problems | Math Legend | 5000 solved | Platinum |
| Streak | Week Warrior | 7 days | Bronze |
| Streak | Fortnight Fighter | 14 days | Silver |
| Streak | Month Master | 30 days | Gold |
| Streak | Century Champion | 100 days | Diamond |
| Accuracy | Focused Mind | 80% (50+ problems) | Bronze |
| Accuracy | Sharp Mind | 90% (100+ problems) | Silver |
| Accuracy | Brilliant Mind | 95% (200+ problems) | Gold |

---

## PIN Protection Flow

1. **Setup:** Parent creates optional 4-digit PIN during onboarding
2. **Usage:** PIN required when switching between child profiles
3. **Security:** 3 attempts allowed before modal closes
4. **Skip:** Adding new child and viewing progress do NOT require PIN

---

## Testing Checklist

After running migrations, test:

- [ ] Create a new parent account - PIN setup screen appears
- [ ] Set a PIN and verify it's saved
- [ ] Add multiple children
- [ ] Switch between children - PIN modal should appear
- [ ] Complete a practice session - check if streak updates
- [ ] Complete problems - check if badges are awarded
- [ ] View Progress dashboard - verify data shows correctly

---

## Troubleshooting

### If migrations fail:
1. Check if tables already exist: `SELECT * FROM badges LIMIT 1;`
2. Check RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'badges';`
3. Verify uuid extension: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### If badges don't appear:
1. Check browser console for errors
2. Verify `child_badges` table has RLS policies
3. Ensure user is authenticated

---

## Session Context for Claude Code

To access your old Claude Code session with MCP servers:
1. Open Windsurf/VSCode
2. Change working directory to `/home` instead of `/home/usthr`
3. Or copy MCP config from `~/.config/Claude/claude_desktop_config.json` to `~/.claude/settings.json`

Your Claude Code projects are stored in:
- `/home` context: `~/.claude/projects/-home/`
- `/home/usthr` context: `~/.claude/projects/-home-usthr/`
