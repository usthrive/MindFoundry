/**
 * Photographs Kumon change set 1 (2026-11-10: rulings R1, R2, R4 and the record
 * fixes) on the REAL StudyPage — run by hand (needs Chrome). Every flow is driven the
 * way a child works: on the TOUCH PAD at tablet width (his device) and on a physical
 * KEYBOARD at phone width (future students), and the page's own records are read back.
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/kumon-pass-rule-visual.ts <harness-dist> [outdir]
 *
 *   A  tablet, pad   no clock on his sheet; Check on after ONE answer; blanks stay
 *                    "not yet"; the cursor moves on; an unchanged wrong answer is not
 *                    a new try; the hint record survives; 6 of 10 first try → the same
 *                    sheet again (no score shown) with the line on the sheet; then a
 *                    clean sitting passes and the sheet moves on.
 *   B  phone, pad    the third try that does not pass moves on; recorded as such.
 *   C  phone, keys   Enter waits on a half-written answer (across the line and
 *                    stacked); the nudge goes with the problem; Enter after the last
 *                    answer checks the page.
 *   R  tablet, keys  a reload on page 2 comes back ON page 2, and the sheet records
 *                    ten problems, not 13–15.
 *   D  phone         the parent card: first try, time, focus, the moved-on line; a move
 *                    asks for the parent check and goes through the one move path.
 *   E  tablet        Parent Mode shows the clock the child no longer sees.
 *   F  tablet        an ordered table sheet's repeat does not promise new numbers.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium, type Browser, type Page } from 'playwright-core'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/kumon-pass-rule-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: kumon-pass-rule-visual <harness-dist> [outdir]'); process.exit(2) }
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

const TABLET = { width: 820, height: 1180 }
const PHONE = { width: 430, height: 900 }
const browser: Browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] })
const errors: string[] = []
async function open(url: string, vp: { width: number; height: number }): Promise<Page> {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(String(e)))
  // Clear storage once per tab, not on a reload (scenario R reloads on purpose).
  await p.addInitScript(`if (!sessionStorage.getItem('h')) { localStorage.clear(); sessionStorage.setItem('h', '1') }`)
  await p.goto(`${base}/${url}`, { waitUntil: 'load' })
  await p.waitForTimeout(2500)
  return p
}
const wait = (p: Page, ms = 250) => p.waitForTimeout(ms)
const text = (p: Page) => p.evaluate(`document.body.innerText.replace(/[ \\t\\r\\n]+/g, ' ')`) as Promise<string>
const shot = async (p: Page, name: string) => fs.writeFileSync(`${OUT}/${name}.png`, await p.screenshot({ fullPage: true }))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ev = <T = any>(p: Page, js: string) => p.evaluate(js) as Promise<T>

interface Prob { operands: number[]; correctAnswer: number; displayFormat: string; question: string }
const session = (p: Page) => ev(p, `JSON.parse(localStorage.getItem('mindfoundry_active_session') || 'null')`)
const pageState = async (p: Page) => (await session(p))?.worksheetPageState
const problems = async (p: Page): Promise<Prob[]> => (await pageState(p))?.problems ?? []
const cards = (p: Page) => ev<Array<{ state: string; active: boolean; mark: string }>>(p, `[...document.querySelectorAll('[data-testid="wp-card"]')].map(c => ({
  state: c.className.includes('border-green-500') ? 'right' : c.className.includes('border-red-500') ? 'wrong' : 'not-yet',
  active: c.className.includes('ring-primary') || c.className.includes('ring-orange-400'),
  mark: [...c.children].map(x => x.textContent).find(t => t === '✓' || t === '✗') || '' }))`)
/** The pad's buttons are the last of their name on the page (the grid comes first). */
const pad = async (p: Page, label: string) => {
  const ok = await ev<boolean>(p, `(() => { const bs = [...document.querySelectorAll('button')].filter(b => (b.textContent || '').replace(/\\s+/g, '').trim() === ${JSON.stringify(label)}); const b = bs[bs.length - 1]; if (!b || b.disabled) return false; b.click(); return true })()`)
  await wait(p, label === '✓Check' ? 600 : 120)
  return ok
}
const padDisabled = (p: Page, label: string) => ev<boolean>(p, `(() => { const bs = [...document.querySelectorAll('button')].filter(b => (b.textContent || '').replace(/\\s+/g, '').trim() === ${JSON.stringify(label)}); const b = bs[bs.length - 1]; return !b || b.disabled })()`)
const click = async (p: Page, label: string) => {
  const ok = await ev<boolean>(p, `(() => { const b = [...document.querySelectorAll('button')].find(x => (x.textContent || '').replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(label)})); if (!b || b.disabled) return false; b.click(); return true })()`)
  await wait(p, 500)
  return ok
}
const tapCard = async (p: Page, i: number) => { await ev(p, `document.querySelectorAll('[data-testid="wp-card"]')[${i}].click()`); await wait(p, 150) }
const right = (pr: Prob) => String(pr.correctAnswer)
const wrong = (pr: Prob) => String(pr.correctAnswer + 1)
/** Stacked answers are written from the ONES (as on paper); answers across the line, as read. */
async function write(p: Page, pr: Prob, answer: string, via: 'pad' | 'keys') {
  const digits = pr.displayFormat === 'vertical' ? answer.split('').reverse() : answer.split('')
  for (const d of digits) {
    if (via === 'pad') await pad(p, d)
    else { await p.keyboard.press(d); await wait(p, 80) }
  }
}
const inserts = (p: Page, table: string) => ev<Array<Record<string, any>>>(p, `(window.__sbInserts || []).filter(x => x.table === ${JSON.stringify(table)}).map(x => x.row)`)
const updates = (p: Page, table: string) => ev<Array<Record<string, any>>>(p, `(window.__sbUpdates || []).filter(x => x.table === ${JSON.stringify(table)})`)
const fixture = (p: Page, table: string) => ev<Array<Record<string, any>>>(p, `JSON.parse(JSON.stringify((window.__sbFixture || {})[${JSON.stringify(table)}] || []))`)
const position = async (p: Page) => (await fixture(p, 'children'))[0]?.current_worksheet
const record = async (p: Page, ws: number) => (await fixture(p, 'worksheet_progress')).find((r) => r.worksheet_number === ws)

