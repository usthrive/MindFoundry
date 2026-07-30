/**
 * LessonRoom (Flow 2, DD4) — Ms. Wren's concept lesson: hook → why-before-how
 * → worked-example script → summary → vocabulary. Segment dots, pause-free
 * replay per segment; NO skip control exists on first encounter (P8 hard law);
 * freely navigable on replay. Completion visibly pins the worked examples into
 * the AnchorPanel (E99) and flows to GuidedPractice.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { COPY } from '../copy';
import { isLessonComplete } from '../session/weekLogic';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import BBFigureView from '../components/figures/BBFigureView';
import BBScratchPad from '../components/BBScratchPad';
import type { BBFigure } from '../types';

interface Segment {
  say: string;
  visual?: string;
  figure?: BBFigure;
}

export default function LessonRoom() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();

  const replayMode = !!weekState && isLessonComplete(weekState.dayProgress);
  const resumeKey = weekState ? `bb-lesson-${weekState.level}${weekState.week}` : 'bb-lesson';
  const [segIdx, setSegIdx] = useState(() => {
    const saved = Number(sessionStorage.getItem(resumeKey) ?? '0');
    return Number.isInteger(saved) && saved >= 0 ? saved : 0;
  });
  const [pinned, setPinned] = useState(false);

  const segments: Segment[] = useMemo(() => {
    if (!pack) return [];
    return [
      { say: pack.explanation.hook },
      { say: pack.explanation.whyBeforeHow },
      ...pack.explanation.script,
      { say: pack.explanation.summary },
    ];
  }, [pack]);

  // Resume at segment boundary (Flow 2 edge rule).
  useEffect(() => {
    if (!replayMode) sessionStorage.setItem(resumeKey, String(segIdx));
  }, [segIdx, replayMode, resumeKey]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;

  const clamped = Math.min(segIdx, segments.length - 1);
  const segment = segments[clamped];
  const isLast = clamped === segments.length - 1;
  /** From the first worked-example segment onward (0 = hook, 1 = why). */
  const showPad = clamped >= 2;

  // Completion moment: the pin animation → GuidedPractice (first encounter).
  if (pinned) {
    return (
      <div className="flex min-h-[70vh] flex-col justify-center gap-8">
        <div className="rounded-3xl bg-secondary-light p-6 text-center">
          <p aria-hidden="true" className="text-4xl">
            📌
          </p>
          <p className="mt-2 text-lg font-medium text-secondary-700">Pinned to your anchor</p>
        </div>
        <WrenBubble band={band} autoplay text={COPY.lessonPin[band]} emotion="warm" />
        <button
          type="button"
          onClick={() => navigate('/foundry/guided', { replace: true })}
          className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          Let's try together
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">{pack.identity.conceptName}</h1>
        {replayMode && (
          <Link
            to="/foundry/hub"
            className="flex min-h-[48px] items-center rounded-xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 touch-manipulation"
          >
            Back to my week
          </Link>
        )}
      </header>

      {/* Segment progress as simple dots (never a %). */}
      <div className="flex justify-center gap-2" aria-label={`Part ${clamped + 1} of ${segments.length}`}>
        {segments.map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={!replayMode}
            onClick={() => replayMode && setSegIdx(i)}
            aria-label={`Part ${i + 1}`}
            className={cn(
              'h-3 w-3 rounded-full transition-colors',
              i === clamped ? 'bg-primary' : i < clamped ? 'bg-primary/40' : 'bg-gray-200',
              replayMode && 'cursor-pointer hover:bg-primary/60',
            )}
          />
        ))}
      </div>

      <WrenBubble band={band} autoplay text={segment.say} emotion="curious" />

      {/* B1.0: the picture the lesson always described but never drew (L27). A
          segment with no figure falls back to its written direction rather than
          showing nothing — a visible marker of un-migrated content. */}
      {segment.figure ? (
        <div className="rounded-3xl bg-surface p-5 shadow-sm">
          <BBFigureView figure={segment.figure} band={band} size="lg" />
        </div>
      ) : (
        segment.visual && (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-surface p-6 text-center">
            <p className="text-text-secondary italic">{segment.visual}</p>
          </div>
        )
      )}

      {/* A PENCIL DURING THE CONVERSATION.
          Segments run [hook, whyBeforeHow, ...script, summary], so index 2 is where
          Ms. Wren starts working an example — which is the moment a child should
          have something to write on. The first two segments are her framing and
          need no working.

          It opens by default here, unlike on a practice item. During the lesson
          nothing is being assessed, so an open pad cannot leak the structure of a
          question; on an assessed page it could, which is why that default is off.
          One key for the whole lesson, so working accumulates as she goes rather
          than vanishing at each Continue. */}
      {showPad && (
        <BBScratchPad
          itemKey={`lesson-${weekState.level}${weekState.week}`}
          band={band}
          title="Try it with me"
          defaultOpen
          invitation="Have a go here while we talk. Nobody marks this."
        />
      )}

      {isLast && pack.explanation.vocabulary.length > 0 && (
        <section aria-label="Our words this week" className="rounded-3xl bg-surface p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Our words</h2>
          <div className="space-y-2">
            {pack.explanation.vocabulary.map((v) => (
              <div key={v.term} className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-2">
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{v.term}</p>
                  <p className="text-sm text-text-secondary">{v.kidGloss}</p>
                </div>
                <AudioButton text={`${v.term}. ${v.kidGloss}`} band={band} className="h-10 w-10 text-base" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-auto flex gap-3">
        {clamped > 0 && (
          <button
            type="button"
            onClick={() => setSegIdx((i) => Math.max(0, i - 1))}
            className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-5 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            ↩ Again
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (!isLast) {
              setSegIdx((i) => i + 1);
            } else if (replayMode) {
              navigate('/foundry/hub');
            } else {
              sessionStorage.removeItem(resumeKey);
              setPinned(true);
            }
          }}
          className="min-h-[56px] flex-1 rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          {isLast ? (replayMode ? 'Back to my week' : 'Pin our examples') : 'Continue'}
        </button>
      </div>
    </div>
  );
}
