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

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ScratchPad from '@/components/ui/ScratchPad';
import type { Stroke } from '@/components/ui/ScratchPad';
import type { InteractionBand } from '../copy';
import type { BBFigure } from '../figures/types';
import BBFigureView from './figures/BBFigureView';
import { promptText } from '../figures/prompt';

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
  /**
   * The item the pad is being used FOR. Supplying it enables full-screen mode.
   *
   * Reported from real use: "when my son opens the scratch pad he cannot see the
   * question". The pad was a fixed 220px strip (280 at band A) at the bottom of a
   * scrolling page, so opening it pushed the question off the top and left a
   * child drawing two-digit working inside a letterbox. Full-screen gives the
   * canvas the room, and PINS the question above it — including the FIGURE,
   * because half these problems are about a picture and a pad that hides the
   * picture is exactly as useless as one that hides the words.
   */
  item?: { prompt: string; figure?: BBFigure };
  /** Speaks the pinned prompt; band A cannot read it. */
  onReplayPrompt?: () => void;
  /**
   * The answer control, rendered at the FOOT of the full-screen pad.
   *
   * Reported from real use: the pad is unusable at 220px on a phone or iPad, and
   * the fix is not a bigger button to press first — opening the pad should simply
   * take the screen. But a pad that takes the screen hides the answer control,
   * which sits on the page beneath it, so the child has to close the pad to
   * answer and the working disappears at the moment they need it.
   *
   * So the answer comes WITH the pad: question pinned above, working space in the
   * middle, answer at the foot — the shape of a worked page. It is a render prop
   * because the pad owns its own open/full state: call `close()` from the
   * caller's own submit handler and the overlay steps aside as the answer lands.
   *
   *   answerSlot={(close) => (
   *     <AnswerEntry item={item} band={band}
   *       onSubmit={(a) => { close(); handleAnswer(a); }} />
   *   )}
   */
  answerSlot?: (close: () => void) => ReactNode;
}

/** Vertical padding on the full-screen canvas box (`p-2`, top + bottom). */
const PAD_BOX_PADDING = 16;

/** Content-free stage names. Never an operation, never a quantity. */
const STAGE_LABELS = ['First', 'Then', 'Next'] as const;

