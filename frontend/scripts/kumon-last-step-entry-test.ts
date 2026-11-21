/**
 * kumon-last-step-entry-test — the last step of a stacked answer is typed as a
 * whole number, the way it is said (owner, 2026-11-19).
 *
 * Run (from frontend/): npx tsx scripts/kumon-last-step-entry-test.ts
 *
 * WHY. On 47 × 6 the last step is 4 × 6 + 4 = 28, and on paper it is written "28",
 * 2 then 8. The worksheet made the child type it ones first (8, then 2) into two
 * separate boxes. Addition took "12" whole from April until the July fix made every
 * box one digit; this brings it back for both, still one digit per box on screen.
 * This asserts:
 *
 *   shape      which problems have a last step, and where, follows the SHAPE (never
 *              the answer): every 2- and 3-digit number × 2–9, sums, and none for
 *              subtraction, a 2-digit multiplier or a problem across the line;
 *   say-it     typing each step as it is worked (ones first, then the last number as
 *              said) gives the right answer for all 7,920 products and ~30,000 sums;
 *              the last step takes at most two digits, ⌫ undoes it digit by digit;
 *   habits     the old order (8 then 2) and the whole answer typed from the left are
 *              each recognised and get their own note; a real maths miss gets neither;
 *   carries    no carry is drawn above the last step's left box (it would be the
 *              answer's leading digit);
 *   screen     the worksheet's digit, ⌫, Enter, tap and restore paths all use the rule;
 *              the last step is ONE box over its two places (2026-11-21: two boxes made
 *              the first digit jump) that fills from the left while he types (the
 *              owner's pick, way C), with a caption that names no number;
 *   lesson     the worked example says the last number the way it is typed, and the
 *              lesson shows once more to every child (intro version 3).
 *
 * Every check runs on the real code and on a broken control that must fire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  composeColumnAnswer,
  diagnoseEntryOrder,
  enterColumnKey,
  getLastStepColumn,
  LAST_STEP_NOTE,
  typeKeys,
  type ColumnEntryState,
} from '../src/services/columnEntry'
import { columnSteps, isReversedAnswer, stackedFrames } from '../src/services/stackedMultiplication'
import { CONCEPT_INTRO_CONFIG } from '../src/services/conceptAnimationMapping'
import type { Problem } from '../src/services/generators/types'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const width = (n: number) => String(Math.abs(n)).length
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

const mk = (type: string, operands: number[], displayFormat = 'vertical'): Problem =>
  ({ id: 'x', level: 'C', worksheetNumber: 60, type, subtype: 'x', difficulty: 1, displayFormat, question: '', correctAnswer: 0, operands } as unknown as Problem)
const columnsFor = (p: Problem) => p.type === 'addition' ? Math.max(...p.operands!.map(width)) + 1 : width(p.operands![0]) + 1

/** The keys a child presses working the problem: ones first, one digit a box, then the last number as said. */
function workedKeys(answer: number, last: number): string[] {
  const want = String(answer)
  const ones = want.slice(Math.max(0, want.length - last)).split('').reverse()
  const top = want.slice(0, Math.max(0, want.length - last))
  // A short answer (the last step's number is a single digit, or a lower box held a 0 the top lacks).
  return [...ones, ...top.split('')]
}

type Placer = (s: ColumnEntryState, key: string, last: number | undefined) => ColumnEntryState
const typeWith = (place: Placer, p: Problem, keys: string[]) => {
  const last = getLastStepColumn(p)
  let st: ColumnEntryState = { columns: new Array(columnsFor(p)).fill(null), active: 0 }
  for (const k of keys) st = place(st, k, last)
  return composeColumnAnswer(st.columns)
}

const products: Array<[number, number]> = []
for (let a = 10; a <= 999; a++) for (let b = 2; b <= 9; b++) products.push([a, b])
const sums: Array<[number, number]> = []
for (let a = 1; a <= 999; a += 3) for (let b = 1; b <= 999; b += 11) sums.push([a, b])

