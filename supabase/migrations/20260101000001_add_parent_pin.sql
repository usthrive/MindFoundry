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
