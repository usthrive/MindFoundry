/**
 * KumonSheetsCard — the grown-up's view of each Kumon sheet: first try, time against
 * the standard, focus, and what happened (2026-11-10, rulings R1 and R4).
 *
 * The child no longer sees a stopwatch or a focus score, and a sheet now moves on
 * only when it is passed; this is where those numbers live instead, with the three
 * moves a parent may make (each behind the parent check, each through the one move
 * path that clears seen intros — services/kumonPosition.ts):
 *   Move on anyway   — while a sheet is being repeated
 *   Repeat C__       — the sheet just finished, once more
 *   Go back to C__   — any earlier sheet
 */
import { useMemo, useState } from 'react'
import ParentVerification from '@/components/auth/ParentVerification'
import type { KumonLevel } from '@/types'
import { getSctForSheet } from '@/services/sct'
import {
  MAX_TRIES,
  PASS_FIRST_TRY_PER_TEN,
  TIME_FLOOR_FACTOR,
  TIME_STEP_FACTOR,
  skillPosition,
  timeFactorAt,
  movedOnLogLine,
  nonPassesInRun,
  parentActionLine,
  parentSittingLine,
  type ParentAction,
  type SheetEvent,
} from '@/services/sheetPass'
import { moveKumonPosition } from '@/services/kumonPosition'

interface SheetRow {
  worksheet_number: number
  sittings?: unknown
}

interface Props {
  childId: string
  childName: string
  level: KumonLevel
  currentWorksheet: number
  rows: SheetRow[]
  /** Called after a move, to reload the child and the rows. */
  onMoved: () => void | Promise<void>
}