/** Work one page on the pad: write every problem (wrong first where asked), Check, fix the misses, Check. */
async function workPage(p: Page, wrongFirst: Set<number>, via: 'pad' | 'keys' = 'pad') {
  const ps = await problems(p)
  for (let i = 0; i < ps.length; i++) {
    await tapCard(p, i)
    await write(p, ps[i], wrongFirst.has(i) ? wrong(ps[i]) : right(ps[i]), via)
  }
  await pad(p, '✓Check')
  for (const i of wrongFirst) {
    await tapCard(p, i)
    await pad(p, 'C')
    await write(p, ps[i], right(ps[i]), via)
  }
  if (wrongFirst.size) await pad(p, '✓Check')
}
/** A whole sheet: page 1, Next Page, page 2. Waits for the end-of-sheet message. */
async function workSheet(p: Page, wrong1: number[], wrong2: number[]) {
  await workPage(p, new Set(wrong1))
  await click(p, 'Next Page')
  await wait(p, 600)
  await workPage(p, new Set(wrong2))
  await wait(p, 1500) // the last page auto-completes after 1.2 s
}
const PARENT_ANSWERS: Record<string, number> = { '17 × 13': 221, '156 ÷ 12': 13, '23 × 11': 253, '144 ÷ 16': 9, '19 × 14': 266, '225 ÷ 15': 15, '18 × 17': 306, '168 ÷ 14': 12, '24 × 13': 312, '195 ÷ 13': 15, '√625': 25, '√484': 22, '43²': 1849, '27²': 729, '15²': 225 }
async function passParentCheck(p: Page): Promise<boolean> {
  let q: string | undefined
  for (let tries = 0; tries < 30 && !q; tries++) {
    await wait(p, 200)
    const t = await text(p)
    q = Object.keys(PARENT_ANSWERS).find((k) => t.includes(`${k} = ?`))
  }
  if (!q) return false
  await p.fill('input[placeholder="Enter answer"]', String(PARENT_ANSWERS[q]))
  await click(p, 'Verify')
  await wait(p, 800)
  return true
}

