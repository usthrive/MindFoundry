import { supabase } from '@/lib/supabase'
import type { Cohort, AgeBand } from '@/types/cohort'

type CohortRow = {
  id: string
  name: string
  emoji: string
  code: string
  owner_user_id: string
  cohort_type: 'friends' | 'classroom'
  age_band_lowest: AgeBand
  ghost_cohort_id: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

function rowToCohort(row: CohortRow): Cohort {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    code: row.code,
    ownerUserId: row.owner_user_id,
    cohortType: row.cohort_type,
    ageBandLowest: row.age_band_lowest,
    ghostCohortId: row.ghost_cohort_id,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Returns the (single) active cohort that this child belongs to, or null.
 * V1 supports one active cohort per child; if a child somehow ends up in
 * multiple, the most recently joined wins.
 */
export async function getCohortForChild(childId: string): Promise<Cohort | null> {
  try {
    const { data, error } = await supabase
      .from('cohort_members')
      .select('cohort_id, joined_at, cohorts(*)')
      .eq('child_id', childId)
      .is('removed_at', null)
      .order('joined_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching cohort for child:', error)
      return null
    }
    if (!data?.cohorts) return null

    const cohortRow = data.cohorts as unknown as CohortRow
    if (cohortRow.archived_at) return null
    return rowToCohort(cohortRow)
  } catch (error) {
    console.error('Error in getCohortForChild:', error)
    return null
  }
}

/**
 * Returns every active cohort owned by this user (parent-side dashboard).
 */
export async function getCohortsOwnedByUser(userId: string): Promise<Cohort[]> {
  try {
    const { data, error } = await supabase
      .from('cohorts')
      .select('*')
      .eq('owner_user_id', userId)
      .is('archived_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching owned cohorts:', error)
      return []
    }
    return (data ?? []).map((r) => rowToCohort(r as CohortRow))
  } catch (error) {
    console.error('Error in getCohortsOwnedByUser:', error)
    return []
  }
}

/**
 * Look up a cohort by share code (for the Join-by-Code preview).
 * Returns a sanitized minimal projection — no member list, no internals.
 */
export async function getCohortByCode(code: string): Promise<Pick<
  Cohort,
  'id' | 'name' | 'emoji' | 'ageBandLowest'
> | null> {
  try {
    const normalized = code.trim().toUpperCase()
    const { data, error } = await supabase
      .from('cohorts')
      .select('id, name, emoji, age_band_lowest')
      .eq('code', normalized)
      .is('archived_at', null)
      .maybeSingle()

    if (error || !data) return null
    return {
      id: data.id,
      name: data.name,
      emoji: data.emoji,
      ageBandLowest: data.age_band_lowest as AgeBand,
    }
  } catch (error) {
    console.error('Error in getCohortByCode:', error)
    return null
  }
}

/**
 * Create a new cohort and add the owner's child as the first member.
 * Cohort code is generated server-side via the generate_cohort_code RPC.
 */
export async function createCohort(params: {
  ownerUserId: string
  childId: string
  name: string
  emoji: string
  ageBandLowest: AgeBand
}): Promise<Cohort | null> {
  try {
    const { data: codeData, error: codeError } = await supabase.rpc('generate_cohort_code')
    if (codeError || !codeData) {
      console.error('Error generating cohort code:', codeError)
      return null
    }
    const code = codeData as string

    const { data: cohortRow, error: insertErr } = await supabase
      .from('cohorts')
      .insert({
        owner_user_id: params.ownerUserId,
        name: params.name.trim(),
        emoji: params.emoji,
        code,
        age_band_lowest: params.ageBandLowest,
        cohort_type: 'friends',
      })
      .select('*')
      .single()

    if (insertErr || !cohortRow) {
      console.error('Error creating cohort:', insertErr)
      return null
    }

    // Add the owner's child as the first member (role = owner).
    const { error: memberErr } = await supabase.from('cohort_members').insert({
      cohort_id: cohortRow.id,
      child_id: params.childId,
      role: 'owner',
    })
    if (memberErr) {
      console.error('Error adding owner as cohort member:', memberErr)
      // Best-effort: clean up the cohort row if member insert fails.
      await supabase.from('cohorts').delete().eq('id', cohortRow.id)
      return null
    }

    return rowToCohort(cohortRow as CohortRow)
  } catch (error) {
    console.error('Error in createCohort:', error)
    return null
  }
}

export async function archiveCohort(cohortId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohorts')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', cohortId)
    if (error) {
      console.error('Error archiving cohort:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in archiveCohort:', error)
    return false
  }
}

export async function setGhostCohort(cohortId: string, ghostKey: string | null): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohorts')
      .update({ ghost_cohort_id: ghostKey })
      .eq('id', cohortId)
    if (error) {
      console.error('Error setting ghost cohort:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in setGhostCohort:', error)
    return false
  }
}
