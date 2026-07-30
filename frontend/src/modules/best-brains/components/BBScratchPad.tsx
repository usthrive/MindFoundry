/**
 * BBScratchPad (P3) — collapsible scratch space on every computation screen.
 * Wraps the platform's existing canvas ScratchPad; per-item persistence via an
 * in-memory stroke store keyed by item id (survives navigation within the
 * session). Never auto-solves; contents are the child's own, never graded.
 *
 * WORKING IN PARTS. A blank rectangle is a poor invitation: a six-year-old given
 * one empty space writes one number in the middle of it and abandons it. So the
 * pad offers to divide itself into two or three labelled spaces, which is what
 * "work it out in parts" looks like when you are seven — one space per stage,
 * side by side, so the first stage is still visible while the second is written.
 *
 * THE CHILD CHOOSES THE NUMBER OF SPACES, AND IT IS NOT DERIVED FROM THE ITEM.
 * That is deliberate and it is the whole design. Deriving the count from the
 * item's own step chain would be easy — the chain length is right there in
 * `generator.params.steps` — and it would hand over the decomposition. b24's
 * entire subject is that NOTHING on the page says which move the story wants;
 * b07's is finding one unknown inside a known whole. On those pages "we have laid
 * out two boxes for you" is the answer to the question being asked. This is the
 * same trap as L33 (a figure that gives away what it illustrates) wearing
 * different clothes, and a scaffold placed under the exact step being assessed
 * removes the assessment.
 *
 * For the same reason the labels are content-free — "First", "Then", "Next", never
 * "add these" or "take this away" — and the encouragement never names an
 * operation or a count of stages. It says that working in parts helps; it does not
 * say what the parts are.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ScratchPad from '@/components/ui/ScratchPad';
import type { Stroke } from '@/components/ui/ScratchPad';
import type { InteractionBand } from '../copy';

/** Session-scoped per-item stroke store (P3 persistPerItem). */
const strokeStore = new Map<string, Stroke[]>();
/** Session-scoped per-item choice of how many spaces, so it survives navigation. */
const layoutStore = new Map<string, number>();

export interface BBScratchPadProps {
  /** Item id keying per-item persistence. */
  itemKey: string;
  band: InteractionBand;
  className?: string;
  /** Label on the toggle. Defaults to the neutral utility name. */
  title?: string;
  /**
   * Start expanded. Safe DURING THE LESSON, where nothing is being assessed and
   * an invitation to work alongside Ms. Wren costs nothing. Left off on practice
   * and mastery items: there, an open pad on a two-step page is a hint about the
   * page (see the note at the top of this file).
   */
  defaultOpen?: boolean;
  /** Replaces the standing encouragement. Must name no operation and no count. */
  invitation?: string;
}

/** Content-free stage names. Never an operation, never a quantity. */
const STAGE_LABELS = ['First', 'Then', 'Next'] as const;

export default function BBScratchPad({
  itemKey,
  band,
  className,
  title,
  defaultOpen = false,
  invitation,
}: BBScratchPadProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [spaces, setSpaces] = useState(() => layoutStore.get(itemKey) ?? 1);

  // PracticePage keeps one instance mounted and swaps `itemKey` between items, so
  // the state initialisers above run only once. Without this the child's choice of
  // spaces would follow them onto the next item, which is somebody else's working
  // layout — and on a page where the count could hint at the structure, that is
  // exactly the leak this component is careful about elsewhere.
  const [syncedKey, setSyncedKey] = useState(itemKey);
  if (syncedKey !== itemKey) {
    setSyncedKey(itemKey);
    setSpaces(layoutStore.get(itemKey) ?? 1);
    setOpen(defaultOpen);
  }

  const chooseSpaces = (n: number) => {
    setSpaces(n);
    layoutStore.set(itemKey, n);
  };

  const height = band === 'A' ? 280 : 220;
  // Band A gets no divider chooser: at that band the pad is a drawing space for
  // counting objects, and staged working is not yet the method being taught.
  const offerStages = band !== 'A';

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
        <span>{title ?? (band === 'A' ? 'Drawing space' : 'Scratch pad')}</span>
        <span aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')}>
          ⌄
        </span>
      </button>
      {open && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-2">
          {offerStages && (
            <div className="mb-2 flex flex-wrap items-center gap-2 px-1">
              <span className="text-sm text-text-secondary">Working spaces</span>
              <div className="flex gap-1" role="group" aria-label="How many working spaces">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => chooseSpaces(n)}
                    aria-pressed={spaces === n}
                    className={cn(
                      'min-h-[36px] min-w-[36px] rounded-lg border px-3 text-sm font-medium transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation',
                      spaces === n
                        ? 'border-primary bg-primary-light text-primary-700'
                        : 'border-gray-200 bg-white text-text-secondary hover:bg-gray-50',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* The canvas is one surface; the dividers sit above it and never take
              pointer events, so a stroke may still cross a boundary. A child who
              needs more room should not be stopped by a line we drew. */}
          <div className="relative">
            <ScratchPad
              fillWidth
              height={height}
              initialStrokes={strokeStore.get(itemKey) ?? []}
              onStrokesChange={(strokes) => strokeStore.set(itemKey, strokes)}
              backgroundStyle="blank"
            />
            {spaces > 1 && (
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="flex h-full w-full">
                  {Array.from({ length: spaces }, (_, i) => (
                    <div
                      key={i}
                      className={cn('relative h-full flex-1', i > 0 && 'border-l border-dashed border-gray-300')}
                    >
                      <span className="absolute left-2 top-1 text-xs font-medium text-gray-400">
                        {STAGE_LABELS[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {(invitation || offerStages) && (
            <p className="mt-2 px-1 text-sm text-text-secondary">
              {invitation ?? 'Working it out in parts can help. Use a space for each part.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
