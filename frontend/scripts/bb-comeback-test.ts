/**
 * bb-comeback-test — a question missed on a weekly check comes back later, with
 * new numbers, until he knows it.
 *
 * Run (from frontend/): npx tsx scripts/bb-comeback-test.ts
 *
 * WHY (owner, 2026-10-15). The pass bar is 5 of 6; a child can miss for a reason
 * that is not the maths (reading), so the week moves on — and every question
 * missed on any check comes back as a warm-up, 2 / 7 / 21 days apart, until it
 * is right three times in a row with no help (session/comebacks.ts). This asserts:
 *
 *   ledger     on the owner's son's real check log: one entry per (week, slot) ever
 *              missed at the level, the latest miss as origin, review re-answers
 *              and other levels ignored; the schedule moves only on an UNAIDED
 *              first try, a miss resets it, two clean answers on one day count
 *              once, a replayed round counts once, it settles after the third;
 *   due        at most 2 a day counting those already answered today; under-way
 *              ones first (most overdue), then the newest misses;
 *   questions  for every served week × 2 seeds × all 12 check slots, rounds 1..3
 *              keep the slot's template (same skill), differ from every check
 *              question of the week and from each other, carry `-CB-` ids, and
 *              are deterministic. Weeks whose space for a skill is used up may
 *              bring an older question back — never the missed one, never last
 *              round's — and only from a named list (a ratchet), as may the
 *              fixture week with no builder bring the missed one back;
 *   isolation  no comeback id is read as a check answer, a review, a parked daily
 *              item or a sprint by the log's other readers;
 *   sources    every practice day (2–5) opens through the comeback screen, which
 *              logs the unaided first try as attempt 1 under the origin week, day
 *              null, no error tag; the first try shows no step; check questions
 *              read themselves aloud at band B.
 *
 * Every check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator'
import {
  CHECK_FORM_SIZE,
  addDays,
  checkItemsOf,
  comebackLedger,
  comebackRounds,
  dueComebacks,
  localDay,
  parseCheckId,
  type ComebackEntry,
  type LoggedAnswer,
} from '../src/modules/best-brains/session/comebacks'
import { checkMissesFrom, isFormItem } from '../src/modules/best-brains/session/checkReview'
import { distinctFrom } from '../src/modules/best-brains/session/freshForm'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

const row = (item_id: string, answer: string, correct: boolean, at: string, attempt_no = 1, hint_rungs_used = 0): LoggedAnswer =>
  ({ pack_id: `MFM-${item_id.split('-')[0]}`, item_id, answer, correct, attempt_no, hint_rungs_used, created_at: at })

/** His real check misses (bb_item_attempts, read 2026-10-15), plus a few right answers and his week-4 review. */
const HIS: LoggedAnswer[] = [
  row('B1-MA-02', '41', false, '2026-07-21T16:00:00Z'),
  row('B1-MA-01', '1127', false, '2026-07-30T16:00:00Z'),
  row('C1-MA-01', '8', false, '2026-07-30T16:10:00Z'),
  row('C1-MA-02', '2', false, '2026-07-30T16:11:00Z'),
  row('B1-MA-01', '17', false, '2026-07-30T18:00:00Z'),
  row('B1-MA-04', '6', false, '2026-07-30T18:03:00Z'),
  row('B1-MA-02', '51', false, '2026-08-12T16:00:00Z'),
  row('B1-MA-03', '8', false, '2026-08-12T16:01:00Z'),
  row('B1-MA-04', '2', false, '2026-08-12T16:02:00Z'),
  row('B1-MB-02', '5', false, '2026-08-13T02:20:00Z'),
  row('B1-MB-01', '32', true, '2026-08-13T02:19:00Z'),
  row('B2-MA-02', '6', false, '2026-08-26T16:00:00Z'),
  row('B2-MA-04', 'B', false, '2026-08-26T16:01:00Z'),
  row('B2-MA-05', '4', false, '2026-08-26T16:02:00Z'),
  row('B2-MA-06', '4', false, '2026-08-26T16:03:00Z'),
  row('B3-MA-05', 'C', false, '2026-09-26T16:55:00Z'),
  row('B3-MA-06', '5', false, '2026-09-26T16:56:00Z'),
  row('B3-MB-04', '70', false, '2026-09-28T23:12:00Z'),
  row('B4-MA-01', '20', true, '2026-10-13T01:15:14Z'),
  row('B4-MB-04', '6', false, '2026-10-14T23:55:45Z'),
  row('B4-MB-05', '9', false, '2026-10-14T23:56:48Z'),
  row('B4-MB-04', 'review: 5', false, '2026-10-14T23:57:38Z', 2, 1),
  row('B4-MB-04', 'review: 46', false, '2026-10-14T23:58:17Z', 2, 2),
  row('B4-MB-05', 'review: 3', true, '2026-10-14T23:58:38Z', 2, 1),
]

