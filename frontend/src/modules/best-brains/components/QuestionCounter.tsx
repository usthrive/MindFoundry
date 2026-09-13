/**
 * QuestionCounter — "Day 2 · Question 3 of 5", the same words in the same
 * place on every work screen (WarmUp, PracticePage, PuzzleGrove), counting the
 * WHOLE day rather than the screen (session/dayFlow.ts owns the numbers).
 *
 * Before this the practice header said "page 1 of 3" (a page is not a thing a
 * child sees — P2 shows one problem at a time), the warm-up said nothing, and
 * the count restarted on every screen, so a child on the day's second question
 * read "1 of 3". Band A adds a row of dots: pre-readers are the band that most
 * needs "how much is left", and a dot row is the one form of it they can read.
 * Nothing here is spoken — a second autoplay on the screen would race the
 * prompt's (REPORT-2026-09-04 §5.4).
 */

import { cn } from '@/lib/utils';
import type { InteractionBand } from '../copy';

export interface QuestionCounterProps {
  day: number;
  /** 1-based question number within the day. */
  k: number;
  /** Questions in the day (warm-up + work). */
  total: number;
  band: InteractionBand;
  className?: string;
}

export default function QuestionCounter({ day, k, total, band, className }: QuestionCounterProps) {
  const n = Math.max(1, total);
  const cur = Math.min(Math.max(1, k), n);
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <p className={band === 'A' ? 'text-base font-semibold text-text-secondary' : 'mf-label'} data-bb-counter>
        Day {day} · Question {cur} of {n}
      </p>
      {band === 'A' && (
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <span
              key={i}
              data-bb-dot
              className={cn(
                'block h-3 w-3 rounded-full',
                i + 1 < cur ? 'bg-primary' : i + 1 === cur ? 'bg-primary/40 ring-2 ring-primary' : 'bg-gray-200',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
