/**
 * The browser half of P0 — run by hand, NOT part of the battery (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/kumon-evidence-visual.ts <harness-dist> [outdir]
 *
 * WHY (2026-09-26). A sensor that reads zero everywhere is a question about the
 * sensor before it is a fact about the child: 419 rows of `time_spent: 0` and
 * `tableChecked: false` said nothing about how the child worked. This drives the
 * real worksheet grid in Chrome the way a child uses it — pauses to think, one
 * wrong answer fixed on the retry, a few seconds away from the app mid-problem —
 * and asserts the evidence the grid hands to the save path:
 *   1. first-try time is measured (> 0) and equals the time the problem was
 *      active by the page's MONOTONIC clock, within 500 ms. (On 2026-09-26 the
 *      wall clock jumped 10–12 s backwards mid-run on this host — first a
 *      fixed-threshold check measured the host, then Date.now() did; the grid
 *      itself now times with performance.now() for the same reason);
 *   2. time away from the app is not counted;
 *   3. the wrong-then-right problem carries both answers, first try false;
 *   4. the table flag follows whether the card was on screen, per run;
 *   5. retry work after the first check adds nothing to first-try time.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from 'playwright-core'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/kumon-evidence-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('usage: kumon-evidence-visual <harness-dist> [outdir]')
  process.exit(2)
}
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

const THINK_MS = 1500
const AWAY_MS = 4000

let bad = 0
const say = (ok: boolean, msg: string) => { if (!ok) bad++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] })

for (const run of [{ table: '1', mode: 'open', ws: 31 }, { table: '0', mode: 'tap', ws: 35 }]) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 900 } })
  const p = await ctx.newPage()
  const errors: string[] = []
  p.on('pageerror', (e) => errors.push(String(e)))
  await p.goto(`${base}/?screen=kumon&level=C&ws=${run.ws}&table=${run.table}&mode=${run.mode}`, { waitUntil: 'domcontentloaded' })

  const active = () => p.evaluate(`(() => { const a = window.__kumon.ref.current.getActiveProblem(); return a ? { index: a.index, answer: String(a.problem.correctAnswer), id: a.problem.id } : null })()`) as Promise<{ index: number; answer: string; id: string } | null>
  /** Press a key; returns the page's clock right after the grid handled it. */
  const press = (k: string) => p.evaluate(`(() => { window.__kumon.ref.current.handleInput(${JSON.stringify(k)}); return performance.now() })()`) as Promise<number>
  const type = async (s: string) => { for (const ch of s) await press(ch) }
  const setHidden = (hidden: boolean) => p.evaluate(`(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => ${hidden ? "'hidden'" : "'visible'"} });
    document.dispatchEvent(new Event('visibilitychange'));
    return performance.now();
  })()`) as Promise<number>

  // First pass: answer every problem once. Problem 0 is answered WRONG; problem 1
  // has a trip away from the app in the middle of it.
  const firstPass: Array<{ index: number; id: string; answer: string }> = []
  /** Page-clock window each problem was active, minus time away: the expected first-try time. */
  const expected: Record<number, number> = {}
  // Problem 0 is active from the frame its problems appear (reading the sheet is
  // time on the first problem), so its window starts there, not at our first read.
  let since = await p.evaluate(`new Promise((resolve) => {
    const tick = () => (window.__kumon?.ref.current?.getActiveProblem() ? resolve(performance.now()) : requestAnimationFrame(tick));
    tick();
  })`) as number
  for (let guard = 0; guard < 30; guard++) {
    const a = await active()
    if (!a || firstPass.some((f) => f.index === a.index)) break
    firstPass.push(a)
    await p.waitForTimeout(THINK_MS)
    let away = 0
    if (a.index === 1) { const h = await setHidden(true); await p.waitForTimeout(AWAY_MS); away = (await setHidden(false)) - h }
    await type(a.index === 0 ? String(Number(a.answer) + 1) : a.answer)
    const end = await press('enter')
    expected[a.index] = end - since - away
    since = end
    await p.waitForTimeout(150)
  }
  // Retry: fix whatever is still wrong, slowly (retry time must not count).
  for (let guard = 0; guard < 8; guard++) {
    const pages = await p.evaluate('window.__kumon.pages.length') as number
    if (pages > 0) break
    // Go back to the problem he got wrong, as a child taps it.
    for (let back = 0; back < 12; back++) {
      const cur = await active()
      if (!cur || cur.index === 0) break
      await p.evaluate('window.__kumon.ref.current.navigateToPreviousProblem()')
      await p.waitForTimeout(80)
    }
    const a = await active()
    if (!a) break
    await p.waitForTimeout(3000)
    await press('clear')
    await type(a.answer)
    await press('submit')
    await p.waitForTimeout(400)
  }
  await p.waitForTimeout(600)
  fs.writeFileSync(`${OUT}/grid-ws${run.ws}-table${run.table}.png`, await p.screenshot({ fullPage: true }))

  const page = await p.evaluate('window.__kumon.pages[0] ?? null') as null | { problemAttempts: Array<{ problem: { id: string }; firstAttemptCorrect: boolean; evidence?: { firstTryMs: number | null; triedAnswers: string[]; scaffoldMode: string | null; scaffoldShownBeforeFirstCheck: boolean; scaffoldRevealedBeforeFirstCheck: boolean } }> }
  console.log(`\n# worksheet C${run.ws}, table on screen: ${run.table === '1' ? 'yes' : 'no'} (mode ${run.mode}) — ${firstPass.length} problems on the page`)
  if (errors.length) console.log(`  !! page errors: ${errors.slice(0, 2).join(' | ')}`)
  if (!page) { say(false, 'the page never completed — no evidence reached the save path'); await ctx.close(); continue }

  const rows = page.problemAttempts
  console.log('  idx  firstTryMs  tries        firstTry  tableShown  mode')
  rows.forEach((r, i) => console.log(`  ${String(i).padStart(3)}  ${String(r.evidence?.firstTryMs ?? 'null').padStart(10)}  ${JSON.stringify(r.evidence?.triedAnswers ?? []).padEnd(12)} ${String(r.firstAttemptCorrect).padEnd(8)}  ${String(r.evidence?.scaffoldShownBeforeFirstCheck).padEnd(10)}  ${r.evidence?.scaffoldMode}`))

  const ev = rows.map((r) => r.evidence)
  say(ev.every((e) => e && e.firstTryMs !== null && e.firstTryMs > 0), '1. every problem carries a measured first-try time (> 0)')
  const gaps = rows.map((r, i) => Math.abs((r.evidence?.firstTryMs ?? 0) - (expected[i] ?? NaN)))
  console.log(`  expected by the page clock: ${rows.map((_, i) => Math.round(expected[i])).join(', ')} ms`)
  say(gaps.every((g) => g <= 500), `1. each first-try time equals its active window by the page clock (worst gap ${Math.round(Math.max(...gaps))} ms)`)
  say(Math.abs((ev[1]?.firstTryMs ?? 0) - expected[1]) <= 500, `2. the time away from the app is not counted (problem 1: ${ev[1]?.firstTryMs} ms, window minus away ${Math.round(expected[1])} ms)`)
  say(rows[0].firstAttemptCorrect === false && (ev[0]?.triedAnswers.length ?? 0) >= 2, `3. the wrong-then-right problem keeps both answers (${JSON.stringify(ev[0]?.triedAnswers)})`)
  say(ev.every((e) => e!.scaffoldShownBeforeFirstCheck === (run.table === '1')), `4. table flag = ${run.table === '1'} on every problem`)
  say((ev[0]?.firstTryMs ?? 99999) <= expected[0] + 500, `5. the 3 s of retry work on problem 0 added nothing (${ev[0]?.firstTryMs} ms vs ${Math.round(expected[0])} ms)`)
  await ctx.close()
}

await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — screenshots → ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
