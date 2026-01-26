/**
 * Pricing Card Component
 * Displays subscription tier pricing with optional coupon support
 */

import { useState } from 'react'
import type { SubscriptionTier, BillingCycle } from '@/types'
import { formatPrice, calculateAnnualSavings } from '@/services/subscriptionService'

interface PricingCardProps {
  tier: SubscriptionTier
  onSelect: (tierId: string, billingCycle: BillingCycle, couponCode?: string) => void
  loading?: boolean
  showCouponInput?: boolean
  primaryBillingCycle?: BillingCycle
  couponDiscount?: number
  onCouponValidate?: (code: string) => Promise<{ valid: boolean; discountPercent: number; description: string }>
}

export default function PricingCard({
  tier,
  onSelect,
  loading = false,
  showCouponInput = true,
  primaryBillingCycle = 'annual',
  couponDiscount = 0,
  onCouponValidate,
}: PricingCardProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(primaryBillingCycle)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState(couponDiscount)

  const annualSavings = calculateAnnualSavings(tier.monthlyPriceCents, tier.annualPriceCents)

  const getPrice = () => {
    const basePrice = billingCycle === 'annual' ? tier.annualPriceCents : tier.monthlyPriceCents
    if (appliedDiscount > 0) {
      return Math.round(basePrice * (1 - appliedDiscount / 100))
    }
    return basePrice
  }

  const handleCouponValidate = async () => {
    if (!couponCode.trim() || !onCouponValidate) return

    setValidatingCoupon(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const result = await onCouponValidate(couponCode.trim().toUpperCase())
      if (result.valid) {
        setAppliedDiscount(result.discountPercent)
        setCouponSuccess(`${result.discountPercent}% off applied!`)
      } else {
        setCouponError('Invalid coupon code')
        setAppliedDiscount(0)
      }
    } catch {
      setCouponError('Failed to validate coupon')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleSubmit = () => {
    onSelect(tier.id, billingCycle, couponCode.trim() || undefined)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
        <h3 className="text-xl font-bold">{tier.name}</h3>
        <p className="text-blue-100 text-sm mt-1">{tier.description}</p>
      </div>

      {/* Pricing */}
      <div className="px-6 py-6">
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annual
            {annualSavings > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save {annualSavings}%
              </span>
            )}
          </button>
        </div>

        {/* Price display */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            {appliedDiscount > 0 && (
              <span className="text-2xl text-gray-400 line-through">
                {formatPrice(billingCycle === 'annual' ? tier.annualPriceCents : tier.monthlyPriceCents)}
              </span>
            )}
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(getPrice())}
            </span>
            <span className="text-gray-500">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {billingCycle === 'annual' && (
            <p className="text-sm text-gray-500 mt-1">
              ({formatPrice(Math.round(getPrice() / 12))}/month when billed annually)
            </p>
          )}
        </div>

        {/* Coupon input */}
        {showCouponInput && onCouponValidate && (
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCouponValidate}
                disabled={!couponCode.trim() || validatingCoupon}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validatingCoupon ? '...' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-xs mt-1">{couponError}</p>
            )}
            {couponSuccess && (
              <p className="text-green-600 text-xs mt-1">{couponSuccess}</p>
            )}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 flex-shrink-0">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Become a Supporter'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Cancel anytime. Your contribution supports our mission.
        </p>
      </div>
    </div>
  )
}
