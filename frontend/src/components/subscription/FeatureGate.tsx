/**
 * FeatureGate Component
 * Wrapper component that gates UI based on feature access
 *
 * Usage:
 * ```tsx
 * <FeatureGate feature={FEATURES.AI_HINTS}>
 *   <AIHintButton />
 * </FeatureGate>
 *
 * <FeatureGate feature={FEATURES.AI_HINTS} showUpgrade>
 *   <AIHintButton />
 * </FeatureGate>
 *
 * <FeatureGate feature={FEATURES.AI_HINTS} fallback={<BasicHintButton />}>
 *   <AIHintButton />
 * </FeatureGate>
 * ```
 */

import { ReactNode } from 'react'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { FEATURE_METADATA, TIER_NAMES, type FeatureId } from '@/config/features'
import type { SubscriptionTierId } from '@/types'

interface FeatureGateProps {
  /** The feature ID to check access for */
  feature: FeatureId
  /** Content to render if user has access */
  children: ReactNode
  /** Content to render if user does NOT have access (alternative to showUpgrade) */
  fallback?: ReactNode
  /** Show an upgrade prompt if user doesn't have access */
  showUpgrade?: boolean
  /** Custom upgrade prompt component */
  upgradePrompt?: ReactNode
  /** Show a preview of the feature (if feature supports it) */
  showPreview?: boolean
  /** Callback when user clicks upgrade */
  onUpgradeClick?: () => void
  /** Custom class for the wrapper */
  className?: string
}

/**
 * Default upgrade prompt component
 */
function DefaultUpgradePrompt({
  featureId,
  requiredTier,
  onUpgradeClick,
}: {
  featureId: FeatureId
  requiredTier: SubscriptionTierId
  onUpgradeClick?: () => void
}) {
  const metadata = FEATURE_METADATA[featureId]
  const tierName = TIER_NAMES[requiredTier]

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{metadata?.icon || '🔒'}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-purple-900">
            {metadata?.name || 'Premium Feature'}
          </h4>
          <p className="text-sm text-purple-700 mt-1">
            {metadata?.description || 'This feature requires an upgraded subscription.'}
          </p>
          <p className="text-xs text-purple-600 mt-2">
            Available with <strong>{tierName}</strong> and above
          </p>
        </div>
      </div>
      <button
        onClick={onUpgradeClick}
        className="mt-3 w-full py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        Upgrade to {tierName}
      </button>
    </div>
  )
}

/**
 * Compact upgrade badge (for inline usage)
 */
export function FeatureUpgradeBadge({
  featureId,
  requiredTier,
  className = '',
}: {
  featureId: FeatureId
  requiredTier: SubscriptionTierId
  className?: string
}) {
  const tierName = TIER_NAMES[requiredTier]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full ${className}`}>
      <span>🔒</span>
      <span>{tierName}</span>
    </span>
  )
}

/**
 * Feature preview wrapper (shows feature with blur/overlay)
 */
function FeaturePreview({
  children,
  featureId,
  requiredTier,
  onUpgradeClick,
}: {
  children: ReactNode
  featureId: FeatureId
  requiredTier: SubscriptionTierId
  onUpgradeClick?: () => void
}) {
  const metadata = FEATURE_METADATA[featureId]
  const tierName = TIER_NAMES[requiredTier]

  return (
    <div className="relative">
      {/* Blurred preview of the feature */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay with upgrade CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <span className="text-3xl">{metadata?.icon || '🔒'}</span>
          <h4 className="font-semibold text-gray-900 mt-2">
            Preview: {metadata?.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Upgrade to {tierName} to unlock
          </p>
          <button
            onClick={onUpgradeClick}
            className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Main FeatureGate component
 */
export default function FeatureGate({
  feature,
  children,
  fallback = null,
  showUpgrade = false,
  upgradePrompt,
  showPreview = false,
  onUpgradeClick,
  className = '',
}: FeatureGateProps) {
  const { checkFeatureAccess } = useFeatureAccess()
  const accessResult = checkFeatureAccess(feature)

  // User has access - render children
  if (accessResult.hasAccess) {
    return <div className={className}>{children}</div>
  }

  // Show preview if available and requested
  if (showPreview && accessResult.previewAvailable && accessResult.requiredTier) {
    return (
      <div className={className}>
        <FeaturePreview
          featureId={feature}
          requiredTier={accessResult.requiredTier}
          onUpgradeClick={onUpgradeClick}
        >
          {children}
        </FeaturePreview>
      </div>
    )
  }

  // Show upgrade prompt
  if (showUpgrade && accessResult.requiredTier) {
    return (
      <div className={className}>
        {upgradePrompt || (
          <DefaultUpgradePrompt
            featureId={feature}
            requiredTier={accessResult.requiredTier}
            onUpgradeClick={onUpgradeClick}
          />
        )}
      </div>
    )
  }

  // Show fallback (or nothing)
  return <>{fallback}</>
}

/**
 * Hook-based feature check for programmatic use
 */
export function useFeatureGate(feature: FeatureId) {
  const { checkFeatureAccess, hasFeature, getRequiredTier } = useFeatureAccess()

  return {
    hasAccess: hasFeature(feature),
    accessResult: checkFeatureAccess(feature),
    requiredTier: getRequiredTier(feature),
  }
}
