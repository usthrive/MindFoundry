/**
 * ComingThisWeek — warm route stub for increment-4 surfaces (SprintGate/Run/
 * Finish, PuzzleGrove, WeeklyCheck chain, TreasureChest). A calm WrenBubble
 * line + one action back to the hub; never an error state.
 */

import { useNavigate } from 'react-router-dom';
import { MODULE_COPY } from '../copy';
import { useFoundrySession } from '../session/FoundrySession';
import WrenBubble from '../components/WrenBubble';

export default function ComingThisWeek() {
  const navigate = useNavigate();
  const { band } = useFoundrySession();

  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8">
      <WrenBubble band={band} autoplay text={MODULE_COPY.comingThisWeek[band]} emotion="settled" />
      <button
        type="button"
        onClick={() => navigate('/foundry/hub', { replace: true })}
        className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary/30 touch-manipulation"
      >
        Back to my week
      </button>
    </div>
  );
}
