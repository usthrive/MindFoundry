import { supabase } from '@/lib/supabase'
import type { KumonLevel } from '@/types'

export interface Badge {
  id: string
  name: string
  display_name: string
  description: string
  icon: string
  badge_type: 'level' | 'milestone'
  color: BadgeColor
  tier: number
  earned_at?: string
}

export type BadgeColor = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

const LEVEL_ORDER: KumonLevel[] = [
  '7A', '6A', '5A', '4A', '3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'
]

/**
 * Get the badge color for a given Kumon level
 */
export function getLevelBadgeColor(level: KumonLevel): BadgeColor {
  const index = LEVEL_ORDER.indexOf(level)
  if (index < 0) return 'bronze'
  if (index <= 2) return 'bronze'   // 7A-5A
  if (index <= 5) return 'silver'   // 4A-2A
  if (index <= 8) return 'gold'     // A-C
  if (index <= 11) return 'platinum' // D-F
  return 'diamond'                   // G+
}

/**
 * Color styling mappings for badges
 */
export const BADGE_COLORS = {
  bronze: {
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    ring: 'ring-amber-300',
    text: 'text-amber-700',
    gradient: 'from-amber-200 to-amber-400'
  },
  silver: {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    ring: 'ring-gray-300',
    text: 'text-gray-700',
    gradient: 'from-gray-200 to-gray-400'
  },
  gold: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    ring: 'ring-yellow-300',
    text: 'text-yellow-700',
    gradient: 'from-yellow-200 to-yellow-500'
  },
  platinum: {
    bg: 'bg-cyan-100',
    border: 'border-cyan-500',
    ring: 'ring-cyan-300',
    text: 'text-cyan-700',
    gradient: 'from-cyan-200 to-cyan-500'
  },
  diamond: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    ring: 'ring-purple-300',
    text: 'text-purple-700',
    gradient: 'from-purple-200 to-purple-500'
  }
}

interface ChildStats {
  current_level: string
  total_problems: number
  total_correct: number
  streak: number
}

/**
 * Check and award badges for a child based on their current stats
 */
export async function checkAndAwardBadges(childId: string, childData: ChildStats): Promise<Badge[]> {
  // Fetch all badge definitions
  const { data: badges, error: badgeError } = await supabase
    .from('badges')
    .select('*')

  if (badgeError || !badges) {
    console.error('Error fetching badges:', badgeError)
    return []
  }

  // Fetch already earned badges
  const { data: earnedBadges, error: earnedError } = await supabase
    .from('child_badges')
    .select('badge_id')
    .eq('child_id', childId)

  if (earnedError) {
    console.error('Error fetching earned badges:', earnedError)
  }

  const earnedIds = new Set(earnedBadges?.map(b => b.badge_id) || [])
  const newlyEarned: Badge[] = []

  for (const badge of badges) {
    // Skip if already earned
    if (earnedIds.has(badge.id)) continue

    let earned = false

    if (badge.badge_type === 'level') {
      const currentIndex = LEVEL_ORDER.indexOf(childData.current_level as KumonLevel)
      const startIndex = LEVEL_ORDER.indexOf(badge.level_range_start as KumonLevel)
      earned = currentIndex >= startIndex && currentIndex >= 0 && startIndex >= 0
    } else if (badge.badge_type === 'milestone') {
      switch (badge.milestone_type) {
        case 'problems':
          earned = childData.total_problems >= badge.milestone_value
          break
        case 'streak':
          earned = childData.streak >= badge.milestone_value
          break
        case 'accuracy':
          // Require minimum problems for accuracy badges
          const minProblems = badge.milestone_value >= 95 ? 200 : badge.milestone_value >= 90 ? 100 : 50
          const accuracy = childData.total_problems >= minProblems
            ? (childData.total_correct / childData.total_problems) * 100
            : 0
          earned = accuracy >= badge.milestone_value
          break
      }
    }

    if (earned) {
      const { error: insertError } = await supabase
        .from('child_badges')
        .insert({ child_id: childId, badge_id: badge.id })

      if (!insertError) {
        newlyEarned.push({
          ...badge,
          earned_at: new Date().toISOString()
        } as Badge)
        console.log(`🏅 Badge awarded: ${badge.display_name}`)
      }
    }
  }

  return newlyEarned
}

/**
 * Get all badges earned by a child
 */
export async function getChildBadges(childId: string): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('child_badges')
    .select(`
      earned_at,
      badges (*)
    `)
    .eq('child_id', childId)
    .order('earned_at', { ascending: false })

  if (error || !data) {
    console.error('Error fetching child badges:', error)
    return []
  }

  return data.map(item => ({
    ...(item.badges as any),
    earned_at: item.earned_at
  })) as Badge[]
}

/**
 * Get the highest tier badge color for a child (for card outline)
 */
export async function getChildHighestBadgeColor(childId: string): Promise<BadgeColor | null> {
  const badges = await getChildBadges(childId)

  if (badges.length === 0) return null

  // Find highest tier badge
  const highestTierBadge = badges.reduce((highest, badge) =>
    badge.tier > highest.tier ? badge : highest
  , badges[0])

  return highestTierBadge.color as BadgeColor
}

/**
 * Get all available badges (for display purposes)
 */
export async function getAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('badge_type', { ascending: true })
    .order('tier', { ascending: true })

  if (error || !data) {
    console.error('Error fetching all badges:', error)
    return []
  }

  return data as Badge[]
}
