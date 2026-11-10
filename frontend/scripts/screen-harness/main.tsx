/**
 * Screen harness — mounts ONE Best Brains screen on a generated pack under a
 * stub session, so Chrome can photograph what a child sees. Driven by
 * scripts/bb-screen-visual.ts. Query: screen=practice|warmup level week day
 * seed done=<n practice items already completed> fix=0|1 (fix=1 rewrites
 * pageCount to the writer-fix semantics in the browser, for a before/after on
 * one build).
 *
 * real=b4 (2026-10-15) — the owner's son's real week 4 (seed 645474193, his day
 * accuracies and check answers) at wstate=near_miss_cycle1|cycle2|escalated, with
 * his real check log seeded into the database stub, so the hub's status card, the
 * closed-week strengthen screen, screen=comeback and screen=parent read real data.
 * The escalated moment's second re-check (3 of 6) is hypothetical — it has not
 * happened.
 */
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { generatePack } from '@/modules/best-brains/generator/packGenerator';
import { FoundrySessionContext, type FoundrySessionValue } from '@/modules/best-brains/session/FoundrySession';
import { bandForLevel } from '@/modules/best-brains/copy';
import { dayFlow } from '@/modules/best-brains/session/dayFlow';
import PracticePage from '@/modules/best-brains/screens/PracticePage';
import WarmUp from '@/modules/best-brains/screens/WarmUp';
import PuzzleGrove from '@/modules/best-brains/screens/PuzzleGrove';
import DayDone from '@/modules/best-brains/screens/DayDone';
import StrengthenPlan from '@/modules/best-brains/screens/StrengthenPlan';
import FreshProblems from '@/modules/best-brains/screens/FreshProblems';
import CheckReview from '@/modules/best-brains/components/CheckReview';
import WorksheetView, { type WorksheetViewRef } from '@/components/worksheet/WorksheetView';
import { useRef, useState } from 'react';
import { HelpLadder } from '@/components/tables/HelpLadder';
import { TimesTableCard } from '@/components/tables/TimesTableCard';
import { AudioButton } from '@/components/homework/AudioButton'
import { ConceptIntroModal } from '@/components/concept-intro';
import ThisWeekHub from '@/modules/best-brains/screens/ThisWeekHub';
import Comebacks from '@/modules/best-brains/screens/Comebacks';
import ParentHome from '@/modules/best-brains/screens/parent/ParentHome';
import ParentControls from '@/modules/best-brains/screens/parent/ParentControls';
import { ParentContext } from '@/modules/best-brains/screens/parent/FoundryParentLayout';
import type { BBLevel, DayProgress, MasteryAttempt } from '@/modules/best-brains/types';
import StudyPage from '@/pages/StudyPage';
import KumonSheetsCard from '@/components/parent/KumonSheetsCard';
import { CelebrationProvider } from '@/contexts/CelebrationContext';
import { NavigationGuardProvider } from '@/contexts/NavigationGuardContext';
import { CONCEPT_INTRODUCTION } from '@/services/generators/concept-availability';
import { seenKey } from '@/services/conceptAnimationMapping';
import { decideSheet, sittingRecord, type SheetEvent } from '@/services/sheetPass';
import { B4_A, B4_B1, B4_B2, B4_DAYS, hisLog, weekRows } from './his-log';
import '@/index.css';

const q = new URLSearchParams(location.search);
const level = (q.get('level') ?? 'A') as BBLevel;
const week = Number(q.get('week') ?? 2);
const day = Number(q.get('day') ?? 2);
const seed = Number(q.get('seed') ?? 12345);
const done = Number(q.get('done') ?? 0);
const screen = q.get('screen') ?? 'practice';
const fix = q.get('fix') === '1';
const mins = Number(q.get('mins') ?? 0);

