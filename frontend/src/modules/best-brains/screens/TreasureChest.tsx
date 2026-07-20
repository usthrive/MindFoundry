/**
 * TreasureChest (Flow 7 + the weekly ritual) — two quiet things, never a gate:
 *
 *  1. Parked misses become tomorrow's warm opener: each parked item is a small
 *     closed chest (no red marks, P6); opening replays its context and runs
 *     the DD7-tag route (slip → same-item re-attempt with the located step;
 *     misconception → mini worked example from the mistakeBank first;
 *     misread → re-read together; comprehension → re-hear and restate).
 *     Items re-park at most twice, then fold into warm-up rotation — the
 *     service's listParkedItems enforces the never-a-guilt-pile law.
 *  2. The week's collection: mastered concept cards on a quiet shelf
 *     (P5-compliant — no points, no confetti; WeekResolve routes here).
 *
 * Chest emptied or dismissed → ThisWeekHub; it never blocks the day's tile.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { COPY, CONFIRMS, MODULE_COPY } from '../copy';
import { checkAnswer } from '../answers';
import { getCatalogWeek } from '../content/catalog';
import {
  listParkedItems,
  listWeekStates,
  recordItemAttempt,
  type ParkedItemRef,
} from '../services/bbProgressService';
import { PASSED_STATES } from '../constants';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import AnswerEntry from '../components/AnswerEntry';
import type { ErrorTag, PackItem } from '../types';

interface ShelfCard {
  week: number;
  conceptName: string;
}

/** DD7-tag routing: the setup line before the re-attempt (TEACHER-PERSONA §4.2). */
function setupLine(tag: ErrorTag | undefined, band: 'A' | 'B' | 'C'): string {
  switch (tag) {
    case 'procedure-slip':
      return band === 'A' ? 'One step got skipped — watch for it!' : 'Just a skipped step — find it and this one falls.';
    case 'concept-misconception':
      return band === 'A' ? "Let's remember the big idea first!" : 'Quick look at the idea first — then you take it.';
    case 'representation-misread':
      return band === 'A' ? "Let's look at the picture together first." : 'Read the picture slowly first — the math was never the problem.';
    case 'task-comprehension':
      return band === 'A' ? 'What is the question asking? Say it!' : 'Re-hear the story — what is it really asking?';
    default:
      return band === 'A' ? 'You know this one now!' : 'A fact that wanted one more look — it usually falls on the second try.';
  }
}

