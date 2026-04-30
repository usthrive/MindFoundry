import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { getCohortByCode } from '@/services/cohorts/cohortService'
import { requestJoin } from '@/services/cohorts/cohortMembershipService'
import { ageBandFromAge, type AgeBand } from '@/types/cohort'
import { cn } from '@/lib/utils'

interface JoinByCodeFlowProps {
  open: boolean
  onClose: () => void
  onSubmitted?: () => void
}

interface CohortPreview {
  id: string
  name: string
  emoji: string
  ageBandLowest: AgeBand
}

export default function JoinByCodeFlow({ open, onClose, onSubmitted }: JoinByCodeFlowProps) {
  const { children: kids, user } = useAuth()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [code, setCode] = useState('')
  const [preview, setPreview] = useState<CohortPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [childId, setChildId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStep(0)
      setCode('')
      setPreview(null)
      setChildId(kids[0]?.id ?? null)
      setBusy(false)
      setErr(null)
    }
  }, [open, kids])

  // Live cohort lookup as the parent types
  useEffect(() => {
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length < 8) {
      setPreview(null)
      return
    }
    let cancelled = false
    setPreviewLoading(true)
    getCohortByCode(trimmed).then((p) => {
      if (cancelled) return
      setPreview(p ? { ...p } : null)
      setPreviewLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  const advance = async () => {
    setErr(null)
    if (step === 0) {
      if (!preview) return
      setStep(1)
      return
    }
    if (step === 1) {
      if (!preview || !childId || !user) return
      setBusy(true)
      const req = await requestJoin({
        cohortId: preview.id,
        requestingUserId: user.id,
        childId,
      })
      setBusy(false)
      if (!req) {
        setErr('Could not send the request. The code might be wrong, or you already have a pending request.')
        return
      }
      setStep(2)
      onSubmitted?.()
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
            aria-label="Join a cohort"
          >
            <div className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{ background: i <= step ? '#0D9488' : '#CCFBF1' }}
                  />
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-2xl font-bold text-text-primary">
                  Join with a code
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
                    Enter the cohort code
                  </div>
                  <div className="mb-4 font-body text-xs text-text-secondary">
                    Another parent shared a code with you. Enter it here.
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="BLUE-FOX-7842"
                    aria-label="Cohort code"
                    autoComplete="off"
                    autoCapitalize="characters"
                    className="mb-3 w-full rounded-2xl border-2 border-primary-100 bg-primary-50 px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                  />
                  {previewLoading && (
                    <div className="rounded-2xl bg-secondary-50 p-3 text-center font-body text-sm text-text-secondary">
                      Looking up…
                    </div>
                  )}
                  {!previewLoading && preview && (
                    <div className="rounded-2xl border-2 border-secondary bg-secondary-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{preview.emoji}</div>
                        <div className="flex-1">
                          <div className="font-body text-xs font-bold text-secondary-700">
                            ✓ Found
                          </div>
                          <div className="font-display text-lg font-bold text-text-primary">
                            {preview.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!previewLoading && !preview && code.trim().length >= 8 && (
                    <div className="rounded-2xl border-2 border-warning bg-warning-light p-3 text-center font-body text-sm text-text-primary">
                      No cohort with that code. Double-check with the other parent.
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mb-1 font-body text-sm font-bold text-text-primary">
                    Which child is joining?
                  </div>
                  <div className="mb-4 font-body text-xs text-text-secondary">
                    The cohort owner will approve before your child appears on the team.
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
                              'flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left',
                              selected
                                ? 'border-secondary bg-secondary-50'
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
                            {selected && <span className="text-secondary">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="text-center">
                  <div className="mb-3 text-5xl">📨</div>
                  <div className="font-display text-2xl font-bold text-text-primary">
                    Request sent!
                  </div>
                  <div className="mt-2 font-body text-sm text-text-secondary">
                    {preview?.name}'s owner will approve your child shortly. We'll let
                    you know.
                  </div>
                  <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-left font-body text-xs text-text-primary">
                    <b>What your child sees:</b> nothing yet. Cohorts only appear after
                    approval.
                  </div>
                </div>
              )}

              {err && (
                <div className="mt-3 rounded-2xl bg-error/10 px-3 py-2 text-center font-body text-xs text-error">
                  {err}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                {step === 0 && (
                  <>
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={advance}
                      disabled={!preview}
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
                      variant="secondary"
                      onClick={advance}
                      disabled={!childId || busy || kids.length === 0}
                      isLoading={busy}
                      className="flex-1"
                    >
                      Send request
                    </Button>
                  </>
                )}
                {step === 2 && (
                  <Button variant="secondary" onClick={onClose} className="w-full">
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
