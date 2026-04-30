import { supabase } from '@/lib/supabase'
import type { CohortJoinRequest } from '@/types/cohort'

type JoinRequestRow = {
  id: string
  cohort_id: string
  requesting_user_id: string
  child_id: string
  status: 'pending' | 'approved' | 'declined' | 'cancelled'
  created_at: string
  decided_at: string | null
}

function rowToJoinRequest(row: JoinRequestRow): CohortJoinRequest {
  return {
    id: row.id,
    cohortId: row.cohort_id,
    requestingUserId: row.requesting_user_id,
    childId: row.child_id,
    status: row.status,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
  }
}

/**
 * Parent enters a code → look up cohort → request to add their child.
 * Owner must approve before the child becomes a member.
 */
export async function requestJoin(params: {
  cohortId: string
  requestingUserId: string
  childId: string
}): Promise<CohortJoinRequest | null> {
  try {
    const { data, error } = await supabase
      .from('cohort_join_requests')
      .insert({
        cohort_id: params.cohortId,
        requesting_user_id: params.requestingUserId,
        child_id: params.childId,
        status: 'pending',
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error requesting join:', error)
      return null
    }
    return rowToJoinRequest(data as JoinRequestRow)
  } catch (error) {
    console.error('Error in requestJoin:', error)
    return null
  }
}

/**
 * Pending join requests for cohorts this user owns (parent dashboard).
 * Hydrates the child name + age + avatar for the approval card.
 */
export async function getPendingJoinRequestsForOwner(
  ownerUserId: string
): Promise<
  Array<{
    request: CohortJoinRequest
    cohortName: string
    cohortEmoji: string
    childName: string
    childAge: number
    childAvatar: string
    requesterName: string | null
  }>
> {
  try {
    const { data, error } = await supabase
      .from('cohort_join_requests')
      .select(
        `
        id, cohort_id, requesting_user_id, child_id, status, created_at, decided_at,
        cohorts!inner(name, emoji, owner_user_id),
        children!inner(name, age, avatar),
        users:users!cohort_join_requests_requesting_user_id_fkey(full_name)
      `
      )
      .eq('status', 'pending')
      .eq('cohorts.owner_user_id', ownerUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending join requests:', error)
      return []
    }

    return (data ?? []).map((row) => {
      // Supabase returns related rows as either an object or a single-item array
      // depending on the relationship cardinality detection.
      // We normalize defensively here.
      const cohortRel = (Array.isArray(row.cohorts) ? row.cohorts[0] : row.cohorts) as {
        name: string
        emoji: string
      }
      const childRel = (Array.isArray(row.children) ? row.children[0] : row.children) as {
        name: string
        age: number
        avatar: string
      }
      const userRel = (Array.isArray(row.users) ? row.users[0] : row.users) as
        | { full_name: string | null }
        | null

      return {
        request: rowToJoinRequest({
          id: row.id,
          cohort_id: row.cohort_id,
          requesting_user_id: row.requesting_user_id,
          child_id: row.child_id,
          status: row.status,
          created_at: row.created_at,
          decided_at: row.decided_at,
        }),
        cohortName: cohortRel?.name ?? 'Cohort',
        cohortEmoji: cohortRel?.emoji ?? '☄️',
        childName: childRel?.name ?? 'A friend',
        childAge: childRel?.age ?? 8,
        childAvatar: childRel?.avatar ?? '🧒',
        requesterName: userRel?.full_name ?? null,
      }
    })
  } catch (error) {
    console.error('Error in getPendingJoinRequestsForOwner:', error)
    return []
  }
}

/**
 * Owner approves a pending join request. Atomically:
 *   1) flips request → approved
 *   2) inserts a cohort_members row for the child
 * Returns the new cohort_member id, or null on error.
 */
export async function approveJoin(requestId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('approve_cohort_join_request', {
      p_request: requestId,
    })
    if (error) {
      console.error('Error approving join request:', error)
      return null
    }
    return (data as string) ?? null
  } catch (error) {
    console.error('Error in approveJoin:', error)
    return null
  }
}

export async function declineJoin(requestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohort_join_requests')
      .update({ status: 'declined', decided_at: new Date().toISOString() })
      .eq('id', requestId)
    if (error) {
      console.error('Error declining join request:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in declineJoin:', error)
    return false
  }
}

/**
 * Soft-remove a child from a cohort (parent leaves on behalf of child,
 * or owner removes a member).
 */
export async function removeMember(cohortId: string, childId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohort_members')
      .update({ removed_at: new Date().toISOString() })
      .eq('cohort_id', cohortId)
      .eq('child_id', childId)
    if (error) {
      console.error('Error removing cohort member:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in removeMember:', error)
    return false
  }
}