const real = q.get('real') === 'b4';
const pack = generatePack(level, week, seed);
if (fix && pack.presentation?.oneOperationPerPage) {
  for (const d of pack.days) d.pageCount = d.items.filter((i) => !i.isRetrieval).length;
}
const practice = dayFlow(pack.days[day - 1]).work;
const twoDaysAgo = new Date(Date.now() - 2 * 86400e3).toISOString();
const dayProgress: DayProgress = { lesson: { state: 'done' } };
for (let d = 1; d < day; d++) dayProgress[String(d)] = { state: 'done', completedAt: twoDaysAgo, completedItemIds: [] };
const warm = dayFlow(pack.days[day - 1]).warmup;
dayProgress[String(day)] = { state: 'partial', completedItemIds: done < 0 ? warm.slice(0, 1).map((i) => i.id) : practice.slice(0, done).map((i) => i.id) };
if (screen === 'puzzle') dayProgress['5'] = { state: 'partial', completedItemIds: [...warm.map((i) => i.id), ...practice.slice(0, Math.max(0, done)).map((i) => i.id)] };

// --- real=b4: his week 4 and his check log (shared with the photo driver) ---
const wstate = (q.get('wstate') as any) ?? 'in_week';
if (real || screen === 'comeback' || screen === 'parent' || screen === 'controls') {
  (window as any).__sbFixture = { bb_item_attempts: hisLog(real && wstate === 'escalated'), bb_week_state: weekRows() };
}
const attempts: MasteryAttempt[] = real
  ? wstate === 'near_miss_cycle1' ? [B4_A] : wstate === 'cycle2' ? [B4_A, B4_B1] : wstate === 'escalated' ? [B4_A, B4_B1, B4_B2] : []
  : (wstate === 'near_miss_cycle1' || wstate === 'cycle2')
    ? [{ form: 'A', cycle: 0, scorePct: 67, attemptedAt: '2026-09-26T16:56:00Z', dominantErrorTags: [(q.get('tag') as any) ?? 'concept-misconception'] }]
    : [];

const value: FoundrySessionValue = {
  childId: 'harness', childName: 'Harness', childAge: level === 'A' ? 5 : 9, loading: false,
  enrollment: { childId: 'harness', level, currentWeek: week as any, settings: { sprintOptOut: false, sessionLength: 'standard' } },
  weekState: {
    childId: 'harness', level, week: week as any, packSeed: seed, contentVersion: real ? '1.2.0' : undefined,
    state: wstate, dayProgress: real ? B4_DAYS : dayProgress,
    mastery: { attempts, ...(real && wstate === 'escalated' ? { escalatedAt: B4_B2.attemptedAt } : {}) },
  },
  pack, packUnavailable: false, band: bandForLevel(level), capMinutes: 12, sessionMinutes: () => mins,
  refreshEnrollment: async () => {}, refreshWeekState: async () => {}, ensureWeekStarted: async () => {},
};
(window as any).__bb = { pack, practice, value };

/**
 * screen=kumon — the Kumon worksheet grid on its own (P0, 2026-09-26), so a
 * driver can answer like a child and read back the evidence the grid records.
 * Query: level, ws (worksheet), table=1 (the times-table card is on screen),
 * mode=open|tap|covered.
 */
function KumonGridHarness() {
  const ref = useRef<WorksheetViewRef>(null);
  const pages = useRef<unknown[]>([]);
  (window as any).__kumon = { ref, pages: pages.current };
  return (
    <div className="min-h-screen bg-white p-4">
      <WorksheetView
        ref={ref}
        level={(q.get('level') ?? 'C') as any}
        worksheetNumber={Number(q.get('ws') ?? 31)}
        sessionActive
        childId="harness"
        onPageComplete={(r) => { pages.current.push(r); }}
        onWorksheetComplete={() => {}}
        scaffoldVisible={q.get('table') === '1'}
        scaffoldMode={(q.get('mode') as any) ?? null}
      />
    </div>
  );
}

/**
 * screen=ladder — the help ladder as the Kumon page shows it (2026-09-26), with
 * the times-table card appearing at rung 4. Query: a, b (the fact), rung (1..4),
 * tables (comma list), support (tap|covered).
 */
