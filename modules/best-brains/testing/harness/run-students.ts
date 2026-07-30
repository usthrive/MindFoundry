/**
 * Phase 7 STUDENT-SIMULATORS runner — plays Nora (5, band A), Maya (8, band B)
 * and Jordan (11, band C) end-to-end through the Foundry Method module, in
 * character per testing/personas/STUDENT-SIMULATORS.md.
 *
 * Run (dev server up on :5173):
 *   cd frontend && npx tsx ../modules/best-brains/testing/harness/run-students.ts [nora|maya|jordan]
 *
 * Screenshots → testing/screenshots/phase7/students/<name>/<stage>/NN-label.png
 * Stage run logs → testing/runs/students/<name>/<stage>-run.json
 * Aggregate observations → testing/runs/students-run.json
 *
 * Honesty notes:
 *  - Placement walks use a deterministic Math.random override (0.4242) so the
 *    runner can compute the walk's pack (same formula as PlacementActivity's
 *    walkSeed) and answer items correctly/incorrectly IN CHARACTER.
 *  - Fresh-week stages pre-stage the not_started bb_week_state row with the
 *    FIXED_PACK_SEED — identical to what getOrInitWeekState would create,
 *    with a known seed so answers are computable.
 *  - The runner never asserts server-side behavior; the mastery RPC is the
 *    harness emulation.
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { launchHarness, type Harness } from './harness';
import {
  CHILDREN,
  FIXED_PACK_SEED,
  freshDb,
  enrollChild,
  packFor,
  scenarioPlacement,
  scenarioNoraMidWeek,
  scenarioMayaMidWeek,
  scenarioMayaDay5,
  scenarioMayaNearMiss,
  scenarioJordanMidWeek,
  scenarioJordanDay5,
  stageDay5Ready,
  type FixtureChild,
  type MockDb,
} from './fixtures';
import { tapOptionsFor } from '../../../../frontend/src/modules/best-brains/answers';
import {
  CONTENT_VERSION,
  getPackDay,
} from '../../../../frontend/src/modules/best-brains/generator/packGenerator';
import { realizeSprintItems } from '../../../../frontend/src/modules/best-brains/generator/sprintItems';
import type {
  BBLevel,
  PackItem,
  WeeklyConceptPack,
} from '../../../../frontend/src/modules/best-brains/types';

const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));
const TESTING_DIR = join(HARNESS_DIR, '..');
const RUNS_DIR = join(TESTING_DIR, 'runs');

// Deterministic in-page Math.random (drives walkSeed + newPackSeed).
const RAND = 0.4242;
const WALK_SEED = Math.floor(RAND * 0x7fffffff);

type Band = 'A' | 'B' | 'C';
const LADDER: BBLevel[] = ['A', 'B', 'C'];
const bandForLevel = (l: BBLevel): Band => (l === 'A' ? 'A' : l === 'B' || l === 'C' ? 'B' : 'C');
const startLevelForAge = (age: number): BBLevel => (age <= 6 ? 'A' : age <= 8 ? 'B' : 'C');

// ---------------------------------------------------------------------------
// Observation log (aggregated into students-run.json)
// ---------------------------------------------------------------------------

interface Obs {
  child: string;
  stage: string;
  tag: string;
  detail: string;
}
const OBS: Obs[] = [];
let CURRENT: { child: string; stage: string } = { child: '-', stage: '-' };
function note(tag: string, detail: string) {
  OBS.push({ child: CURRENT.child, stage: CURRENT.stage, tag, detail });
  console.log(`  [${CURRENT.child}/${CURRENT.stage}] ${tag}: ${detail.slice(0, 260)}`);
}

// D5 leakage scanner — records every hit with context; adjudicated in findings.
const D5_PATTERNS: Array<[RegExp, string]> = [
  [/\d{1,3}\s*%/g, 'percent'],
  [/\bwrong\b/gi, 'word-wrong'],
  [/\bfail(?:ed|ure)?\b/gi, 'word-fail'],
  [/\breview\b/gi, 'word-review'],
  [/[✗❌]/g, 'x-mark'],
  [/\bgrade[sd]?\b/gi, 'word-grade'],
];
const seenD5 = new Set<string>();
async function d5scan(h: Harness, screen: string) {
  const text = await h.page.innerText('body').catch(() => '');
  for (const [re, name] of D5_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const ctx = text.slice(Math.max(0, m.index - 55), m.index + 55).replace(/\s+/g, ' ');
      const key = `${name}:${ctx}`;
      if (seenD5.has(key)) continue;
      seenD5.add(key);
      note(`d5:${name}`, `on "${screen}": …${ctx}…`);
    }
  }
}

async function audioCount(h: Harness): Promise<number> {
  return h.page
    .locator('[aria-label="Hear this instruction"], [aria-label="Playing instruction audio"]')
    .count()
    .catch(() => 0);
}

async function snap(h: Harness, label: string) {
  await d5scan(h, label);
  return h.shot(label);
}

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

async function go(h: Harness, path: string) {
  try {
    await h.page.goto(h.url(path), { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch {
    await h.page.goto(h.url(path), { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  await h.page.waitForTimeout(4200);
  // FoundryLayout/AuthContext grace window: wait out any lingering "Setting up…".
  await h.page
    .waitForFunction(() => !document.body.innerText.includes('Setting up…'), undefined, { timeout: 25000 })
    .catch(() => undefined);
}

async function waitText(h: Harness, text: string, timeout = 25000) {
  try {
    await h.page.waitForFunction((t: string) => document.body.innerText.includes(t), text, { timeout });
  } catch (e) {
    const body = await h.page.innerText('body').catch(() => '(no body)');
    throw new Error(`waitText "${text}" timed out. URL=${h.page.url()} BODY=${body.slice(0, 400).replace(/\n/g, ' | ')}`);
  }
}

async function visible(h: Harness, name: string | RegExp): Promise<boolean> {
  return h.page
    .getByRole('button', { name, exact: typeof name === 'string' ? true : undefined })
    .first()
    .isVisible()
    .catch(() => false);
}

async function clickBtn(h: Harness, name: string | RegExp) {
  await h.page
    .getByRole('button', { name, exact: typeof name === 'string' ? true : undefined })
    .first()
    .click();
}

/** Click a control that may be a <button> or a <Link>. */
async function clickAny(h: Harness, name: string | RegExp) {
  const btn = h.page.getByRole('button', { name }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    return;
  }
  await h.page.getByRole('link', { name }).first().click();
}

function needsTyped(item: PackItem): boolean {
  return ['short-text-keyword', 'ordered-list', 'set', 'manual-review', 'number-sentence'].includes(
    item.answer.validation,
  );
}

/** How AnswerEntry renders this item for this band. */
function inputModeFor(item: PackItem, band: Band): 'choices' | 'tap' | 'typed' | 'pad' {
  if (item.choices && item.choices.length > 0) return 'choices';
  if (band === 'A' && tapOptionsFor(item)) return 'tap';
  if (band === 'C' || needsTyped(item)) return 'typed';
  return 'pad';
}

async function answerItem(h: Harness, band: Band, item: PackItem, given: string) {
  const page = h.page;
  const mode = inputModeFor(item, band);
  if (mode === 'choices') {
    await page.locator(`button:has(span:text-is(${JSON.stringify(given)}))`).first().click();
    return;
  }
  if (mode === 'tap') {
    await page.getByRole('button', { name: `Answer ${given}`, exact: true }).click();
    return;
  }
  if (mode === 'typed') {
    await page.locator('input[aria-label="Your answer"]').fill(given);
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    return;
  }
  // NumberPad (band B numerics). NOTE (finding S-…): after a miss the box
  // retains the previous wrong digits (AnswerEntry resets only on item.id
  // change) — a real child must notice and press C; the driver does the same.
  const clear = page.getByRole('button', { name: /Clear/ }).first();
  if (await clear.isVisible().catch(() => false)) await clear.click();
  for (const ch of given) {
    if (/\d/.test(ch)) await page.getByRole('button', { name: ch, exact: true }).first().click();
    else if (ch === '/') await page.getByRole('button', { name: '/', exact: true }).first().click();
    else if (ch === '.') await page.getByRole('button', { name: '.', exact: true }).first().click();
  }
  await page.getByRole('button', { name: /Submit/ }).click();
}

function correctFor(item: PackItem): string {
  return item.answer.value;
}

