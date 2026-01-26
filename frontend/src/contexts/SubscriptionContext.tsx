/**
 * Subscription Context
 * Provides subscription state and methods throughout the app
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'
import {
  getSubscriptionState,
  getEnabledTiers,
  markNudgeSent,
  createCheckoutSession,
  createPortalSession,
  validateCoupon,
  submitScholarshipRequest,
} from '@/services/subscriptionService'
import type {
  SubscriptionState,
  SubscriptionTier,
  BillingCycle,
} from '@/types'

interface SubscriptionContextType {
  // State
  subscriptionState: SubscriptionState | null
  tiers: SubscriptionTier[]
  loading: boolean

  // Computed properties (convenience accessors)
  canAccessApp: boolean
  isInFreePeriod: boolean
  isInGracePeriod: boolean
  isActive: boolean
  isExpired: boolean
  daysRemaining: number

  // Methods
  refreshSubscription: () => Promise<void>
  startCheckout: (tierId: string, billingCycle: BillingCycle, couponCode?: string) => Promise<{ error: string | null }>
  openPortal: () => Promise<{ error: string | null }>
  checkCoupon: (code: string) => Promise<{ valid: boolean; discountPercent: number; description: string; error: string | null }>
  requestScholarship: (reason: string) => Promise<{ success: boolean; error: string | null }>
  dismissNudge: (nudgeDay: number) => Promise<void>
}

const defaultState: SubscriptionState = {
  status: 'free_period',
  tier: null,
  daysRemaining: 60,
  daysSinceSignup: 0,
  isInFreePeriod: true,
  isInGracePeriod: false,
  isActive: false,
  isExpired: false,
  canAccessApp: true,
  isFoundingSupporter: false,
  currentNudgeDay: null,
  shouldShowNudge: false,
  nudgeType: null,
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState | null>(null)
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)

  // Load subscription state when user changes
  useEffect(() => {
    if (user) {
      loadSubscriptionData()
    } else {
      setSubscriptionState(null)
      setLoading(false)
    }
  }, [user])

  // Load subscription data
  const loadSubscriptionData = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      // Get user's created_at from the users table
      const { data: userData } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', user.id)
        .single()

      const createdAt = userData?.created_at || user.created_at || new Date().toISOString()

      // Load subscription state and tiers in parallel
      const [state, enabledTiers] = await Promise.all([
        getSubscriptionState(user.id, createdAt),
        getEnabledTiers(),
      ])

      setSubscriptionState(state)
      setTiers(enabledTiers)
    } catch (error) {
      console.error('Error loading subscription data:', error)
      // Set default state on error
      setSubscriptionState(defaultState)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Refresh subscription state
  const refreshSubscription = useCallback(async () => {
    await loadSubscriptionData()
  }, [loadSubscriptionData])

  // Start Stripe checkout
  const startCheckout = useCallback(async (
    tierId: string,
    billingCycle: BillingCycle,
    couponCode?: string
  ): Promise<{ error: string | null }> => {
    const { url, error } = await createCheckoutSession(tierId, billingCycle, couponCode)

    if (error) {
      return { error }
    }

    if (url) {
      // Redirect to Stripe Checkout
      window.location.href = url
    }

    return { error: null }
  }, [])

  // Open Stripe Customer Portal
  const openPortal = useCallback(async (): Promise<{ error: string | null }> => {
    const { url, error } = await createPortalSession()

    if (error) {
      return { error }
    }

    if (url) {
      // Redirect to Stripe Portal
      window.location.href = url
    }

    return { error: null }
  }, [])

  // Validate coupon code
  const checkCoupon = useCallback(async (code: string) => {
    return validateCoupon(code)
  }, [])

  // Submit scholarship request
  const requestScholarship = useCallback(async (reason: string) => {
    return submitScholarshipRequest(reason)
  }, [])

  // Dismiss nudge (mark as sent)
  const dismissNudge = useCallback(async (nudgeDay: number) => {
    if (!user) return

    await markNudgeSent(user.id, nudgeDay)

    // Update local state
    setSubscriptionState(prev => {
      if (!prev) return prev
      return {
        ...prev,
        shouldShowNudge: false,
        currentNudgeDay: null,
        nudgeType: null,
      }
    })
  }, [user])

  // Computed properties
  const state = subscriptionState || defaultState

  const value: SubscriptionContextType = {
    // State
    subscriptionState,
    tiers,
    loading,

    // Computed properties
    canAccessApp: state.canAccessApp,
    isInFreePeriod: state.isInFreePeriod,
    isInGracePeriod: state.isInGracePeriod,
    isActive: state.isActive,
    isExpired: state.isExpired,
    daysRemaining: state.daysRemaining,

    // Methods
    refreshSubscription,
    startCheckout,
    openPortal,
    checkCoupon,
    requestScholarship,
    dismissNudge,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