// ===========================================================================
console.log('\n# A — tablet, touch pad: C56 (stacked), a repeat, then a pass')
let p = await open('?screen=kumon-study&ws=56', TABLET)
let t = await text(p)
await shot(p, 'A1-sheet-no-clock-tablet')
say(!/⏱|🎯/.test(t) && !/\b\d{1,2}:\d{2}\b/.test(t), 'his sheet shows no stopwatch, no focus score, no clock (R4)')
say(await padDisabled(p, '✓Check'), 'Check is off while nothing is written')
let ps = await problems(p)
await write(p, ps[0], right(ps[0]), 'pad')
say(!(await padDisabled(p, '✓Check')), 'ONE answer written → the pad\'s ✓ Check is on (R2; it waited for all five)')
await pad(p, '✓Check')
let c = await cards(p)
t = await text(p)
say(c[0].state === 'right' && c.slice(1).every((x) => x.state === 'not-yet' && x.mark === ''), 'checked: problem 1 right; the four blanks are "not yet" — no ✗, no red')
say(/Keep going — 4 more on this page/.test(t), '"Keep going — 4 more on this page."')
say(c[1].active, 'the cursor moved on to problem 2 by itself')
await shot(p, 'A2-check-after-one-answer')
await write(p, ps[1], wrong(ps[1]), 'pad')
await pad(p, '✓Check')
await tapCard(p, 2)
await write(p, ps[2], right(ps[2]), 'pad')
await pad(p, '✓Check') // problem 2's wrong answer is unchanged
let st = await pageState(p)
say(st.attemptCounts?.[1] === 1 && st.results?.[2] === true, 'checking problem 3 does not re-check problem 2\'s unchanged answer (still its first miss, not its second)')
await shot(p, 'A3-unchanged-answer-not-a-new-try')
await tapCard(p, 1); await pad(p, 'C'); await write(p, ps[1], right(ps[1]), 'pad')
await tapCard(p, 3); await write(p, ps[3], right(ps[3]), 'pad')
await tapCard(p, 4); await write(p, ps[4], right(ps[4]), 'pad')
await pad(p, '✓Check')
await wait(p, 500)
const rows1 = await inserts(p, 'problem_attempts')
const p2 = rows1.find((r) => r.problem_data?.id === ps[1].id || (r.problem_data?.operands?.join() === ps[1].operands.join()))
say(rows1.length === 5 && p2?.hints_used?.attemptsCount === 2 && JSON.stringify(p2?.hints_used?.triedAnswers) === JSON.stringify([wrong(ps[1]), right(ps[1])]) && p2?.hints_used?.hintLevelReached === 'micro',
  `page 1 recorded: problem 2 = 2 tries ${JSON.stringify(p2?.hints_used?.triedAnswers)}, hint reached "${p2?.hints_used?.hintLevelReached}" (was always empty)`)