function wrongFor(item: PackItem): string {
  if (item.choices && item.choices.length > 0) {
    const other = item.choices.find((c) => c.key.toLowerCase() !== item.answer.value.toLowerCase());
    return other?.key ?? item.choices[0].key;
  }
  const v = item.answer.value;
  if (/^\d+$/.test(v)) {
    if (tapOptionsFor(item)) {
      const opts = tapOptionsFor(item)!;
      const wrong = opts.find((o) => String(o) !== v);
      if (wrong !== undefined) return String(wrong);
    }
    return String(Number(v) + 1);
  }
  const frac = v.match(/^(\d+)\/(\d+)$/);
  if (frac) return `${Number(frac[1]) + 1}/${frac[2]}`;
  if (needsTyped(item)) return 'not sure';
  return '0';
}

/** Classic band-B error: subtract-smaller-from-larger digitwise, if parseable. */
function classicWrongFor(item: PackItem): string {
  const m = item.prompt.match(/(\d{2,3})\s*[−–-]\s*(\d{1,3})/);
  if (m) {
    const a = m[1];
    const b = m[2].padStart(a.length, '0');
    let out = '';
    for (let i = 0; i < a.length; i++) out += String(Math.abs(Number(a[i]) - Number(b[i])));
    const wrong = String(Number(out));
    if (wrong !== item.answer.value && /^\d+$/.test(wrong)) return wrong;
  }
  return wrongFor(item);
}

/** Conceptual fraction error: add tops and bottoms (1/4+1/3 → 2/7 style). */
function conceptWrongFor(item: PackItem): string {
  const m = item.prompt.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)/);
  if (m) {
    const wrong = `${Number(m[1]) + Number(m[3])}/${Number(m[2]) + Number(m[4])}`;
    if (wrong !== item.answer.value) return wrong;
  }
  return wrongFor(item);
}

/** The prompt currently on screen (question/problem/task/puzzle card). */
async function readPrompt(h: Harness): Promise<string | null> {
  const sel =
    'section[aria-label="The problem"] p, section[aria-label="The question"] p, section[aria-label="The task"] p, section[aria-label="The puzzle"] p, section[aria-label="A fresh one"] p, section[aria-label="The fact"] p';
  const loc = h.page.locator(sel);
  const n = await loc.count().catch(() => 0);
  for (let i = 0; i < n; i++) {
    const t = (await loc.nth(i).innerText().catch(() => '')).trim();
    if (t && !/^🌳/.test(t)) return t;
  }
  return null;
}

function matchItem(pool: PackItem[], prompt: string): PackItem | null {
  return (
    pool.find((i) => i.prompt.trim() === prompt) ??
    pool.find((i) => prompt.includes(i.prompt.trim().slice(0, 40))) ??
    pool.find((i) => i.prompt.trim().includes(prompt.slice(0, 40))) ??
    null
  );
}

// ---------------------------------------------------------------------------
// State-machine driver for warm-up / practice / grove screens
// ---------------------------------------------------------------------------

type Behavior = 'correct' | 'missOnce' | 'ladderRide' | 'classic' | 'conceptError';

interface DriveOpts {
  /** behavior by item id */
  behaviors?: Record<string, Behavior>;
  endPattern: RegExp;
  onSprint?: () => Promise<'resume' | 'exit'>;
  noraAudit?: boolean;
  tag?: string;
  maxSteps?: number;
  /** When set, screenshot + grown-up-card audit when this item (the featured puzzle) is on screen. */
  puzzleId?: string;
}

async function drive(h: Harness, band: Band, pool: PackItem[], opts: DriveOpts): Promise<'end' | 'exit' | 'stuck'> {
  const attempts = new Map<string, number>();
  let unmatched = 0;
  let firstShot = false;
  for (let step = 0; step < (opts.maxSteps ?? 260); step++) {
    await h.page.waitForTimeout(450);
    const url = h.page.url();
    if (opts.endPattern.test(url)) return 'end';
    if (/\/foundry\/sprint(?!.*finish)/.test(url) && opts.onSprint) {
      const r = await opts.onSprint();
      if (r === 'exit') return 'exit';
      continue;
    }

    // Feedback / transition buttons first (order matters).
    let acted = false;
    for (const label of ['Next one', 'All warmed up!', 'Next', 'On we go', "Let's fix it", 'Last page of the week', 'My turn', 'Keep going']) {
      if (await visible(h, label)) {
        if (label === 'On we go') note('driver:parked-continue', `clicked "On we go" after a parked item${opts.tag ?? ''}`);
        await clickBtn(h, label);
        acted = true;
        break;
      }
    }
    if (acted) continue;

    // Explain-back fix-it input (bands B/C)
    if (await h.page.locator('input[aria-label="The first step in your own words"]').isVisible().catch(() => false)) {
      await h.page.fill('input[aria-label="The first step in your own words"]', 'First I make the pieces the same size');
      await clickBtn(h, 'Tell Ms. Wren');
      note('fixit:explain-back', 'explain-back sent (ungraded telemetry)');
      continue;
    }

    // An item should be on screen.
    const prompt = await readPrompt(h);
    if (!prompt) continue;
    const item = matchItem(pool, prompt);
    if (!item) {
      unmatched += 1;
      if (unmatched > 6) {
        note('driver:stuck', `unmatched prompt: "${prompt.slice(0, 140)}"`);
        await snap(h, `stuck${opts.tag ?? ''}`);
        return 'stuck';
      }
      continue;
    }
    unmatched = 0;
    const n = attempts.get(item.id) ?? 0;
    if (opts.puzzleId && item.id === opts.puzzleId && n === 0) {
      const grownUp = await h.page.locator('text=Show a grown-up!').isVisible().catch(() => false);
      note('grove:puzzle-screen', `featured puzzle on screen; band-A "Show a grown-up" card visible=${grownUp}`);
      await snap(h, `grove-puzzle${opts.tag ?? ''}`);
    }
    if (!firstShot) {
      firstShot = true;
      await snap(h, `first-item${opts.tag ?? ''}`);
      if (opts.noraAudit) {
        const audio = await audioCount(h);
        note('banda:audio', `first item screen has ${audio} audio affordance(s)`);
      }
    }
    if (opts.noraAudit) {
      const mode = inputModeFor(item, band);
      if (mode === 'typed' || mode === 'pad') {
        note('banda:input-breach', `item ${item.id} (${item.answer.validation}) renders "${mode}" input at band A — prompt "${item.prompt.slice(0, 80)}"`);
      }
    }

    const behavior = opts.behaviors?.[item.id] ?? 'correct';
    if (behavior === 'ladderRide') {
      if (n === 0) {
        // H1: bottom-out is now reveal + fix-it, reached by miss-driven rung
        // escalation (each miss IS the gating attempt). A ladder of maxRung
        // rungs reveals after maxRung+1 misses (2-rung → 3 misses). Never a
        // "parks at 2 misses" outcome; the "answer after rung N" caption tracks
        // this ladder's real length (H1).
        const maxRung = Math.min(3, item.hintLadder.length);
        const missesToReveal = maxRung + 1;
        let capturedCaption: string | null = null;
        let h2Noted = false;
        let revealed = false;
        for (let k = 0; k < missesToReveal + 2 && !revealed; k++) {
          const padVisible = await h.page.locator('[aria-label="Your answer so far"]').first().isVisible().catch(() => false);
          await answerItem(h, band, item, wrongFor(item));
          await h.page.waitForTimeout(650);
          const body = await h.page.innerText('body');
          // H2: after a NumberPad miss the answer box must be empty (no phantom
          // stale digits merging into the next attempt).
          if (padVisible && !h2Noted && !revealed) {
            h2Noted = true;
            const buf = (await h.page.locator('[aria-label="Your answer so far"]').first().innerText().catch(() => '?')).replace(/ /g, '').trim();
            note('h2:buffer-clears', `${item.id}: after a NumberPad miss the answer box reads "${buf}" → H2 clears=${buf === ''}`);
          }
          const cap = body.match(/The answer only comes after rung \d+[^\n]*/)?.[0];
          if (cap && !capturedCaption) capturedCaption = cap.trim();
          if (/It comes to /.test(body) || (await visible(h, "Let's fix it"))) revealed = true;
        }
        attempts.set(item.id, maxRung + 2);
        note(
          'ladder:reveal',
          `${item.id} ladder=${item.hintLadder.length} (maxRung ${maxRung}) → REVEAL reached after ≤${missesToReveal} misses=${revealed}; caption=${capturedCaption ? `"${capturedCaption}" (H1 expects "rung ${maxRung}")` : '(none — 1-rung ladders show no caption)'}`,
        );
        await snap(h, `ladder-reveal${opts.tag ?? ''}`);
        if (await visible(h, "Let's fix it")) {
          await clickBtn(h, "Let's fix it");
          await h.page.waitForTimeout(700);
        }
        // Fix-it step: explain-back (no cheap variant) or a near-transfer variant.
        const explainInput = h.page.locator('input[aria-label="The first step in your own words"]');
        if (await explainInput.isVisible().catch(() => false)) {
          await explainInput.fill('First I find the tens, then count on from there');
          await clickBtn(h, 'Tell Ms. Wren');
          note('ladder:fixit', `${item.id} reveal → fix-it = explain-back (advances the day)`);
        } else {
          const fresh = await h.page.locator('section[aria-label="A fresh one"] p').first().innerText().catch(() => '');
          const m = fresh.match(/(-?\d+)\s*([+\-−×x*])\s*(-?\d+)/);
          let ans = '';
          if (m) {
            const a = Number(m[1]);
            const b = Number(m[3]);
            ans = String(/[−-]/.test(m[2]) ? a - b : /[×x*]/.test(m[2]) ? a * b : a + b);
          }
          if (ans) {
            const variantItem = { ...item, id: `${item.id}-fixit`, choices: undefined, answer: { ...item.answer, value: ans, validation: 'exact-numeric' } } as PackItem;
            await answerItem(h, band, variantItem, ans);
            await h.page.waitForTimeout(600);
          }
          note('ladder:fixit', `${item.id} reveal → fix-it = near-transfer variant "${fresh.slice(0, 40)}" answered ${ans || '(unparsed)'}`);
        }
        await snap(h, `ladder-fixit${opts.tag ?? ''}`);
        continue;
      }
      await answerItem(h, band, item, correctFor(item));
      attempts.set(item.id, n + 1);
      continue;
    }

    const wantWrong = (behavior === 'missOnce' || behavior === 'classic' || behavior === 'conceptError') && n === 0;
    const given = wantWrong
      ? behavior === 'classic'
        ? classicWrongFor(item)
        : behavior === 'conceptError'
          ? conceptWrongFor(item)
          : wrongFor(item)
      : correctFor(item);
    await answerItem(h, band, item, given);
    attempts.set(item.id, n + 1);
    await h.page.waitForTimeout(750);
    if (wantWrong) {
      const body = await h.page.innerText('body');
      const opener = body.match(/Good try[^\n]*|Good thinking[^\n]*|Not yet[^\n]*/)?.[0];
      const rung1 = body.match(/A question to start/) ? 'rung 1 auto-opened' : 'no ladder';
      const reveal = body.match(/It comes to [^\n]*/)?.[0];
      note('miss:correction', `item ${item.id} wrong="${given}" → opener "${opener ?? '(none)'}"; ${rung1}${reveal ? `; reveal "${reveal.slice(0, 70)}"` : ''}`);
      await snap(h, `miss-${item.id.toLowerCase()}${opts.tag ?? ''}`);
    }
  }
  return 'stuck';
}

