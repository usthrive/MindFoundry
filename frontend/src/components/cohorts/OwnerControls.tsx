import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
  approveJoin,
  declineJoin,
  getPendingJoinRequestsForOwner,
} from '@/services/cohorts/cohortMembershipService'
import type { Cohort } from '@/types/cohort'

interface OwnerControlsProps {
  cohort: Cohort
  ownerUserId: string
  onChanged: () => void
}

interface PendingRow {
  request: { id: string }
  cohortName: string
  cohortEmoji: string
  childName: string
  childAge: number
  childAvatar: string
  requesterName: string | null
}

/**
 * Surface visible only to the cohort owner inside Cohort Home.
 *
 *  - Share-code card (always visible) lets the owner re-share the code.
 *  - Pending join requests list lets them approve/decline new family members.
 */
export default function OwnerControls({ cohort, ownerUserId, onChanged }: OwnerControlsProps) {
  const [pending, setPending] = useState<PendingRow[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    getPendingJoinRequestsForOwner(ownerUserId).then((rows) => {
      if (cancelled) return
      setPending(rows.filter((r) => r.cohortName === cohort.name) as PendingRow[])
    })
    return () => {
      cancelled = true
    }
  }, [ownerUserId, cohort.name, version])

  const onApprove = async (id: string) => {
    setBusyId(id)
    const newId = await approveJoin(id)
    setBusyId(null)
    if (newId) {
      setVersion((v) => v + 1)
      onChanged()
    }
  }

  const onDecline = async (id: string) => {
    setBusyId(id)
    const ok = await declineJoin(id)
    setBusyId(null)
    if (ok) setVersion((v) => v + 1)
  }

  return (
    <div className="flex flex-col gap-4 px-5">
      <Card padding="md" rounded="lg" className="border-2 border-dashed border-primary-200">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🔑</div>
          <div className="flex-1">
            <div className="font-body text-xs font-bold uppercase tracking-wider text-primary-700">
              Cohort code
            </div>
            <div className="mt-1 font-mono text-xl font-extrabold tracking-widest text-text-primary">
              {cohort.code}
            </div>
            <div className="mt-1 font-body text-xs text-text-secondary">
              Share with another parent so they can ask to join.
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(cohort.code)}
              >
                📋 Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const text = `Join my MindFoundry cohort "${cohort.name}" with code ${cohort.code}`
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: cohort.name, text })
                    } catch {
                      /* dismissed */
                    }
                  } else {
                    await navigator.clipboard?.writeText(text)
                  }
                }}
              >
                📤 Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {pending.length > 0 && (
        <Card padding="md" rounded="lg" className="border-2 border-warning bg-warning-light">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">🛎️</span>
            <div>
              <div className="font-display text-lg font-bold text-text-primary">
                {pending.length} request{pending.length === 1 ? '' : 's'} pending
              </div>
              <div className="font-body text-xs text-text-secondary">
                Approve to add the child to {cohort.name}.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {pending.map((p) => (
              <div
                key={p.request.id}
                className="flex items-center gap-3 rounded-2xl border border-warning bg-white p-3"
              >
                <div className="text-3xl">{p.childAvatar}</div>
                <div className="flex-1">
                  <div className="font-body text-sm font-extrabold text-text-primary">
                    {p.childName}{' '}
                    <span className="font-normal text-text-secondary">· age {p.childAge}</span>
                  </div>
                  {p.requesterName && (
                    <div className="font-body text-xs text-text-secondary">
                      from {p.requesterName}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDecline(p.request.id)}
                    disabled={busyId === p.request.id}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onApprove(p.request.id)}
                    disabled={busyId === p.request.id}
                    isLoading={busyId === p.request.id}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-white/60 p-2.5 font-body text-[11px] text-text-secondary">
            🛡️ Once approved, the child sees the same age-gated view as your child.
            They never see your child's last name.
          </div>
        </Card>
      )}
    </div>
  )
}