type LedgerFn = (rows: LoggedAnswer[]) => ComebackEntry[]
const realLedger: LedgerFn = (rows) => comebackLedger(rows, 'B')
const at = (day: string, hh = 17) => new Date(`${day}T${String(hh).padStart(2, '0')}:00:00`).toISOString()

// ---------------------------------------------------------------------------
console.log('\nledger — his real check log, and the schedule')
function ledgerFindings(fn: LedgerFn): string[] {
  const out: string[] = []
  const L = fn(HIS)
  const keys = L.map((e) => e.key).join(',')
  if (keys !== 'B1:1,B1:2,B1:3,B1:4,B2:2,B2:4,B2:5,B2:6,B3:4,B3:5,B3:6,B4:4,B4:5') out.push(`entries ${keys}`)
  const b12 = L.find((e) => e.key === 'B1:2')
  if (b12?.originId !== 'B1-MB-02') out.push(`B1 slot 2 origin ${b12?.originId} (the latest miss is the re-check's B1-MB-02)`)
  const b44 = L.find((e) => e.key === 'B4:4')
  if (b44?.missedAt !== '2026-10-14T23:55:45Z') out.push(`B4 slot 4 missed at ${b44?.missedAt} (a review re-answer moved it)`)
  if (b44?.dueOn !== addDays(localDay('2026-10-14T23:55:45Z'), 2)) out.push(`B4 slot 4 due ${b44?.dueOn}`)

  // His week-4 slot 4 from here: clean, hinted-right, clean, clean twice one day, replay, clean.
  const d0 = localDay('2026-10-14T23:55:45Z')
  const step = (rows: LoggedAnswer[]) => fn([...HIS, ...rows]).find((e) => e.key === 'B4:4')!
  const r1 = row('B4-CB-04-1', '9', true, at(addDays(d0, 2)))
  let e = step([r1])
  if (e.step !== 1 || e.dueOn !== addDays(addDays(d0, 2), 7)) out.push(`after a clean round 1: step ${e.step}, due ${e.dueOn}`)
  const r2 = row('B4-CB-04-2', '7', true, at(addDays(d0, 9)), 1, 1) // right, but a hint was showing
  e = step([r1, r2])
  if (e.step !== 0) out.push(`a hinted right answer counted as clean (step ${e.step})`)
  const r3 = row('B4-CB-04-3', '12', true, at(addDays(d0, 11)))
  const r3b = row('B4-CB-04-3', '12', true, at(addDays(d0, 11), 18)) // a replayed round
  const r3c = row('B4-CB-04-3', '13', false, at(addDays(d0, 11), 18), 2, 1) // a try after a hint
  e = step([r1, r2, r3, r3b, r3c])
  if (e.step !== 1 || e.rounds !== 3) out.push(`a replayed round or a later try moved the schedule (step ${e.step}, rounds ${e.rounds})`)
  const r4 = row('B4-CB-04-4', '5', true, at(addDays(d0, 11), 20)) // second clean on the SAME day
  e = step([r1, r2, r3, r4])
  if (e.step !== 1) out.push(`two clean answers on one day counted twice (step ${e.step})`)
  const r5 = row('B4-CB-04-5', '8', true, at(addDays(d0, 18)))
  const r6 = row('B4-CB-04-6', '10', true, at(addDays(d0, 39)))
  e = step([r1, r2, r3, r4, r5])
  if (e.settled) out.push('settled after two clean days')
  e = step([r1, r2, r3, r4, r5, r6])
  if (!e.settled || e.dueOn !== null) out.push(`not settled after three clean days in a row (step ${e.step})`)
  const miss = row('B4-CB-04-2', '3', false, at(addDays(d0, 9)))
  e = step([r1, miss])
  if (e.step !== 0 || e.dueOn !== addDays(addDays(d0, 9), 2)) out.push(`a missed comeback did not go back to 2 days (step ${e.step}, due ${e.dueOn})`)
  // The second re-check's ids (-MB-07..12) are the same six slots.
  const c2 = fn([row('B5-MB-10', '1', false, '2026-11-01T16:00:00Z')])
  if (c2[0]?.key !== 'B5:4') out.push(`a second re-check miss B5-MB-10 mapped to ${c2[0]?.key}`)
  return out
}
const lReal = ledgerFindings(realLedger)
say(lReal.length === 0, `real ledger${lReal.length ? ': ' + lReal.join('; ') : ''}`)
{
  const noPrefix: LedgerFn = (rows) => realLedger(rows.map((r) => ({ ...r, answer: r.answer.replace('review: ', '') })))
  say(ledgerFindings(noPrefix).length > 0, 'control fires: a ledger that reads review re-answers as check misses')
  const hintBlind: LedgerFn = (rows) => realLedger(rows.map((r) => ({ ...r, hint_rungs_used: 0 })))
  say(ledgerFindings(hintBlind).length > 0, 'control fires: a ledger that counts a hinted answer as clean')
  const quick: LedgerFn = (rows) => realLedger(rows).map((e) => (e.step >= 1 ? { ...e, settled: true, dueOn: null } : e))
  say(ledgerFindings(quick).length > 0, 'control fires: a comeback that settles after one clean answer')
  const allLevels: LedgerFn = (rows) => [...realLedger(rows), ...comebackLedger(rows, 'C')]
  say(ledgerFindings(allLevels).length > 0, 'control fires: a ledger that mixes in another level')
}

