-- Mastery Bonus: when a child earns a 'skill_mastery' or 'level_complete'
-- achievement, every cohort they're an active member of gets +5 added to
-- the synergy_bonus column for that week.
--
-- Implementation choice: rather than maintain a separate column, we fold the
-- mastery bonus into the synergy_bonus total during the existing
-- recompute_cohort_energy_weekly() function. That keeps a single source of
-- truth (recompute) and avoids drift between the trigger and the recompute.
-- A second trigger fires recompute on insert so the bar bumps in real time.

CREATE OR REPLACE FUNCTION recompute_cohort_energy_weekly(p_cohort UUID, p_week_start DATE)
RETURNS VOID AS $$
DECLARE
  v_team_size INT;
  v_total INT;
  v_synergy INT;
  v_mastery INT;
  v_perfect INT;
  v_synergy_days INT;
BEGIN
  SELECT COUNT(*) INTO v_team_size
  FROM cohort_members
  WHERE cohort_id = p_cohort AND removed_at IS NULL;

  IF v_team_size = 0 THEN
    INSERT INTO cohort_energy_weekly (cohort_id, week_start_date, total_energy, synergy_bonus, perfect_week_bonus, computed_at)
    VALUES (p_cohort, p_week_start, 0, 0, 0, NOW())
    ON CONFLICT (cohort_id, week_start_date) DO UPDATE
      SET total_energy = 0, synergy_bonus = 0, perfect_week_bonus = 0, computed_at = NOW();
    RETURN;
  END IF;

  SELECT COALESCE(SUM(des.stars), 0)
  INTO v_total
  FROM cohort_members cm
  JOIN daily_effort_stars des ON des.child_id = cm.child_id
  WHERE cm.cohort_id = p_cohort
    AND cm.removed_at IS NULL
    AND des.date >= p_week_start
    AND des.date <  p_week_start + INTERVAL '7 days';

  SELECT COUNT(*)
  INTO v_synergy_days
  FROM (
    SELECT des.date, COUNT(*) FILTER (WHERE des.stars > 0) AS active_count
    FROM cohort_members cm
    JOIN daily_effort_stars des ON des.child_id = cm.child_id
    WHERE cm.cohort_id = p_cohort
      AND cm.removed_at IS NULL
      AND des.date >= p_week_start
      AND des.date <  p_week_start + INTERVAL '7 days'
    GROUP BY des.date
  ) d
  WHERE d.active_count = v_team_size;

  v_synergy := v_synergy_days * v_team_size;
  v_perfect := CASE WHEN v_synergy_days >= 5 THEN 5 ELSE 0 END;

  -- Mastery bonus: +5 per skill_mastery / level_complete achievement earned by
  -- an active cohort member during this week.
  SELECT COALESCE(COUNT(*), 0) * 5
  INTO v_mastery
  FROM achievements a
  JOIN cohort_members cm ON cm.child_id = a.child_id
  WHERE cm.cohort_id = p_cohort
    AND cm.removed_at IS NULL
    AND a.achievement_type IN ('skill_mastery', 'level_complete')
    AND a.earned_at >= p_week_start
    AND a.earned_at <  p_week_start + INTERVAL '7 days';

  INSERT INTO cohort_energy_weekly (cohort_id, week_start_date, total_energy, synergy_bonus, perfect_week_bonus, computed_at)
  VALUES (p_cohort, p_week_start, v_total, v_synergy + v_mastery, v_perfect, NOW())
  ON CONFLICT (cohort_id, week_start_date) DO UPDATE
    SET total_energy = EXCLUDED.total_energy,
        synergy_bonus = EXCLUDED.synergy_bonus,
        perfect_week_bonus = EXCLUDED.perfect_week_bonus,
        computed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Real-time trigger so the cohort bar bumps as soon as a mastery achievement
-- is recorded. Idempotent: a recompute run with no new achievements is a no-op.
CREATE OR REPLACE FUNCTION refresh_cohorts_on_mastery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_cohort UUID;
  v_week_start DATE := DATE_TRUNC('week', NEW.earned_at::date)::date;
BEGIN
  IF NEW.achievement_type NOT IN ('skill_mastery', 'level_complete') THEN
    RETURN NEW;
  END IF;
  FOR v_cohort IN
    SELECT cohort_id FROM cohort_members
    WHERE child_id = NEW.child_id AND removed_at IS NULL
  LOOP
    PERFORM recompute_cohort_energy_weekly(v_cohort, v_week_start);
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_cohorts_on_mastery ON achievements;
CREATE TRIGGER trg_refresh_cohorts_on_mastery
  AFTER INSERT ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION refresh_cohorts_on_mastery();
