// Domain types for the Cohorts feature.
// Mirrors the schema in supabase/migrations/20260428000001_cohorts_schema.sql.

export type AgeBand = '4-7' | '8-9' | '10-11'
export type CohortType = 'friends' | 'classroom'
export type CohortMemberRole = 'owner' | 'member'
export type RequestStatus = 'pending' | 'approved' | 'declined' | 'cancelled'
export type StickerCategory =
  | 'cheer'
  | 'fistbump'
  | 'gotthis'
  | 'celebrate'
  | 'sympathy'
  | 'math'
export type Trend = 'up' | 'flat' | 'down'

export interface Cohort {
  id: string
  name: string
  emoji: string
  code: string
  ownerUserId: string
  cohortType: CohortType
  ageBandLowest: AgeBand
  ghostCohortId: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CohortMembership {
  id: string
  cohortId: string
  childId: string
  role: CohortMemberRole
  joinedAt: string
  removedAt: string | null
}

// Safe age-band-aware projection of a teammate, returned by the
// `get_cohort_view` RPC. Cross-family rendering uses ONLY this shape —
// last names, accuracy, and absolute level are never exposed.
export interface CohortViewMember {
  memberId: string
  displayName: string
  avatar: string
  ageBand: AgeBand
  todayStars: number
  streak: number
  masteredToday: boolean
  sleepy: boolean
  trend: Trend
  isOwner: boolean
}

export interface Sticker {
  id: string
  category: StickerCategory
  emoji: string
  label: string
  displayOrder: number
}

export interface StickerSend {
  id: string
  cohortId: string
  fromChildId: string
  toChildId: string
  stickerId: string
  sentAt: string
  readAt: string | null
}

// Hydrated sticker_send row joined with the sticker definition,
// for the Boost Wall.
export interface BoostWallEntry {
  id: string
  fromChildId: string
  fromDisplayName: string
  sticker: Sticker
  sentAt: string
  readAt: string | null
}

export interface GhostCohort {
  key: string
  name: string
  emoji: string
  weeklyEnergyTarget: number
  description: string | null
  displayOrder: number
}

// breakdown shape returned by compute_daily_effort_stars RPC.
export interface EffortStarsBreakdown {
  show: boolean
  forward: boolean
  quality: boolean
  focus: boolean
  boost: boolean
  total: number
}

export interface DailyEffortStars {
  childId: string
  date: string
  stars: number
  breakdown: EffortStarsBreakdown
  computedAt: string
}

export interface CohortEnergyWeekly {
  cohortId: string
  weekStartDate: string
  totalEnergy: number
  synergyBonus: number
  perfectWeekBonus: number
  computedAt: string
}

export interface CohortJoinRequest {
  id: string
  cohortId: string
  requestingUserId: string
  childId: string
  status: RequestStatus
  createdAt: string
  decidedAt: string | null
}

export interface CohortInviteRequest {
  id: string
  cohortId: string
  childId: string
  cardEmoji: string
  status: RequestStatus
  createdAt: string
  decidedAt: string | null
}

// The 5 daily effort star categories shown to the child in MeTab.
// Mirrors STAR_CATEGORIES in the prototype's data.jsx.
export interface StarCategoryDef {
  key: keyof Omit<EffortStarsBreakdown, 'total'>
  icon: string
  label: string
  hint: string
}

export const STAR_CATEGORIES: StarCategoryDef[] = [
  { key: 'show', icon: '🌅', label: 'Show up', hint: 'Practice for 3 minutes' },
  { key: 'forward', icon: '🚀', label: 'Forward progress', hint: 'Finish one new worksheet' },
  { key: 'quality', icon: '🎯', label: 'Quality', hint: 'Get 80% or more correct' },
  { key: 'focus', icon: '⏱️', label: 'Focus', hint: 'A bit more practice today' },
  { key: 'boost', icon: '💌', label: 'Boost', hint: 'Send a sticker to a friend' },
]

// 6 sticker category tabs shown in StickerPicker.
export const STICKER_CATEGORIES: { key: StickerCategory; label: string; emoji: string }[] = [
  { key: 'cheer', label: 'Cheer', emoji: '🎉' },
  { key: 'fistbump', label: 'Fist bump', emoji: '🤜' },
  { key: 'gotthis', label: 'You got this', emoji: '🌱' },
  { key: 'celebrate', label: 'Celebrate', emoji: '🎊' },
  { key: 'sympathy', label: 'Cheer up', emoji: '🫂' },
  { key: 'math', label: 'Math', emoji: '🧮' },
]

export function ageBandFromAge(age: number | null | undefined): AgeBand {
  if (age == null) return '8-9'
  if (age <= 7) return '4-7'
  if (age <= 9) return '8-9'
  return '10-11'
}
