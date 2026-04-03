import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendPaymentConfirmationEmail } from '@/lib/email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as Stripe.Customer).email;

    if (!customerEmail) return;

    // Get plan info from metadata
    const plan = (subscription.metadata?.plan as 'monthly' | 'yearly') || 'monthly';
    const charityId = subscription.metadata?.charityId;
    const userId = subscription.metadata?.userId;

    if (!userId) return;

    // Get user details
    const { data: userData } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', userId)
      .single();

    // Get charity name
    let charityName = 'IMPACT GOLF';
    if (charityId) {
      const { data: charityData } = await supabase
        .from('charities')
        .select('name')
        .eq('id', charityId)
        .single();

      charityName = charityData?.name || 'IMPACT GOLF';
    }

    // Get amount from subscription
    const amount = subscription.items.data[0]?.price?.unit_amount || 0;

    // Send confirmation email
    await sendPaymentConfirmationEmail(
      customerEmail,
      userData?.full_name || 'Subscriber',
      plan,
      amount / 100, // Convert from cents
      charityName
    );

    // Update subscription status in database
    const sub = subscription as any;
    await supabase.from('subscriptions').insert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: 'active',
      plan: plan,
      charity_id: charityId,
      current_period_start: new Date(sub.current_period_start * 1000),
      current_period_end: new Date(sub.current_period_end * 1000),
    });
  } catch (error) {
    console.error('Error handling subscription.created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const newStatus = subscription.status === 'active' ? 'active' : 'inactive';
    const sub = subscription as any;

    await supabase
      .from('subscriptions')
      .update({
        status: newStatus,
        current_period_start: new Date(sub.current_period_start * 1000),
        current_period_end: new Date(sub.current_period_end * 1000),
      })
      .eq('stripe_subscription_id', subscription.id);
  } catch (error) {
    console.error('Error handling subscription.updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id);
  } catch (error) {
    console.error('Error handling subscription.deleted:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as Stripe.Customer).email;

    if (!customerEmail) return;

    // Send payment failed notification email (TODO: add email template)
    console.log(`Payment failed for ${customerEmail}`);
  } catch (error) {
    console.error('Error handling invoice.payment_failed:', error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
