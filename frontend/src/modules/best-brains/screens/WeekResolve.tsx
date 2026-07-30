/**
 * WeekResolve (Flow 6, P5 exception 3) — the week's slightly-warmer completion
 * moment: concept named as owned, shelf grows, next week previewed. Fast-track
 * adds the strategy-credit line; a post-corrective pass is visually
 * indistinguishable in tone from a first-pass (P6). No %, no grade, no
 * confetti — warmth over fanfare. Continue → TreasureChest (the weekly
 * collection ritual) → JourneyMap/hub. The next-week reveal itself lives on
 * the hub and waits for the cycle to turn (P1: nothing extra unlocks today).
 */

import { Link, Navigate, useLocation } from 'react-router-dom';
import { COPY, weekPassedLine } from '../copy';
import { getCatalogWeek } from '../content/catalog';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

export default function WeekResolve() {
  const location = useLocation();
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;
  // Route guard: resolve only exists for an owned week (DD1 terminal states).
  if (weekState.state !== 'passed' && weekState.state !== 'fast_track') {
    return <Navigate to="/foundry/hub" replace />;
  }

  const fastTrack = weekState.state === 'fast_track';
  const postCorrective = (weekState.mastery.attempts ?? []).some((a) => a.form === 'B');
  const nextWeek = getCatalogWeek(enrollment.level, weekState.week + 1);
  const cameFromCheck = !!(location.state as { justResolved?: boolean } | null)?.justResolved;

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-6">
      {/* The shelf gains the concept — a quiet visible add, never fanfare. */}
      <section aria-label="Your shelf grows" className="rounded-3xl bg-secondary-light p-6 text-center">
        <p aria-hidden="true" className="text-4xl">🧺</p>
        <p className="mt-2 text-lg font-semibold text-secondary-700">{pack.identity.conceptName}</p>
        <p className="text-sm text-text-secondary">now on your shelf</p>
      </section>

      <WrenBubble
        band={band}
        autoplay={cameFromCheck}
        text={weekPassedLine(band, pack.identity.conceptName)}
        emotion="warm"
      />

      {/* Fast-track credit; post-corrective passes get identical warmth otherwise. */}
      {fastTrack && <WrenBubble band={band} text={COPY.fastTrack[band]} emotion="warm" />}
      {!fastTrack && postCorrective && (
        <WrenBubble
          band={band}
          text={
            band === 'A'
              ? 'You glued it down — it sticks now!'
              : 'The extra round did its job — this one is glued down for good.'
          }
          emotion="warm"
        />
      )}

      {nextWeek && (
        <p className="text-center text-text-secondary">
          Next on the trail: <span className="font-semibold text-text-primary">{nextWeek.conceptName}</span>
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Link
          to="/foundry/chest"
          className="min-h-[56px] rounded-2xl bg-primary px-6 text-center leading-[56px] text-lg font-semibold text-white shadow-md hover:bg-primary-hover touch-manipulation"
        >
          See your collection
        </Link>
        <Link
          to="/foundry/map"
          className="flex min-h-[52px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-4 font-medium text-text-secondary hover:bg-gray-50 touch-manipulation"
        >
          🗺️ See my journey
        </Link>
      </div>
    </div>
  );
}
