/**
 * Subscription Service
 * Handles all subscription-related operations including Stripe integration
 */

import { loadStripe, Stripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase'
import type {
  SubscriptionTier,
  UserSubscription,
  SubscriptionState,
  SubscriptionStatus,
  BillingCycle,
  ScholarshipRequest,
} from '@/types'

// Stripe singleton
let stripePromise: Promise<Stripe | null> | null = null

/**
 * Get the Stripe instance (lazy loaded)
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

/**
 * Fetch all enabled subscription tiers
 */
export async function getEnabledTiers(): Promise<SubscriptionTier[]> {
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('enabled', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching subscription tiers:', error)
    return []
  }

  return data.map((tier: Record<string, unknown>) => ({
    id: tier.id as SubscriptionTier['id'],
    name: tier.name as string,
    description: tier.description as string,
    enabled: tier.enabled as boolean,
    monthlyPriceCents: tier.monthly_price_cents as number,
    annualPriceCents: tier.annual_price_cents as number,
    stripeMonthlyPriceId: tier.stripe_monthly_price_id as string | null,
    stripeAnnualPriceId: tier.stripe_annual_price_id as string | null,
    features: (tier.features as string[]) || [],
    displayOrder: tier.display_order as number,
  }))
}

/**
 * Get the user's subscription data from the users table
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      subscription_status,
      subscription_tier,
      billing_cycle,
      free_period_ends_at,
      grace_period_ends_at,
      current_period_ends_at,
      stripe_customer_id,
      stripe_subscription_id,
      is_founding_supporter,
      scholarship_code,
      nudges_sent,
      created_at
    `)
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }

  return {
    status: data.subscription_status || 'free_period',
    tier: data.subscription_tier,
    billingCycle: data.billing_cycle,
    freePeriodEndsAt: data.free_period_ends_at,
    gracePeriodEndsAt: data.grace_period_ends_at,
    currentPeriodEndsAt: data.current_period_ends_at,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    isFoundingSupporter: data.is_founding_supporter || false,
    scholarshipCode: data.scholarship_code,
    nudgesSent: data.nudges_sent || {},
  }
}

/**
 * Calculate the number of days since user signup
 */
export function calculateDaysSinceSignup(createdAt: string): number {
  const signupDate = new Date(createdAt)
  const now = new Date()
  const diffTime = now.getTime() - signupDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Calculate days remaining in free period or grace period
 */
export function calculateDaysRemaining(
  status: SubscriptionStatus,
  freePeriodEndsAt: string | null,
  gracePeriodEndsAt: string | null,
  currentPeriodEndsAt: string | null
): number {
  const now = new Date()
  let endDate: Date | null = null

  if (status === 'free_period' && freePeriodEndsAt) {
    endDate = new Date(freePeriodEndsAt)
  } else if (status === 'grace_period' && gracePeriodEndsAt) {
    endDate = new Date(gracePeriodEndsAt)
  } else if ((status === 'active' || status === 'cancelled') && currentPeriodEndsAt) {
    endDate = new Date(currentPeriodEndsAt)
  }

  if (!endDate) return 0

  const diffTime = endDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

/**
 * Determine which nudge should be shown based on days since signup
 */
export function getCurrentNudge(
  daysSinceSignup: number,
  nudgesSent: Record<string, { sent: boolean; sentAt: string }>
): { day: number; type: string; showPricing: boolean; pricingType: string } | null {
  // Import NUDGE_SCHEDULE from types
  const NUDGE_SCHEDULE = [
    { day: 45, type: 'progress', showPricing: false, pricingType: 'none' },
    { day: 48, type: 'story', showPricing: false, pricingType: 'none' },
    { day: 52, type: 'reflection', showPricing: false, pricingType: 'none' },
    { day: 53, type: 'pricing_annual', showPricing: true, pricingType: 'annual' },
    { day: 56, type: 'pricing_full', showPricing: true, pricingType: 'both' },
    { day: 60, type: 'grace', showPricing: true, pricingType: 'both' },
    { day: 63, type: 'grace', showPricing: true, pricingType: 'both' },
    { day: 66, type: 'grace', showPricing: true, pricingType: 'both' },
    { day: 67, type: 'grace', showPricing: true, pricingType: 'both' },
  ]

  // Find the most recent nudge day that should be shown
  for (let i = NUDGE_SCHEDULE.length - 1; i >= 0; i--) {
    const nudge = NUDGE_SCHEDULE[i]
    if (daysSinceSignup >= nudge.day) {
      // Check if already sent today
      const nudgeKey = `day_${nudge.day}`
      const sentRecord = nudgesSent[nudgeKey]
      if (sentRecord?.sent) {
        const sentDate = new Date(sentRecord.sentAt).toDateString()
        const today = new Date().toDateString()
        if (sentDate === today) {
          continue // Already shown today, check earlier nudges
        }
      }
      return nudge
    }
  }
  return null
}

/**
 * Get the complete subscription state for a user
 */
export async function getSubscriptionState(
  userId: string,
  createdAt: string
): Promise<SubscriptionState> {
  const subscription = await getUserSubscription(userId)
  const tiers = await getEnabledTiers()

  if (!subscription) {
    // Default state for users without subscription data
    return {
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
  }

  const daysSinceSignup = calculateDaysSinceSignup(createdAt)
  const daysRemaining = calculateDaysRemaining(
    subscription.status,
    subscription.freePeriodEndsAt,
    subscription.gracePeriodEndsAt,
    subscription.currentPeriodEndsAt
  )

  const currentNudge = getCurrentNudge(daysSinceSignup, subscription.nudgesSent)
  const currentTier = subscription.tier
    ? tiers.find(t => t.id === subscription.tier) || null
    : null

  return {
    status: subscription.status,
    tier: currentTier,
    daysRemaining,
    daysSinceSignup,
    isInFreePeriod: subscription.status === 'free_period',
    isInGracePeriod: subscription.status === 'grace_period',
    isActive: subscription.status === 'active',
    isExpired: subscription.status === 'expired',
    canAccessApp: ['free_period', 'grace_period', 'active', 'cancelled'].includes(subscription.status),
    isFoundingSupporter: subscription.isFoundingSupporter,
    currentNudgeDay: currentNudge?.day || null,
    shouldShowNudge: currentNudge !== null,
    nudgeType: currentNudge?.type as SubscriptionState['nudgeType'] || null,
  }
}

/**
 * Mark a nudge as sent for a user
 */
export async function markNudgeSent(userId: string, nudgeDay: number): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('nudges_sent')
    .eq('id', userId)
    .single()

  const nudgesSent = user?.nudges_sent || {}
  nudgesSent[`day_${nudgeDay}`] = {
    sent: true,
    sentAt: new Date().toISOString(),
  }

  await supabase
    .from('users')
    .update({ nudges_sent: nudgesSent })
    .eq('id', userId)
}

/**
 * Create a Stripe Checkout session
 * Returns the checkout URL to redirect to
 */
export async function createCheckoutSession(
  tierId: string,
  billingCycle: BillingCycle,
  couponCode?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    console.log('Session check:', {
      hasSession: !!sessionData.session,
      hasAccessToken: !!sessionData.session?.access_token,
      tokenPreview: sessionData.session?.access_token?.substring(0, 20) + '...',
    })
    if (!sessionData.session) {
      return { url: null, error: 'Not authenticated' }
    }

    // Explicitly pass Authorization header (per expert recommendation)
    const response = await supabase.functions.invoke('create-checkout-session', {
      body: {
        tierId,
        billingCycle,
        couponCode,
      },
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
    })

    if (response.error) {
      return { url: null, error: response.error.message }
    }

    return { url: response.data.url, error: null }
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return { url: null, error: 'Failed to create checkout session' }
  }
}

/**
 * Create a Stripe Customer Portal session
 * Returns the portal URL to redirect to
 */
export async function createPortalSession(): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      return { url: null, error: 'Not authenticated' }
    }

    const response = await supabase.functions.invoke('create-portal-session', {})

    if (response.error) {
      return { url: null, error: response.error.message }
    }

    return { url: response.data.url, error: null }
  } catch (err) {
    console.error('Error creating portal session:', err)
    return { url: null, error: 'Failed to create portal session' }
  }
}

