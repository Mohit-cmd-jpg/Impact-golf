import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: charities, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!charities) return NextResponse.json([]);

    // Get total raised for each charity
    const charitiesWithRaised = await Promise.all(
      charities.map(async (charity) => {
        const { data: recipients, error: recipientError } = await supabaseAdmin
          .from('subscriptions')
          .select('monthly_contribution_amount')
          .eq('charity_id', charity.id)
          .eq('status', 'active');

        if (recipientError) throw recipientError;

        const totalRaised =
          recipients?.reduce((sum, sub) => sum + (sub.monthly_contribution_amount || 0), 0) * 12 || 0;

        return {
          id: charity.id,
          name: charity.name,
          emoji: '🎁', // Default since column missing
          category: charity.category,
          description: charity.description,
          totalRaised,
          status: charity.is_featured ? 'Featured' : 'Active',
          progress: Math.min(Math.floor((totalRaised / 100000) * 100), 100),
        };
      })
    );

    return NextResponse.json(charitiesWithRaised);
  } catch (error) {
    console.error('Error fetching charities:', error);
    return NextResponse.json({ error: 'Failed to fetch charities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { error } = await supabaseAdmin.from('charities').insert({
      name: body.name,
      emoji: body.emoji,
      category: body.category,
      description: body.description,
      verified: false,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating charity:', error);
    return NextResponse.json({ error: 'Failed to create charity' }, { status: 500 });
  }
}
