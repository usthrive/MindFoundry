import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { AgeBand } from '@/types/cohort'

interface CohortHelpModalProps {
  open: boolean
  ageBand: AgeBand
  onClose: () => void
}

/**
 * Friendly explainer that demystifies the cohort UI without exposing scoring
 * mechanics that would re-introduce comparison anxiety. Two tabs:
 *  - Kid view: picture-led, age-appropriate copy
 *  - Parent view: detailed mechanics
 */
export default function CohortHelpModal({ open, ageBand, onClose }: CohortHelpModalProps) {
  const [tab, setTab] = useState<'kid' | 'parent'>('kid')

  return (
    <AnimatePresence>
      {open && (
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
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="What does this all mean?"
          >
            <div className="max-h-[88vh] w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-2xl font-bold text-text-primary">
                  How Teams works
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

              {/* Kid / Parent tab toggle */}
              <div className="relative mb-5 grid grid-cols-2 rounded-2xl border-2 border-primary-100 bg-primary-50 p-1">
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm"
                  initial={false}
                  animate={{ left: tab === 'kid' ? 4 : '50%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {(['kid', 'parent'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn(
                      'relative z-10 rounded-xl py-2 font-body text-sm font-bold transition-colors',
                      tab === t ? 'text-primary-700' : 'text-text-secondary',
                    )}
                  >
                    {t === 'kid' ? 'For me' : 'For my grown-up'}
                  </button>
                ))}
              </div>

              {tab === 'kid' ? <KidView ageBand={ageBand} /> : <ParentView ageBand={ageBand} />}

              <div className="mt-5">
                <Button variant="primary" onClick={onClose} className="w-full">
                  Got it!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Row({
  emoji,
  title,
  body,
}: {
  emoji: string
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-white p-3">
      <div className="text-3xl leading-none">{emoji}</div>
      <div className="flex-1">
        <div className="font-body text-sm font-extrabold text-text-primary">{title}</div>
        <div className="mt-0.5 font-body text-[13px] text-text-secondary">{body}</div>
      </div>
    </div>
  )
}

function KidView({ ageBand }: { ageBand: AgeBand }) {
  if (ageBand === '4-7') {
    return (
      <div className="space-y-2.5">
        <div className="rounded-2xl bg-primary-50 p-3 text-center font-body text-sm text-text-primary">
          Your team grows together. The more we all play, the bigger it gets! 🌱
        </div>
        <Row
          emoji="⭐"
          title="Played today"
          body="A friend showed up to practice. Yay!"
        />
        <Row
          emoji="🌱"
          title="Not yet today"
          body="Your friend will play later. That's okay!"
        />
        <Row
          emoji="☄️"
          title="Comet Crew"
          body="That's your team. The big bar shows how far we've all gone this week."
        />
        <Row
          emoji="💌"
          title="Send a sticker"
          body="Tap a friend to send a kind sticker. Stickers make people smile!"
        />
      </div>
    )
  }
  return (
    <div className="space-y-2.5">
      <div className="rounded-2xl bg-primary-50 p-3 text-center font-body text-sm text-text-primary">
        Earn up to 5 stars a day for things you control: showing up, making
        forward progress, doing your best, focusing, and cheering on a friend.
      </div>
      <Row
        emoji="⭐"
        title="Daily Effort Stars"
        body="5 stars a day, max. Each star is something you choose to do — not how smart or fast you are."
      />
      <Row
        emoji="🔥"
        title="Streak"
        body="Days in a row you've shown up. It only goes up — never down."
      />
      <Row
        emoji="📊"
        title="Team Energy"
        body="Everyone's stars add together into one team bar. We win together — never against each other."
      />
      <Row
        emoji="💌"
        title="Stickers"
        body="The way to cheer on a teammate. There's no chat — only stickers."
      />
      {ageBand === '10-11' && (
        <>
          <Row
            emoji="💤"
            title="Quiet days"
            body="A teammate who hasn't practiced in a couple of days. A kind sticker can help."
          />
          <Row
            emoji="↑↓"
            title="Trend"
            body="How a friend's week is going — vs. their own past, never vs. yours."
          />
        </>
      )}
    </div>
  )
}

function ParentView({ ageBand }: { ageBand: AgeBand }) {
  return (
    <div className="space-y-2.5">
      <div className="rounded-2xl bg-secondary-50 p-3 font-body text-[13px] text-text-primary">
        <b>The design rule:</b> shared celebration, never individual ranking. No
        DMs, no chat, no free text — only curated stickers between teammates.
      </div>

      <Row
        emoji="⭐"
        title="Effort Stars (max 5/day)"
        body="Show up · Forward progress · Quality (≥80% accuracy) · Focus minutes · Boost (sent a sticker). Calibrated per child — equal earning ceiling regardless of age or level."
      />
      <Row
        emoji="📊"
        title="Team Energy"
        body="Sum of every member's daily stars + a synergy bonus when all members earn at least one star the same day. Resets Monday."
      />
      <Row
        emoji="👻"
        title="Past-Me Pacer (8+)"
        body="Self-vs-self only. Compares this week's running total to the same point last week. Tone is always 'cheering, never comparing.'"
      />
      <Row
        emoji="🔒"
        title="Privacy floor"
        body="Children only see first names. No last names, no surnames, no contact info ever surfaced cross-family."
      />
      <Row
        emoji="🛡️"
        title="Parent approval"
        body="Every join requires the cohort owner's tap. Kid invite cards never expose the code; the parent shares it."
      />
      {ageBand === '4-7' && (
        <Row
          emoji="🌱"
          title="Why so simple here?"
          body="Under-7 view deliberately hides numbers, streaks, and trend signals. Research is consistent that public per-child comparison at this age produces avoidance, not motivation."
        />
      )}
    </div>
  )
}
