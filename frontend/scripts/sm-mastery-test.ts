/**
 * sm-mastery-test — the skill-state machine and the weakness order, re-scored from fixture
 * attempt histories (ENGINE-SPEC §4.5–§4.6; METHODOLOGY §4; TAD §2).
 *
 * Run (from frontend/): npx tsx scripts/sm-mastery-test.ts
 *
 * Asserts: "knows" on two separate LOCAL days (first try, no scaffold, within fluency time);
 * a one-day double is not "knows"; the local day, not the UTC date, decides; review, exit,
 * starter, step and check answers never make "knows" (a check pass is one day's evidence at
 * most); a return miss moves a known skill back; the stall rule (6 practice days, no clean
 * day → stuck; a clean day → learning; park after 6 more; a parked skill's return right →
 * learning); the fluency rule (waived before six times; 1.5 × the median; falls at most a
 * fifth a month); "already knows" from two preview days; `weakness()` order on a fixture set.
 * Prints, per fixture, which "knows" a naive rule would have granted that does not hold.
 * Controls: a mastery function that counts two answers on one day as two days; one that
 * counts an exit item; a weakness function with keys 2 and 3 swapped.
 */
import { skillStatus, type MasteryEvent, type SkillStatus } from '../src/modules/school-math/engine/mastery'
import { weakestFirst, weakness, type WeaknessTuple } from '../src/modules/school-math/engine/scheduler'
import type { SMAttempt, SMDayKind, SMRole } from '../src/modules/school-math/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const control = (fired: boolean, msg: string) => say(fired, `control fired: ${msg}`)

const S = 'G1-U02-K6'
let clock = 0
interface Fx { day: string; role?: SMRole; right?: boolean; ms?: number; scaffold?: boolean; rung?: 0 | 1 | 2 | 3 | 4; kind?: SMDayKind; skill?: string; utc?: string }
function at(f: Fx): SMAttempt {
  clock++
  const role = f.role ?? 'practice'
  return {
    itemId: `fx-${clock}`, templateId: 'sm.g1u02.l4.sub_pad', unitId: 'G1-U02', lessonId: 'G1-U02-L4', role,
    skillIds: [f.skill ?? S], firstTryCorrect: f.right ?? true, tries: 1, answers: ['x'], firstTryMs: f.ms ?? 8000,
    scaffoldVisible: f.scaffold ?? false, ladderRung: f.rung ?? 0, dayKind: f.kind ?? (role === 'check' ? 'check' : ['step', 'starter', 'exit'].includes(role) ? 'lesson' : 'practice'),
    localDay: f.day, createdAt: f.utc ?? `${f.day}T21:00:${String(clock % 60).padStart(2, '0')}.000Z`, signature: `fx${clock}`,
  }
}

type MasteryFn = (skill: string, a: readonly SMAttempt[], e?: readonly MasteryEvent[]) => SkillStatus
const real: MasteryFn = (s, a, e) => skillStatus(s, a, e ?? [])

