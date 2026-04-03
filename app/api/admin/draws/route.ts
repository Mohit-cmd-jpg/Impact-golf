import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch all draws
    const { data: draws, error: drawError } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (drawError) throw drawError;

    // 2. Aggregate data for each draw
    const drawsWithStats = await Promise.all((draws || []).map(async (draw) => {
      // Get entry count
      const { count: entries } = await supabaseAdmin
        .from('draw_entries')
        .select('*', { count: 'exact', head: true })
        .eq('draw_id', draw.id);

      // Get winner count
      const { count: winners } = await supabaseAdmin
        .from('winners')
        .select('*', { count: 'exact', head: true })
        .eq('draw_id', draw.id);

      // Get prize pool sum
      const { data: prizes } = await supabaseAdmin
        .from('prizes')
        .select('pool_amount')
        .eq('draw_id', draw.id);

      const prizePool = (prizes || []).reduce((sum, p) => sum + (Number(p.pool_amount) || 0), 0);

      // Format for the frontend interface
      return {
        id: draw.id,
        drawDate: `${new Date(draw.year, draw.month - 1).toLocaleString('default', { month: 'long' })} ${draw.year}`,
        status: draw.status, // published, simulated, draft
        entries: entries || 0,
        prizePool: prizePool || 0,
        winningNumbers: draw.winning_numbers || [],
        totalWinners: winners || 0
      };
    }));

    return NextResponse.json(drawsWithStats);
  } catch (error: any) {
    console.error('Admin draws fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