const minutes = (s: number) => (s % 60 === 0 ? `${s / 60} min` : `${Math.floor(s / 60)} min ${s % 60} s`)
const dateOf = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function KumonSheetsCard({ childId, childName, level, currentWorksheet, rows, onMoved }: Props) {
  const [pending, setPending] = useState<{ action: ParentAction; to: number; label: string } | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [backTo, setBackTo] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const events = useMemo(() => {
    const all: Array<{ ws: number; e: SheetEvent }> = []
    for (const r of rows) {
      const list = Array.isArray(r.sittings) ? (r.sittings as SheetEvent[]) : []
      for (const e of list) all.push({ ws: r.worksheet_number, e })
    }
    return all.sort((a, b) => b.e.at.localeCompare(a.e.at))
  }, [rows])

  const currentRow = rows.find((r) => r.worksheet_number === currentWorksheet)
  const currentEvents = Array.isArray(currentRow?.sittings) ? (currentRow!.sittings as SheetEvent[]) : []
  const repeating = nonPassesInRun(currentEvents)
  // The sheet before this one that was last worked (while the current sheet is being
  // repeated, its own sittings are the newest — they are not "the sheet just finished").
  const lastFinished = events.find((x) => x.e.kind === 'sitting' && x.ws < currentWorksheet)?.ws ?? null
  const movedOn = events.filter((x) => x.e.kind === 'sitting' && x.e.outcome === 'moved_on').slice(0, 3)
  // Today's allowance: generous on a new skill, 30 s less (on stacked sheets) with
  // each new sheet of it, down to the floor (owner, 2026-11-10: 10 min → 5 min).
  const standard = getSctForSheet(level, currentWorksheet)
  const position = skillPosition(level, currentWorksheet, rows)
  const limit = Math.round(timeFactorAt(position) * standard)
  const floor = Math.round(TIME_FLOOR_FACTOR * standard)
  const step = Math.round(TIME_STEP_FACTOR * standard)

  const ask = (action: ParentAction, to: number, label: string) => {
    setNotice(null)
    setPending({ action, to, label })
    setVerifying(true)
  }

  const run = async () => {
    setVerifying(false)
    if (!pending) return
    setBusy(true)
    const ok = await moveKumonPosition({ childId, level, from: currentWorksheet, to: pending.to, action: pending.action })
    setBusy(false)
    setNotice(ok
      ? `Done. Next time ${childName} practises, ${level}${pending.to} opens (a sheet already open on the tablet is finished first).`
      : 'That did not save. Please try again.')
    setPending(null)
    if (ok) await onMoved()
  }

  const back = Number(backTo)
  const backOk = Number.isInteger(back) && back >= 1 && back < currentWorksheet

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5" data-kumon-sheets>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🗂️</span>
        <h3 className="text-sm font-semibold text-gray-700">Sheets: first try and time</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        A sheet moves on at {PASS_FIRST_TRY_PER_TEN} of 10 right the first time, without help, within the time allowed.
        A new skill starts with plenty of time, and it comes down {step} s with each new sheet, to {minutes(floor)}.
        Otherwise the sheet is done again with new numbers; after {MAX_TRIES} tries it moves on.
        Times show taken of allowed. <span className="text-amber-700">Amber</span> marks what fell short.
      </p>

      <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-900 mb-3" data-sheet-now>
        Now: <strong>{level}{currentWorksheet}</strong>
        {` — try ${repeating + 1} of ${MAX_TRIES} · up to ${minutes(limit)}`}
      </div>

      {movedOn.length > 0 && (
        <ul className="mb-3 space-y-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" data-moved-on>
          {movedOn.map((x) => (
            <li key={x.e.at}>{x.e.kind === 'sitting' ? movedOnLogLine(level, x.ws, x.e) : null}</li>
          ))}
        </ul>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-gray-500" data-sheets-empty>
          Sheets are recorded this way from {level}{currentWorksheet} on. Earlier sheets keep their old record.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100" data-sheet-list>
          {events.slice(0, 10).map(({ ws, e }) => {
            if (e.kind === 'parent') {
              return (
                <li key={e.at} className="py-2 text-sm text-gray-600">
                  <span className="text-gray-400">{dateOf(e.at)} · </span>{parentActionLine(level, ws, e)}
                </li>
              )
            }
            const line = parentSittingLine(e)
            return (
              <li key={e.at} className="py-2 text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="shrink-0 font-semibold text-gray-800">{level}{ws} <span className="font-normal text-gray-400">· {dateOf(e.at)}</span></span>
                  <span className={e.outcome === 'pass' ? 'text-green-700 font-medium' : e.outcome === 'repeat' ? 'text-sky-700 font-medium' : 'text-amber-700 font-medium'}>
                    {line.outcome}
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className={line.missedFirstTry ? 'font-medium text-amber-700' : ''}>{line.score}</span>
                  {' · '}
                  <span className={line.missedTime ? 'font-medium text-amber-700' : ''}>{line.time}</span>
                  {line.focus ? ` · ${line.focus}` : ''}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 space-y-2" data-sheet-controls>
        <p className="text-xs text-gray-500">Change the sheet (asks for the parent check):</p>
        <div className="flex flex-wrap gap-2">
          {repeating > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => ask('parent_move_on', currentWorksheet + 1, `Move on to ${level}${currentWorksheet + 1}`)}
              className="min-h-[44px] rounded-xl border-2 border-blue-300 bg-white px-3 text-sm font-semibold text-blue-700"
            >
              Move on anyway
            </button>
          )}
          {lastFinished !== null && (
            <button
              type="button"
              disabled={busy}
              onClick={() => ask('parent_repeat', lastFinished, `Repeat ${level}${lastFinished}`)}
              className="min-h-[44px] rounded-xl border-2 border-sky-300 bg-white px-3 text-sm font-semibold text-sky-700"
            >
              Repeat {level}{lastFinished}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600" htmlFor="kumon-back-to">Go back to {level}</label>
          <input
            id="kumon-back-to"
            inputMode="numeric"
            value={backTo}
            onChange={(ev) => setBackTo(ev.target.value.replace(/\D/g, '').slice(0, 3))}
            placeholder={String(Math.max(1, currentWorksheet - 10))}
            className="w-16 min-h-[44px] rounded-lg border border-gray-300 px-2 text-center text-sm"
          />
          <button
            type="button"
            disabled={busy || !backOk}
            onClick={() => ask('parent_go_back', back, `Go back to ${level}${back}`)}
            className="min-h-[44px] rounded-xl border-2 border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 disabled:opacity-40"
          >
            Go
          </button>
        </div>
        {notice && <p className="text-sm text-gray-700" data-sheet-notice>{notice}</p>}
      </div>

      <ParentVerification
        isOpen={verifying}
        onSuccess={run}
        onCancel={() => { setVerifying(false); setPending(null) }}
        title={pending?.label ?? 'Change the sheet'}
        description="Verify to change the Kumon sheet"
      />
    </div>
  )
}
