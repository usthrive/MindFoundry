import { supabase } from '@/lib/supabase'
import type { CohortInviteRequest } from '@/types/cohort'

type InviteRow = {
  id: string
  cohort_id: string
  child_id: string
  card_emoji: string
  status: 'pending' | 'approved' | 'declined' | 'cancelled'
  created_at: string
  decided_at: string | null
}

function rowToInvite(row: InviteRow): CohortInviteRequest {
  return {
    id: row.id,
    cohortId: row.cohort_id,
    childId: row.child_id,
    cardEmoji: row.card_emoji,
    status: row.status,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
  }
}

/**
 * Kid taps an invite card in their app. Creates a pending invite_request
 * the parent will see on their dashboard. The kid never sees the cohort
 * code; the parent shares it via their own share sheet after approving.
 */
export async function kidRequestInvite(params: {
  cohortId: string
  childId: string
  cardEmoji: string
}): Promise<CohortInviteRequest | null> {
  try {
    const { data, error } = await supabase
      .from('cohort_invite_requests')
      .insert({
        cohort_id: params.cohortId,
        child_id: params.childId,
        card_emoji: params.cardEmoji,
        status: 'pending',
      })
      .select('*')
      .single()
    if (error) {
      console.error('Error creating kid invite request:', error)
      return null
    }
    return rowToInvite(data as InviteRow)
  } catch (error) {
    console.error('Error in kidRequestInvite:', error)
    return null
  }
}

/**
 * Pending invite requests across the parent's children (parent dashboard).
 */
export async function getPendingInviteRequestsForParent(parentUserId: string): Promise<
  Array<{
    request: CohortInviteRequest
    cohortName: string
    cohortEmoji: string
    childName: string
  }>
> {
  try {
    const { data, error } = await supabase
      .from('cohort_invite_requests')
      .select(
        `
        id, cohort_id, child_id, card_emoji, status, created_at, decided_at,
        cohorts!inner(name, emoji),
        children!inner(name, user_id)
      `
      )
      .eq('status', 'pending')
      .eq('children.user_id', parentUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invite requests for parent:', error)
      return []
    }
    return (data ?? []).map((row) => {
      const cohortRel = (Array.isArray(row.cohorts) ? row.cohorts[0] : row.cohorts) as {
        name: string
        emoji: string
      }
      const childRel = (Array.isArray(row.children) ? row.children[0] : row.children) as {
        name: string
      }
      const firstName = (childRel?.name ?? 'Friend').split(' ')[0] || 'Friend'
      return {
        request: rowToInvite({
          id: row.id,
          cohort_id: row.cohort_id,
          child_id: row.child_id,
          card_emoji: row.card_emoji,
          status: row.status,
          created_at: row.created_at,
          decided_at: row.decided_at,
        }),
        cohortName: cohortRel?.name ?? 'Cohort',
        cohortEmoji: cohortRel?.emoji ?? '☄️',
        childName: firstName,
      }
    })
  } catch (error) {
    console.error('Error in getPendingInviteRequestsForParent:', error)
    return []
  }
}

/**
 * Parent approves the kid's invite request — surfaces the share-code screen.
 * Approval just transitions the request status; the actual code-sharing is
 * a UI step (parent decides how to send: share sheet, copy, message, email).
 */
export async function parentApproveInviteRequest(requestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohort_invite_requests')
      .update({ status: 'approved', decided_at: new Date().toISOString() })
      .eq('id', requestId)
    if (error) {
      console.error('Error approving invite request:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in parentApproveInviteRequest:', error)
    return false
  }
}

export async function parentDeclineInviteRequest(requestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cohort_invite_requests')
      .update({ status: 'declined', decided_at: new Date().toISOString() })
      .eq('id', requestId)
    if (error) {
      console.error('Error declining invite request:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in parentDeclineInviteRequest:', error)
    return false
  }
}
