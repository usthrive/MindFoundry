/**
 * Phase 7 — PARENT-EVALUATOR run (persona: Anjali, PARENT-EVALUATOR.md).
 *
 * Scenario: scenarioParent — Maya passed 92% (report UNacknowledged),
 * Jordan near-miss 67% (one_more_round), Nora mid-week (no report yet).
 * Phone viewport. Drives every parent screen, verifies the acknowledge
 * PATCH at the wire level, toggles sprint opt-out (bb_enrollment.settings
 * write), cross-checks the child hub once for verdict/% leakage, and scans
 * every screen's text for brand leakage + gamification/ranking language.
 *
 * Run:  cd frontend && npx tsx ../modules/best-brains/testing/harness/run-parent.ts
 *
 * Hardening (first attempt lessons, 2026-07-20): Vite binds 127.0.0.1 only
 * (Node fetch resolves localhost→::1 — pass baseUrl explicitly); WSL2 sits
 * near its 4GB cap so Chrome can die mid-run — every stage is fenced,
 * the audit JSON is persisted incrementally, and waits key on the app's own
 * loading strings ("Setting up…" / "Opening the note…") instead of fixed
 * sleeps, because data fetches can take >2s after domcontentloaded.
 *
 * Outputs: screenshots/phase7/parent/ (+ parent-childcheck/ for the leak
 * cross-check), runs/parent-run.json, runs/parent-audit.json (raw evidence
 * consumed by PARENT-FINDINGS.md).
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { launchHarness, type Harness } from './harness';
import { scenarioParent, CHILDREN } from './fixtures';

const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = join(HARNESS_DIR, '..', 'runs');
const BASE_URL = 'http://127.0.0.1:5173';

// ---------------------------------------------------------------------------
// Text scans (brand leakage = CRITICAL; gamification/ranking = CRITICAL)
// ---------------------------------------------------------------------------

const BRAND_RES: RegExp[] = [
  /best\s*brains/i,
  /kumon/i,
  /bb\s*connect/i,
  /mathnasium/i,
  /sylvan/i,
  /huntington/i,
  /eye\s*level/i,
  /\bixl\b/i,
  /beast\s*academy/i,
  /khan\s*academy/i,
  /russian school/i,
  /\bRSM\b/,
];

const GAMIF_RES: RegExp[] = [
  /\bpoints\b/i,
  /\bbadges?\b/i,
  /troph(y|ies)/i,
  /streaks?\b/i,
  /leaderboards?\b/i,
  /\brank(ed|ing|s)?\b/i,
  /\brank\b/i,
  /percentile/i,
  /class\s*average/i,
  /children\s*(this|your)\s*age/i,
  /\bcompared?\b/i,
  /\bcomparisons?\b/i,
  /\bahead\b/i,
  /\bbehind\b/i,
  /\bmissed\b/i,
  /\bfail(ed|ure|ing)?\b/i,
  /\breview\b/i,
  /upgrade|unlock now|limited time|hurry|don'?t miss/i,
];

interface Hit {
  screen: string;
  kind: 'brand' | 'gamification';
  pattern: string;
  context: string;
}

const hits: Hit[] = [];

function scanText(screen: string, text: string) {
  const scan = (res: RegExp[], kind: Hit['kind']) => {
    for (const re of res) {
      const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      let m: RegExpExecArray | null;
      while ((m = g.exec(text)) !== null) {
        const start = Math.max(0, m.index - 70);
        const end = Math.min(text.length, m.index + m[0].length + 70);
        hits.push({
          screen,
          kind,
          pattern: re.source,
          context: text.slice(start, end).replace(/\s+/g, ' '),
        });
        if (hits.length > 400) return;
      }
    }
  };
  scan(BRAND_RES, 'brand');
  scan(GAMIF_RES, 'gamification');
}

// ---------------------------------------------------------------------------

interface Audit {
  screens: Record<string, { path: string; text: string; error?: string }>;
  stageErrors: string[];
  reportMaya?: Record<string, unknown>;
  reportJordan?: Record<string, unknown>;
  acknowledge?: Record<string, unknown>;
  controls?: Record<string, unknown>;
  childCheck?: Record<string, unknown>;
  loadFailure?: Record<string, unknown>;
  hits: Hit[];
  unexpectedConsole?: unknown[];
}

const audit: Audit = { screens: {}, stageErrors: [], hits };

function saveAudit() {
  writeFileSync(join(RUNS_DIR, 'parent-audit.json'), JSON.stringify(audit, null, 2));
}

const LOADING_RE = /Setting up…|Opening the note…/;

/** Optional subset: PARENT_STAGES=load-failure npx tsx run-parent.ts */
const PARENT_STAGES = (process.env.PARENT_STAGES ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/** Fenced stage runner — one failure never aborts the rest of the drive. */
async function stage(name: string, fn: () => Promise<void>) {
  if (PARENT_STAGES.length && !PARENT_STAGES.includes(name)) return;
  try {
    await fn();
  } catch (e) {
    audit.stageErrors.push(`${name}: ${String(e)}`);
  }
  saveAudit();
}

/**
 * Under parallel-run contention the dev server can leave a page in
 * "Setting up…" for minutes. Wait long, verify the loading text actually
 * cleared AND real content rendered (E2: a screenshot must never be a
 * "Setting up…" placeholder), reload-and-retry up to twice before giving up.
 */
async function settle(h: Harness) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const cleared = await h.page
      .waitForFunction(
        (reSrc: string) => {
          const t = document.body.innerText;
          // E2 ready-gate: loading text gone AND meaningful content present.
          return !new RegExp(reSrc).test(t) && t.replace(/\s+/g, ' ').trim().length > 120;
        },
        LOADING_RE.source,
        { timeout: 90000 },
      )
      .then(() => true)
      .catch(() => false);
    if (cleared) break;
    await h.page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => undefined);
  }
  await h.page.waitForTimeout(1500);
}

