import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import type { BoostWallEntry } from '@/types/cohort'

function formatDay(isoString: string): string {
  const sent = new Date(isoString)
  const now = new Date()
  const sentDay = new Date(sent.getFullYear(), sent.getMonth(), sent.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((today.getTime() - sentDay.getTime()) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return sent.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface MyBoostWallProps {
  inbox: BoostWallEntry[]
}

export default function MyBoostWall({ inbox }: MyBoostWallProps) {
  return (
    <Card
      padding="md"
      rounded="lg"
      style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFFFF)' }}
    >
      <div className="mb-3">
        <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
          Boost Wall
        </div>
        <div className="mt-1 font-body text-[13px] text-text-secondary">
          Stickers your friends sent you
        </div>
      </div>

      {inbox.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-primary-100 p-6 text-center">
          <div className="mb-2 text-3xl">💌</div>
          <div className="font-body text-[13px] font-bold text-text-primary">
            No stickers yet
          </div>
          <div className="mt-1 font-body text-xs text-text-secondary">
            Send the first one to a teammate — they'll usually send one back.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {inbox.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: i % 2 ? -2 : 2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.06 }}
              className="rounded-2xl border-2 border-primary-100 bg-white p-3 text-center"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="mb-1.5 text-4xl">{entry.sticker.emoji}</div>
              <div className="font-body text-[11px] font-extrabold text-text-primary">
                from {entry.fromDisplayName}
              </div>
              <div className="font-body text-[10px] text-text-secondary">
                {formatDay(entry.sentAt)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  )
}
