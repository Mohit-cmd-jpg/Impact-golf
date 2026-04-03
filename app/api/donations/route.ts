import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { charityId, amount } = await req.json();

    if (!charityId || !amount || amount < 1) {
      return NextResponse.json({ error: 'Charity ID and amount (min $1) are required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get charity name for display
    const { data: charity } = await supabase
      .from('charities')
      .select('name')
      .eq('id', charityId)
      .single();

    // Create a one-time Stripe checkout session (not tied to subscription)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Donation to ${charity?.name || 'Charity'}`,
              description: 'Independent donation via IMPACT GOLF',
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities?donated=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities`,
      metadata: {
        type: 'donation',
        charityId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { sessionUrl: session.url },
    });
  } catch (err) {
    console.error('Donation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
