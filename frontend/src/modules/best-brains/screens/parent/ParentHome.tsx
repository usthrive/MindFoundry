/**
 * ParentHome (PARENT-FLOWS Flow 3) — the parent tab: per-child week strips,
 * effort-framed consistency, report state, doorway to every view. Readable in
 * under a minute (DD15). Pull-only; a gap is simply unfilled — "missed" never
 * said (P5.4); children stacked, never ranked or compared.
 */

import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getCatalogWeek } from '../../content/catalog';
import { listWeekStatesReadOnly } from '../../services/bbParentService';
import { useParentContext } from './FoundryParentLayout';
import type { BBParentReport, WeekState } from '../../types';

const WELCOME_SEEN_KEY = 'bb-parent-welcome-seen';

function DayStrip({ weekState }: { weekState: WeekState | null }) {
  return (
    <div className="flex gap-1.5" aria-label="Practice days this week">
      {[1, 2, 3, 4, 5].map((day) => {
        const state = weekState?.dayProgress[String(day)]?.state;
        const filled = state === 'done';
        const partial = state === 'partial';
        return (
          <div
            key={day}
            className="h-[30px] flex-1 rounded-lg"
            style={{
              background: filled
                ? 'var(--mf-primary)'
                : partial
                  ? 'rgba(59,123,120,0.35)'
                  : 'var(--mf-fill)',
            }}
          />
        );
      })}
    </div>
  );
}

function reportState(reports: BBParentReport[] | undefined): {
  latest: BBParentReport | null;
  ready: boolean;
} {
  const latest = reports?.[0] ?? null;
  return { latest, ready: !!latest && !latest.acknowledgedAt };
}

export default function ParentHome() {
  const navigate = useNavigate();
  const { loading, childList, enrollments, reportsByChild } = useParentContext();
  const [weekStates, setWeekStates] = useState<Map<string, WeekState | null>>(new Map());

  const enrolledIds = childList.filter((c) => enrollments.has(c.id)).map((c) => c.id);

  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      enrolledIds.map(async (id) => {
        const enr = enrollments.get(id)!;
        const states = await listWeekStatesReadOnly(id, enr.level).catch(() => []);
        return [id, states.find((s) => s.week === enr.currentWeek) ?? null] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setWeekStates(new Map(entries));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledIds.join(','), enrollments]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;

  // First visit with nothing enrolled → the expectation-setting cards (Flow 1).
  if (enrolledIds.length === 0 && !localStorage.getItem(WELCOME_SEEN_KEY)) {
    return <Navigate to="/foundry/parent/welcome" replace />;
  }

  const firstEnrolled = enrolledIds[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[21px] font-bold text-text-primary">This week</h1>
        {firstEnrolled && (
          <button
            type="button"
            onClick={() => navigate(`/foundry/parent/controls/${firstEnrolled}`)}
            className="min-h-[44px] rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-text-secondary hover:bg-gray-50 touch-manipulation"
          >
            Settings
          </button>
        )}
      </div>

      {childList.map((child) => {
        const enr = enrollments.get(child.id);
        if (!enr) {
          return (
            <section key={child.id} className="mf-card-quiet flex flex-col gap-3 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[17px] font-bold text-text-primary">{child.name}</span>
                <span className="text-xs text-text-secondary">not started yet</span>
              </div>
              <p className="text-sm text-text-secondary">
                Ready when you are — the starting point takes about 25 minutes and feels like
                exploring, never like a test.
              </p>
              <Link to="/foundry/parent/welcome" className="text-[12.5px] font-semibold text-primary">
                How this module works
              </Link>
            </section>
          );
        }

        const ws = weekStates.get(child.id) ?? null;
        const catalogWeek = getCatalogWeek(enr.level, enr.currentWeek);
        const { latest, ready } = reportState(reportsByChild.get(child.id));
        const daysPracticed = ws
          ? [1, 2, 3, 4, 5].filter((d) => {
              const s = ws.dayProgress[String(d)]?.state;
              return s === 'done' || s === 'partial';
            }).length
          : 0;

        return (
          <section key={child.id} className="mf-card-quiet flex flex-col gap-3 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[17px] font-bold text-text-primary">{child.name}</span>
              <span className="text-xs text-text-secondary">
                Level {enr.level} · Week {enr.currentWeek}
              </span>
            </div>
            <div className="text-sm text-text-primary">{catalogWeek?.conceptName ?? 'This week'}</div>
            <DayStrip weekState={ws} />
            {/* Effort-framed consistency line — no loss state, no guilt (P5.4). */}
            <div className="text-[13px] text-text-secondary">
              {daysPracticed} practice {daysPracticed === 1 ? 'day' : 'days'} this week
              {!latest && ' · report arrives after the weekly check'}
            </div>
            {latest && ready && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/foundry/parent/report/${child.id}/${latest.level}/${latest.week}`)
                }
                className="min-h-[50px] rounded-xl border-none bg-primary-light text-sm font-bold text-primary-700 hover:bg-secondary-light/70 touch-manipulation"
              >
                Weekly report ready — read it
              </button>
            )}
            {latest && !ready && (
              <Link
                to={`/foundry/parent/report/${child.id}/${latest.level}/${latest.week}`}
                className="text-[13px] font-semibold text-text-secondary"
              >
                Latest report · seen {new Date(latest.acknowledgedAt!).toLocaleDateString()} — read again
              </Link>
            )}
            <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[12.5px] font-semibold">
              <Link to={`/foundry/parent/trends/${child.id}`} className="text-primary">
                Trends
              </Link>
              <Link to={`/foundry/parent/mastery/${child.id}`} className="text-primary">
                Mastery map
              </Link>
              <Link to={`/foundry/parent/coach/${child.id}`} className="text-primary">
                Coach corner
              </Link>
              <Link to={`/foundry/parent/patterns/${child.id}`} className="text-primary">
                Patterns
              </Link>
              <Link to={`/foundry/parent/history/${child.id}`} className="text-primary">
                History
              </Link>
              <Link to={`/foundry/parent/story/${child.id}`} className="text-primary">
                Placement story
              </Link>
              <Link to={`/foundry/parent/controls/${child.id}`} className="text-primary">
                Settings
              </Link>
            </div>
          </section>
        );
      })}

      {/* Help sheet: the onboarding cards persist here (Flow 1 edge case). */}
      <Link to="/foundry/parent/welcome" className="text-center text-[12.5px] text-text-muted">
        How this module works — the three cards
      </Link>
    </div>
  );
}
