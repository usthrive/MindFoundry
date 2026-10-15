/**
 * WeekStatusCard (owner, 2026-10-15) — on the child's home screen when a week has
 * not moved forward after Day 5: what happened, what moving on needs, what is
 * next, and a part for a grown-up the child can show. Words: ../session/weekStatus.ts.
 */
import type { InteractionBand } from '../copy';
import { statusLines, type StatusMiss, type WeekStatus } from '../session/weekStatus';
import AudioButton from './AudioButton';

const MARK: Record<'done' | 'fact' | 'goal' | 'next', string> = {
  done: '✓',
  fact: '•',
  goal: '★',
  next: '→',
};

export default function WeekStatusCard({
  status,
  band,
  misses,
}: {
  status: WeekStatus;
  band: InteractionBand;
  misses: StatusMiss[];
}) {
  const lines = statusLines(status, misses);
  return (
    <section aria-label="Where this week is at" data-week-status={status.kind} className="mf-card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[18px] font-bold leading-snug text-text-primary">
          <span aria-hidden="true">📋 </span>
          {lines.title}
        </h2>
        <AudioButton text={lines.speak} band={band} />
      </div>
      <ul className="flex flex-col gap-1.5">
        {lines.child.map((l, i) => (
          <li key={i} data-status-line={l.mark} className="flex items-start gap-2.5 text-[15.5px] leading-snug text-text-primary">
            <span
              aria-hidden="true"
              className="mt-0.5 w-4 shrink-0 text-center font-bold"
              style={{ color: l.mark === 'done' ? 'var(--mf-primary)' : l.mark === 'goal' ? 'var(--mf-accent-deep)' : 'var(--mf-ink-muted)' }}
            >
              {MARK[l.mark]}
            </span>
            <span className={l.mark === 'goal' ? 'font-semibold' : undefined}>{l.text}</span>
          </li>
        ))}
      </ul>
      <p className="text-[13.5px] font-semibold text-text-secondary">Show this to a grown-up 👇</p>
      <div data-grown-up className="flex flex-col gap-1.5 rounded-2xl bg-secondary-light/60 p-4">
        <p className="mf-label">For a grown-up</p>
        {lines.grownUp.map((g, i) =>
          typeof g === 'string' ? (
            <p key={i} className="text-[13.5px] leading-relaxed text-text-primary">
              {g}
            </p>
          ) : (
            // The question keeps its authored lines (promptText preserves them).
            <p key={i} data-missed className="whitespace-pre-line text-[13.5px] leading-relaxed text-text-primary">
              “{g.question}” — answered <span className="font-semibold">{g.answer}</span>
            </p>
          ),
        )}
      </div>
    </section>
  );
}
