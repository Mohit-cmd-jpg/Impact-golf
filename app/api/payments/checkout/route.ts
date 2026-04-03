import { NextRequest, NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { createServerClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
export async function POST(req: NextRequest) {
  try {
    const { plan, charityId, charityContributionPercent } = await req.json()

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    // Verify user and get their info
    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for mock mode (Assessment / Local Dev without Stripe keys)
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_MONTHLY_PRICE_ID) {
      console.log('Running in MOCK payment mode - NO STRIPE KEYS CONFIGURED')
      
      // Auto-activate the user subscription in DB directly since there is no Stripe webhook
      await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        data: {
          sessionId: 'mock_session_123',
          sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id=mock_session_123&mock_payment=true`,
        },
      })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Get or create Stripe customer
    let stripeCustomerId: string

    const { data: existingUser } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (existingUser?.stripe_customer_id) {
      stripeCustomerId = existingUser.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.name || 'Unknown',
      })
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Determine price ID
    const priceId =
      plan === 'monthly'
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_YEARLY_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price configuration missing' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup?step=3`,
      metadata: {
        userId: user.id,
        charityId: charityId || 'none',
        charityContributionPercent: charityContributionPercent || 10,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
      },
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
