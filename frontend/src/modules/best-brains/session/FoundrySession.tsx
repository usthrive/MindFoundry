/**
 * Best Brains-inspired module — Foundry session context.
 *
 * Container-side state for the /foundry area: the selected child, their
 * enrollment, the active week's state row, and the regenerated pack
 * (generatePack(level, week, packSeed, contentVersion) — packs are never
 * persisted, per DD15).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generatePack, hasPackContent } from '../generator/packGenerator';
import { bandForAge, bandForLevel } from '../copy';
import type { InteractionBand } from '../copy';
import { getEnrollment, getOrInitWeekState, transitionWeekState } from '../services/bbProgressService';
import { sessionCapMinutes } from './weekLogic';
import type { BBEnrollment, WeeklyConceptPack, WeekState } from '../types';

interface FoundrySessionValue {
  childId: string;
  childName: string;
  childAge: number;
  loading: boolean;
  /** Null until placement completes (routes to Flow 1). */
  enrollment: BBEnrollment | null;
  /** Active (level, currentWeek) cycle row; null pre-enrollment. */
  weekState: WeekState | null;
  /** Regenerated pack for the active week; null pre-enrollment or when no content exists yet. */
  pack: WeeklyConceptPack | null;
  /** True when the enrolled cell has no authored content yet (increment-2 coverage gap). */
  packUnavailable: boolean;
  /** Interaction band: from the placed level, or the child's age pre-placement. */
  band: InteractionBand;
  /** Daily dose cap in minutes (settings-scaled under the LS1-R1 band hard cap 10/15/20). */
  capMinutes: number;
  /** Minutes elapsed in this browser session inside /foundry. */
  sessionMinutes: () => number;
  refreshEnrollment: () => Promise<void>;
  refreshWeekState: () => Promise<void>;
  /** Marks the week in_week on first real activity (legal DD1 edge only). */
  ensureWeekStarted: () => Promise<void>;
}

/** Exported so a screen can be mounted under a stub session (scripts/screen-harness). */
export const FoundrySessionContext = createContext<FoundrySessionValue | undefined>(undefined);
export type { FoundrySessionValue };

export function FoundrySessionProvider({ children }: { children: ReactNode }) {
  const { currentChild } = useAuth();
  const [enrollment, setEnrollment] = useState<BBEnrollment | null>(null);
  const [weekState, setWeekState] = useState<WeekState | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionStart = useRef<number>(Date.now());

  const childId = currentChild?.id ?? '';
  const childName = currentChild?.name ?? '';
  const childAge = currentChild?.age ?? 8;

  const loadAll = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    try {
      const enr = await getEnrollment(childId);
      setEnrollment(enr);
      if (enr && hasPackContent(enr.level, enr.currentWeek)) {
        const ws = await getOrInitWeekState(childId, enr.level, enr.currentWeek);
        setWeekState(ws);
      } else {
        setWeekState(null);
      }
    } catch (e) {
      console.error('[bb] session load failed', e);
      setEnrollment(null);
      setWeekState(null);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const refreshWeekState = useCallback(async () => {
    if (!enrollment) return;
    if (!hasPackContent(enrollment.level, enrollment.currentWeek)) return;
    const ws = await getOrInitWeekState(childId, enrollment.level, enrollment.currentWeek);
    setWeekState(ws);
  }, [childId, enrollment]);

  const ensureWeekStarted = useCallback(async () => {
    if (!weekState || weekState.state !== 'not_started') return;
    const next = await transitionWeekState(weekState, 'in_week');
    setWeekState(next);
  }, [weekState]);

  const pack = useMemo(() => {
    if (!enrollment || !weekState) return null;
    try {
      return generatePack(
        enrollment.level,
        enrollment.currentWeek,
        weekState.packSeed,
        weekState.contentVersion,
      );
    } catch (e) {
      console.error('[bb] pack regeneration failed', e);
      return null;
    }
  }, [enrollment, weekState]);

  const packUnavailable =
    !!enrollment && (!hasPackContent(enrollment.level, enrollment.currentWeek) || (!!weekState && !pack));

  const band: InteractionBand = enrollment ? bandForLevel(enrollment.level) : bandForAge(childAge);
  // LS1-R1: the dose cap is age-banded (8/10, 12/15, 15/20 target/hard).
  const capMinutes = sessionCapMinutes(enrollment?.settings?.sessionLength, band);

  const sessionMinutes = useCallback(
    () => (Date.now() - sessionStart.current) / 60000,
    [],
  );

  const value: FoundrySessionValue = {
    childId,
    childName,
    childAge,
    loading,
    enrollment,
    weekState,
    pack,
    packUnavailable,
    band,
    capMinutes,
    sessionMinutes,
    refreshEnrollment: loadAll,
    refreshWeekState,
    ensureWeekStarted,
  };

  return <FoundrySessionContext.Provider value={value}>{children}</FoundrySessionContext.Provider>;
}

export function useFoundrySession(): FoundrySessionValue {
  const ctx = useContext(FoundrySessionContext);
  if (!ctx) throw new Error('useFoundrySession must be used within FoundrySessionProvider');
  return ctx;
}