/**
 * Validate a coupon code
 */
export async function validateCoupon(
  couponCode: string
): Promise<{ valid: boolean; discountPercent: number; description: string; error: string | null }> {
  try {
    const response = await supabase.functions.invoke('validate-coupon', {
      body: { couponCode },
    })

    if (response.error) {
      return { valid: false, discountPercent: 0, description: '', error: response.error.message }
    }

    return {
      valid: response.data.valid,
      discountPercent: response.data.discountPercent || 0,
      description: response.data.description || '',
      error: null,
    }
  } catch (err) {
    console.error('Error validating coupon:', err)
    return { valid: false, discountPercent: 0, description: '', error: 'Failed to validate coupon' }
  }
}

/**
 * Submit a scholarship request
 */
export async function submitScholarshipRequest(reason: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('scholarship_requests')
      .insert({
        user_id: sessionData.session.user.id,
        reason,
        status: 'pending',
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Error submitting scholarship request:', err)
    return { success: false, error: 'Failed to submit scholarship request' }
  }
}

/**
 * Get the user's scholarship requests
 */
export async function getScholarshipRequests(userId: string): Promise<ScholarshipRequest[]> {
  const { data, error } = await supabase
    .from('scholarship_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scholarship requests:', error)
    return []
  }

  return data.map((req: Record<string, unknown>) => ({
    id: req.id as string,
    userId: req.user_id as string,
    reason: req.reason as string,
    status: req.status as 'pending' | 'approved' | 'denied',
    couponCode: req.coupon_code as string | null,
    createdAt: req.created_at as string,
  }))
}

/**
 * Format price in dollars from cents
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// ============================================================================
// FAMILY PRICING
// ============================================================================

/**
 * Family discount structure (progressive discounts per child)
 */
