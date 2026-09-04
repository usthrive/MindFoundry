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
import PracticePage from '@/modules/best-brains/screens/PracticePage';
import WarmUp from '@/modules/best-brains/screens/WarmUp';
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

const pack = generatePack(level, week, seed);
if (fix && pack.presentation?.oneOperationPerPage) {
  for (const d of pack.days) d.pageCount = d.items.filter((i) => !i.isRetrieval).length;
}
const practice = pack.days[day - 1].items.filter((i) => !i.isRetrieval);
const twoDaysAgo = new Date(Date.now() - 2 * 86400e3).toISOString();
const dayProgress: DayProgress = { lesson: { state: 'done' } };
for (let d = 1; d < day; d++) dayProgress[String(d)] = { state: 'done', completedAt: twoDaysAgo, completedItemIds: [] };
dayProgress[String(day)] = { state: 'partial', completedItemIds: practice.slice(0, done).map((i) => i.id) };

const value: FoundrySessionValue = {
  childId: 'harness', childName: 'Harness', childAge: level === 'A' ? 5 : 9, loading: false,
  enrollment: { childId: 'harness', level, currentWeek: week as any, settings: { sprintOptOut: false, sessionLength: 'standard' } },
  weekState: { childId: 'harness', level, week: week as any, packSeed: seed, state: 'in_week', dayProgress, mastery: { attempts: [] } },
  pack, packUnavailable: false, band: bandForLevel(level), capMinutes: 99, sessionMinutes: () => 0,
  refreshEnrollment: async () => {}, refreshWeekState: async () => {}, ensureWeekStarted: async () => {},
};
(window as any).__bb = { pack, practice, value };

createRoot(document.getElementById('root')!).render(
  <FoundrySessionContext.Provider value={value}>
    <MemoryRouter initialEntries={[`/foundry/day/${day}/${screen}`]}>
      <div className="mf-foundry min-h-screen bg-background">
        <main className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-5">
          <Routes>
            <Route path="/foundry/day/:day/practice" element={<PracticePage />} />
            <Route path="/foundry/day/:day/warmup" element={<WarmUp />} />
            <Route path="*" element={<p data-harness="redirected">REDIRECTED: {location.pathname}</p>} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  </FoundrySessionContext.Provider>,
);