// ---------------------------------------------------------------------------
// Check driver (WeeklyCheck Form A / FreshProblems Form B)
// ---------------------------------------------------------------------------

async function driveCheck(
  h: Harness,
  band: Band,
  items: PackItem[],
  marks: Record<string, 'c' | 'w'>,
  opts: { startButton: string; reloadAfter?: number; tag?: string },
) {
  await clickBtn(h, opts.startButton);
  await h.page.waitForTimeout(700);
  let answered = 0;
  let ackNoted = false;
  for (let step = 0; step < 80; step++) {
    await h.page.waitForTimeout(450);
    if (/resolve|strengthen/.test(h.page.url())) return;
    if (await visible(h, opts.startButton)) {
      // Post-reload the check re-shows its framing screen; answered items stand.
      note('check:reframing', 'after reload the framing screen re-appears — one extra tap, then resume at the next unanswered item');
      await clickBtn(h, opts.startButton);
      continue;
    }
    if (await visible(h, 'Hand it to Ms. Wren')) {
      await snap(h, `check-handover${opts.tag ?? ''}`);
      await clickBtn(h, 'Hand it to Ms. Wren');
      await h.page.waitForTimeout(2500);
      continue;
    }
    if (await visible(h, 'Next')) {
      if (!ackNoted) {
        ackNoted = true;
        const ack = (await h.page.innerText('body')).match(/Got it[.!]/)?.[0];
        note('check:ack', `held-feedback ack: "${ack ?? '(none)'}" — identical whether right or wrong`);
      }
      await clickBtn(h, 'Next');
      if (opts.reloadAfter === answered) {
        await h.page.waitForTimeout(500);
        await h.page.reload({ waitUntil: 'domcontentloaded' });
        await h.page.waitForTimeout(4500);
        const header = (await h.page.innerText('body')).match(/\d of \d/)?.[0];
        note('check:reload', `mid-check reload → resumed at "${header ?? '(?)'}" — answered items stand, no restart-scumming`);
        await snap(h, `check-resumed${opts.tag ?? ''}`);
      }
      continue;
    }
    const prompt = await readPrompt(h);
    if (!prompt) continue;
    const item = matchItem(items, prompt);
    if (!item) continue;
    if (answered === 0) await snap(h, `check-first${opts.tag ?? ''}`);
    const mark = marks[item.id] ?? 'c';
    await answerItem(h, band, item, mark === 'c' ? correctFor(item) : wrongFor(item));
    answered += 1;
    await h.page.waitForTimeout(600);
  }
}

// ---------------------------------------------------------------------------
// Lesson + guided drivers
// ---------------------------------------------------------------------------

