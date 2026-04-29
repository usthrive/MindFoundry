import { motion } from 'framer-motion'
import StarRow from './StarRow'
import type { AgeBand, CohortViewMember } from '@/types/cohort'

interface AvatarTileProps {
  member: CohortViewMember
  ageBand: AgeBand
  isMe?: boolean
  onTap?: (member: CohortViewMember) => void
}

function StreakFlame({ days }: { days: number }) {
  if (!days) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 font-body text-xs font-bold text-primary-700">
      🔥 {days}
    </span>
  )
}

function TrendArrow({ trend }: { trend: 'up' | 'flat' | 'down' }) {
  const map = {
    up: { icon: '↑', color: '#16A34A', bg: '#DCFCE7', label: 'Trending up' },
    flat: { icon: '→', color: '#57534E', bg: '#F5F1EC', label: 'Steady' },
    down: { icon: '↓', color: '#F59E0B', bg: '#FEF3C7', label: 'Could use a boost' },
  } as const
  const m = map[trend]
  return (
    <span
      role="img"
      aria-label={m.label}
      className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-sm font-extrabold"
      style={{ background: m.bg, color: m.color }}
    >
      {m.icon}
    </span>
  )
}

export default function AvatarTile({ member, ageBand, isMe = false, onTap }: AvatarTileProps) {
  const showStars = ageBand !== '4-7'
  const showSleepy = ageBand === '10-11' && member.sleepy
  const showTrend = ageBand === '10-11' && !member.sleepy
  const showStreak = ageBand !== '4-7'

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onTap?.(member)}
      aria-label={
        isMe
          ? 'Your tile'
          : `${member.displayName}${showSleepy ? ", hasn't practiced in two days" : ''}`
      }
      className="relative w-full overflow-hidden text-center"
      style={{
        background: isMe
          ? 'linear-gradient(135deg, #FFFFFF, #FFF7ED)'
          : 'white',
        border: isMe ? '3px solid #F97316' : '3px solid #FFEDD5',
        borderRadius: 28,
        padding: '20px 12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        opacity: showSleepy ? 0.78 : 1,
      }}
    >
      {member.masteredToday && (
        <span
          aria-label="Mastered a concept today"
          className="absolute left-2 top-2 text-xl"
        >
          🌟
        </span>
      )}
      {showSleepy && (
        <span
          aria-label="Hasn't practiced in two days"
          className="absolute right-2 top-2 text-xl"
        >
          💤
        </span>
      )}
      {showTrend && (
        <span className="absolute right-3 top-3">
          <TrendArrow trend={member.trend} />
        </span>
      )}

      <div className="mb-2 text-[56px] leading-none">{member.avatar}</div>
      <div className="mb-2 font-body text-base font-extrabold text-text-primary">
        {isMe ? 'You' : member.displayName}
      </div>

      {showStars && (
        <div className="mb-1 flex justify-center">
          <StarRow filled={member.todayStars} size={16} gap={3} />
        </div>
      )}
      {showStreak && member.streak > 0 && <StreakFlame days={member.streak} />}
      {ageBand === '4-7' && (
        <div className="mt-1 text-2xl">{member.todayStars > 0 ? '⭐' : '·'}</div>
      )}
    </motion.button>
  )
}
