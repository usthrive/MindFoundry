/**
 * sm-switch-visual — photographs of the "Singapore Method on this device" switch
 * (2026-11-21): Settings with the switch off, after a tap (on), on a laptop with the
 * keyboard focus ring on it; the dashboard without and with the card.
 *
 * Run (from frontend/): HARNESS_OUT=<dir> npx vite build --config scripts/screen-harness/vite.config.ts
 *   then: npx tsx scripts/sm-switch-visual.ts <dir> [outdir]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';

const DIST = process.argv[2];
const OUT = process.argv[3] ?? '/tmp/sm-switch-visual';
if (!DIST || !fs.existsSync(path.join(DIST, 'index.html'))) { console.error('usage: sm-switch-visual <harness-dist> [outdir]'); process.exit(2); }
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
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
const TABLET = { width: 820, height: 1180 }, LAPTOP = { width: 1366, height: 768 };
let bad = 0;
const check = (ok: boolean, msg: string) => { if (!ok) bad++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${msg}`); };

async function page(viewport: typeof TABLET, screen: string, flag: boolean) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(`${base}/index.html?screen=${screen}`, { waitUntil: 'load' });
  await p.evaluate((on) => { if (on) localStorage.setItem('mf.schoolMath.enabled', '1'); else localStorage.removeItem('mf.schoolMath.enabled'); }, flag);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(600);
  return { p, ctx };
}
const shot = async (p: any, name: string) => { await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true }); console.log(`  shot ${name}.png`); };

{ // 1-2 Settings off, then tap → on (tablet)
  const { p, ctx } = await page(TABLET, 'sm-settings', false);
  const sw = p.getByTestId('sm-device-switch');
  check((await sw.getAttribute('aria-checked')) === 'false', 'settings: switch starts Off');
  await shot(p, '1-settings-off-tablet');
  await sw.click(); await p.waitForTimeout(300);
  check((await sw.getAttribute('aria-checked')) === 'true', 'settings: one tap turns it On');
  check((await p.evaluate(() => localStorage.getItem('mf.schoolMath.enabled'))) === '1', 'settings: the device flag is set');
  await shot(p, '2-settings-on-tablet');
  await sw.click(); await p.waitForTimeout(300);
  check((await p.evaluate(() => localStorage.getItem('mf.schoolMath.enabled'))) === null, 'settings: a second tap turns it Off again');
  await ctx.close();
}
{ // 3 laptop, keyboard focus ring on the switch, toggled with the keyboard
  const { p, ctx } = await page(LAPTOP, 'sm-settings', false);
  let focused = false;
  for (let i = 0; i < 20 && !focused; i++) { await p.keyboard.press('Tab'); focused = await p.evaluate(() => document.activeElement?.getAttribute('data-testid') === 'sm-device-switch'); }
  check(focused, 'laptop: the switch is reachable by Tab');
  await p.keyboard.press('Space'); await p.waitForTimeout(300);
  check((await p.getByTestId('sm-device-switch').getAttribute('aria-checked')) === 'true', 'laptop: Space turns it On');
  await shot(p, '3-settings-focus-laptop');
  await ctx.close();
}
for (const on of [false, true]) { // 4-5 dashboard without / with the card
  const { p, ctx } = await page(TABLET, 'sm-dashboard', on);
  const has = (await p.getByText('Singapore Method', { exact: false }).count()) > 0;
  check(has === on, `dashboard: card ${on ? 'shown' : 'hidden'} with the switch ${on ? 'On' : 'Off'}`);
  await shot(p, `${on ? 5 : 4}-dashboard-${on ? 'on' : 'off'}-tablet`);
  await ctx.close();
}
await browser.close(); server.close();
console.log(`\n${bad ? 'FAIL' : 'PASS'} sm-switch-visual · screenshots → ${OUT}`);
process.exit(bad ? 1 : 0);
