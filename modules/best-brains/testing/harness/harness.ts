/**
 * Phase 7 persona harness — shared Playwright driver with a mocked Supabase
 * backend (the increment-5 pattern, rebuilt as a reusable library).
 *
 * WHY MOCKED: headless signup against the live project is email-confirmation
 * blocked and anonymous sign-in is disabled (BROWSER-TESTING-TOOLING §auth,
 * BUILD-NOTES increment 5). So the harness seeds a fake session into
 * localStorage and intercepts EVERY request to the Supabase host, serving it
 * from an in-memory DB built by fixtures.ts. The live DB is never touched.
 *
 * USAGE (from the repo's frontend dir so tsx + playwright-core resolve):
 *
 *   cd frontend && npm run dev          # terminal 1 (Vite, port 5173)
 *   cd frontend && npx tsx ../modules/best-brains/testing/harness/sanity-run.ts
 *
 * A runner script does:
 *
 *   import { launchHarness } from './harness';
 *   import { scenarioMayaMidWeek, CHILDREN } from './fixtures';
 *   const h = await launchHarness({
 *     persona: 'student-maya',
 *     db: scenarioMayaMidWeek(),
 *     viewport: 'child',                       // tablet landscape
 *     selectedChildId: CHILDREN.maya.id,       // child flows need this
 *   });
 *   await h.page.goto(h.url('/foundry'));
 *   await h.step('hub loaded');
 *   await h.shot('hub');                       // → screenshots/phase7/student-maya/01-hub.png
 *   ...
 *   await h.finish('ok');                      // → runs/student-maya-run.json
 *
 * WHAT THE MOCK COVERS vs NOT:
 *  - Covered: auth session, children/users reads, all bb_* table reads/writes
 *    (with the live guard-trigger semantics mirrored: illegal bb_week_state
 *    state/mastery writes and non-acknowledged_at report writes are REJECTED),
 *    and an honest emulation of the bb_score_mastery_check RPC (DD1 routing +
 *    LS1-R5 stability, same thresholds, report upsert from the pack's
 *    parentSummarySeed).
 *  - NOT covered: the real server-side RPC/trigger code paths (verified live
 *    in increment 4), RLS, offline sync. Runners must not claim server-side
 *    verification from harness runs.
 */

import { createRequire } from 'module';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { MockDb } from './fixtures';

