import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CohortHome from '@/components/cohorts/CohortHome'
import { type Trophy } from '@/components/cohorts/TrophyShelf'
import StickerPicker from '@/components/cohorts/StickerPicker'
import SuggestedStickerPrompt from '@/components/cohorts/SuggestedStickerPrompt'
import CohortHelpModal from '@/components/cohorts/CohortHelpModal'
import CreateCohortFlow from '@/components/cohorts/CreateCohortFlow'
import JoinByCodeFlow from '@/components/cohorts/JoinByCodeFlow'
import OwnerControls from '@/components/cohorts/OwnerControls'
import Feedback from '@/components/feedback/Feedback'
import { getCohortForChild } from '@/services/cohorts/cohortService'
import {
  getCohortView,
  getWeeklyEnergy,
} from '@/services/cohorts/cohortEnergyService'
import {
  getMyWeekRibbon,
  getPastMePacer,
  getTodayStars,
} from '@/services/cohorts/effortStarsService'
import {
  getInbox,
  listStickers,
  markInboxRead,
  sendSticker,
} from '@/services/cohorts/stickerService'
import {
  ageBandFromAge,
  type BoostWallEntry,
  type Cohort,
  type CohortEnergyWeekly,
  type CohortViewMember,
  type DailyEffortStars,
  type StickerCategory,
} from '@/types/cohort'

interface PageData {
  cohort: Cohort
  members: CohortViewMember[]
  energyThisWeek: CohortEnergyWeekly
  energyLastWeek: CohortEnergyWeekly
  weeklyGoal: number
  cohortBoostWall: BoostWallEntry[]
  myStars: DailyEffortStars | null
  pacer: { pastStars: number; thisStars: number; daysLeft: number } | null
  weekRibbon: Array<{ date: string; stars: number }>
  lastWeekRibbon: Array<{ date: string; stars: number }>
  thisWeekWorksheets: number
  lastWeekWorksheets: number
  trophies: Trophy[]
  myBoostWall: BoostWallEntry[]
}

function thisMondayIso(): string {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow)
  return monday.toISOString().slice(0, 10)
}

function lastMondayIso(): string {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow - 7)
  return monday.toISOString().slice(0, 10)
}

function lastSundayIso(): string {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - dow - 1)
  return sunday.toISOString().slice(0, 10)
}

