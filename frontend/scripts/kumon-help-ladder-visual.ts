/**
 * Photographs the help ladder as a child climbs it — run by hand (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/kumon-help-ladder-visual.ts <harness-dist> [outdir]
 *
 * For each fact: open rung 1, then tap "Use a fact I know", "Count it", "Show me
 * the table", photographing each step at 430 px. Asserts on the RENDERED page
 * (not the content module): the answer is nowhere on screen before rung 4; each
 * rung adds exactly one step; every button is at least 44 px tall; the table
 * card appears only at rung 4.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from 'playwright-core'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/kumon-help-ladder-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: kumon-help-ladder-visual <harness-dist> [outdir]'); process.exit(2) }
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
for (const [a, b, support] of [[6, 7, 'tap'], [9, 8, 'covered'], [7, 4, 'tap']] as const) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  const errors: string[] = []
  p.on('pageerror', (e) => errors.push(String(e)))
  await p.goto(`${base}/?screen=ladder&a=${a}&b=${b}&rung=1&tables=${a}&support=${support}`, { waitUntil: 'load' })
  await p.waitForTimeout(500)
  console.log(`\n# ${a} × ${b} (table ${support} at rung 4)`)
  const answer = String(a * b)
  for (const rung of [1, 2, 3, 4]) {
    if (rung > 1) { await p.click(`[data-help-next="${rung}"]`); await p.waitForTimeout(350) }
    const m = await p.evaluate(`(() => ({
      rungs: [...document.querySelectorAll('[data-help-rung]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()),
      body: document.body.innerText,
      tableCard: !!document.querySelector('[data-help-ladder]') && document.body.innerText.includes('${a} ×') && document.querySelectorAll('[data-help-ladder] ~ div, [data-help-ladder] + div').length,
      minButton: Math.min(...[...document.querySelectorAll('[data-help-ladder] button')].map(b => b.getBoundingClientRect().height)),
      h: document.documentElement.scrollHeight,
    }))()`) as { rungs: string[]; body: string; minButton: number; h: number }
    fs.writeFileSync(`${OUT}/ladder-${a}x${b}-rung${rung}.png`, await p.screenshot({ fullPage: true }))
    const answerShown = new RegExp(`(^|[^0-9])${answer}([^0-9]|$)`).test(m.body.replace(`${a} × ${b} = ___`, ''))
    console.log(`  rung ${rung}: ${m.rungs[m.rungs.length - 1] ?? '(table)'}`)
    if (rung < 4) {
      say(!answerShown, `rung ${rung}: the answer ${answer} is nowhere on screen`)
      say(m.rungs.length === rung, `rung ${rung}: exactly ${rung} step(s) shown`)
    } else {
      say(m.rungs.length === 3, 'rung 4: the three thinking steps stay on screen above the table')
    }
    say(m.minButton >= 44, `rung ${rung}: ladder buttons ≥ 44 px (smallest ${Math.round(m.minButton)} px)`)
  }
  if (errors.length) { console.log(`  !! page errors: ${errors.slice(0, 2).join(' | ')}`); bad++ }
  await ctx.close()
}
await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — screenshots → ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
