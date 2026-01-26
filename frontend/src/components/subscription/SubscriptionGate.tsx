/**
 * Subscription Gate Component
 * Wraps app content and controls access based on subscription status
 */

import { useState, useEffect, ReactNode } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import GracePeriodModal from './GracePeriodModal'
import ExpiredModal from './ExpiredModal'
import ScholarshipRequestModal from './ScholarshipRequestModal'

interface SubscriptionGateProps {
  children: ReactNode
  totalProblems?: number
}

export default function SubscriptionGate({ children, totalProblems }: SubscriptionGateProps) {
  const { subscriptionState, loading, isInGracePeriod, isExpired } = useSubscription()
  const [showGraceModal, setShowGraceModal] = useState(false)
  const [showScholarshipModal, setShowScholarshipModal] = useState(false)
  const [graceModalDismissedThisSession, setGraceModalDismissedThisSession] = useState(false)

  // Show grace period modal when entering grace period
  useEffect(() => {
    if (isInGracePeriod && !graceModalDismissedThisSession) {
      setShowGraceModal(true)
    }
  }, [isInGracePeriod, graceModalDismissedThisSession])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // No subscription state (shouldn't happen but handle gracefully)
  if (!subscriptionState) {
    return <>{children}</>
  }

  // Expired - show blocking modal
  if (isExpired) {
    return (
      <>
        {/* Show dimmed content behind modal */}
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
        <ExpiredModal
          totalProblems={totalProblems}
          onScholarshipRequest={() => setShowScholarshipModal(true)}
        />
        {showScholarshipModal && (
          <ScholarshipRequestModal onClose={() => setShowScholarshipModal(false)} />
        )}
      </>
    )
  }

  // Grace period - show modal but allow access
  if (isInGracePeriod) {
    return (
      <>
        {children}
        {showGraceModal && (
          <GracePeriodModal
            onClose={() => {
              setShowGraceModal(false)
              setGraceModalDismissedThisSession(true)
            }}
            totalProblems={totalProblems}
            onScholarshipRequest={() => {
              setShowGraceModal(false)
              setShowScholarshipModal(true)
            }}
          />
        )}
        {showScholarshipModal && (
          <ScholarshipRequestModal onClose={() => setShowScholarshipModal(false)} />
        )}
      </>
    )
  }

  // Free period or active - full access
  return (
    <>
      {children}
      {showScholarshipModal && (
        <ScholarshipRequestModal onClose={() => setShowScholarshipModal(false)} />
      )}
    </>
  )
}
