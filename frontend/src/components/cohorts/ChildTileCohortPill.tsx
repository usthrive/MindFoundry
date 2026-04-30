import { useEffect, useState } from 'react'
import { getCohortForChild } from '@/services/cohorts/cohortService'
import { countUnread } from '@/services/cohorts/stickerService'
import type { Cohort } from '@/types/cohort'

interface ChildTileCohortPillProps {
  childId: string
}

/**
 * Small gradient pill rendered at the bottom of a /select-child tile.
 * Hidden if the child isn't in any cohort. Loads cohort + unread badge
 * lazily and silently — never blocks the tile from rendering.
 */
export default function ChildTileCohortPill({ childId }: ChildTileCohortPillProps) {
  const [cohort, setCohort] = useState<Cohort | null>(null)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCohortForChild(childId), countUnread(childId)]).then(([c, n]) => {
      if (!cancelled) {
        setCohort(c)
        setUnread(n)
      }
    })
    return () => {
      cancelled = true
    }
  }, [childId])

  if (!cohort) return null

  return (
    <div
      className="mt-3 flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-white shadow-md"
      style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
    >
      <span className="text-base">{cohort.emoji}</span>
      <span className="truncate font-body text-xs font-extrabold">{cohort.name}</span>
      {unread > 0 && (
        <span
          className="rounded-full bg-white px-1.5 py-0.5 font-body text-[9px] font-extrabold"
          style={{ color: '#C2410C' }}
        >
          {unread} NEW
        </span>
      )}
    </div>
  )
}