function LadderHarness() {
  const a = Number(q.get('a') ?? 6);
  const b = Number(q.get('b') ?? 7);
  const [rung, setRung] = useState<1 | 2 | 3 | 4>(Number(q.get('rung') ?? 1) as 1 | 2 | 3 | 4);
  const tables = (q.get('tables') ?? String(a)).split(',').map(Number);
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <p className="mb-3 text-center text-3xl font-bold text-gray-800">{a} × {b} = ___</p>
      <HelpLadder
        fact={{ a, b }}
        rung={rung}
        onClimb={(n) => setRung(n)}
        onClose={() => {}}
        audio={(text) => <AudioButton text={text} size="small" />}
      />
      {rung === 4 && (
        <div className="mt-3">
          <TimesTableCard
            tables={tables}
            support={(q.get('support') as any) ?? 'tap'}
            current={{ table: a, multiplier: b }}
            onReveal={() => {}}
            onClose={() => {}}
          />
        </div>
      )}
    </div>
  );
}

/**
 * screen=kumon-intro — the Kumon new-concept intro on its own (2026-11-09), e.g. the
 * stacked-multiplication lesson: ?concept=multiplication_2digit_by_1digit&ws=56.
 * window.__introDone turns true when the child finishes it.
 */
function KumonIntroHarness() {
  ;(window as any).__introDone = false
  return (
    <div className="min-h-screen bg-white">
      <ConceptIntroModal
        show
        concepts={[q.get('concept') ?? 'multiplication_2digit_by_1digit']}
        level={'C' as any}
        worksheet={Number(q.get('ws') ?? 56)}
        onComplete={() => { (window as any).__introDone = true }}
        childId="harness"
        childAge={7}
      />
    </div>
  )
}

/** screen=review — going over the paper, on the pack's real Form A items (?misses=ID:answer,ID:answer). */
function ReviewHarness() {
  const misses = (q.get('misses') ?? '').split(',').filter(Boolean).map((pair) => {
    const [id, answer] = pair.split(':');
    return { item: pack.masteryCheck.formA.concat(pack.masteryCheck.formB).find((i) => i.id === id)!, answer };
  }).filter((m) => m.item);
  (window as any).__review = { recorded: [] as unknown[], done: false };
  return (
    <FoundrySessionContext.Provider value={value}>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <CheckReview
            misses={misses}
            band={bandForLevel(level)}
            when={(q.get('when') as any) ?? 'before-strengthening'}
            onReAnswer={(item, answer, correct, steps) => (window as any).__review.recorded.push({ id: item.id, answer, correct, steps })}
            onDone={() => { (window as any).__review.done = true; }}
          />
        </main>
      </div>
    </FoundrySessionContext.Provider>
  );
}

/** screen=parent — the parent home on his real log (the week line and the comeback list); screen=controls — the Settings page. */
function ParentHarness() {
  const enr = { childId: 'harness', level: 'B' as BBLevel, currentWeek: 4 as any, settings: { sprintOptOut: false, sessionLength: 'standard' as const } };
  return (
    <ParentContext.Provider
      value={{
        loading: false,
        childList: [{ id: 'harness', name: 'Harness' } as any],
        enrollments: new Map([['harness', enr as any]]),
        reportsByChild: new Map(),
        childName: () => 'Harness',
        refresh: async () => {},
      }}
    >
      <MemoryRouter initialEntries={[screen === 'controls' ? '/foundry/parent/controls/harness' : '/foundry/parent']}>
        <div className="mf-foundry min-h-screen bg-background">
          <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
            <Routes>
              <Route path="/foundry/parent/controls/:childId" element={<ParentControls />} />
              <Route path="*" element={<ParentHome />} />
            </Routes>
          </main>
        </div>
      </MemoryRouter>
    </ParentContext.Provider>
  );
}

/**
 * screen=kumon-study — the REAL Kumon StudyPage (2026-11-10), signed in as a parent
 * with one child (auth-stub.tsx) over an in-memory database (supabase-stub.ts with
 * __sbApplyUpdates), so a driver can work a sheet on the touch pad or a keyboard and
 * read back what was recorded: the sitting, the position, the attempts.
 * Query: level (C), ws (56), seen=0 (show the new-concept lesson), runs=repeat,repeat
 * (sittings already on this sheet), why=time (those sittings were slow, not wrong),
 * mode=standard|one.
 */
