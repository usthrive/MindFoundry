/**
 * Grace Period Modal Component
 * Shown during days 60-67 (grace period) to encourage conversion
 * Non-dismissible for first 3 seconds, then allows close
 */

import { useState, useEffect } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import PricingCard from './PricingCard'
import type { BillingCycle } from '@/types'

interface GracePeriodModalProps {
  onClose: () => void
  totalProblems?: number
  onScholarshipRequest?: () => void
}

export default function GracePeriodModal({
  onClose,
  totalProblems,
  onScholarshipRequest,
}: GracePeriodModalProps) {
  const { subscriptionState, tiers, startCheckout, checkCoupon, daysRemaining, childCount } = useSubscription()
  const [canDismiss, setCanDismiss] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [loading, setLoading] = useState(false)

  // Non-dismissible for first 3 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanDismiss(true)
    }
  }, [countdown])

  const handleCheckout = async (tierId: string, billingCycle: BillingCycle, couponCode?: string) => {
    setLoading(true)
    const { error } = await startCheckout(tierId, billingCycle, couponCode)
    if (error) {
      console.error('Checkout error:', error)
      // Could show toast here
    }
    setLoading(false)
  }

  const foundationTier = tiers.find(t => t.id === 'foundation')

  if (!subscriptionState?.isInGracePeriod) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-white">
          {canDismiss && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h2 className="text-2xl font-bold">
              {daysRemaining <= 1 ? 'Last Day!' : `${daysRemaining} Days Left`}
            </h2>
            <p className="text-amber-100 mt-2">
              Your introductory period is ending. Keep your progress going!
            </p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Your Journey So Far</h3>
          <div className="flex gap-4 text-center">
            <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {totalProblems || '---'}
              </div>
              <div className="text-xs text-gray-500">Problems Solved</div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {subscriptionState.daysSinceSignup}
              </div>
              <div className="text-xs text-gray-500">Days Learning</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Become a Supporter
          </h3>

          {foundationTier && (
            <PricingCard
              tier={foundationTier}
              childCount={childCount}
              onSelect={handleCheckout}
              loading={loading}
              showCouponInput={true}
              primaryBillingCycle="annual"
              onCouponValidate={checkCoupon}
            />
          )}

          {/* Scholarship link */}
          <div className="mt-4 text-center">
            <button
              onClick={onScholarshipRequest}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Need financial assistance?
            </button>
          </div>
        </div>

        {/* Footer */}
        {!canDismiss && (
          <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
            You can close this in {countdown} second{countdown !== 1 ? 's' : ''}...
          </div>
        )}
      </div>
    </div>
  )
}
