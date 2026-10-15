/**
 * useComebacks — the comeback ledger for one child at one level, loaded from the
 * attempt log and the level's week rows (whose seeds rebuild each origin week).
 * Any failure leaves an empty ledger: comebacks must never stand between a child
 * and the day's practice.
 */
import { useCallback, useEffect, useState } from 'react';
import { generatePack } from '../generator/packGenerator';
import { listLedgerAnswers, listWeekStates } from '../services/bbProgressService';
import { comebackLedger, comebackQuestion, type ComebackEntry, type ComebackQuestion, type LoggedAnswer } from './comebacks';
import type { BBLevel, WeekState } from '../types';

export interface ComebackData {
  ready: boolean;
  ledger: ComebackEntry[];
  rows: LoggedAnswer[];
  weeks: WeekState[];
}

const EMPTY: ComebackData = { ready: false, ledger: [], rows: [], weeks: [] };

export function useComebacks(childId: string, level: BBLevel | undefined): ComebackData & { refresh: () => void } {
  const [data, setData] = useState<ComebackData>(EMPTY);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!childId || !level) return;
    let live = true;
    Promise.all([listLedgerAnswers(childId, level), listWeekStates(childId, level)])
      .then(([rows, weeks]) => {
        if (live) setData({ ready: true, rows, weeks, ledger: comebackLedger(rows, level) });
      })
      .catch((e) => {
        console.error('[bb] comeback ledger load failed', e);
        if (live) setData({ ...EMPTY, ready: true });
      });
    return () => {
      live = false;
    };
  }, [childId, level, tick]);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { ...data, refresh };
}

/** Build each entry's next question from its origin week's own row. */
export function questionsFor(entries: ComebackEntry[], weeks: WeekState[]): ComebackQuestion[] {
  const out: ComebackQuestion[] = [];
  for (const e of entries) {
    const ws = weeks.find((w) => w.level === e.level && w.week === e.week);
    if (!ws) continue;
    try {
      const pack = generatePack(e.level, e.week, ws.packSeed, ws.contentVersion);
      const q = comebackQuestion(e, pack, ws.packSeed, ws.contentVersion);
      if (q) out.push(q);
    } catch (err) {
      console.error('[bb] comeback question build failed', e.key, err);
    }
  }
  return out;
}
