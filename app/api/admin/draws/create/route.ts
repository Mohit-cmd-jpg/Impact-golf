import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Check if a draw already exists for this month
    const { data: existing } = await getSupabaseAdmin()
      .from('draws')
      .select('id, status')
      .eq('month', month)
      .eq('year', year)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `A draw already exists for this month (status: ${existing.status})`, drawId: existing.id },
        { status: 409 }
      );
    }

    // Create new draft draw
    const { data: newDraw, error } = await getSupabaseAdmin()
      .from('draws')
      .insert({
        month,
        year,
        draw_type: 'random',
        status: 'draft',
        winning_numbers: [],
        jackpot_rollover: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: newDraw,
      message: `Draft draw created for ${now.toLocaleString('default', { month: 'long' })} ${year}`,
    });
  } catch (error: any) {
    console.error('Create draw error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create draw' }, { status: 500 });
  }
}
