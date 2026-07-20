/**
 * BBScratchPad (P3) — collapsible scratch space on every computation screen.
 * Wraps the platform's existing canvas ScratchPad; per-item persistence via an
 * in-memory stroke store keyed by item id (survives navigation within the
 * session). Never auto-solves; contents are the child's own, never graded.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ScratchPad from '@/components/ui/ScratchPad';
import type { Stroke } from '@/components/ui/ScratchPad';
import type { InteractionBand } from '../copy';

/** Session-scoped per-item stroke store (P3 persistPerItem). */
const strokeStore = new Map<string, Stroke[]>();

export interface BBScratchPadProps {
  /** Item id keying per-item persistence. */
  itemKey: string;
  band: InteractionBand;
  className?: string;
}

export default function BBScratchPad({ itemKey, band, className }: BBScratchPadProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex min-h-[48px] w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2',
          'font-medium text-text-secondary transition-colors hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation',
        )}
        aria-expanded={open}
      >
        <span>{band === 'A' ? 'Drawing space' : 'Scratch pad'}</span>
        <span aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')}>
          ⌄
        </span>
      </button>
      {open && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-2">
          <ScratchPad
            fillWidth
            height={band === 'A' ? 280 : 220}
            initialStrokes={strokeStore.get(itemKey) ?? []}
            onStrokesChange={(strokes) => strokeStore.set(itemKey, strokes)}
            backgroundStyle="blank"
          />
        </div>
      )}
    </div>
  );
}