// ---------------------------------------------------------------------------
console.log('\nshape — where the last step is, from the problem\'s shape alone')
{
  const bad: string[] = []
  for (const [a, b] of products) {
    const last = getLastStepColumn(mk('multiplication', [a, b]))
    if (last !== width(a) - 1) bad.push(`${a} × ${b} → ${last}`)
    if (bad.length > 5) break
  }
  for (const [a, b] of sums) {
    const last = getLastStepColumn(mk('addition', [a, b]))
    if (last !== Math.max(width(a), width(b)) - 1) bad.push(`${a} + ${b} → ${last}`)
    if (bad.length > 5) break
  }
  say(bad.length === 0, `every product (7,920) and sum (~30,000): the last step is the top number's leftmost column${bad.length ? ': ' + bad.join(', ') : ''}`)
  const none = [
    getLastStepColumn(mk('subtraction', [147, 58])),
    getLastStepColumn(mk('multiplication', [81, 63])),
    getLastStepColumn(mk('multiplication', [23, 4], 'horizontal')),
    getLastStepColumn(mk('division', [84, 4])),
  ]
  say(none.every((x) => x === undefined), `no last step for subtraction, a 2-digit multiplier, across the line, division (${none.map(String).join(', ')})`)
  // Shape, never the answer: 13 × 5 = 65 and 28 × 5 = 140 get the same last step.
  say(getLastStepColumn(mk('multiplication', [13, 5])) === getLastStepColumn(mk('multiplication', [28, 5])), 'the same shape gets the same last step whatever the answer (13 × 5 and 28 × 5)')
}

// ---------------------------------------------------------------------------
console.log('\nsay-it — typing each step as it is worked gives the answer')
function sayItFindings(place: Placer): string[] {
  const out: string[] = []
  for (const [a, b] of products) {
    const p = mk('multiplication', [a, b])
    const got = typeWith(place, p, workedKeys(a * b, getLastStepColumn(p)!))
    if (got !== String(a * b)) out.push(`${a} × ${b} reads ${got}`)
    if (out.length > 5) return out
  }
  for (const [a, b] of sums) {
    const p = mk('addition', [a, b])
    const got = typeWith(place, p, workedKeys(a + b, getLastStepColumn(p)!))
    if (got !== String(a + b)) out.push(`${a} + ${b} reads ${got}`)
    if (out.length > 5) return out
  }
  return out
}
{
  const real = sayItFindings(enterColumnKey)
  say(real.length === 0, `47 × 6: 2, then "2", "8" reads 282; the same for every product and sum${real.length ? ': ' + real.join('; ') : ''}`)
  // Control: the old rule, one digit a box with the cursor moving left (8 then 2 was the only way).
  const oldRule: Placer = (s, k, _last) => enterColumnKey(s, k, undefined)
  say(sayItFindings(oldRule).length > 0, 'control fires: the old one-digit-a-box rule (47 × 6 typed 2, 2, 8 reads 822)')
  // Control: the second digit put in the left box without moving the first (no shift).
  const noShift: Placer = (s, k, last) => {
    if (last === undefined || s.active < last || !/^\d$/.test(k)) return enterColumnKey(s, k, last)
    const columns = [...s.columns]
    if (columns[last] === null) columns[last] = k
    else if (columns[last + 1] === null) columns[last + 1] = k
    return { columns, active: last }
  }
  say(sayItFindings(noShift).length > 0, 'control fires: the second digit dropped into the left box unshifted (28 reads 82)')

  // At most two digits on the last step; ⌫ undoes it digit by digit, then goes back a box.
  const p = mk('multiplication', [47, 6])
  let st: ColumnEntryState = { columns: [null, null, null], active: 0 }
  for (const k of ['2', '2', '8', '9']) st = enterColumnKey(st, k, 1)
  const full = composeColumnAnswer(st.columns)
  const trail: string[] = [full]
  for (let i = 0; i < 4; i++) { st = enterColumnKey(st, 'backspace', 1); trail.push(`${composeColumnAnswer(st.columns) || '∅'}@${st.active}`) }
  say(full === '282' && trail.slice(1).join(' ') === '22@1 2@1 ∅@0 ∅@0', `a third digit is ignored (282 stays 282); ⌫ goes 22 → 2 → back to the ones box (${trail.join(' ')})`)
  const tapped = enterColumnKey({ columns: ['2', null, null], active: 2 }, '2', getLastStepColumn(p))
  say(tapped.active === 1 && tapped.columns[1] === '2' && tapped.columns[2] === null, 'a tap on the "only if needed" box puts the cursor on the last step, not in that box')
}