const FAMILY_DISCOUNTS = [
  { child: 1, discount: 0 },      // 1st child: 0% off
  { child: 2, discount: 0.10 },   // 2nd child: 10% off
  { child: 3, discount: 0.20 },   // 3rd child: 20% off
  { child: 4, discount: 0.30 },   // 4th child: 30% off
  // 5+ children: 50% off each
]

export interface FamilyPriceBreakdown {
  childNumber: number
  priceCents: number
  discountPercent: number
}

export interface FamilyPrice {
  totalCents: number
  breakdown: FamilyPriceBreakdown[]
  childCount: number
  billingCycle: BillingCycle
  perChildBasePrice: number
}

/**
 * Calculate family price based on number of children
 * Uses progressive discounts: 0%, 10%, 20%, 30%, 50%+ for each additional child
 */
export function calculateFamilyPrice(
  childCount: number,
  billingCycle: BillingCycle
): FamilyPrice {
  const basePrice = billingCycle === 'monthly' ? 799 : 6700 // cents
  let totalCents = 0
  const breakdown: FamilyPriceBreakdown[] = []

  // Ensure at least 1 child
  const numChildren = Math.max(1, childCount)

  for (let i = 1; i <= numChildren; i++) {
    const discountEntry = FAMILY_DISCOUNTS.find(d => d.child === i)
    const discountPercent = discountEntry?.discount ?? 0.50 // 5+ children get 50% off
    const childPriceCents = Math.round(basePrice * (1 - discountPercent))

    breakdown.push({
      childNumber: i,
      priceCents: childPriceCents,
      discountPercent,
    })
    totalCents += childPriceCents
  }

  return {
    totalCents,
    breakdown,
    childCount: numChildren,
    billingCycle,
    perChildBasePrice: basePrice,
  }
}

/**
 * Get the discount percentage for a specific child number
 */
export function getChildDiscount(childNumber: number): number {
  const entry = FAMILY_DISCOUNTS.find(d => d.child === childNumber)
  return entry?.discount ?? 0.50 // 5+ children get 50% off
}

/**
 * Format family price summary for display
 */
export function formatFamilyPriceSummary(familyPrice: FamilyPrice): string {
  const { totalCents, childCount, billingCycle } = familyPrice
  const period = billingCycle === 'annual' ? '/year' : '/month'

  if (childCount === 1) {
    return `${formatPrice(totalCents)}${period}`
  }

  return `${formatPrice(totalCents)}${period} for ${childCount} children`
}

/**
 * Calculate savings percentage for annual vs monthly
 */
export function calculateAnnualSavings(monthlyPriceCents: number, annualPriceCents: number): number {
  const yearlyIfMonthly = monthlyPriceCents * 12
  const savings = ((yearlyIfMonthly - annualPriceCents) / yearlyIfMonthly) * 100
  return Math.round(savings)
}

/**
 * Get the appropriate message for the current nudge
 */
export function getNudgeMessage(
  nudgeType: SubscriptionState['nudgeType'],
  daysSinceSignup: number,
  daysRemaining: number,
  totalProblems?: number
): { title: string; message: string; ctaText: string } {
  switch (nudgeType) {
    case 'progress':
      return {
        title: 'Look how far you\'ve come!',
        message: totalProblems
          ? `Amazing! You've solved ${totalProblems} problems in ${daysSinceSignup} days. Keep up the great work!`
          : `You've been learning for ${daysSinceSignup} days. Your dedication is inspiring!`,
        ctaText: 'Keep practicing',
      }

    case 'story':
      return {
        title: 'Making a difference',
        message: 'Every problem you solve builds confidence and skills that last a lifetime. You\'re part of a community dedicated to making math accessible for everyone.',
        ctaText: 'Continue learning',
      }

    case 'reflection':
      return {
        title: 'Reflect on your journey',
        message: 'Think about how much you\'ve grown since you started. Math isn\'t just about numbers—it\'s about building the confidence to tackle any challenge.',
        ctaText: 'Keep growing',
      }

    case 'pricing_annual':
      return {
        title: 'Support our mission',
        message: `You have ${daysRemaining} days left in your introductory period. Join our community of supporters and help us keep MathFoundry accessible for families everywhere.`,
        ctaText: 'Become a supporter',
      }

    case 'pricing_full':
      return {
        title: 'Your support matters',
        message: `Only ${daysRemaining} days left in your introductory period. Your contribution helps us continue building the best math learning experience for children.`,
        ctaText: 'View options',
      }

    case 'grace':
      return {
        title: daysRemaining <= 1 ? 'Last chance!' : 'Time is running out',
        message: daysRemaining <= 1
          ? 'This is your last day to continue your learning journey. Become a supporter to keep practicing.'
          : `You have ${daysRemaining} days left to become a supporter. Don't lose your progress!`,
        ctaText: 'Become a supporter now',
      }

    default:
      return {
        title: '',
        message: '',
        ctaText: '',
      }
  }
}