// playwright-core lives in frontend/node_modules (devDependency, no browsers).
const HARNESS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HARNESS_DIR, '..', '..', '..', '..');
const FRONTEND_DIR = join(REPO_ROOT, 'frontend');
const TESTING_DIR = join(REPO_ROOT, 'modules', 'best-brains', 'testing');
const requireFrontend = createRequire(join(FRONTEND_DIR, 'package.json'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { chromium } = requireFrontend('playwright-core') as typeof import('playwright-core');
type Page = import('playwright-core').Page;
type Route = import('playwright-core').Route;

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

function readSupabaseUrl(): string {
  const env = readFileSync(join(FRONTEND_DIR, '.env'), 'utf8');
  const m = env.match(/^VITE_SUPABASE_URL=(.+)$/m);
  if (!m) throw new Error('VITE_SUPABASE_URL not found in frontend/.env');
  return m[1].trim();
}

export const SUPABASE_URL = readSupabaseUrl();
export const SUPABASE_HOST = new URL(SUPABASE_URL).host;
const PROJECT_REF = SUPABASE_HOST.split('.')[0];
const STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

export const VIEWPORTS = {
  /** Child surfaces: tablet landscape (P10 tablet-first posture). */
  child: { width: 1180, height: 820 },
  /** Parent surfaces: phone (PARENT-FLOWS phone-first law). */
  parent: { width: 390, height: 844 },
} as const;

/**
 * Screenshot root under testing/screenshots/. The fix-loop re-run sets
 * PHASE7_SHOTS=phase7-rerun so honest re-run captures land beside — not on top
 * of — the original (partly vacuous) phase7 evidence.
 */
const SHOTS_ROOT = process.env.PHASE7_SHOTS || 'phase7';

/**
 * Fault injection (H4 re-run): fail the first `times` matching table requests,
 * then serve normally — exercises the parent-surface load-failure → calm-retry
 * → recovery path without any app-source change.
 */
export interface HarnessFault {
  table: string;
  method?: string; // default GET
  status?: number; // default 500
  times: number;
}

/** Console noise known to pre-date the module (BUILD-NOTES inc-5 smoke). */
const KNOWN_NOISE: RegExp[] = [
  /generate-speech/i,
  /Failed to load resource/i,
  /net::ERR_ABORTED/i,
  /celebration/i,
  /subscription/i,
  /AudioContext/i,
  /React Router Future Flag/i,
  /\[TTS\] Browser voices/i,
  /Service Worker registration blocked by Playwright/i,
];

// ---------------------------------------------------------------------------
// Fake session
// ---------------------------------------------------------------------------

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function fakeSession(user: Record<string, unknown>) {
  const nowSec = Math.floor(Date.now() / 1000);
  const authUser = {
    id: user.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: user.email,
    email_confirmed_at: '2026-06-01T09:00:00.000Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { full_name: user.full_name },
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  const jwt = [
    b64url({ alg: 'HS256', typ: 'JWT' }),
    b64url({ sub: user.id, role: 'authenticated', email: user.email, exp: nowSec + 86400 }),
    'phase7-mock-signature',
  ].join('.');
  return {
    access_token: jwt,
    token_type: 'bearer',
    expires_in: 86400,
    expires_at: nowSec + 86400,
    refresh_token: 'phase7-mock-refresh',
    user: authUser,
  };
}

// ---------------------------------------------------------------------------
// PostgREST emulation
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

interface Pred {
  col: string;
  op: string;
  val: string;
}

function parsePreds(sp: URLSearchParams): Pred[] {
  const reserved = new Set(['select', 'order', 'limit', 'offset', 'apikey', 'on_conflict', 'columns']);
  const preds: Pred[] = [];
  for (const [k, v] of sp.entries()) {
    if (reserved.has(k)) continue;
    const dot = v.indexOf('.');
    if (dot < 0) continue;
    let op = v.slice(0, dot);
    let val = v.slice(dot + 1);
    if (op === 'not') {
      const dot2 = val.indexOf('.');
      op = `not.${val.slice(0, dot2)}`;
      val = val.slice(dot2 + 1);
    }
    preds.push({ col: k, op, val });
  }
  return preds;
}

function matches(row: Row, p: Pred): boolean {
  const cell = row[p.col];
  switch (p.op) {
    case 'eq':
      return String(cell) === p.val;
    case 'neq':
      return String(cell) !== p.val;
    case 'is':
      return p.val === 'null' ? cell === null || cell === undefined : String(cell) === p.val;
    case 'not.is':
      return p.val === 'null' ? cell !== null && cell !== undefined : String(cell) !== p.val;
    case 'in': {
      const list = p.val.replace(/^\(|\)$/g, '').split(',').map((s) => s.replace(/^"|"$/g, ''));
      return list.includes(String(cell));
    }
    case 'like': {
      const re = new RegExp(
        '^' + p.val.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/[%*]/g, '.*') + '$',
      );
      return re.test(String(cell));
    }
    case 'gte':
      return String(cell) >= p.val;
    case 'lte':
      return String(cell) <= p.val;
    case 'gt':
      return String(cell) > p.val;
    case 'lt':
      return String(cell) < p.val;
    default:
      return true; // unknown operator: don't silently filter rows out
  }
}

function applyOrder(rows: Row[], orderParam: string | null): Row[] {
  if (!orderParam) return rows;
  const [col, dir] = orderParam.split('.');
  const sorted = [...rows].sort((a, b) => (String(a[col]) < String(b[col]) ? -1 : String(a[col]) > String(b[col]) ? 1 : 0));
  return dir === 'desc' ? sorted.reverse() : sorted;
}

const WEEK_STATE_DEFAULTS: Row = {
  state: 'not_started',
  day_progress: {},
  mastery: { attempts: [] },
  started_at: null,
  completed_at: null,
  content_version: null,
};

const ENROLLMENT_DEFAULTS: Row = {
  settings: { sprintOptOut: false, sessionLength: 'standard' },
  placed_at: null,
  placement_result: null,
  current_week: 1,
};

/** Client-legal bb_week_state edges — everything else the live trigger rejects. */
const CLIENT_LEGAL_EDGES: Record<string, string[]> = {
  not_started: ['in_week'],
  in_week: ['mastery_check'],
};

// ---------------------------------------------------------------------------
// Mastery RPC emulation (mirrors supabase/migrations/20260719000002)
// ---------------------------------------------------------------------------

const MASTERY_THRESHOLD_PCT = 85;
const FAST_TRACK_PCT = 95;
const STABILITY_MIN_PCT = 75;

interface RpcAnswer {
  itemId: string;
  answer: string;
  correct: boolean;
  errorTag: string | null;
}

function scoreMasteryEmulated(db: MockDb, body: Record<string, unknown>, log: (e: string) => void): Row {
  const childId = body.p_child_id as string;
  const level = body.p_level as string;
  const week = body.p_week as number;
  const form = body.p_form as 'A' | 'B';
  const answers = body.p_answers as RpcAnswer[];
  const seed = body.p_summary_seed as Record<string, unknown>;

  const ws = db.bb_week_state.find(
    (r) => r.child_id === childId && r.level === level && Number(r.week) === Number(week),
  );
  if (!ws) throw new Error(`RPC: no bb_week_state row for ${childId} ${level}${week}`);

  const state = ws.state as string;
  if (form === 'A' && !['in_week', 'mastery_check'].includes(state))
    throw new Error(`RPC: Form A illegal from state ${state}`);
  if (form === 'B' && !['near_miss_cycle1', 'cycle2'].includes(state))
    throw new Error(`RPC: Form B illegal from state ${state}`);

  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const scorePct = Math.round((100 * correct) / Math.max(1, total));

  // Dominant DD7 tags among misses (top 2)
  const tagCounts = new Map<string, number>();
  for (const a of answers) if (!a.correct && a.errorTag) tagCounts.set(a.errorTag, (tagCounts.get(a.errorTag) ?? 0) + 1);
  const dominant = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t);

  // LS1-R5 stability: any DONE practice day (2–4) with first-attempt accuracy < 75
  const dp = (ws.day_progress ?? {}) as Record<string, Record<string, unknown>>;
  let stabilityHold = false;
  for (const d of ['2', '3', '4']) {
    const e = dp[d];
    if (e && e.state === 'done' && typeof e.accuracyPct === 'number' && (e.accuracyPct as number) < STABILITY_MIN_PCT)
      stabilityHold = true;
  }

  const cycle = form === 'A' ? 0 : state === 'near_miss_cycle1' ? 1 : 2;
  let nextState: string;
  if (form === 'A') {
    if (scorePct >= MASTERY_THRESHOLD_PCT && !stabilityHold) nextState = 'passed';
    else nextState = 'near_miss_cycle1';
  } else if (cycle === 1) {
    if (scorePct >= FAST_TRACK_PCT) nextState = 'fast_track';
    else if (scorePct >= MASTERY_THRESHOLD_PCT) nextState = 'passed';
    else nextState = 'cycle2';
  } else {
    nextState = scorePct >= MASTERY_THRESHOLD_PCT ? 'passed' : 'escalated';
  }
  const holdApplied = form === 'A' && scorePct >= MASTERY_THRESHOLD_PCT && stabilityHold;

  const mastery = (ws.mastery ?? { attempts: [] }) as { attempts: Row[]; [k: string]: unknown };
  mastery.attempts = [...(mastery.attempts ?? []), {
    form,
    cycle,
    scorePct,
    attemptedAt: new Date().toISOString(),
    dominantErrorTags: dominant,
    ...(holdApplied ? { stabilityHold: true } : {}),
  }];
  if (nextState === 'passed' || nextState === 'fast_track') {
    mastery.finalScorePct = scorePct;
    ws.completed_at = new Date().toISOString();
  }
  if (nextState === 'escalated') {
    mastery.escalatedAt = new Date().toISOString();
    mastery.placementRecheckRequested = true;
  }
  ws.mastery = mastery;
  ws.state = nextState;

  const verdict = nextState === 'passed' || nextState === 'fast_track'
    ? 'passed'
    : nextState === 'escalated'
      ? 'escalated'
      : 'one_more_round';

  // Report upsert from the pack's parentSummarySeed (E102 four-field frame)
  const strengtheningByTag = (seed.strengtheningByTag ?? []) as Array<{ errorTag: string; text: string }>;
  const strengthening =
    strengtheningByTag.find((s) => s.errorTag === dominant[0])?.text ?? strengtheningByTag[0]?.text ?? '';
  const improving = ((seed.improvingCandidates ?? []) as string[])[0] ?? '';
  const existingIdx = db.bb_parent_reports.findIndex(
    (r) => r.child_id === childId && r.level === level && Number(r.week) === Number(week),
  );
  const report: Row = {
    child_id: childId,
    level,
    week,
    narrative: {
      whatWeWorkedOn: seed.whatWeWorkedOn ?? '',
      improving,
      strengthening,
      homeFocus: seed.homeFocus ?? {},
      teacherNarrative:
        verdict === 'passed'
          ? 'A steady week, closed with the concept owned.'
          : verdict === 'escalated'
            ? 'Two rounds in, this one is still fighting back — a live teacher will pick it up; the calibration is ours to fix.'
            : 'Steady work all week; one step gets one more round, and the plan is already set.',
    },
    verdict,
    percent: scorePct,
    acknowledged_at: null,
    created_at: existingIdx >= 0 ? db.bb_parent_reports[existingIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (existingIdx >= 0) db.bb_parent_reports[existingIdx] = report;
  else db.bb_parent_reports.push(report);

  log(`rpc bb_score_mastery_check: form ${form} score ${scorePct}% -> ${nextState} (verdict ${verdict}${holdApplied ? ', stability hold' : ''})`);
  return { state: nextState, score_pct: scorePct, verdict, stability_hold: holdApplied };
}

// ---------------------------------------------------------------------------
// The route handler
// ---------------------------------------------------------------------------

interface DbWrite {
  ts: string;
  method: string;
  path: string;
  body: unknown;
  outcome: 'applied' | 'rejected';
  note?: string;
}

function jsonHeaders(extra: Record<string, string> = {}) {
  return { 'content-type': 'application/json', 'access-control-allow-origin': '*', ...extra };
}

function makeSupabaseHandler(
  db: MockDb,
  session: Row,
  writes: DbWrite[],
  log: (e: string) => void,
  faults: HarnessFault[] = [],
) {
  const tableOf = (): Record<string, Row[]> => ({
    children: db.children,
    users: [db.user as Row],
    bb_enrollment: db.bb_enrollment,
    bb_week_state: db.bb_week_state,
    bb_item_attempts: db.bb_item_attempts,
    bb_parent_reports: db.bb_parent_reports,
    subscription_tiers: [],
    scholarship_requests: [],
  });

  return async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const path = url.pathname;

    const fulfillJson = (status: number, body: unknown, headers: Record<string, string> = {}) =>
      route.fulfill({ status, headers: jsonHeaders(headers), body: JSON.stringify(body) });

    try {
      if (method === 'OPTIONS') {
        return route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-headers': '*',
            'access-control-allow-methods': '*',
          },
        });
      }

      // ---- auth ----
      if (path.startsWith('/auth/v1/')) {
        if (path.endsWith('/token')) return fulfillJson(200, session);
        if (path.endsWith('/user')) return fulfillJson(200, session.user as Row);
        if (path.endsWith('/logout')) return route.fulfill({ status: 204, headers: jsonHeaders() });
        return fulfillJson(200, {});
      }

      // ---- edge functions: mocked out (browser TTS fallback takes over) ----
      if (path.startsWith('/functions/v1/')) {
        return fulfillJson(404, { error: 'phase7-harness: edge functions mocked out' });
      }

      // ---- RPC ----
      if (path === '/rest/v1/rpc/bb_score_mastery_check') {
        const body = req.postDataJSON() as Record<string, unknown>;
        try {
          const result = scoreMasteryEmulated(db, body, log);
          writes.push({ ts: new Date().toISOString(), method, path, body, outcome: 'applied' });
          return fulfillJson(200, result);
        } catch (e) {
          writes.push({ ts: new Date().toISOString(), method, path, body, outcome: 'rejected', note: String(e) });
          return fulfillJson(400, { code: 'P0001', message: String(e) });
        }
      }
      if (path.startsWith('/rest/v1/rpc/')) return fulfillJson(404, { message: `phase7-harness: unmocked rpc ${path}` });

      // ---- tables ----
      if (path.startsWith('/rest/v1/')) {
        const table = path.slice('/rest/v1/'.length);
        // H4 fault injection: fail the first N matching requests, then recover.
        const fault = faults.find((f) => f.table === table && (f.method ?? 'GET') === method && f.times > 0);
        if (fault) {
          fault.times -= 1;
          writes.push({ ts: new Date().toISOString(), method, path, body: null, outcome: 'rejected', note: `injected fault ${fault.status ?? 500}` });
          log(`injected fault: ${method} ${table} -> ${fault.status ?? 500} (${fault.times} remaining)`);
          return fulfillJson(fault.status ?? 500, { message: 'phase7-harness: injected load fault', code: 'PGRSTXXX' });
        }
        const tables = tableOf();
        const rows = tables[table];
        const preds = parsePreds(url.searchParams);
        const wantsObject = (req.headers()['accept'] ?? '').includes('vnd.pgrst.object');
        const prefer = req.headers()['prefer'] ?? '';

        if (rows === undefined) {
          // Unknown table: benign empty responses keep unrelated app chrome alive.
          if (method === 'GET' || method === 'HEAD') return fulfillJson(200, []);
          return route.fulfill({ status: 204, headers: jsonHeaders() });
        }

        if (method === 'HEAD') {
          const matched = rows.filter((r) => preds.every((p) => matches(r, p)));
          return route.fulfill({
            status: 200,
            headers: jsonHeaders({ 'content-range': `0-${Math.max(0, matched.length - 1)}/${matched.length}` }),
            body: '',
          });
        }

        if (method === 'GET') {
          let matched = rows.filter((r) => preds.every((p) => matches(r, p)));
          matched = applyOrder(matched, url.searchParams.get('order'));
          const limit = url.searchParams.get('limit');
          if (limit) matched = matched.slice(0, Number(limit));
          if (wantsObject) {
            if (matched.length === 1) return fulfillJson(200, matched[0]);
            return fulfillJson(406, {
              code: 'PGRST116',
              message: 'JSON object requested, multiple (or no) rows returned',
              details: `Results contain ${matched.length} rows`,
            });
          }
          return fulfillJson(200, matched);
        }

        if (method === 'POST') {
          const body = req.postDataJSON() as Row | Row[];
          const incoming = Array.isArray(body) ? body : [body];
          const created: Row[] = [];
          for (const item of incoming) {
            const defaults =
              table === 'bb_week_state' ? WEEK_STATE_DEFAULTS : table === 'bb_enrollment' ? ENROLLMENT_DEFAULTS : {};
            const row: Row = { created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...structuredClone(defaults), ...item };
            if (table === 'bb_item_attempts' && !row.id) row.id = `p7-live-${Math.random().toString(36).slice(2, 10)}`;
            // upsert resolution (merge-duplicates) on the table's natural key
            const keyCols =
              table === 'bb_enrollment'
                ? ['child_id']
                : table === 'bb_week_state' || table === 'bb_parent_reports'
                  ? ['child_id', 'level', 'week']
                  : null;
            const isUpsert = prefer.includes('resolution=merge-duplicates');
            const idx = keyCols
              ? rows.findIndex((r) => keyCols.every((k) => String(r[k]) === String(row[k])))
              : -1;
            if (idx >= 0) {
              if (isUpsert) {
                rows[idx] = { ...rows[idx], ...row, created_at: rows[idx].created_at };
                created.push(rows[idx]);
              } else {
                writes.push({ ts: new Date().toISOString(), method, path, body: item, outcome: 'rejected', note: 'duplicate key' });
                return fulfillJson(409, { code: '23505', message: 'duplicate key value violates unique constraint' });
              }
            } else {
              rows.push(row);
              created.push(row);
            }
          }
          writes.push({ ts: new Date().toISOString(), method, path, body, outcome: 'applied' });
          if (prefer.includes('return=representation') || url.searchParams.get('select'))
            return fulfillJson(201, wantsObject ? created[0] : created);
          return route.fulfill({ status: 201, headers: jsonHeaders() });
        }

        if (method === 'PATCH') {
          const patch = req.postDataJSON() as Row;
          const matched = rows.filter((r) => preds.every((p) => matches(r, p)));

          // Mirror the live guard trigger (bb_week_state_guard): only the two
          // client-legal DD1 edges; any client mastery write rejected.
          if (table === 'bb_week_state') {
            for (const r of matched) {
              if ('mastery' in patch) {
                writes.push({ ts: new Date().toISOString(), method, path, body: patch, outcome: 'rejected', note: 'guard: client mastery write' });
                return fulfillJson(403, { code: 'P0001', message: 'bb_week_state_guard: mastery is written only by the scoring RPC' });
              }
              if ('state' in patch) {
                const from = String(r.state);
                const to = String(patch.state);
                if (!(CLIENT_LEGAL_EDGES[from] ?? []).includes(to)) {
                  writes.push({ ts: new Date().toISOString(), method, path, body: patch, outcome: 'rejected', note: `guard: ${from}->${to}` });
                  return fulfillJson(403, { code: 'P0001', message: `bb_week_state_guard: illegal client transition ${from} -> ${to}` });
                }
              }
            }
          }
          // Mirror the live column grant: parents may write acknowledged_at ONLY.
          if (table === 'bb_parent_reports') {
            const cols = Object.keys(patch);
            if (cols.some((c) => c !== 'acknowledged_at')) {
              writes.push({ ts: new Date().toISOString(), method, path, body: patch, outcome: 'rejected', note: 'grant: only acknowledged_at is writable' });
              return fulfillJson(403, { code: '42501', message: 'permission denied: column grant is acknowledged_at only' });
            }
          }
          if (table === 'bb_item_attempts') {
            writes.push({ ts: new Date().toISOString(), method, path, body: patch, outcome: 'rejected', note: 'attempts are append-only' });
            return fulfillJson(403, { code: '42501', message: 'bb_item_attempts is append-only' });
          }

          for (const r of matched) {
            Object.assign(r, structuredClone(patch), { updated_at: new Date().toISOString() });
          }
          writes.push({ ts: new Date().toISOString(), method, path, body: patch, outcome: 'applied' });
          if (prefer.includes('return=representation') || url.searchParams.get('select')) {
            if (wantsObject) {
              if (matched.length === 1) return fulfillJson(200, matched[0]);
              return fulfillJson(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: `Results contain ${matched.length} rows` });
            }
            return fulfillJson(200, matched);
          }
          return route.fulfill({ status: 204, headers: jsonHeaders() });
        }

        if (method === 'DELETE') {
          const before = rows.length;
          const keep = rows.filter((r) => !preds.every((p) => matches(r, p)));
          rows.length = 0;
          rows.push(...keep);
          writes.push({ ts: new Date().toISOString(), method, path, body: null, outcome: 'applied', note: `${before - keep.length} rows` });
          return route.fulfill({ status: 204, headers: jsonHeaders() });
        }
      }

      // Anything else on the Supabase host: benign empty.
      return fulfillJson(200, {});
    } catch (e) {
      log(`harness handler error on ${method} ${path}: ${String(e)}`);
      return fulfillJson(500, { message: `phase7-harness internal: ${String(e)}` });
    }
  };
}

