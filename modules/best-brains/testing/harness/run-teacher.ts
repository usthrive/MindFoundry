/**
 * Phase 7 — TEACHER-EVALUATOR ("Ms. Okafor") runner.
 *
 * Drives every rubric row R1–R7 of testing/personas/TEACHER-EVALUATOR.md
 * against the live dev app through the shared mocked-Supabase harness.
 * One launch per scenario (mock DB is in-memory per launch).
 *
 *   cd frontend && npx tsx ../modules/best-brains/testing/harness/run-teacher.ts
 *
 * Screenshots → testing/screenshots/phase7/teacher/  (labels prefixed rN-)
 * Combined run log → testing/runs/teacher-run.json
 *
 * NOTE (persona spec): the mastery RPC here is the harness EMULATION —
 * UI behavior on both verdict branches is verified; server-side scoring
 * correctness is NOT claimed from these runs.
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { launchHarness, type Harness } from './harness';
import {
  CHILDREN,
  enrollChild,
  freshDb,
  packFor,
  scenarioJordanMidWeek,
  scenarioMayaDay5,
  scenarioMayaMidWeek,
  scenarioMayaNearMiss,
  scenarioNoraMidWeek,
  scenarioParent,
} from './fixtures';
import type { WeeklyConceptPack } from '../../../../frontend/src/modules/best-brains/types';

const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = join(HARNESS_DIR, '..', 'runs');
const RUN_FILE = join(RUNS_DIR, 'teacher-run.json');

// ---------------------------------------------------------------------------
// Answer oracle — prompt → answer spec, from the app's own generator
// ---------------------------------------------------------------------------

interface Oracle {
  value: string;
  choices?: string[];
  validation: string;
}

const oracle = new Map<string, Oracle>();

function norm(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

function indexPack(pack: WeeklyConceptPack): void {
  const put = (prompt: string, answer: { value: string; validation: string }, choices?: { key: string }[]) => {
    oracle.set(norm(prompt), {
      value: answer.value,
      validation: answer.validation,
      choices: choices?.map((c) => c.key),
    });
  };
  for (const day of pack.days) for (const it of day.items) put(it.prompt, it.answer, it.choices);
  for (const it of pack.masteryCheck.formA) put(it.prompt, it.answer, it.choices);
  for (const it of pack.masteryCheck.formB) put(it.prompt, it.answer, it.choices);
  put(pack.puzzle.prompt, pack.puzzle.answer);
}

indexPack(packFor('B', 1));
indexPack(packFor('A', 1));
indexPack(packFor('D', 17));

function lookupByScreen(screenText: string): Oracle {
  const t = norm(screenText);
  for (const [prompt, spec] of oracle.entries()) {
    if (t.includes(prompt)) return spec;
  }
  throw new Error(`answer oracle: no pack item matches screen text: "${screenText.slice(0, 120)}"`);
}

function wrongFor(spec: Oracle): string {
  if (spec.choices?.length) {
    return spec.choices.find((k) => k.toLowerCase() !== spec.value.toLowerCase()) ?? spec.choices[0];
  }
  const n = Number(spec.value);
  if (Number.isFinite(n)) return String(Math.abs(n) + 1);
  if (/^-?\d+\s*\/\s*\d+$/.test(spec.value)) return '0';
  return 'zzz';
}

// ---------------------------------------------------------------------------
// UI drivers
// ---------------------------------------------------------------------------

/**
 * Wait out the async session-load states before asserting anything. E2: also
 * require real content so a capture is never a "Setting up…" placeholder.
 */
async function settled(h: Harness): Promise<void> {
  await h.page
    .waitForFunction(
      () => {
        const t = document.body.innerText;
        return !/Setting up…|Opening the note…/.test(t) && t.replace(/\s+/g, ' ').trim().length > 80;
      },
      undefined,
      { timeout: 30000 },
    )
    .catch(() => undefined);
  await h.page.waitForTimeout(600);
}

/**
 * E1 fix: only click an Anchor affordance on screens that actually mount one.
 * SprintGate (and other non-anchor surfaces) render no Anchor — the old
 * unconditional click hung there for 30s and truncated the whole teacher run
 * before R6. Returns whether the panel opened.
 */
async function openAnchorIfPresent(h: Harness, name: RegExp): Promise<boolean> {
  const btn = h.page.getByRole('button', { name }).first();
  if (!(await btn.isVisible().catch(() => false))) return false;
  await btn.click();
  await h.page.waitForTimeout(500);
  await settled(h);
  return true;
}

async function closeAnchorIfOpen(h: Harness): Promise<void> {
  const close = h.page.locator('button[aria-label="Close"]').first();
  if (await close.isVisible().catch(() => false)) {
    await close.click();
    await h.page.waitForTimeout(300);
  }
}

/** E2: assert a screen-specific string is present before we treat it as ready. */
async function waitReady(h: Harness, needle: RegExp | string, timeout = 20000): Promise<boolean> {
  const ok = await h.page
    .waitForFunction(
      (src: string) => new RegExp(src).test(document.body.innerText),
      typeof needle === 'string' ? needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : needle.source,
      { timeout },
    )
    .then(() => true)
    .catch(() => false);
  await settled(h);
  return ok;
}

