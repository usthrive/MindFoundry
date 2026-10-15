/**
 * Photographs "where the week is at", a closed week, the comebacks and the parent
 * home — run by hand (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/bb-moving-on-visual.ts <harness-dist> [outdir]
 *
 * On the owner's son's real record (scripts/screen-harness/his-log.ts) it asserts
 * on the RENDERED page:
 *   hub now     — week 4 as it stands (6/6 held by Day 4, then 4/6): the card says
 *                 what moving on needs, the grown-up part lists his two misses with
 *                 his answers; no "renaming", no adult slug, no teacher;
 *   held        — the moment after the first check: why the week waits;
 *   closed      — a HYPOTHETICAL second re-check at 3/6: the week closes, the next
 *                 idea's button is there, no teacher anywhere (hub + strengthen);
 *   comebacks   — Day 2 of a later week: two of his earlier misses come back with
 *                 new numbers, the first try shows no step, each question is read
 *                 aloud by itself (band B), and the log rows are what the ledger
 *                 reads (origin week, attempt 1 unaided, day null, no error tag);
 *   check       — a re-check question reads itself aloud at band B;
 *   parent      — the week line and the comeback list.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium, type Page } from 'playwright-core'
import { generatePack } from '../src/modules/best-brains/generator'
import { comebackLedger, comebackQuestion, dueComebacks, type LoggedAnswer } from '../src/modules/best-brains/session/comebacks'
import { promptText } from '../src/modules/best-brains/figures/prompt'
import type { PackItem } from '../src/modules/best-brains/types'
import { hisLog, weekRows } from './screen-harness/his-log'

const DIST = process.argv[2]
const OUT = process.argv[3] ?? '/tmp/bb-moving-on-visual'
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: bb-moving-on-visual <harness-dist> [outdir]'); process.exit(2) }
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
async function answer(p: Page, item: PackItem, value: string) {
  if (item.choices?.length) {
    const c = item.choices.find((x) => x.key.toLowerCase() === value.toLowerCase())
    const ok = await clickContaining(p, c?.text ?? value)
    await p.waitForTimeout(400)
    return ok
  }
  for (const d of value) await clickText(p, d)
  const ok = (await clickContaining(p, 'Submit')) || (await clickText(p, 'Check'))
  await p.waitForTimeout(400)
  return ok
}
const wrongFor = (item: PackItem) => (item.choices?.length ? item.choices.find((c) => c.key !== item.answer.value)!.key : String(Number(item.answer.value) + 1))

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] })
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 })
const errors: string[] = []
async function open(url: string): Promise<Page> {
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(String(e)))
  // A speech engine that records what it was asked to say, then "finishes".
  // window.speechSynthesis is a read-only accessor: a plain assignment is ignored.
  await p.addInitScript(`window.__spoken = [];
    window.SpeechSynthesisUtterance = function(t){ this.text = t };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking:false, paused:false, pending:false,
      speak(u){ window.__spoken.push(u.text); setTimeout(() => { u.onstart && u.onstart({}); u.onend && u.onend({}); }, 5); },
      cancel(){}, pause(){}, resume(){}, getVoices(){ return [{ name: 'Stub', lang: 'en-US', default: true, localService: true, voiceURI: 'stub' }] },
      addEventListener(){}, removeEventListener(){} } });`)
  await p.goto(`${base}/${url}`, { waitUntil: 'load' })
  await p.waitForTimeout(900)
  return p
}
const spoken = (p: Page) => p.evaluate('window.__spoken') as Promise<string[]>
const inserts = (p: Page) => p.evaluate('window.__sbInserts || []') as Promise<Array<{ table: string; row: LoggedAnswer & { day: number | null; error_tag: string | null } }>>
const card = (p: Page) => p.evaluate(`(document.querySelector('[data-week-status]')?.innerText || '').replace(/\\s+/g, ' ')`) as Promise<string>

console.log('\n# hub — week 4 as it stands (6/6 held by Day 4 at 40%, then 4/6)')
let p = await open('?screen=hub&level=B&week=4&seed=645474193&real=b4&wstate=cycle2')
let t = await text(p)
let c = await card(p)
fs.writeFileSync(`${OUT}/1-hub-now.png`, await p.screenshot({ fullPage: true }))
console.log(`  card: ${c.slice(0, 600)}`)
say(/Week 4: what's next/.test(c), 'the card is on the home screen')
say(/All 5 practice days done/.test(c) && /Last page: all 6 right!/.test(c) && /New questions: 4 of 6 right/.test(c), 'it says what happened, in counts')
say(/To move on: 5 of 6 right on brand-new questions/.test(c), 'it says what moving on needs')
say(/one more practice round, then 6 brand-new questions — the last try this week/.test(c) && /Ready now/.test(c), 'it says what is next, and when')
say(/held: Day 4 practice was 40%/.test(c) && /Re-check: 4\/6 \(moving on needs 5\)/.test(c), 'the grown-up part has the numbers')
say(/Which square is Ava on at the end\?” — answered 6/.test(c) && /— answered 9/.test(c), 'the grown-up part lists his two misses with his answers')
say(/Ask: “Before you count anything, which way is this hop going to take you\?”/.test(c), 'the pack\'s own question for the grown-up to ask')
say(!/renaming|Still strengthening|teacher/i.test(t), 'no "renaming", no adult slug, no teacher on the screen')
say(/One more round — let's glue it down/.test(t), 'the round\'s own button is still there')
await p.close()

console.log('\n# hub — the moment after the first check')
p = await open('?screen=hub&level=B&week=4&seed=645474193&real=b4&wstate=near_miss_cycle1')
c = await card(p)
fs.writeFileSync(`${OUT}/2-hub-held.png`, await p.screenshot({ fullPage: true }))
say(/Day 4's practice was tricky, so Ms. Wren wants one more look first/.test(c), 'the held week says why it waits')
say(/Next: a short practice round, then 6 brand-new questions/.test(c), 'and what is next')
await p.close()

console.log('\n# a closed week (HYPOTHETICAL second re-check, 3 of 6)')
p = await open('?screen=hub&level=B&week=4&seed=645474193&real=b4&wstate=escalated')
t = await text(p)
c = await card(p)
fs.writeFileSync(`${OUT}/3-hub-closed.png`, await p.screenshot({ fullPage: true }))
say(/Week 4: on to the next idea/.test(c) && /The tricky questions will come back in warm-ups, with new numbers/.test(c), 'the card says the week closed and what comes back')
say(/Second re-check: 3\/6/.test(c) && /come back as warm-ups with new numbers — in 2 days, a week, then 3 weeks/.test(c), 'the grown-up part explains the comebacks')
say(/Ready for the next idea\?/.test(t), 'the next idea\'s button is there (the dead end is gone)')
say(!/teacher/i.test(t), 'no teacher anywhere')
await p.close()
p = await open('?screen=strengthen&level=B&week=4&seed=645474193&real=b4&wstate=escalated')
t = await text(p)
c = await card(p)
fs.writeFileSync(`${OUT}/4-strengthen-closed.png`, await p.screenshot({ fullPage: true }))
say(/This week is done for now — on to the next idea/.test(t) && !/teacher/i.test(t), 'the strengthen screen: moved on, no teacher')
say(/answered 6/.test(c) && /answered 9/.test(c) && /answered B|answered/.test(c), 'it lists the second re-check\'s misses')
await p.close()

console.log('\n# comebacks — Day 2 of a later week')
const rows: LoggedAnswer[] = hisLog().map((r) => ({ ...r }))
const due = dueComebacks(comebackLedger(rows, 'B'), rows)
const wk = weekRows()
const qs = due.map((e) => {
  const w = wk.find((x) => x.week === e.week)!
  return comebackQuestion(e, generatePack('B', e.week, w.pack_seed, '1.2.0'), w.pack_seed, '1.2.0')!
})
console.log(`  due today: ${due.map((e) => `${e.key} (${e.originId})`).join(', ')}`)
p = await open('?screen=comeback&level=B&week=5&day=2&seed=12345')
t = await text(p)
fs.writeFileSync(`${OUT}/5-comeback-open.png`, await p.screenshot({ fullPage: true }))
say(qs.length === 2 && new RegExp(`Coming back · 1 of ${qs.length}`, 'i').test(t), `"Coming back · 1 of ${qs.length}"`)
say(/Two questions from an earlier week are back, with new numbers/.test(t), 'the opening line says what this is')
say(await p.evaluate('document.querySelectorAll("[data-review-step]").length') === 0, 'the first try shows no step')
say(!/Last time you|On the last page/.test(t), 'no "last time you said" — it is a new question')
const q1 = qs[0].item
say(t.includes(promptText(q1.prompt).replace(/\s+/g, ' ').trim().slice(0, 40)), `question 1 is round 1 of ${qs[0].entry.originId}, new numbers (${qs[0].kind})`)
const said = await spoken(p)
say(said.some((s) => s.includes(promptText(q1.prompt).replace(/\s+/g, ' ').trim().slice(0, 25))), 'it is read aloud by itself at band B')
say(await answer(p, q1, wrongFor(q1)), `a first try that misses (${wrongFor(q1)})`)
t = await text(p)
fs.writeFileSync(`${OUT}/6-comeback-step.png`, await p.screenshot({ fullPage: true }))
say(await p.evaluate('document.querySelectorAll("[data-review-step]").length') === 1, 'a miss opens the first step')
say(await answer(p, q1, q1.answer.value), 'then he gets it')
await clickText(p, 'Next one')
await p.waitForTimeout(500)
const q2 = qs[1].item
say(await answer(p, q2, q2.answer.value), 'the second one, right first time')
t = await text(p)
fs.writeFileSync(`${OUT}/7-comeback-right.png`, await p.screenshot({ fullPage: true }))
say(/On to today's practice/.test(t), '"On to today\'s practice" closes the comebacks')
const ins = (await inserts(p)).filter((x) => x.table === 'bb_item_attempts').map((x) => x.row)
console.log(`  recorded: ${JSON.stringify(ins.map((r) => ({ pack: r.pack_id, id: r.item_id, a: r.answer, ok: r.correct, n: r.attempt_no, h: r.hint_rungs_used, day: r.day, tag: r.error_tag })))}`)
const want = [
  `MFM-B${qs[0].entry.week}|${q1.id}|false|1|0`,
  `MFM-B${qs[0].entry.week}|${q1.id}|true|2|1`,
  `MFM-B${qs[1].entry.week}|${q2.id}|true|1|0`,
].join(',')
say(ins.map((r) => `${r.pack_id}|${r.item_id}|${r.correct}|${r.attempt_no}|${r.hint_rungs_used}`).join(',') === want, 'logged as the ledger reads it: origin week, attempt 1 = the unaided try, then the try after a step')
say(ins.every((r) => r.day === null && r.error_tag === null), 'day null, no error tag')
const after = [...rows, ...ins.map((r) => ({ ...r, created_at: new Date().toISOString() }))]
const L2 = comebackLedger(after, 'B')
say(L2.find((e) => e.key === qs[0].entry.key)?.step === 0 && L2.find((e) => e.key === qs[1].entry.key)?.step === 1, 'the ledger reads them: the missed first try resets, the clean one moves on')
say(dueComebacks(L2, after).length === 0, 'and nothing more comes back today')
await p.close()

console.log('\n# a re-check question reads itself aloud at band B')
p = await open('?screen=fresh&level=B&week=4&seed=645474193&real=b4&wstate=cycle2')
await clickContaining(p, "let's go") || await clickContaining(p, 'Start') || await clickContaining(p, 'go')
await p.waitForTimeout(900)
t = await text(p)
fs.writeFileSync(`${OUT}/8-recheck-reads-aloud.png`, await p.screenshot({ fullPage: true }))
const heard = await spoken(p)
const shown = (await p.evaluate(`(document.querySelector('[aria-label="The problem"] p')?.innerText || '')`) as string).replace(/\s+/g, ' ').trim()
console.log(`  on screen: ${shown.slice(0, 80)} · spoken: ${heard.map((s) => s.slice(0, 40)).join(' / ')}`)
say(shown.length > 0 && heard.some((s) => s.includes(shown.slice(0, 25))), 'the first re-check question was read aloud without a tap')
await p.close()

console.log('\n# parent home')
p = await open('?screen=parent&level=B&week=4&seed=645474193')
t = await text(p)
fs.writeFileSync(`${OUT}/9-parent-home.png`, await p.screenshot({ fullPage: true }))
say(/Week 4 not finished yet — last try 4\/6; moving on needs 5\/6\. Next: one more practice round, then the last re-check\./.test(t), 'the parent sees where week 4 is at')
say(/Coming back in warm-ups/.test(t) && /13 missed check questions · up to 2 a day/.test(t), 'and the comeback list (13 from his checks)')
await p.close()

if (errors.length) { console.log(`  !! page errors: ${errors.slice(0, 3).join(' | ')}`); bad++ }
await browser.close()
server.close()
console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — screenshots → ${OUT}`)
process.exit(bad === 0 ? 0 : 1)
