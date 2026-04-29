import { supabase } from '@/lib/supabase'
import type { CohortEnergyWeekly, CohortViewMember, GhostCohort } from '@/types/cohort'

type EnergyRow = {
  cohort_id: string
  week_start_date: string
  total_energy: number
  synergy_bonus: number
  perfect_week_bonus: number
  computed_at: string
}

function rowToEnergy(row: EnergyRow): CohortEnergyWeekly {
  return {
    cohortId: row.cohort_id,
    weekStartDate: row.week_start_date,
    totalEnergy: row.total_energy,
    synergyBonus: row.synergy_bonus,
    perfectWeekBonus: row.perfect_week_bonus,
    computedAt: row.computed_at,
  }
}

function thisMondayIso(): string {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow)
  return monday.toISOString().slice(0, 10)
}

function lastMondayIso(): string {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow - 7)
  return monday.toISOString().slice(0, 10)
}

/**
 * This-week and last-week aggregate energy for a cohort.
 * Calls recompute_cohort_energy_weekly RPC if the cache is stale or missing.
 * V1 weekly goal is fixed at 120 stars per cohort.
 */
export async function getWeeklyEnergy(cohortId: string): Promise<{
  thisWeek: CohortEnergyWeekly
  lastWeek: CohortEnergyWeekly
  weeklyGoal: number
}> {
  const thisWeek = thisMondayIso()
  const lastWeek = lastMondayIso()

  // Always recompute on read for correctness in V1 (no scheduled job yet).
  // Costs ~one RPC roundtrip; tables are small.
  await Promise.all([
    supabase.rpc('recompute_cohort_energy_weekly', {
      p_cohort: cohortId,
      p_week_start: thisWeek,
    }),
    supabase.rpc('recompute_cohort_energy_weekly', {
      p_cohort: cohortId,
      p_week_start: lastWeek,
    }),
  ])

  const { data, error } = await supabase
    .from('cohort_energy_weekly')
    .select('*')
    .eq('cohort_id', cohortId)
    .in('week_start_date', [thisWeek, lastWeek])

  const empty = (week: string): CohortEnergyWeekly => ({
    cohortId,
    weekStartDate: week,
    totalEnergy: 0,
    synergyBonus: 0,
    perfectWeekBonus: 0,
    computedAt: new Date().toISOString(),
  })

  if (error) {
    console.error('Error fetching weekly energy:', error)
    return { thisWeek: empty(thisWeek), lastWeek: empty(lastWeek), weeklyGoal: 120 }
  }

  const byWeek = new Map<string, CohortEnergyWeekly>()
  for (const row of data ?? []) byWeek.set(row.week_start_date, rowToEnergy(row as EnergyRow))

  return {
    thisWeek: byWeek.get(thisWeek) ?? empty(thisWeek),
    lastWeek: byWeek.get(lastWeek) ?? empty(lastWeek),
    weeklyGoal: 120,
  }
}

/**
 * Safe age-band-aware projection of cohort members for the Team tab.
 * Sorted alphabetically by display_name in the SECURITY DEFINER fn —
 * never re-sort by score on the client.
 */
export async function getCohortView(cohortId: string): Promise<CohortViewMember[]> {
  try {
    const { data, error } = await supabase.rpc('get_cohort_view', { p_cohort: cohortId })
    if (error || !data) {
      console.error('Error fetching cohort view:', error)
      return []
    }
    return (data as Array<{
      member_id: string
      display_name: string
      avatar: string
      age_band: '4-7' | '8-9' | '10-11'
      today_stars: number
      streak: number
      mastered_today: boolean
      sleepy: boolean
      trend: 'up' | 'flat' | 'down'
      is_owner: boolean
    }>).map((r) => ({
      memberId: r.member_id,
      displayName: r.display_name,
      avatar: r.avatar,
      ageBand: r.age_band,
      todayStars: r.today_stars,
      streak: r.streak,
      masteredToday: r.mastered_today,
      sleepy: r.sleepy,
      trend: r.trend,
      isOwner: r.is_owner,
    }))
  } catch (error) {
    console.error('Error in getCohortView:', error)
    return []
  }
}

let ghostCache: GhostCohort[] | null = null

export async function listGhostCohorts(): Promise<GhostCohort[]> {
  if (ghostCache) return ghostCache
  try {
    const { data, error } = await supabase
      .from('ghost_cohorts')
      .select('*')
      .order('display_order', { ascending: true })
    if (error || !data) {
      console.error('Error fetching ghost cohorts:', error)
      return []
    }
    ghostCache = data.map((r) => ({
      key: r.key,
      name: r.name,
      emoji: r.emoji,
      weeklyEnergyTarget: r.weekly_energy_target,
      description: r.description,
      displayOrder: r.display_order,
    }))
    return ghostCache
  } catch (error) {
    console.error('Error in listGhostCohorts:', error)
    return []
  }
}
