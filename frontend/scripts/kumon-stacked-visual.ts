/**
 * Photographs stacked multiplication (Kumon C51+) — run by hand (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/kumon-stacked-visual.ts <harness-dist> [outdir]
 *
 * Asserts on the RENDERED page (owner, 2026-11-09):
 *   lesson   the new-concept intro walks 23 × 4 and 28 × 5 column by column, then
 *            "your turn" on 17 × 4: a miss gets a nudge, never the number, and the
 *            add-the-carry step is asked on its own;
 *   sheet    a C51 page opens with no Level B pop-up; after a two-digit answer the
 *            last step is ONE big box (no empty third box), lit with "type the whole
 *            number in the big box";
 *            a three-digit answer's last number goes in the way it is said (2, then
 *            8 for 282) and checks right; the old order (8, then 2) gets its own
 *            note (2026-11-19); a digit + Enter
 *            keeps him on the problem; digits typed left to right get the
 *            "you wrote it from the left" note;
 *   hints    after a miss on his own problem: where to start, never the answer;
 *            after the third, a worked similar problem column by column.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium, type Page } from 'playwright-core'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/kumon-stacked-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: kumon-stacked-visual <harness-dist> [outdir]'); process.exit(2) }
fs.mkdirSync(OUT, { recursive: true })
const server = http.createServer((req, res) => {
  const u = new URL(req.url ?? '/', 'http://x')
  let f = path.join(DIST, u.pathname)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
  res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : 'text/html')
  fs.createReadStream(f).pipe(res)
})
await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`
let bad = 0
const say = (ok: boolean, msg: string) => { if (!ok) bad++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] })
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 })
const errors: string[] = []
async function open(url: string, init = ''): Promise<Page> {
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(String(e)))
  await p.addInitScript(`localStorage.clear(); ${init}`)
  await p.goto(`${base}/${url}`, { waitUntil: 'load' })
  await p.waitForTimeout(1200)
  return p
}
const text = (p: Page) => p.evaluate(`document.body.innerText.replace(/[ \\t\\r\\n]+/g, ' ')`) as Promise<string>
const click = async (p: Page, label: string, exact = false) => {
  const ok = await p.evaluate(`(() => { const b = [...document.querySelectorAll('button')].find(x => { const t = (x.textContent || '').replace(/\\s+/g, ' ').trim(); return ${exact} ? t === ${JSON.stringify(label)} : t.includes(${JSON.stringify(label)}) }); if (!b || b.disabled) return false; b.click(); return true })()`) as boolean
  await p.waitForTimeout(450)
  return ok
}
const said = (p: Page) => p.evaluate(`[...document.querySelectorAll('[data-step-say]')].map(e => e.innerText).join(' | ')`) as Promise<string>
const shot = async (p: Page, name: string) => fs.writeFileSync(`${OUT}/${name}.png`, await p.screenshot({ fullPage: true }))

// ---------------------------------------------------------------------------
console.log('\n# the new-concept lesson (C51 stacked multiplication)')
let p = await open('?screen=kumon-intro&concept=multiplication_2digit_by_1digit&ws=56')
await p.waitForTimeout(1500)
let t = await text(p)
await shot(p, '1-intro')
say(/Stacked Multiplication/.test(t) && /Start with the ones/.test(t), 'the intro names the method: "Start with the ones…"')
say(!/Break apart|groups of/i.test(t), 'no arrays, no "break apart"')
say(await click(p, "Let's Start"), '"Let\'s Start!"')
await p.waitForTimeout(800)
say((await said(p)).includes('23 × 4. Start with the ones, on the right.'), 'example 1: 23 × 4, start with the ones')
await click(p, 'Next step')
say((await said(p)).includes('Ones: 4 × 3 = 12. Write the 2 in the ones box. Carry the 1 to the tens.'), 'ones: 4 × 3 = 12, write 2, carry 1')
await click(p, 'Next step')
t = await said(p)
await shot(p, '2-lesson-carry-added')
say(t.includes('Add the 1 you carried: 8 + 1 = 9') && t.includes('Last step: write the 9 in the big box. No carry left, so it is just one digit.'), 'tens: the carry ADDED out loud; the 9 goes in the big box')
say(await p.evaluate(`document.querySelectorAll('[data-last-step-box]').length === 1`) as boolean, 'the last step is one big box, as on the sheet')
await click(p, 'Next step'); await click(p, 'Done')
say((await said(p)).includes('28 × 5. Start with the ones'), 'example 2: 28 × 5')
await click(p, 'Next step')
say((await said(p)).includes('Ones: 5 × 8 = 40. Write the 0 in the ones box. Carry the 4 to the tens.'), 'a 0 written in the ones (his "105" for 20 × 5)')
await click(p, 'Next step')
t = await said(p)
await shot(p, '3-lesson-hundreds')
say(t.includes('Last step: write the whole 14 in the big box, the way you say it: 1, then 4.'), 'the last step: the whole 14 in the big box (1, then 4)')
await click(p, 'Next step'); await click(p, 'Done')

console.log('  — his turn: 17 × 4')
const press = async (digits: string) => { for (const d of digits) await click(p, d, true); await click(p, 'Check', true) }
say((await said(p)).includes('Ones: what is 4 × 7?'), 'his turn asks: "Ones: what is 4 × 7?"')
await press('24')
t = await said(p)
await shot(p, '4-guided-nudge')
say(t.includes('Count by 4s, 7 times.') && !/28/.test(t), 'a miss gets a nudge, never the number')
await click(p, 'Try again')
await press('28')
say((await said(p)).includes('Write the 8 in the ones box. Carry the 2 to the tens.'), 'right: "write the 8, carry the 2"')
await click(p, 'Next', true)
await press('4')
await click(p, 'Next', true)
say((await said(p)).includes('Now add the 2 you carried: 4 + 2 = ?'), 'the add-the-carry step is asked on its own')
await press('2')
say((await said(p)).includes('Start at 4 and count on 2.'), 'copying the carry (his "163" mistake) gets a nudge')
await click(p, 'Try again')
await press('6')
await click(p, 'Next', true)
t = await said(p)
await shot(p, '5-guided-done')
say(t.includes('17 × 4 = 68.'), 'the answer read out: 17 × 4 = 68')
await click(p, 'Done', true)
say(await click(p, "Let's practice!"), '"Let\'s practice!" ends the lesson')
say(await p.evaluate('window.__introDone') === true, 'the intro reports done (marked seen)')
await p.close()

// ---------------------------------------------------------------------------
console.log('\n# a C51 sheet')
p = await open('?screen=kumon&level=C&ws=51')
t = await text(p)
await shot(p, '6-sheet-open')
say(!/regrouping yourself|entering the carry yourself/i.test(t), 'no Level B pop-up on a multiplication page (fresh device)')
const active = () => p.evaluate(`(() => { const a = window.__kumon.ref.current.getActiveProblem(); return a && { i: a.index, ops: a.problem.operands, ans: a.problem.correctAnswer } })()`) as Promise<{ i: number; ops: number[]; ans: number }>
const input = async (v: string) => { await p.evaluate(`window.__kumon.ref.current.handleInput(${JSON.stringify(v)})`); await p.waitForTimeout(250) }
const goTo = async (i: number) => { for (let k = 0; k < 6 && (await active()).i !== i; k++) { await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(150) } }

// The quiet third box: find a two-digit answer, write it ones first.
const box = (i: number) => p.evaluate(`[...document.querySelectorAll('[data-testid="wp-card"]')[${i}].querySelectorAll('[data-testid="wp-answer-cell"]')].map(e => e.innerText.trim() || '·').join('')`) as Promise<string>
let a = await active()
for (let k = 0; k < 5 && a.ans >= 100; k++) { await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(200); a = await active() }
console.log(`  two-digit problem: ${a.ops.join(' × ')} = ${a.ans}`)
await input(String(a.ans % 10))
t = await text(p)
await shot(p, '7a-ones-done-cursor-in-big-box')
await input(String(Math.floor(a.ans / 10)))
await shot(p, '7-two-digit-in-big-box')
const boxes = await p.evaluate(`(() => { const c = document.querySelectorAll('[data-testid="wp-card"]')[${a.i}]; const big = c.querySelector('[data-last-step-box]'); const ring = big && big.firstElementChild; return { big: !!big, lit: !!ring && /border-primary/.test(ring.className), text: big ? big.innerText.replace(/\\s+/g, '') : '', ones: c.querySelectorAll('[data-testid="wp-answer-cell"]').length } })()`) as { big: boolean; lit: boolean; text: string; ones: number }
say(boxes.big && boxes.lit && boxes.text === String(Math.floor(a.ans / 10)), `after ${a.ans} (ones, then ${Math.floor(a.ans / 10)}), the ${Math.floor(a.ans / 10)} sits in ONE lit big box — no separate empty third box (${JSON.stringify(boxes)})`)
say(/Type the whole number in the big box\./.test(t), 'the caption: "Type the whole number in the big box."')
const editingCells = await box(a.i)
await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(250)
const settledCells = await box(a.i)
await shot(p, '7e-one-digit-settled')
say(editingCells === `${Math.floor(a.ans / 10)}·${a.ans % 10}` && settledCells === `·${a.ans}`, `a one-digit last number fills from the left while he types ("${editingCells}") and sits under the tens once he moves on ("${settledCells}")`)

// A page with a three-digit answer whose last number has two different digits (the
// pages are random: try a few sheets, and keep the page with the most such problems).
const lastTotal = (ops: number[]) => Math.floor(ops[0] / 10) * ops[1] + Math.floor(((ops[0] % 10) * ops[1]) / 10)
const fits = (pr: { operands: number[]; correctAnswer: number }) => pr.correctAnswer >= 100 && lastTotal(pr.operands) % 10 !== Math.floor(lastTotal(pr.operands) / 10)
for (const ws of [58, 60, 62, 64, 66, 68]) {
  await p.close()
  p = await open(`?screen=kumon&level=C&ws=${ws}`)
  const probs = await p.evaluate(`(() => { const out = []; for (let k = 0; k < 5; k++) { const a = window.__kumon.ref.current.getActiveProblem(); out.push({ operands: a.problem.operands, correctAnswer: a.problem.correctAnswer }); window.__kumon.ref.current.navigateToNextProblem() } return out })()`) as Array<{ operands: number[]; correctAnswer: number }>
  await p.waitForTimeout(200)
  if (probs.filter(fits).length >= 2) break
}
// A three-digit answer: the ones, then the last number the way it is said.
let c3 = await active()
for (let k = 0; k < 6 && !(c3.ans >= 100 && lastTotal(c3.ops) % 10 !== Math.floor(lastTotal(c3.ops) / 10)); k++) { await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(200); c3 = await active() }
if (c3.ans >= 100) {
  const L = String(lastTotal(c3.ops))
  console.log(`  three-digit problem: ${c3.ops.join(' × ')} = ${c3.ans} (last step ${L})`)
  await input(String(c3.ans % 10)); await input(L[0])
  const half = await box(c3.i)
  await shot(p, '7b-last-step-first-digit')
  await input(L[1])
  const whole = await box(c3.i)
  await shot(p, '7c-last-step-whole')
  say(half === `${L[0]}·${c3.ans % 10}` && whole === `${c3.ans}`, `${c3.ops.join(' × ')}: ${c3.ans % 10}, then ${L[0]}, ${L[1]} → boxes "${half}" then "${whole}" (the ${L[0]} stays put; the ${L[1]} goes beside it)`)
  await input('submit'); await p.waitForTimeout(600)
  const ok = await p.evaluate(`document.querySelectorAll('[data-testid="wp-card"]')[${c3.i}].className.includes('border-green-500')`) as boolean
  say(ok, `${c3.ans} typed the way it is worked checks right`)
} else say(false, 'no three-digit answer on the page to photograph')

// The old order on another problem: 8, then 2, for 28 → its own note.
await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(200)
let c4 = await active()
for (let k = 0; k < 6 && !(c4.ans >= 100 && lastTotal(c4.ops) % 10 !== Math.floor(lastTotal(c4.ops) / 10)); k++) { await p.evaluate(`window.__kumon.ref.current.navigateToNextProblem()`); await p.waitForTimeout(200); c4 = await active() }
if (c4.ans >= 100) {
  for (const d of String(c4.ans).split('').reverse()) await input(d)
  const typed = await box(c4.i)
  await input('submit'); await p.waitForTimeout(600)
  t = await text(p)
  await shot(p, '7d-old-order-note')
  say(/In the big box, type the number the way you say it: the first digit you say goes first\./.test(t), `${c4.ops.join(' × ')} typed the old way (ones first throughout → "${typed}") gets the last-step note`)
} else say(false, 'no three-digit answer for the old-order note')
await p.close()
p = await open('?screen=kumon&level=C&ws=51')

// Enter after one digit stays on the problem.
const nextIdx = (a.i + 1) % 5
await goTo(nextIdx)
const b = await active()
await input(String(b.ans % 10))
await input('enter')
const after = await active()
t = await text(p)
await shot(p, '8-enter-stays')
say(after.i === b.i, `a digit + Enter on ${b.ops.join(' × ')} stays on it (was problem ${b.i}, now ${after.i})`)
say(/Keep going: next is the tens box\./.test(t), '"Keep going: next is the tens box."')

// Left to right: the backwards-digits note at the check.
await input('backspace'); await input('backspace')
const digits = String(b.ans).split('')
for (const d of digits) await input(d)
await input('submit')
await p.waitForTimeout(600)
t = await text(p)
await shot(p, '9-backwards-note')
say(/You wrote it from the left\. Stacked problems start with the ones box on the right, then the tens\./.test(t), `typed ${b.ans} left to right → the "from the left" note`)

// The hints on his own problem: second miss → where to start; third → a worked similar problem.
// Each miss is a NEW wrong answer: an unchanged answer is not a new try (since 2026-11-10).
// 2-digit × 1-digit: the ones box, then the last step's number as said (282 → 2, then 2, 8).
const worked = (n: number) => { const w = String(n); return [w.slice(-1), ...w.slice(0, -1).split('')] }
const retype = async (n: number) => { await input('clear'); for (const d of worked(n)) await input(d) }
await retype(b.ans + 1)
await input('submit'); await p.waitForTimeout(700)
t = await text(p)
await shot(p, '10-visual-hint')
const rev = String(b.ans).split('').reverse().join('').replace(/^0+(?=\d)/, '')
const first = `${b.ops[1]} × ${b.ops[0] % 10}`
say(/Work one column at a time|Start with the ones, on the right/.test(t) && t.includes(`what is ${first}?`), `the second hint: his problem, "what is ${first}?"`)
say(!new RegExp(`(^|[^0-9])${b.ans}([^0-9]|$)`).test(t.replace(rev, '').replace(String(b.ans + 1), '')), `no ${b.ans} on screen`)
await retype(b.ans + 2)
await input('submit'); await p.waitForTimeout(1500)
t = await text(p)
await shot(p, '11-full-teaching')
say(/Let me show you with a similar problem/.test(t) && /Start with the ones/.test(t) && !/groups of/.test(t), 'the third: a similar problem, column by column — no "groups of"')
await p.close()

if (errors.length) { console.log(`  !! page errors: ${errors.slice(0, 3).join(' | ')}`); bad++ }
await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — screenshots → ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
