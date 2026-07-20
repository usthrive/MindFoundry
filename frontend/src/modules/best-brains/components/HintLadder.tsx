/**
 * HintLadder (P8) — help as a ladder: up to three rungs, one at a time,
 * strictly in order, each requiring a fresh request. Never contains the
 * item's literal answer (QG-5 upstream). A bare ✗ never renders (DD13).
 *
 * LS1-R3(a) (research/phase2-gaps/DESIGN-DEFAULTS-ADDENDUM-LS1.md): rung
 * escalation beyond rung 1 requires a genuine attempt on the item since the
 * last rung — no tapping straight through rungs. The container passes
 * `escalationLocked`; when locked, the next-rung affordance is replaced by
 * a warm try-it-first line.
 *
 * Presentational: the container owns `rung` and telemetry (hint_rungs_used).
 */

import { cn } from '@/lib/utils';
import type { InteractionBand } from '../copy';
import { MODULE_COPY } from '../copy';
import AudioButton from './AudioButton';

export interface HintLadderProps {
  band: InteractionBand;
  /** The item's 1–3 authored rungs. */
  hintLadder: string[];
  /** Rungs currently revealed: 0–3. */
  rung: number;
  onRequestRung: (nextRung: number) => void;
  /**
   * LS1-R3(a): true when no genuine attempt has been made since the last rung
   * was revealed — the next rung stays closed until the child tries.
   */
  escalationLocked?: boolean;
  className?: string;
}

const TRY_FIRST: Record<InteractionBand, string> = {
  A: 'Try it first — then I can say more!',
  B: "Give it a try first — then the next rung opens.",
  C: 'Attempt it with this hint first; the next rung opens after a real try.',
};

const RUNG_LABELS = ['A question to start', 'Where to look', 'A similar example'];

export default function HintLadder({
  band,
  hintLadder,
  rung,
  onRequestRung,
  escalationLocked = false,
  className,
}: HintLadderProps) {
  const maxRung = Math.min(3, hintLadder.length);
  const revealed = Math.min(rung, maxRung);
  // LS1-R3(a): rung 1 is free to open; rungs 2–3 require an attempt since the last rung.
  const nextRungLocked = revealed >= 1 && escalationLocked;

  return (
    <div className={cn('rounded-2xl border border-warning/30 bg-warning-light/50 p-4', className)}>
      <div className="flex flex-col gap-3">
        {hintLadder.slice(0, revealed).map((hint, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/20 text-sm font-semibold text-text-secondary">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{RUNG_LABELS[i]}</p>
              <p className={cn('text-text-primary', band === 'A' ? 'text-lg' : 'text-base')}>{hint}</p>
            </div>
            <AudioButton text={hint} band={band} className="h-10 w-10 text-base" />
          </div>
        ))}
        {revealed < maxRung &&
          (nextRungLocked ? (
            <p className="rounded-xl bg-warning-light/70 px-4 py-3 text-sm font-medium text-text-secondary">
              {TRY_FIRST[band]}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onRequestRung(revealed + 1)}
              className={cn(
                'min-h-[48px] rounded-xl border-2 border-dashed border-warning/40 px-4 py-2',
                'font-medium text-text-secondary transition-colors',
                'hover:border-warning hover:bg-warning-light active:scale-[0.99]',
                'focus:outline-none focus:ring-2 focus:ring-warning/40 touch-manipulation',
              )}
            >
              {revealed === 0 ? MODULE_COPY.hintAffordance[band] : 'One more rung'}
            </button>
          ))}
      </div>
    </div>
  );
}
