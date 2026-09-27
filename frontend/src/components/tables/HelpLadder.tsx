/**
 * HelpLadder — "Help me" on a times-table sheet, as a progression instead of a
 * single jump to the answer (owner, 2026-09-26). Content: ./helpLadder.ts.
 *
 * One rung at a time, and the child chooses to climb: the least help that gets
 * him moving is the help that teaches. The table is the last rung, not removed —
 * it is the right help when the others have not worked. Each rung has its own
 * read-aloud. Service-free (audio arrives as a render prop) so the screen
 * harness can photograph it, like TimesTableCard.
 *
 * Nothing here says "wrong", counts anything against him, or shows a clock.
 */
import type { ReactNode } from 'react'
import { helpLadderFor, rungText, RUNG_LABELS, type HelpRung, type LadderFact } from './helpLadder'

export interface HelpLadderProps {
  fact: LadderFact
  /** Highest rung opened for this problem: 1..4 (4 = the table is showing). */
  rung: 1 | 2 | 3 | 4
  /** Open the next rung. */
  onClimb: (next: 2 | 3 | 4) => void
  /** "I'll try it now" — close the ladder, keep his place. */
  onClose: () => void
  /** Read-aloud control for a rung's text (the page passes its AudioButton). */
  audio?: (text: string) => ReactNode
}

export function HelpLadder({ fact, rung, onClimb, onClose, audio }: HelpLadderProps) {
  const content = helpLadderFor(fact)
  const shown = ([1, 2, 3] as HelpRung[]).filter((r) => r <= rung)
  const next = rung < 4 ? ((rung + 1) as 2 | 3 | 4) : null

  return (
    <section
      aria-label="Help, one step at a time"
      data-help-ladder
      className="rounded-2xl border-2 border-sky-200 bg-white p-4 shadow-sm"
    >
      <ol className="flex flex-col gap-3">
        {shown.map((r) => (
          <li key={r} data-help-rung={r} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700"
            >
              {r}
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{RUNG_LABELS[r]}</p>
              <p className="text-lg leading-snug text-gray-800">{rungText(content, r)}</p>
            </div>
            {audio && <div className="shrink-0">{audio(rungText(content, r))}</div>}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[48px] flex-1 rounded-xl bg-sky-600 px-4 text-base font-semibold text-white shadow-sm active:scale-95 touch-manipulation"
        >
          I'll try it now
        </button>
        {next && (
          <button
            type="button"
            onClick={() => onClimb(next)}
            data-help-next={next}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-sky-300 bg-white px-4 text-base font-semibold text-sky-700 active:scale-95 touch-manipulation"
          >
            {next === 4 ? '📋 ' : ''}
            {RUNG_LABELS[next]}
          </button>
        )}
      </div>
    </section>
  )
}

export default HelpLadder
