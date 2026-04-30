-- Cohorts security hardening
-- Address Supabase advisor warnings flagged after the cohorts schema:
--   * function_search_path_mutable (each new SECURITY DEFINER fn)
--   * anon_security_definer_function_executable (anon role can hit our RPCs)
--
-- We pin search_path to (public, pg_temp) for each fn we own, and revoke
-- the default PUBLIC EXECUTE grant on the SECURITY DEFINER ones so only
-- the authenticated role (and service_role) can call them.

ALTER FUNCTION public.child_age_band(integer)                          SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_cohort_code()                           SET search_path = public, pg_temp;
ALTER FUNCTION public.compute_daily_effort_stars(uuid, date)           SET search_path = public, pg_temp;
ALTER FUNCTION public.upsert_daily_effort_stars(uuid, date)            SET search_path = public, pg_temp;
ALTER FUNCTION public.recompute_cohort_energy_weekly(uuid, date)       SET search_path = public, pg_temp;
ALTER FUNCTION public.get_cohort_view(uuid)                            SET search_path = public, pg_temp;
ALTER FUNCTION public.approve_cohort_join_request(uuid)                SET search_path = public, pg_temp;

-- Strip the implicit PUBLIC EXECUTE on every SECURITY DEFINER fn we own,
-- then re-grant explicitly to the roles that should call them.
REVOKE EXECUTE ON FUNCTION public.generate_cohort_code()                       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.compute_daily_effort_stars(uuid, date)       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.upsert_daily_effort_stars(uuid, date)        FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.recompute_cohort_energy_weekly(uuid, date)   FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_cohort_view(uuid)                        FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.approve_cohort_join_request(uuid)            FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.generate_cohort_code()                        TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.compute_daily_effort_stars(uuid, date)        TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.upsert_daily_effort_stars(uuid, date)         TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.recompute_cohort_energy_weekly(uuid, date)    TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_cohort_view(uuid)                         TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.approve_cohort_join_request(uuid)             TO authenticated, service_role;
