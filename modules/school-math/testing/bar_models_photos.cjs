/* bar_models_photos.cjs — photographs of the bar-models page (2026-11-21) and the module home tile.
   Drives the served page (frontend/public/school-math/bar-models.html) with playwright-core, one browser,
   one context at a time, and asserts each flow on the way (look-again, W6, keyboard labels, self-check,
   the check's hand-in / review / end screen, the scorecard).
   Run (from frontend/): HARNESS_OUT=<dir> npx vite build --config scripts/screen-harness/vite.config.ts
     then: node ../modules/school-math/testing/bar_models_photos.cjs <dir>
   Photos land in modules/school-math/testing/photos-2026-11-21-bar-models/. */
const fs = require('fs'), http = require('http'), path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../frontend/node_modules/playwright-core'));
const REPO = path.resolve(__dirname, '../../..');
const HARN = process.argv[2];
const OUT = path.join(REPO, 'modules/school-math/testing/photos-2026-11-21-bar-models');
fs.mkdirSync(OUT, { recursive: true });
const PUB = path.join(REPO, 'frontend/public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const u = new URL(req.url || '/', 'http://x');
  let f;
  if (u.pathname.startsWith('/school-math/')) f = path.join(PUB, u.pathname);
  else { f = path.join(HARN, u.pathname); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(HARN, 'index.html'); }
  if (!fs.existsSync(f)) { res.statusCode = 404; res.end(); return; }
  res.setHeader('content-type', MIME[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
const TABLET = { width: 820, height: 1180 }, LAPTOP = { width: 1366, height: 768 };
let bad = 0, shots = [];
const check = (ok, msg) => { if (!ok) bad++; console.log((ok ? '  ok   ' : '  FAIL ') + msg); };

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const errors = [];
  async function open(vp, url) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error' && !/fonts|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
    await p.goto(base + url, { waitUntil: 'load' });
    await p.waitForTimeout(300);
    return { p, ctx };
  }
  async function shot(p, name, full = true) { const f = path.join(OUT, name + '.png'); await p.screenshot({ path: f, fullPage: full }); shots.push(name); }
  const W = (p) => p.waitForTimeout(120);
  /* helpers that act on the visible step j of the item on screen */
  const step = (p, j) => p.locator('#steps > .step').nth(j);
  async function pick(p, j, idx) { await step(p, j).locator('.choice').nth(idx).click(); await W(p); await p.click('#checkKey'); await W(p); }
  async function type(p, j, v) { const i = step(p, j).locator('input.box'); await i.click(); await i.fill(String(v)); await W(p); await p.click('#checkKey'); await W(p); }
  async function label(p, j, lab, check = true) {
    const slots = step(p, j).locator('.slot');
    const order = [lab.whole, lab.a, lab.b];
    for (let k = 0; k < 3; k++) {
      if (!order[k]) continue;
      await slots.nth(k).click(); await W(p);
      await step(p, j).locator('.chip').filter({ hasText: new RegExp('^' + String(order[k]).replace('?', '\\?') + '$') }).first().click(); await W(p);
    }
    if (check) { await p.click('#checkKey'); await W(p); }
  }
  /* the item data, read from the page's own generator */
  async function itemOf(p, s, i, opts) { return p.evaluate(([s, i, o]) => { const b = window.GEN.buildSession(s, 0, o || {}); return b.items[i]; }, [s, i, opts || {}]); }
  function keyLab(st) { return { whole: st.answer.whole, a: st.answer.parts[0], b: st.answer.parts[1] }; }
  async function solve(p, it, from) {
    for (let j = from || 0; j < it.steps.length; j++) {
      const st = it.steps[j];
      if (st.ungraded) { if (st.type === 'chips') { await step(p, j).locator('.chip').first().click(); await W(p); } if (st.type === 'paper') { await step(p, j).locator('button', { hasText: 'I drew it' }).click(); await W(p); } continue; }
      if (st.optional) { await step(p, j).locator('button', { hasText: 'Skip this' }).click(); await W(p); continue; }
      if (st.type === 'pick') await pick(p, j, st.key);
      if (st.type === 'num') await type(p, j, st.answer);
      if (st.type === 'label') await label(p, j, keyLab(st));
    }
  }

  /* 1. the module home with the new tile (harness) */
  for (const [vp, nm] of [[TABLET, 'tablet'], [LAPTOP, 'laptop']]) {
    const { p, ctx } = await open(vp, '/index.html?screen=school-math');
    await p.waitForTimeout(800);
    check(await p.locator('text=Bar Models: Part-Whole').count() > 0, 'home shows the Bar Models tile (' + nm + ')');
    check(await p.locator('text=Subtraction Test Prep').count() > 0 && await p.locator('text=My Scorecard').count() > 0, 'home keeps Test Prep and Scorecard (' + nm + ')');
    if (nm === 'laptop') { for (let k = 0; k < 3; k++) await p.keyboard.press('Tab'); await W(p); }
    await shot(p, '01-home-tile-' + nm);
    await ctx.close();
  }

  /* 2. session 1: first item, a miss, look-again with his answer */
  {
    const { p, ctx } = await open(TABLET, '/school-math/bar-models.html?c=photo-child');
    await shot(p, '02-sessions-home-tablet');
    await p.locator('#sessions .card').first().locator('button', { hasText: 'Start' }).click(); await W(p);
    await shot(p, '03-s1-first-item-tablet');
    check(!(await p.locator('#rec').isVisible()), 'the grown-up footer is closed by default');
    check(/top circle has a question mark|top circle shows/.test(await p.evaluate(() => window.GEN.buildSession(1, 0).items[0].say)), 'read-aloud names positions only');
    const it0 = await itemOf(p, 1, 0);
    check((await p.locator('#qcount').textContent()) === 'Question 1 of 7', 'session 1 opens on question 1 of 7');
    await solve(p, it0);
    await p.click('#nextBtn'); await W(p);
    const it1 = await itemOf(p, 1, 1);
    await pick(p, 0, it1.steps[0].key);
    const wrongV = it1.steps[1].diag[0] ? it1.steps[1].diag[0].v : it1.steps[1].answer + 2;
    await type(p, 1, wrongV);
    check(/Not yet/.test(await p.locator('#fb').textContent()), 'a wrong number gets "Not yet" and a clue');
    await shot(p, '04-s1-wrong-number-clue-tablet');
    await type(p, 1, wrongV);
    check(/again/.test(await p.locator('#fb').textContent()), 'W6: the same answer again gets the clue again');
    await type(p, 1, it1.steps[1].answer);
    for (let i = 2; i < 7; i++) { await p.click('#nextBtn'); await W(p); await solve(p, await itemOf(p, 1, i)); }
    await p.click('#nextBtn'); await W(p);
    check(await p.locator('#summary h2', { hasText: 'look at again' }).count() > 0, 'W2: the look-again offer appears');
    await shot(p, '05-s1-look-again-offer-tablet');
    await p.locator('#summary button', { hasText: 'Look again' }).click(); await W(p);
    check(/You wrote \d+\./.test(await p.locator('#banner').textContent()), 'W2: his own answer is shown ("You wrote …")');
    check(await step(p, 1).isVisible() && await step(p, 0).locator('.choice').first().isDisabled(), 'W2: opens on the missed step, the earlier step shown done');
    await shot(p, '06-s1-look-again-his-answer-tablet');
    await solve(p, it1, 1);
    await p.click('#nextBtn'); await W(p);
    await shot(p, '07-s1-done-rest-tablet');
    await ctx.close();
  }

  /* 3. LABEL items (session 6: decide + label), tablet; one on a laptop with the focus ring */
  {
    const { p, ctx } = await open(TABLET, '/school-math/bar-models.html?c=photo-child');
    await p.locator('#sessions .card').nth(5).locator('button').first().click(); await W(p);
    const it = await itemOf(p, 6, 0);
    await pick(p, 0, 1 - it.steps[0].key);
    check(/Not yet/.test(await p.locator('#fb').textContent()), 'a wrong part/whole decision gets its clue');
    await shot(p, '08-s6-wrong-decision-clue-tablet');
    await pick(p, 0, it.steps[0].key);
    await shot(p, '09-s6-label-empty-tablet');
    const lab = keyLab(it.steps[1]);
    await label(p, 1, { whole: lab.whole, a: lab.a, b: null }, false);
    await shot(p, '10-s6-label-part-filled-tablet');
    await label(p, 1, { whole: null, a: null, b: lab.b });
    check(/Right/.test(await p.locator('#fb').textContent()), 'the labelled bar is right');
    await shot(p, '11-s6-label-right-tablet');
    await p.locator('#recbox summary').click(); await W(p);
    check(await p.locator('#rec').isVisible(), 'the footer opens on a tap');
    await shot(p, '11b-s6-footer-open-tablet');
    await ctx.close();
  }
  {
    const { p, ctx } = await open(LAPTOP, '/school-math/bar-models.html?c=photo-child-2');
    await p.locator('#sessions .card').nth(3).locator('button').first().click(); await W(p);
    const it = await itemOf(p, 4, 0);
    /* keyboard only: Tab to the slot over the bar, Enter, then arrows on the chips and Enter */
    await step(p, 0).locator('.slot').first().focus(); await p.keyboard.press('Enter'); await W(p);
    const chips = it.steps[0].chips, want = it.steps[0].answer.whole, at = chips.indexOf(want);
    for (let k = 0; k < at; k++) { await p.keyboard.press('ArrowRight'); await W(p); }
    await p.keyboard.press('Enter'); await W(p);
    check((await step(p, 0).locator('.slot').first().textContent()) === want, 'keyboard: Enter on a slot, arrows on the chips, Enter places');
    await shot(p, '12-s4-label-keyboard-focus-laptop', false);
    await ctx.close();
  }

  /* 4. a BUILD item (session 7) with a wrong first label: the self-check beside the story's bar */
  {
    const { p, ctx } = await open(TABLET, '/school-math/bar-models.html?c=photo-child');
    await p.locator('#sessions .card').nth(6).locator('button').first().click(); await W(p);
    const it = await itemOf(p, 7, 0);
    check(it.steps[0].role === 'shape' && it.steps[0].warm, 'session 7 opens with the warm-up shape');
    await shot(p, '13-s7-build-shape-tablet');
    await pick(p, 0, it.steps[0].key);
    const k = keyLab(it.steps[1]);
    const wrong = it.steps[1].asked === 'whole' ? { whole: k.a, a: '?', b: k.b } : { whole: '?', a: k.whole, b: k.a === '?' ? k.b : k.a };
    await label(p, 1, wrong);
    check(await p.locator('.selfcheck').count() === 0 && await step(p, 1).locator('.slot.look').count() > 0, 'build miss: only the differing places turn orange, no model shown');
    await shot(p, '14-s7-build-selfcheck-miss-tablet');
    await label(p, 1, k);
    check(await p.locator('.selfcheck').count() > 0, 'build right: his bar beside the story bar');
    await shot(p, '14b-s7-build-selfcheck-right-tablet');
    await p.click('#nextBtn'); await W(p);
    const it2 = await itemOf(p, 7, 1);
    check(it2.steps[0].role === 'label', 'the second build question has no shape step');
    await ctx.close();
  }

  /* 5. the check (session 10): mid-way, hand in, review of one miss, the end screen */
  {
    const { p, ctx } = await open(TABLET, '/school-math/bar-models.html?c=photo-child');
    await p.locator('#sessions .card').nth(9).locator('button').first().click(); await W(p);
    const items = []; for (let i = 0; i < 7; i++) items.push(await itemOf(p, 10, i));
    /* Q1 wrong on purpose (a pool value), the rest right */
    await step(p, 0).locator('.choice').nth(items[0].steps[0].key === 0 ? 1 : 0).click(); await W(p); await p.click('#checkKey'); await W(p);
    for (let i = 1; i < 7; i++) {
      await p.click('#nextBtn'); await W(p);
      const it = items[i];
      let seg = 0;
      for (let j = 0; j < it.steps.length; j++) {
        const st = it.steps[j];
        if (i === 4 && j === 0) await shot(p, '15-s10-check-midway-tablet');
        if (st.type === 'pick') { await step(p, j).locator('.choice').nth(st.key).click(); await W(p); }
        if (st.type === 'num') { const v = st.addBack ? String(st.answer) : String(st.answer); const inp = step(p, j).locator('input.box'); await inp.click(); await inp.fill(v); await W(p); }
        if (st.type === 'label') await label(p, j, keyLab(st), false);
      }
      await p.click('#checkKey'); await W(p);
    }
    await p.click('#nextBtn'); await W(p);
    check(/Score: 13 of 15/.test(await p.locator('#fb').textContent()), 'hand-in: 13 of 15 with one A item missed');
    await shot(p, '16-s10-review-one-miss-tablet');
    await step(p, 0).locator('.choice').nth(items[0].steps[0].key).click(); await W(p); await p.click('#checkKey'); await W(p);
    check(/Right now/.test(await p.locator('#steps').textContent()), 'review: one re-attempt, the score stays');
    for (let i = 1; i < 7; i++) { await p.click('#nextBtn'); await W(p); }
    await p.click('#nextBtn'); await W(p);
    check(/13 of 15 points/.test(await p.locator('#summary').textContent()), 'end screen in counts');
    await shot(p, '17-s10-end-screen-tablet');
    await p.locator('#summary button', { hasText: 'Back to the sessions' }).click(); await W(p);
    await shot(p, '18-scorecard-and-sessions-tablet');
    await ctx.close();
  }
  {
    /* records persist per context; the scorecard view on a fresh context shows nothing, so seed it from a run */
    const { p, ctx } = await open(LAPTOP, '/school-math/bar-models.html?c=photo-child');
    await p.locator('#sessions .card').first().locator('button', { hasText: 'Start' }).click(); await W(p);
    for (let i = 0; i < 7; i++) { const it = await itemOf(p, 1, i); if (i === 2) { await pick(p, 0, 1 - it.steps[0].key); } await solve(p, it); await p.click('#nextBtn'); await W(p); }
    await p.locator('#summary button', { hasText: 'Rest now' }).click(); await W(p);
    await p.locator('#summary button', { hasText: 'Back to the sessions' }).click(); await W(p);
    await p.goto(base + '/school-math/bar-models.html?c=photo-child&view=scorecard', { waitUntil: 'load' }); await W(p);
    await p.locator('#grown summary').click(); await W(p);
    await p.keyboard.press('Tab'); await W(p);
    check(/Sessions done: 1 of 10/.test(await p.locator('#scorecard').textContent()), 'scorecard: sessions done in counts');
    check(!/%/.test(await p.locator('#scorecard').textContent()), 'scorecard: no percent');
    await shot(p, '19-scorecard-view-grownup-laptop');
    await ctx.close();
  }
  check(errors.length === 0, 'no page errors (' + errors.slice(0, 3).join(' | ') + ')');
  await browser.close();
  server.close();
  console.log('photos: ' + shots.length + ' → ' + OUT);
  console.log(bad ? 'FAIL ' + bad : 'PASS');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
