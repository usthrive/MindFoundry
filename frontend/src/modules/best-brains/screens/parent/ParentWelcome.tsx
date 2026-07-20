/**
 * ParentWelcome (PARENT-FLOWS Flow 1) — educate the parent up front in three
 * ~20-second cards: the rhythm, your role, what this is not (E114 pattern,
 * compressed). Includes the expandable verdict pre-framing (the child never
 * sees "Review" or a % — and why), so the first non-pass week is pre-framed,
 * never a surprise. Never force-read; the cards persist in ParentHome's help
 * link. Session-length expectations carry the LS1-R1 band caps honestly.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParentContext } from './FoundryParentLayout';

const WELCOME_SEEN_KEY = 'bb-parent-welcome-seen';

const CARDS: Array<{ label: string; title: string; body: string }> = [
  {
    label: 'Card 1 · The rhythm',
    title: 'One concept a week',
    body:
      'One new concept each week, taught by Ms. Wren, practiced in short daily doses — about 8–10 ' +
      'minutes for the youngest learners, up to 15–20 for the oldest — checked at week’s end, and ' +
      'reported to you every week. The week is the unit. Consistency beats bingeing.',
  },
  {
    label: 'Card 2 · What you do',
    title: 'Read, praise, ask',
    body:
      'Read one short report a week. Say one praise line. Ask one question. You never grade ' +
      'anything — the program does the teaching and the fixing. Your "Seen it" tap is how your ' +
      'child knows their week counted.',
  },
  {
    label: 'Card 3 · What this is not',
    title: 'Not drill, not speed, not a game',
    body:
      'Timed sprints are ungraded and optional. There are no points or streak pressure. Mastery ' +
      'gates advancement, so some weeks take "one more round" — and that is the system working, ' +
      'not a setback.',
  },
];

export default function ParentWelcome() {
  const navigate = useNavigate();
  const { childList } = useParentContext();
  const [verdictOpen, setVerdictOpen] = useState(false);
  const firstChildName = childList[0]?.name ?? 'your child';

  function done() {
    localStorage.setItem(WELCOME_SEEN_KEY, new Date().toISOString());
    navigate('/foundry/parent');
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">How this module works</h1>

      {CARDS.map((card) => (
        <section key={card.label} className="mf-card flex flex-col gap-2 p-5">
          <span className="mf-label mf-label-teal">{card.label}</span>
          <h2 className="text-[19px] font-bold text-text-primary">{card.title}</h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">{card.body}</p>
        </section>
      ))}

      {/* Expandable verdict pre-framing (P6) — expandable, never forced. */}
      <section className="mf-card-quiet flex flex-col gap-2 p-5">
        <button
          type="button"
          onClick={() => setVerdictOpen((v) => !v)}
          className="text-left text-sm font-bold text-text-primary touch-manipulation"
          aria-expanded={verdictOpen}
        >
          About "Passed" and "One more round" {verdictOpen ? '▴' : '▾'}
        </button>
        {verdictOpen && (
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Each week ends in a short untimed check. You will see the verdict and the percentage —
            your child never will. On their side a non-pass is simply "one more round to make it
            stick": a short revisit, then brand-new problems. No "Review," no red marks, no
            percentages on child screens — young learners practice better without a scoreboard, and
            you stay fully informed here.
          </p>
        )}
      </section>

      <button
        type="button"
        onClick={done}
        className="mf-btn-primary touch-manipulation"
      >
        Find {firstChildName}'s starting point
      </button>
      <p className="text-center text-[12.5px] text-text-muted">
        The starting point runs on {firstChildName}'s side of the app — about 25 minutes, feels
        like exploring, never like a test.
      </p>
      <Link to="/foundry/parent" onClick={() => localStorage.setItem(WELCOME_SEEN_KEY, new Date().toISOString())} className="text-center text-[12.5px] font-semibold text-text-secondary">
        Skip for now
      </Link>
    </div>
  );
}
