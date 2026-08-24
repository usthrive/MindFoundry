/**
 * The times table, where a child can look at it.
 *
 * WHAT THIS IS FOR. A child meeting the tables has been asked to perform something
 * he has never been given a chance to rehearse: the app's only help arrived AFTER
 * two wrong answers, and all of it taught him to WORK THE FACT OUT — count by
 * threes, draw the array — which is how you understand a product and not how you
 * come to know one. Knowing comes from seeing the table, saying the table, and
 * then being asked again. This is the seeing and the saying.
 *
 * FOUR DECISIONS, each of them a teacher's rather than a designer's:
 *
 *  1. THE ROW, NEVER THE WALL. A 12×12 grid is a place to get lost. On a ×3 sheet
 *     a child needs the ×3 row — ten facts, in order, with the count-by rhythm
 *     printed above them, because the rhythm is the thing that carries the answer
 *     before the fact itself is known.
 *
 *  2. THE FACT HE WAS ASKED IS COVERED. Everything else in the row is legible, so
 *     he can see 3 × 6 = 18 and step one three to the answer he owes. That is the
 *     derivation an instructor teaches at the board, and it is why this is not an
 *     answer key: the neighbours are free, the answer costs a deliberate tap, and
 *     that tap is recorded.
 *
 *  3. ANCHORS ARE MARKED. Nobody memorises a hundred facts. They memorise about
 *     twenty-five — ×1, ×2, ×5, ×10 — and step to the rest. Marking them tells the
 *     child which ones are worth holding, which is a thing children are never told.
 *
 *  4. IT CAN BE SAID ALOUD. Kumon's own method for tables is oral and rhythmic,
 *     and the app already has a voice. Reading the row aloud with him is the part
 *     that actually commits it to memory.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TableSupportLevel } from '@/services/generators/elementary-advanced/level-c'

/** The facts worth knowing cold; everything else is a step away from one of these. */
const ANCHORS = [1, 2, 5, 10]

export interface TimesTableCardProps {
  /** The table(s) this sheet is drilling. */
  tables: number[]
  /** How much of the table this beat of the curriculum still shows. */
  support: TableSupportLevel
  /** The fact the child is being asked right now, if we know it. */
  current?: { table: number; multiplier: number } | null
  /** Fired when the child uncovers a product — the peek, so it can be recorded. */
  onReveal?: (fact: { table: number; multiplier: number }) => void
  onClose?: () => void
  /**
   * The "say it with me" control, passed in rather than built here.
   *
   * The card deliberately imports no services: a picture of a table should be a
   * pure function of which table it is, so it can be rendered and checked
   * anywhere. Wiring it to a voice is the page's job — `recitationFor` below
   * gives the page the words to speak.
   */
  audio?: ReactNode
}

/** "3 times 7 is 21" — the sentence, not the digits, because it is meant to be said. */
function recitation(table: number): string {
  return Array.from({ length: 10 }, (_, i) => `${table} times ${i + 1} is ${table * (i + 1)}.`).join(' ')
}

/** What to read aloud for these tables, in the rhythm a child recites them in. */
export function recitationFor(tables: number[]): string {
  return tables.map(recitation).join(' ')
}

/**
 * How to get to this fact from something already known: the nearest anchor at or
 * below it, and how many groups further on it sits.
 */
function stepFrom(table: number, multiplier: number): string {
  if (ANCHORS.includes(multiplier)) {
    return `${table} × ${multiplier} is one to know by heart — it is one of your anchors.`
  }
  const anchor = [...ANCHORS].reverse().find((a) => a < multiplier)
  if (!anchor) return ''
  const extra = multiplier - anchor
  return `${table} × ${anchor} is ${table * anchor}, then ${extra} more ${extra === 1 ? `${table}` : `${table}s`}.`
}

