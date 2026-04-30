import Card from '@/components/ui/Card'

export interface Trophy {
  id: string
  label: string
  icon: string
  when: string
}

interface TrophyShelfProps {
  trophies: Trophy[]
}

export default function TrophyShelf({ trophies }: TrophyShelfProps) {
  return (
    <Card padding="md" rounded="lg">
      <div className="mb-3">
        <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
          Trophy Shelf
        </div>
        <div className="mt-1 font-body text-[13px] text-text-secondary">
          Concepts you've mastered. These stay forever.
        </div>
      </div>

      {trophies.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-warning-light bg-[#FFFBEA] p-6 text-center">
          <div className="mb-2 text-3xl">🏆</div>
          <div className="font-body text-[13px] font-bold text-text-primary">
            Your first trophy is coming!
          </div>
          <div className="mt-1 font-body text-xs text-text-secondary">
            Master a concept by getting 90% or more on three worksheets in a row.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {trophies.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2.5 rounded-2xl border-2 p-3"
              style={{
                background: 'linear-gradient(135deg, #FFFBEA, #FFFFFF)',
                borderColor: '#FEF3C7',
              }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-warning-light text-xl">
                {t.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-body text-[13px] font-extrabold text-text-primary">
                  {t.label}
                </div>
                <div className="font-body text-[11px] text-text-secondary">{t.when}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
