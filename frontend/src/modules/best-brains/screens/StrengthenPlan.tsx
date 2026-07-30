/**
 * StrengthenPlan (Flow 6, DD1/P6) — the non-pass outcome as continuation:
 * "one more round to make it stick", visually exactly as warm as WeekResolve
 * (P6 violation test). The one wobbly skill is named specifically from the
 * dominant DD7 tag; the plan is stated (short revisit + brand-new problems);
 * the non-stuck guarantee shows the other strands alive. Absent by law:
 * %, "Review", red, sad iconography, darker styling of any kind.
 * Cycle-2 promises a different angle; the escalation variant brings the
 * friendly live-teacher card ("that's ours to fix") — flagged to the parent
 * report by the scoring RPC, never to the child.
 */

import { Link, Navigate } from 'react-router-dom';
import { COPY, MODULE_COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import type { ErrorTag, MistakeBankEntry } from '../types';

/** Child-plain names for the wobbly step, from the dominant DD7 tag. */
function wobblySkillLine(entry: MistakeBankEntry | undefined, conceptName: string): string {
  if (entry?.subtype) return entry.subtype.replace(/-/g, ' ');
  return `one step of ${conceptName}`;
}

export default function StrengthenPlan() {
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: this screen exists only inside the corrective loop.
  if (!['near_miss_cycle1', 'cycle2', 'escalated'].includes(weekState.state)) {
    return <Navigate to="/foundry/hub" replace />;
  }

  const escalated = weekState.state === 'escalated';
  const cycle2 = weekState.state === 'cycle2';
  const attempts = weekState.mastery.attempts ?? [];
  const dominantTag: ErrorTag | undefined = attempts[attempts.length - 1]?.dominantErrorTags?.[0];
  const bankEntry = pack.mistakeBank.find((m) => m.errorTag === dominantTag) ?? pack.mistakeBank[0];
  const skill = wobblySkillLine(bankEntry, pack.identity.conceptName);

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-6">
      <WrenBubble band={band} autoplay text={COPY.nearMiss[band]} emotion="warm" />

      {/* The one wobbly skill, named — nothing else. */}
      <section aria-label="What we strengthen" className="rounded-3xl bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">Just this one</p>
        <p className="mt-1 text-xl font-semibold text-text-primary">{skill}</p>
        <p className="mt-2 text-text-secondary">
          {band === 'A'
            ? 'A short look tomorrow, then brand-new problems!'
            : 'A short revisit tomorrow, then brand-new problems. Everything else keeps moving.'}
        </p>
      </section>

      {cycle2 && <WrenBubble band={band} text={MODULE_COPY.strengthenCycle2[band]} emotion="curious" />}

      {escalated && (
        <section aria-label="A teacher joins in" className="rounded-3xl bg-primary-light p-6">
          <p aria-hidden="true" className="text-3xl">🤝</p>
          <p className="mt-2 text-lg text-text-primary">{MODULE_COPY.strengthenEscalated[band]}</p>
          <p className="mt-2 text-sm text-text-secondary">
            {band === 'C'
              ? "We'll also double-check the starting point — calibration, not a verdict."
              : "Ms. Wren is double-checking her own homework, too."}
          </p>
        </section>
      )}

      {/* The other strands stay visibly alive — never a stuck screen. */}
      <div className="flex flex-col gap-3">
        <Link
          to="/foundry/hub"
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-center leading-[56px] text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
        >
          Back to my week
        </Link>
        <Link
          to="/foundry/chest"
          className="flex min-h-[52px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 touch-manipulation"
        >
          🧰 Treasure chest
        </Link>
      </div>
    </div>
  );
}