// ---------------------------------------------------------------------------
console.log('\ndue — two a day, the right two')
type DueFn = typeof dueComebacks
function dueFindings(fn: DueFn): string[] {
  const out: string[] = []
  const now = new Date(at('2026-10-15', 12))
  const L = comebackLedger(HIS, 'B')
  const first = fn(L, HIS, now).map((e) => e.key).join(',')
  if (first !== 'B3:4,B3:6') out.push(`first day serves ${first} (want the newest misses: B3:4,B3:6)`)
  const one = [...HIS, row('B3-CB-04-1', '44', true, at('2026-10-15', 9))]
  const second = fn(comebackLedger(one, 'B'), one, now).map((e) => e.key).join(',')
  if (second !== 'B3:6') out.push(`after one answered today, serves ${second} (want B3:6 only)`)
  const two = [...one, row('B3-CB-06-1', '73', true, at('2026-10-15', 9))]
  const third = fn(comebackLedger(two, 'B'), two, now)
  if (third.length !== 0) out.push(`after two answered today, still serves ${third.map((e) => e.key).join(',')}`)
  // An under-way, overdue entry goes first: B1 slot 1 answered clean 9 days ago (due 2 days ago).
  const started = [...HIS, row('B1-CB-01-1', '42', true, at('2026-10-06'))]
  const lead = fn(comebackLedger(started, 'B'), started, now)[0]?.key
  if (lead !== 'B1:1') out.push(`an overdue under-way comeback waits behind new ones (first: ${lead})`)
  // Nothing comes back before it is due: on the day of his week-4 miss, B4 is not served.
  const early = fn(L, HIS, new Date(at(localDay('2026-10-14T23:55:45Z'), 23)))
  if (early.some((e) => e.week === 4)) out.push('a week-4 miss came back the same day')
  return out
}
const dReal = dueFindings(dueComebacks)
say(dReal.length === 0, `real due list${dReal.length ? ': ' + dReal.join('; ') : ''}`)
{
  const noCap: DueFn = (ledger, rows, now) => dueComebacks(ledger, rows.filter((r) => !r.item_id.includes('-CB-') || localDay(r.created_at) !== localDay(now ?? new Date())), now)
  say(dueFindings(noCap).length > 0, 'control fires: a cap that forgets the ones answered today')
  const oldestFirst: DueFn = (ledger, rows, now) => [...dueComebacks(ledger, rows, now)].reverse()
  say(dueFindings(oldestFirst).length > 0, 'control fires: the older miss served first')
}

