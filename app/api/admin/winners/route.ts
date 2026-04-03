import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all winners with their details
    const { data: winners, error: winnersError } = await supabaseAdmin
      .from('winners')
      .select('*')
      .order('created_at', { ascending: false });

    if (winnersError) throw winnersError;

    if (!winners) return NextResponse.json([]);

    // Get user and draw details for each winner
    const winnersWithDetails = await Promise.all(
      winners.map(async (winner) => {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('full_name, email')
          .eq('id', winner.user_id)
          .single();

        const { data: draw } = await supabaseAdmin
          .from('draws')
          .select('draw_date')
          .eq('id', winner.draw_id)
          .single();

        return {
          id: winner.id,
          name: user?.full_name || 'Unknown',
          email: user?.email || 'unknown@example.com',
          amount: `$${winner.prize_amount?.toLocaleString() || '0.00'} USD`,
          matches: winner.matches || 0,
          status: winner.status || 'pending',
          drawDate: draw
            ? new Date(draw.draw_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown',
        };
      })
    );

    return NextResponse.json(winnersWithDetails);
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}