interface Case { name: string; attempts: SMAttempt[]; want: SkillStatus['state']; naive?: string }
function cases(): Case[] {
  const out: Case[] = []
  out.push({ name: 'two separate local days, practice, first try, no scaffold', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-25' })], want: 'known' })
  out.push({ name: 'one day, two right answers (a one-day double)', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-23' })], want: 'learning', naive: 'counting answers, not days' })
  // UTC vs local: both answers on the local evening of 11-23 (UTC−5): 18:30 is 23:30Z, 20:30 is 01:30Z on 11-24
  out.push({ name: 'one local day that spans two UTC dates', attempts: [at({ day: '2026-11-23', utc: '2026-11-23T23:30:00.000Z' }), at({ day: '2026-11-23', utc: '2026-11-24T01:30:00.000Z' })], want: 'learning', naive: 'counting UTC dates' })
  out.push({ name: 'two local days inside one UTC date', attempts: [at({ day: '2026-11-23', utc: '2026-11-24T04:00:00.000Z' }), at({ day: '2026-11-24', utc: '2026-11-24T05:30:00.000Z' })], want: 'known', naive: 'counting UTC dates would deny it' })
  out.push({ name: 'exit items on two days', attempts: [at({ day: '2026-11-23', role: 'exit' }), at({ day: '2026-11-25', role: 'exit' })], want: 'learning', naive: 'counting exit items' })
  out.push({ name: 'step and starter items on two days', attempts: [at({ day: '2026-11-23', role: 'step' }), at({ day: '2026-11-25', role: 'starter' })], want: 'learning', naive: 'counting lesson steps' })
  out.push({ name: 'review answers on two days', attempts: [at({ day: '2026-11-23', role: 'review' }), at({ day: '2026-11-25', role: 'review' })], want: 'not-started', naive: 'counting review answers' })
  out.push({ name: 'check passes on two days (one day\'s evidence at most)', attempts: [at({ day: '2026-11-23', role: 'check' }), at({ day: '2026-11-25', role: 'check' })], want: 'learning', naive: 'a check pass as "knows"' })
  out.push({ name: 'a practice day and a check day (the check gives one day)', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-25', role: 'check' })], want: 'known' })
  out.push({ name: 'scaffold visible on one of the two days', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-25', scaffold: true })], want: 'learning', naive: 'ignoring the scaffold' })
  out.push({ name: 'right on the second try on one day', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-25', right: false })], want: 'learning' })
  out.push({ name: 'known, then a return miss (moved back)', attempts: [at({ day: '2026-11-23' }), at({ day: '2026-11-25' }), at({ day: '2026-12-01', role: 'return', right: false })], want: 'learning' })
  out.push({ name: 'previews right on two days ("already knows", not known)', attempts: [at({ day: '2026-11-23', role: 'preview' }), at({ day: '2026-11-25', role: 'preview' })], want: 'not-started' })
  return out
}

// ---------------------------------------------------------------------------
console.log('\nknows — two separate local days, first try, no scaffold, within fluency time')
function runCases(fn: MasteryFn): Array<{ c: Case; got: string }> {
  return cases().map((c) => ({ c, got: fn(S, c.attempts).state }))
}
for (const { c, got } of runCases(real)) say(got === c.want, `${c.name}: ${got} (want ${c.want})`)

// the naive rules, to print which "knows" would not have held
const naiveSameDay: MasteryFn = (s, a, e) => real(s, a.map((x, i) => ({ ...x, localDay: `2026-01-${String(i + 1).padStart(2, '0')}` })), e)
const naiveUtc: MasteryFn = (s, a, e) => real(s, a.map((x) => ({ ...x, localDay: x.createdAt.slice(0, 10) })), e)
const naiveExit: MasteryFn = (s, a, e) => real(s, a.map((x) => (['exit', 'step', 'starter', 'review'].includes(x.role) ? { ...x, role: 'practice' as const } : x)), e)
const naiveCheck: MasteryFn = (s, a, e) => real(s, a.map((x) => (x.role === 'check' ? { ...x, role: 'practice' as const, dayKind: 'practice' as const } : x)), e)
console.log('  which "knows" a naive rule would have granted (and the real rule does not):')
for (const [label, fn] of [['two answers on one day = two days', naiveSameDay], ['UTC date as the day', naiveUtc], ['lesson / review items count', naiveExit], ['a check pass counts like practice', naiveCheck]] as const) {
  const wrong = cases().filter((c) => fn(S, c.attempts).state === 'known' && real(S, c.attempts).state !== 'known').map((c) => c.name)
  const lost = cases().filter((c) => fn(S, c.attempts).state !== 'known' && real(S, c.attempts).state === 'known').map((c) => c.name)
  console.log(`    ${label}: would grant "knows" on ${wrong.length ? wrong.join('; ') : 'none'}${lost.length ? ` · would deny it on ${lost.join('; ')}` : ''}`)
}

// ---------------------------------------------------------------------------
console.log('\nstall rule — 6 practice days without a clean day; park after 6 more; ways out')
{
  const miss = (d: string) => at({ day: d, right: false, rung: 2 })
  const days = Array.from({ length: 14 }, (_, i) => `2026-12-${String(i + 1).padStart(2, '0')}`)
  const six = days.slice(0, 6).map(miss)
  say(real(S, days.slice(0, 5).map(miss)).state === 'learning', 'after 5 practice days without a clean day: learning')
  say(real(S, six).state === 'stuck', 'after 6 practice days without a clean day: stuck')
  say(real(S, [...six, at({ day: days[6] })]).state === 'learning', 'stuck, then a clean day: learning')
  const twelve = days.slice(0, 12).map(miss)
  const park11: MasteryEvent = { kind: 'park', skillId: S, localDay: days[10] }
  const park12: MasteryEvent = { kind: 'park', skillId: S, localDay: days[11] }
  const early = real(S, days.slice(0, 11).map(miss), [park11])
  say(early.state === 'stuck' && early.ignoredEvents.length === 1, `a park after 11 days is not allowed yet (stays ${early.state}; the event is reported, not silent)`)
  say(real(S, twelve, [park12]).state === 'parked', 'stuck after 12 days and the parent parks it: parked')
  say(real(S, [...twelve, at({ day: days[12], role: 'return' })], [park12]).state === 'learning', 'parked, then a return answered right: learning')
  const scaffoldDay = [...days.slice(0, 5).map(miss), at({ day: days[5], scaffold: true })]
  say(real(S, scaffoldDay).state === 'stuck', 'a day right only with a scaffold visible is not clean (6th day → stuck)')
}

// ---------------------------------------------------------------------------
console.log('\nfluency — waived before six times; 1.5 × the median; falls at most a fifth a month')
{
  // six evidence times of 10 s, all on one day (so the skill stays learning)
  const sameDay = Array.from({ length: 6 }, () => at({ day: '2026-11-02', ms: 10000 }))
  const st6 = real(S, sameDay)
  say(st6.fluencyMs === null, `six times recorded, none applied yet before a seventh attempt: fluency ${st6.fluencyMs}`)
  const slow = real(S, [...sameDay, at({ day: '2026-11-03', ms: 20000 })])
  say(slow.fluencyMs === 15000 && slow.state === 'learning', `fluency 1.5 × 10 s = ${slow.fluencyMs} ms; a 20 s right answer on a second day does not qualify (${slow.state})`)
  const inTime = real(S, [...sameDay, at({ day: '2026-11-03', ms: 14000 })])
  say(inTime.state === 'known', `a 14 s right answer on a second day qualifies: ${inTime.state}`)
  const early = real(S, [at({ day: '2026-11-02', ms: 90000 }), at({ day: '2026-11-03', ms: 90000 })])
  say(early.state === 'known', `before six times exist, a slow answer still qualifies (no clock without data): ${early.state}`)
  const fast = Array.from({ length: 6 }, () => at({ day: '2026-12-02', ms: 2000 }))
  const fell = real(S, [...sameDay, ...fast, at({ day: '2027-01-05', ms: 2000 })])
  say(fell.fluencyMs === 12000, `a month of 2 s answers: the fluency falls from 15000 to ${fell.fluencyMs} ms (at most a fifth)`)
}

// ---------------------------------------------------------------------------
console.log('\nalready knows — two right previews on separate days')
{
  const a = real(S, [at({ day: '2026-11-23', role: 'preview' }), at({ day: '2026-11-25', role: 'preview' })])
  const b = real(S, [at({ day: '2026-11-23', role: 'preview' }), at({ day: '2026-11-23', role: 'preview' })])
  const c = real(S, [at({ day: '2026-11-23', role: 'preview', right: false }), at({ day: '2026-11-25', role: 'preview', right: false })])
  say(a.alreadyKnows && !b.alreadyKnows && c.state === 'not-started', `two days: already knows ${a.alreadyKnows}; one day twice: ${b.alreadyKnows}; preview misses leave the skill ${c.state}`)
}

// ---------------------------------------------------------------------------
console.log('\nweakness() — the seven keys in order, on a fixture set')
const TODAY = '2026-12-20'
const W = (n: number) => `G1-U02-K${n}`
function weaknessFixture(): SMAttempt[] {
  const a: SMAttempt[] = []
  const d = (n: number) => `2026-12-${String(n).padStart(2, '0')}`
  // K1 stuck (6 practice days, no clean day)
  for (let i = 1; i <= 6; i++) a.push(at({ skill: W(1), day: d(i), right: false, rung: 1 }))
  // K2 learning with a miss in its last 3 served days: 2 misses
  a.push(at({ skill: W(2), day: d(10) }), at({ skill: W(2), day: d(11), right: false, rung: 1 }), at({ skill: W(2), day: d(12), right: false, rung: 1 }))
  // K3 learning with a miss: 1 miss, but rung 4 (more misses outrank a higher rung: key 2 before key 3)
  a.push(at({ skill: W(3), day: d(10), scaffold: true }), at({ skill: W(3), day: d(11), scaffold: true }), at({ skill: W(3), day: d(12), right: false, rung: 4 }))
  // K4 little evidence (one served day, right)
  a.push(at({ skill: W(4), day: d(15) }))
  // K5 learning, no miss, scaffold on its last items
  a.push(at({ skill: W(5), day: d(13), scaffold: true }), at({ skill: W(5), day: d(14), scaffold: true }))
  // K7 known, last served long ago; K8 known, served recently (days-since orders them)
  a.push(at({ skill: W(7), day: d(1) }), at({ skill: W(7), day: d(2) }))
  a.push(at({ skill: W(8), day: d(16) }), at({ skill: W(8), day: d(17) }))
  // K9 known, then a return miss (moved back)
  a.push(at({ skill: W(9), day: d(3) }), at({ skill: W(9), day: d(4) }), at({ skill: W(9), day: d(18), role: 'return', right: false, rung: 1 }), at({ skill: W(9), day: d(19), role: 'return' }), at({ skill: W(9), day: d(19), role: 'return' }))
  return a
}
const WANT = [W(1), W(2), W(3), W(4), W(5), W(9), W(7), W(8)]
{
  const atts = weaknessFixture()
  const order = weakestFirst(WANT, atts, TODAY)
  for (const s of WANT) console.log(`    ${s} ${JSON.stringify(weakness(s, atts, TODAY))}  (${skillStatus(s, atts).state})`)
  say(JSON.stringify(order) === JSON.stringify(WANT), `weakest first: ${order.join(' > ')}`)
}

// ---------------------------------------------------------------------------
console.log('\nbroken controls — each must fire')
{
  const flip = (fn: MasteryFn) => runCases(fn).some(({ c, got }) => got !== c.want)
  control(flip(naiveSameDay) && naiveSameDay(S, cases()[1].attempts).state === 'known', 'a mastery function that counts two answers on one day as two days grants "knows" on the one-day double')
  control(flip(naiveExit) && naiveExit(S, cases()[4].attempts).state === 'known', 'a mastery function that counts exit items grants "knows" on two exit days')
  const swapped = (s: string, a: readonly SMAttempt[], t: string): WeaknessTuple => {
    const w = weakness(s, a, t)
    return [w[0], w[2], w[1], w[3], w[4], w[5], w[6]]
  }
  const atts = weaknessFixture()
  const order = weakestFirst(WANT, atts, TODAY, swapped)
  control(JSON.stringify(order) !== JSON.stringify(WANT), `a weakness function with keys 2 and 3 swapped orders them ${order.join(' > ')}`)
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-mastery-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