// ---------------------------------------------------------------------------
console.log('\nhabits — the old order and the from-the-left order each get their own note')
type Diagnose = (p: Problem, cols: number, answer: string, correct: number) => 'from-left' | 'last-step' | null
function habitFindings(diag: Diagnose): string[] {
  const out: string[] = []
  let lastStepCases = 0
  for (const [a, b] of products) {
    const p = mk('multiplication', [a, b])
    const cols = columnsFor(p)
    const want = a * b
    const lastTotal = columnSteps(a, b).at(-1)!.total
    const oldHabit = typeKeys(p, cols, String(want).split('').reverse())
    if (lastTotal >= 10 && lastTotal % 10 !== Math.floor(lastTotal / 10)) {
      lastStepCases++
      if (diag(p, cols, oldHabit, want) !== 'last-step') out.push(`${a} × ${b}: "${oldHabit}" not read as the old order`)
    }
    if (diag(p, cols, String(want), want) !== null) out.push(`${a} × ${b}: the right answer gets a note`)
    if (out.length > 5) return out
  }
  if (lastStepCases < 1000) out.push(`only ${lastStepCases} last-step cases`)
  const p17 = mk('multiplication', [17, 9])
  if (diag(p17, 3, '163', 153) !== null) out.push('his "163" for 17 × 9 (a carry copied) is called an order slip')
  const p16 = mk('multiplication', [16, 6])
  if (diag(p16, 3, '69', 96) !== 'from-left') out.push('"69" for 96 (typed from the left) not recognised')
  const p47 = mk('multiplication', [47, 6])
  if (diag(p47, 3, '822', 282) !== 'last-step') out.push('"822" for 282 (28 typed 8, 2) not recognised')
  const add = mk('addition', [55, 67])
  if (diag(add, 3, '212', 122) !== 'last-step') out.push('"212" for 55 + 67 (12 typed 2, 1) not recognised')
  return out
}
{
  const real = habitFindings(diagnoseEntryOrder)
  say(real.length === 0, `every product whose last number has two different digits: the old order is named; right answers and his "163" get no note${real.length ? ': ' + real.join('; ') : ''}`)
  const wholeOnly: Diagnose = (_p, _c, answer, correct) => (isReversedAnswer(answer, correct) ? 'from-left' : null)
  say(habitFindings(wholeOnly).length > 0, 'control fires: only the whole-answer reversal checked (the old note for 822 never comes)')
  say(!/\d/.test(LAST_STEP_NOTE), `the note names no number: "${LAST_STEP_NOTE}"`)
}

