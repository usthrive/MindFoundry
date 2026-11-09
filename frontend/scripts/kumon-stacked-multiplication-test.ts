/**
 * kumon-stacked-multiplication-test — stacked multiplication (Kumon C51–C110) is
 * taught in the method the sheet asks for, and the sheet stops tripping the child.
 *
 * Run (from frontend/): npx tsx scripts/kumon-stacked-multiplication-test.ts
 *
 * WHY (owner, 2026-11-09). His son reached the stacked sheets with no lesson: the
 * C51 intro had been marked seen in September (he was moved back to C15 by a
 * direct database change that skipped the app's own clear-intros step), and it
 * taught arrays and "break apart" anyway. After a miss he got times-table help (a
 * 28-row array, repeated addition). On the sheet, an empty third box looked like a
 * missing digit ("665" for 65), a digit + Enter jumped to the next problem (31 of
 * his 70 problems began with a stray digit), and digits typed left to right read
 * backwards ("69" for 96). His real misses were carry errors: 17 × 9 → "163".
 * This asserts:
 *
 *   method     for every top number 10–999 and multiplier 2–9, the worked frames
 *              write a × b exactly, add each carry, carry only out of a non-last
 *              column, and say "stays empty" exactly when no carry is left;
 *   guided     "your turn" asks multiply, then add-the-carry whenever one came in;
 *              a nudge never states the number it asks for; the lessons cover a
 *              two-digit answer, a three-digit one and a written 0;
 *   hints      every stacked problem the C51–C110 sheets generate gets the column
 *              method (setup on his own problem, never its answer; a worked similar
 *              problem); times-table sheets keep their own help;
 *   sheet      the quiet "only if needed" column, the Enter rule (never traps a
 *              complete answer: min width ≤ the true width for every problem), the
 *              backwards-digits note, the Level B pop-ups only on pages that have
 *              that kind of problem;
 *   intros     both stacked concepts show the new lesson, re-show to a child who saw
 *              the old one (his real "seen" list), on any sheet of the run — and no
 *              other concept's intro re-shows.
 *
 * Every check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  columnSteps,
  guidedPrompts,
  isReversedAnswer,
  setupSentence,
  stackedFrames,
  type StackedFrame,
} from '../src/services/stackedMultiplication'
import { generateCProblem } from '../src/services/generators/elementary-advanced/level-c'
import { generateMultiplicationHints } from '../src/services/generators/hintGenerator'
import { CONCEPT_INTRODUCTION, getConceptsToIntroduceAtWorksheet } from '../src/services/generators/concept-availability'
import { getConceptAnimation, seenKey } from '../src/services/conceptAnimationMapping'
import type { Problem } from '../src/services/generators/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const width = (n: number) => String(Math.abs(n)).length
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

// ---------------------------------------------------------------------------
console.log('\nmethod — the worked frames, every top number 10–999 × every multiplier 2–9')
type Build = (a: number, b: number) => StackedFrame[]
function methodFindings(build: Build, tops: number[] = Array.from({ length: 990 }, (_, i) => i + 10)): string[] {
  const out: string[] = []
  for (const a of tops) {
    for (let b = 2; b <= 9; b++) {
      const frames = build(a, b)
      const last = frames[frames.length - 1]
      const got = [...last.written].reverse().map((d) => d ?? '').join('').replace(/^0+(?=\d)/, '')
      if (got !== String(a * b)) { out.push(`${a} × ${b}: frames write ${got}`); continue }
      const steps = columnSteps(a, b)
      steps.forEach((s, i) => {
        const f = frames[i + 1]
        if (!f.say.includes(`${b} × ${s.digit} = ${s.product}`)) out.push(`${a} × ${b} col ${s.col}: no "${b} × ${s.digit} = ${s.product}"`)
        if (s.carryIn > 0 && !f.say.includes(`${s.product} + ${s.carryIn} = ${s.total}`)) out.push(`${a} × ${b} col ${s.col}: the carry is not added out loud`)
        if (!s.last && s.carryOut > 0 && f.carries[s.col + 1] !== String(s.carryOut)) out.push(`${a} × ${b} col ${s.col}: carry ${s.carryOut} not shown above the next column`)
      })
      const empty = width(a * b) === width(a)
      if (empty !== /stays empty/.test(frames[frames.length - 2].say)) out.push(`${a} × ${b}: "stays empty" said ${!empty ? 'wrongly' : 'nowhere'}`)
      if (frames.some((fr) => /%|wrong|groups of/i.test(fr.say))) out.push(`${a} × ${b}: a frame says %, "wrong" or "groups of"`)
      if (out.length > 20) return out
    }
  }
  return out
}
const mReal = methodFindings(stackedFrames)
say(mReal.length === 0, `7,920 problems: the frames write the product, add every carry, say "stays empty" only when it does${mReal.length ? ': ' + mReal.slice(0, 4).join('; ') : ''}`)
{
  // Control: his own mistake — the carried digit COPIED instead of added (17 × 9 → "163").
  const copiesCarry: Build = (a, b) => {
    const frames = stackedFrames(a, b)
    const steps = columnSteps(a, b)
    const last = frames[frames.length - 1]
    const s = steps.find((x) => x.carryIn > 0)
    if (s) last.written[s.col] = String(s.carryIn)
    return frames
  }
  say(methodFindings(copiesCarry, [17, 18, 19, 25, 123]).length > 0, 'control fires: frames that copy the carry instead of adding it (his "163")')
  const silent: Build = (a, b) => stackedFrames(a, b).map((f) => ({ ...f, say: f.say.replace(/ Add the \d+ you carried: [^.]*\./, '') }))
  say(methodFindings(silent, [17, 28, 258]).length > 0, 'control fires: frames that add the carry without saying so')
}

// ---------------------------------------------------------------------------
console.log('\nguided — "your turn" asks the steps he skipped, and never gives them away')
type Prompts = typeof guidedPrompts
function guidedFindings(fn: Prompts): string[] {
  const out: string[] = []
  for (let a = 10; a <= 999; a += 7) {
    for (let b = 2; b <= 9; b++) {
      const ps = fn(a, b)
      for (const s of columnSteps(a, b)) {
        const mine = ps.filter((p) => p.col === s.col)
        const mul = mine.find((p) => p.kind === 'multiply')
        if (!mul || mul.expect !== s.product) out.push(`${a} × ${b} col ${s.col}: multiply prompt expects ${mul?.expect}`)
        const add = mine.find((p) => p.kind === 'add-carry')
        if (s.carryIn > 0 && (!add || add.expect !== s.total)) out.push(`${a} × ${b} col ${s.col}: no add-the-carry prompt (the step he skipped)`)
        if (s.carryIn === 0 && add) out.push(`${a} × ${b} col ${s.col}: an add-the-carry prompt with nothing carried`)
      }
      for (const p of ps) {
        const zeroRule = p.expect === 0 && /times 0 is 0/.test(p.nudge)
        if (!zeroRule && new RegExp(`(^|[^0-9])${p.expect}([^0-9]|$)`).test(p.nudge) && p.expect > 9) out.push(`${a} × ${b}: the nudge "${p.nudge}" states ${p.expect}`)
      }
      if (out.length > 20) return out
    }
  }
  return out
}
const gReal = guidedFindings(guidedPrompts)
say(gReal.length === 0, `guided prompts over 1,136 problems${gReal.length ? ': ' + gReal.slice(0, 4).join('; ') : ''}`)
{
  const noCarryStep: Prompts = (a, b) => guidedPrompts(a, b).filter((p) => p.kind !== 'add-carry')
  say(guidedFindings(noCarryStep).length > 0, 'control fires: a "your turn" that never asks him to add the carry')
  const leaky: Prompts = (a, b) => guidedPrompts(a, b).map((p) => ({ ...p, nudge: `It is ${p.expect}.` }))
  say(guidedFindings(leaky).length > 0, 'control fires: a nudge that states the number')
}
{
  const lessons = read('src/components/animations/visualizations/elementary/StackedMultiplicationSteps.tsx')
  const m = lessons.match(/'2digit': \{ examples: \[\[(\d+), (\d+)\], \[(\d+), (\d+)\]\], practice: \[(\d+), (\d+)\] \}/)
  const [ea, eb, fa, fb, pa, pb] = (m?.slice(1) ?? []).map(Number)
  const ok = !!m &&
    width(ea * eb) === 2 && columnSteps(ea, eb).some((s) => s.carryOut > 0) && // a carry, two-digit answer
    width(fa * fb) === 3 && fa * fb % 10 === 0 && // a three-digit answer with a 0 written in the ones
    columnSteps(pa, pb).some((s) => s.carryIn > 0) // his turn includes adding a carry
  say(ok, `the C51 lesson: ${ea} × ${eb} (a carry), ${fa} × ${fb} (a 0, then the hundreds), his turn ${pa} × ${pb} (add the carry)`)
}

// ---------------------------------------------------------------------------
console.log('\nhints — every stacked problem the sheets generate gets the column method')
type Hints = (p: Problem) => ReturnType<typeof generateMultiplicationHints>
function hintFindings(hintsOf: Hints): string[] {
  const out: string[] = []
  for (let ws = 51; ws <= 110; ws++) {
    for (let i = 0; i < 10; i++) {
      const p = generateCProblem(ws, i)
      if (p.type !== 'multiplication') continue
      const h = hintsOf(p)
      const [a, b] = p.operands as number[]
      if (h.visual?.animationId !== 'stacked-multiplication-setup') out.push(`C${ws} ${a} × ${b}: visual hint ${h.visual?.animationId}`)
      if (h.teaching?.animationId !== 'stacked-multiplication-steps') out.push(`C${ws} ${a} × ${b}: teaching ${h.teaching?.animationId}`)
      if (/groups|array|add them up/i.test(h.micro?.text ?? '')) out.push(`C${ws} ${a} × ${b}: micro hint "${h.micro?.text}"`)
      if (new RegExp(`(^|[^0-9])${a * b}([^0-9]|$)`).test(`${h.micro?.text} ${setupSentence(a, b)}`)) out.push(`C${ws} ${a} × ${b}: a hint on his own problem states its answer`)
      if (out.length > 10) return out
    }
  }
  return out
}
const realHints: Hints = (p) => generateMultiplicationHints(p.operands as number[], 'C')
const hReal = hintFindings(realHints)
say(hReal.length === 0, `C51–C110 stacked problems: column-method hints, no answer on his own problem${hReal.length ? ': ' + hReal.slice(0, 3).join('; ') : ''}`)
{
  const asTables: Hints = (p) => generateMultiplicationHints([7, (p.operands as number[])[1]], 'C')
  say(hintFindings(asTables).length > 0, 'control fires: stacked problems given the times-table help')
  const t = generateMultiplicationHints([7, 8], 'C')
  say(t.visual?.animationId === 'array-setup', 'times-table sheets keep their own help (7 × 8 → the array)')
  const reg = read('src/services/hintAnimationMapping.ts')
  say(/'stacked-multiplication-setup': \{\s*component: StackedMultiplicationSteps,\s*isSetup: true,/.test(reg) && /'stacked-multiplication-steps': \{\s*component: StackedMultiplicationSteps,/.test(reg), 'both hint animations are registered (setup = no solution)')
  const teach = read('src/components/hints/FullTeaching.tsx')
  say(/animationId === 'stacked-multiplication-steps'[\s\S]{0,200}stackedFrames\(operands\[0\], operands\[1\]\)/.test(teach), 'the full teaching walks the similar problem frame by frame (not "N groups of M")')
}

// ---------------------------------------------------------------------------
console.log('\nsheet — the quiet box, the Enter rule, the backwards note, the pop-ups')
{
  // Pure helpers, imported through a tiny shim so the worksheet's React imports stay out of node.
  const view = read('src/components/worksheet/WorksheetView.tsx')
  const body = (name: string) => {
    const i = view.indexOf(`export function ${name}`)
    const j = view.indexOf('\n}\n', i)
    return view.slice(i, j + 2)
  }
  const shimSrc = [
    "import type { Problem } from '../src/services/generators/types'",
    body('getAnswerColumnCount'),
    body('getPartialRowCount'),
    body('getOptionalAnswerColumn'),
    body('getMinAnswerDigits'),
  ].join('\n')
  const shim = path.join(ROOT, 'scripts/.stacked-shim.ts')
  fs.writeFileSync(shim, shimSrc)
  const H = await import(shim)
  fs.unlinkSync(shim)
  const mk = (type: string, a: number, b: number): Problem => ({ id: 'x', level: 'C', worksheetNumber: 51, type, subtype: 'x', difficulty: 1, displayFormat: 'vertical', question: '', correctAnswer: 0, operands: [a, b] } as unknown as Problem)
  const shapes = [
    [H.getOptionalAnswerColumn(mk('multiplication', 23, 4)), 2],
    [H.getOptionalAnswerColumn(mk('multiplication', 258, 6)), 3],
    [H.getOptionalAnswerColumn(mk('multiplication', 81, 63)), undefined],
    [H.getOptionalAnswerColumn(mk('addition', 147, 58)), undefined],
  ]
  say(shapes.every(([g, w]) => g === w), `the "only if needed" column: 23 × 4 → 2, 258 × 6 → 3, 81 × 63 and addition → none (${shapes.map(([g]) => String(g)).join(', ')})`)
  let traps = 0
  for (let a = 10; a <= 999; a++) for (let b = 2; b <= 9; b++) if (H.getMinAnswerDigits(mk('multiplication', a, b)) > width(a * b)) traps++
  for (let a = 1; a <= 999; a += 3) for (let b = 1; b <= 999; b += 11) if (H.getMinAnswerDigits(mk('addition', a, b)) > width(a + b)) traps++
  say(traps === 0, `the Enter rule never holds back a complete answer (min width ≤ true width over 7,920 products and ~30,000 sums)`)
  say(H.getMinAnswerDigits(mk('multiplication', 14, 6)) === 2, 'one digit typed for 14 × 6 is still "being written" (his stray "9")')

  type Rev = typeof isReversedAnswer
  const revCases: Array<[string, number, boolean]> = [['69', 96, true], ['54', 45, true], ['41', 140, true], ['96', 96, false], ['66', 66, false], ['9', 9, false], ['665', 65, false], ['12', 21, true]]
  const revFindings = (fn: Rev) => revCases.filter(([a, c, want]) => fn(a, c) !== want).map(([a, c]) => `${a} for ${c}`)
  const rr = revFindings(isReversedAnswer)
  say(rr.length === 0, `backwards digits recognised ("69" for 96, "41" for 140 typed 1-4-0), and nothing else${rr.length ? ': ' + rr.join(', ') : ''}`)
  const noZero: Rev = (a, c) => a.trim() !== String(c) && a.trim() === String(c).split('').reverse().join('')
  say(revFindings(noZero).length > 0, 'control fires: a check blind to the dropped leading zero (140 → "41")')

  const problemView = read('src/components/worksheet/WorksheetProblem.tsx')
  const sheetFindings = (v: string, pv: string): string[] => {
    const out: string[] = []
    if (!/written > 0 && written < getMinAnswerDigits\(activeProblem\)/.test(v)) out.push('Enter can still jump off a stacked answer being written')
    if (!/optionalColumn=\{getOptionalAnswerColumn\(problem\)\}/.test(v)) out.push('the worksheet never marks the optional column')
    if ((v.match(/reversedNotes\[problem\.id\] \? REVERSED_NOTE : hintData\.text/g) ?? []).length !== 2) out.push('the backwards note does not reach both the first and second hint')
    if (!/if \(manualCarry && pageHasStackedAddition\)/.test(v) || !/if \(manualRegroup && pageHasStackedSubtraction\)/.test(v) || !/regroupMode === 'optional' && pageHasStackedSubtraction/.test(v)) out.push('a Level B pop-up can open on a page without that kind of problem')
    if (!/quietOptional\s*\? \(isActiveCol\s*\? 'border-dashed/.test(pv)) out.push('the optional box is not drawn quiet')
    if (!/data-optional-caption/.test(pv)) out.push('no caption when the cursor is in the optional box')
    return out
  }
  const sf = sheetFindings(view, problemView)
  say(sf.length === 0, `worksheet sources${sf.length ? ': ' + sf.join('; ') : ''}`)
  const jumpy = view.replace('written > 0 && written < getMinAnswerDigits(activeProblem)', 'false')
  say(jumpy !== view && sheetFindings(jumpy, problemView).length > 0, 'control fires: Enter allowed to jump off a half-written answer')
  const loud = problemView.replace("quietOptional\n                    ? (isActiveCol\n                      ? 'border-dashed", "false\n                    ? (isActiveCol\n                      ? 'border-dashed")
  say(loud !== problemView && sheetFindings(view, loud).length > 0, 'control fires: the third box drawn like any other')
  const popups = view.replace('if (manualRegroup && pageHasStackedSubtraction)', 'if (manualRegroup)')
  say(popups !== view && sheetFindings(popups, problemView).length > 0, 'control fires: the subtraction pop-up back on multiplication pages')
}

// ---------------------------------------------------------------------------
console.log('\nintros — the new lesson reaches a child who saw the old one, on any sheet of the run')
/** His real concepts_seen rows (read 2026-11-09). */
const HIS_SEEN = ['addition_2digit', 'addition_3digit', 'addition_mastery', 'borrowing', 'carrying', 'multiplication', 'multiplication_2digit_by_1digit', 'subtraction_2digit', 'subtraction_3digit', 'subtraction_from_20', 'times_table_2_3', 'times_table_4_5', 'times_table_6_7', 'times_table_8_9', 'vertical_addition', 'vertical_format', 'vertical_subtraction']
type Unseen = (seen: string[], ws: number) => string[]
const realUnseen: Unseen = (seen, ws) => getConceptsToIntroduceAtWorksheet('C', ws).filter((c) => !seen.includes(seenKey(c)))
function introFindings(unseen: Unseen, key: (c: string) => string): string[] {
  const out: string[] = []
  for (const c of ['multiplication_2digit_by_1digit', 'multiplication_3digit_by_1digit']) {
    const cfg = getConceptAnimation(c)
    if (cfg?.animationId !== 'stacked-multiplication') out.push(`${c} intro is ${cfg?.animationId}`)
  }
  if (unseen(HIS_SEEN, 56).join() !== 'multiplication_2digit_by_1digit') out.push(`his next sheet (C56) shows ${JSON.stringify(unseen(HIS_SEEN, 56))}`)
  const after = [...HIS_SEEN, key('multiplication_2digit_by_1digit')]
  if (unseen(after, 57).length !== 0) out.push('the new lesson shows again after he has seen it')
  if (unseen(after, 101).join() !== 'multiplication_3digit_by_1digit') out.push('C101 does not introduce 3-digit stacked multiplication')
  if (unseen(after, 107).join() !== 'multiplication_3digit_by_1digit') out.push('a child placed at C107 skips the 3-digit lesson')
  if (unseen(HIS_SEEN, 50).length !== 0) out.push(`C50 (times tables) shows ${JSON.stringify(unseen(HIS_SEEN, 50))}`)
  const others = Object.keys(CONCEPT_INTRODUCTION).filter((c) => !c.startsWith('multiplication_') || !/by_1digit$/.test(c))
  const reShown = others.filter((c) => key(c) !== c)
  if (reShown.length) out.push(`${reShown.length} other intros would re-show (${reShown.slice(0, 3).join(', ')})`)
  return out
}
const iReal = introFindings(realUnseen, seenKey)
say(iReal.length === 0, `his real seen list: the lesson shows at C56, once; C101–C110 get theirs; nothing else re-shows${iReal.length ? ': ' + iReal.join('; ') : ''}`)
{
  const unversioned = (c: string) => c
  const oldUnseen: Unseen = (seen, ws) => getConceptsToIntroduceAtWorksheet('C', ws).filter((c) => !seen.includes(c))
  say(introFindings(oldUnseen, unversioned).length > 0, 'control fires: "seen" by concept only (the September record hides the new lesson)')
  const exactOnly: Unseen = (seen, ws) => Object.entries(CONCEPT_INTRODUCTION).filter(([, i]) => i.level === 'C' && i.worksheet === ws).map(([c]) => c).filter((c) => !seen.includes(seenKey(c)))
  say(introFindings(exactOnly, seenKey).length > 0, 'control fires: intros only on the exact first sheet (C56 would show nothing)')
  const modal = read('src/components/concept-intro/ConceptIntroModal.tsx')
  say(/config\?\.animationId === 'stacked-multiplication' \?[\s\S]{0,700}<StackedMultiplicationLesson/.test(modal), 'the intro modal runs the lesson (examples, then "your turn") for both stacked concepts')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
