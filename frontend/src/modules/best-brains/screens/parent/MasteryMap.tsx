/**
 * MasteryMap (PARENT-FLOWS Flow 4) — the adult twin of the child's
 * JourneyMap: the level's 24 concept weeks with gate states the child never
 * sees. "Mastered after strengthening" is equally mastered — annotated as
 * "took the strong road," never downgraded. No red/fail cells (P6 spirit).
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHECKPOINT_WEEK, CORRECTIVE_STATES, PASSED_STATES, WEEKS_PER_LEVEL } from '../../constants';
import { getCatalogWeek } from '../../content/catalog';
import { listWeekStatesReadOnly } from '../../services/bbParentService';
import { useParentContext } from './FoundryParentLayout';
import TrendsTabs from './TrendsTabs';
import type { MasteryCellState, WeekState } from '../../types';

const CELL_LABEL: Record<MasteryCellState, string> = {
  mastered: 'Mastered',
  mastered_after_strengthening: 'Mastered · took the strong road',
  strengthening_now: 'Strengthening now',
  upcoming: 'Upcoming',
};

function cellState(ws: WeekState | undefined): MasteryCellState {
  if (ws && PASSED_STATES.includes(ws.state)) {
    const strengthened = (ws.mastery.attempts ?? []).some((a) => a.form === 'B');
    return strengthened ? 'mastered_after_strengthening' : 'mastered';
  }
  if (ws && (CORRECTIVE_STATES.includes(ws.state) || ws.state === 'escalated')) return 'strengthening_now';
  return 'upcoming';
}

export default function MasteryMap() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, childName } = useParentContext();
  const enr = enrollments.get(childId);
  const name = childName(childId);
  const [states, setStates] = useState<Map<number, WeekState>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enr) return;
    let cancelled = false;
    void listWeekStatesReadOnly(childId, enr.level)
      .then((ws) => {
        if (!cancelled) {
          setStates(new Map(ws.map((s) => [s.week, s])));
          setReady(true);
        }
      })
      .catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
  }, [childId, enr]);

  if (loading || (enr && !ready)) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enr) return <p className="py-12 text-center text-text-secondary">{name} hasn't started yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      <TrendsTabs childId={childId} active="map" />

      <p className="text-[13px] leading-relaxed text-text-secondary">
        Level {enr.level}'s 24 concepts, in {name}'s ladder order. "Took the strong road" means the
        gate asked for one more round and {name} beat it — equally mastered.
      </p>

      <div className="flex flex-col gap-2">
        {Array.from({ length: WEEKS_PER_LEVEL }, (_, i) => i + 1).map((week) => {
          const cat = getCatalogWeek(enr.level, week);
          const ws = states.get(week);
          const state =
            week === enr.currentWeek && (!ws || ws.state === 'not_started' || ws.state === 'in_week' || ws.state === 'mastery_check')
              ? null // this week, in flight
              : cellState(ws);
          const mastered = state === 'mastered' || state === 'mastered_after_strengthening';
          return (
            <div
              key={week}
              className="mf-card-quiet flex items-center gap-3 p-3"
              style={
                mastered
                  ? { borderLeft: '5px solid var(--mf-primary)' }
                  : state === 'strengthening_now'
                    ? { borderLeft: '5px solid var(--mf-accent)' }
                    : { opacity: state === 'upcoming' ? 0.75 : 1 }
              }
            >
              <span className="w-12 shrink-0 text-[12.5px] font-bold text-text-secondary">Wk {week}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-text-primary">
                  {cat?.conceptName ?? `Week ${week}`}
                </p>
                <p className="text-[12px] text-text-secondary">
                  {state === null ? 'This week' : CELL_LABEL[state]}
                  {ws?.completedAt && mastered && ` · ${new Date(ws.completedAt).toLocaleDateString()}`}
                </p>
              </div>
              {week === CHECKPOINT_WEEK && <span className="mf-chip shrink-0">Checkpoint</span>}
              {week === WEEKS_PER_LEVEL && <span className="mf-chip shrink-0">Level exit</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
