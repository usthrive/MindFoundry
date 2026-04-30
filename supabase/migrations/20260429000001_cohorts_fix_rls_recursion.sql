-- Fix mutual RLS recursion between cohorts and cohort_members SELECT policies.
-- Both originally did EXISTS (SELECT 1 FROM the-other-table ...) which caused
-- Postgres to recursively re-evaluate the other table's policy and abort
-- with HTTP 500 ("infinite recursion detected in policy"). Solution:
-- SECURITY DEFINER helper functions that bypass RLS internally.

CREATE OR REPLACE FUNCTION is_cohort_owner(p_cohort UUID, p_user UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM cohorts WHERE id = p_cohort AND owner_user_id = p_user);
$$;

CREATE OR REPLACE FUNCTION is_cohort_member_parent(p_cohort UUID, p_user UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM cohort_members cm
    JOIN children c ON c.id = cm.child_id
    WHERE cm.cohort_id = p_cohort
      AND cm.removed_at IS NULL
      AND c.user_id = p_user
  );
$$;

REVOKE EXECUTE ON FUNCTION is_cohort_owner(UUID, UUID)         FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_cohort_member_parent(UUID, UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION is_cohort_owner(UUID, UUID)         TO authenticated, service_role;
GRANT  EXECUTE ON FUNCTION is_cohort_member_parent(UUID, UUID) TO authenticated, service_role;

DROP POLICY IF EXISTS "Users can view own or member cohorts" ON cohorts;
CREATE POLICY "Users can view own or member cohorts" ON cohorts
  FOR SELECT USING (
    owner_user_id = auth.uid()
    OR is_cohort_member_parent(id, auth.uid())
  );

DROP POLICY IF EXISTS "Members and owners can view membership" ON cohort_members;
CREATE POLICY "Members and owners can view membership" ON cohort_members
  FOR SELECT USING (
    is_cohort_owner(cohort_id, auth.uid())
    OR EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = cohort_members.child_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Cohort members and owner can view weekly energy" ON cohort_energy_weekly;
CREATE POLICY "Cohort members and owner can view weekly energy" ON cohort_energy_weekly
  FOR SELECT USING (
    is_cohort_owner(cohort_id, auth.uid())
    OR is_cohort_member_parent(cohort_id, auth.uid())
  );

DROP POLICY IF EXISTS "Requester or owner can view join requests" ON cohort_join_requests;
CREATE POLICY "Requester or owner can view join requests" ON cohort_join_requests
  FOR SELECT USING (
    requesting_user_id = auth.uid()
    OR is_cohort_owner(cohort_id, auth.uid())
  );

DROP POLICY IF EXISTS "Owner approves or requester cancels" ON cohort_join_requests;
CREATE POLICY "Owner approves or requester cancels" ON cohort_join_requests
  FOR UPDATE USING (
    is_cohort_owner(cohort_id, auth.uid())
    OR requesting_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Parent of child or cohort owner can view" ON cohort_invite_requests;
CREATE POLICY "Parent of child or cohort owner can view" ON cohort_invite_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children c
            WHERE c.id = cohort_invite_requests.child_id AND c.user_id = auth.uid())
    OR is_cohort_owner(cohort_id, auth.uid())
  );
