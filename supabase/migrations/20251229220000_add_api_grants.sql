-- Add API Grants for PostgREST Access
-- Fixes "schema cache" errors by granting access to anon and authenticated roles
-- This allows PostgREST to expose tables via REST API

-- Grant schema access to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions to API roles
-- This allows anon and authenticated roles to interact with all tables
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO anon, authenticated;

-- Grant sequence access (for auto-increment IDs)
-- Required for INSERT operations with serial/uuid columns
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO anon, authenticated;

-- Grant EXECUTE on all functions
-- Required for RPC calls and functions used in policies
GRANT EXECUTE
ON ALL FUNCTIONS IN SCHEMA public
TO anon, authenticated;

-- Auto-grant permissions to future tables
-- Ensures any new tables created will automatically have correct permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

-- Comment
COMMENT ON SCHEMA public IS 'Standard public schema with API access granted to anon and authenticated roles';

-- Note: Row Level Security (RLS) still controls what data users can access
-- These grants only make the tables "visible" to PostgREST
-- Actual data access is controlled by RLS policies defined in init_schema migration
