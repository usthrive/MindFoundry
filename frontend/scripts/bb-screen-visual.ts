/**
 * Screen-layer photographs — run by hand, NOT part of the battery (needs Chrome).
 *
 * Run (from frontend/):
 *   HARNESS_OUT=<dir> npx vite build -c scripts/screen-harness/vite.config.ts
 *   npx tsx scripts/bb-screen-visual.ts <harness-dist> [outdir]
 *
 * WHY. Every battery gate tests the pack; this photographs the SCREEN the pack
 * lands on, mounted under a stub session (scripts/screen-harness/main.tsx).
 * It prints what a child would see — header label, prompt, tap-target sizes —
 * and pixel-diffs a before/after pair so a "one-line" change is measured, not
 * reasoned about. `bb-animation-visual.ts` is the precedent.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { AVAILABLE_WEEKS, generatePack } from '../src/modules/best-brains/generator';

const DIST = process.argv[2];
const OUT = process.argv[3] ?? '/tmp/bb-screen-visual';
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: bb-screen-visual <harness-dist> [outdir]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const MIME: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const u = new URL(req.url ?? '/', 'http://x');
  let f = path.join(DIST, u.pathname);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  res.setHeader('content-type', MIME[path.extname(f)] ?? 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${(server.address() as any).port}`;

type Scn = { name: string; screen: 'practice' | 'warmup' | 'puzzle'; level: string; week: number; day: number; done?: number; fix?: 0 | 1 };
const retr = (L: string, w: number, d: number) => generatePack(L as any, w, 12345).days[d - 1].items.filter((i) => i.isRetrieval).length;
const firstWeek = (L: string, d: number, pred: (n: number) => boolean) => AVAILABLE_WEEKS.filter((c) => c.level === L && c.source !== 'fixture').map((c) => c.week).find((w) => pred(retr(L, w, d)))!;
const B1 = firstWeek('B', 2, (n) => n === 1);
const D2 = firstWeek('D', 2, (n) => n === 2);
const D_any = AVAILABLE_WEEKS.filter((c) => c.level === 'D' && c.source !== 'fixture')[0].week;

type Scn2 = { name: string; screen: 'practice' | 'warmup' | 'puzzle'; level: string; week: number; day: number; done?: number; fix?: 0 | 1 };
const D5one = AVAILABLE_WEEKS.filter((c) => c.level === 'D' && c.source !== 'fixture').map((c) => c.week).find((w) => retr('D', w, 5) === 1)!;
const FLOW: Scn2[] = [
  { name: 'flow-practice-A2d1-q1', screen: 'practice', level: 'A', week: 2, day: 1, done: 0 },
  { name: 'flow-practice-A2d2-q1', screen: 'practice', level: 'A', week: 2, day: 2, done: 0 },
  { name: 'flow-practice-A2d2-q2', screen: 'practice', level: 'A', week: 2, day: 2, done: 1 },
  { name: 'flow-warmup-A2d2', screen: 'warmup', level: 'A', week: 2, day: 2 },
  { name: `flow-warmup-B${B1}d2`, screen: 'warmup', level: 'B', week: B1, day: 2 },
  { name: `flow-practice-B${B1}d2-q1`, screen: 'practice', level: 'B', week: B1, day: 2, done: 0 },
  { name: `flow-warmup-D${D2}d2-2items`, screen: 'warmup', level: 'D', week: D2, day: 2 },
  { name: `flow-practice-D${D2}d2-q3`, screen: 'practice', level: 'D', week: D2, day: 2, done: 0 },
  { name: `flow-puzzle-D${D5one}d5`, screen: 'puzzle', level: 'D', week: D5one, day: 5 },
];
const SCENARIOS: Scn[] = process.argv.includes('--flow') ? (FLOW as Scn[]) : [
  { name: 'practice-A2d2-before-item1', screen: 'practice', level: 'A', week: 2, day: 2, done: 0, fix: 0 },
  { name: 'practice-A2d2-after-item1', screen: 'practice', level: 'A', week: 2, day: 2, done: 0, fix: 1 },
  { name: 'practice-A2d2-before-item3', screen: 'practice', level: 'A', week: 2, day: 2, done: 2, fix: 0 },
  { name: 'practice-A2d2-after-item3', screen: 'practice', level: 'A', week: 2, day: 2, done: 2, fix: 1 },
  { name: 'practice-A1d2-after-item4of4', screen: 'practice', level: 'A', week: 1, day: 2, done: 3, fix: 1 },
  { name: 'practice-A15d2-fixture-item1', screen: 'practice', level: 'A', week: 15, day: 2, done: 0, fix: 0 },
  { name: `practice-D${D_any}d2-before-item1`, screen: 'practice', level: 'D', week: D_any, day: 2, done: 0, fix: 0 },
  { name: `practice-D${D_any}d2-after-item1`, screen: 'practice', level: 'D', week: D_any, day: 2, done: 0, fix: 1 },
  { name: 'practice-B2d1-item1', screen: 'practice', level: 'B', week: 2, day: 1, done: 0 },
  { name: 'practice-B2d1-item2', screen: 'practice', level: 'B', week: 2, day: 1, done: 1 },
  { name: 'practice-B2d1-item3', screen: 'practice', level: 'B', week: 2, day: 1, done: 2 },
  { name: 'practice-B2d1-item4', screen: 'practice', level: 'B', week: 2, day: 1, done: 3 },
  { name: 'warmup-A2d2-1item', screen: 'warmup', level: 'A', week: 2, day: 2 },
  { name: `warmup-B${B1}d2-1item`, screen: 'warmup', level: 'B', week: B1, day: 2 },
  { name: `warmup-D${D2}d2-2items`, screen: 'warmup', level: 'D', week: D2, day: 2 },
];

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const shots = new Map<string, Buffer>();
// Headless Chrome has no voices; stub the synthesis API and LOG the call order,
// so "who spoke, who got cancelled" on a screen is measured rather than assumed.
await ctx.addInitScript(`
  window.__tts = [];
  class U { constructor(t) { this.text = t; } }
  window.SpeechSynthesisUtterance = U;
  window.speechSynthesis = { speaking: false, paused: false, pending: false,
    speak(u) { window.__tts.push('speak:' + u.text.slice(0, 28)); window.speechSynthesis.speaking = true; },
    cancel() { window.__tts.push('cancel'); window.speechSynthesis.speaking = false; },
    pause() { window.__tts.push('pause'); }, resume() { window.__tts.push('resume'); },
    getVoices() { return []; }, addEventListener() {}, removeEventListener() {}, onvoiceschanged: null };
`);
for (const s of SCENARIOS) {
  const p = await ctx.newPage();
  const errors: string[] = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const url = `${base}/?screen=${s.screen}&level=${s.level}&week=${s.week}&day=${s.day}&done=${s.done ?? 0}&fix=${s.fix ?? 0}`;
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(600);
  // Passed as a string: tsx/esbuild injects a `__name` helper into function
  // bodies, which does not exist inside the page.
  const m = await p.evaluate(`(() => {
    const t = (sel) => { const e = document.querySelector(sel); return e ? e.textContent.trim() : null; };
    const buttons = [...document.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); return { label: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }; });
    const day = Number(new URLSearchParams(location.search).get('day'));
    return {
      redirected: t('[data-harness="redirected"]'),
      header: t('header p'),
      counter: t('[data-bb-counter]'),
      dots: document.querySelectorAll('[data-bb-dot]').length,
      prompt: t('section p'),
      buttons,
      minTarget: Math.min(...buttons.map((b) => Math.min(b.w, b.h))),
      pageHeight: document.documentElement.scrollHeight,
      practiceIds: window.__bb && window.__bb.practice.map((i) => i.id),
      pageCount: window.__bb && window.__bb.pack.days[day - 1].pageCount,
      tts: window.__tts,
    };
  })()`) as any;
  const buf = await p.screenshot({ fullPage: true });
  fs.writeFileSync(`${OUT}/${s.name}.png`, buf);
  shots.set(s.name, buf);
  console.log(`\n# ${s.name}`);
  console.log(`  header="${m.header}" counter="${m.counter}" dots=${m.dots}  pageCount=${m.pageCount}  practiceItems=${m.practiceIds?.length}  pageHeight=${m.pageHeight}px  minTapTarget=${m.minTarget}px`);
  console.log(`  prompt="${(m.prompt ?? '').slice(0, 90)}"`);
  console.log(`  buttons: ${m.buttons.map((b) => `${b.label || '?'}[${b.w}×${b.h}]`).join(' ')}`);
  if (m.tts && m.tts.length) console.log(`  speech calls in order: ${m.tts.join(' → ')}`);
  if (m.redirected) console.log(`  !! ${m.redirected}`);
  if (errors.length) console.log(`  !! page errors: ${errors.slice(0, 3).join(' | ')}`);
  await p.close();
}
await browser.close();
server.close();

async function diff(a: string, b: string) {
  const A = await sharp(shots.get(a)!).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(shots.get(b)!).raw().toBuffer({ resolveWithObject: true });
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) { console.log(`  ${a} vs ${b}: different sizes ${A.info.width}×${A.info.height} vs ${B.info.width}×${B.info.height}`); return; }
  const { width, height, channels } = A.info; let n = 0; const rows = new Set<number>();
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * channels; for (let c = 0; c < channels; c++) if (A.data[i + c] !== B.data[i + c]) { n++; rows.add(y); break; } }
  const ys = [...rows].sort((p, q) => p - q);
  console.log(`  ${a} vs ${b}: ${n} differing pixels${n ? `, rows ${ys[0]}..${ys[ys.length - 1]}` : ''}`);
}
if (!process.argv.includes('--flow')) {
console.log('\n# pixel diffs (before vs after)');
await diff('practice-A2d2-before-item1', 'practice-A2d2-after-item1');
await diff('practice-A2d2-before-item3', 'practice-A2d2-after-item3');
await diff(`practice-D${D_any}d2-before-item1`, `practice-D${D_any}d2-after-item1`);
}
console.log(`\nscreenshots → ${OUT}`);