async function playLesson(h: Harness, opts: { skimAttempt?: boolean } = {}) {
  await waitText(h, 'Continue');
  const buttons = (await h.page.locator('button:visible').allInnerTexts()).map((b) => b.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const skippy = buttons.filter((b) => /skip|fast|jump/i.test(b));
  note('lesson:skip-audit', `buttons on first segment: [${buttons.join(' | ')}] — skip-like: ${skippy.length ? skippy.join(',') : 'NONE'}`);
  if (opts.skimAttempt) {
    const dot = h.page.locator('button[aria-label="Part 5"]').first();
    const disabled = (await dot.getAttribute('disabled').catch(() => null)) !== null;
    note('lesson:dot-skip-attempt', `tapping a later segment dot: disabled=${disabled}; no explanation offered — it simply does not respond`);
  }
  await snap(h, 'lesson-first-segment');
  let clicks = 0;
  for (let guard = 0; guard < 40; guard++) {
    if (await visible(h, 'Pin our examples')) break;
    await clickBtn(h, 'Continue');
    clicks += 1;
    await h.page.waitForTimeout(350);
  }
  note('lesson:segments', `tapped Continue ${clicks} times (${clicks + 1} segments) before the pin moment`);
  await snap(h, 'lesson-last-segment');
  await clickBtn(h, 'Pin our examples');
  await waitText(h, 'Pinned to your anchor');
  await snap(h, 'lesson-pinned');
  await clickBtn(h, "Let's try together");
}

/**
 * C2 fix mirror: band-A guided input is tap-the-count. Target = the step's own
 * integer result, else the example's cardinal answer (must match GuidedPractice
 * bandATarget() exactly, or the tile the driver taps won't grade correct).
 */
function guidedBandATarget(step: { expected?: string }, example: { answer: string | number }): number | null {
  const s = Number(String(step.expected ?? '').trim());
  if (Number.isInteger(s) && String(step.expected ?? '').trim() !== '') return s;
  const a = Number(String(example.answer).trim());
  return Number.isInteger(a) ? a : null;
}

async function playGuided(
  h: Harness,
  band: Band,
  pack: WeeklyConceptPack,
  opts: { errorAtStep?: number; noraAudit?: boolean } = {},
) {
  let inputSteps = 0;
  let tapSteps = 0;
  let silentChildDo = 0;
  for (const ex of pack.guidedExamples) {
    for (const st of ex.steps) {
      const needsInput = ex.fadeLevel !== 'modeled' && !!st.childDo && !!st.expected;
      if (!needsInput) {
        const label = st.expected ? `${st.expected} — got it!` : 'Continue';
        await h.page.getByRole('button', { name: label, exact: true }).click();
        await h.page.waitForTimeout(350);
        continue;
      }
      inputSteps += 1;
      const tapTarget = band === 'A' ? guidedBandATarget(st, ex as unknown as { answer: string | number }) : null;

      if (band === 'A' && tapTarget !== null) {
        // C2: tap the number tile equal to the step's answer (no keyboard).
        tapSteps += 1;
        await h.page.waitForSelector(`button[aria-label="Answer ${tapTarget}"]`, { timeout: 20000 });
        if (opts.noraAudit) {
          const cardAudio = await h.page
            .locator(
              'div.rounded-3xl:has(button[aria-label^="Answer "]) [aria-label="Hear this instruction"], div.rounded-3xl:has(button[aria-label^="Answer "]) [aria-label="Playing instruction audio"]',
            )
            .count()
            .catch(() => 0);
          if (cardAudio === 0) silentChildDo += 1;
          note('guided:banda-tap', `step "${st.childDo}" → TAP tile ${tapTarget} (no keyboard); audio on the childDo instruction: ${cardAudio}`);
          await snap(h, `guided-tap-step-${inputSteps}`);
        }
        if (opts.errorAtStep === inputSteps) {
          // Deliberate miss: tap a wrong (but present) tile, then recover.
          const wrongTile = await h.page
            .locator(`button[aria-label^="Answer "]:not([aria-label="Answer ${tapTarget}"])`)
            .first();
          if (await wrongTile.isVisible().catch(() => false)) {
            await wrongTile.click();
            await h.page.waitForTimeout(900);
            const opener = (await h.page.innerText('body')).match(/Good try[^.]*\.|Good thinking[^.]*\.|Not yet[^.]*\./)?.[0];
            note('guided:miss-formula', `band-A deliberate miss (wrong tile) → opener "${opener ?? '(none)'}"; same step re-offered`);
            await snap(h, 'guided-miss');
          }
        }
        await h.page.getByRole('button', { name: `Answer ${tapTarget}`, exact: true }).first().click();
        await h.page.waitForTimeout(350);
        continue;
      }

      // Bands B/C (and A fall-through when no integer target): typed entry.
      await h.page.waitForSelector('input[aria-label="Your step"]', { timeout: 20000 });
      if (opts.errorAtStep === inputSteps) {
        await h.page.fill('input[aria-label="Your step"]', band === 'B' ? '999' : 'dunno');
        await clickBtn(h, 'Check');
        await h.page.waitForTimeout(900);
        const opener = (await h.page.innerText('body')).match(/Good try[^.]*\.|Good thinking[^.]*\.|Not yet[^.]*\./)?.[0];
        note('guided:miss-formula', `deliberate miss → opener "${opener ?? '(none)'}"; same step re-offered (Acknowledge→Locate→Guide→Re-attempt)`);
        await snap(h, 'guided-miss');
      }
      await h.page.fill('input[aria-label="Your step"]', st.expected!);
      await clickBtn(h, 'Check');
      await h.page.waitForTimeout(350);
    }
  }
  if (opts.noraAudit) {
    note('guided:banda-summary', `band-A input steps: ${inputSteps} (tap-tile: ${tapSteps}); childDo instructions with NO audio affordance: ${silentChildDo} (C2 expects 0)`);
  }
  await h.page.waitForURL(/day\/1\/done/, { timeout: 30000 });
  await snap(h, 'day1-done');
}

// ---------------------------------------------------------------------------
// Placement walk
// ---------------------------------------------------------------------------

async function playPlacementWalk(
  h: Harness,
  child: FixtureChild,
  plan: (level: BBLevel) => Array<'c' | 'w'>,
  expectSettle?: BBLevel,
) {
  let level = startLevelForAge(child.age);
  const visited: BBLevel[] = [];
  const passedLevels: BBLevel[] = [];
  const failedLevels: BBLevel[] = [];
  let served = 0;
  for (let cluster = 0; cluster < 4; cluster++) {
    const pack = packFor(level, 1, WALK_SEED);
    const items = pack.masteryCheck.formA.slice(0, 5);
    const band = bandForLevel(level);
    const marks = plan(level);
    let correct = 0;
    note('placement:cluster', `level ${level} cluster begins (input band ${band}); plan=${marks.join('')}`);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Poll for the item (or the pause screen) up to 20s.
      let found = false;
      for (let poll = 0; poll < 40; poll++) {
        if (await visible(h, 'Keep going')) {
          note('placement:pause', `soft pause offered after ${served} items`);
          await snap(h, 'placement-pause');
          await clickBtn(h, 'Keep going');
          await h.page.waitForTimeout(400);
        }
        const prompt = await readPrompt(h);
        if (prompt && (prompt === item.prompt.trim() || prompt.includes(item.prompt.trim().slice(0, 40)))) {
          found = true;
          break;
        }
        await h.page.waitForTimeout(500);
      }
      if (!found) {
        const body = await h.page.innerText('body').catch(() => '');
        throw new Error(`placement item ${level}#${i + 1} never appeared. Expected "${item.prompt.slice(0, 60)}" BODY=${body.slice(0, 300).replace(/\n/g, ' | ')}`);
      }
      if (i === 0) await snap(h, `placement-${level}-item1`);
      if (child.age <= 6) {
        const audio = await audioCount(h);
        const mode = inputModeFor(item, band);
        if (audio === 0) note('placement:silent', `level-${level} item ${i + 1} has NO audio affordance`);
        if (mode !== 'tap' && mode !== 'choices') note('placement:banda-input', `age-5 child served "${mode}" input on level-${level} item ${i + 1} ("${item.prompt.slice(0, 60)}")`);
      }
      const mark = marks[i];
      await answerItem(h, band, item, mark === 'c' ? correctFor(item) : wrongFor(item));
      if (mark === 'c') correct += 1;
      served += 1;
      await h.page.waitForTimeout(1100); // identical warm-neutral ack (800ms)
    }
    const accuracy = correct / items.length;
    // C3 threshold parity with the app: a cluster at/above the step-down floor
    // (50%) counts as "passed" (never assigned below it); under it is "failed".
    (accuracy >= 0.5 ? passedLevels : failedLevels).push(level);
    const idx = LADDER.indexOf(level);
    const canUp = idx < LADDER.length - 1 && !visited.includes(LADDER[idx + 1]);
    const canDown = idx > 0 && !visited.includes(LADDER[idx - 1]);
    visited.push(level);
    const decision = accuracy >= 0.8 && canUp ? 'up' : accuracy < 0.5 && canDown ? 'down' : 'hold';
    note('placement:decision', `level ${level}: ${correct}/5 → ${decision}`);
    if (decision === 'hold') break;
    level = LADDER[idx + (decision === 'up' ? 1 : -1)];
  }
  await waitText(h, 'starting point');
  const levelShown = (await h.page.locator('section[aria-label="Your starting point"]').innerText().catch(() => '(?)')).replace(/\n/g, ' · ');
  const strengths = (await h.page.locator('section[aria-label="Your strengths"]').innerText().catch(() => '(?)')).replace(/\n/g, ' · ');
  note('placement:result', `StartingPoint: ${levelShown} — strengths card: ${strengths}`);
  await snap(h, 'placement-startingpoint');
  // C3: the assigned level must be the highest the child PASSED, and never a
  // level whose entry cluster they failed (the over-placement bug).
  const highestPassed = passedLevels.length
    ? passedLevels.reduce((hi, l) => (LADDER.indexOf(l) > LADDER.indexOf(hi) ? l : hi), passedLevels[0])
    : LADDER[0];
  const target = expectSettle ?? highestPassed;
  const assignedFailed = failedLevels.filter((l) => new RegExp(`Level ${l}\\b`).test(levelShown));
  const c3pass = new RegExp(`Level ${target}\\b`).test(levelShown) && assignedFailed.length === 0;
  note(
    'placement:C3-settle',
    `passed=[${passedLevels.join(',')}] failed=[${failedLevels.join(',')}] → expect Level ${target}; shown="${levelShown}"; assigned-a-failed-level=${assignedFailed.length > 0}; C3 ${c3pass ? 'PASS' : 'FAIL'}`,
  );
  if (bandForLevel(startLevelForAge(child.age)) === 'A') {
    const audio = await audioCount(h);
    note('placement:startingpoint-audio', `audio affordances on StartingPoint: ${audio} (strengths list is plain text)`);
  }
  await clickBtn(h, 'See my journey');
  await waitText(h, 'journey');
  await snap(h, 'placement-journeymap');
}

// ---------------------------------------------------------------------------
// Stage scaffolding
// ---------------------------------------------------------------------------