// ---------------------------------------------------------------------------
// Step log / screenshots / console collection
// ---------------------------------------------------------------------------

interface StepEntry {
  n: number;
  ts: string;
  step: string;
  detail?: string;
  screenshot?: string;
}

interface ConsoleEntry {
  ts: string;
  type: string;
  text: string;
  known: boolean;
}

export interface Harness {
  page: Page;
  db: MockDb;
  /** Build an absolute app URL. */
  url: (path: string) => string;
  /** Log a step into the run JSON. */
  step: (step: string, detail?: string) => Promise<void>;
  /** Screenshot → screenshots/phase7/<persona>/<NN>-<label>.png (also logged). */
  shot: (label: string, opts?: { fullPage?: boolean }) => Promise<string>;
  /** Console errors/warnings collected so far (known-noise flagged, not hidden). */
  consoleEntries: () => ConsoleEntry[];
  /** All mock-DB writes the app performed (for write-shape assertions). */
  dbWrites: () => DbWrite[];
  /** Write runs/<persona>-run.json and close the browser. */
  finish: (status: 'ok' | 'failed', note?: string) => Promise<string>;
}

export interface HarnessOptions {
  /** Directory key for screenshots + run log, e.g. 'teacher', 'student-maya'. */
  persona: string;
  db: MockDb;
  viewport?: keyof typeof VIEWPORTS | { width: number; height: number };
  /** Seed localStorage selectedChildId (required for child flows). */
  selectedChildId?: string;
  baseUrl?: string;
  headless?: boolean;
  /** H4 re-run: inject transient table-load failures (see HarnessFault). */
  faults?: HarnessFault[];
}

