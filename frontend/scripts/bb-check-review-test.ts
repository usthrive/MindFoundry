/**
 * bb-check-review-test — every weekly check is gone over afterwards, and the
 * going-over never gives the answer away before the child has tried again.
 *
 * Run (from frontend/): npx tsx scripts/bb-check-review-test.ts
 *
 * WHY (owner "go", 2026-09-26). The check holds feedback so it can measure; a
 * tutor then goes over the paper. The owner's son chose 47 over 54 on his check
 * and was never shown it. Now each miss comes back with his answer, the question,
 * a guiding step and another go (components/CheckReview.tsx). This asserts:
 *
 *   misses    the review finds the misses of the LATEST sitting of a form, knows
 *             which are already reviewed, and handles Form B (whose answers carry
 *             attempt_no = cycle, so attempt_no cannot mark a check answer);
 *   no-leak   across every check item (Form A + B, every served week), the steps
 *             the review shows first never state the answer;
 *   sources   both check screens render the review BEFORE their route guard (the
 *             week leaves the check state the moment it is scored), mark the
 *             hand-off `reviewed`, write re-answers with the review prefix and no
 *             error tag; the strengthening screen reviews unreviewed misses first.
 *
 * Every check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator'
import {
  checkMissesFrom,
  answerAsShown,
  reviewSteps,
  REVIEW_PREFIX,
  type AttemptRow,
} from '../src/modules/best-brains/session/checkReview'
import type { MasteryForm, PackItem } from '../src/modules/best-brains/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

// ---------------------------------------------------------------------------
// misses
// ---------------------------------------------------------------------------
type MissFn = (rows: AttemptRow[], form: MasteryForm) => ReturnType<typeof checkMissesFrom>
const row = (item_id: string, answer: string, correct: boolean, attempt_no: number, t: string): AttemptRow =>
  ({ item_id, answer, correct, attempt_no, created_at: `2026-09-26T16:${t}:00Z` })

function missFindings(fn: MissFn): string[] {
  const out: string[] = []
  // His real shape: Form A, two misses (MA-05 'C', MA-06 '5'), nothing reviewed.
  const his = [
    row('B3-MA-01', 'B', true, 1, '00'), row('B3-MA-05', 'C', false, 1, '55'), row('B3-MA-06', '5', false, 1, '56'),
  ]
  const a = fn(his, 'A')
  if (a.map((m) => `${m.itemId}:${m.answer}:${m.reviewed}`).join(',') !== 'B3-MA-05:C:false,B3-MA-06:5:false') {
    out.push(`his Form A misses read as ${JSON.stringify(a)}`)
  }
  // After a review of MA-05 only: MA-05 reviewed, MA-06 not.
  const reviewed = fn([...his, row('B3-MA-05', `${REVIEW_PREFIX}A`, true, 2, '58')], 'A')
  if (!reviewed.find((m) => m.itemId === 'B3-MA-05')?.reviewed || reviewed.find((m) => m.itemId === 'B3-MA-06')?.reviewed) {
    out.push('a review of one miss is not told apart from the other')
  }
  // Form B cycle 2 writes attempt_no 2; the latest sitting decides.
  const formB = [
    row('B3-MB-02', '40', false, 1, '10'), row('B3-MB-02', '44', true, 2, '30'),
    row('B3-MB-03', '9', true, 1, '11'), row('B3-MB-03', '8', false, 2, '31'),
  ]
  const b = fn(formB, 'B')
  if (b.map((m) => m.itemId).join(',') !== 'B3-MB-03') out.push(`Form B cycle 2 misses read as ${JSON.stringify(b)}`)
  // A review answer is never mistaken for a check answer.
  const onlyReview = fn([row('B3-MA-02', `${REVIEW_PREFIX}7`, false, 2, '20')], 'A')
  if (onlyReview.length !== 0) out.push('a review re-answer was read as a check miss')
  return out
}

console.log('\nmisses — which answers come back, and which are already gone over')
const mReal = missFindings(checkMissesFrom)
say(mReal.length === 0, `real reader${mReal.length ? ': ' + mReal.join('; ') : ''}`)
{
  // Control A: attempt_no 1 taken to mean "a check answer" — blind to Form B cycle 2.
  const firstOnly: MissFn = (rows, form) => checkMissesFrom(rows.filter((r) => r.attempt_no === 1), form)
  // Control B: the review prefix ignored — a review answer overwrites the check answer.
  const noPrefix: MissFn = (rows, form) =>
    checkMissesFrom(rows.map((r) => ({ ...r, answer: r.answer.replace(REVIEW_PREFIX, '') })), form)
  say(missFindings(firstOnly).length > 0, 'control fires: a reader that trusts attempt_no 1 (misses Form B cycle 2)')
  say(missFindings(noPrefix).length > 0, 'control fires: a reader that cannot tell a review from a check answer')
}

// ---------------------------------------------------------------------------
// no-leak
// ---------------------------------------------------------------------------
console.log('\nno-leak — the review steps never state the answer (every check item, every served week)')
const leakFor = (item: PackItem, steps: string[]): boolean => {
  const ans = answerAsShown(item, item.answer.value).trim()
  if (!ans) return false
  const esc = ans.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return steps.some((s) => new RegExp(`(^|[^0-9A-Za-z])${esc}([^0-9A-Za-z]|$)`, 'i').test(s))
}
let items = 0
let leaks: string[] = []
let noStep = 0
for (const c of AVAILABLE_WEEKS) {
  const p = generatePack(c.level, c.week, 12345)
  for (const it of [...p.masteryCheck.formA, ...p.masteryCheck.formB]) {
    items++
    const steps = reviewSteps(it)
    if (steps.length === 0) noStep++
    if (leakFor(it, steps)) leaks.push(`${it.id} [${answerAsShown(it, it.answer.value)}]`)
  }
}
say(leaks.length === 0, `${items} check items: no review step states the answer${leaks.length ? ' — ' + leaks.slice(0, 5).join(', ') : ''}`)
console.log(`  (report) check items with no guiding step at all: ${noStep} — those go straight from a miss to the reasoned answer`)
{
  const p = generatePack('B', 3, 1262874861, '1.2.0')
  const it = p.masteryCheck.formA.find((i) => i.id === 'B3-MA-05')!
  say(leakFor(it, ['Look: 54 has the most tens.']), 'control fires: a step that names the answer (54)')
}

// ---------------------------------------------------------------------------
// sources
// ---------------------------------------------------------------------------
console.log('\nsources — the review is reachable, ahead of the guards, and recorded honestly')
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/modules/best-brains')
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), 'utf8')

function checkScreenFindings(name: string, src: string): string[] {
  const out: string[] = []
  const review = src.indexOf('<CheckReview')
  const guard = src.indexOf('// Route guard')
  if (review === -1) out.push(`${name} never shows the review`)
  else if (guard !== -1 && review > guard) out.push(`${name} renders the review AFTER its route guard (it would never show)`)
  const block = review === -1 ? '' : src.slice(review, review + 900)
  if (!/`\$\{REVIEW_PREFIX\}\$\{answer\}`/.test(block)) out.push(`${name} records re-answers without the review prefix`)
  if (/errorTag/.test(block)) out.push(`${name} tags review re-answers with an error tag (would feed the parent's miss patterns)`)
  // EVERY hand-off to the strengthening screen must say the review happened —
  // Form B has two (cycle 2 and escalated); one bare hand-off repeats the review.
  const handoffs = (src.match(/navigate\('\/foundry\/strengthen'/g) ?? []).length
  const marked = (src.match(/navigate\('\/foundry\/strengthen', \{ replace: true, state: \{ entry: '[a-z0-9]+', reviewed: true \} \}\)/g) ?? []).length
  if (handoffs !== marked) out.push(`${name}: ${handoffs - marked} of ${handoffs} hand-off(s) to strengthening not marked reviewed (the review would repeat)`)
  return out
}
function strengthenFindings(src: string): string[] {
  const out: string[] = []
  if (!/listCheckAttempts\(/.test(src)) out.push('StrengthenPlan never reads the last check')
  if (!/<CheckReview[\s\S]{0,200}when="before-strengthening"/.test(src)) out.push('StrengthenPlan never reviews unreviewed misses')
  if (/subtype\.replace\(/.test(src)) out.push('StrengthenPlan names the skill with the adult slug again')
  return out
}

const weekly = read('screens/WeeklyCheck.tsx')
const fresh = read('screens/FreshProblems.tsx')
const strengthen = read('screens/StrengthenPlan.tsx')
const sReal = [...checkScreenFindings('WeeklyCheck', weekly), ...checkScreenFindings('FreshProblems', fresh), ...strengthenFindings(strengthen)]
say(sReal.length === 0, `real screens${sReal.length ? ': ' + sReal.join('; ') : ''}`)
{
  const late = weekly.replace('// Route guard: the check only exists', '// Route guard moved\n  // Route guard: the check only exists')
  const moved = late.slice(0, late.indexOf('  // The review runs AFTER scoring')) + '  // Route guard (early)\n' + late.slice(late.indexOf('  // The review runs AFTER scoring'))
  say(checkScreenFindings('WeeklyCheck', moved).length > 0, 'control fires: the review placed after a route guard')
  const tagged = weekly.replace('hintRungsUsed: stepsShown,', 'hintRungsUsed: stepsShown,\n            errorTag: item.errorTags[0],')
  say(tagged !== weekly && checkScreenFindings('WeeklyCheck', tagged).length > 0, 'control fires: review re-answers tagged as new errors')
  const noFlag = fresh.replace("state: { entry: 'cycle2', reviewed: true }", "state: { entry: 'cycle2' }")
  say(noFlag !== fresh && checkScreenFindings('FreshProblems', noFlag).length > 0, 'control fires: a hand-off that would make the review repeat')
  const slug = strengthen.replace("const skill = dominantTag", "const skillX = entry.subtype.replace(/-/g, ' '); const skill = dominantTag")
  say(strengthenFindings(slug).length > 0, 'control fires: the adult slug back on the strengthening screen')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