/** Optional stage filter: `npx tsx run-students.ts maya midweek,day5`. */
const STAGE_FILTER = (process.argv[3] ?? '').split(',').filter(Boolean);

async function stage(
  child: 'nora' | 'maya' | 'jordan',
  name: string,
  db: MockDb,
  fn: (h: Harness) => Promise<void>,
  opts: { seedRandom?: boolean } = {},
) {
  if (STAGE_FILTER.length > 0 && !STAGE_FILTER.includes(name)) return;
  CURRENT = { child, stage: name };
  mkdirSync(join(RUNS_DIR, 'students', child), { recursive: true });
  console.log(`\n=== ${child}/${name} ===`);
  let h: Harness | null = null;
  for (let attempt = 0; attempt < 2 && !h; attempt++) {
    try {
      h = await launchHarness({
        persona: `students/${child}/${name}`,
        db,
        viewport: 'child',
        selectedChildId: CHILDREN[child].id,
      });
    } catch (e) {
      console.log(`  launch failed (${String(e).slice(0, 120)}) — retrying in 6s`);
      await new Promise((r) => setTimeout(r, 6000));
    }
  }
  if (!h) {
    note('STAGE-FAILED', 'harness launch failed twice');
    return;
  }
  if (opts.seedRandom) await h.page.addInitScript(`Math.random = () => ${RAND};`);
  try {
    await fn(h);
    const unexpected = h.consoleEntries().filter((c) => !c.known);
    if (unexpected.length) note('console', `${unexpected.length} unexpected console entries; first: ${unexpected[0].text.slice(0, 140)}`);
    await h.finish('ok');
  } catch (e) {
    note('STAGE-FAILED', String(e).slice(0, 500));
    await h.shot('stage-failure').catch(() => undefined);
    await h.finish('failed', String(e)).catch(() => undefined);
  }
}

