import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Parse optional body for draw type
    let drawType = 'random';
    try {
      const body = await req.json();
      if (body.drawType === 'algorithmic') drawType = 'algorithmic';
    } catch {
      // No body or invalid JSON — use default 'random'
    }

    // 1. Get the current draft draw
    const { data: draw, error: fetchError } = await supabaseAdmin
      .from('draws')
      .select('id')
      .eq('status', 'draft')
      .single();

    if (fetchError || !draw) {
      return NextResponse.json({ error: 'No draft draw found to simulate. Create a new draw first.' }, { status: 404 });
    }

    // 2. Generate 5 unique random numbers (1-45)
    const winningNumbers: number[] = [];
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }
    winningNumbers.sort((a, b) => a - b);

    // 3. Update the draw status, type, and numbers
    const { error: updateError } = await supabaseAdmin
      .from('draws')
      .update({
        status: 'simulated',
        draw_type: drawType,
        winning_numbers: winningNumbers,
        updated_at: new Date().toISOString()
      })
      .eq('id', draw.id);

    if (updateError) throw updateError;

    // 4. Create mock winners for this draw
    const { data: users } = await supabaseAdmin.from('users').select('id').limit(3);
    if (users && users.length > 0) {
      const winners = users.map(u => ({
        draw_id: draw.id,
        user_id: u.id,
        match_tier: 3,
        prize_amount: 450,
        verification_status: 'pending',
        payment_status: 'pending'
      }));
      
      await supabaseAdmin.from('winners').insert(winners);
    }

    return NextResponse.json({
      success: true,
      message: 'Simulation completed successfully',
      winningNumbers,
      drawType,
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
