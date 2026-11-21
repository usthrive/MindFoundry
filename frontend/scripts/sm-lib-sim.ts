/**
 * sm-lib-sim — a deterministic simulated child walking G1-U02, for the stage-1 run-2 gates
 * and the day dump. Not a gate itself (imported by sm-day-assembly-test, sm-blind-habit-test,
 * sm-dump-days and others).
 *
 * The walk (EXEMPLAR §3; PACING 13 days + after): entry check · L1 lesson · practice ·
 * L2 lesson · practice … L6 lesson · practice · chapter check · then `extraPractice` more
 * practice days (so 2 / 7 / 21-day comebacks come due), on school days (Mon–Fri) from a
 * start date. Outcomes per item come from a seeded stream: right on the first try with
 * probability `rightRate`; a miss reaches ladder rung 1–4 (uniform). Never a child's name.
 */
import { streamRng } from '../src/modules/best-brains/generator/rng'
import { attemptFrom, chapterCheck, entryCheck, lessonDay, practiceDay, recentServed } from '../src/modules/school-math/engine/assemble'
import { addDays } from '../src/modules/school-math/engine/scheduler'
import type { SMAttempt, SMCheckForm, SMDay, SMDayKind, SMItem, SMUnit } from '../src/modules/school-math/types'

export interface SimDay {
  dayKey: string
  kind: SMDayKind
  lessonId: string
  /** Lesson and practice days carry their assembled day. */
  day?: SMDay & { info?: unknown }
  items: SMItem[]
  attempts: SMAttempt[]
  /** The chapter check day's form (drawn with his last 7 days of served items). */
  form?: SMCheckForm
}

export interface SimOpts {
  start?: string
  rightRate?: number
  extraPractice?: number
  /** Stop after this many days (the gates that only need L4–L6 practice days stop early). */
  maxDays?: number
}

export function nextSchoolDay(day: string): string {
  let d = addDays(day, 1)
  for (;;) {
    const [y, m, dd] = d.split('-').map(Number)
    const wd = new Date(y, m - 1, dd, 12).getDay()
    if (wd !== 0 && wd !== 6) return d
    d = addDays(d, 1)
  }
}

/** A local-day ISO instant: 16:00 on that local day, as UTC. */
export function instantOn(day: string, minute: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d, 16, minute).toISOString()
}

export function outcomeFor(seed: number, item: SMItem, k: number, rightRate: number) {
  const r = streamRng(seed, `sim:${item.id}:${k}`)
  const right = r.chance(rightRate)
  const rung = right ? 0 : (r.int(1, 4) as 1 | 2 | 3 | 4)
  return { firstTryCorrect: right, answers: right ? ['(right)'] : ['(his answer)'], firstTryMs: r.int(4000, 30000), ladderRung: rung as 0 | 1 | 2 | 3 | 4, tries: right ? 1 : 2 }
}

export function simulateUnit(unit: SMUnit, seed: number, opts: SimOpts = {}): { days: SimDay[]; attempts: SMAttempt[] } {
  const rightRate = opts.rightRate ?? 0.75
  const days: SimDay[] = []
  const attempts: SMAttempt[] = []
  let dayKey = opts.start ?? '2026-11-23'
  const record = (kind: SMDayKind, lessonId: string, items: SMItem[], day?: SimDay['day'], cbKeys?: Array<string | undefined>) => {
    const todays: SMAttempt[] = []
    items.forEach((it, k) => {
      const out = outcomeFor(seed, it, k, rightRate)
      const a = attemptFrom(it, { dayKind: kind, localDay: dayKey, createdAt: instantOn(dayKey, k), comebackKey: cbKeys?.[k] }, out)
      todays.push(a)
    })
    attempts.push(...todays)
    days.push({ dayKey, kind, lessonId, day, items, attempts: todays })
    dayKey = nextSchoolDay(dayKey)
  }
  const done = () => opts.maxDays !== undefined && days.length >= opts.maxDays

  // entry check (its own short sitting)
  const ec = entryCheck(unit, seed)
  record('entry', unit.lessons[0].id, ec.pairs.flatMap((p) => p.items))
  for (const lesson of unit.lessons) {
    if (done()) break
    const ld = lessonDay(unit, lesson.id, seed, { dayKey, attempts: [...attempts] })
    const lItems = ld.items.filter((x): x is SMItem => x !== null)
    record('lesson', lesson.id, lItems, ld)
    if (done()) break
    const pd = practiceDay(unit, { dayKey, lessonId: lesson.id, attempts: [...attempts] }, seed)
    const pItems = pd.items.filter((x): x is SMItem => x !== null)
    const cb = pd.manifest.slots.filter((s) => s.role !== 'demo').map((s) => s.comebackKey)
    record('practice', lesson.id, pItems, pd, cb)
  }
  if (!done()) {
    const ck = chapterCheck(unit, seed, [], recentServed(attempts, dayKey))
    record('check', unit.lessons[unit.lessons.length - 1].id, ck.rows.map((r) => r.item))
    days[days.length - 1].form = ck
  }
  for (let i = 0; i < (opts.extraPractice ?? 0) && !done(); i++) {
    const last = unit.lessons[unit.lessons.length - 1].id
    const pd = practiceDay(unit, { dayKey, lessonId: last, attempts: [...attempts] }, seed + i + 1)
    const pItems = pd.items.filter((x): x is SMItem => x !== null)
    const cb = pd.manifest.slots.filter((s) => s.role !== 'demo').map((s) => s.comebackKey)
    record('practice', last, pItems, pd, cb)
  }
  return { days, attempts }
}