/** E2: assert a screen-specific string before treating a capture as valid. */
async function assertReady(h: Harness, needle: RegExp, label: string): Promise<boolean> {
  const ok = await h.page
    .waitForFunction((src: string) => new RegExp(src).test(document.body.innerText), needle.source, { timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!ok) audit.stageErrors.push(`ready-assert failed on ${label}: expected ${needle}`);
  return ok;
}

async function visit(h: Harness, path: string, label: string): Promise<string> {
  await h.page.goto(h.url(path), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await settle(h);
  const text = await h.page.evaluate(() => document.body.innerText);
  await h.shot(label, { fullPage: true });
  await h.step(`visited ${label}`, path);
  audit.screens[label] = { path, text };
  scanText(label, text);
  return text;
}

function countOcc(text: string, re: RegExp): number {
  return (text.match(new RegExp(re.source, re.flags + 'g')) ?? []).length;
}

async function redElements(h: Harness): Promise<string[]> {
  return h.page.evaluate(() => {
    const reds: string[] = [];
    document.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      for (const prop of ['color', 'backgroundColor', 'borderColor'] as const) {
        const v = cs[prop];
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(v);
        if (!m) continue;
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const a = m[4] === undefined ? 1 : Number(m[4]);
        if (a > 0.05 && r > 150 && r > g + 60 && r > b + 60) {
          reds.push(
            `${el.tagName}.${(el as HTMLElement).className} ${prop}=${v} text="${(el.textContent ?? '').slice(0, 40)}"`,
          );
        }
      }
    });
    return reds.slice(0, 20);
  });
}

