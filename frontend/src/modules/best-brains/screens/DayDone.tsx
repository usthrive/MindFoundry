/**
 * DayDone (Flow 3, P5 exception 3) — the quiet daily completion moment:
 * settled, never celebratory. One strategy-praise naming today's best move
 * (P4), the done-ritual line + tomorrow preview, single dismiss to the hub.
 * Partial variant for soft-stop / idle timeout. No confetti, no fanfare,
 * no points (P5 closed list). Nothing extra unlocks for finishing early (P1).
 */

import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

interface DayDoneState {
  praise?: string;
  partial?: boolean;
}

export default function DayDone() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ day: string }>();
  const day = Number(params.day);
  const { loading, enrollment, band } = useFoundrySession();

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !Number.isInteger(day)) return <Navigate to="/foundry" replace />;

  const state = (location.state as DayDoneState | null) ?? {};
  const partial = !!state.partial;

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      {/* The day-tile fills on a soft transition — quiet, settled. */}
      <div className="flex justify-center gap-2" aria-label={partial ? `Day ${day} paused` : `Day ${day} complete`}>
        {[1, 2, 3, 4, 5].map((d) => (
          <span
            key={d}
            className={
              d < day
                ? 'h-4 w-12 rounded-full bg-secondary'
                : d === day
                  ? partial
                    ? 'h-4 w-12 rounded-full bg-secondary/40'
                    : 'h-4 w-12 rounded-full bg-secondary transition-all duration-700'
                  : 'h-4 w-12 rounded-full bg-gray-100'
            }
          />
        ))}
      </div>

      <WrenBubble
        band={band}
        autoplay
        text={partial ? COPY.idleTimeout[band] : COPY.dayComplete[band]}
        emotion="settled"
      />

      {!partial && state.praise && <WrenBubble band={band} text={state.praise} emotion="warm" />}

      <button
        type="button"
        onClick={() => navigate('/foundry/hub', { replace: true })}
        className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md transition-all hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
      >
        Back to my week
      </button>
    </div>
  );
}
