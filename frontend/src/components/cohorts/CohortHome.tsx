import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import TeamTab from './TeamTab'
import MeTab from './MeTab'
import type { Trophy } from './TrophyShelf'
import type {
  AgeBand,
  BoostWallEntry,
  Cohort,
  CohortEnergyWeekly,
  CohortViewMember,
  EffortStarsBreakdown,
} from '@/types/cohort'

const TAB_STORAGE_KEY = 'cohorts.lastTab'

interface CohortHomeProps {
  cohort: Cohort
  ageBand: AgeBand
  myChildId: string
  myChildAvatar: string

  // Team tab data
  members: CohortViewMember[]
  energyThisWeek: CohortEnergyWeekly
  energyLastWeek: CohortEnergyWeekly
  weeklyGoal: number
  cohortBoostWall: BoostWallEntry[]

  // Me tab data
  myTodayStars: number
  myTodayBreakdown: EffortStarsBreakdown
  pacer: { pastStars: number; thisStars: number; daysLeft: number } | null
  weekRibbon: Array<{ date: string; stars: number }>
  lastWeekRibbon?: Array<{ date: string; stars: number }>
  thisWeekWorksheets: number
  lastWeekWorksheets: number
  trophies: Trophy[]
  myBoostWall: BoostWallEntry[]

  // Callbacks
  onTapTeammate: (member: CohortViewMember) => void
  onOpenGhost?: () => void
  onInviteFriend?: () => void
}

export default function CohortHome(props: CohortHomeProps) {
  const [tab, setTab] = useState<'team' | 'me'>(() => {
    if (typeof window === 'undefined') return 'team'
    const saved = window.localStorage.getItem(TAB_STORAGE_KEY)
    return saved === 'me' ? 'me' : 'team'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TAB_STORAGE_KEY, tab)
    }
  }, [tab])

  return (
    <div className="mx-auto w-full max-w-[480px]">
      {/* Tab toggle */}
      <div className="px-5 pt-4">
        <div className="relative grid grid-cols-2 rounded-2xl border-2 border-primary-100 bg-primary-50 p-1">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm"
            initial={false}
            animate={{ left: tab === 'team' ? 4 : '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          {(['team', 'me'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'relative z-10 rounded-xl py-2 font-body text-sm font-bold transition-colors',
                tab === t ? 'text-primary-700' : 'text-text-secondary',
              )}
              aria-pressed={tab === t}
            >
              {t === 'team' ? 'Team' : 'Me'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab body */}
      <div className="pt-4">
        <AnimatePresence mode="wait">
          {tab === 'team' ? (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <TeamTab
                cohort={props.cohort}
                ageBand={props.ageBand}
                members={props.members}
                myChildId={props.myChildId}
                energyThisWeek={props.energyThisWeek}
                energyLastWeek={props.energyLastWeek}
                weeklyGoal={props.weeklyGoal}
                boostWall={props.cohortBoostWall}
                onTapTeammate={props.onTapTeammate}
                onOpenGhost={props.onOpenGhost}
                onInviteFriend={props.onInviteFriend}
              />
            </motion.div>
          ) : (
            <motion.div
              key="me"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MeTab
                ageBand={props.ageBand}
                childAvatar={props.myChildAvatar}
                todayStars={props.myTodayStars}
                todayBreakdown={props.myTodayBreakdown}
                pacer={props.pacer}
                weekRibbon={props.weekRibbon}
                lastWeekRibbon={props.lastWeekRibbon}
                thisWeekWorksheets={props.thisWeekWorksheets}
                lastWeekWorksheets={props.lastWeekWorksheets}
                trophies={props.trophies}
                boostWall={props.myBoostWall}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
