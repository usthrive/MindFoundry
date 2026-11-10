/**
 * The one way a grown-up moves a child's Kumon sheet (2026-11-10, ruling R1's
 * parent controls: "Move on anyway", "Repeat C__", "Go back to C__").
 *
 * WHY ONE PATH. On 2026-09-27 a child was moved back from C51 to C15 by a bare
 * database update. That skipped clearConceptsFromWorksheet, the concept intros he
 * had seen stayed "seen", and when he reached C51 again the new stacked-
 * multiplication lesson never showed (docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md
 * §12). A move back now always clears what must show again, and every move is
 * written into the sheet's record, which also ends that sheet's run of tries.
 */
import type { KumonLevel } from '@/types'
import { clearConceptsFromWorksheet } from './conceptIntroService'
import { appendSheetEvent, updateCurrentPosition } from './progressService'
import type { ParentAction } from './sheetPass'

export interface KumonMove {
  childId: string
  level: KumonLevel
  /** The sheet the child is on now. */
  from: number
  /** The sheet to put them on. */
  to: number
  action: ParentAction
}

export async function moveKumonPosition(m: KumonMove): Promise<boolean> {
  if (!Number.isInteger(m.to) || m.to < 1 || m.to > 200) return false
  if (m.to < m.from) await clearConceptsFromWorksheet(m.childId, m.level, m.to)
  const moved = await updateCurrentPosition(m.childId, m.level, m.to, true)
  if (!moved) return false
  await appendSheetEvent(m.childId, m.level, m.from, {
    kind: 'parent',
    at: new Date().toISOString(),
    outcome: m.action,
    from: m.from,
    to: m.to,
  })
  return true
}
