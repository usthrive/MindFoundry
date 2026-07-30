/**
 * PlacementWelcome (Flow 1, DD5) — warmly frame placement as exploration,
 * never a test. No timer, no progress %, no mention of scoring (P4/P6).
 *
 * The screen DOES now state how long the walk usually takes, which is not a timer
 * and is the distinction worth holding: a duration given before the child starts
 * is information for the adult setting the session up, whereas a clock during the
 * activity is pressure on the child. Nothing counts down, nothing is measured, and
 * the sentence says so out loud — "about ten minutes" read by an anxious
 * seven-year-old is a stopwatch unless you tell them it is not. BB-G6 (no
 * speed-gating) is unaffected.
 * Single primary CTA.
 */

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MODULE_COPY } from '../copy';
import { PLACEMENT_MAX_MINUTES } from '../constants';
import { answeredSoFar, clearPlacementProgress, loadPlacementProgress } from '../session/placementProgress';
import type { PlacementWalk } from '../session/placementProgress';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

export default function PlacementWelcome() {
  const navigate = useNavigate();
  const { childName, band, enrollment, loading, childId } = useFoundrySession();
  // If a walk was abandoned, the child is offered it back rather than silently
  // restarted from item one. Fetched, so it is absent on the first render.
  const [saved, setSaved] = useState<PlacementWalk | null>(null);
  useEffect(() => {
    let alive = true;
    void loadPlacementProgress(childId).then((w) => {
      if (alive) setSaved(w);
    });
    return () => {
      alive = false;
    };
  }, [childId]);

  // Already placed → home is the hub (re-check flow arrives with DD1 escalation, increment 4).
  if (!loading && enrollment) return <Navigate to="/foundry/hub" replace />;

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <WrenBubble band={band} autoplay text={MODULE_COPY.placementWelcome[band]} emotion="warm" />

      <div className="rounded-3xl bg-surface p-6 shadow-sm">
        <p className={band === 'A' ? 'text-xl text-text-primary' : 'text-lg text-text-primary'}>
          {band === 'A'
            ? `${childName}, let's play with some math together!`
            : `Some of this will feel easy, ${childName}, and some might feel new — both help me find where your journey starts.`}
        </p>
      </div>

      {/* HOW LONG THIS TAKES, said before it starts.
          A placement can run to twenty-five items and nothing said so, which is
          how a parent starts one ten minutes before the school run. Stated as an
          expectation and never as a clock: BB-G6 forbids speed-gating, no timer is
          shown during the activity, and the sentence says so explicitly, because
          "about ten minutes" read by an anxious seven-year-old is a stopwatch
          unless you tell them it is not. */}
      <p className="text-center text-sm text-text-secondary">
        Usually about 10 minutes, and at most around {PLACEMENT_MAX_MINUTES}. Nothing is timed, and you can
        stop whenever you like — we keep your place.
      </p>

      {saved ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/foundry/placement/activity')}
            className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
          >
            Carry on where you left off
          </button>
          <p className="text-center text-sm text-text-secondary">
            You have already done {answeredSoFar(saved)}.
          </p>
          <button
            type="button"
            onClick={() => {
              void clearPlacementProgress(childId).then(() => navigate('/foundry/placement/activity'));
            }}
            className="min-h-[56px] rounded-2xl border-2 border-gray-200 bg-white px-6 text-lg font-medium text-text-secondary hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/30 touch-manipulation"
          >
            Start again from the beginning
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/foundry/placement/activity')}
          className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          {MODULE_COPY.placementCta[band]}
        </button>
      )}
    </div>
  );
}
