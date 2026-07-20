/**
 * ThisWeekHub (Flow 2) — the module's home: which week and day am I in, and
 * exactly one primary action (P1/P2). Five day-tiles with the daily-unlock
 * law (no early unlock ever — a finished day leaves tomorrow "resting").
 * Day 1 sits behind the lesson gate (P8). AnchorPanel handle always present
 * (empty until the lesson fills it, P7).
 */

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { COPY, MODULE_COPY } from '../copy';
import { deriveTiles, isLessonComplete } from '../session/weekLogic';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AnchorPanel from '../components/AnchorPanel';
import type { DayTileState } from '../types';

const TILE_LABELS: Record<DayTileState, string> = {
  done: 'Done',
  partial: 'Almost there',
  today: 'Today',
  locked: 'Resting',
};

export default function ThisWeekHub() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, packUnavailable, band, ensureWeekStarted } =
    useFoundrySession();
  const [anchorOpen, setAnchorOpen] = useState(false);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment) return <Navigate to="/foundry/placement/welcome" replace />;

  if (packUnavailable || !weekState || !pack) {
    // Honest, calm coverage note (content for this cell lands in a later increment).
    return (
      <div className="flex min-h-[60vh] flex-col justify-center gap-6">
        <WrenBubble
          band={band}
          text="Ms. Wren is still preparing this part of the trail — check back soon."
          emotion="settled"
        />
        <Link
          to="/foundry/map"
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-center leading-[56px] text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
        >
          See my journey
        </Link>
      </div>
    );
  }

  const lessonDone = isLessonComplete(weekState.dayProgress);
  const { tiles, todayDay, restingUntilTomorrow, daysDone } = deriveTiles(weekState.dayProgress);
  const weekComplete = daysDone === 5;

  async function openDay(day: number) {
    await ensureWeekStarted();
    if (day === 1) {
      // Lesson gate: Day 1 is Lesson → GuidedPractice (Flow 2).
      navigate(lessonDone ? '/foundry/guided' : '/foundry/lesson');
      return;
    }
    navigate(`/foundry/day/${day}/warmup`);
  }

  const wrenLine = weekComplete
    ? COPY.weekPassed[band]
    : restingUntilTomorrow
      ? COPY.dayComplete[band]
      : todayDay === 1 && !lessonDone
        ? `Week ${enrollment.currentWeek} begins with a lesson — come meet this week's idea.`
        : COPY.welcomeBack[band];

  return (
    <div className="flex flex-col gap-6">
      {/* Concept card — kid-readable name + one-line why (P1). */}
      <section aria-label="This week's concept" className="rounded-3xl bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">
          Week {enrollment.currentWeek}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-text-primary">{pack.identity.conceptName}</h1>
        <p className="mt-2 text-text-secondary">{pack.explanation.whyBeforeHow}</p>
      </section>

      <WrenBubble band={band} text={wrenLine} emotion={weekComplete ? 'settled' : 'warm'} />

      {/* Five day-tiles — today lit, done filled, future resting (never forbidding). */}
      <section aria-label="This week's days" className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((day) => {
          const state = tiles[day];
          const actionable = state === 'today' || state === 'partial';
          return (
            <button
              key={day}
              type="button"
              disabled={!actionable}
              onClick={() => void openDay(day)}
              aria-label={`Day ${day}: ${TILE_LABELS[state]}`}
              className={cn(
                'flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 transition-all touch-manipulation',
                state === 'done' && 'border-secondary/30 bg-secondary-light text-secondary-700',
                state === 'partial' &&
                  'border-primary/40 bg-primary-light text-primary-700 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/40',
                state === 'today' &&
                  'border-primary bg-white text-text-primary shadow-md hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/40',
                state === 'locked' && 'border-gray-100 bg-gray-50 text-text-muted',
              )}
            >
              <span className="text-lg font-bold">Day {day}</span>
              <span className="text-xs font-medium">{state === 'done' ? '●' : TILE_LABELS[state]}</span>
            </button>
          );
        })}
      </section>

      {restingUntilTomorrow && !weekComplete && (
        <p className="text-center text-sm text-text-muted">{MODULE_COPY.tileResting[band]}</p>
      )}

      {/* Secondary affordances: anchor handle, lesson replay, map, chest. */}
      <section aria-label="More" className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAnchorOpen(true)}
          className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          📌 This week's anchor
        </button>
        <Link
          to="/foundry/map"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          🗺️ My journey
        </Link>
        {lessonDone && (
          <Link
            to="/foundry/lesson"
            className="flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            ▶ Watch the lesson again
          </Link>
        )}
        <Link
          to="/foundry/chest"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
        >
          🧰 Treasure chest
        </Link>
      </section>

      <AnchorPanel
        pack={pack}
        mode={lessonDone ? 'full' : 'empty'}
        band={band}
        open={anchorOpen}
        onClose={() => setAnchorOpen(false)}
      />
    </div>
  );
}
