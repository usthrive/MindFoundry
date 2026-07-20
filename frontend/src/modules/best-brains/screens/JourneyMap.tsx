/**
 * JourneyMap (Flow 8) — the child's ONLY progress surface: trail, Mastered
 * Shelf, effort strip. Moves and effort, never scores (P4/P5/P6): no accuracy
 * stats, no comparison, no miss history. Neutral level letter (DD2).
 */

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getLevelCatalog } from '../content/catalog';
import { BB_LEVEL_DISPLAY_NAMES, PASSED_STATES } from '../constants';
import { MODULE_COPY } from '../copy';
import { listWeekStates } from '../services/bbProgressService';
import { deriveTiles } from '../session/weekLogic';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import type { TrailStop, WeekState } from '../types';

export default function JourneyMap() {
  const { loading, enrollment, weekState, band, childId, childName } = useFoundrySession();
  const [levelStates, setLevelStates] = useState<WeekState[]>([]);

  useEffect(() => {
    if (!enrollment) return;
    listWeekStates(childId, enrollment.level)
      .then(setLevelStates)
      .catch((e) => console.error('[bb] journey load failed', e));
  }, [childId, enrollment]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment) return <Navigate to="/foundry/placement/welcome" replace />;

  const catalog = getLevelCatalog(enrollment.level);
  const stateByWeek = new Map(levelStates.map((s) => [s.week, s]));

  const trail: TrailStop[] = catalog.map((cell) => {
    const ws = stateByWeek.get(cell.week);
    const passed = !!ws && PASSED_STATES.includes(ws.state);
    const strengthening = !!ws && ['near_miss_cycle1', 'cycle2', 'escalated'].includes(ws.state);
    return {
      week: cell.week,
      conceptId: cell.conceptId,
      conceptName: cell.conceptName,
      status: passed
        ? 'mastered'
        : strengthening
          ? 'strengthening'
          : cell.week === enrollment.currentWeek
            ? 'current'
            : 'upcoming',
      isCheckpoint: cell.isCheckpoint,
      isLevelExit: cell.isLevelExit,
    };
  });

  const shelf = trail.filter((t) => t.status === 'mastered');
  const effort = weekState ? deriveTiles(weekState.dayProgress) : null;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-text-muted">
            {BB_LEVEL_DISPLAY_NAMES[enrollment.level]}
          </p>
          <h1 className="text-2xl font-bold text-text-primary">{childName}'s journey</h1>
        </div>
        <Link
          to="/foundry/hub"
          className="flex min-h-[48px] items-center rounded-xl bg-primary px-5 font-semibold text-white shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation"
        >
          This week
        </Link>
      </header>

      {/* The trail — 24 stops, "you are here" pin, landmarks at 12 and 24. */}
      <section aria-label="Your trail" className="rounded-3xl bg-surface p-5 shadow-sm">
        <ol className="space-y-1">
          {trail.map((stop) => (
            <li key={stop.week}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2',
                  stop.status === 'current' && 'bg-primary-light ring-2 ring-primary/30',
                  stop.status === 'strengthening' && 'bg-secondary-light',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    stop.status === 'mastered' && 'bg-secondary text-white',
                    stop.status === 'current' && 'bg-primary text-white',
                    stop.status === 'strengthening' && 'bg-secondary/60 text-white',
                    stop.status === 'upcoming' && 'bg-gray-100 text-text-muted',
                  )}
                >
                  {stop.week}
                </span>
                <span
                  className={cn(
                    'flex-1',
                    stop.status === 'upcoming' ? 'text-text-muted' : 'text-text-primary',
                    stop.status === 'current' && 'font-semibold',
                  )}
                >
                  {stop.conceptName}
                  {stop.status === 'strengthening' && (
                    <span className="ml-2 text-sm text-text-secondary">— strengthening</span>
                  )}
                </span>
                {stop.status === 'current' && (
                  <span className="text-sm font-medium text-primary-700">you are here</span>
                )}
                {stop.isCheckpoint && <span aria-label="Checkpoint landmark">🌉</span>}
                {stop.isLevelExit && <span aria-label="Level exit landmark">⛰️</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Mastered Shelf — owned concepts; effort-framed, never scored. */}
      <section aria-label="Mastered shelf" className="rounded-3xl bg-surface p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Mastered shelf</h2>
        {shelf.length === 0 ? (
          <WrenBubble band={band} text={MODULE_COPY.journeyEmptyShelf[band]} emotion="settled" />
        ) : (
          <ul className="flex flex-wrap gap-2">
            {shelf.map((s) => (
              <li
                key={s.conceptId}
                className="rounded-xl bg-secondary-light px-4 py-2 font-medium text-secondary-700"
              >
                {s.conceptName}
              </li>
            ))}
          </ul>
        )}
        {shelf.length > 0 && (
          <p className="mt-2 text-sm text-text-muted">Shelf concepts sneak into warm-ups.</p>
        )}
      </section>

      {/* Effort strip — "you showed up N days", nothing about misses (P4). */}
      {effort && (
        <section aria-label="This week's effort" className="rounded-3xl bg-surface p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">This week</h2>
          <div className="mb-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((d) => (
              <span
                key={d}
                aria-label={`Day ${d} ${effort.tiles[d]}`}
                className={cn(
                  'h-3 flex-1 rounded-full',
                  effort.tiles[d] === 'done' && 'bg-secondary',
                  effort.tiles[d] === 'partial' && 'bg-secondary/40',
                  (effort.tiles[d] === 'today' || effort.tiles[d] === 'locked') && 'bg-gray-100',
                )}
              />
            ))}
          </div>
          <p className="text-text-secondary">
            You showed up {effort.daysDone} {effort.daysDone === 1 ? 'day' : 'days'} this week.
          </p>
        </section>
      )}
    </div>
  );
}