export function TimesTableCard({ tables, support, current, onReveal, onClose, audio }: TimesTableCardProps) {
  // Which products the child has chosen to uncover. Keyed table×multiplier.
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const key = (t: number, m: number) => `${t}x${m}`

  // A new question is a new ask: what he uncovered for the last one does not
  // stay uncovered for this one, or the card slowly becomes an answer sheet.
  useEffect(() => {
    setRevealed(new Set())
  }, [current?.table, current?.multiplier])

  // On a mixed sheet the child owns four tables, and putting all forty facts on
  // screen rebuilds the wall this card exists to avoid — he was asked 4 × 7 and
  // had to scroll past the 2s and 3s to reach it. So the table he was actually
  // asked about leads, and the others wait behind a tap.
  const [showOthers, setShowOthers] = useState(false)
  useEffect(() => {
    setShowOthers(false)
  }, [current?.table])

  const ordered = useMemo(() => {
    if (!current) return tables
    return [current.table, ...tables.filter((t) => t !== current.table)]
  }, [tables, current?.table])

  const visible = current && !showOthers ? ordered.slice(0, 1) : ordered
  const hidden = ordered.filter((t) => !visible.includes(t))

  const rows = useMemo(
    () => visible.map((t) => ({ table: t, facts: Array.from({ length: 10 }, (_, i) => i + 1) })),
    [visible.join(',')],
  )

  const reveal = (t: number, m: number) => {
    setRevealed((prev) => new Set(prev).add(key(t, m)))
    onReveal?.({ table: t, multiplier: m })
  }

  const isAsked = (t: number, m: number) => current?.table === t && current?.multiplier === m
  const showsProduct = (t: number, m: number) => {
    if (revealed.has(key(t, m))) return true
    // The one he was asked is his to say, whatever the beat.
    if (isAsked(t, m)) return false
    if (support !== 'covered') return true
    // On a mixed sheet the row is here for its shape rather than its answers —
    // but the ANCHORS stay legible, because they are the facts he is meant to
    // hold and the ones the step hint tells him to work from. Covering 4 × 5
    // while the hint underneath said "4 × 5 is 20, then 2 more 4s" was the card
    // arguing with itself.
    return ANCHORS.includes(m)
  }

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-4 shadow-sm">
      {/* The heading row carries the CLOSE control only.
          "Say it with me" used to sit up here beside it, and on a phone the two
          together were about 190px that would not shrink — against a text block
          with no `min-w-0`, which in a flex row cannot give way either. On a
          360px screen that left the title roughly 140px and wrapped "The 4 times
          table" and its sentence into a column a word or two wide. The speaker
          now gets its own line, where its label costs nobody any width. */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-800">
            {tables.length === 1 ? `The ${tables[0]} times table` : `Your tables so far`}
          </h3>
          <p className="text-xs text-gray-600">
            {support === 'covered'
              ? 'Count along the top to find one you need — tap a fact to check it.'
              : 'Look as long as you like. The one you were asked is yours to say.'}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the table"
            className="-mr-1 shrink-0 rounded-lg px-2 py-1 text-gray-500 hover:bg-amber-100 touch-manipulation"
          >
            ✕
          </button>
        )}
      </div>

      {audio && <div className="mb-3">{audio}</div>}

      {rows.map(({ table, facts }) => (
        <div key={table} className="mb-3 last:mb-0">
          {tables.length > 1 && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              {table} times table
            </p>
          )}

          {/* The count-by rhythm — the part that carries the answer before the fact
              does, and the reason this card is not an answer key.

              NOTHING IS HIGHLIGHTED HERE, deliberately. The first version marked the
              position of the fact he had just been asked, which turned the rhythm
              into an arrow pointing at his answer. Left plain, the strip is what a
              table on a classroom wall is: to use it he has to count along it —
              three, six, nine, twelve, fifteen, eighteen, twenty-one — which is the
              exact work the sheet is asking for. */}
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-white/70 px-3 py-2">
            <span className="text-xs font-medium text-gray-500">count by {table}:</span>
            {facts.map((m) => (
              <span key={m} className="text-sm tabular-nums text-gray-700">
                {table * m}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1 sm:grid-cols-5">
            {facts.map((m) => {
              const asked = isAsked(table, m)
              const anchor = ANCHORS.includes(m)
              const shown = showsProduct(table, m)
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => !shown && reveal(table, m)}
                  className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm tabular-nums
                    touch-manipulation transition-colors
                    ${asked
                      ? 'border-amber-400 bg-amber-100 font-bold text-amber-900'
                      : anchor
                        ? 'border-amber-200 bg-white font-semibold text-gray-800'
                        : 'border-transparent bg-white/80 text-gray-700'}
                    ${shown ? '' : 'hover:bg-amber-100'}`}
                >
                  <span>
                    {table} × {m} ={' '}
                    {shown ? table * m : <span className="text-amber-600">?</span>}
                  </span>
                  {anchor && <span aria-hidden="true" className="text-[10px] text-amber-500">★</span>}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {hidden.length > 0 && (
        <button
          type="button"
          onClick={() => setShowOthers(true)}
          className="mb-1 w-full rounded-xl border border-amber-200 bg-white/70 px-3 py-2 text-sm
                     font-medium text-amber-700 hover:bg-amber-100 touch-manipulation"
        >
          Show my other tables ({hidden.join(', ')})
        </button>
      )}

      {current && (
        <p className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-sm text-gray-700">
          {stepFrom(current.table, current.multiplier)}
          {current.multiplier >= 2 && current.multiplier < current.table && (
            <>
              {' '}
              <span className="text-gray-500">
                ({current.table} × {current.multiplier} is the same as {current.multiplier} × {current.table} —
                you know that one from the {current.multiplier} table.)
              </span>
            </>
          )}
        </p>
      )}

      <p className="mt-2 text-[11px] text-gray-500">
        ★ are the ones worth knowing by heart. You can step to any other from one of them.
      </p>
    </div>
  )
}

export default TimesTableCard
