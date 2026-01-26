/**
 * Nudge Banner Component
 * Displays conversion nudges during days 45-59 of the free period
 */

import { useState } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { getNudgeMessage } from '@/services/subscriptionService'

interface NudgeBannerProps {
  totalProblems?: number
  onBecomeSupporter?: () => void
}

export default function NudgeBanner({ totalProblems, onBecomeSupporter }: NudgeBannerProps) {
  const { subscriptionState, dismissNudge, daysRemaining } = useSubscription()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!subscriptionState?.shouldShowNudge || isDismissed) {
    return null
  }

  // Only show banner during free period (days 45-59)
  // Grace period uses modal instead
  if (!subscriptionState.isInFreePeriod) {
    return null
  }

  const { nudgeType, currentNudgeDay, daysSinceSignup } = subscriptionState
  const nudgeContent = getNudgeMessage(nudgeType, daysSinceSignup, daysRemaining, totalProblems)

  if (!nudgeContent.title) {
    return null
  }

  const handleDismiss = async () => {
    if (currentNudgeDay) {
      await dismissNudge(currentNudgeDay)
    }
    setIsDismissed(true)
  }

  // Determine banner style based on nudge type
  const getBannerStyles = () => {
    switch (nudgeType) {
      case 'progress':
        return 'bg-gradient-to-r from-green-500 to-green-600'
      case 'story':
        return 'bg-gradient-to-r from-purple-500 to-purple-600'
      case 'reflection':
        return 'bg-gradient-to-r from-indigo-500 to-indigo-600'
      case 'pricing_annual':
      case 'pricing_full':
        return 'bg-gradient-to-r from-blue-500 to-blue-600'
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600'
    }
  }

  const showPricingButton = nudgeType === 'pricing_annual' || nudgeType === 'pricing_full'

  return (
    <div className={`${getBannerStyles()} text-white`}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {nudgeType === 'progress' && '🎉'}
              {nudgeType === 'story' && '💝'}
              {nudgeType === 'reflection' && '🌟'}
              {(nudgeType === 'pricing_annual' || nudgeType === 'pricing_full') && '💡'}
            </span>
            <h4 className="font-semibold truncate">{nudgeContent.title}</h4>
          </div>
          <p className="text-sm text-white/90 mt-0.5 line-clamp-1">
            {nudgeContent.message}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {showPricingButton && onBecomeSupporter && (
            <button
              onClick={onBecomeSupporter}
              className="px-4 py-1.5 bg-white text-blue-600 font-medium rounded-lg text-sm hover:bg-blue-50 transition-colors"
            >
              {nudgeContent.ctaText}
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
