/**
 * Create Checkout Session Edge Function
 * Creates a Stripe Checkout session for subscription signup
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

    // Get the Stripe price ID
    const priceId = billingCycle === 'annual'
      ? tier.stripe_annual_price_id
      : tier.stripe_monthly_price_id

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Stripe price not configured for this tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/?subscription=success`,
      cancel_url: `${req.headers.get('origin')}/?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        tier_id: tierId,
        billing_cycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier_id: tierId,
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

    // Log the event
    await supabase.from('subscription_events').insert({
      user_id: user.id,
      event_type: 'checkout_started',
      tier: tierId,
      billing_cycle: billingCycle,
      metadata: {
        session_id: session.id,
        coupon_code: couponCode || null,
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
