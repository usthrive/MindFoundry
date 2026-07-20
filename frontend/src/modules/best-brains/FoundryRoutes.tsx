/**
 * Best Brains-inspired module — /foundry route tree (lazy chunk).
 *
 * Mounted from App.tsx as `/foundry/*`. FoundryLayout guards on a selected
 * child and provides the session context; screens are SCREEN-SPECS canonical
 * names; edges follow the routing map (the DD1 machine governs all mastery
 * edges — each mastery screen re-guards on the week state, so deep links
 * can't step outside the machine).
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import FoundryLayout from './screens/FoundryLayout';
import FoundryParentLayout from './screens/parent/FoundryParentLayout';
import ParentHome from './screens/parent/ParentHome';
import ParentWelcome from './screens/parent/ParentWelcome';
import PlacementStory from './screens/parent/PlacementStory';
import WeeklyReport from './screens/parent/WeeklyReport';
import ReportHistory from './screens/parent/ReportHistory';
import TrendsView from './screens/parent/TrendsView';
import MasteryMap from './screens/parent/MasteryMap';
import PatternsView from './screens/parent/PatternsView';
import CoachCorner from './screens/parent/CoachCorner';
import SchoolSync from './screens/parent/SchoolSync';
import ParentControls from './screens/parent/ParentControls';
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
import PuzzleGrove from './screens/PuzzleGrove';
import WeeklyCheck from './screens/WeeklyCheck';
import WeekResolve from './screens/WeekResolve';
import StrengthenPlan from './screens/StrengthenPlan';
import MicroReteach from './screens/MicroReteach';
import FreshProblems from './screens/FreshProblems';
import SprintGate from './screens/SprintGate';
import SprintRun from './screens/SprintRun';
import SprintFinish from './screens/SprintFinish';
import TreasureChest from './screens/TreasureChest';

export default function FoundryRoutes() {
  return (
    <Routes>
      {/* Parent journey (PARENT-FLOWS) — its own layout: parent context, no
          selected-child requirement, never linked from child screens (P6:
          verdict + % live only here). */}
      <Route path="parent" element={<FoundryParentLayout />}>
        <Route index element={<ParentHome />} />
        <Route path="welcome" element={<ParentWelcome />} />
        <Route path="story/:childId" element={<PlacementStory />} />
        <Route path="report/:childId/:level/:week" element={<WeeklyReport />} />
        <Route path="history/:childId" element={<ReportHistory />} />
        <Route path="trends/:childId" element={<TrendsView />} />
        <Route path="mastery/:childId" element={<MasteryMap />} />
        <Route path="patterns/:childId" element={<PatternsView />} />
        <Route path="coach/:childId" element={<CoachCorner />} />
        <Route path="school/:childId" element={<SchoolSync />} />
        <Route path="controls/:childId" element={<ParentControls />} />
      </Route>
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
        {/* Flow 4 — Day-5 Puzzle Grove */}
        <Route path="puzzle" element={<PuzzleGrove />} />
        {/* Flow 5 — sprints (Days 2–3, ≤2/wk, B+, opt-in) */}
        <Route path="sprint" element={<SprintGate />} />
        <Route path="sprint/run" element={<SprintRun />} />
        <Route path="sprint/finish" element={<SprintFinish />} />
        {/* Flow 6 — mastery journey (DD1 machine) */}
        <Route path="check" element={<WeeklyCheck />} />
        <Route path="resolve" element={<WeekResolve />} />
        <Route path="strengthen" element={<StrengthenPlan />} />
        <Route path="reteach" element={<MicroReteach />} />
        <Route path="fresh" element={<FreshProblems />} />
        {/* Flow 7 — treasure chest (opener, never a gate) */}
        <Route path="chest" element={<TreasureChest />} />
        <Route path="*" element={<Navigate to="/foundry" replace />} />
      </Route>
    </Routes>
  );
}
