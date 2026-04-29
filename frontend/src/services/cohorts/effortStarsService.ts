import { supabase } from '@/lib/supabase'
import type { DailyEffortStars, EffortStarsBreakdown } from '@/types/cohort'

type DailyEffortStarsRow = {
  child_id: string
  date: string
  stars: number
  breakdown: EffortStarsBreakdown
  computed_at: string
}

function rowToStars(row: DailyEffortStarsRow): DailyEffortStars {
  return {
    childId: row.child_id,
    date: row.date,
    stars: row.stars,
    breakdown: row.breakdown,
    computedAt: row.computed_at,
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

/**
 * Today's 5 effort stars for a child. Reads the cache first; if missing,
 * calls upsert_daily_effort_stars to compute-and-store on demand.
 */
export async function getTodayStars(childId: string): Promise<DailyEffortStars | null> {
  const today = todayIso()
  try {
    const { data, error } = await supabase
      .from('daily_effort_stars')
      .select('*')
      .eq('child_id', childId)
      .eq('date', today)
      .maybeSingle()

    if (!error && data) return rowToStars(data as DailyEffortStarsRow)

    // Cache miss — recompute on demand.
    const { error: rpcError } = await supabase.rpc('upsert_daily_effort_stars', {
      p_child: childId,
      p_date: today,
    })
    if (rpcError) {
      console.error('Error computing today stars:', rpcError)
      return null
    }

    const { data: data2, error: e2 } = await supabase
      .from('daily_effort_stars')
      .select('*')
      .eq('child_id', childId)
      .eq('date', today)
      .maybeSingle()

    if (e2 || !data2) return null
    return rowToStars(data2 as DailyEffortStarsRow)
  } catch (error) {
    console.error('Error in getTodayStars:', error)
    return null
  }
}

/**
 * Last 7 days for the My Week ribbon. Returned newest-first.
 * Days with no row are filled in as 0 stars.
 */
export async function getMyWeekRibbon(childId: string): Promise<
  Array<{ date: string; stars: number }>
> {
  try {
    const start = isoDaysAgo(6)
    const { data, error } = await supabase
      .from('daily_effort_stars')
      .select('date, stars')
      .eq('child_id', childId)
      .gte('date', start)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching week ribbon:', error)
      return []
    }
    const byDate = new Map<string, number>()
    for (const row of data ?? []) byDate.set(row.date, row.stars)

    const out: Array<{ date: string; stars: number }> = []
    for (let i = 6; i >= 0; i--) {
      const d = isoDaysAgo(i)
      out.push({ date: d, stars: byDate.get(d) ?? 0 })
    }
    return out
  } catch (error) {
    console.error('Error in getMyWeekRibbon:', error)
    return []
  }
}

/**
 * Past-Me Pacer: this week's running total vs. same point last week.
 * Both totals are summed from Monday-of-week through today.
 *
 * Returns weekday index (0=Mon..6=Sun) plus running totals.
 */
export async function getPastMePacer(childId: string): Promise<{
  weekdayIndex: number
  pastStars: number
  thisStars: number
  daysLeftInWeek: number
} | null> {
  try {
    // Compute this week's Monday (UTC-ish, matches DB convention).
    const now = new Date()
    const dow = (now.getDay() + 6) % 7 // 0 = Mon
    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - dow)
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(thisMonday.getDate() - 7)

    const thisStart = thisMonday.toISOString().slice(0, 10)
    const lastStart = lastMonday.toISOString().slice(0, 10)
    const lastEqualDay = new Date(lastMonday)
    lastEqualDay.setDate(lastMonday.getDate() + dow)
    const lastEnd = lastEqualDay.toISOString().slice(0, 10)
    const today = todayIso()

    const [thisRes, lastRes] = await Promise.all([
      supabase
        .from('daily_effort_stars')
        .select('stars')
        .eq('child_id', childId)
        .gte('date', thisStart)
        .lte('date', today),
      supabase
        .from('daily_effort_stars')
        .select('stars')
        .eq('child_id', childId)
        .gte('date', lastStart)
        .lte('date', lastEnd),
    ])

    if (thisRes.error || lastRes.error) {
      console.error('Error fetching pacer data:', thisRes.error || lastRes.error)
      return null
    }

    const sum = (rows: { stars: number }[] | null) =>
      (rows ?? []).reduce((s, r) => s + (r.stars ?? 0), 0)

    return {
      weekdayIndex: dow,
      pastStars: sum(lastRes.data),
      thisStars: sum(thisRes.data),
      daysLeftInWeek: 6 - dow,
    }
  } catch (error) {
    console.error('Error in getPastMePacer:', error)
    return null
  }
}
