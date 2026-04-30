import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import type { CohortViewMember, StickerCategory } from '@/types/cohort'

interface SuggestedStickerPromptProps {
  open: boolean
  recipient: CohortViewMember | null
  /** 'sleepy' = teammate hasn't shown up in 48h. 'trend' = trending down. */
  reason: 'sleepy' | 'trend' | null
  onSendSuggested: (category: StickerCategory) => void
  onPickAnother: () => void
  onClose: () => void
}

const COPY = {
  sleepy: {
    title: 'Taking a rest',
    body: (name: string) =>
      `${name} is taking a rest. Everyone gets quiet days. A kind sticker can really help.`,
    suggestion: { emoji: '🫂', label: "We miss you", category: 'sympathy' as StickerCategory },
  },
  trend: {
    title: 'Could use a boost',
    body: (name: string) =>
      `${name} could use a boost. Their week is a little slower than usual. A "you got this" goes a long way.`,
    suggestion: { emoji: '🛟', label: 'You got this', category: 'gotthis' as StickerCategory },
  },
}

export default function SuggestedStickerPrompt({
  open,
  recipient,
  reason,
  onSendSuggested,
  onPickAnother,
  onClose,
}: SuggestedStickerPromptProps) {
  return (
    <AnimatePresence>
      {open && recipient && reason && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-label={COPY[reason].title}
          >
            <div className="w-full max-w-[400px] rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-3 text-center text-5xl">
                {reason === 'sleepy' ? '💤' : '🌧️'}
              </div>
              <div className="text-center font-display text-2xl font-bold text-text-primary">
                {COPY[reason].title}
              </div>
              <div className="mt-2 text-center font-body text-sm text-text-secondary">
                {COPY[reason].body(recipient.displayName)}
              </div>

              <div className="mt-5 rounded-2xl border-2 border-primary-100 bg-primary-50 p-3.5 text-center">
                <div className="font-body text-[11px] font-bold uppercase tracking-wider text-primary-700">
                  Suggested
                </div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-3xl">{COPY[reason].suggestion.emoji}</span>
                  <span className="font-body text-sm font-bold text-text-primary">
                    {COPY[reason].suggestion.label}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Button
                  variant="primary"
                  onClick={() => onSendSuggested(COPY[reason].suggestion.category)}
                >
                  Send {COPY[reason].suggestion.emoji}
                </Button>
                <Button variant="ghost" onClick={onPickAnother}>
                  Pick a different one
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-body text-xs text-text-secondary"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