function kumonStudyFixture() {
  const lvl = (q.get('level') ?? 'C') as string;
  const ws = Number(q.get('ws') ?? 56);
  const runs = (q.get('runs') ?? '').split(',').filter(Boolean) as Array<'pass' | 'repeat' | 'moved_on'>;
  const child = {
    id: 'harness-child', user_id: 'harness-parent', name: 'Harness', age: 7, grade_level: 2, avatar: null,
    current_level: lvl, current_worksheet: ws, questions_per_page_mode: q.get('mode') ?? 'standard',
    supplementary_practice: null, regroup_helper_mode: null, tier: 'free', streak: 0, total_problems: 0, total_correct: 0,
    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
  };
  const seen = q.get('seen') !== '0'
    ? Object.entries(CONCEPT_INTRODUCTION).filter(([, i]) => i.level === lvl && i.worksheet <= ws).map(([c]) => ({ child_id: child.id, concept_id: seenKey(c), seen_at: '2026-11-01T00:00:00Z' }))
    : [];
  // why=time: the earlier sittings were right enough but slow (a time-only repeat).
  const timeOnly = q.get('why') === 'time';
  const sittings: SheetEvent[] = runs.map((outcome, k) => {
    const firstTry = outcome === 'pass' || timeOnly ? 9 : 5;
    const seconds = timeOnly ? 700 : 400; // over the first sheet's 10 minutes
    return {
      ...sittingRecord(decideSheet({ level: lvl, worksheet: ws, problems: 10, firstTry, seconds, priorNonPasses: k, position: 1 }), { problems: 10, firstTry, seconds, focusScore: 95, at: `2026-11-0${k + 1}T22:00:00Z` }),
      outcome,
    };
  });
  (window as any).__harnessChild = child;
  (window as any).__sbApplyUpdates = true;
  (window as any).__sbFixture = {
    children: [child],
    worksheet_progress: runs.length ? [{ id: 'wp-current', child_id: child.id, level: lvl, worksheet_number: ws, status: 'in_progress', times_attempted: runs.length, best_score: 0, best_score_total: 10, sittings, completed_at: null }] : [],
    practice_sessions: [], problem_attempts: [], daily_practice: [], concepts_seen: seen,
  };
}

function KumonStudyHarness() {
  return (
    <MemoryRouter initialEntries={['/study']}>
      <CelebrationProvider>
        <NavigationGuardProvider>
          <Routes>
            <Route path="/study" element={<StudyPage />} />
            <Route path="*" element={<p data-harness="redirected">REDIRECTED: {location.pathname}</p>} />
          </Routes>
        </NavigationGuardProvider>
      </CelebrationProvider>
    </MemoryRouter>
  );
}

