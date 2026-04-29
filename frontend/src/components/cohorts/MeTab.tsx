import TodayStarCard from './TodayStarCard'
import PastMePacer from './PastMePacer'
import MyWeekRibbon from './MyWeekRibbon'
import ForwardProgressTrail from './ForwardProgressTrail'
import TrophyShelf, { type Trophy } from './TrophyShelf'
import MyBoostWall from './MyBoostWall'
import type {
  AgeBand,
  BoostWallEntry,
  EffortStarsBreakdown,
} from '@/types/cohort'

interface MeTabProps {
  ageBand: AgeBand
  childAvatar: string
  todayStars: number
  todayBreakdown: EffortStarsBreakdown
  pacer: { pastStars: number; thisStars: number; daysLeft: number } | null
  weekRibbon: Array<{ date: string; stars: number }>
  lastWeekRibbon?: Array<{ date: string; stars: number }>
  thisWeekWorksheets: number
  lastWeekWorksheets: number
  trophies: Trophy[]
  boostWall: BoostWallEntry[]
}

export default function MeTab({
  ageBand,
  childAvatar,
  todayStars,
  todayBreakdown,
  pacer,
  weekRibbon,
  lastWeekRibbon,
  thisWeekWorksheets,
  lastWeekWorksheets,
  trophies,
  boostWall,
}: MeTabProps) {
  return (
    <div className="flex flex-col gap-4 px-5 pb-20">
      <TodayStarCard
        stars={todayStars}
        breakdown={todayBreakdown}
        ageBand={ageBand}
        childAvatar={childAvatar}
      />

      {ageBand !== '4-7' && pacer && (
        <PastMePacer
          pastStars={pacer.pastStars}
          thisStars={pacer.thisStars}
          daysLeft={pacer.daysLeft}
        />
      )}

      <MyWeekRibbon thisWeek={weekRibbon} lastWeek={lastWeekRibbon} />

      <ForwardProgressTrail
        thisWeekDone={thisWeekWorksheets}
        lastWeekDone={lastWeekWorksheets}
      />

      <TrophyShelf trophies={trophies} />

      <MyBoostWall inbox={boostWall} />
    </div>
  )
}
