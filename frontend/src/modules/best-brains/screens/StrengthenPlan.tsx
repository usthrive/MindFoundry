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

import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { COPY, MODULE_COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';
import CheckReview, { type CheckReviewMiss } from '../components/CheckReview';
import { checkMissesFrom, REVIEW_PREFIX, skillInChildWords } from '../session/checkReview';
import { listCheckAttempts, recordItemAttempt } from '../services/bbProgressService';
import type { ErrorTag } from '../types';

export default function StrengthenPlan() {
  const { loading, enrollment, weekState, pack, band, childId } = useFoundrySession();
  const location = useLocation();
  const cameFromReview = !!(location.state as { reviewed?: boolean } | null)?.reviewed;

  // GO OVER THE PAPER FIRST (2026-09-26). A child whose check predates the
  // review, or who left before finishing it, meets his own misses here, before
  // the strengthening plan. `null` while the attempt log loads; any failure
  // falls through to the plan — the review must never block the round.
  const attemptsList = weekState?.mastery.attempts ?? [];
  const lastAttempt = attemptsList[attemptsList.length - 1];
  const lastForm = lastAttempt?.form ?? 'A';
  const [pending, setPending] = useState<CheckReviewMiss[] | null>(cameFromReview ? [] : null);
  const [reviewDone, setReviewDone] = useState(false);
  useEffect(() => {
    if (cameFromReview || !pack || !childId) return;
    let live = true;
    listCheckAttempts(childId, pack.packId)
      .then((rows) => {
        if (!live) return;
        const items = [...pack.masteryCheck.formA, ...pack.masteryCheck.formB];
        setPending(
          checkMissesFrom(rows, lastForm)
            .filter((m) => !m.reviewed)
            .map((m) => ({ item: items.find((i) => i.id === m.itemId), answer: m.answer }))
            .filter((m): m is CheckReviewMiss => !!m.item),
        );
      })
      .catch(() => { if (live) setPending([]); });
    return () => { live = false; };
  }, [cameFromReview, pack, childId, lastForm]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: this screen exists only inside the corrective loop.
  if (!['near_miss_cycle1', 'cycle2', 'escalated'].includes(weekState.state)) {
    return <Navigate to="/foundry/hub" replace />;
  }

  if (pending === null) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (pending.length > 0 && !reviewDone) {
    const packId = pack.packId;
    return (
      <CheckReview
        misses={pending}
        band={band}
        when="before-strengthening"
        onReAnswer={(item, answer, correct, stepsShown) => {
          void recordItemAttempt({
            childId,
            packId,
            itemId: item.id,
            answer: `${REVIEW_PREFIX}${answer}`,
            correct,
            hintRungsUsed: stepsShown,
            attemptNo: lastForm === 'A' ? 2 : (lastAttempt?.cycle ?? 1) + 1,
            day: lastForm === 'A' ? 5 : null,
          });
        }}
        onDone={() => setReviewDone(true)}
      />
    );
  }

  const escalated = weekState.state === 'escalated';
  const cycle2 = weekState.state === 'cycle2';
  const dominantTag: ErrorTag | undefined = lastAttempt?.dominantErrorTags?.[0];
  // The skill in the child's words: for a misconception, the week's own idea by
  // name; otherwise a plain habit. It used the mistake's adult slug
  // ("compares by the ones digit") — naming the error, not the skill.
  const skill = dominantTag === 'concept-misconception' ? pack.identity.conceptName : skillInChildWords(dominantTag);

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
