import Card from '@/components/ui/Card'
import { StarSlot } from './StarRow'
import { STAR_CATEGORIES, type AgeBand, type EffortStarsBreakdown } from '@/types/cohort'

interface TodayStarCardProps {
  stars: number
  breakdown: EffortStarsBreakdown
  ageBand: AgeBand
  childAvatar?: string
}

export default function TodayStarCard({
  stars,
  breakdown,
  ageBand,
  childAvatar = '🧑‍🎓',
}: TodayStarCardProps) {
  const next = STAR_CATEGORIES.find((c) => !breakdown[c.key]) ?? null

  return (
    <Card variant="elevated" padding="md" rounded="xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="font-body text-[11px] font-bold uppercase tracking-wider text-primary">
            Today's stars
          </div>
          <div className="mt-1 font-display text-[26px] font-bold leading-tight text-text-primary">
            {ageBand === '4-7' && stars >= 4
              ? 'Awesome day!'
              : stars === 0
                ? "Let's start!"
                : `You earned ${stars} of 5!`}
          </div>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary-100 bg-primary-50 text-3xl">
          {childAvatar}
        </div>
      </div>

      <div className="mb-4 flex items-end gap-2">
        {STAR_CATEGORIES.map((cat, i) => {
          const filled = breakdown[cat.key]
          return (
            <div key={cat.key} className="flex-1 text-center">
              <div className="flex justify-center">
                <StarSlot
                  filled={!!filled}
                  size={44}
                  delay={i * 0.08}
                  sparkle={i === stars - 1}
                  index={i}
                  total={5}
                />
              </div>
              {ageBand !== '4-7' && (
                <div
                  className="mt-2 font-body text-[10px] font-bold leading-tight"
                  style={{ color: filled ? '#1C1917' : '#A8A29E' }}
                >
                  {cat.label}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {next && ageBand !== '4-7' && (
        <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-3">
          <div className="text-2xl">{next.icon}</div>
          <div className="flex-1">
            <div className="font-body text-xs font-extrabold text-primary-700">
              Next: {next.label}
            </div>
            <div className="font-body text-xs text-text-secondary">{next.hint}</div>
          </div>
        </div>
      )}
      {next && ageBand === '4-7' && (
        <div className="rounded-2xl bg-primary-50 p-3 text-center font-display text-base font-bold text-primary-700">
          Keep going! {next.icon}
        </div>
      )}
    </Card>
  )
}
