-- Fix signup error: Add missing INSERT policy for users table
-- This allows newly authenticated users to create their profile row during signup

-- Add INSERT policy for users table
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Comment
COMMENT ON POLICY "Users can insert own data" ON users IS 'Allows users to create their own profile row during signup, but only if the id matches their auth.uid()';
