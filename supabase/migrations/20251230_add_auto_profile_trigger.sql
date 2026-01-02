-- Auto-create user profile when auth user signs up
-- This trigger ensures that a public.users row is created automatically
-- whenever a new user signs up via Supabase Auth

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into public.users using data from auth.users and user metadata
  INSERT INTO public.users (id, email, full_name, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If profile already exists, do nothing (idempotent)
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a public.users profile when a new auth.users record is created';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger to auto-create user profile on signup';
