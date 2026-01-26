/**
 * SubscriptionSettings Component
 * Displays subscription status and allows users to manage their subscription
 */

import { useState } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { PricingCard, ScholarshipRequestModal } from '@/components/subscription'
import { formatPrice } from '@/services/subscriptionService'
import type { BillingCycle } from '@/types'

interface SubscriptionSettingsProps {
  onBack: () => void
}

export default function SubscriptionSettings({ onBack }: SubscriptionSettingsProps) {
  const {
    subscriptionState,
    tiers,
    loading,
    daysRemaining,
    isInFreePeriod,
    isInGracePeriod,
    isActive,
    isExpired,
    startCheckout,
    openPortal,
    checkCoupon,
    childCount,
  } = useSubscription()

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [showScholarshipModal, setShowScholarshipModal] = useState(false)
  const [error, setError] = useState('')

  const foundationTier = tiers.find(t => t.id === 'foundation')

  const handleCheckout = async (tierId: string, billingCycle: BillingCycle, couponCode?: string) => {
    setCheckoutLoading(true)
    setError('')

    const { error: checkoutError } = await startCheckout(tierId, billingCycle, couponCode)

    if (checkoutError) {
      setError(checkoutError)
    }
    setCheckoutLoading(false)
  }

  const handleOpenPortal = async () => {
    setPortalLoading(true)
    setError('')

    const { error: portalError } = await openPortal()

    if (portalError) {
      setError(portalError)
    }
    setPortalLoading(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Current Status Card */}
      <div className={`rounded-2xl p-6 mb-6 ${
        isActive
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
          : isInGracePeriod
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
          : isExpired
          ? 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'
          : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">
            {isActive ? '✨' : isInGracePeriod ? '⏰' : isExpired ? '🔒' : '🎁'}
          </span>
          <div>
            <p className="font-bold text-gray-800">
              {isActive
                ? `${subscriptionState?.tier?.name || 'Foundation'} Supporter`
                : isInGracePeriod
                ? 'Grace Period'
                : isExpired
                ? 'Subscription Expired'
                : 'Introductory Period'}
            </p>
            <p className="text-sm text-gray-600">
              {isActive
                ? `Your support helps us continue our mission`
                : isInGracePeriod
                ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                : isExpired
                ? 'Become a supporter to continue'
                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining in your first 60 days`}
            </p>
          </div>
        </div>

        {/* Founding Supporter Badge */}
        {subscriptionState?.isFoundingSupporter && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            <span>🌟</span>
            <span>Founding Supporter</span>
          </div>
        )}

        {/* Active subscription details */}
        {isActive && subscriptionState?.tier && (
          <div className="space-y-2 text-sm text-gray-700">
            {subscriptionState.tier.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Free/Grace period features */}
        {(isInFreePeriod || isInGracePeriod) && (
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Full curriculum access (7A-O)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Unlimited practice problems</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Video lessons & hints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Progress tracking</span>
            </div>
          </div>
        )}
      </div>

      {/* Manage Subscription (for active subscribers) */}
      {isActive && (
        <div className="mb-6">
          <button
            onClick={handleOpenPortal}
            disabled={portalLoading}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {portalLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Update payment method, change plan, or cancel
          </p>
        </div>
      )}

      {/* Become a Supporter (for non-subscribers) */}
      {!isActive && foundationTier && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Become a Supporter
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Your contribution helps us keep MathFoundry accessible for families everywhere
              and continue building the best math learning experience.
            </p>

            <PricingCard
              tier={foundationTier}
              childCount={childCount}
              onSelect={handleCheckout}
              loading={checkoutLoading}
              showCouponInput={true}
              primaryBillingCycle="annual"
              onCouponValidate={checkCoupon}
            />
          </div>

          {/* Scholarship link */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowScholarshipModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Need financial assistance? Apply for a scholarship
            </button>
          </div>
        </>
      )}

      {/* Pricing info for active subscribers */}
      {isActive && foundationTier && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Your Plan</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {subscriptionState?.tier?.id === 'foundation'
                ? formatPrice(
                    (subscriptionState as any)?.billingCycle === 'annual'
                      ? foundationTier.annualPriceCents
                      : foundationTier.monthlyPriceCents
                  )
                : formatPrice(foundationTier.monthlyPriceCents)}
            </span>
            <span className="text-gray-500">
              /{(subscriptionState as any)?.billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {daysRemaining > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Next billing date: in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-gray-500 text-center">
        Questions? Contact us at support@mathfoundry.app
      </p>

      {/* Scholarship Modal */}
      {showScholarshipModal && (
        <ScholarshipRequestModal onClose={() => setShowScholarshipModal(false)} />
      )}
    </div>
  )
}
