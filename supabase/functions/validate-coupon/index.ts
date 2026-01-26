/**
 * Validate Coupon Edge Function
 * Validates a Stripe coupon/promotion code
 */

import Stripe from 'npm:stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { couponCode } = await req.json()

    if (!couponCode) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing coupon code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Try to find as a promotion code first
    try {
      const promotionCodes = await stripe.promotionCodes.list({
        code: couponCode.toUpperCase(),
        active: true,
        limit: 1,
      })

      if (promotionCodes.data.length > 0) {
        const promoCode = promotionCodes.data[0]
        const coupon = promoCode.coupon

        return new Response(
          JSON.stringify({
            valid: true,
            discountPercent: coupon.percent_off || 0,
            discountAmountCents: coupon.amount_off || 0,
            description: coupon.name || `${coupon.percent_off}% off`,
            promotionCodeId: promoCode.id,
            couponId: coupon.id,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (promoError) {
      console.log('Not a promotion code, trying as coupon:', promoError.message)
    }

    // Try as a direct coupon code
    try {
      const coupon = await stripe.coupons.retrieve(couponCode.toUpperCase())

      if (coupon && coupon.valid) {
        return new Response(
          JSON.stringify({
            valid: true,
            discountPercent: coupon.percent_off || 0,
            discountAmountCents: coupon.amount_off || 0,
            description: coupon.name || `${coupon.percent_off}% off`,
            couponId: coupon.id,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (couponError) {
      // Coupon not found
      console.log('Coupon not found:', couponError.message)
    }

    // Not found
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid coupon code' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error validating coupon:', error)
    return new Response(
      JSON.stringify({ valid: false, error: error.message || 'Failed to validate coupon' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
