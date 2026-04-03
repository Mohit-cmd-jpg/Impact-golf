import { NextRequest, NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { createServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!endpointSecret || !signature) {
      return NextResponse.json({ error: 'Missing webhook secret or signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err}`)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer as string

        // Get the customer's email
        const customer = await stripe.customers.retrieve(customerId)
        const email = 'deleted' in customer ? null : customer.email

        if (email) {
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

          if (user) {
            // Determine plan from price ID
            const items = subscription.items.data
            const priceId = items[0]?.price.id
            const plan = priceId === process.env.STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'yearly'

            // Update subscription status in database
            const currentPeriodEnd = (subscription as any).current_period_end
            const renewalDate = new Date(currentPeriodEnd * 1000)

            await supabase
              .from('users')
              .update({
                subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
                subscription_plan: plan,
                subscription_renewal_date: renewalDate.toISOString(),
              })
              .eq('id', user.id)

            // Create or update subscription record
            await supabase
              .from('subscriptions')
              .upsert(
                {
                  user_id: user.id,
                  stripe_subscription_id: subscription.id,
                  plan,
                  status: subscription.status === 'active' ? 'active' : 'cancelled',
                  amount: items[0]?.price.unit_amount || 0,
                },
                {
                  onConflict: 'user_id',
                }
              )
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer as string

        // Get the customer's email
        const customer = await stripe.customers.retrieve(customerId)
        const email = 'deleted' in customer ? null : customer.email

        if (email) {
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

          if (user) {
            // Update subscription status
            await supabase
              .from('users')
              .update({
                subscription_status: 'expired',
              })
              .eq('id', user.id)

            await supabase
              .from('subscriptions')
              .update({
                status: 'cancelled',
              })
              .eq('user_id', user.id)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string

        // Get the customer's email
        const customer = await stripe.customers.retrieve(customerId)
        const email = 'deleted' in customer ? null : customer.email

        if (email) {
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

          if (user) {
            // Mark subscription as payment failed
            await supabase
              .from('users')
              .update({
                subscription_status: 'expired',
              })
              .eq('id', user.id)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
