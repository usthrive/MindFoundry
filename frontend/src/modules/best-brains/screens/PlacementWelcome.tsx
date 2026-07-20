/**
 * PlacementWelcome (Flow 1, DD5) — warmly frame placement as exploration,
 * never a test. No timer, no progress %, no mention of scoring (P4/P6).
 * Single primary CTA.
 */

import { Navigate, useNavigate } from 'react-router-dom';
import { MODULE_COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

export default function PlacementWelcome() {
  const navigate = useNavigate();
  const { childName, band, enrollment, loading } = useFoundrySession();

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

      <button
        type="button"
        onClick={() => navigate('/foundry/placement/activity')}
        className="min-h-[64px] rounded-2xl bg-primary px-8 text-xl font-semibold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
      >
        {MODULE_COPY.placementCta[band]}
      </button>
    </div>
  );
}
