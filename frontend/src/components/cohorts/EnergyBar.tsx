import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnergyBarProps {
  value: number
  goal: number
  height?: number
  showLabel?: boolean
  className?: string
}

export default function EnergyBar({
  value,
  goal,
  height = 24,
  showLabel = true,
  className,
}: EnergyBarProps) {
  const safeGoal = Math.max(1, goal)
  const pct = Math.min(100, (value / safeGoal) * 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between font-body text-sm font-bold text-text-primary">
          <span>Team Energy</span>
          <span>
            <span className="text-secondary">{value}</span>{' '}
            <span className="text-text-muted">/ {goal}</span>
          </span>
        </div>
      )}
      <div
        className="relative w-full overflow-hidden rounded-full bg-[#F5F1EC]"
        style={{ height, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(to right, #0D9488, #F97316)',
            boxShadow: '0 2px 8px rgba(13,148,136,0.4)',
          }}
        />
      </div>
    </div>
  )
}