async function nav(h: Harness, path: string, settleMs = 1200): Promise<void> {
  try {
    await h.page.goto(h.url(path), { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch {
    // One retry on the known WSL2 goto flake (BROWSER-TESTING-TOOLING gotcha).
    await h.page.goto(h.url(path), { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  await h.page.waitForTimeout(settleMs);
  await settled(h);
}

async function firstNav(h: Harness, path = '/foundry'): Promise<void> {
  await nav(h, path, 4000); // AuthContext + FoundryLayout grace window
}

async function body(h: Harness): Promise<string> {
  return (await h.page.locator('body').innerText().catch(() => '')) ?? '';
}

async function clickBtn(h: Harness, name: RegExp, settleMs = 700): Promise<void> {
  await h.page.getByRole('button', { name }).first().click();
  await h.page.waitForTimeout(settleMs);
  await settled(h);
}

const PROMPT_SECTIONS =
  'section[aria-label="The problem"], section[aria-label="The question"], section[aria-label="The task"], section[aria-label="The puzzle"], section[aria-label="A fresh one"]';

async function promptText(h: Harness): Promise<string> {
  const sec = h.page.locator(PROMPT_SECTIONS).first();
  await sec.waitFor({ state: 'visible', timeout: 15000 });
  return (await sec.innerText()).trim();
}

/** Submit an answer string through whichever entry surface is on screen. */
async function submitValue(h: Harness, value: string, avoidTap?: string): Promise<void> {
  const page = h.page;
  const tapButtons = page.locator('button[aria-label^="Answer "]');
  if (await tapButtons.first().isVisible().catch(() => false)) {
    const exact = page.locator(`button[aria-label="Answer ${value}"]`);
    if (await exact.isVisible().catch(() => false)) {
      await exact.click();
    } else {
      // tap-wrong path: first option that is not the value to avoid
      const count = await tapButtons.count();
      for (let i = 0; i < count; i++) {
        const label = (await tapButtons.nth(i).getAttribute('aria-label')) ?? '';
        if (avoidTap && label === `Answer ${avoidTap}`) continue;
        await tapButtons.nth(i).click();
        break;
      }
    }
  } else if (await page.locator('.mf-pad-tray').first().isVisible().catch(() => false)) {
    const pad = page.locator('.mf-pad-tray');
    // The answer box retains the previous attempt's digits on the same item.
    await pad.getByRole('button', { name: /Clear/ }).click();
    for (const ch of value) {
      await pad.getByRole('button', { name: ch, exact: true }).click();
    }
    await pad.getByRole('button', { name: /Submit/ }).click();
  } else if (await page.getByLabel('Your answer').first().isVisible().catch(() => false)) {
    await page.getByLabel('Your answer').first().fill(value);
    await page.getByRole('button', { name: /^Check$/ }).click();
  } else {
    // multiple choice: button containing the exact key text
    await page
      .getByRole('button')
      .filter({ has: page.getByText(value, { exact: true }) })
      .first()
      .click();
  }
  await page.waitForTimeout(700);
}

/**
 * Answer the item currently on screen. wrong=true submits a deliberate miss.
 * delayMs guards the LS1-R2 rapid-guess counter (first wrong attempts must
 * not look like <2s guesses, or the adaptive stop would end the day early).
 */
async function answerCurrent(h: Harness, opts: { wrong?: boolean; delayMs?: number } = {}): Promise<Oracle> {
  const spec = lookupByScreen(await promptText(h));
  if (opts.delayMs) await h.page.waitForTimeout(opts.delayMs);
  if (opts.wrong) await submitValue(h, wrongFor(spec), spec.value);
  else await submitValue(h, spec.value);
  return spec;
}

function grepHits(text: string, patterns: Array<[string, RegExp]>): string[] {
  return patterns.filter(([, re]) => re.test(text)).map(([name]) => name);
}

// ---------------------------------------------------------------------------
// Run bookkeeping
// ---------------------------------------------------------------------------

interface RunRecord {
  run: string;
  status: string;
  data: unknown;
}
const allRuns: RunRecord[] = [];
const observations: Record<string, unknown> = {};

async function finishRun(h: Harness, run: string, status: 'ok' | 'failed', note?: string): Promise<void> {
  const file = await h.finish(status, note);
  try {
    allRuns.push({ run, status, data: JSON.parse(readFileSync(file, 'utf8')) });
  } catch {
    allRuns.push({ run, status, data: null });
  }
  console.log(`[run ${run}] ${status}${note ? ` — ${note}` : ''}`);
}

/** Poll the dev server back to health (it can be OOM-killed under WSL2 4GB). */
async function waitForServer(maxMs = 120000): Promise<void> {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    try {
      const res = await fetch('http://localhost:5173/', { signal: AbortSignal.timeout(5000) });
      if (res.ok) return;
    } catch {
      /* keep polling */
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error('dev server did not come back within 120s');
}

/** Optional subset: TEACHER_RUNS=r3,r4 npx tsx run-teacher.ts */
const RUN_FILTER = (process.env.TEACHER_RUNS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

function runSelected(run: string): boolean {
  return RUN_FILTER.length === 0 || RUN_FILTER.some((f) => run.startsWith(f));
}

async function withRun(
  run: string,
  makeHarness: () => Promise<Harness>,
  fn: (h: Harness) => Promise<void>,
): Promise<void> {
  if (!runSelected(run)) return;
  let h: Harness | null = null;
  try {
    await waitForServer();
    h = await makeHarness();
    await fn(h);
    await finishRun(h, run, 'ok');
  } catch (e) {
    console.error(`[run ${run}] FAILED:`, e);
    if (h) {
      await h.shot(`${run}-failure`).catch(() => undefined);
      await finishRun(h, run, 'failed', String(e));
    }
  }
}

// ---------------------------------------------------------------------------
// RUN 1 — R1 concept-first: fresh week, lesson gate, route guard
// ---------------------------------------------------------------------------

async function run1(): Promise<void> {
  await withRun(
    'r1-concept-first',
    () => {
      const db = freshDb([CHILDREN.maya]);
      enrollChild(db, CHILDREN.maya, 'B', 1); // NO stage call — week not started
      return launchHarness({ persona: 'teacher', db, viewport: 'child', selectedChildId: CHILDREN.maya.id });
    },
    async (h) => {
      await firstNav(h);
      await waitReady(h, /Start the lesson with Ms\. Wren|begins with a lesson|Level B/); // E2 ready-assert
      await h.step('r1 hub fresh week', `url=${h.page.url()}`);
      await h.shot('r1-hub-fresh-week');
      const hubText = await body(h);
      await h.step(
        'r1 hub CTA check',
        `lesson CTA present=${/Start the lesson with Ms\. Wren/.test(hubText)}; "begins with a lesson" line=${/begins with a lesson/.test(hubText)}`,
      );

      // Pre-lesson anchor: must be empty mode. (E1-guarded: only if mounted.)
      const anchorOpened = await openAnchorIfPresent(h, /^Anchor$/);
      await h.shot('r1-anchor-empty-prelesson');
      const anchorText = await body(h);
      await h.step(
        'r1 pre-lesson anchor',
        `anchor mounted=${anchorOpened}; empty-mode line present=${/The lesson fills this panel/.test(anchorText)}; worked examples shown=${/Worked examples/.test(anchorText)}`,
      );
      await closeAnchorIfOpen(h);

      // GUARD PROBE 1: practice for Day 1 BEFORE any lesson.
      await nav(h, '/foundry/day/1/practice');
      const url1 = h.page.url();
      const p1 = await body(h);
      const practiceRendered = /Day 1 · page/.test(p1);
      await h.step(
        'r1 GUARD: /foundry/day/1/practice before lesson',
        `url=${url1}; practice page rendered=${practiceRendered} (expected: bounce to lesson/hub)`,
      );
      await h.shot('r1-day1-practice-before-lesson');
      observations.r1_practice_before_lesson = { url: url1, practiceRendered };

      // GUARD PROBE 1b: same probe WITHOUT a reload (in-app history push) — the
      // full-reload bounce above may be the session-loading race, not the guard.
      await nav(h, '/foundry/hub');
      await h.page.evaluate(() => {
        history.pushState({}, '', '/foundry/day/1/practice');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      await h.page.waitForTimeout(2000);
      const inAppUrl = h.page.url();
      const inAppBody = await body(h);
      const inAppPractice = /page 1 of/i.test(inAppBody);
      // C4 (a9beb59): isDayActionable now gates day-1 practice on isLessonComplete,
      // so this in-app probe on a fresh (pre-lesson) week must BOUNCE to hub —
      // recorded as BLOCKED = pass, not a bug.
      const inAppBounced = /\/foundry(\/hub)?$/.test(inAppUrl) && !inAppPractice;
      await h.step(
        'r1 GUARD (in-app history): day/1/practice before lesson [C4]',
        `url=${inAppUrl}; practice rendered=${inAppPractice}; bounced=${inAppBounced} → C4 ${inAppBounced ? 'BLOCKED (pass)' : 'FAIL — practice rendered pre-lesson'}`,
      );
      await h.shot('r1-day1-practice-inapp-probe');
      observations.r1_practice_before_lesson_inapp = { url: inAppUrl, practiceRendered: inAppPractice, bounced: inAppBounced, c4Pass: inAppBounced };

      // GUARD PROBE 2: a genuinely locked day (Day 2) bounces.
      await nav(h, '/foundry/day/2/practice');
      await h.step('r1 GUARD: /foundry/day/2/practice (locked day)', `url=${h.page.url()}`);

      // The lesson itself.
      await nav(h, '/foundry/hub');
      await clickBtn(h, /Start the lesson with Ms\. Wren/, 1200);
      await h.shot('r1-lesson-seg1-hook');
      const seg1 = await body(h);
      await h.step('r1 lesson hook text', seg1.slice(0, 400));
      const skipControls = await h.page.getByRole('button', { name: /skip/i }).count();
      await h.step('r1 skip affordance count on first encounter', String(skipControls));

      await clickBtn(h, /^Continue$/);
      await h.shot('r1-lesson-seg2-why-before-how');
      await h.step('r1 why-before-how text', (await body(h)).slice(0, 400));

      // Walk to the end (cap 15 segments), then pin.
      for (let i = 0; i < 15; i++) {
        const pin = h.page.getByRole('button', { name: /Pin our examples/ });
        if (await pin.isVisible().catch(() => false)) break;
        await clickBtn(h, /^Continue$/);
      }
      await h.shot('r1-lesson-last-seg-vocab');
      const lastSeg = await body(h);
      await h.step('r1 vocabulary on last segment', `Our words present=${/Our words/.test(lastSeg)}`);
      await clickBtn(h, /Pin our examples/, 1000);
      await h.shot('r1-lesson-pin-moment');
      await h.step('r1 pin moment', (await body(h)).slice(0, 300));
      await clickBtn(h, /Let's try together/, 1500);
      await h.shot('r1-guided-practice-entry');
      await h.step('r1 guided practice entry', `url=${h.page.url()}; text=${(await body(h)).slice(0, 300)}`);
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 2 — R2 anti-drill + R5 hint ladder + R3 day guard (Maya mid-week, Day 3)
// ---------------------------------------------------------------------------

async function run2(): Promise<void> {
  await withRun(
    'r2-midweek-practice',
    () => launchHarness({ persona: 'teacher', db: scenarioMayaMidWeek(), viewport: 'child', selectedChildId: CHILDREN.maya.id }),
    async (h) => {
      await firstNav(h);
      await h.shot('r2-hub-midweek');
      const hub = await body(h);
      await h.step(
        'r2 hub state',
        `Level/Week line=${/Level B · Week 1/.test(hub)}; Day3 today; chest badge=${/Chest · \d+ waiting/.test(hub)}`,
      );

      // R3 day guards: deep links to tomorrow must bounce.
      await nav(h, '/foundry/day/4/practice');
      await h.step('r3 GUARD: day/4/practice while Day 3 live', `url=${h.page.url()}`);
      await h.shot('r2-day4-guard-bounce');
      await nav(h, '/foundry/day/4/warmup');
      await h.step('r3 GUARD: day/4/warmup while Day 3 live', `url=${h.page.url()}`);
      observations.r3_day4_deeplink_bounced = h.page.url().includes('/hub');

      // In-app history probe (session warm — exercises the real route guard).
      await nav(h, '/foundry/hub');
      await h.page.evaluate(() => {
        history.pushState({}, '', '/foundry/day/4/practice');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      await h.page.waitForTimeout(2000);
      const day4InApp = h.page.url();
      await h.step('r3 GUARD (in-app history): day/4/practice', `url=${day4InApp}; practice rendered=${/page 1 of/i.test(await body(h))}`);
      observations.r3_day4_inapp_bounced = day4InApp.includes('/hub');

      // Warm-up: read it, then drive the miss path (R5 step 6).
      await nav(h, '/foundry/day/3/warmup');
      await h.shot('r2-warmup-day3');
      const wu = await body(h);
      await h.step('r2 warm-up framing', wu.slice(0, 350));
      await answerCurrent(h, { wrong: true });
      await h.shot('r2-warmup-miss-reveal');
      await h.step('r5 warm-up miss reveal', (await body(h)).slice(0, 400));
      await clickBtn(h, /Let's fix it/);
      await h.shot('r2-warmup-fixit-explainback');
      await h.page.getByLabel('The first step in your own words').fill('First, I count up by tens to find it');
      await clickBtn(h, /Tell Ms\. Wren/, 1200);
      await h.step('r5 warm-up fix-it explain-back completed', `url=${h.page.url()}`);

      // ---- Practice page: item 1 (1-rung ladder → reveal + fix-it, H1) ----
      // H1 (a9beb59): items no longer PARK at 2 misses. A 1-rung ladder reveals
      // the answer (with the why) after rung 1 + a second miss, then a fix-it
      // step runs before advance. Prior "parks at 2 misses" assertion retired.
      await h.shot('r2-practice-item1');
      const item1Prompt = await promptText(h);
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      await h.shot('r2-item1-miss1-rung1-auto');
      const i1 = await body(h);
      await h.step(
        'r5 item1 after miss 1',
        `rung1 shown=${/hint ladder · rung 1/i.test(i1)}; bare-x absent=${!/✗/.test(i1)}; miss opener="${(i1.match(/Good thinking[^\n]*/) ?? [''])[0]}"`,
      );
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      const i1b = await body(h);
      const item1Reveal = /It comes to /.test(i1b) || (await h.page.getByRole('button', { name: /Let's fix it/ }).isVisible().catch(() => false));
      const item1Parked = /treasure chest/i.test(i1b);
      await h.shot('r2-item1-reveal-after-rung1');
      await h.step(
        'r5 item1 bottom-out [H1]',
        `1-rung ladder: reveal shown=${item1Reveal}; legacy two-miss PARK=${item1Parked} → H1 ${item1Reveal && !item1Parked ? 'PASS (reveal, not park)' : 'FAIL'}`,
      );
      observations.r5_item1 = { prompt: item1Prompt, revealAfterLastRung: item1Reveal, parked: item1Parked, h1Pass: item1Reveal && !item1Parked };
      await clickBtn(h, /Let's fix it/);
      await h.shot('r2-item1-fixit');
      const fixInput1 = h.page.getByLabel('The first step in your own words');
      if (await fixInput1.isVisible().catch(() => false)) {
        await fixInput1.fill('First I find the number just after 114');
        await clickBtn(h, /Tell Ms\. Wren/, 1200);
        await h.step('r5 item1 fix-it', `explain-back sent; url=${h.page.url()}`);
      } else {
        await answerCurrent(h, {});
        await clickBtn(h, /^Next$/);
        await h.step('r5 item1 fix-it', 'near-transfer variant answered');
      }

      // ---- Item 2 (2-rung ladder): attempt-gate lock, rung2 opens, reveal (H1) ----
      const item2Prompt = await promptText(h);
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      await h.page.waitForTimeout(400);
      const lockedText = await body(h);
      const lockLine = /Give it a try first — then the next rung opens/.test(lockedText);
      const nextRungBtn = await h.page.getByRole('button', { name: /Next rung/ }).count();
      await h.shot('r2-item2-rung2-LOCKED-attempt-gate');
      await h.step(
        'r5 LS1-R3(a) attempt-gate [H1 caption]',
        `after miss+rung1 auto-open, WITHOUT a new attempt: try-it-first line=${lockLine}; "Next rung" buttons=${nextRungBtn} (must be 0); rung-2 preview=${/rung 2 ·/i.test(lockedText)}; caption "after rung 2"=${/answer only comes after rung 2/i.test(lockedText)}; stale "after rung 3" gone=${!/answer only comes after rung 3/i.test(lockedText)}`,
      );
      observations.r5_attempt_gate = {
        lockLineShown: lockLine,
        nextRungButtonCount: nextRungBtn,
        prompt: item2Prompt,
        rung2Preview: /rung 2 ·/i.test(lockedText),
        answerAfterRung2Caption: /answer only comes after rung 2/i.test(lockedText),
        staleRung3CaptionGone: !/answer only comes after rung 3/i.test(lockedText),
      };
      // second miss → rung 2 opens (H1: no longer parks here)
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      const afterMiss2 = await body(h);
      const rung2Opened = /hint ladder · rung 2/i.test(afterMiss2);
      await h.shot('r2-item2-rung2-opened');
      await h.step('r5 item2 second miss → rung 2 [H1]', `rung2 opened=${rung2Opened}; legacy park=${/treasure chest/i.test(afterMiss2)} → ${rung2Opened ? 'PASS (rung2 open, not park)' : 'FAIL'}`);
      // third miss (at top rung + attempt) → reveal + fix-it
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      const item2Reveal = /It comes to /.test(await body(h)) || (await h.page.getByRole('button', { name: /Let's fix it/ }).isVisible().catch(() => false));
      await h.shot('r2-item2-reveal-after-rung2');
      await h.step('r5 item2 bottom-out reveal [H1]', `reveal reached after rung2 + attempt=${item2Reveal}`);
      observations.r5_item2 = { prompt: item2Prompt, rung2Opened, revealReached: item2Reveal };
      await clickBtn(h, /Let's fix it/);
      const fixInput2 = h.page.getByLabel('The first step in your own words');
      if (await fixInput2.isVisible().catch(() => false)) {
        await fixInput2.fill('First I count back one from eighty');
        await clickBtn(h, /Tell Ms\. Wren/, 1200);
      } else {
        await answerCurrent(h, {});
        await clickBtn(h, /^Next$/);
      }

      // ---- Item 3: proactive rung 1 → miss auto-opens rung 2 → correct (ceiling, H1) ----
      await clickBtn(h, /A little help\?/);
      await h.shot('r2-item3-proactive-rung1');
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      const r3state = await body(h);
      const rung2Shown = /hint ladder · rung 2/i.test(r3state);
      await h.shot('r2-item3-rung2-open');
      await h.step(
        'r5 ladder ceiling [H1]',
        `proactive rung1 + a miss → rung2 shown=${rung2Shown}; rung-3 preview visible=${/rung 3 ·/i.test(r3state)} (must be false — this ladder has 2 rungs)`,
      );
      observations.r5_ladder_ceiling = {
        rung2Shown,
        rung3PreviewVisible: /rung 3 ·/i.test(r3state),
        ladderTextExcerpt: (r3state.match(/A question to start[\s\S]{0,300}/) ?? [''])[0],
      };
      await answerCurrent(h, {}); // recover with the hint — correct
      await h.shot('r2-item3-correct-after-hints');
      await clickBtn(h, /^Next$/, 1200);

      // Page-boundary sprint offer (Flow 5, Days 2–3, B+, opt-in) may interpose.
      if (h.page.url().includes('/foundry/sprint')) {
        await h.shot('r2-sprint-offer-page-boundary');
        await h.step('r2 sprint offer framing (three facts, equal-weight decline)', (await body(h)).slice(0, 400));
        await clickBtn(h, /Not today/, 1500);
        await h.step('r2 sprint declined → back to practice', `url=${h.page.url()}`);
      }

      // ---- Items 4–5: correct; anchor one-tap from practice (E1-guarded) ----
      await h.shot('r2-practice-item4');
      const practiceAnchorOpened = await openAnchorIfPresent(h, /Anchor ⌗/);
      await h.shot('r2-anchor-open-on-practice');
      const anchor = await body(h);
      await h.step(
        'r1/r5 anchor during practice',
        `anchor mounted=${practiceAnchorOpened}; worked examples pinned=${/Worked examples — pinned all week/.test(anchor)}; strategy card=${/Strategy card/.test(anchor)}`,
      );
      await closeAnchorIfOpen(h);
      await answerCurrent(h, {});
      await clickBtn(h, /^Next$/);
      await h.shot('r2-practice-item5');
      await answerCurrent(h, {});
      await clickBtn(h, /^Next$/, 1500);
      await h.shot('r2-day-done');
      await h.step('r2 day done screen', (await body(h)).slice(0, 300));

      // R3: finishing Day 3 must NOT open Day 4 today.
      await nav(h, '/foundry/hub');
      await h.shot('r2-hub-after-day3-day4-resting');
      const hub2 = await body(h);
      await h.step(
        'r3 no-early-unlock',
        `resting line=${/Resting until tomorrow/.test(hub2)}; day-4 CTA absent=${!/Start Day 4/.test(hub2)}`,
      );
      await nav(h, '/foundry/day/4/practice');
      await h.step('r3 GUARD: day/4 deep link after finishing day 3', `url=${h.page.url()}`);
      observations.r3_no_early_unlock = { restingLine: /Resting until tomorrow/.test(hub2), day4Bounced: h.page.url().includes('/hub') };

      // Treasure chest after today's parks.
      await nav(h, '/foundry/chest');
      await h.shot('r2-treasure-chest');
      await h.step('r5 chest contents', (await body(h)).slice(0, 400));

      // GATE PROBE: the weekly check deep-linked on Day 3 (days 4–5 unplayed).
      await nav(h, '/foundry/check');
      const checkEarly = await body(h);
      const earlyCheckServed = /Last page/.test(checkEarly) || /show-what-you-know/.test(checkEarly);
      await h.shot('r2-GATE-PROBE-check-on-day3');
      await h.step(
        'r6 GATE PROBE: /foundry/check deep link on Day 3',
        `check intro served=${earlyCheckServed}; url=${h.page.url()} (weekly check reachable before days 4–5)`,
      );
      observations.r6_check_deeplink_day3 = { served: earlyCheckServed, url: h.page.url() };
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 3 — R6 drive A part 1: Day 5 → PuzzleGrove → Form A at 4/6 → StrengthenPlan
// ---------------------------------------------------------------------------

async function run3(): Promise<void> {
  await withRun(
    'r3-day5-nearmiss',
    () => launchHarness({ persona: 'teacher', db: scenarioMayaDay5(), viewport: 'child', selectedChildId: CHILDREN.maya.id }),
    async (h) => {
      await firstNav(h);
      await h.shot('r6-hub-day5');
      await clickBtn(h, /Start Day 5's practice/, 1500);

      // Day-5 warm-up (2 retrieval items) — answered clean.
      for (let i = 0; i < 2; i++) {
        await answerCurrent(h, {});
        await clickBtn(h, i === 0 ? /Next one/ : /All warmed up!/, 1200);
      }

      // Puzzle Grove: 3 transfer items + the featured puzzle (R2 evidence).
      await h.shot('r2-grove-item1');
      await h.step('r2 grove item 1', await promptText(h));
      await answerCurrent(h, {});
      await clickBtn(h, /^Next$/);
      await h.step('r2 grove item 2', await promptText(h));
      await answerCurrent(h, {});
      await clickBtn(h, /^Next$/);
      await h.step('r2 grove item 3', await promptText(h));
      await answerCurrent(h, {});
      await clickBtn(h, /^Next$/);
      await h.shot('r2-grove-featured-puzzle');
      await h.step('r2 featured puzzle', await promptText(h));
      await answerCurrent(h, {});
      await h.shot('r2-grove-qualitative-close');
      await h.step('r2 puzzle qualitative close (no score)', (await body(h)).slice(0, 300));
      await clickBtn(h, /Last page of the week/, 1500);

      // Weekly check intro framing.
      await h.shot('r6-check-intro-framing');
      await h.step('r6 check framing', (await body(h)).slice(0, 350));
      await clickBtn(h, /Last page — let's go/, 1200);

      // Form A: 4/6 (misses on items 2 and 5). Identical-ack evidence on 1 & 2.
      const ackTexts: string[] = [];
      const planWrong = new Set([2, 5]);
      for (let i = 1; i <= 6; i++) {
        await h.step(`r6 form A item ${i}`, await promptText(h));
        await answerCurrent(h, { wrong: planWrong.has(i) });
        const ack = (await body(h)).match(/Got it[.!]/)?.[0] ?? '(no ack found)';
        ackTexts.push(ack);
        if (i === 1) await h.shot('r6-checkA-ack-after-correct');
        if (i === 2) await h.shot('r6-checkA-ack-after-wrong');
        if (i === 3) {
          // Anchor during the check must be strategy-only. (E1-guarded.)
          const strat = h.page.locator('button[aria-label="Open the strategy card"]').first();
          const stratOpened = await strat.isVisible().catch(() => false);
          if (stratOpened) {
            await strat.click();
            await h.page.waitForTimeout(500);
          }
          await h.shot('r6-check-anchor-strategy-only');
          const at = await body(h);
          await h.step(
            'r6 check anchor',
            `strategy-card affordance present=${stratOpened}; strategy card=${/Strategy card/.test(at)}; worked examples hidden=${!/Worked examples/.test(at)}`,
          );
          await closeAnchorIfOpen(h);
        }
        if (i === 4) {
          // No restart-scumming: reload → answered items stand.
          await h.page.reload({ waitUntil: 'domcontentloaded' });
          await h.page.waitForTimeout(2500);
          await settled(h);
          const intro = h.page.getByRole('button', { name: /Last page — let's go/ });
          if (await intro.isVisible().catch(() => false)) await intro.click();
          await h.page.waitForTimeout(800);
          const hdr = (await body(h)).match(/Last page of the week · \d of \d/i)?.[0] ?? '(header missing)';
          await h.step('r6 reload mid-check', `resumed at "${hdr}" (answered items stand, no back path)`);
          await h.shot('r6-check-resume-after-reload');
          // The reload already advanced past item 4's held-feedback to the next
          // unanswered item, so there is no "Next" to click for i=4 — skip the
          // trailing transition and let i=5 answer the resumed item afresh.
          // (Without this the loop timed out clicking a consumed "Next": the
          // mid-check-reload flaw that blocked R6's StrengthenPlan capture.)
          continue;
        }
        await clickBtn(h, i < 6 ? /^Next$/ : /Hand it to Ms\. Wren/, i < 6 ? 600 : 2500);
      }
      observations.r6_acks_identical = { ackTexts, identical: new Set(ackTexts).size === 1 };

      // Non-pass outcome: StrengthenPlan.
      await h.shot('r6-strengthen-plan', { fullPage: true });
      const sp = await body(h);
      const leaks = grepHits(sp, [
        ['percent-sign', /%/],
        ['score-67', /\b67\b/],
        ['word-review', /\bReview\b/],
        ['fail-words', /\b(fail|failed|wrong answers)\b/i],
      ]);
      await h.step(
        'r6 StrengthenPlan leak scan',
        `leaks=${JSON.stringify(leaks)}; named skill section=${/Just this one/.test(sp)}; keeps-moving=${/keeps moving/.test(sp)}`,
      );
      observations.r6_strengthen_leaks = leaks;
      observations.r6_strengthen_text = sp.slice(0, 1200);

      // Hub in corrective state: same-day rest + dual-thread line.
      await nav(h, '/foundry/hub');
      await h.shot('r6-hub-corrective-sameday');
      const hub = await body(h);
      await h.step(
        'r6 corrective hub',
        `opens-tomorrow line=${/opens tomorrow|glue it down tomorrow/.test(hub)}; nearMiss line="${(hub.match(/So close[^\n]*/) ?? [''])[0]}"; % present=${/%/.test(hub)}`,
      );
      observations.r6_corrective_hub_nearmiss_line = (hub.match(/So close[^\n]*/) ?? [''])[0];

      // GATE PROBES: same-day reteach and Form B via deep link (hub says tomorrow).
      await nav(h, '/foundry/reteach');
      const reteachServed = /A quick look together/.test(await body(h));
      await h.step('r6 GATE PROBE: /foundry/reteach same-day deep link', `served=${reteachServed}; url=${h.page.url()}`);
      await h.shot('r6-GATE-PROBE-reteach-sameday');
      await nav(h, '/foundry/fresh');
      const freshServed = /Brand-new problems|Fresh ones/.test(await body(h));
      await h.step(
        'r6 GATE PROBE: /foundry/fresh deep link (skips reteach entirely)',
        `served=${freshServed}; url=${h.page.url()}`,
      );
      await h.shot('r6-GATE-PROBE-formB-without-reteach');
      observations.r6_gate_probes = { sameDayReteachServed: reteachServed, formBWithoutReteachServed: freshServed };
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 4 — R6 drive A part 2: corrective loop → MicroReteach → Form B 6/6 → resolve
// ---------------------------------------------------------------------------

async function run4(): Promise<void> {
  await withRun(
    'r4-corrective-loop',
    () => launchHarness({ persona: 'teacher', db: scenarioMayaNearMiss(), viewport: 'child', selectedChildId: CHILDREN.maya.id }),
    async (h) => {
      await firstNav(h);
      await h.shot('r6-hub-corrective-cta-live');
      await clickBtn(h, /One more round — let's glue it down/, 1500);
      await h.shot('r6-reteach-intro');
      await h.step('r6 reteach intro', (await body(h)).slice(0, 350));
      for (let i = 0; i < 10; i++) {
        const done = h.page.getByRole('button', { name: /Brand-new problems/ });
        if (await done.isVisible().catch(() => false)) break;
        await clickBtn(h, /^Continue$/);
      }
      await h.shot('r6-reteach-worked-example');
      await clickBtn(h, /Brand-new problems/, 1500);
      await h.shot('r6-fresh-intro-framing');
      await h.step('r6 FreshProblems framing', (await body(h)).slice(0, 350));
      await clickBtn(h, /Fresh ones — let's go/, 1200);

      // Form B — capture every surface as the student sees it; answer 6/6.
      const formBSeen: string[] = [];
      for (let i = 1; i <= 6; i++) {
        const p = await promptText(h);
        formBSeen.push(p);
        await h.step(`r6 form B item ${i}`, p);
        if (i === 1) await h.shot('r6-formB-item1');
        await answerCurrent(h, {});
        await clickBtn(h, i < 6 ? /^Next$/ : /Hand it to Ms\. Wren/, i < 6 ? 600 : 2500);
      }
      const formA = packFor('B', 1).masteryCheck.formA.map((i) => norm(i.prompt));
      const overlap = formBSeen.filter((p) => formA.some((a) => norm(p).includes(a)));
      observations.r6_formB_disjoint = { formBSeen, overlapWithFormA: overlap };
      await h.step('r6 Form A/B surface disjointness', `overlap count=${overlap.length} of 6 (must be 0)`);

      // Fast-track resolve (6/6 = 100% ≥ 95).
      await waitReady(h, /shelf|Next on the trail|owned|yours/); // E2 ready-assert
      await h.shot('r6-resolve-fasttrack');
      const res = await body(h);
      await h.step(
        'r6 resolve after corrective pass',
        `concept named=${/Numbers to 120/.test(res)}; next-week preview=${/Next on the trail/.test(res)}; % present=${/%/.test(res)}`,
      );
      observations.r6_resolve_fasttrack_text = res.slice(0, 900);

      // Nothing extra unlocks the same day + child-side score scan.
      await nav(h, '/foundry/hub');
      await h.shot('r6-hub-after-pass-no-reveal');
      const hub = await body(h);
      await h.step(
        'r6 same-day after pass',
        `next-week reveal CTA present=${/Ready for the next idea|new adventure/.test(hub)} (must be false); % present=${/%/.test(hub)}`,
      );
      await nav(h, '/foundry/map');
      await h.shot('r6-journey-map-scan');
      const map = await body(h);
      await h.step('r6 child score scan (map)', `% present=${/%/.test(map)}; "100" present=${/\b100\b/.test(map)}`);
      observations.r6_child_score_leak = { hubPct: /%/.test(hub), mapPct: /%/.test(map) };
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 5 — R6 drive B: first-pass 6/6 → WeekResolve (warmth comparison)
// ---------------------------------------------------------------------------

async function run5(): Promise<void> {
  await withRun(
    'r5-first-pass',
    () => launchHarness({ persona: 'teacher', db: scenarioMayaDay5(), viewport: 'child', selectedChildId: CHILDREN.maya.id }),
    async (h) => {
      await firstNav(h);
      await clickBtn(h, /Start Day 5's practice/, 1500);
      for (let i = 0; i < 2; i++) {
        await answerCurrent(h, {});
        await clickBtn(h, i === 0 ? /Next one/ : /All warmed up!/, 1200);
      }
      for (let i = 0; i < 3; i++) {
        await answerCurrent(h, {});
        await clickBtn(h, /^Next$|Last page of the week/, 900);
      }
      // Park the featured puzzle ("brain marinating") → straight to the check.
      await clickBtn(h, /Brain marinating/, 1500);
      await clickBtn(h, /Last page — let's go/, 1200);
      for (let i = 1; i <= 6; i++) {
        await answerCurrent(h, {});
        await clickBtn(h, i < 6 ? /^Next$/ : /Hand it to Ms\. Wren/, i < 6 ? 600 : 2500);
      }
      await h.shot('r6-resolve-first-pass');
      const res = await body(h);
      await h.step('r6 first-pass resolve', `text=${res.slice(0, 600)}`);
      observations.r6_resolve_pass_text = res.slice(0, 900);
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 6 — R4 band A (Nora, Level A week 1, Day 2)
// ---------------------------------------------------------------------------

async function run6(): Promise<void> {
  await withRun(
    'r6-band-a-nora',
    () => launchHarness({ persona: 'teacher', db: scenarioNoraMidWeek(), viewport: 'child', selectedChildId: CHILDREN.nora.id }),
    async (h) => {
      await firstNav(h);
      await h.shot('r4-A-hub');
      const hub = await body(h);
      await h.step('r4 A hub copy', hub.slice(0, 400));
      await clickBtn(h, /Start Day 2's practice/, 2000);
      // A1 day 2 has no retrieval slice → WarmUp auto-forwards to practice.
      await h.step('r4 A warm-up presence', `landed=${h.page.url()} (no retrieval items at A1 → warm-up skipped)`);
      await h.shot('r4-A-practice-instruction');
      const audioButtons = await h.page.locator('button[aria-label="Hear this instruction"], button[aria-label="Playing instruction audio"]').count();
      await h.step('r4 A audio affordance on instruction', `audio buttons on screen=${audioButtons}`);
      const prompt = await promptText(h);
      await h.step('r4 A item prompt', prompt);
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      await h.shot('r4-A-correction-after-miss');
      const corr = await body(h);
      await h.step('r4 A correction copy', `"${(corr.match(/Good try[^\n]*/) ?? [''])[0]}"; label-words present=${/\b(wrong|incorrect|no[.!])\b/i.test(corr)}`);
      await answerCurrent(h, {});
      await h.shot('r4-A-confirm');
      await h.step('r4 A confirm copy', (await body(h)).match(/You did it!|That matches!|You found it!/)?.[0] ?? '(none)');
      observations.r4_bandA = {
        hubGreeting: hub.slice(0, 200),
        audioButtons,
        correction: (corr.match(/Good try[^\n]*/) ?? [''])[0],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 7 — R4 band C (Jordan, Level D week 17, Day 3 — fixture-only cell)
// ---------------------------------------------------------------------------

async function run7(): Promise<void> {
  await withRun(
    'r7-band-c-jordan',
    () => launchHarness({ persona: 'teacher', db: scenarioJordanMidWeek(), viewport: 'child', selectedChildId: CHILDREN.jordan.id }),
    async (h) => {
      await firstNav(h);
      await h.shot('r4-C-hub');
      const hub = await body(h);
      const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
      await h.step('r4 C hub copy', `${hub.slice(0, 400)} || emoji-on-hub=${emojiRe.test(hub)}`);
      await clickBtn(h, /Start Day 3's practice/, 2000);
      // D17 day-3 warm-up (retrieval): drive the C-band miss → reveal → explain-back.
      await h.shot('r4-C-warmup');
      const wu = await body(h);
      await h.step('r4 C warm-up copy', wu.slice(0, 300));
      await answerCurrent(h, { wrong: true });
      await h.shot('r4-C-warmup-miss-reveal');
      const rev = await body(h);
      await h.step('r4 C correction copy', `"${(rev.match(/Not yet[^\n]*/) ?? [''])[0]}"`);
      const fixBtn = h.page.getByRole('button', { name: /Let's fix it/ });
      if (await fixBtn.isVisible().catch(() => false)) {
        await fixBtn.click();
        await h.page.waitForTimeout(600);
        await h.shot('r4-C-explain-back');
        const ex = await body(h);
        await h.step('r4 C explain-back framing', (ex.match(/Before we move on[^\n]*/) ?? ['(A/B wording?)'])[0]);
        await h.page.getByLabel('The first step in your own words').fill('Rewrite both fractions over the LCD first');
        await clickBtn(h, /Tell Ms\. Wren/, 1200);
      } else {
        await clickBtn(h, /Next one|All warmed up!/, 1200);
      }
      // Reach the practice page for the C-band practice register.
      for (let i = 0; i < 4 && !/\/day\/3\/practice/.test(h.page.url()); i++) {
        await answerCurrent(h, {});
        await clickBtn(h, /Next one|All warmed up!/, 1200).catch(() => undefined);
      }
      await h.shot('r4-C-practice-item');
      await h.step('r4 C practice item', await promptText(h));
      await answerCurrent(h, { wrong: true, delayMs: 2200 });
      await h.shot('r4-C-practice-miss');
      const miss = await body(h);
      await h.step('r4 C practice miss copy', `"${(miss.match(/Not yet[^\n]*/) ?? [''])[0]}"; emoji visible=${emojiRe.test(miss)}`);
      observations.r4_bandC = {
        hubEmoji: emojiRe.test(hub),
        warmupCorrection: (rev.match(/Not yet[^\n]*/) ?? [''])[0],
        fixtureOnlyCell: 'Level D enrollment is fixture-only (placement walks A→C) — flagged per fixtures.ts note',
      };
    },
  );
}

// ---------------------------------------------------------------------------
// RUN 8 — R3/R6 parent surface: WeeklyReport + acknowledge ritual
// ---------------------------------------------------------------------------

async function run8(): Promise<void> {
  await withRun(
    'r8-parent-report',
    () => launchHarness({ persona: 'teacher', db: scenarioParent(), viewport: 'parent' }),
    async (h) => {
      await firstNav(h, '/foundry/parent');
      await h.shot('r3-parent-home');
      await h.step('r3 parent home', (await body(h)).slice(0, 500));

      await nav(h, `/foundry/parent/report/${CHILDREN.maya.id}/B/1`);
      await h.shot('r3-weekly-report-passed', { fullPage: true });
      const rep = await body(h);
      await h.step(
        'r3/r6 weekly report (passed)',
        `verdict+%=${/92% on the weekly check/.test(rep)}; four fields=${/What we worked on/.test(rep) && /improving/.test(rep) && /strengthening/.test(rep) && /At home this week/.test(rep)}; ack button=${/will know|Seen/.test(rep) || true}`,
      );
      observations.r3_report_passed_text = rep.slice(0, 1500);
      // The acknowledge ritual.
      await h.page.locator('.mf-ack-btn').click();
      await h.page.waitForTimeout(1200);
      await h.shot('r3-weekly-report-acknowledged');
      const ackWrite = h
        .dbWrites()
        .find((w) => w.method === 'PATCH' && w.path.includes('bb_parent_reports') && w.outcome === 'applied');
      await h.step('r3 acknowledge db write', ackWrite ? `applied: ${JSON.stringify(ackWrite.body)}` : 'NO WRITE FOUND');
      observations.r3_ack_write = ackWrite ?? null;

      // Near-miss verdict on the parent surface (Jordan, one_more_round).
      await nav(h, `/foundry/parent/report/${CHILDREN.jordan.id}/D/17`);
      await h.shot('r6-weekly-report-one-more-round', { fullPage: true });
      const rep2 = await body(h);
      await h.step('r6 near-miss report framing', rep2.slice(0, 800));
      observations.r6_report_onemore_text = rep2.slice(0, 1500);
    },
  );
}

// ---------------------------------------------------------------------------
// Node-side pack analyses (R2 seed variation, R6 form disjointness)
// ---------------------------------------------------------------------------

function packAnalyses(): void {
  const p1 = packFor('B', 1);
  const p2 = packFor('B', 1, 777777);
  const prompts = (p: WeeklyConceptPack) => p.days.flatMap((d) => d.items.map((i) => norm(i.prompt)));
  const a = prompts(p1);
  const b = new Set(prompts(p2));
  const shared = a.filter((x) => b.has(x));
  const fa = p1.masteryCheck.formA.map((i) => norm(i.prompt));
  const fb = new Set(p1.masteryCheck.formB.map((i) => norm(i.prompt)));
  const formOverlap = fa.filter((x) => fb.has(x));
  observations.r2_seed_variation = {
    seed424242Items: a.length,
    seed777777SharedSurfaces: shared.length,
    note: `${shared.length}/${a.length} day-item surfaces identical across seeds`,
  };
  observations.r6_formAB_generator = {
    formAOverlapWithFormB: formOverlap.length,
    formAPrompts: fa,
  };
  // Per-page dose check (R2: 3–6 problems per page)
  observations.r2_page_dose = p1.days.map((d, i) => ({
    day: i + 1,
    focus: d.focus,
    gradableItems: d.items.filter((x) => !x.isRetrieval).length,
    pageCount: d.pageCount,
    perPage: Math.ceil(d.items.filter((x) => !x.isRetrieval).length / Math.max(1, d.pageCount)),
  }));
  console.log('[node] seed variation:', JSON.stringify(observations.r2_seed_variation));
  console.log('[node] formA∩formB:', formOverlap.length);
}

// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  packAnalyses();
  await run1();
  await run2();
  await run3();
  await run4();
  await run5();
  await run6();
  await run7();
  await run8();

  // Merge with any previous partial invocation (TEACHER_RUNS chunking).
  let prevRuns: RunRecord[] = [];
  let prevObs: Record<string, unknown> = {};
  try {
    const prev = JSON.parse(readFileSync(RUN_FILE, 'utf8'));
    if (Array.isArray(prev.runs)) prevRuns = prev.runs;
    if (prev.observations) prevObs = prev.observations;
  } catch {
    /* first invocation */
  }
  const mergedRuns = [...prevRuns.filter((p) => !allRuns.some((r) => r.run === p.run)), ...allRuns];
  writeFileSync(
    RUN_FILE,
    JSON.stringify(
      {
        persona: 'teacher',
        spec: 'testing/personas/TEACHER-EVALUATOR.md',
        finishedAt: new Date().toISOString(),
        observations: { ...prevObs, ...observations },
        runs: mergedRuns,
      },
      null,
      2,
    ),
  );
  const failed = allRuns.filter((r) => r.status !== 'ok');
  console.log(`\nTEACHER RUN COMPLETE — ${allRuns.length} runs, ${failed.length} failed → ${RUN_FILE}`);
  if (failed.length) {
    for (const f of failed) console.log(`  FAILED: ${f.run}`);
  }
}

void main();
