import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { createCohort } from '@/services/cohorts/cohortService'
import { ageBandFromAge, type AgeBand, type Cohort } from '@/types/cohort'
import { cn } from '@/lib/utils'

const COHORT_EMOJIS = ['☄️', '🚀', '🌟', '🦊', '🐢', '🐙', '🌈', '🦄', '🍩', '🐝']

interface CreateCohortFlowProps {
  open: boolean
  onClose: () => void
  onCreated: (cohort: Cohort) => void
}

export default function CreateCohortFlow({ open, onClose, onCreated }: CreateCohortFlowProps) {
  const { children: kids } = useAuth()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [name, setName] = useState('Comet Crew')
  const [emoji, setEmoji] = useState('☄️')
  const [childId, setChildId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<Cohort | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStep(0)
      setName('Comet Crew')
      setEmoji('☄️')
      setChildId(kids[0]?.id ?? null)
      setBusy(false)
      setCreated(null)
      setErr(null)
    }
  }, [open, kids])

  const advance = async () => {
    setErr(null)
    if (step === 0) {
      if (!name.trim()) return
      setStep(1)
      return
    }
    if (step === 1) {
      if (!childId) return
      setBusy(true)
      const child = kids.find((k) => k.id === childId)
      if (!child) {
        setErr('Could not find that child profile.')
        setBusy(false)
        return
      }
      const ageBand: AgeBand = ageBandFromAge(child.age)
      const cohort = await createCohort({
        ownerUserId: child.user_id,
        childId: child.id,
        name: name.trim(),
        emoji,
        ageBandLowest: ageBand,
      })
      setBusy(false)
      if (!cohort) {
        setErr('Could not create the cohort. Please try again.')
        return
      }
      setCreated(cohort)
      setStep(2)
    }
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Create a cohort"
          >
            <div className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              {/* Step indicator */}
              <div className="mb-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{
                      background: i <= step ? '#F97316' : '#FFEDD5',
                    }}
                  />
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-2xl font-bold text-text-primary">
                  Make a cohort
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-100 text-lg text-text-primary"
                >
                  ✕
                </button>
              </div>

              {step === 0 && (
                <div>
                  <div className="mb-1 font-body text-sm font-bold text-text-primary">
                    Pick a name & emoji
                  </div>
                  <div className="mb-4 font-body text-xs text-text-secondary">
                    Your child will see this every day. Make it fun.
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 24))}
                    maxLength={24}
                    placeholder="Comet Crew"
                    aria-label="Cohort name"
                    className="mb-4 w-full rounded-2xl border-2 border-primary-100 bg-primary-50 px-4 py-3 font-body text-base font-bold text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                  <div className="mb-2 font-body text-xs font-bold text-text-secondary">
                    Pick an emoji
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {COHORT_EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={cn(
                          'flex h-14 items-center justify-center rounded-2xl border-2 text-2xl transition-all',
                          emoji === e
                            ? 'border-primary bg-primary-50 scale-105'
                            : 'border-primary-100 bg-white',
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mb-1 font-body text-sm font-bold text-text-primary">
                    Pick the child
                  </div>
                  <div className="mb-4 font-body text-xs text-text-secondary">
                    Who is this cohort for? Age band is set automatically from this
                    child.
                  </div>
                  {kids.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-primary-100 p-4 text-center font-body text-sm text-text-secondary">
                      You haven't added a child yet. Add one from the dashboard first.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {kids.map((k) => {
                        const selected = childId === k.id
                        return (
                          <button
                            key={k.id}
                            type="button"
                            onClick={() => setChildId(k.id)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all',
                              selected
                                ? 'border-primary bg-primary-50'
                                : 'border-primary-100 bg-white',
                            )}
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl">
                              {k.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="font-body text-sm font-extrabold text-text-primary">
                                {k.name}
                              </div>
                              <div className="font-body text-xs text-text-secondary">
                                Age {k.age} · band {ageBandFromAge(k.age)}
                              </div>
                            </div>
                            {selected && <span className="text-primary">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && created && (
                <div className="text-center">
                  <div className="mb-2 text-5xl">{created.emoji}</div>
                  <div className="font-display text-2xl font-bold text-text-primary">
                    {created.name}
                  </div>
                  <div className="mt-1 font-body text-sm text-text-secondary">
                    Share this code with other parents.
                  </div>
                  <div className="mt-4 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50 p-4">
                    <div className="font-mono text-2xl font-extrabold tracking-widest text-primary-700">
                      {created.code}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        await navigator.clipboard?.writeText(created.code)
                      }}
                      className="flex-1"
                    >
                      📋 Copy
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        const text = `Join my MindFoundry cohort "${created.name}" with code ${created.code}`
                        if (navigator.share) {
                          try {
                            await navigator.share({ title: created.name, text })
                          } catch {
                            // User dismissed; ignore
                          }
                        } else {
                          await navigator.clipboard?.writeText(text)
                        }
                      }}
                      className="flex-1"
                    >
                      📤 Share
                    </Button>
                  </div>
                  <div className="mt-3 font-body text-[11px] text-text-muted">
                    Your child sees the cohort right away. Other children join when
                    you approve their parent's request.
                  </div>
                </div>
              )}

              {err && (
                <div className="mt-3 rounded-2xl bg-error/10 px-3 py-2 text-center font-body text-xs text-error">
                  {err}
                </div>
              )}

              {/* Footer */}
              <div className="mt-5 flex gap-2">
                {step === 0 && (
                  <>
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={advance}
                      disabled={!name.trim()}
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </>
                )}
                {step === 1 && (
                  <>
                    <Button variant="ghost" onClick={() => setStep(0)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={advance}
                      disabled={!childId || busy || kids.length === 0}
                      isLoading={busy}
                      className="flex-1"
                    >
                      Create
                    </Button>
                  </>
                )}
                {step === 2 && created && (
                  <Button
                    variant="primary"
                    onClick={() => onCreated(created)}
                    className="w-full"
                  >
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