export default function BBScratchPad({
  itemKey,
  band,
  className,
  title,
  defaultOpen = false,
  invitation,
  item,
  onReplayPrompt,
  answerSlot,
}: BBScratchPadProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [full, setFull] = useState(false);
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
    setFull(false);
  }

  const chooseSpaces = (n: number) => {
    setSpaces(n);
    layoutStore.set(itemKey, n);
  };

  const height = band === 'A' ? 280 : 220;

  /**
   * The base ScratchPad takes a fixed pixel height — it has no fill-height mode —
   * so full screen has to compute one. It used to be `max(280, 50vh)`, which was
   * a guess made before anything else shared the overlay: with a long prompt, a
   * tall figure AND an answer row, a fixed half-viewport canvas overflows the
   * screen and pushes the answer out of reach — the exact problem the overlay
   * exists to solve, one layer along.
   *
   * So the canvas is MEASURED instead: viewport minus whatever the pinned header
   * and the answer row actually took, floored at 200px so it can never collapse
   * to a sliver. Both are observed, because the figure's height varies per item
   * and the answer row's varies per band.
   */
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const canvasBoxRef = useRef<HTMLDivElement | null>(null);
  const padWrapRef = useRef<HTMLDivElement | null>(null);
  const [fullHeight, setFullHeight] = useState(() =>
    typeof window === 'undefined' ? 420 : Math.max(200, Math.round(window.innerHeight * 0.5)),
  );

  /**
   * `ScratchPad`'s `height` sizes THE CANVAS, not the component: it also draws a
   * tool strip above and a caption below. Deriving the canvas height from the
   * viewport therefore overshoots by that chrome, and the first build of this
   * overlay pushed the answer row off the bottom of a phone — the child could
   * see two of three options. Found by rendering it and looking, which no gate
   * here can do for me.
   *
   * So measure the box the canvas actually gets, and subtract the pad's own
   * chrome (its rendered height minus the canvas height we asked for). Both are
   * observed, so a figure that reflows or an answer row that wraps corrects
   * itself. It converges in one pass because the chrome is constant.
   */
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !full) return undefined;
    const measure = () => {
      const box = canvasBoxRef.current?.clientHeight ?? 0;
      const rendered = padWrapRef.current?.offsetHeight ?? 0;
      if (!box || !rendered) return;
      const chrome = Math.max(0, rendered - fullHeight);
      // `clientHeight` includes the box's own p-2, which the pad sits inside.
      const next = Math.max(160, Math.round(box - chrome - PAD_BOX_PADDING));
      // Epsilon guard: never re-enter for sub-pixel drift.
      if (Math.abs(next - fullHeight) > 2) setFullHeight(next);
    };
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (ro) {
      for (const el of [headerRef.current, footerRef.current, canvasBoxRef.current]) if (el) ro.observe(el);
    }
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [full, fullHeight]);
  // Band A gets no divider chooser: at that band the pad is a drawing space for
  // counting objects, and staged working is not yet the method being taught.
  const offerStages = band !== 'A';

  const canFullScreen = Boolean(item);

  /**
   * Leaving full screen returns the page to rest — it does NOT drop the child
   * back onto the 220px strip they opened to escape. `open` is cleared with
   * `full` wherever full screen is available, so "Done" means done, and the next
   * tap on the toggle opens the big pad again rather than the small one.
   *
   * The strokes survive either way: they live in the per-item store, keyed on
   * itemKey, so closing and reopening returns the child to their own working.
   */
  const closeFull = useCallback(() => {
    setFull(false);
    if (canFullScreen) setOpen(false);
  }, [canFullScreen]);

  const pad = (isFull: boolean) => (
    <div className="relative">
      <ScratchPad
        fillWidth
        height={isFull ? fullHeight : height}
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
  );

  const stageChooser = offerStages && (
    <div className="flex flex-wrap items-center gap-2 px-1">
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
  );

  /**
   * FULL SCREEN — the canvas takes the screen and the QUESTION IS PINNED ABOVE IT.
   *
   * The pinned header carries the prompt, the figure, and the replay-aloud
   * control, because those are the three things a child loses when the pad opens.
   * The figure is capped at 28vh so the canvas keeps the majority of the screen
   * on a phone; the header scrolls internally if a long prompt and a tall figure
   * both need room, and the canvas never shrinks below half the viewport.
   *
   * The pad still solves nothing: this is the same blank surface, at a usable
   * size, beside the same question.
   */
  if (full && item) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Working space">
        <div
          ref={headerRef}
          className="flex max-h-[45vh] shrink-0 flex-col gap-2 overflow-y-auto border-b border-gray-200 bg-gray-50 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <p className={cn('font-medium text-text-primary', band === 'A' ? 'text-xl' : 'text-lg')}>
              {promptText(item.prompt)}
            </p>
            <div className="flex shrink-0 gap-2">
              {onReplayPrompt && (
                <button
                  type="button"
                  onClick={onReplayPrompt}
                  aria-label="Read the question again"
                  className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-200 bg-white text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
                >
                  <span aria-hidden="true">🔊</span>
                </button>
              )}
              <button
                type="button"
                onClick={closeFull}
                className="min-h-[44px] rounded-xl border border-gray-200 bg-white px-4 font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
              >
                {answerSlot ? 'Close' : 'Done'}
              </button>
            </div>
          </div>
          {item.figure && (
            <div className="max-h-[28vh] overflow-hidden">
              <BBFigureView figure={item.figure} band={band} />
            </div>
          )}
          {stageChooser}
        </div>
        <div ref={canvasBoxRef} className="min-h-0 flex-1 overflow-hidden p-2">
          <div ref={padWrapRef}>{pad(true)}</div>
        </div>
        {answerSlot && (
          /**
           * The answer at the foot of the working area, the way a worked page is
           * laid out: question at the top, working in the middle, answer at the
           * bottom. It is `shrink-0` so it can never be squeezed off a short
           * screen — the canvas gives up the room instead, and is measured
           * against this row's real height rather than a guess.
           */
          <div ref={footerRef} className="shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-3">
            {answerSlot(closeFull)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        /**
         * Opening IS going full screen, wherever full screen is available.
         *
         * The old flow made the child open a 220px strip and then find a second
         * control inside it labelled "Bigger space". Reported from real use, the
         * strip is unusable on a phone or an iPad — so the intermediate step was
         * never a feature, it was a toll on the way to the only usable size.
         *
         * `defaultOpen` deliberately does NOT take this path: the lesson screen
         * starts its pad open as an invitation to work along with the teacher,
         * and a full-screen takeover on arrival would hide the lesson.
         */
        onClick={() => {
          if (canFullScreen) {
            setOpen(true);
            setFull(true);
          } else {
            setOpen((o) => !o);
          }
        }}
        className={cn(
          'flex min-h-[48px] w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2',
          'font-medium text-text-secondary transition-colors hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation',
        )}
        aria-expanded={open}
      >
        <span>{title ?? (band === 'A' ? 'Drawing space' : 'Scratch pad')}</span>
        <span aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')}>
          &#8964;
        </span>
      </button>
      {open && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            {stageChooser}
            {canFullScreen && (
              <button
                type="button"
                onClick={() => setFull(true)}
                className={cn(
                  'ml-auto min-h-[44px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium',
                  'text-text-secondary transition-colors hover:bg-gray-50',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation',
                )}
              >
                Bigger space
              </button>
            )}
          </div>
          {pad(false)}
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