/** screen=kumon-parent — the parent's Kumon sheets card on a made-up record (?ws=56). */
function KumonParentHarness() {
  const ws = Number(q.get('ws') ?? 56);
  const at = (d: number, h = 22) => `2026-11-${String(d).padStart(2, '0')}T${h}:00:00Z`;
  // Positions in the skill: the made-up record starts at ws-4 (the first sheet worked).
  const s = (w: number, outcome: 'pass' | 'repeat' | 'moved_on', firstTry: number, seconds: number, focus: number, day: number, prior: number): SheetEvent => ({
    ...sittingRecord(decideSheet({ level: 'C', worksheet: w, problems: 10, firstTry, seconds, priorNonPasses: prior, position: w - (ws - 4) + 1 }), { problems: 10, firstTry, seconds, focusScore: focus, at: at(day) }),
    outcome,
  });
  const rows = [
    { worksheet_number: ws - 4, sittings: [s(ws - 4, 'repeat', 5, 410, 92, 11, 0), s(ws - 4, 'repeat', 6, 380, 88, 12, 1), s(ws - 4, 'moved_on', 6, 300, 97, 13, 2)] },
    { worksheet_number: ws - 3, sittings: [s(ws - 3, 'pass', 9, 200, 100, 14, 0)] },
    { worksheet_number: ws - 2, sittings: [s(ws - 2, 'repeat', 9, 600, 84, 15, 0), s(ws - 2, 'pass', 8, 230, 100, 16, 1)] },
    { worksheet_number: ws - 1, sittings: [s(ws - 1, 'pass', 10, 150, 100, 17, 0)] },
    { worksheet_number: ws, sittings: [s(ws, 'repeat', 6, 260, 91, 18, 0)] },
  ];
  (window as any).__harnessChild = { id: 'harness-child', name: 'Harness', current_level: 'C', current_worksheet: ws };
  (window as any).__sbApplyUpdates = true;
  (window as any).__sbFixture = { children: [{ id: 'harness-child', current_level: 'C', current_worksheet: ws }], worksheet_progress: rows.map((r) => ({ id: `wp-${r.worksheet_number}`, child_id: 'harness-child', level: 'C', ...r })), concepts_seen: [] };
  (window as any).__moved = 0;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <KumonSheetsCard childId="harness-child" childName="Harness" level={'C' as any} currentWorksheet={ws} rows={rows} onMoved={() => { (window as any).__moved++; }} />
      </div>
    </div>
  );
}

if (screen === 'kumon-study') {
  kumonStudyFixture();
  createRoot(document.getElementById('root')!).render(<KumonStudyHarness />);
} else if (screen === 'kumon-parent') {
  createRoot(document.getElementById('root')!).render(<KumonParentHarness />);
} else if (screen === 'kumon-intro') {
  createRoot(document.getElementById('root')!).render(<KumonIntroHarness />);
} else if (screen === 'parent' || screen === 'controls') {
  // The parent home reads week 4's row for the week line: give it his real state.
  const row = (window as any).__sbFixture.bb_week_state.find((r: any) => r.week === 4);
  Object.assign(row, { state: 'cycle2', day_progress: B4_DAYS, mastery: { attempts: [B4_A, B4_B1] } });
  createRoot(document.getElementById('root')!).render(<ParentHarness />);
} else if (screen === 'review') {
  createRoot(document.getElementById('root')!).render(<ReviewHarness />);
} else if (screen === 'ladder') {
  createRoot(document.getElementById('root')!).render(<LadderHarness />);
} else if (screen === 'kumon') {
  createRoot(document.getElementById('root')!).render(<KumonGridHarness />);
} else createRoot(document.getElementById('root')!).render(
  <FoundrySessionContext.Provider value={value}>
    <MemoryRouter initialEntries={[screen === 'comeback' ? `/foundry/day/${day}/comeback` : screen === 'puzzle' ? '/foundry/puzzle' : screen === 'hub' ? '/foundry/hub' : screen === 'strengthen' ? { pathname: '/foundry/strengthen', state: { reviewed: true } } : screen === 'fresh' ? '/foundry/fresh' : screen === 'done' ? { pathname: `/foundry/day/${day}/done`, state: { partial: true, done, total: pack.days[day - 1].items.length } } : `/foundry/day/${day}/${screen}`]}>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <Routes>
            <Route path="/foundry/day/:day/practice" element={<PracticePage />} />
            <Route path="/foundry/day/:day/warmup" element={<WarmUp />} />
            <Route path="/foundry/day/:day/comeback" element={<Comebacks />} />
            <Route path="/foundry/puzzle" element={<PuzzleGrove />} />
            <Route path="/foundry/day/:day/done" element={<DayDone />} />
            <Route path="/foundry/hub" element={<ThisWeekHub />} />
            <Route path="/foundry/strengthen" element={<StrengthenPlan />} />
            <Route path="/foundry/fresh" element={<FreshProblems />} />
            <Route path="*" element={<p data-harness="redirected">REDIRECTED: {location.pathname}</p>} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  </FoundrySessionContext.Provider>,
);
