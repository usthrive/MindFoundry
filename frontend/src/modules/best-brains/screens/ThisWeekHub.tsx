/**
 * ThisWeekHub (Flow 2) — the module's home: which week and day am I in, and
 * exactly one primary action (P1/P2). Five day-tiles with the daily-unlock
 * law (no early unlock ever — a finished day leaves tomorrow "resting").
 * Day 1 sits behind the lesson gate (P8). AnchorPanel handle always present
 * (empty until the lesson fills it, P7).
 */

import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { COPY, MODULE_COPY, weekPassedLine } from '../copy';
import { deriveTiles, isLessonComplete } from '../session/weekLogic';
import { CORRECTIVE_STATES, PASSED_STATES, WEEKS_PER_LEVEL } from '../constants';
import { getCatalogWeek } from '../content/catalog';
import { advanceToNextWeek, listParkedItems } from '../services/bbProgressService';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import WrenMark from '../components/WrenMark';
import AnchorPanel from '../components/AnchorPanel';
import type { DayTileState } from '../types';

function isToday(iso: string | undefined): boolean {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

const TILE_LABELS: Record<DayTileState, string> = {
  done: 'done',
  partial: 'almost',
  today: 'today',
  locked: 'resting',
};

export default function ThisWeekHub() {
  const navigate = useNavigate();
  const {
    loading,
    enrollment,
    weekState,
    pack,
    packUnavailable,
    band,
    childId,
    childName,
    capMinutes,
    ensureWeekStarted,
    refreshEnrollment,
  } = useFoundrySession();
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [chestCount, setChestCount] = useState(0);
  const [revealing, setRevealing] = useState(false);

  // Quiet chest badge — count only, no red marks (P6).
  useEffect(() => {
    if (!childId || !pack) return;
    void listParkedItems(childId, pack.packId)
      .then((items) => setChestCount(items.length))
      .catch(() => setChestCount(0));
  }, [childId, pack]);

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
  const { tiles, todayDay, restingUntilTomorrow } = deriveTiles(weekState.dayProgress);
  // The week is owned when the DD1 machine says so — never by tile count alone.
  const weekPassed = PASSED_STATES.includes(weekState.state);
  const corrective = CORRECTIVE_STATES.includes(weekState.state);
  const escalated = weekState.state === 'escalated';
  const attempts = weekState.mastery.attempts ?? [];
  const lastAttempt = attempts[attempts.length - 1];
  const lastAttemptAt = lastAttempt?.attemptedAt;
  // The reteach runs "usually next day" (Flow 6): same-day re-entry rests.
  const strengthenReady = corrective && !isToday(lastAttemptAt);
  // The next-week reveal waits for the cycle to turn (P1: nothing extra today).
  const revealReady =
    weekPassed && !isToday(weekState.completedAt) && enrollment.currentWeek < WEEKS_PER_LEVEL;
  const strengtheningSkill =
    corrective || escalated
      ? pack.mistakeBank
          .find((m) => m.errorTag === lastAttempt?.dominantErrorTags?.[0])
          ?.subtype?.replace(/-/g, ' ') ?? 'one step'
      : null;

  async function openDay(day: number) {
    await ensureWeekStarted();
    if (day === 1) {
      // Lesson gate: Day 1 is Lesson → GuidedPractice (Flow 2).
      navigate(lessonDone ? '/foundry/guided' : '/foundry/lesson');
      return;
    }
    if (day === 5 && weekState?.dayProgress['5']) {
      // Warm-up banked: Day 5 resumes at the Grove (→ check when it closes).
      navigate('/foundry/puzzle');
      return;
    }
    navigate(`/foundry/day/${day}/warmup`);
  }

  async function revealNextWeek() {
    if (!enrollment || revealing) return;
    setRevealing(true);
    try {
      await advanceToNextWeek(childId, enrollment.currentWeek + 1);
      await refreshEnrollment();
    } catch (e) {
      console.error('[bb] next-week reveal failed', e);
    } finally {
      setRevealing(false);
    }
  }

  const wrenLine = weekPassed
    ? weekPassedLine(band, pack.identity.conceptName)
    : escalated
      ? MODULE_COPY.strengthenEscalated[band]
      : corrective
        ? COPY.nearMiss[band]
        : restingUntilTomorrow
          ? COPY.dayComplete[band]
          : todayDay === 1 && !lessonDone
            ? `Week ${enrollment.currentWeek} begins with a lesson — come meet this week's idea.`
            : COPY.welcomeBack[band];

  // The single primary action (P1/P2): today's actionable day, when one exists.
  const actionableDay = todayDay !== null && !weekPassed ? todayDay : null;
  const primaryCta =
    actionableDay === null
      ? null
      : actionableDay === 1 && !lessonDone
        ? "Start the lesson with Ms. Wren"
        : `Start Day ${actionableDay}'s practice`;

  return (
    <div className="flex flex-col gap-5">
      {/* Header row per the reference: greeting + Level · Week + the Wren mark. */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[21px] font-bold text-text-primary">Hi, {childName}</p>
          <p className="text-[12.5px] tracking-[0.02em] text-text-secondary">
            Level {enrollment.level} · Week {enrollment.currentWeek}
          </p>
        </div>
        <WrenMark size={38} />
      </header>

      {/* Concept card — white, teal top-rule, one primary action inside (P1). */}
      <section aria-label="This week's concept" className="mf-card flex flex-col gap-3 p-5">
        {!weekState.startedAt && <span className="mf-chip self-start">New this week</span>}
        <h1 className="text-[24px] font-bold leading-snug text-text-primary">{pack.identity.conceptName}</h1>
        <p className="text-[15px] leading-relaxed text-text-secondary">{pack.explanation.whyBeforeHow}</p>
        {/* Corrective dual-thread line — matter-of-fact, never alarm (DD1/P6). */}
        {(corrective || escalated) && strengtheningSkill && (
          <p className="text-[13px] text-text-secondary">
            This week: {pack.identity.conceptName} · Still strengthening:{' '}
            <span className="font-semibold" style={{ color: 'var(--mf-accent-deep)' }}>
              {strengtheningSkill}
            </span>
          </p>
        )}
        {primaryCta && (
          <>
            <button type="button" onClick={() => void openDay(actionableDay!)} className="mf-btn-primary mt-1 w-full">
              {primaryCta}
            </button>
            <p className="text-center text-[13px] text-text-secondary">About {capMinutes} minutes</p>
          </>
        )}
      </section>

      <WrenBubble band={band} text={wrenLine} emotion={weekPassed ? 'settled' : 'warm'} />

      {/* Corrective thread: the "one more round" continues here (Flow 6). */}
      {corrective &&
        (strengthenReady ? (
          <button
            type="button"
            onClick={() => navigate('/foundry/reteach')}
            className="min-h-[64px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            One more round — let's glue it down
          </button>
        ) : (
          <p className="text-center text-sm text-text-muted">
            {band === 'A' ? 'We glue it down tomorrow!' : 'The strengthening round opens tomorrow — it will wait for you.'}
          </p>
        ))}

      {/* Passed: the cycle turns when the calendar does (P1). */}
      {revealReady && (
        <button
          type="button"
          onClick={() => void revealNextWeek()}
          disabled={revealing}
          className="min-h-[64px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          {MODULE_COPY.nextWeekReveal[band]}
          {getCatalogWeek(enrollment.level, enrollment.currentWeek + 1)
            ? ` — ${getCatalogWeek(enrollment.level, enrollment.currentWeek + 1)!.conceptName}`
            : ''}
        </button>
      )}

      {/* Five day-tiles — done teal fill / active teal outline + apricot dot /
          resting warm fill (never forbidding). Day labels, never weekday names (DD3). */}
      <section aria-label="This week's days" className="flex gap-2">
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
                'mf-tile flex-1 transition-all touch-manipulation',
                state === 'done' && 'mf-tile-done',
                (state === 'today' || state === 'partial') &&
                  'mf-tile-active hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/40',
                state === 'locked' && 'mf-tile-resting',
              )}
            >
              <span className="text-sm font-bold">Day {day}</span>
              {state === 'today' || state === 'partial' ? (
                <span className="mf-tile-dot" aria-hidden="true" />
              ) : (
                <span className="mf-tile-sub">{state === 'locked' && day === 5 ? 'check day' : TILE_LABELS[state]}</span>
              )}
            </button>
          );
        })}
      </section>

      {restingUntilTomorrow && !weekPassed && (
        <p className="text-center text-sm text-text-muted">{MODULE_COPY.tileResting[band]}</p>
      )}

      {/* Quiet action row per the reference: Anchor / Chest / Journey map. */}
      <section aria-label="More" className="flex gap-2.5">
        <button
          type="button"
          onClick={() => setAnchorOpen(true)}
          className="mf-btn-quiet flex flex-1 flex-col items-center justify-center gap-0.5 touch-manipulation"
        >
          <span aria-hidden="true" style={{ color: 'var(--mf-primary)' }}>⌗</span>
          Anchor
        </button>
        <Link
          to="/foundry/chest"
          className="mf-btn-quiet flex flex-1 flex-col items-center justify-center gap-0.5 touch-manipulation"
        >
          <span aria-hidden="true" style={{ color: 'var(--mf-accent-deep)' }}>▣</span>
          {chestCount > 0 ? `Chest · ${chestCount} waiting` : 'Chest'}
        </Link>
        <Link
          to="/foundry/map"
          className="mf-btn-quiet flex flex-1 flex-col items-center justify-center gap-0.5 touch-manipulation"
        >
          <span aria-hidden="true" style={{ color: 'var(--mf-primary)' }}>◔</span>
          Journey map
        </Link>
      </section>

      {lessonDone && (
        <Link
          to="/foundry/lesson"
          className="mf-btn-quiet flex items-center justify-center touch-manipulation"
        >
          Watch the lesson again
        </Link>
      )}

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