// ---------------------------------------------------------------------------
console.log('\ncarries — nothing drawn above the last step\'s left box')
{
  const view = read('src/components/worksheet/WorksheetView.tsx')
  const body = (src: string, name: string) => {
    const at = src.indexOf(`export function ${name}`)
    const i = at >= 0 ? at : src.indexOf(`\nfunction ${name}`) + 1
    const j = src.indexOf('\n}\n', i)
    return src.slice(i, j + 2)
  }
  const helpers = [
    "import type { Problem } from '../src/services/generators/types'",
    "import { getLastStepColumn } from '../src/services/columnEntry'",
    body(view, 'getDigitAtPlace'),
  ].join('\n')
  const load = async (src: string, tag: string) => {
    const shim = path.join(ROOT, `scripts/.last-step-shim-${tag}.ts`)
    fs.writeFileSync(shim, helpers + '\n' + body(src, 'computeCarries'))
    try { return await import(shim) } finally { fs.unlinkSync(shim) }
  }
  const carryFindings = (computeCarries: (p: Problem, c: (string | null)[]) => (string | null)[]) => {
    const out: string[] = []
    for (const [a, b] of products) {
      const p = mk('multiplication', [a, b])
      const cols = new Array(columnsFor(p)).fill('0')
      const c = computeCarries(p, cols)
      const last = getLastStepColumn(p)!
      if (c[last + 1] !== null) out.push(`${a} × ${b}: "${c[last + 1]}" drawn above the left box`)
      const step = columnSteps(a, b).find((s) => !s.last && s.carryOut > 0)
      if (step && c[step.col + 1] !== String(step.carryOut)) out.push(`${a} × ${b}: carry ${step.carryOut} missing above col ${step.col + 1}`)
      if (out.length > 5) break
    }
    const add = computeCarries(mk('addition', [55, 67]), ['2', '2', '1'])
    if (add[1] !== '1' || add[2] !== null) out.push(`55 + 67 carries ${JSON.stringify(add)}`)
    return out
  }
  if (!/\nfunction getDigitAtPlace|export function getDigitAtPlace/.test(view)) {
    say(false, 'getDigitAtPlace not found in WorksheetView (the shim needs it)')
  } else {
    const real = await load(view, 'real')
    const rf = carryFindings(real.computeCarries)
    say(rf.length === 0, `every product: carries shown inside the number, none above its left box; 55 + 67 shows only the ones' carry${rf.length ? ': ' + rf.join('; ') : ''}`)
    const leaky = view.replace('    if (lastStep !== undefined && col >= lastStep) break\n', '')
    const broken = await load(leaky, 'leaky')
    say(leaky !== view && carryFindings(broken.computeCarries).length > 0, 'control fires: the carry out of the last step drawn (the answer\'s leading digit)')
  }
}