export default function TreasureChest() {
  const { loading, enrollment, weekState, pack, band, childId } = useFoundrySession();

  const [parked, setParked] = useState<ParkedItemRef[] | null>(null);
  const [shelf, setShelf] = useState<ShelfCard[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [resolved, setResolved] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!childId || !enrollment) return;
    void (async () => {
      try {
        if (pack) setParked(await listParkedItems(childId, pack.packId));
        else setParked([]);
        const weeks = await listWeekStates(childId, enrollment.level);
        setShelf(
          weeks
            .filter((w) => PASSED_STATES.includes(w.state))
            .map((w) => ({
              week: w.week,
              conceptName: getCatalogWeek(enrollment.level, w.week)?.conceptName ?? `Week ${w.week}`,
            })),
        );
      } catch (e) {
        console.error('[bb] chest load failed', e);
        setParked([]);
      }
    })();
  }, [childId, enrollment, pack]);

  const itemById = useMemo(() => {
    const map = new Map<string, PackItem>();
    if (pack) for (const d of pack.days) for (const i of d.items) map.set(i.id, i);
    return map;
  }, [pack]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment) return <Navigate to="/foundry" replace />;

  const chests = (parked ?? []).filter((p) => !resolved.includes(p.itemId) && itemById.has(p.itemId));
  const openRef = chests.find((c) => c.itemId === openId) ?? null;
  const openItem = openRef ? itemById.get(openRef.itemId)! : null;

  function dayOf(itemId: string): number | null {
    const m = itemId.match(/-D(\d)-/);
    return m ? Number(m[1]) : null;
  }

  function handleAnswer(answer: string) {
    if (!openItem || !openRef || !pack) return;
    const { correct } = checkAnswer(openItem.answer, answer);
    void recordItemAttempt({
      childId,
      packId: pack.packId,
      itemId: openItem.id,
      answer,
      correct,
      hintRungsUsed: 0,
      attemptNo: openRef.missCount + 1,
      day: dayOf(openItem.id),
      errorTag: correct ? undefined : openRef.errorTag ?? openItem.errorTags[0],
    });
    if (correct) {
      setResolved((r) => [...r, openItem.id]);
      // Resolution praise names the move (P4).
      setFeedback(CONFIRMS[band][resolved.length % CONFIRMS[band].length]);
    } else {
      // Missed again: it re-parks for tomorrow (max twice — service law).
      setResolved((r) => [...r, openItem.id]);
      setFeedback(COPY.itemParked[band]);
    }
    setOpenId(null);
    setShowSetup(true);
  }

  const bankEntry =
    openRef && pack ? pack.mistakeBank.find((m) => m.errorTag === openRef.errorTag) : undefined;
  const needsReteachFirst =
    openRef?.errorTag === 'concept-misconception' && !!bankEntry;

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">🧰 Treasure chest</p>
      </header>

      {parked === null ? (
        <p className="py-8 text-center text-text-secondary">Opening the chest…</p>
      ) : openItem && openRef ? (
        showSetup ? (
          <div className="flex flex-col gap-5">
            <WrenBubble band={band} autoplay text={setupLine(openRef.errorTag, band)} emotion="curious" />
            {/* Misconception route: the mini worked example comes FIRST (DD1). */}
            {needsReteachFirst && bankEntry && (
              <section aria-label="A quick look first" className="rounded-3xl bg-surface p-5 shadow-sm">
                <p className="text-text-primary">{bankEntry.description}</p>
                <p className="mt-2 text-sm text-text-secondary">{bankEntry.reteachPointer.replace(/^.*\(|\)$/g, '')}</p>
              </section>
            )}
            <button
              type="button"
              onClick={() => setShowSetup(false)}
              className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
            >
              My turn
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <section aria-label="The problem" className="rounded-3xl bg-surface p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <p className={cn('flex-1 text-text-primary', band === 'A' ? 'text-2xl' : 'text-xl')}>
                  {openItem.prompt}
                </p>
                <AudioButton text={openItem.prompt} band={band} autoplay={band === 'A'} />
              </div>
            </section>
            {openItem.hintLadder[0] && (
              <p className="rounded-xl bg-warning-light/60 px-4 py-3 text-sm text-text-secondary">
                {openItem.hintLadder[0]}
              </p>
            )}
            <AnswerEntry item={openItem} band={band} onSubmit={handleAnswer} />
          </div>
        )
      ) : (
        <>
          {feedback && <WrenBubble band={band} autoplay text={feedback} emotion="warm" />}

          {chests.length > 0 ? (
            <>
              {!feedback && <WrenBubble band={band} text={MODULE_COPY.chestOpen[band]} emotion="warm" />}
              <section aria-label="Sneaky ones to catch" className="grid grid-cols-2 gap-3">
                {chests.map((c) => (
                  <button
                    key={c.itemId}
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setShowSetup(true);
                      setOpenId(c.itemId);
                    }}
                    className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-warning/30 bg-warning-light/40 p-3 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation"
                  >
                    <span aria-hidden="true" className="text-3xl">📦</span>
                    <span className="text-xs font-medium text-text-secondary">Open me</span>
                  </button>
                ))}
              </section>
            </>
          ) : (
            !feedback && <WrenBubble band={band} text={MODULE_COPY.chestEmpty[band]} emotion="settled" />
          )}

          {/* The quiet collection — mastered concepts, no points, no confetti (P5). */}
          {shelf.length > 0 && (
            <section aria-label="Your collection" className="rounded-3xl bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
                Your collection
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {shelf.map((s) => (
                  <div key={s.week} className="rounded-2xl bg-secondary-light px-4 py-3">
                    <p className="text-sm font-semibold text-secondary-700">{s.conceptName}</p>
                    <p className="text-xs text-text-muted">Week {s.week}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {shelf.length === 0 && weekState && (
            <p className="text-center text-sm text-text-muted">{MODULE_COPY.journeyEmptyShelf[band]}</p>
          )}

          <div className="mt-auto">
            <Link
              to="/foundry/hub"
              className="block min-h-[56px] rounded-2xl bg-primary px-6 text-center leading-[56px] text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
            >
              Back to my week
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
