/**
 * Create Checkout Session Edge Function
 * Creates a Stripe Checkout session for subscription signup
 * Supports family pricing with progressive discounts
 */

import Stripe from 'npm:stripe@14.14.0'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Family discount structure (progressive discounts per child)
const FAMILY_DISCOUNTS = [
  { child: 1, discount: 0 },      // 1st child: 0% off
  { child: 2, discount: 0.10 },   // 2nd child: 10% off
  { child: 3, discount: 0.20 },   // 3rd child: 20% off
  { child: 4, discount: 0.30 },   // 4th child: 30% off
  // 5+ children: 50% off each
]

/**
 * Calculate family price based on number of children
 * Returns total price in cents
 */
function calculateFamilyPrice(childCount: number, billingCycle: 'monthly' | 'annual'): {
  totalCents: number
  breakdown: Array<{ childNumber: number; priceCents: number; discountPercent: number }>
} {
  const basePrice = billingCycle === 'monthly' ? 799 : 6700 // cents
  let totalCents = 0
  const breakdown: Array<{ childNumber: number; priceCents: number; discountPercent: number }> = []

  for (let i = 1; i <= childCount; i++) {
    const discountEntry = FAMILY_DISCOUNTS.find(d => d.child === i)
    const discountPercent = discountEntry?.discount ?? 0.50 // 5+ children get 50% off
    const childPriceCents = Math.round(basePrice * (1 - discountPercent))

    breakdown.push({ childNumber: i, priceCents: childPriceCents, discountPercent })
    totalCents += childPriceCents
  }

  return { totalCents, breakdown }
}

Deno.serve(async (req) => {
  console.log('Received request:', req.method, req.url)
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the JWT from Bearer token
    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate the user's JWT and get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid user token', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { tierId, billingCycle, couponCode } = await req.json()

    if (!tierId || !billingCycle) {
      return new Response(
        JSON.stringify({ error: 'Missing tierId or billingCycle' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the tier from the database
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .eq('enabled', true)
      .single()

    if (tierError || !tier) {
      return new Response(
        JSON.stringify({ error: 'Invalid or disabled tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get children count for family pricing
    const { count: childCount, error: childError } = await supabase
      .from('children')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (childError) {
      console.error('Error counting children:', childError)
    }

    // Default to 1 child if no children found or error
    const numberOfChildren = childCount && childCount > 0 ? childCount : 1
    console.log(`Family pricing: ${numberOfChildren} children for user ${user.id}`)

    // Calculate family price
    const familyPrice = calculateFamilyPrice(numberOfChildren, billingCycle as 'monthly' | 'annual')
    console.log(`Family price calculation:`, familyPrice)

    // Get or create Stripe customer
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single()

    let customerId = userData?.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: userData?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to users table
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Build checkout session params with dynamic family pricing
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: familyPrice.totalCents,
            recurring: {
              interval: billingCycle === 'annual' ? 'year' : 'month',
            },
            product_data: {
              name: `MathFoundry Foundation - ${numberOfChildren} ${numberOfChildren === 1 ? 'child' : 'children'}`,
              description: numberOfChildren > 1
                ? `Family subscription with ${numberOfChildren} children (includes multi-child discount)`
                : 'Full Kumon-style math curriculum',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/?subscription=success`,
      cancel_url: `${req.headers.get('origin')}/?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        tier_id: tierId,
        billing_cycle: billingCycle,
        child_count: numberOfChildren.toString(),
        price_cents: familyPrice.totalCents.toString(),
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier_id: tierId,
          child_count: numberOfChildren.toString(),
        },
      },
      allow_promotion_codes: true,
    }

    // Add coupon if provided (use promotion code instead for allow_promotion_codes)
    // Coupons are applied via promotion codes in the checkout UI
    if (couponCode) {
      sessionParams.discounts = [{ coupon: couponCode }]
      // Remove allow_promotion_codes when using discounts
      delete sessionParams.allow_promotion_codes
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    // Log the event with family pricing details
    await supabase.from('subscription_events').insert({
      user_id: user.id,
      event_type: 'checkout_started',
      tier: tierId,
      billing_cycle: billingCycle,
      amount_cents: familyPrice.totalCents,
      metadata: {
        session_id: session.id,
        coupon_code: couponCode || null,
        child_count: numberOfChildren,
        price_breakdown: familyPrice.breakdown,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
