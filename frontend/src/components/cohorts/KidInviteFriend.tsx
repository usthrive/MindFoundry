import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { kidRequestInvite } from '@/services/cohorts/cohortInviteService'
import type { Cohort } from '@/types/cohort'
import { cn } from '@/lib/utils'

const INVITE_CARDS = [
  { emoji: '🚀', label: 'Join my crew!',     gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  { emoji: '☄️', label: 'Be on my team!',    gradient: 'linear-gradient(135deg, #0D9488, #0F766E)' },
  { emoji: '🌟', label: 'You are invited!',  gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B)' },
  { emoji: '🦊', label: 'Practice with me!', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
]

interface KidInviteFriendProps {
  open: boolean
  cohort: Cohort
  childId: string
  childFirstName: string
  onClose: () => void
}

export default function KidInviteFriend({
  open,
  cohort,
  childId,
  childFirstName,
  onClose,
}: KidInviteFriendProps) {
  const [step, setStep] = useState<0 | 1>(0)
  const [cardIndex, setCardIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStep(0)
      setCardIndex(0)
      setBusy(false)
      setErr(null)
    }
  }, [open])

  const card = INVITE_CARDS[cardIndex]

  const send = async () => {
    setBusy(true)
    setErr(null)
    const req = await kidRequestInvite({
      cohortId: cohort.id,
      childId,
      cardEmoji: card.emoji,
    })
    setBusy(false)
    if (!req) {
      setErr("Couldn't send right now. Try again?")
      return
    }
    setStep(1)
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
            aria-label="Invite a friend"
          >
            <div className="w-full max-w-[440px] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-2xl font-bold text-text-primary">
                  {step === 0 ? 'Pick an invite card!' : 'Sent! 📨'}
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
                  <div className="mb-4 font-body text-[13px] text-text-secondary">
                    Pick a card to send to a friend. Your grown-up shares it
                    with their grown-up.
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {INVITE_CARDS.map((c, i) => {
                      const selected = cardIndex === i
                      return (
                        <button
                          key={c.emoji}
                          type="button"
                          onClick={() => setCardIndex(i)}
                          className={cn(
                            'flex aspect-[3/4] flex-col items-center justify-center rounded-2xl p-3 text-center transition-all',
                            selected ? 'scale-[1.03] ring-4 ring-primary' : 'hover:scale-[1.01]',
                          )}
                          style={{ background: c.gradient }}
                        >
                          <div className="mb-2 text-5xl drop-shadow">{c.emoji}</div>
                          <div className="font-display text-[15px] font-bold leading-tight text-white drop-shadow">
                            {c.label}
                          </div>
                          <div className="mt-2 font-body text-[11px] font-bold text-white/85">
                            from {childFirstName}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="rounded-2xl bg-primary-50 p-3 font-body text-xs text-text-secondary">
                    🛡️ Stickers and safe stuff only. No chats. Your grown-up
                    has to say yes before anything is sent to your friend.
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
                    animate={{ scale: 1, rotate: -3, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="mx-auto mb-4 flex aspect-[3/4] w-3/4 flex-col items-center justify-center rounded-2xl p-4"
                    style={{ background: card.gradient }}
                  >
                    <div className="mb-2 text-6xl">{card.emoji}</div>
                    <div className="font-display text-xl font-bold text-white drop-shadow">
                      {card.label}
                    </div>
                    <div className="mt-2 font-body text-xs font-bold text-white/85">
                      from {childFirstName}
                    </div>
                  </motion.div>
                  <div className="font-display text-xl font-bold text-text-primary">
                    Sent to your grown-up!
                  </div>
                  <div className="mt-2 font-body text-sm text-text-secondary">
                    They will share this card with your friend's grown-up. You'll
                    see your friend on the team once everyone says yes.
                  </div>
                  <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50 p-3 font-body text-xs text-text-primary">
                    🛡️ Both grown-ups have to say yes for safety.
                  </div>
                </div>
              )}

              {err && (
                <div className="mt-3 rounded-2xl bg-error/10 px-3 py-2 text-center font-body text-xs text-error">
                  {err}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                {step === 0 ? (
                  <>
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                      Maybe later
                    </Button>
                    <Button
                      variant="primary"
                      onClick={send}
                      isLoading={busy}
                      disabled={busy}
                      className="flex-1"
                    >
                      Ask my grown-up
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
