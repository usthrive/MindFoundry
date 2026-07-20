/**
 * AnchorPanel (P7) — the digital wall poster: this week's worked examples,
 * strategy card, and glossed vocabulary. One tap from every practice screen;
 * slide-in over the current screen (the item stays visible beneath); never
 * shows or solves the current live item; never disabled during practice.
 *
 * Modes: 'empty' (pre-lesson), 'full' (all practice), 'strategy-only'
 * (WeeklyCheck/FreshProblems — increment 4 consumers).
 */

import { cn } from '@/lib/utils';
import type { InteractionBand } from '../copy';
import type { WeeklyConceptPack } from '../types';
import AudioButton from './AudioButton';

export type AnchorMode = 'full' | 'strategy-only' | 'empty';

export interface AnchorPanelProps {
  pack: WeeklyConceptPack;
  mode: AnchorMode;
  band: InteractionBand;
  open: boolean;
  onClose: () => void;
}

export default function AnchorPanel({ pack, mode, band, open, onClose }: AnchorPanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-label="This week's anchor">
      {/* Scrim: the live item stays visible beneath. */}
      <button
        type="button"
        aria-label="Close the anchor"
        onClick={onClose}
        className="absolute inset-0 bg-text-primary/20"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">This week's anchor</p>
            <h2 className="text-lg font-semibold text-text-primary">{pack.identity.conceptName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-text-secondary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 touch-manipulation"
          >
            ×
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          {mode === 'empty' && (
            <p className="rounded-2xl bg-primary-light p-4 text-text-secondary">
              The lesson fills this panel — Ms. Wren pins the worked examples here when you finish it.
            </p>
          )}

          {mode !== 'empty' && (
            <section aria-label="Strategy card">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Strategy card</h3>
              <div className="rounded-2xl bg-secondary-light p-4">
                <p className={cn('text-text-primary', band === 'A' ? 'text-lg' : 'text-base')}>
                  {pack.explanation.summary}
                </p>
                <div className="mt-2 flex justify-end">
                  <AudioButton text={pack.explanation.summary} band={band} className="h-10 w-10 text-base" />
                </div>
              </div>
            </section>
          )}

          {mode === 'full' && (
            <section aria-label="Worked examples">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
                Worked examples — pinned all week
              </h3>
              <div className="space-y-3">
                {pack.guidedExamples.map((ex) => (
                  <details key={ex.id} className="group rounded-2xl border border-gray-200 bg-white">
                    <summary className="cursor-pointer list-none px-4 py-3 font-medium text-text-primary min-h-[48px] flex items-center justify-between touch-manipulation">
                      <span>{ex.prompt}</span>
                      <span className="text-text-muted transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="space-y-2 border-t border-gray-100 px-4 py-3">
                      {ex.steps.map((step, i) => (
                        <p key={i} className="text-sm text-text-secondary">
                          {step.teacherSay && <span>{step.teacherSay} </span>}
                          {step.expected && <span className="font-semibold text-text-primary">{step.expected}</span>}
                        </p>
                      ))}
                      <p className="text-sm font-semibold text-text-primary">Answer: {ex.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {mode !== 'empty' && pack.explanation.vocabulary.length > 0 && (
            <section aria-label="Our words this week">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Our words</h3>
              <dl className="space-y-2">
                {pack.explanation.vocabulary.map((v) => (
                  <div key={v.term} className="rounded-xl bg-gray-50 px-4 py-2">
                    <dt className="font-semibold text-text-primary">{v.term}</dt>
                    <dd className="text-sm text-text-secondary">{v.kidGloss}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
