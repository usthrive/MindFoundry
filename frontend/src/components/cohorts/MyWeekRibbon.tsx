import Card from '@/components/ui/Card'

interface MyWeekRibbonProps {
  thisWeek: Array<{ date: string; stars: number }>
  lastWeek?: Array<{ date: string; stars: number }>
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isToday(isoDate: string): boolean {
  const d = new Date(isoDate)
  const t = new Date()
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  )
}

function dayLabel(isoDate: string): string {
  const d = new Date(isoDate)
  const idx = (d.getDay() + 6) % 7
  return DAY_NAMES[idx]
}

export default function MyWeekRibbon({ thisWeek, lastWeek = [] }: MyWeekRibbonProps) {
  return (
    <Card padding="md" rounded="lg">
      <div className="mb-3">
        <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
          My Week
        </div>
        <div className="mt-1 font-body text-[13px] text-text-secondary">
          This week (top) vs. last week (faded below)
        </div>
      </div>

      <div className="flex gap-2">
        {thisWeek.map((d, i) => {
          const today = isToday(d.date)
          const last = lastWeek[i]
          return (
            <div key={d.date} className="flex-1 text-center">
              <div
                className="mb-1 rounded-2xl px-1 py-2"
                style={{
                  background: today ? '#FFF7ED' : 'white',
                  border: today ? '2px solid #F97316' : '2px solid #FFEDD5',
                }}
              >
                <div
                  className="mb-1 font-body text-[10px] font-extrabold"
                  style={{ color: today ? '#C2410C' : '#57534E' }}
                >
                  {dayLabel(d.date)}
                </div>
                <div className="text-sm font-extrabold text-text-primary">
                  {d.stars > 0 ? `${d.stars}⭐` : '—'}
                </div>
              </div>
              <div
                className="rounded-xl bg-[#F5F1EC] px-1 py-1 font-body text-[11px] text-text-muted"
                style={{ opacity: 0.7 }}
              >
                {last && last.stars > 0 ? `${last.stars}⭐` : '—'}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
