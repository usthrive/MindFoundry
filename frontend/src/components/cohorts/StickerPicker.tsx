import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { listStickers } from '@/services/cohorts/stickerService'
import {
  STICKER_CATEGORIES,
  type CohortViewMember,
  type Sticker,
  type StickerCategory,
} from '@/types/cohort'

interface StickerPickerProps {
  open: boolean
  recipient: CohortViewMember | null
  /**
   * If provided, the picker opens with this category pre-selected and shows
   * a one-line explanation banner ("How about a 'we miss you' sticker?").
   */
  suggestion?: { category: StickerCategory; reason: string } | null
  onClose: () => void
  onSend: (sticker: Sticker) => void | Promise<void>
}

export default function StickerPicker({
  open,
  recipient,
  suggestion = null,
  onClose,
  onSend,
}: StickerPickerProps) {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [activeCat, setActiveCat] = useState<StickerCategory>('cheer')
  const [sending, setSending] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    listStickers().then((s) => {
      if (!cancelled) setStickers(s)
    })
    return () => {
      cancelled = true
    }
  }, [open])

  // When a suggestion comes in, jump to that category.
  useEffect(() => {
    if (open && suggestion) setActiveCat(suggestion.category)
    else if (open && !suggestion) setActiveCat('cheer')
  }, [open, suggestion])

  const visible = stickers.filter((s) => s.category === activeCat)

  return (
    <AnimatePresence>
      {open && recipient && (
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
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] overflow-hidden rounded-t-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Send a sticker to ${recipient.displayName}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5">
              <span className="block h-1.5 w-10 rounded-full bg-text-muted/40" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3 pt-3">
              <div>
                <div className="font-display text-xl font-bold text-text-primary">
                  Send a sticker to {recipient.displayName}
                </div>
                <div className="font-body text-xs text-text-secondary">
                  Stickers only — that keeps everyone safe.
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sticker picker"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-100 text-lg text-text-primary"
              >
                ✕
              </button>
            </div>

            {suggestion && (
              <div className="mx-5 mb-2 rounded-2xl border-2 border-dashed border-warning bg-warning-light px-3 py-2.5 font-body text-xs text-text-primary">
                <b>💡 Suggestion:</b> {suggestion.reason}
              </div>
            )}

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto px-5 pb-3">
              {STICKER_CATEGORIES.map((c) => {
                const active = activeCat === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveCat(c.key)}
                    className={cn(
                      'flex flex-shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-2 font-body text-xs font-bold transition-colors',
                      active
                        ? 'border-primary bg-primary-50 text-primary-700'
                        : 'border-primary-100 bg-white text-text-secondary',
                    )}
                  >
                    <span className="text-base">{c.emoji}</span>
                    {c.label}
                  </button>
                )
              })}
            </div>

            {/* Sticker grid */}
            <div className="grid grid-cols-4 gap-2 px-5 pb-6">
              {visible.length === 0 && (
                <div className="col-span-4 py-8 text-center font-body text-sm text-text-secondary">
                  Loading stickers…
                </div>
              )}
              {visible.map((s) => (
                <motion.button
                  key={s.id}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  disabled={sending !== null}
                  onClick={async () => {
                    if (sending) return
                    setSending(s.id)
                    try {
                      await onSend(s)
                    } finally {
                      setSending(null)
                    }
                  }}
                  aria-label={`Send ${s.label} sticker`}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl border-2 border-primary-100 bg-white py-3 transition-shadow',
                    'min-h-[88px] active:bg-primary-50',
                  )}
                >
                  <div className="text-3xl">{s.emoji}</div>
                  <div className="mt-1 px-1 font-body text-[11px] font-bold text-text-primary">
                    {s.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
