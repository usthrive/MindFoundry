import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import {
  listGhostCohorts,
} from '@/services/cohorts/cohortEnergyService'
import { setGhostCohort } from '@/services/cohorts/cohortService'
import type { Cohort, GhostCohort } from '@/types/cohort'
import { cn } from '@/lib/utils'

interface GhostCohortSheetProps {
  open: boolean
  cohort: Cohort
  onClose: () => void
  onPicked: (key: string | null) => void
}

export default function GhostCohortSheet({
  open,
  cohort,
  onClose,
  onPicked,
}: GhostCohortSheetProps) {
  const [ghosts, setGhosts] = useState<GhostCohort[]>([])
  const [selected, setSelected] = useState<string | null>(cohort.ghostCohortId)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    listGhostCohorts().then(setGhosts)
    setSelected(cohort.ghostCohortId)
  }, [open, cohort.ghostCohortId])

  const apply = async () => {
    setBusy(true)
    const ok = await setGhostCohort(cohort.id, selected)
    setBusy(false)
    if (ok) onPicked(selected)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] overflow-hidden rounded-t-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Pick a Ghost Cohort"
          >
            <div className="flex justify-center pt-2.5">
              <span className="block h-1.5 w-10 rounded-full bg-text-muted/40" />
            </div>

            <div className="px-5 pt-3 pb-2">
              <div className="font-display text-2xl font-bold text-text-primary">
                Race a Ghost Cohort
              </div>
              <div className="mt-1 font-body text-[13px] text-text-secondary">
                Pick a benchmark team to race against this week. Always
                anonymous — never real children's data.
              </div>
            </div>

            <div className="space-y-2.5 px-5 pb-3">
              {/* No-ghost option */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all',
                  selected === null
                    ? 'border-text-muted bg-[#F5F1EC]'
                    : 'border-primary-100 bg-white',
                )}
              >
                <div className="text-3xl">🚫</div>
                <div className="flex-1">
                  <div className="font-body text-sm font-extrabold text-text-primary">
                    No ghost
                  </div>
                  <div className="font-body text-xs text-text-secondary">
                    Just our team. We're racing ourselves this week.
                  </div>
                </div>
                {selected === null && <span className="text-text-secondary">✓</span>}
              </button>

              {ghosts.map((g) => {
                const isSelected = selected === g.key
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setSelected(g.key)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all',
                      isSelected
                        ? 'border-secondary bg-secondary-50'
                        : 'border-primary-100 bg-white',
                    )}
                  >
                    <div className="text-3xl">{g.emoji}</div>
                    <div className="flex-1">
                      <div className="font-body text-sm font-extrabold text-text-primary">
                        {g.name}
                      </div>
                      <div className="font-body text-xs text-text-secondary">
                        {g.description}
                      </div>
                      <div className="mt-1 font-body text-[11px] font-bold text-secondary">
                        Weekly target: {g.weeklyEnergyTarget} ⭐
                      </div>
                    </div>
                    {isSelected && <span className="text-secondary">✓</span>}
                  </button>
                )
              })}
            </div>

            <div className="px-5 pt-2 pb-5">
              <div className="mb-3 rounded-2xl bg-secondary-50 p-2.5 font-body text-[11px] text-text-secondary">
                🛡️ Ghost cohorts are pre-built; no real children's data shown.
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={apply}
                  isLoading={busy}
                  disabled={busy}
                  className="flex-1"
                >
                  {selected === null ? 'Stop racing' : 'Start race'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
