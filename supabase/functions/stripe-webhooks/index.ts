/**
 * Stripe Webhooks Edge Function
 * Handles all Stripe webhook events for subscription management
 */

import Stripe from 'npm:stripe@14.14.0'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  try {
    const body = await req.text()

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    console.log(`Processing event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(`Webhook error: ${error.message}`, { status: 500 })
  }
})

/**
 * Handle checkout.session.completed
 * User has completed the Stripe Checkout flow
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const tierId = session.metadata?.tier_id
  const billingCycle = session.metadata?.billing_cycle

  if (!userId) {
    console.error('Missing user_id in checkout session metadata')
    return
  }

  console.log(`Checkout completed for user ${userId}, tier: ${tierId}`)

  // Log the event
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: 'checkout_completed',
    tier: tierId,
    billing_cycle: billingCycle,
    stripe_event_id: session.id,
    amount_cents: session.amount_total || 0,
    metadata: {
      subscription_id: session.subscription,
      customer_id: session.customer,
    },
  })
}

/**
 * Handle customer.subscription.created
 * A new subscription has been created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id
  const tierId = subscription.metadata?.tier_id

  if (!userId) {
    // Try to find user by customer ID
    const customerId = subscription.customer as string
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!user) {
      console.error('Could not find user for subscription')
      return
    }

    await updateUserSubscription(user.id, subscription, tierId || 'foundation')
    return
  }

  await updateUserSubscription(userId, subscription, tierId || 'foundation')
}

/**
 * Handle customer.subscription.updated
 * Subscription has been updated (plan change, renewal, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id
  const tierId = subscription.metadata?.tier_id

  let targetUserId = userId

  if (!targetUserId) {
    // Try to find user by customer ID
    const customerId = subscription.customer as string
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!user) {
      console.error('Could not find user for subscription update')
      return
    }
    targetUserId = user.id
  }

  await updateUserSubscription(targetUserId, subscription, tierId || 'foundation')
}

/**
 * Handle customer.subscription.deleted
 * Subscription has been cancelled and ended
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('Could not find user for subscription deletion')
    return
  }

  // Update user to expired status
  await supabase
    .from('users')
    .update({
      subscription_status: 'expired',
      stripe_subscription_id: null,
      current_period_ends_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  // Log the event
  await supabase.from('subscription_events').insert({
    user_id: user.id,
    event_type: 'subscription_ended',
    stripe_event_id: subscription.id,
    metadata: {
      canceled_at: subscription.canceled_at,
      ended_at: subscription.ended_at,
    },
  })

  console.log(`Subscription ended for user ${user.id}`)
}

/**
 * Handle invoice.paid
 * Successful payment (initial or recurring)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string

  // Find user by customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('Could not find user for invoice payment')
    return
  }

  // Log the event
  await supabase.from('subscription_events').insert({
    user_id: user.id,
    event_type: 'payment_succeeded',
    amount_cents: invoice.amount_paid,
    stripe_event_id: invoice.id,
    metadata: {
      invoice_id: invoice.id,
      subscription_id: subscriptionId,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
    },
  })

  console.log(`Payment succeeded for user ${user.id}, amount: ${invoice.amount_paid}`)
}

/**
 * Handle invoice.payment_failed
 * Payment has failed
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  // Find user by customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('Could not find user for failed payment')
    return
  }

  // Log the event
  await supabase.from('subscription_events').insert({
    user_id: user.id,
    event_type: 'payment_failed',
    amount_cents: invoice.amount_due,
    stripe_event_id: invoice.id,
    metadata: {
      invoice_id: invoice.id,
      attempt_count: invoice.attempt_count,
      next_payment_attempt: invoice.next_payment_attempt,
    },
  })

  console.log(`Payment failed for user ${user.id}`)
}

/**
 * Update user subscription data based on Stripe subscription
 */
async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  tierId: string
) {
  // Determine billing cycle from price interval
  const priceInterval = subscription.items.data[0]?.price?.recurring?.interval
  const billingCycle = priceInterval === 'year' ? 'annual' : 'monthly'

  // Map Stripe status to our status
  let status: string
  switch (subscription.status) {
    case 'active':
    case 'trialing':
      status = 'active'
      break
    case 'canceled':
      // If cancel_at_period_end is true, they're cancelled but still have access
      status = subscription.cancel_at_period_end ? 'cancelled' : 'expired'
      break
    case 'past_due':
    case 'unpaid':
      status = 'active' // Still give access, payment will retry
      break
    default:
      status = 'expired'
  }

  // Update user
  await supabase
    .from('users')
    .update({
      subscription_status: status,
      subscription_tier: tierId,
      billing_cycle: billingCycle,
      stripe_subscription_id: subscription.id,
      current_period_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  // Log the event
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: 'subscription_updated',
    tier: tierId,
    billing_cycle: billingCycle,
    stripe_event_id: subscription.id,
    metadata: {
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: subscription.current_period_end,
    },
  })

  console.log(`Updated subscription for user ${userId}: ${status}, ${tierId}, ${billingCycle}`)
}