// ---------------------------------------------------------------------------
console.log('\nquestions — same skill, new numbers, every served week')
const SEEDS = [12345, 645474193]
const ROUNDS = 3
/**
 * Ratchets — may shrink, never grow. OLDER: weeks whose space for a skill runs out
 * by round 3 (A12 "partners" by round 2). ORIGIN: A15 is a fixture with no builder.
 */
const OLDER_ALLOWED = new Set(['A2', 'A12', 'A22', 'B22'])
const ORIGIN_ALLOWED = new Set(['A15'])
type Rounds = typeof comebackRounds
let slotsChecked = 0
const olderCells = new Set<string>()
const originCells = new Set<string>()
function questionFindings(fn: Rounds, weeks = AVAILABLE_WEEKS, seeds = SEEDS): string[] {
  const out: string[] = []
  for (const c of weeks) {
    for (const seed of seeds) {
      const pack = generatePack(c.level, c.week, seed)
      const cell = `${c.level}${c.week}`
      const items = checkItemsOf(pack, seed, undefined)
      for (const form of ['A', 'B'] as const) {
        for (let slot = 1; slot <= CHECK_FORM_SIZE; slot++) {
          const originId = `${cell}-M${form}-${String(slot).padStart(2, '0')}`
          const origin = items.find((i) => i.id === originId)
          if (!origin) { out.push(`${cell}@${seed}: no ${originId}`); continue }
          const rounds = fn({ level: c.level, week: c.week, slot, originId }, pack, seed, undefined, ROUNDS, items)
          slotsChecked++
          if (!rounds || rounds.length !== ROUNDS) { out.push(`${originId}@${seed}: ${rounds?.length ?? 'no'} rounds`); continue }
          rounds.forEach((r, i) => {
            const want = `${cell}-CB-${String(slot).padStart(2, '0')}-${i + 1}`
            if (r.item.id !== want) out.push(`${originId}@${seed} round ${i + 1}: id ${r.item.id}, want ${want}`)
            if (r.kind === 'origin') {
              originCells.add(cell)
              if (!ORIGIN_ALLOWED.has(cell)) out.push(`${originId}@${seed} round ${i + 1}: the missed question itself came back`)
              return
            }
            const a = origin.generator?.templateId
            if (a && r.item.generator?.templateId !== a) out.push(`${originId}@${seed} round ${i + 1}: skill changed (${a} → ${r.item.generator?.templateId})`)
            const earlier = rounds.slice(0, i).map((x) => x.item)
            if (r.kind === 'new') {
              if (!distinctFrom([r.item], [...items, ...earlier])) out.push(`${originId}@${seed} round ${i + 1}: called new, but he has met it`)
            } else {
              olderCells.add(cell)
              if (!OLDER_ALLOWED.has(cell)) out.push(`${originId}@${seed} round ${i + 1}: an older question, in a week not on the list`)
              const last = earlier[earlier.length - 1]
              if (!distinctFrom([r.item], last ? [origin, last] : [origin])) out.push(`${originId}@${seed} round ${i + 1}: the older question is the missed one or last round's`)
            }
          })
          if (seed === seeds[0] && slot === 4) {
            const again = fn({ level: c.level, week: c.week, slot, originId }, pack, seed, undefined, ROUNDS, items)
            if (JSON.stringify(again) !== JSON.stringify(rounds)) out.push(`${originId}@${seed}: not the same on a reload`)
          }
        }
      }
    }
  }
  return out
}
{
  const sizes = new Set(AVAILABLE_WEEKS.map((c) => { const p = generatePack(c.level, c.week, 12345); return `${p.masteryCheck.formA.length}/${p.masteryCheck.formB.length}` }))
  say(sizes.size === 1 && sizes.has(`${CHECK_FORM_SIZE}/${CHECK_FORM_SIZE}`), `every served form has ${CHECK_FORM_SIZE} questions (slot mapping holds): ${[...sizes].join(', ')}`)
}
const t0 = Date.now()
const qReal = questionFindings(comebackRounds)
say(qReal.length === 0, `${slotsChecked} check slots × ${ROUNDS} rounds${qReal.length ? ': ' + qReal.slice(0, 5).join('; ') + (qReal.length > 5 ? ` … +${qReal.length - 5}` : '') : ''}`)
console.log(`  (report) older questions in: ${[...olderCells].join(', ') || 'none'} · the missed one in: ${[...originCells].join(', ') || 'none'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`)
say(
  [...OLDER_ALLOWED].every((c) => olderCells.has(c)) && [...ORIGIN_ALLOWED].every((c) => originCells.has(c)),
  `the allowed lists hold no week that now builds new questions (ratchet): older ${[...OLDER_ALLOWED].join(', ')} · origin ${[...ORIGIN_ALLOWED].join(', ')}`,
)
{
  const few = AVAILABLE_WEEKS.filter((c) => ['B4', 'A12', 'C3'].includes(`${c.level}${c.week}`))
  const same: Rounds = (o, pack, seed, cv, upTo, items) => comebackRounds(o, pack, seed, cv, upTo, items)?.map((r) => ({ ...r, item: { ...items!.find((x) => x.id === o.originId)!, id: r.item.id } })) ?? null
  say(questionFindings(same, few, [12345]).length > 0, 'control fires: a comeback that re-serves the question he missed')
  const repeat: Rounds = (o, pack, seed, cv, upTo, items) => { const r = comebackRounds(o, pack, seed, cv, upTo, items); return r && r.map((x, i) => (i === 2 ? { ...r[0], item: { ...r[0].item, id: x.item.id } } : x)) }
  say(questionFindings(repeat, few, [12345]).length > 0, 'control fires: round 3 repeating round 1')
  const mIds: Rounds = (o, pack, seed, cv, upTo, items) => comebackRounds(o, pack, seed, cv, upTo, items)?.map((r, i) => ({ ...r, item: { ...r.item, id: `${o.originId}-r${i + 1}` } })) ?? null
  say(questionFindings(mIds, few, [12345]).length > 0, 'control fires: ids built on the check id')
  const lazy: Rounds = (o, pack, seed, cv, upTo, items) => comebackRounds(o, pack, seed, cv, upTo, items)?.map((r, i) => (i === 1 ? { ...r, kind: 'older' as const } : r)) ?? null
  say(questionFindings(lazy, few, [12345]).length > 0, 'control fires: a week off the list settling for an older question')
}

