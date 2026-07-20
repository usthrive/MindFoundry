/**
 * Best Brains-inspired module — /foundry route tree (lazy chunk).
 *
 * Mounted from App.tsx as `/foundry/*`. FoundryLayout guards on a selected
 * child and provides the session context; screens are SCREEN-SPECS canonical
 * names. Increment-4 surfaces (sprints, PuzzleGrove, WeeklyCheck chain,
 * TreasureChest) are warm "coming this week" stubs per the routing map.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import FoundryLayout from './screens/FoundryLayout';
import FoundryIndex from './screens/FoundryIndex';
import PlacementWelcome from './screens/PlacementWelcome';
import PlacementActivity from './screens/PlacementActivity';
import StartingPoint from './screens/StartingPoint';
import JourneyMap from './screens/JourneyMap';
import ThisWeekHub from './screens/ThisWeekHub';
import LessonRoom from './screens/LessonRoom';
import GuidedPractice from './screens/GuidedPractice';
import WarmUp from './screens/WarmUp';
import PracticePage from './screens/PracticePage';
import DayDone from './screens/DayDone';
import ComingThisWeek from './screens/ComingThisWeek';

export default function FoundryRoutes() {
  return (
    <Routes>
      <Route element={<FoundryLayout />}>
        <Route index element={<FoundryIndex />} />
        {/* Flow 1 — placement */}
        <Route path="placement/welcome" element={<PlacementWelcome />} />
        <Route path="placement/activity" element={<PlacementActivity />} />
        <Route path="placement/result" element={<StartingPoint />} />
        {/* Flow 8 — the child's only progress surface */}
        <Route path="map" element={<JourneyMap />} />
        {/* Flow 2 — weekly cycle */}
        <Route path="hub" element={<ThisWeekHub />} />
        <Route path="lesson" element={<LessonRoom />} />
        <Route path="guided" element={<GuidedPractice />} />
        {/* Flow 3 — daily practice */}
        <Route path="day/:day/warmup" element={<WarmUp />} />
        <Route path="day/:day/practice" element={<PracticePage />} />
        <Route path="day/:day/done" element={<DayDone />} />
        {/* Increment-4 surfaces — warm stubs (SprintGate/Run/Finish, PuzzleGrove, WeeklyCheck chain, TreasureChest) */}
        <Route path="puzzle" element={<ComingThisWeek />} />
        <Route path="check" element={<ComingThisWeek />} />
        <Route path="sprint" element={<ComingThisWeek />} />
        <Route path="chest" element={<ComingThisWeek />} />
        <Route path="*" element={<Navigate to="/foundry" replace />} />
      </Route>
    </Routes>
  );
}