// ---------------------------------------------------------------------------
console.log('\nscreen — every input path uses the rule; the two boxes light up as one step')
{
  const view = read('src/components/worksheet/WorksheetView.tsx')
  const pv = read('src/components/worksheet/WorksheetProblem.tsx')
  const screenFindings = (v: string, p: string): string[] => {
    const out: string[] = []
    if ((v.match(/enterColumnKey\(\{ columns: newColumns, active: newActiveCol \}, (?:'backspace'|digit), lastStep\)/g) ?? []).length !== 2) out.push('digits and ⌫ do not both go through enterColumnKey')
    if (!/const lastStep = getLastStepColumn\(activeProblem\)\n\s+const currentActiveCol = normalizeActiveColumn\(/.test(v)) out.push('the typed key does not read the last step')
    if (!/activeCol < \(getLastStepColumn\(activeProblem\) \?\? columnCount - 1\)/.test(v)) out.push('Enter on the last step moves into the "only if needed" box')
    if ((v.match(/normalizeActiveColumn\(/g) ?? []).length < 4) out.push('a tap, a restore or the scratch pad can put the cursor in the "only if needed" box')
    if (!/lastStepColumn=\{getLastStepColumn\(problem\)\}/.test(v)) out.push('the worksheet never tells the card where the last step is')
    if (/newColumns\[newActiveCol\] = digit/.test(v)) out.push('a digit is still written straight into the active box')
    if (!/if \(lastStepColumn !== undefined && colIndex === lastStepColumn \+ 1\) return null/.test(p)) out.push('the last step\'s left place is a box of its own (the first digit jumps between boxes)')
    if (!/data-last-step-box[\s\S]{0,400}absolute inset-0 rounded-md border-2/.test(p)) out.push('the last step is not one box with one border')
    if (!/const editing = isActiveCol && !isSubmitted\n\s+const shown = editing \? \[typed\[0\] \?\? null, typed\[1\] \?\? null\] : \[left, digit\]/.test(p) || !/\{shown\.map\(/.test(p)) out.push('while he types, the number does not fill the box from the left (his first digit moves)')
    const cap = p.match(/data-last-step-caption>\s*([^<]+)</)
    if (!cap) out.push('no caption on the last step')
    else if (/\d/.test(cap[1])) out.push(`the caption names a number: "${cap[1].trim()}"`)
    return out
  }
  const sf = screenFindings(view, pv)
  say(sf.length === 0, `worksheet sources${sf.length ? ': ' + sf.join('; ') : ''}`)
  const direct = view.replace(
    "const next = enterColumnKey({ columns: newColumns, active: newActiveCol }, digit, lastStep)\n          newColumns = next.columns\n          newActiveCol = next.active",
    'newColumns[newActiveCol] = digit\n          newActiveCol = newActiveCol + 1')
  say(direct !== view && screenFindings(direct, pv).length > 0, 'control fires: digits written straight into the box again')
  const enterJumps = view.replace('activeCol < (getLastStepColumn(activeProblem) ?? columnCount - 1)', 'activeCol < columnCount - 1')
  say(enterJumps !== view && screenFindings(enterJumps, pv).length > 0, 'control fires: Enter moves into the "only if needed" box')
  const slides = pv.replace('{shown.map((d, k) => (', '{[left, digit].map((d, k) => (')
  say(slides !== pv && screenFindings(view, slides).length > 0, 'control fires: the number fills from the right while he types (the first digit slides over)')
  const twoBoxes = pv.replace('if (lastStepColumn !== undefined && colIndex === lastStepColumn + 1) return null', '')
  say(twoBoxes !== pv && screenFindings(view, twoBoxes).length > 0, 'control fires: the last step drawn as two boxes again (the jumping digit)')
}

// ---------------------------------------------------------------------------
console.log('\nlesson — the worked example says the last number the way it is typed')
{
  const lessonFindings = (frames: typeof stackedFrames): string[] => {
    const out: string[] = []
    for (const [a, b] of products) {
      const last = columnSteps(a, b).at(-1)!
      const fs2 = frames(a, b)
      const sayLast = fs2[fs2.length - 2].say
      if (last.total >= 10) {
        const t = Math.floor(last.total / 10)
        const o = last.total % 10
        if (!sayLast.includes(`the way you say it: ${t}, then ${o}.`)) out.push(`${a} × ${b}: "${sayLast}"`)
      }
      if (out.length > 3) break
    }
    return out
  }
  const lf = lessonFindings(stackedFrames)
  say(lf.length === 0, `every product with a two-digit last number: "write the whole 28, the way you say it: 2, then 8"${lf.length ? ': ' + lf.join('; ') : ''}`)
  const onesFirst: typeof stackedFrames = (a, b) => stackedFrames(a, b).map((f) => ({ ...f, say: f.say.replace(/the way you say it: (\d), then (\d)\./, 'the way you say it: $2, then $1.') }))
  say(lessonFindings(onesFirst).length > 0, 'control fires: a lesson that says the ones digit first')
  const versions = ['multiplication_2digit_by_1digit', 'multiplication_3digit_by_1digit'].map((c) => CONCEPT_INTRO_CONFIG[c]?.version)
  say(versions.every((v) => v === 3), `both stacked lessons are version 3, so each child sees the new last step once (${versions.join(', ')})`)
  const lessonSrc = read('src/components/animations/visualizations/elementary/StackedMultiplicationSteps.tsx')
  say(/type the last number the way you say it/.test(lessonSrc), 'the lesson\'s last screen says it too')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${checks} checks, ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
