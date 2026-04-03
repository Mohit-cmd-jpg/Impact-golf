import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await getSupabase().auth.getUser(token);
  if (!user) return null;
  const { data } = await getSupabase().from('users').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? user : null;
}

// Simulate draw - calls the main draws endpoint with action=simulate
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    // Get the latest draft/simulated draw
    const { data: draw } = await getSupabase()
      .from('draws')
      .select('*')
      .in('status', ['draft', 'simulated'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!draw) {
      // Auto-create a draw for current month
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const { data: newDraw, error } = await getSupabase()
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

      // Generate winning numbers
      const nums = new Set<number>();
      while (nums.size < 5) {
        nums.add(Math.floor(Math.random() * 45) + 1);
      }
      const winningNumbers = Array.from(nums).sort((a, b) => a - b);

      // Update draw
      await getSupabase()
        .from('draws')
        .update({ winning_numbers: winningNumbers, status: 'simulated' })
        .eq('id', newDraw.id);

      return NextResponse.json({
        success: true,
        data: { ...newDraw, winning_numbers: winningNumbers, status: 'simulated' },
      });
    }

    // Generate winning numbers for existing draw
    const nums = new Set<number>();
    while (nums.size < 5) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
    const winningNumbers = Array.from(nums).sort((a, b) => a - b);

    await getSupabase()
      .from('draws')
      .update({ winning_numbers: winningNumbers, status: 'simulated' })
      .eq('id', draw.id);

    return NextResponse.json({
      success: true,
      data: { ...draw, winning_numbers: winningNumbers, status: 'simulated' },
    });
  } catch (err) {
    console.error('Simulation error:', err);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
