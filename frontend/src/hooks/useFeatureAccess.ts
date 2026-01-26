/**
 * useFeatureAccess Hook
 * Checks if the current user has access to specific features based on their subscription tier
 *
 * Features:
 * - Fetches feature mappings from database
 * - Falls back to hardcoded defaults if database unavailable
 * - Supports dev mode override for testing
 * - Caches feature data for performance
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { supabase } from '@/lib/supabase'
import {
  FEATURES,
  DEFAULT_FEATURE_TIERS,
  TIER_LEVELS,
  TIER_NAMES,
  FEATURE_METADATA,
  tierIncludesFeature,
  type FeatureId,
} from '@/config/features'
import type { SubscriptionTierId, TierFeature, FeatureAccessResult } from '@/types'

// Dev override localStorage key
const DEV_TIER_OVERRIDE_KEY = 'mathfoundry_dev_tier_override'

interface FeatureAccessState {
  features: TierFeature[]
  loading: boolean
  error: string | null
}

export function useFeatureAccess() {
  const { subscriptionState, isActive, isInFreePeriod, isInGracePeriod, loading: subscriptionLoading } = useSubscription()

  const [state, setState] = useState<FeatureAccessState>({
    features: [],
    loading: true,
    error: null,
  })

  // Get dev tier override (only in dev mode)
  const getDevTierOverride = useCallback((): SubscriptionTierId | null => {
    if (import.meta.env.DEV) {
      const override = localStorage.getItem(DEV_TIER_OVERRIDE_KEY)
      if (override && ['foundation', 'foundation_ai', 'vip'].includes(override)) {
        return override as SubscriptionTierId
      }
    }
    return null
  }, [])

  // Set dev tier override (only in dev mode)
  const setDevTierOverride = useCallback((tier: SubscriptionTierId | null) => {
    if (!import.meta.env.DEV) return

    if (tier) {
      localStorage.setItem(DEV_TIER_OVERRIDE_KEY, tier)
    } else {
      localStorage.removeItem(DEV_TIER_OVERRIDE_KEY)
    }
    // Trigger re-render by updating state
    setState(prev => ({ ...prev }))
  }, [])

  // Clear dev tier override
  const clearDevTierOverride = useCallback(() => {
    setDevTierOverride(null)
  }, [setDevTierOverride])

  // Get the effective tier for the current user
  const effectiveTier = useMemo((): SubscriptionTierId | null => {
    // Check for dev override first
    const devOverride = getDevTierOverride()
    if (devOverride) {
      return devOverride
    }

    // If user has active subscription, use their tier
    if (isActive && subscriptionState?.tier?.id) {
      return subscriptionState.tier.id
    }

    // During free/grace period, give Foundation access
    if (isInFreePeriod || isInGracePeriod) {
      return 'foundation'
    }

    // No access
    return null
  }, [subscriptionState, isActive, isInFreePeriod, isInGracePeriod, getDevTierOverride])

  // Fetch feature mappings from database
  useEffect(() => {
    async function loadFeatures() {
      try {
        const { data, error } = await supabase
          .from('tier_features')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error

        setState({
          features: data || [],
          loading: false,
          error: null,
        })
      } catch (err) {
        console.error('Error loading features:', err)
        setState({
          features: [],
          loading: false,
          error: 'Failed to load features',
        })
      }
    }

    loadFeatures()
  }, [])

  // Check if user has access to a specific feature
  const hasFeature = useCallback((featureId: FeatureId): boolean => {
    if (!effectiveTier) return false

    // First, try to find in database features
    const dbFeature = state.features.find(
      f => f.featureId === featureId && f.tierId === effectiveTier
    )

    if (dbFeature) {
      return dbFeature.isEnabled && dbFeature.featureActive
    }

    // Fallback to hardcoded defaults
    const requiredTier = DEFAULT_FEATURE_TIERS[featureId]
    if (!requiredTier) return false

    return tierIncludesFeature(effectiveTier, requiredTier)
  }, [effectiveTier, state.features])

  // Get detailed access result for a feature
  const checkFeatureAccess = useCallback((featureId: FeatureId): FeatureAccessResult => {
    if (!effectiveTier) {
      return {
        hasAccess: false,
        reason: 'not_authenticated',
      }
    }

    // Check in database features first
    const dbFeature = state.features.find(f => f.featureId === featureId)

    if (dbFeature) {
      // Check if feature is globally disabled
      if (!dbFeature.featureActive) {
        return {
          hasAccess: false,
          reason: 'feature_disabled',
        }
      }

      // Check if enabled for user's tier
      const tierMapping = state.features.find(
        f => f.featureId === featureId && f.tierId === effectiveTier
      )

      if (tierMapping?.isEnabled) {
        return {
          hasAccess: true,
          reason: 'granted',
        }
      }

      // Find the minimum required tier
      const enabledTiers = state.features
        .filter(f => f.featureId === featureId && f.isEnabled)
        .map(f => f.tierId)
        .sort((a, b) => TIER_LEVELS[a] - TIER_LEVELS[b])

      const requiredTier = enabledTiers[0] || 'vip'

      return {
        hasAccess: false,
        reason: 'tier_required',
        requiredTier,
        previewAvailable: dbFeature.previewAvailable,
      }
    }

    // Fallback to hardcoded defaults
    const requiredTier = DEFAULT_FEATURE_TIERS[featureId]
    if (!requiredTier) {
      return {
        hasAccess: false,
        reason: 'feature_disabled',
      }
    }

    if (tierIncludesFeature(effectiveTier, requiredTier)) {
      return {
        hasAccess: true,
        reason: 'granted',
      }
    }

    return {
      hasAccess: false,
      reason: 'tier_required',
      requiredTier,
      previewAvailable: FEATURE_METADATA[featureId]?.previewAvailable || false,
    }
  }, [effectiveTier, state.features])

  // Get the minimum tier required for a feature
  const getRequiredTier = useCallback((featureId: FeatureId): SubscriptionTierId => {
    // Check database first
    const enabledTiers = state.features
      .filter(f => f.featureId === featureId && f.isEnabled)
      .map(f => f.tierId)
      .sort((a, b) => TIER_LEVELS[a] - TIER_LEVELS[b])

    if (enabledTiers.length > 0) {
      return enabledTiers[0]
    }

    // Fallback to hardcoded
    return DEFAULT_FEATURE_TIERS[featureId] || 'vip'
  }, [state.features])

  // Get all features available at current tier
  const availableFeatures = useMemo((): FeatureId[] => {
    if (!effectiveTier) return []

    return Object.values(FEATURES).filter(featureId => hasFeature(featureId))
  }, [effectiveTier, hasFeature])

  // Get all features by category with access status
  const featuresByCategory = useMemo(() => {
    const categories: Record<string, Array<{ featureId: FeatureId; hasAccess: boolean; requiredTier: SubscriptionTierId }>> = {}

    for (const featureId of Object.values(FEATURES)) {
      const metadata = FEATURE_METADATA[featureId]
      if (!metadata) continue

      const category = metadata.category
      if (!categories[category]) {
        categories[category] = []
      }

      categories[category].push({
        featureId,
        hasAccess: hasFeature(featureId),
        requiredTier: getRequiredTier(featureId),
      })
    }

    return categories
  }, [hasFeature, getRequiredTier])

  // Check if current tier is being overridden (dev mode)
  const isDevOverride = useMemo(() => {
    return import.meta.env.DEV && getDevTierOverride() !== null
  }, [getDevTierOverride])

  return {
    // State
    loading: state.loading || subscriptionLoading,
    error: state.error,

    // Current tier info
    effectiveTier,
    effectiveTierName: effectiveTier ? TIER_NAMES[effectiveTier] : null,
    isDevOverride,

    // Feature access methods
    hasFeature,
    checkFeatureAccess,
    getRequiredTier,

    // Feature lists
    availableFeatures,
    featuresByCategory,
    allFeatures: state.features,

    // Dev tools (only available in dev mode)
    ...(import.meta.env.DEV && {
      setDevTierOverride,
      clearDevTierOverride,
      getDevTierOverride,
    }),

    // Constants for convenience
    FEATURES,
    TIER_NAMES,
    FEATURE_METADATA,
  }
}

// Type export for components that need it
export type UseFeatureAccessReturn = ReturnType<typeof useFeatureAccess>
