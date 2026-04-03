import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to generate random winning numbers
function generateWinningNumbers(): number[] {
  const numbers: Set<number> = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

// Helper function to match scores with winning numbers
function matchScores(userScores: number[], winningNumbers: number[]): number {
  return userScores.filter((score) => winningNumbers.includes(score)).length;
}

export async function POST(
  request: NextRequest,
  { params }: { params?: { drawId?: string } } = {}
) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = request.nextUrl.pathname;

    if (path.includes('/simulate')) {
      // Run simulation - generate new draw
      const winningNumbers = generateWinningNumbers();

      // Get all draw entries for the current month
      const { data: entries, error: entriesError } = await supabaseAdmin
        .from('draw_entries')
        .select('user_id, scores')
        .gte('created_at', new Date(new Date().setDate(1)).toISOString());

      if (entriesError) throw entriesError;

      // Get or create current draw
      const now = new Date();
      const drawDate = new Date(now.getFullYear(), now.getMonth(), 1);

      let { data: existingDraw, error: drawError } = await supabaseAdmin
        .from('draws')
        .select('id')
        .eq(
          'draw_date',
          drawDate.toISOString().split('T')[0]
        )
        .single();

      if (drawError && drawError.code !== 'PGRST116') throw drawError;

      let drawId: string;

      if (existingDraw) {
        drawId = existingDraw.id;
      } else {
        const { data: newDraw, error: createError } = await supabaseAdmin
          .from('draws')
          .insert({
            draw_date: drawDate.toISOString(),
            winning_numbers: winningNumbers,
            entries_count: entries?.length || 0,
            prize_pool: (entries?.length || 0) * 29, // Based on subscription price
            published: false,
          })
          .select()
          .single();

        if (createError) throw createError;
        drawId = newDraw.id;
      }

      // Update draw with new winning numbers and simulation results
      const { error: updateError } = await supabaseAdmin
        .from('draws')
        .update({
          winning_numbers: winningNumbers,
          entries_count: entries?.length || 0,
        })
        .eq('id', drawId);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true, drawId, winningNumbers });
    } else if (path.includes('/publish')) {
      // Publish draw results - match winners
      const drawId = params?.drawId;

      if (!drawId) {
        return NextResponse.json({ error: 'Draw ID required' }, { status: 400 });
      }

      // Get draw
      const { data: draw, error: drawError } = await supabaseAdmin
        .from('draws')
        .select('*')
        .eq('id', drawId)
        .single();

      if (drawError) throw drawError;

      // Get all user scores
      const { data: allScores, error: scoresError } = await supabaseAdmin
        .from('scores')
        .select('user_id')
        .gte('created_at', new Date(draw.draw_date).toISOString())
        .lt(
          'created_at',
          new Date(new Date(draw.draw_date).getTime() + 31 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (scoresError) throw scoresError;

      // Get top 5 scores for each user  
      const winnersMap = new Map();

      for (const scoreEntry of allScores || []) {
        const { data: userScores, error: userScoresError } = await supabaseAdmin
          .from('scores')
          .select('score')
          .eq('user_id', scoreEntry.user_id)
          .order('score', { ascending: false })
          .limit(5);

        if (userScoresError) throw userScoresError;

        if (userScores && userScores.length > 0) {
          const scores = userScores.map((s) => s.score);
          const matchCount = matchScores(scores, draw.winning_numbers);

          if (matchCount > 0) {
            winnersMap.set(scoreEntry.user_id, matchCount);
          }
        }
      }

      // Create winner records
      const winners = Array.from(winnersMap.entries()).map(([userId, matches]) => ({
        draw_id: drawId,
        user_id: userId,
        matches: matches,
        prize_amount: 0, // Will be calculated based on tier
        status: 'pending',
      }));

      if (winners.length > 0) {
        const { error: winnersError } = await supabaseAdmin
          .from('winners')
          .insert(winners);

        if (winnersError) throw winnersError;
      }

      // Mark draw as published
      const { error: publishError } = await supabaseAdmin
        .from('draws')
        .update({ published: true })
        .eq('id', drawId);

      if (publishError) throw publishError;

      // Email notification to winners (implement with Resend)
      // TODO: Send emails to winners

      return NextResponse.json({ success: true, winnersCount: winners.length });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing draw:', error);
    return NextResponse.json({ error: 'Failed to process draw' }, { status: 500 });
  }
}
