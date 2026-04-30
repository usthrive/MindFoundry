import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getPendingInviteRequestsForParent,
  parentApproveInviteRequest,
  parentDeclineInviteRequest,
} from '@/services/cohorts/cohortInviteService'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

interface PendingItem {
  request: { id: string; cohortId: string }
  cohortName: string
  cohortEmoji: string
  childName: string
}

interface ParentInviteBannerProps {
  parentUserId: string
}

/**
 * Surfaces "your child wants to invite a friend" requests on the parent's
 * dashboard. Approving reveals the cohort code with copy + share actions
 * the parent can pass to the friend's parent.
 */
export default function ParentInviteBanner({ parentUserId }: ParentInviteBannerProps) {
  const [items, setItems] = useState<PendingItem[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [revealCode, setRevealCode] = useState<{ cohortName: string; emoji: string; code: string } | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    getPendingInviteRequestsForParent(parentUserId).then((rows) => {
      if (cancelled) return
      setItems(
        rows.map((r) => ({
          request: { id: r.request.id, cohortId: r.request.cohortId },
          cohortName: r.cohortName,
          cohortEmoji: r.cohortEmoji,
          childName: r.childName,
        })),
      )
    })
    return () => {
      cancelled = true
    }
  }, [parentUserId, version])

  const onApprove = async (item: PendingItem) => {
    setBusyId(item.request.id)
    const ok = await parentApproveInviteRequest(item.request.id)
    if (!ok) {
      setBusyId(null)
      return
    }
    // Fetch the cohort code to show + share.
    const { data } = await supabase
      .from('cohorts')
      .select('name, emoji, code')
      .eq('id', item.request.cohortId)
      .maybeSingle()
    setBusyId(null)
    setVersion((v) => v + 1)
    if (data) {
      setRevealCode({ cohortName: data.name, emoji: data.emoji, code: data.code })
    }
  }

  const onDecline = async (item: PendingItem) => {
    setBusyId(item.request.id)
    await parentDeclineInviteRequest(item.request.id)
    setBusyId(null)
    setVersion((v) => v + 1)
  }

  if (items.length === 0 && !revealCode) return null

  return (
    <div className="mb-6 flex flex-col gap-3">
      {items.map((item) => (
        <motion.div
          key={item.request.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 rounded-2xl border-2 border-warning bg-warning-light p-4 shadow-sm"
        >
          <div className="text-3xl">📨</div>
          <div className="flex-1">
            <div className="font-body text-sm font-extrabold text-text-primary">
              {item.childName} wants to invite a friend to {item.cohortEmoji}{' '}
              {item.cohortName}
            </div>
            <div className="mt-0.5 font-body text-xs text-text-secondary">
              Approve to get a code you can share with the friend's grown-up.
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(item)}
              disabled={busyId === item.request.id}
              isLoading={busyId === item.request.id}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDecline(item)}
              disabled={busyId === item.request.id}
            >
              Not now
            </Button>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {revealCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-dashed border-primary bg-primary-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-body text-sm font-extrabold text-text-primary">
                {revealCode.emoji} {revealCode.cohortName} — share this with the
                friend's grown-up
              </div>
              <button
                type="button"
                onClick={() => setRevealCode(null)}
                aria-label="Dismiss"
                className="font-body text-xs text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="mb-3 rounded-2xl border-2 border-primary-200 bg-white p-3 text-center font-mono text-2xl font-extrabold tracking-widest text-primary-700">
              {revealCode.code}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(revealCode.code)}
                className="flex-1"
              >
                📋 Copy code
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const text = `Join my MindFoundry cohort "${revealCode.cohortName}" with code ${revealCode.code}`
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: revealCode.cohortName, text })
                    } catch {
                      /* dismissed */
                    }
                  } else {
                    await navigator.clipboard?.writeText(text)
                  }
                }}
                className="flex-1"
              >
                📤 Share…
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
