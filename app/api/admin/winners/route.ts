import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: winners, error: winnersError } = await getSupabaseAdmin()
      .from('winners')
      .select('*')
      .order('created_at', { ascending: false });

    if (winnersError) throw winnersError;
    if (!winners) return NextResponse.json([]);

    const winnersWithDetails = await Promise.all(
      winners.map(async (winner) => {
        const { data: user } = await getSupabaseAdmin()
          .from('users')
          .select('name, email')
          .eq('id', winner.user_id)
          .single();

        const { data: draw } = await getSupabaseAdmin()
          .from('draws')
          .select('month, year')
          .eq('id', winner.draw_id)
          .single();

        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return {
          id: winner.id,
          name: user?.name || 'Unknown',
          email: user?.email || 'unknown@example.com',
          amount: `$${Number(winner.prize_amount || 0).toLocaleString()}`,
          matches: winner.match_tier || 0,
          status: winner.payment_status === 'paid' ? 'paid' : winner.verification_status === 'approved' ? 'approved' : 'pending',
          drawDate: draw ? `${monthNames[draw.month]} ${draw.year}` : 'Unknown',
          proofUrl: winner.proof_url || null,
        };
      })
    );

    return NextResponse.json(winnersWithDetails);
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}