async function reportForensics(h: Harness): Promise<Record<string, unknown>> {
  const bodyText = await h.page.evaluate(() => document.body.innerText);
  const reportBody = await h.page
    .locator('.mf-report-body')
    .first()
    .evaluate((el) => (el as HTMLElement).innerText)
    .catch(() => '');
  const verdictStyle = await h.page
    .locator('.mf-verdict')
    .first()
    .evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        text: el.textContent,
        color: cs.color,
        textDecorationLine: cs.textDecorationLine,
        fontFamily: cs.fontFamily.slice(0, 60),
        fontWeight: cs.fontWeight,
        background: cs.backgroundColor,
      };
    })
    .catch(() => null);
  return {
    percentSigns: countOcc(bodyText, /%/),
    reportWordCount: reportBody.split(/\s+/).filter(Boolean).length,
    verdictStyle,
    redElements: await redElements(h),
    hasReviewWord: /\breview\b/i.test(bodyText),
    hasFailedWord: /\bfail(ed|ure)?\b/i.test(bodyText),
  };
}

// ---------------------------------------------------------------------------

async function main() {
  const h = await launchHarness({
    persona: 'parent',
    db: scenarioParent(),
    viewport: 'parent',
    baseUrl: BASE_URL,
  });

  // 1 — ParentWelcome (onboarding cards + expandable verdict pre-framing)
  await stage('welcome', async () => {
    await h.page.goto(h.url('/foundry/parent/welcome'), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await settle(h);
    let text = await h.page.evaluate(() => document.body.innerText);
    audit.screens['welcome'] = { path: '/foundry/parent/welcome', text };
    scanText('welcome', text);
    await h.shot('welcome-cards', { fullPage: true });
    await h.page.locator('button', { hasText: 'About "Passed" and "One more round"' }).click();
    await h.page.waitForTimeout(600);
    text = await h.page.evaluate(() => document.body.innerText);
    audit.screens['welcome-expanded'] = { path: '/foundry/parent/welcome', text };
    scanText('welcome-expanded', text);
    await h.shot('welcome-verdict-preframing-open', { fullPage: true });
  });

  // 2 — ParentHome: three children, three states
  await stage('parent-home', async () => {
    await visit(h, '/foundry/parent', 'parent-home');
  });

  // 3 — WeeklyReport: Maya (passed 92) [Q1 — verdict + % live only here]
  await stage('report-maya', async () => {
    await h.page.goto(h.url(`/foundry/parent/report/${CHILDREN.maya.id}/B/1`), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await settle(h);
    const ready = await assertReady(h, /weekly check|What we worked on/, 'report-maya-passed');
    const text = await h.page.evaluate(() => document.body.innerText);
    await h.shot('report-maya-passed', { fullPage: true });
    audit.screens['report-maya-passed'] = { path: `/foundry/parent/report/${CHILDREN.maya.id}/B/1`, text };
    scanText('report-maya-passed', text);
    audit.reportMaya = { ready, ...(await reportForensics(h)) };
  });

  // 4 — WeeklyReport: Jordan (one_more_round 67)
  await stage('report-jordan', async () => {
    await h.page.goto(h.url(`/foundry/parent/report/${CHILDREN.jordan.id}/D/17`), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await settle(h);
    const ready = await assertReady(h, /What we worked on|one more round|weekly check/, 'report-jordan-one-more-round');
    const text = await h.page.evaluate(() => document.body.innerText);
    await h.shot('report-jordan-one-more-round', { fullPage: true });
    audit.screens['report-jordan-one-more-round'] = { path: `/foundry/parent/report/${CHILDREN.jordan.id}/D/17`, text };
    scanText('report-jordan-one-more-round', text);
    audit.reportJordan = { ready, ...(await reportForensics(h)) };
  });

  // 5 — Acknowledge tap on Maya's report (the wire-level write check)
  await stage('acknowledge', async () => {
    await h.page.goto(h.url(`/foundry/parent/report/${CHILDREN.maya.id}/B/1`), { waitUntil: 'domcontentloaded', timeout: 90000 });
    await settle(h);
    const ackBtn = h.page.locator('.mf-ack-btn');
    const ackLabelText = await ackBtn.textContent();
    const writesBefore = h.dbWrites().length;
    await ackBtn.click();
    await h.page.waitForTimeout(1800);
    await h.shot('report-maya-acknowledged', { fullPage: true });
    const ackWrites = h.dbWrites().slice(writesBefore).filter((w) => w.path.includes('bb_parent_reports'));
    const settledText = await h.page.evaluate(() => document.body.innerText);
    // reload — persistence within the session
    await h.page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
    await settle(h);
    const reloadedText = await h.page.evaluate(() => document.body.innerText);
    await h.shot('report-maya-after-reload', { fullPage: true });
    audit.acknowledge = {
      buttonLabel: ackLabelText,
      wireWrites: ackWrites,
      allWriteKeys: ackWrites.map((w) => (w.body && typeof w.body === 'object' ? Object.keys(w.body as object) : null)),
      settledCopy: settledText.split('\n').filter((l) => /Seen|counted/i.test(l)),
      persistsAfterReload:
        /will know their\s*\n?\s*week counted/.test(reloadedText) && !reloadedText.includes(ackLabelText ?? '@@none@@'),
      reloadedAckLines: reloadedText.split('\n').filter((l) => /Seen|counted/i.test(l)),
    };
    scanText('report-maya-acknowledged', settledText);
  });

  // 6 — ReportHistory (acknowledgment visible?)
  await stage('history', async () => {
    await visit(h, `/foundry/parent/history/${CHILDREN.maya.id}`, 'history-maya');
  });

  // 7/8 — TrendsView + MasteryMap
  await stage('trends', async () => {
    await visit(h, `/foundry/parent/trends/${CHILDREN.maya.id}`, 'trends-maya');
  });
  await stage('mastery', async () => {
    await visit(h, `/foundry/parent/mastery/${CHILDREN.maya.id}`, 'mastery-maya');
  });

  // 9 — PatternsView
  await stage('patterns', async () => {
    await visit(h, `/foundry/parent/patterns/${CHILDREN.maya.id}`, 'patterns-maya');
  });

  // 10 — CoachCorner: Maya (passed) and Jordan (one_more_round — praise must survive)
  await stage('coach-maya', async () => {
    await visit(h, `/foundry/parent/coach/${CHILDREN.maya.id}`, 'coach-maya');
  });
  await stage('coach-jordan', async () => {
    await visit(h, `/foundry/parent/coach/${CHILDREN.jordan.id}`, 'coach-jordan-one-more-round');
  });

  // 11 — PlacementStory (Q6: neutral letter + parent-only context)
  await stage('story', async () => {
    await visit(h, `/foundry/parent/story/${CHILDREN.maya.id}`, 'story-maya');
  });

  // 12 — SchoolSync
  await stage('school', async () => {
    await visit(h, `/foundry/parent/school/${CHILDREN.maya.id}`, 'school-maya');
  });

  // 13 — ParentControls + sprint opt-out toggle (wire check on bb_enrollment.settings)
  await stage('controls', async () => {
    await visit(h, `/foundry/parent/controls/${CHILDREN.maya.id}`, 'controls-maya');
    const sprintSwitch = h.page.getByRole('switch').first();
    const beforeChecked = await sprintSwitch.getAttribute('aria-checked');
    const writesBeforeToggle = h.dbWrites().length;
    await sprintSwitch.click();
    await h.page.waitForTimeout(1800);
    const afterChecked = await sprintSwitch.getAttribute('aria-checked');
    const toggleWrites = h.dbWrites().slice(writesBeforeToggle).filter((w) => w.path.includes('bb_enrollment'));
    await h.shot('controls-maya-sprint-toggled', { fullPage: true });
    audit.controls = { beforeChecked, afterChecked, wireWrites: toggleWrites };
  });

  audit.unexpectedConsole = h.consoleEntries().filter((c) => !c.known);
  const status = audit.stageErrors.length === 0 ? 'ok' : 'failed';
  saveAudit();
  try {
    await h.finish(status, audit.stageErrors.join(' | ') || 'parent surface drive complete');
  } catch (e) {
    audit.stageErrors.push(`finish: ${String(e)}`);
    saveAudit();
  }

  // ---- Child-hub cross-check (Q4/Q6: verdict + % must NOT leak) -----------
  await stage('child-check', async () => {
    const hc = await launchHarness({
      persona: 'parent-childcheck',
      db: scenarioParent(),
      viewport: 'child',
      selectedChildId: CHILDREN.maya.id,
      baseUrl: BASE_URL,
    });
    try {
      await hc.page.goto(hc.url('/foundry'), { waitUntil: 'domcontentloaded', timeout: 120000 });
      await hc.page
        .waitForFunction(() => document.body.innerText.replace(/\s+/g, ' ').length > 250, undefined, { timeout: 90000 })
        .catch(() => undefined);
      await hc.page.waitForTimeout(4000);
      const childText = await hc.page.evaluate(() => document.body.innerText);
      await hc.shot('child-hub-crosscheck', { fullPage: true });
      audit.childCheck = {
        url: hc.page.url(),
        percentSigns: countOcc(childText, /%/),
        has92: /\b92\b/.test(childText),
        hasPassedWord: /\bpassed\b/i.test(childText),
        hasReviewWord: /\breview\b/i.test(childText),
        text: childText,
      };
      scanText('child-hub-crosscheck', childText);
    } finally {
      await hc.finish('ok', 'leak cross-check').catch(() => undefined);
    }
  });

  // ---- H4 re-run: parent-surface load failure → calm retry, not "not started"
  await stage('load-failure', async () => {
    // Persistent fault (not one-shot): StrictMode double-invokes the layout's
    // refresh() effect, so a one-shot 500 self-heals on the second fetch before
    // capture. Failing every bb_enrollment GET makes loadError stable → the calm
    // card reliably renders. The array is shared by reference with the mock
    // handler, so zeroing `times` mid-stage disables the fault to prove recovery.
    const faults = [{ table: 'bb_enrollment', method: 'GET' as const, status: 500, times: 999 }];
    const hf = await launchHarness({
      persona: 'parent-loadfail',
      db: scenarioParent(),
      viewport: 'parent',
      baseUrl: BASE_URL,
      faults,
    });
    try {
      await hf.page.goto(hf.url('/foundry/parent'), { waitUntil: 'domcontentloaded', timeout: 90000 });
      await hf.page
        .waitForFunction(
          () => /Couldn't load this just now|not started/i.test(document.body.innerText),
          undefined,
          { timeout: 60000 },
        )
        .catch(() => undefined);
      await hf.page.waitForTimeout(1200);
      const errText = await hf.page.evaluate(() => document.body.innerText);
      const calmCard = /Couldn't load this just now/.test(errText) && /Try again/.test(errText);
      const misleadingNotStarted = /not started/i.test(errText);
      await hf.shot('h4-load-failure-retry-card', { fullPage: true });
      // Disable the fault (shared array), then Try again → the surface recovers.
      faults[0].times = 0;
      let recovered = false;
      const retry = hf.page.getByRole('button', { name: /Try again/ }).first();
      if (await retry.isVisible().catch(() => false)) {
        await retry.click();
        await hf.page
          .waitForFunction(() => !/Couldn't load this just now/.test(document.body.innerText) && document.body.innerText.replace(/\s+/g, ' ').length > 200, undefined, { timeout: 60000 })
          .catch(() => undefined);
        await hf.page.waitForTimeout(1200);
        const okText = await hf.page.evaluate(() => document.body.innerText);
        recovered = !/Couldn't load this just now/.test(okText) && !/not started/i.test(okText) && /This week|Level [ABD]/.test(okText);
        await hf.shot('h4-recovered-after-retry', { fullPage: true });
      }
      audit.loadFailure = {
        calmCardShown: calmCard,
        misleadingNotStartedShown: misleadingNotStarted,
        recoveredOnRetry: recovered,
        h4Pass: calmCard && !misleadingNotStarted && recovered,
      };
      scanText('h4-load-failure', errText);
    } finally {
      await hf.finish('ok', 'H4 load-failure probe').catch(() => undefined);
    }
  });

  saveAudit();
  console.log('PARENT RUN DONE. stage errors:', audit.stageErrors.length ? audit.stageErrors : 'none');
  console.log('H4 load-failure:', JSON.stringify(audit.loadFailure));
}

main();