export async function launchHarness(opts: HarnessOptions): Promise<Harness> {
  const baseUrl = opts.baseUrl ?? 'http://localhost:5173';

  // Fail fast if the dev server is down.
  try {
    await fetch(baseUrl, { signal: AbortSignal.timeout(4000) });
  } catch {
    throw new Error(`Dev server not reachable at ${baseUrl} — start it: cd frontend && npm run dev`);
  }

  const viewport =
    typeof opts.viewport === 'object' ? opts.viewport : VIEWPORTS[opts.viewport ?? 'child'];

  const session = fakeSession(opts.db.user);
  const writes: DbWrite[] = [];
  const steps: StepEntry[] = [];
  const consoleLog: ConsoleEntry[] = [];
  const harnessNotes: string[] = [];
  const startedAt = new Date().toISOString();
  let stepN = 0;
  let shotN = 0;

  const browser = await chromium.launch({ channel: 'chrome', headless: opts.headless ?? true });
  // serviceWorkers: 'block' is REQUIRED — the app is a PWA and service-worker
  // fetches bypass page.route, leaking real requests to the live Supabase host.
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });

  // Login bypass: seed the supabase session + selected child BEFORE app code runs.
  const seedScript = `
    try {
      localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(session))});
      ${opts.selectedChildId ? `localStorage.setItem('selectedChildId', ${JSON.stringify(opts.selectedChildId)});` : ''}
    } catch (e) {}
  `;
  await context.addInitScript(seedScript);

  const page = await context.newPage();
  page.on('console', (msg) => {
    const type = msg.type();
    if (type !== 'error' && type !== 'warning') return;
    const text = msg.text();
    consoleLog.push({ ts: new Date().toISOString(), type, text, known: KNOWN_NOISE.some((re) => re.test(text)) });
  });
  page.on('pageerror', (err) => {
    consoleLog.push({ ts: new Date().toISOString(), type: 'pageerror', text: String(err), known: false });
  });

  await page.route(
    (u) => u.host === SUPABASE_HOST,
    makeSupabaseHandler(opts.db, session as unknown as Row, writes, (e) => harnessNotes.push(e), opts.faults ?? []),
  );

  const shotsDir = join(TESTING_DIR, 'screenshots', SHOTS_ROOT, opts.persona);
  const runsDir = join(TESTING_DIR, 'runs');
  mkdirSync(shotsDir, { recursive: true });
  mkdirSync(runsDir, { recursive: true });

  const harness: Harness = {
    page,
    db: opts.db,
    url: (p: string) => baseUrl + (p.startsWith('/') ? p : `/${p}`),
    step: async (step, detail) => {
      stepN += 1;
      steps.push({ n: stepN, ts: new Date().toISOString(), step, detail });
    },
    shot: async (label, o) => {
      shotN += 1;
      const name = `${String(shotN).padStart(2, '0')}-${label.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.png`;
      const file = join(shotsDir, name);
      await page.screenshot({ path: file, fullPage: o?.fullPage ?? false });
      stepN += 1;
      steps.push({ n: stepN, ts: new Date().toISOString(), step: `screenshot: ${label}`, screenshot: `screenshots/${SHOTS_ROOT}/${opts.persona}/${name}` });
      return file;
    },
    consoleEntries: () => [...consoleLog],
    dbWrites: () => [...writes],
    finish: async (status, note) => {
      const runFile = join(runsDir, `${opts.persona}-run.json`);
      writeFileSync(
        runFile,
        JSON.stringify(
          {
            persona: opts.persona,
            status,
            note: note ?? null,
            baseUrl,
            viewport,
            startedAt,
            finishedAt: new Date().toISOString(),
            steps,
            console: consoleLog,
            unexpectedConsole: consoleLog.filter((c) => !c.known),
            dbWrites: writes,
            harnessNotes,
          },
          null,
          2,
        ),
      );
      await browser.close();
      return runFile;
    },
  };
  return harness;
}
