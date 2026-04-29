import Card from '@/components/ui/Card'

interface ForwardProgressTrailProps {
  thisWeekDone: number // worksheets completed this week
  lastWeekDone: number // worksheets completed last week
  trailLength?: number // total visible cells (default 8)
}

export default function ForwardProgressTrail({
  thisWeekDone,
  lastWeekDone,
  trailLength = 8,
}: ForwardProgressTrailProps) {
  const diff = thisWeekDone - lastWeekDone

  return (
    <Card padding="md" rounded="lg">
      <div className="mb-3">
        <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
          Forward Progress
        </div>
        <div className="mt-1 font-body text-[13px] text-text-secondary">
          Worksheets finished this week vs. last week
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: trailLength }).map((_, i) => {
          const filled = i < thisWeekDone
          return (
            <div
              key={i}
              className="flex h-10 flex-1 items-center justify-center rounded-xl font-body text-sm font-extrabold text-white"
              style={{
                background: filled
                  ? 'linear-gradient(135deg, #F97316, #EA580C)'
                  : '#F5F1EC',
                border: filled ? 'none' : '2px dashed rgba(168,162,158,0.55)',
              }}
            >
              {filled ? '✓' : ''}
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: trailLength }).map((_, i) => {
          const filled = i < lastWeekDone
          return (
            <div
              key={i}
              className="h-[22px] flex-1 rounded-lg"
              style={{
                background: filled ? '#F5D0AE' : '#F5F1EC',
                opacity: 0.7,
              }}
            />
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between font-body text-xs text-text-secondary">
        <span>
          <b className="text-primary">{thisWeekDone}</b> done
          {trailLength - thisWeekDone > 0 && (
            <> · {trailLength - thisWeekDone} to finish the trail</>
          )}
        </span>
        {diff !== 0 && (
          <span
            className="font-bold"
            style={{ color: diff > 0 ? '#16A34A' : '#F59E0B' }}
          >
            {diff > 0 ? `+${diff}` : diff} from last week
          </span>
        )}
      </div>
    </Card>
  )
}
