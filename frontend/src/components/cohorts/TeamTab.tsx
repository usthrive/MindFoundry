import Card from '@/components/ui/Card'
import EnergyBar from './EnergyBar'
import AvatarTile from './AvatarTile'
import type {
  AgeBand,
  BoostWallEntry,
  Cohort,
  CohortEnergyWeekly,
  CohortViewMember,
  GhostCohort,
} from '@/types/cohort'

interface TeamTabProps {
  cohort: Cohort
  ageBand: AgeBand
  members: CohortViewMember[]
  myChildId: string
  energyThisWeek: CohortEnergyWeekly
  energyLastWeek: CohortEnergyWeekly
  weeklyGoal: number
  boostWall: BoostWallEntry[]
  ghostCohort?: GhostCohort | null
  onTapTeammate: (member: CohortViewMember) => void
  onOpenGhost?: () => void
  onInviteFriend?: () => void
}

function formatDay(isoString: string): string {
  const sent = new Date(isoString)
  const now = new Date()
  const sentDay = new Date(sent.getFullYear(), sent.getMonth(), sent.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((today.getTime() - sentDay.getTime()) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

export default function TeamTab({
  cohort,
  ageBand,
  members,
  myChildId,
  energyThisWeek,
  energyLastWeek,
  weeklyGoal,
  boostWall,
  ghostCohort,
  onTapTeammate,
  onOpenGhost,
  onInviteFriend,
}: TeamTabProps) {
  const teamEnergy =
    energyThisWeek.totalEnergy + energyThisWeek.synergyBonus + energyThisWeek.perfectWeekBonus
  const pastEnergy =
    energyLastWeek.totalEnergy + energyLastWeek.synergyBonus + energyLastWeek.perfectWeekBonus

  // Members come pre-sorted alphabetically from the RPC; never re-sort by score.
  const sortedMembers = members

  return (
    <div className="flex flex-col gap-4 px-5 pb-20">
      {/* Team Energy hero */}
      <Card variant="elevated" padding="md" rounded="xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="text-4xl">{cohort.emoji}</div>
          <div className="flex-1">
            <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
              {cohort.name}
            </div>
            <div className="mt-1 font-body text-xs text-text-secondary">
              {ageBand === '4-7'
                ? 'Our team is growing! 🌱'
                : `Goal by Sunday • ${Math.max(0, weeklyGoal - teamEnergy)} ⭐ to go`}
            </div>
          </div>
        </div>
        <EnergyBar
          value={teamEnergy}
          goal={weeklyGoal}
          height={ageBand === '4-7' ? 32 : 24}
          showLabel={ageBand !== '4-7'}
        />
        {ageBand === '4-7' && (
          <div className="mt-2.5 flex items-center justify-between font-display text-lg font-bold text-text-primary">
            <span>{teamEnergy >= weeklyGoal ? 'Made it! 🎉' : 'Almost there! 🎈'}</span>
          </div>
        )}

        {/* Time Travel mini pacer */}
        {ageBand !== '4-7' && (
          <div
            className="mt-3.5 rounded-2xl p-3"
            style={{
              background: '#FFF7ED',
              border: '1px dashed rgba(249,115,22,0.4)',
            }}
          >
            <div className="mb-1.5 flex items-center gap-1.5 font-body text-xs font-bold text-primary-700">
              <span className="text-base">👻</span> Time Travel Match — beating last week
            </div>
            <div className="flex items-center gap-2 font-body text-[13px] text-text-primary">
              <span className="font-bold">Past-Us {pastEnergy}</span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                <span
                  className="absolute left-0 top-0 h-full rounded-full bg-text-muted"
                  style={{
                    width: `${Math.min(100, (pastEnergy / Math.max(1, weeklyGoal)) * 100)}%`,
                  }}
                />
                <span
                  className="absolute left-0 top-0 h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(100, (teamEnergy / Math.max(1, weeklyGoal)) * 100)}%`,
                  }}
                />
              </span>
              <span className="font-bold text-primary-700">Us {teamEnergy}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Members grid */}
      <div>
        <div className="mb-3">
          <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
            Our team
          </div>
          <div className="mt-1 font-body text-[13px] text-text-secondary">
            {ageBand === '4-7'
              ? 'Tap a friend to send a happy sticker!'
              : 'Listed by name. Tap to send a sticker.'}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sortedMembers.map((m) => (
            <AvatarTile
              key={m.memberId}
              member={m}
              ageBand={ageBand}
              isMe={m.memberId === myChildId}
              onTap={(member) => {
                if (m.memberId === myChildId) return // don't sticker yourself
                onTapTeammate(member)
              }}
            />
          ))}
        </div>
      </div>

      {/* Boost wall preview */}
      <Card padding="md" rounded="lg">
        <div className="mb-3">
          <div className="font-display text-[22px] font-bold leading-tight text-text-primary">
            Boost Wall
          </div>
          <div className="mt-1 font-body text-[13px] text-text-secondary">
            Stickers your team sent each other this week
          </div>
        </div>
        {boostWall.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-primary-100 p-4 text-center font-body text-sm text-text-secondary">
            No stickers yet. Tap a teammate to send the first one!
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {boostWall.map((b) => (
              <div
                key={b.id}
                className="flex-shrink-0 rounded-2xl border-2 border-primary-100 bg-primary-50 p-2.5 text-center"
                style={{ width: 84 }}
              >
                <div className="mb-1 text-3xl">{b.sticker.emoji}</div>
                <div className="font-body text-[11px] font-extrabold text-text-primary">
                  {b.fromDisplayName}
                </div>
                <div className="font-body text-[10px] text-text-secondary">
                  {formatDay(b.sentAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Ghost cohort entry / active race */}
      {ageBand !== '4-7' && !ghostCohort && (
        <button
          type="button"
          onClick={onOpenGhost}
          className="w-full rounded-3xl border-2 p-4 text-left transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #F0FDFA, white)',
            borderColor: '#CCFBF1',
            cursor: onOpenGhost ? 'pointer' : 'default',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">👥</div>
            <div className="flex-1">
              <div className="font-body text-[15px] font-extrabold text-text-primary">
                Race a Ghost Cohort
              </div>
              <div className="mt-0.5 font-body text-xs text-text-secondary">
                Try a benchmark team for fun. Always anonymous.
              </div>
            </div>
            <span className="text-2xl text-secondary">›</span>
          </div>
        </button>
      )}

      {ageBand !== '4-7' && ghostCohort && (
        <button
          type="button"
          onClick={onOpenGhost}
          className="w-full rounded-3xl border-2 p-4 text-left transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #F0FDFA, white)',
            borderColor: '#0D9488',
          }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="text-4xl">{ghostCohort.emoji}</div>
            <div className="flex-1">
              <div className="font-body text-[11px] font-bold uppercase tracking-wider text-secondary">
                Racing
              </div>
              <div className="font-body text-[15px] font-extrabold text-text-primary">
                {ghostCohort.name}
              </div>
              <div className="font-body text-xs text-text-secondary">
                Target: {ghostCohort.weeklyEnergyTarget} ⭐ this week
              </div>
            </div>
            <span className="text-xl text-secondary">›</span>
          </div>
          {/* Two stacked bars: us (primary) vs ghost target (muted) */}
          <div className="space-y-1.5">
            <div>
              <div className="mb-1 flex justify-between font-body text-[10px] font-bold">
                <span className="text-primary-700">Us {teamEnergy}</span>
                <span className="text-text-muted">Ghost {ghostCohort.weeklyEnergyTarget}</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-[#F5F1EC]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-text-muted/50"
                  style={{
                    width: `${Math.min(
                      100,
                      (ghostCohort.weeklyEnergyTarget /
                        Math.max(ghostCohort.weeklyEnergyTarget, teamEnergy, 1)) *
                        100,
                    )}%`,
                  }}
                />
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (teamEnergy /
                        Math.max(ghostCohort.weeklyEnergyTarget, teamEnergy, 1)) *
                        100,
                    )}%`,
                    background: 'linear-gradient(to right, #0D9488, #F97316)',
                  }}
                />
              </div>
            </div>
            <div className="text-center font-body text-[11px] font-bold">
              {teamEnergy >= ghostCohort.weeklyEnergyTarget ? (
                <span className="text-success">🎉 Ahead of the ghost!</span>
              ) : (
                <span className="text-text-secondary">
                  {ghostCohort.weeklyEnergyTarget - teamEnergy} ⭐ to catch up
                </span>
              )}
            </div>
          </div>
        </button>
      )}

      {/* Invite a friend entry */}
      <button
        type="button"
        onClick={onInviteFriend}
        className="w-full rounded-3xl border-2 border-dashed bg-white p-4 text-left transition-shadow"
        style={{ borderColor: 'rgba(249,115,22,0.35)', cursor: onInviteFriend ? 'pointer' : 'default' }}
      >
        <div className="flex items-center gap-3">
          <div className="text-4xl">💌</div>
          <div className="flex-1">
            <div className="font-body text-[15px] font-extrabold text-text-primary">
              Invite a friend
            </div>
            <div className="mt-0.5 font-body text-xs text-text-secondary">
              {ageBand === '4-7'
                ? 'Pick a card to send!'
                : 'Pick a card · your grown-up shares it'}
            </div>
          </div>
          <span className="text-2xl text-primary">›</span>
        </div>
      </button>
    </div>
  )
}
