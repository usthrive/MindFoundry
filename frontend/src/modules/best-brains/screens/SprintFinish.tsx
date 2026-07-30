/**
 * SprintFinish (Flow 5, DD11/P11) — the calm stop: today's count against
 * YOUR last time only. No stars, no grade, no confetti; worse-than-last-time
 * gets honest calm ("counts wobble"); first-ever gets "now you have a number
 * to play against". C band sees a tiny personal-history sparkline
 * (self-referenced only). Missed facts silently join the retrieval/sprint
 * pools via the attempt log (DD8) — no visible miss list ever.
 */

import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { COPY } from '../copy';
import {
  getSprintHistory,
  recordItemAttempt,
  updateDayProgress,
} from '../services/bbProgressService';
import { sprintsUsedThisWeek } from '../session/sprintLogic';
import { SPRINTS_PER_WEEK_MAX } from '../constants';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

interface RunResult {
  id: string;
  answer: string;
  correct: boolean;
}

interface FinishState {
  day?: number;
  results?: RunResult[];
  early?: boolean;
}

export default function SprintFinish() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, enrollment, weekState, pack, band, childId, refreshWeekState } = useFoundrySession();
  const state = (location.state as FinishState | null) ?? {};
  const results = state.results ?? [];
  const day = Number(state.day ?? NaN);

  const [lastCount, setLastCount] = useState<number | null | 'none'>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [thisOrdinal, setThisOrdinal] = useState<number | null>(null);
  const persisted = useRef(false);

  const count = results.filter((r) => r.correct).length;
  const sprint = pack?.fluencySprint ?? null;

  // Persist once: attempt rows (attempt_no = this sprint's ordinal) + the
  // week's sprint budget entry. Partial (early-exit) sprints count fine.
  useEffect(() => {
    if (persisted.current || !weekState || !pack || !sprint || results.length === 0) return;
    persisted.current = true;
    const ordinal = sprintsUsedThisWeek(weekState.dayProgress) + 1;
    setThisOrdinal(ordinal);
    void (async () => {
      try {
        const prior = await getSprintHistory(childId, pack.packId, sprint.id);
        setHistory(prior);
        setLastCount(prior.length > 0 ? prior[prior.length - 1] : 'none');
      } catch {
        setLastCount('none');
      }
      for (const r of results) {
        void recordItemAttempt({
          childId,
          packId: pack.packId,
          itemId: r.id,
          answer: r.answer,
          correct: r.correct,
          hintRungsUsed: 0,
          attemptNo: ordinal,
          day: null, // sprint rows carry no day (schema convention)
        });
      }
      try {
        await updateDayProgress(weekState, `sprint-${ordinal}`, {
          state: 'done',
          completedAt: new Date().toISOString(),
        });
        await refreshWeekState();
      } catch (e) {
        console.error('[bb] sprint budget save failed', e);
      }
    })();
  }, [weekState, pack, sprint, results, childId, refreshWeekState]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !sprint || results.length === 0) {
    return <Navigate to="/foundry" replace />;
  }

  const backTo = Number.isInteger(day) ? `/foundry/day/${day}/practice` : '/foundry/hub';
  const comparison =
    lastCount === null
      ? null
      : lastCount === 'none'
        ? { label: 'first-ever', line: band === 'C' ? 'Now you have a number to play against.' : 'Now you have a number to beat — your own!' }
        : count > lastCount
          ? { label: 'improved', line: `Last time: ${lastCount}. Today: ${count}. Those facts are becoming automatic — that frees your brain for the new stuff.` }
          : count === lastCount
            ? { label: 'steady', line: `Same count as last time — steady hands. Automaticity is built exactly like this.` }
            : { label: 'wobbled', line: `Last time ${lastCount}, today ${count} — counts wobble; the you-versus-you game is long.` };

  // A second sprint may remain this week (DD11 ≤2/week) and the parent hasn't
  // opted out — offer it here, calm and opt-in. The PracticePage offer site
  // only surfaces at the one day boundary, so without this the budgeted second
  // run is UI-unreachable (S-10). Never at Level A. `thisOrdinal` is this run's
  // ordinal (1 or 2), captured when the budget was booked, so the re-offer
  // never flashes on the second run.
  const canRunAgain =
    thisOrdinal !== null &&
    thisOrdinal < SPRINTS_PER_WEEK_MAX &&
    enrollment.level !== 'A' &&
    !enrollment.settings.sprintOptOut;

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-6">
      <WrenBubble band={band} autoplay text={COPY.sprintEnd[band]} emotion="settled" />

      <section aria-label="Your count" className="rounded-3xl bg-surface p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">Today's count</p>
        <p className="text-5xl font-bold text-text-primary">{count}</p>
        {comparison && comparison.label !== 'first-ever' && (
          <p className="mt-1 text-sm text-text-secondary">you vs. you</p>
        )}
      </section>

      {comparison && <WrenBubble band={band} text={comparison.line} emotion="warm" />}

      {/* C band: tiny personal history sparkline — self-referenced only (P4). */}
      {band === 'C' && history.length > 0 && (
        <div aria-label="Your own history" className="flex items-end justify-center gap-1">
          {[...history, count].map((c, i) => (
            <div
              key={i}
              className="w-4 rounded-t bg-secondary/50"
              style={{ height: `${8 + Math.min(48, c * 3)}px` }}
              title={`${c}`}
            />
          ))}
        </div>
      )}

      {canRunAgain && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-[13px] text-text-secondary">
            {band === 'C'
              ? 'Room for one more this week, if you feel like it — still just you versus you.'
              : "There's room for one more this week, if you'd like — no pressure either way."}
          </p>
          <button
            type="button"
            onClick={() => navigate('/foundry/sprint', { replace: true, state: { day } })}
            className="min-h-[48px] rounded-2xl border-2 border-primary bg-white px-5 text-base font-semibold text-primary hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            Another two minutes
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate(backTo, { replace: true })}
        className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
      >
        Back to the good stuff
      </button>
    </div>
  );
}