async function loadCohortBoostWall(
  cohortId: string,
  limit = 12,
): Promise<BoostWallEntry[]> {
  const { data, error } = await supabase
    .from('sticker_sends')
    .select(
      `
      id, from_child_id, sent_at, read_at,
      stickers!inner(id, category, emoji, label, display_order),
      children!sticker_sends_from_child_id_fkey(name)
    `,
    )
    .eq('cohort_id', cohortId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((row) => {
    const stickerRel = (Array.isArray(row.stickers) ? row.stickers[0] : row.stickers) as {
      id: string
      category: 'cheer' | 'fistbump' | 'gotthis' | 'celebrate' | 'sympathy' | 'math'
      emoji: string
      label: string
      display_order: number
    }
    const fromRel = (Array.isArray(row.children) ? row.children[0] : row.children) as
      | { name: string }
      | null
    const firstName = (fromRel?.name ?? 'Friend').split(' ')[0] || 'Friend'
    return {
      id: row.id,
      fromChildId: row.from_child_id,
      fromDisplayName: firstName,
      sticker: {
        id: stickerRel.id,
        category: stickerRel.category,
        emoji: stickerRel.emoji,
        label: stickerRel.label,
        displayOrder: stickerRel.display_order,
      },
      sentAt: row.sent_at,
      readAt: row.read_at,
    }
  })
}

async function loadWorksheetCounts(childId: string): Promise<{ thisWeek: number; lastWeek: number }> {
  const thisStart = thisMondayIso()
  const lastStart = lastMondayIso()
  const lastEnd = lastSundayIso()
  const today = new Date().toISOString().slice(0, 10)

  const [thisRes, lastRes] = await Promise.all([
    supabase
      .from('worksheet_progress')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('status', 'completed')
      .gte('completed_at', thisStart)
      .lte('completed_at', `${today}T23:59:59`),
    supabase
      .from('worksheet_progress')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('status', 'completed')
      .gte('completed_at', lastStart)
      .lte('completed_at', `${lastEnd}T23:59:59`),
  ])
  return { thisWeek: thisRes.count ?? 0, lastWeek: lastRes.count ?? 0 }
}

async function loadTrophies(childId: string): Promise<Trophy[]> {
  const { data } = await supabase
    .from('achievements')
    .select('id, achievement_type, achievement_data, earned_at')
    .eq('child_id', childId)
    .in('achievement_type', ['skill_mastery', 'level_complete'])
    .order('earned_at', { ascending: false })
    .limit(8)

  return (data ?? []).map((row) => {
    const ad = (row.achievement_data ?? {}) as Record<string, unknown>
    const skill = (ad.skill as string) ?? (ad.level as string) ?? 'Concept'
    const earned = new Date(row.earned_at)
    const days = Math.round((Date.now() - earned.getTime()) / 86_400_000)
    let when: string
    if (days < 7) when = 'This week'
    else if (days < 14) when = 'Last week'
    else if (days < 30) when = `${Math.floor(days / 7)} weeks ago`
    else when = `${Math.floor(days / 30)} months ago`
    return {
      id: row.id,
      label: skill.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: row.achievement_type === 'level_complete' ? '🎓' : '🏆',
      when,
    }
  })
}

export default function CohortPage() {
  const { currentChild, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  // Sticker-send overlay state
  const [picker, setPicker] = useState<{
    member: CohortViewMember
    suggestion: { category: StickerCategory; reason: string } | null
  } | null>(null)
  const [prompt, setPrompt] = useState<{
    member: CohortViewMember
    reason: 'sleepy' | 'trend'
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)

  const childId = currentChild?.id
  const childName = currentChild?.name
  const childAvatar = currentChild?.avatar ?? '🧑‍🎓'
  const childAge = currentChild?.age
  const ageBand = useMemo(() => ageBandFromAge(childAge), [childAge])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!childId) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const cohort = await getCohortForChild(childId)
        if (!cohort) {
          if (!cancelled) {
            setData(null)
            setLoading(false)
          }
          return
        }

        const [
          members,
          energy,
          today,
          ribbon,
          pacer,
          worksheetCounts,
          trophies,
          myInbox,
          cohortWall,
        ] = await Promise.all([
          getCohortView(cohort.id),
          getWeeklyEnergy(cohort.id),
          getTodayStars(childId),
          getMyWeekRibbon(childId),
          getPastMePacer(childId),
          loadWorksheetCounts(childId),
          loadTrophies(childId),
          getInbox(childId, 12),
          loadCohortBoostWall(cohort.id, 12),
        ])

        // Adapt the pacer service shape to the UI's pacer prop.
        const pacerForUi = pacer
          ? {
              pastStars: pacer.pastStars,
              thisStars: pacer.thisStars,
              daysLeft: pacer.daysLeftInWeek,
            }
          : null

        // Mark stickers as read when the page loads (clears NEW badge).
        if (myInbox.some((s) => !s.readAt)) {
          markInboxRead(childId).catch(() => undefined)
        }

        if (cancelled) return

        // Last-week ribbon: previous Monday → previous Sunday.
        const lastStart = lastMondayIso()
        const lastEnd = lastSundayIso()
        const { data: lwRows } = await supabase
          .from('daily_effort_stars')
          .select('date, stars')
          .eq('child_id', childId)
          .gte('date', lastStart)
          .lte('date', lastEnd)
          .order('date', { ascending: true })

        const byDate = new Map<string, number>()
        for (const row of lwRows ?? []) byDate.set(row.date, row.stars)
        const lastWeekRibbon: Array<{ date: string; stars: number }> = []
        const start = new Date(lastStart)
        for (let i = 0; i < 7; i++) {
          const d = new Date(start)
          d.setDate(start.getDate() + i)
          const iso = d.toISOString().slice(0, 10)
          lastWeekRibbon.push({ date: iso, stars: byDate.get(iso) ?? 0 })
        }

        setData({
          cohort,
          members,
          energyThisWeek: energy.thisWeek,
          energyLastWeek: energy.lastWeek,
          weeklyGoal: energy.weeklyGoal,
          cohortBoostWall: cohortWall,
          myStars: today,
          pacer: pacerForUi,
          weekRibbon: ribbon,
          lastWeekRibbon,
          thisWeekWorksheets: worksheetCounts.thisWeek,
          lastWeekWorksheets: worksheetCounts.lastWeek,
          trophies,
          myBoostWall: myInbox,
        })
      } catch (e) {
        console.error('Error loading cohort page:', e)
        if (!cancelled) setError('Could not load cohort just now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [childId, version])

  const pageHeader = (
    <div className="mx-auto flex w-full max-w-[480px] items-center gap-3 px-5 pt-5 pb-2">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        aria-label="Back to dashboard"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-primary-100 bg-white text-xl text-text-primary"
      >
        ←
      </button>
      <div className="min-w-0 flex-1">
        <div className="font-body text-xs text-text-secondary">
          Hi {childName?.split(' ')[0] ?? 'friend'}!
        </div>
        <div className="truncate font-display text-2xl font-bold leading-tight text-text-primary">
          {data?.cohort ? `${data.cohort.emoji} ${data.cohort.name}` : 'Teams'}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        aria-label="What does this all mean?"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-primary-100 bg-white text-xl font-bold text-primary-700"
      >
        ?
      </button>
    </div>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        {pageHeader}
        <div className="px-5 py-12 text-center font-body text-sm text-text-secondary">
          Loading…
        </div>
      </div>
    )
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen bg-background">
        {pageHeader}
        <div className="mx-auto max-w-[480px] px-5 py-10">
          <Card padding="md" rounded="lg">
            <div className="text-center">
              <div className="mb-3 text-5xl">🧑‍🎓</div>
              <div className="font-display text-xl font-bold text-text-primary">
                Pick a child first
              </div>
              <div className="mt-2 font-body text-sm text-text-secondary">
                Cohorts are linked to a specific child profile.
              </div>
              <div className="mt-4">
                <Button onClick={() => navigate('/select-child')}>Choose profile</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {pageHeader}
        <div className="px-5 py-12 text-center font-body text-sm text-text-secondary">
          Loading your team…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {pageHeader}
        <div className="mx-auto max-w-[480px] px-5 py-6">
          <Card padding="md" rounded="lg">
            <div className="text-center">
              <div className="mb-2 text-4xl">😕</div>
              <div className="font-body text-sm text-text-primary">{error}</div>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => setVersion((v) => v + 1)}>
                  Try again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!data) {
    // No cohort yet — empty state.
    return (
      <div className="min-h-screen bg-background">
        {pageHeader}
        <div className="mx-auto max-w-[480px] px-5 py-6">
          <Card padding="md" rounded="lg" className="text-center">
            <div className="mb-3 text-5xl">☄️</div>
            <div className="font-display text-2xl font-bold text-text-primary">
              No cohort yet
            </div>
            <div className="mt-2 font-body text-sm text-text-secondary">
              Cohorts are small groups of friends who practice together. Ask a grown-up to
              create one for you, or join with a code.
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="primary" onClick={() => setCreateOpen(true)}>
                Create with a grown-up
              </Button>
              <Button variant="secondary" onClick={() => setJoinOpen(true)}>
                Join with a code
              </Button>
            </div>
            <div className="mt-3 font-body text-[11px] text-text-muted">
              Both buttons are for the grown-up to tap.
            </div>
          </Card>
        </div>

        <CreateCohortFlow
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false)
            setVersion((v) => v + 1)
          }}
        />
        <JoinByCodeFlow
          open={joinOpen}
          onClose={() => setJoinOpen(false)}
          onSubmitted={() => {
            setVersion((v) => v + 1)
          }}
        />
      </div>
    )
  }

  const myBreakdown = data.myStars?.breakdown ?? {
    show: false,
    forward: false,
    quality: false,
    focus: false,
    boost: false,
    total: 0,
  }
  const myStarsTotal = data.myStars?.stars ?? 0

  const isOwner = !!user && data.cohort.ownerUserId === user.id

  return (
    <div className="min-h-screen bg-background">
      {pageHeader}
      {isOwner && user && (
        <div className="mx-auto w-full max-w-[480px] pt-2 pb-2">
          <OwnerControls
            cohort={data.cohort}
            ownerUserId={user.id}
            onChanged={() => setVersion((v) => v + 1)}
          />
        </div>
      )}
      <CohortHome
        cohort={data.cohort}
        ageBand={ageBand}
        myChildId={childId!}
        myChildAvatar={childAvatar}
        members={data.members}
        energyThisWeek={data.energyThisWeek}
        energyLastWeek={data.energyLastWeek}
        weeklyGoal={data.weeklyGoal}
        cohortBoostWall={data.cohortBoostWall}
        myTodayStars={myStarsTotal}
        myTodayBreakdown={myBreakdown}
        pacer={data.pacer}
        weekRibbon={data.weekRibbon}
        lastWeekRibbon={data.lastWeekRibbon}
        thisWeekWorksheets={data.thisWeekWorksheets}
        lastWeekWorksheets={data.lastWeekWorksheets}
        trophies={data.trophies}
        myBoostWall={data.myBoostWall}
        onTapTeammate={(member) => {
          if (member.memberId === childId) return
          if (ageBand === '10-11' && member.sleepy) {
            setPrompt({ member, reason: 'sleepy' })
            return
          }
          if (ageBand === '10-11' && member.trend === 'down') {
            setPrompt({ member, reason: 'trend' })
            return
          }
          setPicker({ member, suggestion: null })
        }}
      />

      <SuggestedStickerPrompt
        open={!!prompt}
        recipient={prompt?.member ?? null}
        reason={prompt?.reason ?? null}
        onClose={() => setPrompt(null)}
        onPickAnother={() => {
          if (!prompt) return
          const member = prompt.member
          const cat: StickerCategory = prompt.reason === 'sleepy' ? 'sympathy' : 'gotthis'
          setPrompt(null)
          setPicker({
            member,
            suggestion: {
              category: cat,
              reason: `${member.displayName} could use a kind one.`,
            },
          })
        }}
        onSendSuggested={async (cat) => {
          if (!prompt || !data || !childId) return
          const member = prompt.member
          const all = await listStickers()
          const suggested =
            all.find(
              (s) =>
                s.category === cat &&
                (cat === 'sympathy' ? s.id === 'sympathy_01' : s.id === 'gotthis_02'),
            ) ?? all.find((s) => s.category === cat)
          if (!suggested) return
          setPrompt(null)
          const ok = await sendSticker({
            cohortId: data.cohort.id,
            fromChildId: childId,
            toChildId: member.memberId,
            stickerId: suggested.id,
          })
          if (ok) {
            setToast(`Sent ${suggested.emoji} to ${member.displayName}`)
            setVersion((v) => v + 1)
          } else {
            setToast(`Couldn't send right now. Try again?`)
          }
        }}
      />

      <StickerPicker
        open={!!picker}
        recipient={picker?.member ?? null}
        suggestion={picker?.suggestion ?? null}
        onClose={() => setPicker(null)}
        onSend={async (sticker) => {
          if (!picker || !data || !childId) return
          const ok = await sendSticker({
            cohortId: data.cohort.id,
            fromChildId: childId,
            toChildId: picker.member.memberId,
            stickerId: sticker.id,
          })
          setPicker(null)
          if (ok) {
            setToast(`Sent ${sticker.emoji} to ${picker.member.displayName}!`)
            setVersion((v) => v + 1)
          } else {
            setToast(`Couldn't send. Try again?`)
          }
        }}
      />

      <Feedback
        type="success"
        message={toast ?? ''}
        show={!!toast}
        onDismiss={() => setToast(null)}
        autoDismiss
        dismissAfter={2200}
      />

      <CohortHelpModal open={helpOpen} ageBand={ageBand} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
