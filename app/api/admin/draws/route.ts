import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all draws
    const { data: draws, error: drawsError } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('draw_date', { ascending: false });

    if (drawsError) throw drawsError;

    if (!draws) return NextResponse.json([]);

    // Get winner counts for each draw
    const drawsWithWinners = await Promise.all(
      draws.map(async (draw) => {
        const { count } = await supabaseAdmin
          .from('winners')
          .select('*', { count: 'exact', head: true })
          .eq('draw_id', draw.id);

        return {
          id: draw.id,
          drawDate: new Date(draw.draw_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: draw.published ? 'published' : 'pending',
          entries: draw.entries_count || 0,
          prizePool: draw.prize_pool || 0,
          winningNumbers: draw.winning_numbers || [],
          totalWinners: count || 0,
        };
      })
    );

    return NextResponse.json(drawsWithWinners);
  } catch (error) {
    console.error('Error fetching draws:', error);
    return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 });
  }
}
