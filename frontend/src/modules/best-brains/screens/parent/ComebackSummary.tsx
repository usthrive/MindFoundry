/**
 * ComebackSummary (2026-10-15) — on the parent home card: the questions missed on
 * earlier checks that are still coming back as warm-ups (session/comebacks.ts),
 * how far each has got, and when the next is due. Informative, not detailed:
 * a count line and the next three, in the order the child will meet them (due
 * ones first, in serving order; then the rest by due date).
 */
import { useEffect, useMemo, useState } from 'react';
import { generatePack } from '../../generator/packGenerator';
import { promptText } from '../../figures/prompt';
import { listLedgerAnswers } from '../../services/bbProgressService';
import { COMEBACK_STEPS_DAYS, checkItemsOf, comebackLedger, comebackOrder, localDay, type ComebackEntry, type LoggedAnswer } from '../../session/comebacks';
import type { BBLevel, PackItem, WeekState } from '../../types';

function dayLabel(day: string): string {
  if (day <= localDay(new Date())) return 'due now';
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** The missed question's opening words, from its week's own row (the question it comes back LIKE). */
function snippet(e: ComebackEntry, weeks: WeekState[], cache: Map<number, PackItem[]>): string {
  const ws = weeks.find((w) => w.week === e.week);
  if (!ws) return `check question ${e.slot}`;
  try {
    if (!cache.has(e.week)) {
      cache.set(e.week, checkItemsOf(generatePack(e.level, e.week, ws.packSeed, ws.contentVersion), ws.packSeed, ws.contentVersion));
    }
    const item = cache.get(e.week)!.find((i) => i.id === e.originId);
    const text = item ? promptText(item.prompt).replace(/\s+/g, ' ').trim() : '';
    return text.length > 70 ? `${text.slice(0, 67)}…` : text || `check question ${e.slot}`;
  } catch {
    return `check question ${e.slot}`;
  }
}

export default function ComebackSummary({ childId, level, weeks }: { childId: string; level: BBLevel; weeks: WeekState[] }) {
  const [rows, setRows] = useState<LoggedAnswer[] | null>(null);
  useEffect(() => {
    let live = true;
    listLedgerAnswers(childId, level)
      .then((r) => { if (live) setRows(r); })
      .catch(() => { if (live) setRows([]); });
    return () => { live = false; };
  }, [childId, level]);
  const ledger = useMemo(() => (rows ? comebackLedger(rows, level) : []), [rows, level]);
  const open = useMemo(
    () => {
      const today = localDay(new Date());
      const open = ledger.filter((e) => !e.settled);
      const due = open.filter((e) => e.dueOn! <= today).sort(comebackOrder);
      const later = open.filter((e) => e.dueOn! > today).sort((a, b) => a.dueOn!.localeCompare(b.dueOn!));
      return [...due, ...later];
    },
    [ledger],
  );
  const lines = useMemo(() => {
    const cache = new Map<number, PackItem[]>();
    return open.slice(0, 3).map((e) => ({ e, text: snippet(e, weeks, cache) }));
  }, [open, weeks]);
  if (!rows || ledger.length === 0) return null;
  const settled = ledger.length - open.length;
  const steps = COMEBACK_STEPS_DAYS.length;
  return (
    <div data-comebacks className="flex flex-col gap-1.5 rounded-xl p-3" style={{ background: 'var(--mf-fill-soft)' }}>
      <p className="text-[12.5px] font-bold text-text-primary">Coming back in warm-ups</p>
      <p className="text-[12.5px] text-text-secondary">
        {open.length === 0
          ? `All ${settled} missed check questions settled.`
          : `${open.length} missed check question${open.length === 1 ? '' : 's'} · up to 2 a day · settled after ${steps} right in a row, days apart${settled ? ` · ${settled} settled` : ''}`}
      </p>
      {open.length > 0 && (
        <ul className="flex flex-col gap-1">
          {lines.map(({ e, text }) => (
            <li key={e.key} className="text-[12.5px] text-text-primary">
              <span className="font-semibold">Wk {e.week}</span> · “{text}” ·{' '}
              <span className="text-text-secondary">
                {e.step} of {steps} · {dayLabel(e.dueOn!)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {open.length > 3 && <p className="text-[12px] text-text-secondary">+{open.length - 3} more</p>}
    </div>
  );
}
