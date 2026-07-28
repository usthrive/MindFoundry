/**
 * MicroReteach (Flow 6, DD1) — 2–4 minute worked-example-first reteach of ONLY
 * the missed skill, selected by the dominant DD7 tag's mistakeBank entry and
 * its reteachPointer (which explanation segment / guided example to replay,
 * rebuilt from the lesson's concrete model). Cycle 2 takes a different angle:
 * an alternate bank entry when one exists, otherwise the example-first route
 * instead of the script-first route. Band-voiced framing (A: "let's watch my
 * favorite example again"; C: debugging frame). Reteach complete →
 * FreshProblems (P8: teach before re-attempt).
 */

import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MODULE_COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import AudioButton from '../components/AudioButton';
import BBFigureView from '../components/figures/BBFigureView';
import type { BBFigure } from '../types';
import type { ErrorTag, ExplanationSegment, GuidedExample, MistakeBankEntry } from '../types';

interface ReteachContent {
  entry: MistakeBankEntry;
  segments: ExplanationSegment[];
  example?: GuidedExample;
}

/** Resolve a mistakeBank reteachPointer into pack content (segment/example refs). */
function resolvePointer(
  entry: MistakeBankEntry,
  script: ExplanationSegment[],
  examples: GuidedExample[],
  exampleFirst: boolean,
): ReteachContent {
  const segments: ExplanationSegment[] = [];
  for (const m of entry.reteachPointer.matchAll(/script\[(\d+)\]/g)) {
    const seg = script[Number(m[1])];
    if (seg) segments.push(seg);
  }
  let example: GuidedExample | undefined;
  const exMatch = entry.reteachPointer.match(/guidedExamples\/([A-Za-z0-9-]+)/);
  if (exMatch) example = examples.find((e) => e.id === exMatch[1]);
  // Pointer didn't parse (e.g. "60-second drill" prose): fall back to the
  // modeled example + first script segment — worked example first, always.
  if (segments.length === 0 && !example) {
    example = examples.find((e) => e.fadeLevel === 'modeled') ?? examples[0];
    if (script[0]) segments.push(script[0]);
  }
  if (exampleFirst && !example) example = examples.find((e) => e.fadeLevel === 'modeled') ?? examples[0];
  return { entry, segments, example };
}

export default function MicroReteach() {
  const navigate = useNavigate();
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();
  const [step, setStep] = useState(0);

  const content = useMemo<ReteachContent | null>(() => {
    if (!pack || !weekState) return null;
    const attempts = weekState.mastery.attempts ?? [];
    const dominantTag: ErrorTag | undefined = attempts[attempts.length - 1]?.dominantErrorTags?.[0];
    const matching = pack.mistakeBank.filter((m) => m.errorTag === dominantTag);
    const isCycle2 = weekState.state === 'cycle2';
    // Cycle 2 = a different angle (DD7 tag routing): the alternate bank entry
    // for the same tag when authored, else the example-first presentation.
    const entry = (isCycle2 && matching[1]) || matching[0] || pack.mistakeBank[0];
    return resolvePointer(entry, pack.explanation.script, pack.guidedExamples, isCycle2);
  }, [pack, weekState]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack || !content) return <Navigate to="/foundry" replace />;
  // Route guard: reteach exists only inside the corrective loop.
  if (weekState.state !== 'near_miss_cycle1' && weekState.state !== 'cycle2') {
    return <Navigate to="/foundry/hub" replace />;
  }

  // Slides: intro → segments → example walk-through → onward.
  const slides: Array<{ say: string; visual?: string; figure?: BBFigure; steps?: GuidedExample['steps']; answer?: string }> = [
    { say: MODULE_COPY.reteachIntro[band] },
    ...content.segments.map((s) => ({ say: s.say, visual: s.visual, figure: s.figure })),
    ...(content.example
      ? [
          {
            say: content.example.prompt,
            steps: content.example.steps,
            answer: content.example.answer,
          },
        ]
      : []),
  ];
  const clamped = Math.min(step, slides.length - 1);
  const slide = slides[clamped];
  const isLast = clamped === slides.length - 1;

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">A quick look together</p>
      </header>

      <div className="flex justify-center gap-2" aria-label={`Part ${clamped + 1} of ${slides.length}`}>
        {slides.map((_, i) => (
          <span key={i} className={i <= clamped ? 'h-3 w-3 rounded-full bg-primary' : 'h-3 w-3 rounded-full bg-gray-200'} />
        ))}
      </div>

      <WrenBubble band={band} autoplay text={slide.say} emotion="curious" />

      {slide.figure ? (
        <div className="rounded-3xl bg-surface p-5 shadow-sm">
          <BBFigureView figure={slide.figure} band={band} size="lg" />
        </div>
      ) : (
        slide.visual && (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-surface p-6 text-center">
            <p className="italic text-text-secondary">{slide.visual}</p>
          </div>
        )
      )}

      {slide.steps && (
        <section aria-label="Watch the example" className="rounded-3xl bg-surface p-5 shadow-sm">
          <div className="space-y-2">
            {slide.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-2">
                <div className="flex-1">
                  {s.teacherSay && <p className="text-text-primary">{s.teacherSay}</p>}
                  {s.expected && <p className="font-semibold text-text-primary">{s.expected}</p>}
                </div>
                {s.teacherSay && <AudioButton text={s.teacherSay} band={band} className="h-10 w-10 text-base" />}
              </div>
            ))}
            {slide.answer && (
              <p className="px-4 font-semibold text-text-primary">Answer: {slide.answer}</p>
            )}
          </div>
        </section>
      )}

      <div className="mt-auto flex gap-3">
        {clamped > 0 && (
          <button
            type="button"
            onClick={() => setStep((i) => Math.max(0, i - 1))}
            className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-5 font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            ↩ Again
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (isLast) navigate('/foundry/fresh', { replace: true });
            else setStep((i) => i + 1);
          }}
          className="min-h-[56px] flex-1 rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          {isLast ? 'Brand-new problems' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
