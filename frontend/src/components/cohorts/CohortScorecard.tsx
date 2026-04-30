import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import EnergyBar from './EnergyBar'
import { getCohortForChild } from '@/services/cohorts/cohortService'
import {
  getCohortView,
  getWeeklyEnergy,
} from '@/services/cohorts/cohortEnergyService'
import { countUnread } from '@/services/cohorts/stickerService'
import { ageBandFromAge, type Cohort, type CohortViewMember } from '@/types/cohort'

interface CohortScorecardProps {
  childId: string | null
  childAge: number | null
}

/**
 * Bottom-pinned pull-up sheet rendered on the practice page.
 *
 *  Collapsed: a thin 64px peek pill showing cohort emoji + name + team energy
 *             and an unread-stickers badge. Tap to expand.
 *
 *  Expanded:  larger card with the full Team Energy bar, a horizontal
 *             teammate avatar strip, and an "Open cohort →" CTA. Tapping
 *             the CTA navigates to /cohort. Tapping the backdrop or the
 *             collapse handle returns to the peek state without leaving
 *             the practice session.
 *
 * Hidden entirely if the child is not in any cohort.
 */
export default function CohortScorecard({ childId, childAge }: CohortScorecardProps) {
  const navigate = useNavigate()
  const ageBand = ageBandFromAge(childAge)

  const [cohort, setCohort] = useState<Cohort | null>(null)
  const [members, setMembers] = useState<CohortViewMember[]>([])
  const [teamEnergy, setTeamEnergy] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(120)
  const [unread, setUnread] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!childId) {
      setCohort(null)
      return
    }
    getCohortForChild(childId).then(async (c) => {
      if (cancelled || !c) {
        if (!cancelled) setCohort(null)
        return
      }
      setCohort(c)
      const [mems, energy, n] = await Promise.all([
        getCohortView(c.id),
        getWeeklyEnergy(c.id),
        countUnread(childId),
      ])
      if (cancelled) return
      setMembers(mems)
      setTeamEnergy(
        energy.thisWeek.totalEnergy +
          energy.thisWeek.synergyBonus +
          energy.thisWeek.perfectWeekBonus,
      )
      setWeeklyGoal(energy.weeklyGoal)
      setUnread(n)
    })
    return () => {
      cancelled = true
    }
  }, [childId])

  if (!cohort) return null

  return (
    <>
      {/* Backdrop, only visible when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={false}
        animate={{ height: expanded ? 340 : 64 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
        role="region"
        aria-label="Cohort scorecard"
        className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] overflow-hidden border-t-2 border-primary-200 bg-white shadow-2xl"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          // Sit above the existing pb-24 of the app shell.
          marginBottom: 0,
        }}
      >
        {/* Drag handle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse cohort scorecard' : 'Expand cohort scorecard'}
          className="flex w-full justify-center pt-2"
        >
          <span className="block h-1.5 w-10 rounded-full bg-text-muted/40" />
        </button>

        {/* Peek row — always visible */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-2 text-left"
          aria-expanded={expanded}
        >
          <div className="text-2xl">{cohort.emoji}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-body text-[13px] font-extrabold text-text-primary">
              {cohort.name}
            </div>
            <div className="font-body text-[11px] text-text-secondary">
              {teamEnergy} / {weeklyGoal} ⭐ this week
            </div>
          </div>
          <div className="w-24">
            <EnergyBar value={teamEnergy} goal={weeklyGoal} height={6} showLabel={false} />
          </div>
          {unread > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 font-body text-[10px] font-extrabold text-white">
              {unread} NEW
            </span>
          )}
          <span className="font-body text-base text-text-muted">{expanded ? '▼' : '▲'}</span>
        </button>

        {/* Expanded body */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-3 pb-4"
            >
              <EnergyBar value={teamEnergy} goal={weeklyGoal} height={20} showLabel />
              <div className="mt-3 mb-3 flex gap-2 overflow-x-auto pb-1">
                {members.map((m) => (
                  <div
                    key={m.memberId}
                    className="flex flex-shrink-0 flex-col items-center"
                    style={{ width: 56 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-primary-100 bg-white text-2xl">
                      {m.avatar}
                    </div>
                    <div className="mt-1 truncate font-body text-[10px] font-bold text-text-primary">
                      {m.memberId === childId ? 'You' : m.displayName}
                    </div>
                    {ageBand !== '4-7' && (
                      <div className="font-body text-[10px] text-text-secondary">
                        {m.todayStars}/5 ⭐
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/cohort')}
                className="w-full rounded-2xl border-2 border-primary bg-primary-50 py-2.5 font-body text-sm font-extrabold text-primary-700 active:scale-[0.98]"
              >
                Open cohort →
              </button>
              <div className="mt-2 text-center font-body text-[10px] text-text-muted">
                Practice keeps going — opening the cohort doesn't end your session.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
