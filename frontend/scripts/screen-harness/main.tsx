/**
 * Screen harness — mounts ONE Best Brains screen on a generated pack under a
 * stub session, so Chrome can photograph what a child sees. Driven by
 * scripts/bb-screen-visual.ts. Query: screen=practice|warmup level week day
 * seed done=<n practice items already completed> fix=0|1 (fix=1 rewrites
 * pageCount to the writer-fix semantics in the browser, for a before/after on
 * one build).
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
import WorksheetView, { type WorksheetViewRef } from '@/components/worksheet/WorksheetView';
import { useRef, useState } from 'react';
import { HelpLadder } from '@/components/tables/HelpLadder';
import { TimesTableCard } from '@/components/tables/TimesTableCard';
import { AudioButton } from '@/components/homework/AudioButton';
import ThisWeekHub from '@/modules/best-brains/screens/ThisWeekHub';
import type { BBLevel, DayProgress } from '@/modules/best-brains/types';
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

const value: FoundrySessionValue = {
  childId: 'harness', childName: 'Harness', childAge: level === 'A' ? 5 : 9, loading: false,
  enrollment: { childId: 'harness', level, currentWeek: week as any, settings: { sprintOptOut: false, sessionLength: 'standard' } },
  weekState: { childId: 'harness', level, week: week as any, packSeed: seed, state: 'in_week', dayProgress, mastery: { attempts: [] } },
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

if (screen === 'ladder') {
  createRoot(document.getElementById('root')!).render(<LadderHarness />);
} else if (screen === 'kumon') {
  createRoot(document.getElementById('root')!).render(<KumonGridHarness />);
} else createRoot(document.getElementById('root')!).render(
  <FoundrySessionContext.Provider value={value}>
    <MemoryRouter initialEntries={[screen === 'puzzle' ? '/foundry/puzzle' : screen === 'hub' ? '/foundry/hub' : screen === 'done' ? { pathname: `/foundry/day/${day}/done`, state: { partial: true, done, total: pack.days[day - 1].items.length } } : `/foundry/day/${day}/${screen}`]}>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <Routes>
            <Route path="/foundry/day/:day/practice" element={<PracticePage />} />
            <Route path="/foundry/day/:day/warmup" element={<WarmUp />} />
            <Route path="/foundry/puzzle" element={<PuzzleGrove />} />
            <Route path="/foundry/day/:day/done" element={<DayDone />} />
            <Route path="/foundry/hub" element={<ThisWeekHub />} />
            <Route path="*" element={<p data-harness="redirected">REDIRECTED: {location.pathname}</p>} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  </FoundrySessionContext.Provider>,
);
