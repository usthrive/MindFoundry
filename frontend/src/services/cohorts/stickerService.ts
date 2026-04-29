import { supabase } from '@/lib/supabase'
import type { BoostWallEntry, Sticker, StickerCategory } from '@/types/cohort'

type StickerRow = {
  id: string
  category: StickerCategory
  emoji: string
  label: string
  display_order: number
}

function rowToSticker(row: StickerRow): Sticker {
  return {
    id: row.id,
    category: row.category,
    emoji: row.emoji,
    label: row.label,
    displayOrder: row.display_order,
  }
}

let stickerCache: Sticker[] | null = null

/**
 * Returns the full sticker library (22 in V1). Cached after first call —
 * the library is reference data that changes only on a new migration.
 */
export async function listStickers(): Promise<Sticker[]> {
  if (stickerCache) return stickerCache
  try {
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data) {
      console.error('Error fetching stickers:', error)
      return []
    }
    stickerCache = data.map((r) => rowToSticker(r as StickerRow))
    return stickerCache
  } catch (error) {
    console.error('Error in listStickers:', error)
    return []
  }
}

/**
 * Send a curated sticker from one cohort member to another.
 * RLS enforces that:
 *   - sender's parent is the caller
 *   - both children are active members of the cohort
 */
export async function sendSticker(params: {
  cohortId: string
  fromChildId: string
  toChildId: string
  stickerId: string
}): Promise<boolean> {
  try {
    if (params.fromChildId === params.toChildId) return false
    const { error } = await supabase.from('sticker_sends').insert({
      cohort_id: params.cohortId,
      from_child_id: params.fromChildId,
      to_child_id: params.toChildId,
      sticker_id: params.stickerId,
    })
    if (error) {
      console.error('Error sending sticker:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in sendSticker:', error)
    return false
  }
}

/**
 * Boost Wall: stickers received by this child. Hydrated with the sticker
 * definition and the sender's first name (kid-safe).
 */
export async function getInbox(childId: string, limit = 20): Promise<BoostWallEntry[]> {
  try {
    const { data, error } = await supabase
      .from('sticker_sends')
      .select(
        `
        id, from_child_id, sent_at, read_at,
        stickers!inner(id, category, emoji, label, display_order),
        children!sticker_sends_from_child_id_fkey(name)
      `
      )
      .eq('to_child_id', childId)
      .order('sent_at', { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.error('Error fetching sticker inbox:', error)
      return []
    }

    return data.map((row) => {
      const stickerRel = (Array.isArray(row.stickers) ? row.stickers[0] : row.stickers) as StickerRow
      const fromRel = (Array.isArray(row.children) ? row.children[0] : row.children) as
        | { name: string }
        | null
      const firstName = (fromRel?.name ?? 'Friend').split(' ')[0] || 'Friend'
      return {
        id: row.id,
        fromChildId: row.from_child_id,
        fromDisplayName: firstName,
        sticker: rowToSticker(stickerRel),
        sentAt: row.sent_at,
        readAt: row.read_at,
      }
    })
  } catch (error) {
    console.error('Error in getInbox:', error)
    return []
  }
}

/**
 * Mark all unread stickers for this child as read.
 * Called when the child opens the cohort home (clears the NEW badge).
 */
export async function markInboxRead(childId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sticker_sends')
      .update({ read_at: new Date().toISOString() })
      .eq('to_child_id', childId)
      .is('read_at', null)
    if (error) {
      console.error('Error marking sticker inbox read:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in markInboxRead:', error)
    return false
  }
}

export async function countUnread(childId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('sticker_sends')
      .select('id', { count: 'exact', head: true })
      .eq('to_child_id', childId)
      .is('read_at', null)
    if (error) {
      console.error('Error counting unread stickers:', error)
      return 0
    }
    return count ?? 0
  } catch (error) {
    console.error('Error in countUnread:', error)
    return 0
  }
}
