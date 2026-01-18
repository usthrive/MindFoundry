import type { Database } from '@/lib/supabase'
import Button from '../ui/Button'
import { getLevelBadgeColor, BADGE_COLORS } from '@/utils/badgeSystem'
import type { KumonLevel } from '@/types'

type Child = Database['public']['Tables']['children']['Row']

interface ChildSelectorProps {
  children: Child[]
  onSelectChild: (childId: string) => void
  onAddChild?: () => void
}

export default function ChildSelector({ children, onSelectChild, onAddChild }: ChildSelectorProps) {
  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-7xl mb-6">📚</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">No Children Yet</h2>
        <p className="text-text-secondary text-lg mb-8">
          Add a child profile to start practicing!
        </p>
        <Button variant="primary" size="lg" onClick={onAddChild}>
          Add Child Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Who's practicing today?
        </h2>
        {onAddChild && (
          <Button variant="secondary" size="sm" onClick={onAddChild}>
            + Add Child
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {children.map((child) => {
          const badgeColor = getLevelBadgeColor(child.current_level as KumonLevel)
          const colors = BADGE_COLORS[badgeColor]

          return (
            <div key={child.id} className="relative">
              <button
                onClick={() => onSelectChild(child.id)}
                className={`relative w-full p-6 sm:p-8 bg-gradient-to-br from-white to-primary-50/30 rounded-3xl border-4 ${colors.border} hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-center group shadow-lg`}
              >
                {/* Badge indicator */}
                <div className={`absolute top-3 right-3 w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center text-sm shadow-md`}>
                  {badgeColor === 'diamond' ? '💎' : badgeColor === 'platinum' ? '🏆' : badgeColor === 'gold' ? '🥇' : badgeColor === 'silver' ? '🥈' : '🥉'}
                </div>
                <div className="text-7xl sm:text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {child.avatar}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">{child.name}</h3>
                <div className="space-y-2">
                  <p className={`text-sm sm:text-base font-semibold ${colors.text}`}>
                    Level {child.current_level} • Worksheet {child.current_worksheet}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {child.total_problems} problems solved
                  </p>
                  {child.streak > 0 && (
                    <p className="text-sm sm:text-base font-bold text-primary">
                      🔥 {child.streak} day streak!
                    </p>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
