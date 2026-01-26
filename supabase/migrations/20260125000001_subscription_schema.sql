-- Migration: Subscription System Schema
-- Purpose: Add subscription management tables and columns for MathFoundry
-- Includes: subscription_tiers, subscription_events, scholarship_requests tables
-- and additional columns on users table for subscription tracking

-- =============================================================================
-- 1. FIX EXISTING DATA FIRST
-- =============================================================================

-- Convert 'inactive' to 'free_period' for existing users
UPDATE users
SET subscription_status = 'free_period'
WHERE subscription_status = 'inactive' OR subscription_status IS NULL;

-- =============================================================================
-- 2. UPDATE USERS TABLE
-- =============================================================================

-- Update subscription_status to use new states
ALTER TABLE users
  ALTER COLUMN subscription_status SET DEFAULT 'free_period';

-- Add subscription_status check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_status_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_status_check
  CHECK (subscription_status IN ('free_period', 'grace_period', 'active', 'expired', 'cancelled'));

-- Add new subscription columns (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'subscription_tier') THEN
    ALTER TABLE users ADD COLUMN subscription_tier TEXT;
    ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check
      CHECK (subscription_tier IS NULL OR subscription_tier IN ('foundation', 'foundation_ai', 'vip'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'billing_cycle') THEN
    ALTER TABLE users ADD COLUMN billing_cycle TEXT;
    ALTER TABLE users ADD CONSTRAINT users_billing_cycle_check
      CHECK (billing_cycle IS NULL OR billing_cycle IN ('monthly', 'annual'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'free_period_ends_at') THEN
    ALTER TABLE users ADD COLUMN free_period_ends_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'grace_period_ends_at') THEN
    ALTER TABLE users ADD COLUMN grace_period_ends_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'current_period_ends_at') THEN
    ALTER TABLE users ADD COLUMN current_period_ends_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'stripe_subscription_id') THEN
    ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_founding_supporter') THEN
    ALTER TABLE users ADD COLUMN is_founding_supporter BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'scholarship_code') THEN
    ALTER TABLE users ADD COLUMN scholarship_code TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'nudges_sent') THEN
    ALTER TABLE users ADD COLUMN nudges_sent JSONB DEFAULT '{}';
  END IF;
END $$;

-- =============================================================================
-- 3. SET FREE PERIOD END DATE FOR EXISTING USERS
-- =============================================================================

UPDATE users
SET free_period_ends_at = created_at + INTERVAL '60 days'
WHERE free_period_ends_at IS NULL
  AND created_at IS NOT NULL;

-- =============================================================================
-- 4. CREATE SUBSCRIPTION_TIERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  monthly_price_cents INTEGER NOT NULL,
  annual_price_cents INTEGER NOT NULL,
  stripe_monthly_price_id TEXT,
  stripe_annual_price_id TEXT,
  features JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read enabled tiers" ON subscription_tiers;
CREATE POLICY "Anyone can read enabled tiers" ON subscription_tiers
  FOR SELECT USING (enabled = true);

-- Seed tiers
INSERT INTO subscription_tiers (id, name, description, enabled, monthly_price_cents, annual_price_cents, stripe_monthly_price_id, stripe_annual_price_id, features, display_order)
VALUES ('foundation', 'Foundation', 'Full Kumon-style math curriculum for ages 3-18', true, 799, 6700, NULL, NULL, '["Full curriculum (7A-O)", "Unlimited problems", "Progress tracking", "Animations & hints", "Parent dashboard"]', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, monthly_price_cents = EXCLUDED.monthly_price_cents, annual_price_cents = EXCLUDED.annual_price_cents, features = EXCLUDED.features, updated_at = NOW();

INSERT INTO subscription_tiers (id, name, description, enabled, monthly_price_cents, annual_price_cents, features, display_order)
VALUES ('foundation_ai', 'Foundation + AI', 'Everything in Foundation plus AI-powered tutoring', false, 1499, 12700, '["Everything in Foundation", "AI-powered explanations", "Personalized learning paths", "Voice assistance"]', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO subscription_tiers (id, name, description, enabled, monthly_price_cents, annual_price_cents, features, display_order)
VALUES ('vip', 'VIP', 'Premium experience with human tutoring support', false, 4999, 42000, '["Everything in Foundation + AI", "Live human tutor sessions", "Priority support", "Custom curriculum"]', 3)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. CREATE SUBSCRIPTION_EVENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  tier TEXT,
  billing_cycle TEXT,
  amount_cents INTEGER,
  stripe_event_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_event_id ON subscription_events(stripe_event_id);

ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own subscription events" ON subscription_events;
CREATE POLICY "Users can read own subscription events" ON subscription_events
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- 6. CREATE SCHOLARSHIP_REQUESTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS scholarship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  coupon_code TEXT,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarship_requests_user_id ON scholarship_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_requests_status ON scholarship_requests(status);

ALTER TABLE scholarship_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own scholarship requests" ON scholarship_requests;
CREATE POLICY "Users can read own scholarship requests" ON scholarship_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create scholarship requests" ON scholarship_requests;
CREATE POLICY "Users can create scholarship requests" ON scholarship_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 7. CREATE FUNCTION TO PROCESS SUBSCRIPTION STATES
-- =============================================================================

CREATE OR REPLACE FUNCTION process_subscription_states()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN
    SELECT * FROM users
    WHERE subscription_status = 'free_period'
      AND free_period_ends_at IS NOT NULL
      AND NOW() >= free_period_ends_at
  LOOP
    UPDATE users SET
      subscription_status = 'grace_period',
      grace_period_ends_at = free_period_ends_at + INTERVAL '7 days',
      updated_at = NOW()
    WHERE id = user_record.id;

    INSERT INTO subscription_events (user_id, event_type, metadata)
    VALUES (user_record.id, 'grace_period_started', jsonb_build_object('free_period_ended_at', user_record.free_period_ends_at));
  END LOOP;

  FOR user_record IN
    SELECT * FROM users
    WHERE subscription_status = 'grace_period'
      AND grace_period_ends_at IS NOT NULL
      AND NOW() >= grace_period_ends_at
  LOOP
    UPDATE users SET
      subscription_status = 'expired',
      updated_at = NOW()
    WHERE id = user_record.id;

    INSERT INTO subscription_events (user_id, event_type, metadata)
    VALUES (user_record.id, 'subscription_expired', jsonb_build_object('grace_period_ended_at', user_record.grace_period_ends_at));
  END LOOP;

  FOR user_record IN
    SELECT * FROM users
    WHERE subscription_status = 'active'
      AND current_period_ends_at IS NOT NULL
      AND NOW() >= current_period_ends_at + INTERVAL '3 days'
  LOOP
    UPDATE users SET
      subscription_status = 'expired',
      updated_at = NOW()
    WHERE id = user_record.id;

    INSERT INTO subscription_events (user_id, event_type, metadata)
    VALUES (user_record.id, 'subscription_lapsed', jsonb_build_object('period_ended_at', user_record.current_period_ends_at));
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 8. GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT, INSERT, UPDATE ON subscription_tiers TO service_role;
GRANT SELECT, INSERT ON subscription_events TO service_role;
GRANT SELECT, INSERT, UPDATE ON scholarship_requests TO service_role;
GRANT EXECUTE ON FUNCTION process_subscription_states() TO service_role;