// ---------------------------------------------------------------------------
console.log('\nisolation — no other reader of the log mistakes a comeback for its own row')
function isolationFindings(id: string): string[] {
  const out: string[] = []
  if (/-M/.test(id)) out.push(`${id} matches the review reader's LIKE '%-M%'`)
  if (/-D\d-/.test(id)) out.push(`${id} matches the treasure chest's daily-slot pattern`)
  if (id.includes('#')) out.push(`${id} looks like a sprint row`)
  if (isFormItem(id, 'A') || isFormItem(id, 'B')) out.push(`${id} reads as a check item`)
  if (parseCheckId(id)) out.push(`${id} parses as a check id`)
  if (checkMissesFrom([{ item_id: id, answer: '3', correct: false, attempt_no: 1, created_at: '2026-10-20T16:00:00Z' }], 'B').length) out.push(`${id} shows up as a check miss`)
  return out
}
const iReal = ['B4-CB-04-1', 'A12-CB-06-3', 'E24-CB-01-12'].flatMap(isolationFindings)
say(iReal.length === 0, `comeback ids are invisible to the other readers${iReal.length ? ': ' + iReal.join('; ') : ''}`)
say(isolationFindings('B4-MB-04-r1').length > 0, 'control fires: an id built on the check id')

// ---------------------------------------------------------------------------
console.log('\nsources — every practice day opens through the comebacks, recorded honestly')
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/modules/best-brains')
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), 'utf8')
interface Srcs { hub: string; routes: string; screen: string; review: string; runner: string; service: string }
const real: Srcs = {
  hub: read('screens/ThisWeekHub.tsx'),
  routes: read('FoundryRoutes.tsx'),
  screen: read('screens/Comebacks.tsx'),
  review: read('components/CheckReview.tsx'),
  runner: read('components/CheckRunner.tsx'),
  service: read('services/bbProgressService.ts'),
}
function sourceFindings(s: Srcs): string[] {
  const out: string[] = []
  if (!s.hub.includes('navigate(`/foundry/day/${day}/comeback`)')) out.push('the hub does not open days through the comebacks')
  if (s.hub.includes('navigate(`/foundry/day/${day}/warmup`)')) out.push('the hub still opens the warm-up directly')
  if (!/path="day\/:day\/comeback" element=\{<Comebacks \/>\}/.test(s.routes)) out.push('no comeback route')
  if (!/when="comeback"/.test(s.screen)) out.push('the comeback screen is not the review in comeback mode')
  if (!/attemptNo: stepsShown \+ 1,/.test(s.screen)) out.push('the unaided first try is not attempt 1')
  if (!/day: null,/.test(s.screen)) out.push('comebacks are logged against a practice day (would move its stability rule)')
  if (/errorTag/.test(s.screen)) out.push('comebacks carry an error tag (would feed this week\'s miss patterns)')
  if (!/packId: `MFM-\$\{cb\.level\}\$\{cb\.week\}`/.test(s.screen)) out.push('comebacks are not logged under their origin week')
  if (!/const firstSteps = when === 'comeback' \? 0 : 1;/.test(s.review)) out.push('a comeback\'s first try shows a step')
  if (!/autoplay=\{band !== 'C'\}/.test(s.runner)) out.push('check questions do not read themselves aloud at band B')
  if (!/read\('%-CB-%'\)/.test(s.service) || !/read\('%-M%'\)/.test(s.service)) out.push('the ledger reader misses one of its two id shapes')
  return out
}
const sReal = sourceFindings(real)
say(sReal.length === 0, `real sources${sReal.length ? ': ' + sReal.join('; ') : ''}`)
{
  const direct = { ...real, hub: real.hub.replace('navigate(`/foundry/day/${day}/comeback`)', 'navigate(`/foundry/day/${day}/warmup`)') }
  say(direct.hub !== real.hub && sourceFindings(direct).length > 0, 'control fires: a hub that skips the comebacks')
  const daily = { ...real, screen: real.screen.replace('day: null,', 'day,') }
  say(daily.screen !== real.screen && sourceFindings(daily).length > 0, 'control fires: comebacks logged against today\'s practice day')
  const helped = { ...real, review: real.review.replace("const firstSteps = when === 'comeback' ? 0 : 1;", 'const firstSteps = 1;') }
  say(helped.review !== real.review && sourceFindings(helped).length > 0, 'control fires: a step showing on the first try')
  const silent = { ...real, runner: real.runner.replace("autoplay={band !== 'C'}", "autoplay={band === 'A'}") }
  say(silent.runner !== real.runner && sourceFindings(silent).length > 0, 'control fires: check questions silent at band B')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
