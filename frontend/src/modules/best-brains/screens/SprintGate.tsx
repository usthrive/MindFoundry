/**
 * SprintGate (Flow 5, DD11/P11) — the sprint invitation with the three fixed
 * facts stated BEFORE any start control: two minutes · you versus your own
 * last time · never graded. The skill is named and dated as old ("already
 * yours"). "Let's go" and "Not today" carry EQUAL visual weight — declining
 * is a real choice with zero comment or record shown, and the gate never
 * re-asks the same day after a decline. Hidden entirely at Level A, on parent
 * opt-out, when the pack carries no sprint, or once the ≤2/week budget is
 * spent (eligibility is enforced by the PracticePage offer site; this screen
 * re-guards on entry).
 */

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { COPY } from '../copy';
import { sprintDeclineKey, sprintsUsedThisWeek } from '../session/sprintLogic';
import { SPRINTS_PER_WEEK_MAX } from '../constants';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

export default function SprintGate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, enrollment, weekState, pack, band } = useFoundrySession();
  const day = Number((location.state as { day?: number } | null)?.day ?? NaN);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enrollment || !weekState || !pack) return <Navigate to="/foundry" replace />;

  const sprint = pack.fluencySprint;
  const backTo = Number.isInteger(day) ? `/foundry/day/${day}/practice` : '/foundry/hub';
  // Re-guard (deep links): Level B+, sprint present, no opt-out, budget left.
  if (
    !sprint ||
    enrollment.level === 'A' ||
    enrollment.settings.sprintOptOut ||
    sprintsUsedThisWeek(weekState.dayProgress) >= SPRINTS_PER_WEEK_MAX
  ) {
    return <Navigate to={backTo} replace />;
  }

  const firstEver = sprintsUsedThisWeek(weekState.dayProgress) === 0 && !weekState.mastery.attempts?.length;
  const weeksAgoLabel = `your ${sprint.skill.toLowerCase()} — already yours`;

  function decline() {
    // Never re-asks the same day; nothing else changes, no record shown (P11).
    try {
      localStorage.setItem(sprintDeclineKey(pack!.packId), new Date().toDateString());
    } catch {
      /* politeness flag only */
    }
    navigate(backTo, { replace: true, state: { sprintDeclined: true } });
  }

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-6">
      {/* The three facts, before any start control (TEACHER-PERSONA B6). */}
      <WrenBubble band={band} autoplay text={COPY.sprintIntro[band]} emotion="warm" />

      <section aria-label="The skill" className="rounded-3xl bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">Old friends</p>
        <p className="mt-1 text-lg font-semibold text-text-primary">{weeksAgoLabel}</p>
      </section>

      {firstEver && (
        <p className="text-center text-sm text-text-secondary">
          {band === 'C'
            ? 'First one ever: when the timer sings, everything simply stops — nothing is saved except your own count.'
            : "First time? When the timer sings, we just stop and see. That's the whole game."}
        </p>
      )}

      {/* Equal visual weight — "no" is a real choice (P11). */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('/foundry/sprint/run', { replace: true, state: { day } })}
          className="min-h-[64px] rounded-2xl border-2 border-primary bg-white px-4 text-lg font-semibold text-primary hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          Let's go
        </button>
        <button
          type="button"
          onClick={decline}
          className="min-h-[64px] rounded-2xl border-2 border-primary bg-white px-4 text-lg font-semibold text-primary hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
        >
          Not today
        </button>
      </div>
    </div>
  );
}