await click(p, 'Next Page')
await wait(p, 600)
await workPage(p, new Set([0, 1, 2]))
await wait(p, 1600)
t = await text(p)
await shot(p, 'A4-repeat-message')
say(/Same sheet, new numbers — let's make it steady and smooth\./.test(t) && !/\d+ of 10|%/.test(t.slice(0, 400)), 'end of sheet, 6 of 10 first try: "Same sheet, new numbers — let\'s make it steady and smooth." — no score')
await wait(p, 4000)
let rec = await record(p, 56)
let last = rec?.sittings?.[rec.sittings.length - 1]
const sess = (await updates(p, 'practice_sessions')).map((u) => u.row).filter((r) => r?.status === 'completed')
say(last?.outcome === 'repeat' && last?.firstTry === 6 && last?.problems === 10 && rec?.status === 'in_progress' && rec?.problems_total === 10 && rec?.first_try_correct === 6 && typeof rec?.avg_focus_score === 'number',
  `recorded: sitting "repeat", 6 of 10 first try, status in_progress, avg_focus_score ${rec?.avg_focus_score}`)
say(sess[0]?.problems_completed === 10 && sess[0]?.problems_correct === 10, `session totals count problems: ${sess[0]?.problems_completed} done, ${sess[0]?.problems_correct} right in the end`)
say((await position(p)) === 56, 'the position stays on C56')
for (let i = 0; i < 4 && (await click(p, 'Done')); i++) await wait(p, 300) // the cohort recap that follows every sheet
t = await text(p)
say(/Worksheet 56/.test(t) && /🔁/.test(t) && /Same sheet, new numbers/.test(t), 'C56 again, with the line on the sheet: 🔁 "Same sheet, new numbers…"')
await shot(p, 'A5-repeat-banner-on-the-sheet')
await workSheet(p, [], [])
t = await text(p)
await shot(p, 'A6-pass-message')
say(/🎉 C56 done!/.test(t) && /10 of 10 right the first time/.test(t) && /Next: C57/.test(t) && !/%/.test(t.slice(0, 300)), 'a clean sitting: "🎉 C56 done! ✅ 10 of 10 right the first time — Next: C57" (a count, no %)')
await wait(p, 4000)
rec = await record(p, 56)
say(rec?.sittings?.map((s: any) => s.outcome).join() === 'repeat,pass' && rec?.status === 'completed' && (await position(p)) === 57, `then: sittings ${rec?.sittings?.map((s: any) => s.outcome).join(' → ')}, status ${rec?.status}, position C${await position(p)}`)
await p.context().close()

// ===========================================================================
console.log('\n# B — phone, touch pad: the third try moves on')
p = await open('?screen=kumon-study&ws=56&runs=repeat,repeat', PHONE)
t = await text(p)
await shot(p, 'B1-third-try-phone')
say(/🔁/.test(t) && /Same sheet, new numbers/.test(t), 'the line on the sheet at phone width')
await workSheet(p, [0, 1, 2], [0, 1])
t = await text(p)
await shot(p, 'B2-moved-on-message')
// A score reads "N of M right"; "Page 1 of 2" is not one.
say(/Time for a new sheet: C57\./.test(t) && !/\d+ of \d+ right/.test(t), '"Time for a new sheet: C57." — no score')
await wait(p, 4000)
rec = await record(p, 56)
last = rec?.sittings?.[rec.sittings.length - 1]
say(last?.outcome === 'moved_on' && last?.tryNumber === 3 && (await position(p)) === 57, `recorded "moved_on" on try ${last?.tryNumber}; position C${await position(p)}`)
await p.context().close()

// ===========================================================================
console.log('\n# C — phone, keyboard: Enter waits on a half-written answer')
// Find a times-table sheet whose first page asks a ×10 fact (its answer is two digits by shape).
let tens = -1
for (const ws of [47, 48, 49, 50, 46, 45]) {
  p = await open(`?screen=kumon-study&ws=${ws}`, PHONE)
  ps = await problems(p)
  tens = ps.findIndex((x) => x.operands.some((o) => o >= 10))
  if (tens >= 0) { console.log(`       C${ws}: ${ps[tens].question}`); break }
  await p.context().close()
}
await tapCard(p, tens)
await p.keyboard.press(right(ps[tens])[0]); await wait(p)
await p.keyboard.press('Enter'); await wait(p, 300)
c = await cards(p)
t = await text(p)
say(tens >= 0 && c[tens].active && /Keep going: finish this answer\./.test(t), `${ps[tens]?.question.replace(' = ___', '')}: "${right(ps[tens])[0]}" + Enter keeps him on it — "Keep going: finish this answer."`)
await shot(p, 'C1-enter-on-a-times-ten-fact')
const one = ps.findIndex((x, i) => i !== tens && x.operands.every((o) => o < 10) && String(x.correctAnswer).length >= 2)
if (one >= 0) {
  await tapCard(p, one)
  await p.keyboard.press(right(ps[one])[0]); await wait(p)
  await p.keyboard.press('Enter'); await wait(p, 300)
  c = await cards(p)
  say(!c[one].active, `${ps[one].question.replace(' = ___', '')}: one digit is a possible answer of this shape, so Enter means "done" (the rule never reads the answer)`)
}

// The stacked sheet on the keyboard.
await p.context().close()
p = await open('?screen=kumon-study&ws=56', PHONE)
ps = await problems(p)
await p.keyboard.press(right(ps[0]).split('').reverse()[0]); await wait(p)
await p.keyboard.press('Enter'); await wait(p, 300)
c = await cards(p)
t = await text(p)
say(c[0].active && /Keep going: next is the tens box\./.test(t), 'stacked: one digit + Enter stays on problem 1 — "Keep going: next is the tens box."')
await shot(p, 'C2-enter-on-a-stacked-answer')
await tapCard(p, 1)
say(!(await ev<boolean>(p, `!!document.querySelector('[data-entry-nudge]')`)), 'tapping another problem takes the nudge away (it hung over the next one)')
// Keyboard only: write each answer and press Enter; the last Enter checks the page.
await tapCard(p, 0)
await p.keyboard.press('Backspace'); await wait(p)
for (let i = 0; i < 5; i++) { await write(p, ps[i], right(ps[i]), 'keys'); await p.keyboard.press('Enter'); await wait(p, 250) }
await wait(p, 600)
c = await cards(p)
say(c.every((x) => x.state === 'right'), 'keyboard: answer + Enter five times — the last Enter checks the page; all right')
await shot(p, 'C3-keyboard-page-checked')
await p.context().close()

// ===========================================================================
console.log('\n# R — tablet, keyboard: a reload on page 2')
p = await open('?screen=kumon-study&ws=56', TABLET)
ps = await problems(p)
for (let i = 0; i < 5; i++) { await tapCard(p, i); await write(p, ps[i], right(ps[i]), 'keys') }
await pad(p, '✓Check')
await click(p, 'Next Page')
await wait(p, 600)
const page2 = await problems(p)
await tapCard(p, 0); await write(p, page2[0], right(page2[0]), 'keys')
await tapCard(p, 1); await write(p, page2[1], right(page2[1]), 'keys')
await wait(p, 400)
await p.reload({ waitUntil: 'load' })
await p.waitForTimeout(3000)
t = await text(p)
st = await pageState(p)
say(/Page 2 of 2/.test(t) && st?.pageNumber === 2 && st?.answers?.[0] === right(page2[0]), `after the reload: "Page 2 of 2", his two answers still there (was: page 2 served as page 1, then again)`)
await shot(p, 'R1-reload-back-on-page-2')
const after = await problems(p)
for (let i = 2; i < 5; i++) { await tapCard(p, i); await write(p, after[i], right(after[i]), 'keys') }
await pad(p, '✓Check')
await wait(p, 5500)
rec = await record(p, 56)
last = rec?.sittings?.[rec.sittings.length - 1]
const sess2 = (await updates(p, 'practice_sessions')).map((u) => u.row).filter((r) => r?.status === 'completed')
say(last?.problems === 10 && last?.firstTry === 10 && last?.outcome === 'pass' && sess2[0]?.problems_completed === 10,
  `the sheet records 10 problems (${last?.problems}), 10 first try, a pass; session ${sess2[0]?.problems_completed} problems (C17 recorded 13)`)
await p.context().close()

// ===========================================================================
console.log('\n# D — phone: the parent card and its moves')
p = await open('?screen=kumon-parent&ws=56', PHONE)
t = await text(p)
await shot(p, 'D1-parent-card-phone')
say(/Now: C56 — try 2 of 3/.test(t), '"Now: C56 — try 2 of 3"')
say(/C52: moved on after 3 tries — first try 60%, 2\.5× standard time/.test(t), 'the log line: "C52: moved on after 3 tries — first try 60%, 2.5× standard time"')
say(/6 of 10 first try · 2\.2× standard · focus 91%/.test(t) && /Not yet · try 1 of 3/.test(t) && /Moved on · try 3 of 3/.test(t) && /Passed on try 2/.test(t), 'each sitting: first try, time against the standard, focus, and "Not yet · try 1 of 3" / "Passed on try 2" / "Moved on · try 3 of 3"')
say(/Repeat C55/.test(t) && /Move on anyway/.test(t), 'while C56 is repeating: "Move on anyway" and "Repeat C55"')
say(await click(p, 'Move on anyway'), '"Move on anyway"')
say((await position(p)) === 56 && /Checking verification method|= \?/.test(await text(p)), 'nothing moves until the parent check is passed')
for (let i = 0; i < 30 && !/= \?/.test(await text(p)); i++) await wait(p, 200)
await shot(p, 'D2-parent-check')
say(await passParentCheck(p), 'parent check passed')
await wait(p, 800)
t = await text(p)
const prog = await fixture(p, 'worksheet_progress')
const c56 = prog.find((r) => r.worksheet_number === 56)
say(/Done\. Next time Harness practises, C57 opens\./.test(t) && (await position(p)) === 57 && c56?.sittings?.at(-1)?.outcome === 'parent_move_on',
  `moved: position C${await position(p)}, C56 record ends "${c56?.sittings?.at(-1)?.outcome}"`)
await shot(p, 'D3-moved-on-by-parent')
await p.fill('#kumon-back-to', '50')
say(await click(p, 'Go'), '"Go back to C50"')
say(await passParentCheck(p), 'parent check passed')
await wait(p, 800)
const deletes = (await updates(p, 'concepts_seen')).filter((u) => u.op === 'delete')
say((await position(p)) === 50 && deletes.length > 0, `back to C${await position(p)} through the move path: the seen intros from C50 on are cleared (${deletes.length} delete)`)
await p.context().close()
p = await open('?screen=kumon-parent&ws=56', TABLET)
await shot(p, 'D4-parent-card-tablet')
await p.context().close()

// ===========================================================================
console.log('\n# E — tablet: Parent Mode shows the clock')
p = await open('?screen=kumon-study&ws=56', TABLET)
say(await click(p, 'Parent Controls'), '"🔒 Parent Controls"')
say(await passParentCheck(p), 'parent check passed')
await wait(p, 1200)
t = await text(p)
say(/⏱/.test(t) && /\d+:\d{2}/.test(t), 'in Parent Mode the stopwatch is there for the grown-up')
await shot(p, 'E1-parent-mode-clock')
await p.context().close()

// ===========================================================================
console.log('\n# F — tablet: an ordered table sheet repeats without promising new numbers')
p = await open('?screen=kumon-study&ws=15&runs=repeat', TABLET)
t = await text(p)
say(/Same sheet again — let's make it steady and smooth\./.test(t) && !/new numbers/.test(t), '"Same sheet again — let\'s make it steady and smooth." (the ×3 walk stays in order)')
await shot(p, 'F1-ordered-sheet-repeat')
await p.context().close()

const real = errors.filter((e) => !/harness: supabase disabled|Proxy\(Function\)/.test(e))
say(real.length === 0, `no page errors${real.length ? ': ' + [...new Set(real)].slice(0, 5).join(' | ') : ''}`)
await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — photographs in ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
