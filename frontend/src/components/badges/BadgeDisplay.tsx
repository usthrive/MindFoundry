import { Badge, BADGE_COLORS } from '@/utils/badgeSystem'

interface BadgeDisplayProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

export default function BadgeDisplay({ badge, size = 'md', showDescription = false }: BadgeDisplayProps) {
  const colors = BADGE_COLORS[badge.color]

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${colors.bg}
          ${colors.border}
          border-2
          rounded-full
          flex items-center justify-center
          shadow-md
          transition-transform hover:scale-110
        `}
        title={badge.description}
      >
        <span role="img" aria-label={badge.display_name}>
          {badge.icon}
        </span>
      </div>
      {showDescription && (
        <div className="mt-2 text-center">
          <p className={`font-semibold ${colors.text} ${textSizeClasses[size]}`}>
            {badge.display_name}
          </p>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 max-w-[120px]">
              {badge.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface BadgeGridProps {
  badges: Badge[]
  emptyMessage?: string
}

export function BadgeGrid({ badges, emptyMessage = 'No badges earned yet' }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🏅</div>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <BadgeDisplay key={badge.id} badge={badge} size="md" showDescription />
      ))}
    </div>
  )
}

interface BadgeRowProps {
  badges: Badge[]
  maxDisplay?: number
}

export function BadgeRow({ badges, maxDisplay = 5 }: BadgeRowProps) {
  const displayBadges = badges.slice(0, maxDisplay)
  const remaining = badges.length - maxDisplay

  if (badges.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {displayBadges.map((badge) => (
        <BadgeDisplay key={badge.id} badge={badge} size="sm" />
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center text-sm text-gray-600 font-medium">
          +{remaining}
        </div>
      )}
    </div>
  )
}
