/**
 * Expired Modal Component
 * Shown when subscription has expired (day 68+)
 * Completely blocking - cannot be dismissed
 */

import { useState } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import PricingCard from './PricingCard'
import type { BillingCycle } from '@/types'

interface ExpiredModalProps {
  totalProblems?: number
  onScholarshipRequest?: () => void
}

export default function ExpiredModal({
  totalProblems,
  onScholarshipRequest,
}: ExpiredModalProps) {
  const { subscriptionState, tiers, startCheckout, checkCoupon, childCount } = useSubscription()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (tierId: string, billingCycle: BillingCycle, couponCode?: string) => {
    setLoading(true)
    const { error } = await startCheckout(tierId, billingCycle, couponCode)
    if (error) {
      console.error('Checkout error:', error)
    }
    setLoading(false)
  }

  const foundationTier = tiers.find(t => t.id === 'foundation')

  if (!subscriptionState?.isExpired) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-8 text-white text-center">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-2xl font-bold">
            Your Introductory Period Has Ended
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            Become a supporter to continue your learning journey
          </p>
        </div>

        {/* Progress preserved message */}
        <div className="px-6 py-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <h3 className="font-semibold text-green-800">Your Progress is Safe!</h3>
              <p className="text-sm text-green-700">
                {totalProblems
                  ? `All ${totalProblems} problems you've solved and your progress are saved.`
                  : 'All your progress and achievements are saved and waiting for you.'}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Support Our Mission
          </h3>

          <p className="text-sm text-gray-600 text-center mb-6">
            Your contribution helps us keep MathFoundry accessible and continue
            building the best math learning experience for children everywhere.
          </p>

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
              Need financial assistance? Apply for a scholarship
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Questions? Contact us at support@mathfoundry.app
          </p>
        </div>
      </div>
    </div>
  )
}
