/**
 * TrendsView (PARENT-FLOWS Flow 4) — at most three honest longitudinal
 * graphics, each carried by a one-sentence Ms. Wren interpretation:
 *   1. Untimed weekly-check accuracy (the only % series anywhere), with the
 *      mastery gate explained plainly (threshold from constants).
 *   2. Practice-day accuracy + minutes (effort and steadiness, equal weight).
 *   3. Fluency sprint counts, self-referenced and ungraded — hidden entirely
 *      on sprint opt-out.
 * Banned by law: red zones, down-arrows, projections. Gaps shown plainly,
 * never interpolated. <3 weeks of data → "still gathering the story."
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  listSprintCounts,
  listWeekStatesReadOnly,
  type SprintWeekCounts,
} from '../../services/bbParentService';
import { GATE_EXPLAINER } from '../../parentCopy';
import { MASTERY_THRESHOLD_PCT } from '../../constants';
import { useParentContext } from './FoundryParentLayout';
import TrendsTabs from './TrendsTabs';
import type { WeekState } from '../../types';

interface WeekPoint {
  week: number;
  checkPct: number | null;
  dayAccuracyPct: number | null;
  minutes: number;
}

function derivePoints(states: WeekState[]): WeekPoint[] {
  return states.map((s) => {
    const formA = s.mastery.attempts?.find((a) => a.form === 'A');
    const dayAccs = [1, 2, 3, 4, 5]
      .map((d) => s.dayProgress[String(d)]?.accuracyPct)
      .filter((v): v is number => typeof v === 'number');
    const minutes = [1, 2, 3, 4, 5].reduce(
      (sum, d) => sum + (s.dayProgress[String(d)]?.minutesSpent ?? 0),
      0,
    );
    return {
      week: s.week,
      checkPct: formA ? formA.scorePct : null,
      dayAccuracyPct: dayAccs.length
        ? Math.round(dayAccs.reduce((a, b) => a + b, 0) / dayAccs.length)
        : null,
      minutes,
    };
  });
}

/** A quiet horizontal bar (teal on warm fill) — no chart library, no drama. */
function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-[18px] flex-1 overflow-hidden rounded-md" style={{ background: 'var(--mf-fill)' }}>
      <div
        className="h-full rounded-md"
        style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: 'var(--mf-primary)' }}
      />
    </div>
  );
}

export default function TrendsView() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, childName } = useParentContext();
  const enr = enrollments.get(childId);
  const name = childName(childId);
  const [states, setStates] = useState<WeekState[]>([]);
  const [sprints, setSprints] = useState<SprintWeekCounts[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enr) return;
    let cancelled = false;
    void Promise.all([
      listWeekStatesReadOnly(childId, enr.level).catch(() => [] as WeekState[]),
      enr.settings?.sprintOptOut ? Promise.resolve([]) : listSprintCounts(childId).catch(() => []),
    ]).then(([ws, sp]) => {
      if (!cancelled) {
        setStates(ws);
        setSprints(sp);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [childId, enr]);

  if (loading || (enr && !ready)) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enr) return <p className="py-12 text-center text-text-secondary">{name} hasn't started yet.</p>;

  const points = derivePoints(states);
  const checkPoints = points.filter((p) => p.checkPct !== null);
  const dayPoints = points.filter((p) => p.dayAccuracyPct !== null || p.minutes > 0);
  const sprintOptedOut = !!enr.settings?.sprintOptOut;

  if (checkPoints.length < 1 && dayPoints.length < 1) {
    return (
      <div className="flex flex-col gap-4">
        <TrendsTabs childId={childId} active="trends" />
        <p className="mf-card-quiet p-5 text-center text-sm text-text-secondary">
          Still gathering the story — trends appear after a few weeks of practice.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TrendsTabs childId={childId} active="trends" />

      {/* 1 — untimed weekly-check accuracy (the only % series anywhere). */}
      <section className="mf-card-quiet flex flex-col gap-3 p-5">
        <span className="mf-label mf-label-teal">Weekly check, untimed</span>
        {checkPoints.length === 0 ? (
          <p className="text-sm text-text-secondary">The first weekly check hasn't happened yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {checkPoints.map((p) => (
              <div key={p.week} className="flex items-center gap-2.5">
                <span className="w-14 shrink-0 text-[12.5px] font-semibold text-text-secondary">Wk {p.week}</span>
                <Bar pct={p.checkPct!} />
                <span className="w-10 shrink-0 text-right text-[12.5px] font-semibold text-text-primary">
                  {p.checkPct}%
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-[13px] leading-relaxed text-text-secondary">
          First try on each week's check — {GATE_EXPLAINER} A "one more round" week simply shows the
          first number; the gate did its job. The {MASTERY_THRESHOLD_PCT}% bar is our own standard.
        </p>
        {checkPoints.length > 0 && checkPoints.length < 3 && (
          <p className="text-[12.5px] text-text-muted">Still gathering the story — a few dots don't make a trend.</p>
        )}
      </section>

      {/* 2 — practice-day accuracy + minutes: steadiness, effort-framed. */}
      <section className="mf-card-quiet flex flex-col gap-3 p-5">
        <span className="mf-label mf-label-teal">Daily practice</span>
        {dayPoints.length === 0 ? (
          <p className="text-sm text-text-secondary">Practice days will show here as they land.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {dayPoints.map((p) => (
              <div key={p.week} className="flex items-center gap-2.5">
                <span className="w-14 shrink-0 text-[12.5px] font-semibold text-text-secondary">Wk {p.week}</span>
                <Bar pct={p.dayAccuracyPct ?? 0} />
                <span className="w-24 shrink-0 text-right text-[12.5px] text-text-secondary">
                  {p.dayAccuracyPct !== null ? `${p.dayAccuracyPct}%` : '—'} · {p.minutes} min
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-[13px] leading-relaxed text-text-secondary">
          First-attempt accuracy across {name}'s practice days, with the week's minutes beside it —
          steadiness matters as much as the checks, and short days are by design.
        </p>
      </section>

      {/* 3 — fluency, self-referenced (absent entirely on opt-out). */}
      {!sprintOptedOut && sprints.length > 0 && (
        <section className="mf-card-quiet flex flex-col gap-3 p-5">
          <span className="mf-label mf-label-teal">Fluency sprints · ungraded</span>
          <div className="flex flex-col gap-2">
            {sprints.map((s) => (
              <div key={s.packId} className="flex items-center gap-2.5">
                <span className="w-20 shrink-0 text-[12.5px] font-semibold text-text-secondary">
                  {s.packId.replace('MFM-', 'Week ').replace(/^Week ([A-E])/, 'Wk $1')}
                </span>
                <span className="text-[13px] text-text-primary">
                  {s.counts.join(' → ')} correct in two calm minutes
                </span>
              </div>
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Automaticity on already-mastered facts, {name} versus {name} only — pace, not speed
            pressure, and never a grade.
          </p>
        </section>
      )}
    </div>
  );
}
