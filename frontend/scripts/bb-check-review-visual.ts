/**
 * Photographs going over the paper — run by hand (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/bb-check-review-visual.ts <harness-dist> [outdir]
 *
 * Uses the owner's son's real check (Level B week 3, seed 1262874861): he chose
 * 47 on "which count is the greatest? 36, 54, 47" (B3-MA-05) and wrote 5 on the
 * two-step tray problem whose answer is 73 (B3-MA-06). The driver fixes the
 * first on the retry, misses the second twice, and asserts on the RENDERED page:
 * his own answer is shown; the guiding step is the item's first hint; the answer
 * to the numeric item is nowhere on screen until every step has been tried; each
 * re-answer is recorded with the steps he had; the strengthening screen then
 * names the skill in plain words, not the adult slug.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium, type Page } from 'playwright-core'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/bb-check-review-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: bb-check-review-visual <harness-dist> [outdir]'); process.exit(2) }
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

const text = (p: Page) => p.evaluate(`document.body.innerText.replace(/[ \\t\\r\\n]+/g, ' ')`) as Promise<string>
const clickText = (p: Page, t: string) => p.evaluate(`(() => {
  const b = [...document.querySelectorAll('button')].find(x => (x.textContent || '').replace(/\\s+/g, ' ').trim() === ${JSON.stringify(t)} || (x.getAttribute('aria-label') || '') === ${JSON.stringify(t)});
  if (!b) return false; b.click(); return true;
})()`) as Promise<boolean>
const clickContaining = (p: Page, t: string) => p.evaluate(`(() => {
  const b = [...document.querySelectorAll('button')].find(x => (x.textContent || '').includes(${JSON.stringify(t)}));
  if (!b) return false; b.click(); return true;
})()`) as Promise<boolean>
async function typeNumber(p: Page, n: string) {
  for (const d of n) await clickText(p, d)
  const ok = (await clickContaining(p, 'Submit')) || (await clickText(p, 'Check'))
  await p.waitForTimeout(350)
  return ok
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] })
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 })
const p = await ctx.newPage()
const errors: string[] = []
p.on('pageerror', (e) => errors.push(String(e)))
await p.addInitScript(`window.speechSynthesis = { speak(){}, cancel(){}, pause(){}, resume(){}, getVoices(){ return [] }, speaking:false, paused:false, pending:false, addEventListener(){}, removeEventListener(){} }; window.SpeechSynthesisUtterance = function(t){ this.text = t };`)

console.log('\n# the review, his real check (B3 Form A: MA-05 chose 47, MA-06 wrote 5)')
await p.goto(`${base}/?screen=review&level=B&week=3&seed=1262874861&misses=B3-MA-05:C,B3-MA-06:5&when=before-strengthening`, { waitUntil: 'load' })
await p.waitForTimeout(700)
let t = await text(p)
fs.writeFileSync(`${OUT}/review-1-ma05-open.png`, await p.screenshot({ fullPage: true }))
say(/Looking back · 1 of 2/.test(t), 'counts the review: "Looking back · 1 of 2"')
say(/Before we practise, let's look at two from the last page/.test(t), 'opens with the band-B line for the strengthening round')
say(/you chose 47/.test(t), 'shows his own answer: "On the last page you chose 47."')
say(/Can a large ones digit hide inside a small count\?/.test(t), 'step 1 is the item\'s own first hint, aimed at his mistake')

say(await clickContaining(p, '54'), 'he picks 54 this time')
await p.waitForTimeout(400)
t = await text(p)
fs.writeFileSync(`${OUT}/review-2-ma05-right.png`, await p.screenshot({ fullPage: true }))
say(/Next one/.test(t), 'a warm confirm and "Next one"')
await clickText(p, 'Next one')
await p.waitForTimeout(500)

t = await text(p)
fs.writeFileSync(`${OUT}/review-3-ma06-open.png`, await p.screenshot({ fullPage: true }))
say(/Looking back · 2 of 2/.test(t) && /you wrote 5/.test(t), 'second miss: "On the last page you wrote 5."')
say(!/(^|[^0-9])73([^0-9]|$)/.test(t), 'the answer 73 is nowhere on screen')
say(await typeNumber(p, '70'), 'he tries 70')
t = await text(p)
fs.writeFileSync(`${OUT}/review-4-ma06-step2.png`, await p.screenshot({ fullPage: true }))
say(/Put the three counts in order first/.test(t), 'a miss opens step 2 (the item\'s second hint)')
say(!/(^|[^0-9])73([^0-9]|$)/.test(t), 'still no 73 on screen after one miss')
say(await typeNumber(p, '71'), 'he tries 71')
t = await text(p)
fs.writeFileSync(`${OUT}/review-5-ma06-shown.png`, await p.screenshot({ fullPage: true }))
say(/It comes to 73/.test(t), 'after both steps: the answer with its reasoning ("It comes to 73")')
say(!/wrong/i.test(t), 'the word "wrong" never appears')
await clickText(p, 'Ready to practise')
await p.waitForTimeout(300)
const rec = await p.evaluate('window.__review') as { recorded: Array<{ id: string; answer: string; correct: boolean; steps: number }>; done: boolean }
console.log(`  recorded: ${JSON.stringify(rec.recorded)}`)
say(rec.recorded.map((r) => `${r.id}:${r.correct}:${r.steps}`).join(',') === 'B3-MA-05:true:1,B3-MA-06:false:1,B3-MA-06:false:2', 'each re-answer recorded with the steps he had (1, then 1 and 2)')
say(rec.done, '"Ready to practise" hands on to the plan')

console.log('\n# the strengthening screen after the review')
await p.goto(`${base}/?screen=strengthen&level=B&week=3&seed=1262874861&wstate=near_miss_cycle1&tag=concept-misconception`, { waitUntil: 'load' })
await p.waitForTimeout(700)
t = await text(p)
fs.writeFileSync(`${OUT}/strengthen-plan.png`, await p.screenshot({ fullPage: true }))
const skill = await p.evaluate(`(() => { const s = [...document.querySelectorAll('section')].find(x => /Just this one/i.test(x.innerText)); return s ? s.innerText.replace(/\\s+/g, ' ') : '' })()`) as string
console.log(`  skill card: ${skill}`)
say(!/compares by the ones digit/i.test(t), 'no adult slug ("compares by the ones digit")')
say(skill.length > 0, 'the skill card names what to strengthen')

if (errors.length) { console.log(`  !! page errors: ${errors.slice(0, 2).join(' | ')}`); bad++ }
await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — screenshots → ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