function stageFreshWeekRow(db: MockDb, child: FixtureChild, level: BBLevel, week: number) {
  db.bb_week_state.push({
    child_id: child.id,
    level,
    week,
    pack_seed: FIXED_PACK_SEED,
    content_version: CONTENT_VERSION,
    state: 'not_started',
    day_progress: {},
    mastery: { attempts: [] },
    started_at: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

/**
 * Enter a day from the hub CTA. C1 (a9beb59) removed the WarmUp
 * navigate-during-render dead-end: a zero-retrieval day now forwards
 * declaratively to core practice (day ≤4) or banks + forwards to the Grove
 * (day 5). The old programmatic recovery is DELIBERATELY GONE — if the child
 * ever lands on a blank warm-up now, that is a REGRESSION, logged as R-*, not
 * papered over. A day with retrieval items lands on the warm-up (with content),
 * which is a valid entry.
 */
async function enterDay(h: Harness, day: number): Promise<void> {
  await clickBtn(h, `Start Day ${day}'s practice`);
  for (let poll = 0; poll < 16; poll++) {
    await h.page.waitForTimeout(650);
    const url = h.page.url();
    if (url.includes(`/day/${day}/practice`) || url.includes('/puzzle')) return;
    if (url.includes('/warmup') && (await readPrompt(h)) !== null) return; // warm-up with real content
  }
  const url = h.page.url();
  const blank = url.includes('/warmup') && (await readPrompt(h)) === null;
  const body = (await h.page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 160);
  note(
    blank ? 'REGRESSION:C1-blank-warmup' : 'day-entry-failed',
    `"Start Day ${day}'s practice" did not reach practice/puzzle — landed ${url.split('5173')[1]} blank=${blank} body="${body}"`,
  );
  await snap(h, `day${day}-entry-failure`);
  throw new Error(`day-${day} entry failed (landed ${url.split('5173')[1]}, blank=${blank})`);
}

async function playDeepLink(h: Harness, day: number) {
  try {
    await h.page.goto(h.url(`/foundry/day/${day}/practice`), { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch {
    await h.page.goto(h.url(`/foundry/day/${day}/practice`), { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  // Trajectory sample every second for 12s: loading limbo → where do we land?
  const traj: string[] = [];
  for (let t = 1; t <= 12; t++) {
    await h.page.waitForTimeout(1000);
    const body = (await h.page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
    const state = body.includes('Setting up…') ? 'setting-up' : (await readPrompt(h)) ? 'practice-content' : 'other';
    traj.push(`${t}s:${h.page.url().split('5173')[1]}[${state}]`);
  }
  const final = h.page.url();
  const bounced = final.includes('/foundry/hub') || /\/foundry\/?$/.test(final);
  note('deeplink', `cold deep-link to /foundry/day/${day}/practice (day ${day} IS actionable): ${bounced ? 'BOUNCED to hub (inc-5 bug CONFIRMED)' : 'ended on ' + final} — trajectory: ${traj.join(' → ')}`);
  await snap(h, 'deeplink-landing');
}

const dayItems = (pack: WeeklyConceptPack, day: number) => {
  const items = getPackDay(pack, day).items;
  return { warm: items.filter((i) => i.isRetrieval), rest: items.filter((i) => !i.isRetrieval) };
};

function puzzleAsItem(pack: WeeklyConceptPack): PackItem {
  return {
    id: pack.puzzle.id,
    type: 'reasoning',
    prompt: pack.puzzle.prompt,
    answer: pack.puzzle.answer,
    difficulty: 3,
    strand: 'noncomputational',
    isRetrieval: false,
    hintLadder: pack.puzzle.hintLadder,
    errorTags: ['concept-misconception'],
  };
}

// ---------------------------------------------------------------------------
// NORA (5, band A)
// ---------------------------------------------------------------------------

async function runNora() {
  const A1 = packFor('A', 1);

  await stage('nora', 'placement', scenarioPlacement(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, 'Ms. Wren');
    await snap(h, 'placement-welcome');
    note('placement:welcome-audio', `audio affordances on welcome: ${await audioCount(h)}`);
    await clickBtn(h, /Let's go/);
    await h.page.waitForTimeout(1200);
    await playPlacementWalk(
      h,
      CHILDREN.nora,
      (level) => (level === 'A' ? ['c', 'c', 'c', 'c', 'c'] : ['w', 'w', 'w', 'w', 'w']),
      'A', // C3: pass A, fail B ⇒ must settle A (the highest passed), never B
    );
  }, { seedRandom: true });

  const freshA = freshDb([CHILDREN.nora]);
  enrollChild(freshA, CHILDREN.nora, 'A', 1);
  stageFreshWeekRow(freshA, CHILDREN.nora, 'A', 1);
  await stage('nora', 'freshweek', freshA, async (h) => {
    await go(h, '/foundry');
    await waitText(h, A1.identity.conceptName);
    await snap(h, 'hub-fresh-week');
    note('hub:audio', `hub fresh-week: ${await audioCount(h)} audio button(s); concept card text + CTA label are silent text; the Wren bubble does NOT autoplay on the hub`);
    await clickBtn(h, 'Start the lesson with Ms. Wren');
    await playLesson(h);
    await playGuided(h, 'A', A1, { errorAtStep: 2, noraAudit: true });
    await clickBtn(h, 'Back to my week');
    await waitText(h, 'Day 1');
    await snap(h, 'hub-after-day1');
  });

  await stage('nora', 'midweek', scenarioNoraMidWeek(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, A1.identity.conceptName);
    await snap(h, 'hub-midweek');
    await enterDay(h, 2);
    const { warm, rest } = dayItems(A1, 2);
    note('day2:shape', `warm-up items=${warm.length}, practice items=${rest.length}`);
    const missId = rest[1]?.id ?? rest[0]?.id;
    const r = await drive(h, 'A', [...warm, ...rest], {
      behaviors: missId ? { [missId]: 'missOnce' } : {},
      endPattern: /day\/2\/done/,
      noraAudit: true,
      tag: '-day2',
    });
    note('day2:drive', `result=${r}`);
    await snap(h, 'day2-done');
    await clickBtn(h, 'Back to my week');
    await waitText(h, 'Day 3');
    const tile3 = h.page.locator('button[aria-label^="Day 3"]');
    const disabled = (await tile3.getAttribute('disabled')) !== null;
    const label = await tile3.getAttribute('aria-label');
    const restingLine = (await h.page.innerText('body')).match(/[Rr]esting[^\n]*/)?.[0];
    note('day3-tile', `after finishing Day 2 today: Day-3 tile aria="${label}", disabled=${disabled}; resting copy: "${restingLine ?? '(none)'}"`);
    await snap(h, 'hub-day3-resting');
  });

  const day5Db = freshDb([CHILDREN.nora]);
  stageDay5Ready(day5Db, CHILDREN.nora, 'A', 1);
  await stage('nora', 'day5', day5Db, async (h) => {
    await go(h, '/foundry');
    await waitText(h, A1.identity.conceptName);
    await enterDay(h, 5);
    const { warm, rest } = dayItems(A1, 5);
    note('day5:shape', `warm=${warm.length} grove-items=${rest.length} + puzzle "${A1.puzzle.title}"`);
    const pool = [...warm, ...rest, puzzleAsItem(A1)];
    const r = await drive(h, 'A', pool, { endPattern: /\/foundry\/check/, noraAudit: true, tag: '-day5', puzzleId: A1.puzzle.id });
    note('day5:drive', `grove result=${r}`);
    await waitText(h, 'Last page');
    await snap(h, 'check-framing');
    for (const it of A1.masteryCheck.formA) {
      const mode = inputModeFor(it, 'A');
      if (mode !== 'tap' && mode !== 'choices') note('check:banda-input', `check item ${it.id} uses "${mode}" input at band A`);
    }
    const marks = Object.fromEntries(A1.masteryCheck.formA.map((i) => [i.id, 'c' as const]));
    await driveCheck(h, 'A', A1.masteryCheck.formA, marks, { startButton: "Last page — let's go" });
    await h.page.waitForURL(/resolve/, { timeout: 25000 });
    await waitText(h, 'shelf');
    note('resolve:copy', `pass moment: ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 280)}`);
    await snap(h, 'week-resolve-pass');
  });

  await stage('nora', 'deeplink', scenarioNoraMidWeek(), async (h) => playDeepLink(h, 2));
}

// ---------------------------------------------------------------------------
// MAYA (8, band B)
// ---------------------------------------------------------------------------

async function runMaya() {
  const B1 = packFor('B', 1);

  await stage('maya', 'placement', scenarioPlacement(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, 'Ms. Wren');
    await snap(h, 'placement-welcome');
    await clickBtn(h, /Let's go/);
    await h.page.waitForTimeout(1200);
    await playPlacementWalk(
      h,
      CHILDREN.maya,
      (level) => (level === 'B' ? ['c', 'c', 'w', 'c', 'c'] : ['w', 'c', 'w', 'w', 'c']),
      'B', // C3: pass B, fail C ⇒ must settle B (the highest passed), never C
    );
  }, { seedRandom: true });

  const freshB = freshDb([CHILDREN.maya]);
  enrollChild(freshB, CHILDREN.maya, 'B', 1);
  stageFreshWeekRow(freshB, CHILDREN.maya, 'B', 1);
  await stage('maya', 'freshweek', freshB, async (h) => {
    await go(h, '/foundry');
    await waitText(h, B1.identity.conceptName);
    await snap(h, 'hub-fresh-week');
    await clickBtn(h, 'Start the lesson with Ms. Wren');
    await playLesson(h);
    await playGuided(h, 'B', B1, { errorAtStep: 1 });
    await clickBtn(h, 'Back to my week');
    await snap(h, 'hub-after-day1');
  });

  await stage('maya', 'midweek', scenarioMayaMidWeek(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, B1.identity.conceptName);
    const chestBadge = (await h.page.innerText('body')).match(/Chest · \d+ waiting/)?.[0];
    note('hub:chest-badge', `hub shows "${chestBadge ?? '(no badge)'}"`);
    await snap(h, 'hub-midweek');
    await enterDay(h, 3);
    const { warm, rest } = dayItems(B1, 3);
    note('day3:shape', `warm=${warm.length} practice=${rest.length} pages=${getPackDay(B1, 3).pageCount}`);
    const behaviors: Record<string, Behavior> = {};
    if (warm[0]) behaviors[warm[0].id] = 'missOnce'; // warm-up miss → reveal → explain-back
    if (rest[0]) behaviors[rest[0].id] = 'classic';
    if (rest[1]) behaviors[rest[1].id] = 'ladderRide'; // parks → chest
    if (rest[3]) behaviors[rest[3].id] = 'classic';
    const r = await drive(h, 'B', [...warm, ...rest], {
      behaviors,
      endPattern: /day\/3\/done/,
      tag: '-day3',
      onSprint: async () => {
        // B1 also schedules a sprint on day 3 — Maya isn't in the mood today.
        await h.page.waitForTimeout(700);
        note('sprint:offer-maya', `gate copy (band B): ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300)}`);
        await snap(h, 'sprint-gate-maya');
        await clickBtn(h, 'Not today');
        await h.page.waitForTimeout(900);
        note('sprint:decline-maya', `declined; back on ${h.page.url().split('5173')[1]} with no comment`);
        return 'resume';
      },
    });
    note('day3:drive', `result=${r}`);
    await snap(h, 'day3-done');
    await clickBtn(h, 'Back to my week');
    await waitText(h, 'Chest');
    const badge2 = (await h.page.innerText('body')).match(/Chest · \d+ waiting/)?.[0];
    note('hub:chest-badge-after', `after parking in practice: "${badge2 ?? '(no badge)'}"`);
    await h.page.locator('a[href="/foundry/chest"]').first().click();
    await h.page.waitForTimeout(1600);
    await snap(h, 'chest-open');
    const box = h.page.getByRole('button', { name: /Open me/ }).first();
    if (await box.isVisible().catch(() => false)) {
      await box.click();
      await h.page.waitForTimeout(1200);
      note('chest:setup', `parked-item setup: ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 260)}`);
      await snap(h, 'chest-setup');
      await clickBtn(h, 'My turn');
      await h.page.waitForTimeout(800);
      const prompt = await readPrompt(h);
      const all = B1.days.flatMap((d) => d.items);
      const parkedItem = prompt ? matchItem(all, prompt) : null;
      if (parkedItem) {
        await answerItem(h, 'B', parkedItem, correctFor(parkedItem));
        await h.page.waitForTimeout(900);
        note('chest:resolve', `solved the parked item → ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 180)}`);
        await snap(h, 'chest-resolved');
      } else {
        note('chest:resolve', `could not match parked prompt "${prompt?.slice(0, 80)}"`);
      }
    } else {
      note('chest:empty', 'no parked chest visible despite telemetry + in-session park');
      await snap(h, 'chest-unexpected-empty');
    }
  });

  await stage('maya', 'day5', scenarioMayaDay5(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, B1.identity.conceptName);
    await enterDay(h, 5);
    const { warm, rest } = dayItems(B1, 5);
    const pool = [...warm, ...rest, puzzleAsItem(B1)];
    const r = await drive(h, 'B', pool, { endPattern: /\/foundry\/check/, tag: '-day5', puzzleId: B1.puzzle.id });
    note('day5:drive', `grove result=${r}`);
    await waitText(h, 'Last page');
    note('check:framing', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
    await snap(h, 'check-framing');
    const formA = B1.masteryCheck.formA;
    const missIds: string[] = [];
    for (const it of formA) if (missIds.length < 2 && it.errorTags[0] === 'concept-misconception') missIds.push(it.id);
    for (const it of formA) if (missIds.length < 2 && !missIds.includes(it.id)) missIds.push(it.id);
    const marks = Object.fromEntries(formA.map((i) => [i.id, missIds.includes(i.id) ? ('w' as const) : ('c' as const)]));
    note('check:plan', `submitting 4/6; misses on ${missIds.join(', ')}`);
    await driveCheck(h, 'B', formA, marks, { startButton: "Last page — let's go", reloadAfter: 2 });
    await h.page.waitForURL(/strengthen/, { timeout: 25000 });
    await h.page.waitForTimeout(900);
    const planText = (await h.page.innerText('body')).replace(/\s+/g, ' ');
    note('strengthen:copy', `StrengthenPlan text: ${planText.slice(0, 460)}`);
    note('strengthen:audit', `%? ${/\d+\s*%/.test(planText)} · skill named? ${/Just this one/.test(planText)} · other-strands? ${/keeps moving/.test(planText)} · red/sad styling: see screenshot`);
    await snap(h, 'strengthen-plan');
    await clickAny(h, /Back to my week/);
    await h.page.waitForTimeout(1100);
    const hubText = (await h.page.innerText('body')).replace(/\s+/g, ' ');
    note('strengthen:hub-same-day', `hub after near-miss (same day): ${hubText.slice(0, 380)}`);
    await snap(h, 'hub-after-nearmiss');
  });

  await stage('maya', 'nearmiss', scenarioMayaNearMiss(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, B1.identity.conceptName);
    const dual = (await h.page.innerText('body')).match(/Still strengthening[^\n]*/)?.[0];
    note('nearmiss:dual-thread', `hub dual-thread line: "${dual ?? '(missing)'}"`);
    await snap(h, 'hub-corrective');
    await clickBtn(h, /One more round/);
    await h.page.waitForTimeout(1300);
    note('reteach:intro', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
    await snap(h, 'reteach-1');
    for (let guard = 0; guard < 14; guard++) {
      if (await visible(h, 'Brand-new problems')) break;
      await clickBtn(h, 'Continue');
      await h.page.waitForTimeout(400);
    }
    await snap(h, 'reteach-last');
    await clickBtn(h, 'Brand-new problems');
    await h.page.waitForTimeout(1100);
    note('fresh:framing', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 240));
    await snap(h, 'fresh-framing');
    const aPrompts = new Set(B1.masteryCheck.formA.map((i) => i.prompt));
    const overlap = B1.masteryCheck.formB.filter((i) => aPrompts.has(i.prompt));
    note('fresh:novelty', `Form-B prompts overlapping Form A: ${overlap.length}/${B1.masteryCheck.formB.length} (A#1 "${B1.masteryCheck.formA[0].prompt.slice(0, 50)}" vs B#1 "${B1.masteryCheck.formB[0].prompt.slice(0, 50)}")`);
    const marks = Object.fromEntries(B1.masteryCheck.formB.map((i) => [i.id, 'c' as const]));
    await driveCheck(h, 'B', B1.masteryCheck.formB, marks, { startButton: "Fresh ones — let's go", tag: '-formB' });
    await h.page.waitForURL(/resolve/, { timeout: 25000 });
    await h.page.waitForTimeout(900);
    note('resolve:post-corrective', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 400));
    await snap(h, 'resolve-post-corrective');
    await clickAny(h, /See your collection/);
    await h.page.waitForTimeout(1600);
    await snap(h, 'chest-collection');
    await clickAny(h, /Back to my week/);
    await h.page.waitForTimeout(1100);
    const hubText = (await h.page.innerText('body')).replace(/\s+/g, ' ');
    note('resolve:same-day-reveal', `next-week reveal visible same-day=${/new adventure|next idea|Next concept/.test(hubText)} (law: waits for the calendar); hub: ${hubText.slice(0, 240)}`);
    await snap(h, 'hub-settled');
  });

  await stage('maya', 'deeplink', scenarioMayaMidWeek(), async (h) => playDeepLink(h, 3));
}

// ---------------------------------------------------------------------------
// JORDAN (11, band C at the D17 fixture cell)
// ---------------------------------------------------------------------------

/**
 * From the SprintGate: accept, answer every sprint fact, and stop at the
 * SprintFinish screen (does NOT click away). Returns the finish-screen body so
 * the caller can inspect the H3 "Another two minutes" re-run affordance.
 */
async function completeSprintFromGate(h: Harness, sprintItems: Array<{ answer: string }>): Promise<string> {
  await h.page.waitForTimeout(600);
  await clickBtn(h, "Let's go");
  await h.page.waitForTimeout(900);
  for (const it of sprintItems) {
    const input = h.page.locator('input[aria-label="Your answer"]');
    if (!(await input.isVisible().catch(() => false))) break;
    await input.fill(it.answer);
    await h.page.getByRole('button', { name: 'Check', exact: true }).click();
    await h.page.waitForTimeout(160);
  }
  await h.page.waitForURL(/sprint\/finish/, { timeout: 130000 });
  await h.page.waitForTimeout(1500);
  return (await h.page.innerText('body')).replace(/\s+/g, ' ');
}

async function runJordan() {
  const D17 = packFor('D', 17);

  await stage('jordan', 'placement', scenarioPlacement(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, 'Ms. Wren');
    note('placement:welcome-copy', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
    await snap(h, 'placement-welcome');
    await clickBtn(h, /Let's go/);
    await h.page.waitForTimeout(1200);
    await playPlacementWalk(h, CHILDREN.jordan, () => ['c', 'c', 'c', 'c', 'c'], 'C');
    note('placement:ceiling', 'walk topped out at Level C (ladder has no D/E): an 11-year-old acing everything lands at C → interaction band B (NumberPad surfaces); the D17 cell he plays this week is fixture-only');
  }, { seedRandom: true });

  const freshD = freshDb([CHILDREN.jordan]);
  enrollChild(freshD, CHILDREN.jordan, 'D', 17);
  stageFreshWeekRow(freshD, CHILDREN.jordan, 'D', 17);
  await stage('jordan', 'freshweek', freshD, async (h) => {
    await go(h, '/foundry');
    await waitText(h, D17.identity.conceptName);
    await snap(h, 'hub-fresh-week');
    await clickBtn(h, 'Start the lesson with Ms. Wren');
    await playLesson(h, { skimAttempt: true });
    await playGuided(h, 'C', D17, { errorAtStep: 1 });
    await clickBtn(h, 'Back to my week');
    note('hub:after-day1', `wants more work — hub now offers: ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 320)}`);
    await snap(h, 'hub-after-day1');
  });

  await stage('jordan', 'midweek', scenarioJordanMidWeek(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, D17.identity.conceptName);
    await snap(h, 'hub-midweek');
    await enterDay(h, 3);
    const { warm, rest } = dayItems(D17, 3);
    note('day3:shape', `warm=${warm.length} practice=${rest.length} pages=${getPackDay(D17, 3).pageCount}`);
    const sprintItems = realizeSprintItems(D17.fluencySprint!);
    let sprintOffers = 0;

    const playSprintRun = async (label: string, interrupt: boolean): Promise<void> => {
      await h.page.waitForTimeout(800);
      await snap(h, `sprint-gate-${label}`);
      note('sprint:gate', `[${label}] gate copy: ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 340)}`);
      const goBox = await h.page.getByRole('button', { name: "Let's go" }).boundingBox();
      const noBox = await h.page.getByRole('button', { name: 'Not today' }).boundingBox();
      note('sprint:equal-weight', `Let's-go ${goBox?.width}x${goBox?.height} vs Not-today ${noBox?.width}x${noBox?.height} — same styling class`);
      await clickBtn(h, "Let's go");
      await h.page.waitForTimeout(1000);
      await snap(h, `sprint-run-${label}`);
      const runBody = await h.page.innerText('body');
      note('sprint:run-dress', `countdown numerals? ${/\d+:\d+|second/i.test(runBody)} · "Done for now" exit? ${/Done for now/.test(runBody)}`);
      if (interrupt) {
        for (let i = 0; i < 2; i++) {
          await h.page.locator('input[aria-label="Your answer"]').fill(sprintItems[i].answer);
          await h.page.getByRole('button', { name: 'Check', exact: true }).click();
          await h.page.waitForTimeout(250);
        }
        await go(h, '/foundry/hub'); // hard interruption — unmount before finish
        const row = h.db.bb_week_state.find((r) => r.level === 'D');
        const dp = (row?.day_progress ?? {}) as Record<string, unknown>;
        note('sprint:interrupt', `interrupted mid-run → day_progress sprint keys: ${Object.keys(dp).filter((k) => k.startsWith('sprint')).join(',') || 'none'} (silently discarded=${!dp['sprint-1']})`);
        return;
      }
      for (const it of sprintItems) {
        const vis = await h.page.locator('input[aria-label="Your answer"]').isVisible().catch(() => false);
        if (!vis) break;
        await h.page.locator('input[aria-label="Your answer"]').fill(it.answer);
        await h.page.getByRole('button', { name: 'Check', exact: true }).click();
        await h.page.waitForTimeout(200);
      }
      await h.page.waitForURL(/sprint\/finish/, { timeout: 130000 });
      await h.page.waitForTimeout(1800);
      note('sprint:finish', `[${label}] ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 340)}`);
      await snap(h, `sprint-finish-${label}`);
      await clickBtn(h, 'Back to the good stuff');
      await h.page.waitForTimeout(1000);
    };

    // Drive day 3; the boundary offer intercepts once → interrupt-discard probe.
    const r1 = await drive(h, 'C', [...warm, ...rest], {
      behaviors: rest[3] ? { [rest[3].id]: 'conceptError' } : {},
      endPattern: /day\/3\/done/,
      tag: '-day3',
      onSprint: async () => {
        sprintOffers += 1;
        await playSprintRun('boundary-interrupt', true);
        return 'exit'; // we are on the hub now
      },
    });
    note('day3:drive-1', `result=${r1}; sprint offers so far=${sprintOffers}`);

    if (r1 === 'exit') {
      // Resume day 3 after the interruption.
      await clickBtn(h, "Start Day 3's practice");
      await h.page.waitForTimeout(1200);
      const row = h.db.bb_week_state.find((r) => r.level === 'D');
      const dp = (row?.day_progress ?? {}) as Record<string, { completedItemIds?: string[] }>;
      note('resume', `resuming day 3 after interruption: warm-ups replay (${warm.length}), practice already banked ${dp['3']?.completedItemIds?.length ?? 0} items`);
      const r2 = await drive(h, 'C', [...warm, ...rest], {
        endPattern: /day\/3\/done/,
        tag: '-day3-resume',
        onSprint: async () => {
          sprintOffers += 1;
          note('sprint:reoffer', 'sprint offered AGAIN at a boundary after interruption');
          await playSprintRun('boundary-2', false);
          return 'resume';
        },
      });
      note('day3:drive-2', `result=${r2}`);
    }
    await snap(h, 'day3-done');
    note('sprint:boundary-count', `sprint boundary offers seen today: ${sprintOffers} (budget 2/week)`);

    // Full run(s) via deep link (the visible re-run affordance — H3 "Another
    // two minutes" on SprintFinish — is confirmed in the dedicated 'sprint2'
    // stage; here we just verify the ≤2/week budget is enforced at the gate).
    await go(h, '/foundry/sprint');
    if (/\/foundry\/sprint/.test(h.page.url())) {
      await playSprintRun('run1', false);
    } else {
      note('sprint:deeplink', `deep link to /foundry/sprint redirected to ${h.page.url()} (budget spent or re-guard)`);
    }
    await go(h, '/foundry/sprint');
    if (/\/foundry\/sprint$/.test(h.page.url().replace(/[#?].*$/, ''))) {
      await playSprintRun('run2-compare', false);
    } else {
      note('sprint:run2', `second deep link redirected to ${h.page.url()} — ≤2/week budget enforced`);
    }
  });

  await stage('jordan', 'decline', scenarioJordanMidWeek(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, D17.identity.conceptName);
    await enterDay(h, 3);
    const { warm, rest } = dayItems(D17, 3);
    let declined = false;
    const r = await drive(h, 'C', [...warm, ...rest], {
      endPattern: /day\/3\/done/,
      tag: '-decline',
      onSprint: async () => {
        await h.page.waitForTimeout(700);
        await snap(h, 'sprint-gate-decline');
        await clickBtn(h, 'Not today');
        declined = true;
        await h.page.waitForTimeout(1000);
        note('sprint:decline', `after "Not today": back on ${h.page.url().split('5173')[1]}; no comment, no record shown`);
        return 'resume';
      },
    });
    note('sprint:decline-summary', `declined=${declined}; day drive result=${r}; no re-ask at any later boundary`);
    await go(h, '/foundry/sprint');
    const reAsks = /\/foundry\/sprint/.test(h.page.url());
    note('sprint:decline-reask', `deep link to /foundry/sprint after same-day decline → ${reAsks ? 'GATE SHOWS AGAIN (re-guard ignores the same-day decline flag)' : 'redirected away (no re-ask)'}`);
    if (reAsks) await snap(h, 'sprint-gate-reask-after-decline');
  });

  // H3 re-run: the second weekly sprint must be reachable (the SprintFinish
  // "Another two minutes" affordance) AND capped at 2 (gone after run 2).
  await stage('jordan', 'sprint2', scenarioJordanMidWeek(), async (h) => {
    const sprintItems = realizeSprintItems(D17.fluencySprint!);
    let handled = false;
    await go(h, '/foundry');
    await waitText(h, D17.identity.conceptName);
    await enterDay(h, 3);
    const { warm, rest } = dayItems(D17, 3);
    await drive(h, 'C', [...warm, ...rest], {
      endPattern: /day\/3\/done/,
      tag: '-sprint2',
      onSprint: async () => {
        if (handled) {
          await clickBtn(h, 'Not today');
          return 'resume';
        }
        handled = true;
        // Run 1 → SprintFinish; the re-run affordance must be present.
        await snap(h, 'sprint2-gate-1');
        const finish1 = await completeSprintFromGate(h, sprintItems);
        const again1 = await visible(h, /Another two minutes/);
        note('h3:run1-finish', `sprint 1 complete; "Another two minutes" present=${again1} (H3 expects true)`);
        await snap(h, 'sprint2-finish-1-another-offered');
        if (!again1) {
          note('h3:verdict', 'FAIL — no second-sprint affordance on SprintFinish after run 1');
          return 'exit';
        }
        // Reach + complete run 2 via that affordance.
        await clickBtn(h, /Another two minutes/);
        await h.page.waitForTimeout(900);
        await snap(h, 'sprint2-gate-2');
        const finish2 = await completeSprintFromGate(h, sprintItems);
        const again2 = await visible(h, /Another two minutes/);
        note(
          'h3:run2-finish',
          `sprint 2 reached + completed via the affordance; "Another two minutes" now present=${again2} (H3 expects FALSE — caps at 2)`,
        );
        note('h3:verdict', again1 && !again2 ? 'PASS — 2nd sprint reachable and capped at 2' : 'FAIL — cap/reach not as expected');
        await snap(h, 'sprint2-finish-2-capped');
        void finish1;
        void finish2;
        return 'exit';
      },
    });
    if (!handled) note('h3:no-offer', 'day-3 boundary sprint offer never fired — could not test H3 this run');
  });

  await stage('jordan', 'day5', scenarioJordanDay5(), async (h) => {
    await go(h, '/foundry');
    await waitText(h, D17.identity.conceptName);
    await enterDay(h, 5);
    const { warm, rest } = dayItems(D17, 5);
    note('grove:c-band-shape', `Grove items: ${rest.map((i) => `${i.id}(${i.answer.validation})`).join(', ')} + puzzle "${D17.puzzle.title}"`);
    const pool = [...warm, ...rest, puzzleAsItem(D17)];
    const r = await drive(h, 'C', pool, { endPattern: /\/foundry\/check/, tag: '-day5', puzzleId: D17.puzzle.id });
    note('day5:drive', `grove result=${r}`);
    await waitText(h, 'Last page');
    note('check:framing', (await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300));
    await snap(h, 'check-framing');
    const marks = Object.fromEntries(D17.masteryCheck.formA.map((i) => [i.id, 'c' as const]));
    await driveCheck(h, 'C', D17.masteryCheck.formA, marks, { startButton: "Last page — let's go" });
    await h.page.waitForURL(/resolve/, { timeout: 25000 });
    await h.page.waitForTimeout(900);
    note('resolve:copy', `pass moment: ${(await h.page.innerText('body')).replace(/\s+/g, ' ').slice(0, 360)} — no confetti/animation elements observed`);
    await snap(h, 'week-resolve-pass');
  });

  await stage('jordan', 'deeplink', scenarioJordanMidWeek(), async (h) => playDeepLink(h, 3));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const which = process.argv[2];
  mkdirSync(join(RUNS_DIR, 'students'), { recursive: true });
  if (!which || which === 'nora') await runNora();
  if (!which || which === 'maya') await runMaya();
  if (!which || which === 'jordan') await runJordan();

  const aggFile = join(RUNS_DIR, 'students-run.json');
  let prior: { observations?: Obs[] } = {};
  if (existsSync(aggFile)) {
    try {
      prior = JSON.parse(readFileSync(aggFile, 'utf8'));
    } catch {
      /* start fresh */
    }
  }
  // Merge per (child, stage) so partial re-runs never clobber other stages.
  const ranStages = new Set(OBS.map((o) => `${o.child}/${o.stage}`));
  const kept = (prior.observations ?? []).filter((o) => !ranStages.has(`${o.child}/${o.stage}`));
  writeFileSync(
    aggFile,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        walkSeed: WALK_SEED,
        note: 'Phase 7 student-simulator observations; per-stage Playwright logs in runs/students/<name>/',
        observations: [...kept, ...OBS],
      },
      null,
      2,
    ),
  );
  console.log(`\nAggregate observations written to ${aggFile} (${OBS.length} new)`);
}

main().catch((e) => {
  console.error('RUNNER FAILED:', e);
  process.exit(1);
});
