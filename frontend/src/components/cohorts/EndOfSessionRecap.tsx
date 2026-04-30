import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import EnergyBar from './EnergyBar'
import StarRow from './StarRow'
import { getCohortForChild } from '@/services/cohorts/cohortService'
import {
  getWeeklyEnergy,
} from '@/services/cohorts/cohortEnergyService'
import {
  getPastMePacer,
  getTodayStars,
} from '@/services/cohorts/effortStarsService'
import { getInbox } from '@/services/cohorts/stickerService'
import {
  ageBandFromAge,
  type AgeBand,
  type BoostWallEntry,
  type Cohort,
} from '@/types/cohort'

interface EndOfSessionRecapProps {
  open: boolean
  childId: string | null
  childAge: number | null
  onClose: () => void
}

interface Snapshot {
  ageBand: AgeBand
  todayStars: number
  cohort: Cohort | null
  pastStars: number
  thisStars: number
  daysLeftInWeek: number
  teamEnergy: number
  weeklyGoal: number
  recentSticker: BoostWallEntry | null
}

/**
 * 3-screen swipe recap shown after a practice session completes.
 *  - Screen 0: today's stars + total
 *  - Screen 1: Past-Me check-in (8+ only; under-7 sees a generic cheer)
 *  - Screen 2: team energy bar + a recent sticker if any
 *
 * Auto-advances every 3.5s in production; tap or swipe to advance manually.
 */
export default function EndOfSessionRecap({
  open,
  childId,
  childAge,
  onClose,
}: EndOfSessionRecapProps) {
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [step, setStep] = useState<0 | 1 | 2>(0)

  useEffect(() => {
    if (!open || !childId) return
    let cancelled = false
    setStep(0)
    const ageBand = ageBandFromAge(childAge)
    ;(async () => {
      const [today, cohort, pacer, inbox] = await Promise.all([
        getTodayStars(childId),
        getCohortForChild(childId),
        getPastMePacer(childId),
        getInbox(childId, 1),
      ])
      let teamEnergy = 0
      let weeklyGoal = 120
      if (cohort) {
        const energy = await getWeeklyEnergy(cohort.id)
        teamEnergy =
          energy.thisWeek.totalEnergy +
          energy.thisWeek.synergyBonus +
          energy.thisWeek.perfectWeekBonus
        weeklyGoal = energy.weeklyGoal
      }
      if (cancelled) return
      setSnap({
        ageBand,
        todayStars: today?.stars ?? 0,
        cohort,
        pastStars: pacer?.pastStars ?? 0,
        thisStars: pacer?.thisStars ?? 0,
        daysLeftInWeek: pacer?.daysLeftInWeek ?? 0,
        teamEnergy,
        weeklyGoal,
        recentSticker: inbox[0] ?? null,
      })
    })()
    return () => {
      cancelled = true
    }
  }, [open, childId, childAge])

  // Auto-advance through the 3 screens.
  useEffect(() => {
    if (!open || !snap) return
    if (step >= 2) return
    const t = setTimeout(() => setStep(((step + 1) as 0 | 1 | 2)), 3500)
    return () => clearTimeout(t)
  }, [open, step, snap])

  const totalSteps = snap?.cohort ? 3 : 1

  return (
    <AnimatePresence>
      {open && snap && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Practice session summary"
          >
            <div className="w-full max-w-[420px] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
              {/* Step indicator */}
              {totalSteps > 1 && (
                <div className="mb-4 flex justify-center gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: i === step ? 24 : 8,
                        background: i === step ? '#F97316' : '#FFEDD5',
                      }}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="s0"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="text-center"
                    style={{ minHeight: 280 }}
                  >
                    <div className="mb-3 text-5xl">🎉</div>
                    <div className="font-display text-2xl font-bold text-text-primary">
                      {snap.ageBand === '4-7' ? 'Great practicing!' : 'You did it!'}
                    </div>
                    <div className="mt-2 font-body text-sm text-text-secondary">
                      {snap.ageBand === '4-7'
                        ? 'You showed up. That makes everyone smile.'
                        : `Today you earned ${snap.todayStars} of 5 stars.`}
                    </div>
                    <div className="mt-5 flex justify-center">
                      <StarRow filled={snap.todayStars} size={36} gap={8} sparkleLast />
                    </div>
                  </motion.div>
                )}

                {step === 1 && snap.cohort && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="text-center"
                    style={{ minHeight: 280 }}
                  >
                    {snap.ageBand === '4-7' ? (
                      <>
                        <div className="mb-3 text-5xl">🌱</div>
                        <div className="font-display text-2xl font-bold text-text-primary">
                          You are growing!
                        </div>
                        <div className="mt-2 font-body text-sm text-text-secondary">
                          Every day you practice, you get a tiny bit stronger.
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 text-5xl">👻</div>
                        <div className="font-display text-2xl font-bold text-text-primary">
                          Past-Me check-in
                        </div>
                        <div className="mt-2 font-body text-sm text-text-secondary">
                          Last week at this point you had{' '}
                          <b className="text-text-primary">{snap.pastStars} ⭐</b>. You're
                          at <b className="text-primary">{snap.thisStars} ⭐</b> now.
                        </div>
                        <div className="mt-4 rounded-2xl bg-primary-50 p-3 font-body text-sm text-text-primary">
                          {snap.thisStars >= snap.pastStars
                            ? `🎉 ${snap.thisStars - snap.pastStars} ahead of last week!`
                            : `${snap.pastStars - snap.thisStars} to catch up — you've got ${snap.daysLeftInWeek} ${snap.daysLeftInWeek === 1 ? 'day' : 'days'} left.`}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {step === 2 && snap.cohort && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ minHeight: 280 }}
                  >
                    <div className="text-center">
                      <div className="mb-3 text-5xl">{snap.cohort.emoji}</div>
                      <div className="font-display text-2xl font-bold text-text-primary">
                        Team check-in
                      </div>
                      <div className="mt-2 font-body text-sm text-text-secondary">
                        {snap.cohort.name} is at{' '}
                        <b className="text-text-primary">{snap.teamEnergy}</b> of{' '}
                        {snap.weeklyGoal} ⭐ this week.
                      </div>
                    </div>
                    <div className="mt-4">
                      <EnergyBar
                        value={snap.teamEnergy}
                        goal={snap.weeklyGoal}
                        height={20}
                        showLabel={false}
                      />
                    </div>
                    {snap.recentSticker && (
                      <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-primary-100 bg-primary-50 p-3">
                        <div className="text-3xl">{snap.recentSticker.sticker.emoji}</div>
                        <div className="flex-1">
                          <div className="font-body text-xs font-bold text-text-secondary">
                            Recent sticker
                          </div>
                          <div className="font-body text-sm font-extrabold text-text-primary">
                            {snap.recentSticker.fromDisplayName} sent you{' '}
                            "{snap.recentSticker.sticker.label}"
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex gap-2">
                {step < totalSteps - 1 ? (
                  <>
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                      Skip
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setStep(((step + 1) as 0 | 1 | 2))}
                      className="flex-1"
                    >
                      Next →
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={onClose} className="w-full">
                    Done
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
