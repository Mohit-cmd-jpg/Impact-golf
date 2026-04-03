import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Prize pool distribution per PRD §07 */
const POOL_DISTRIBUTION = { 5: 0.40, 4: 0.35, 3: 0.25 } as const;

/** Subscription pricing */
const PRICING = { monthly: 29, yearly: 249 } as const;

/** Percentage of subscription that goes to prize pool (rest goes to charity + platform) */
const PRIZE_POOL_PERCENT = 0.60;

// ─── Helpers ───────────────────────────────────────────────

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;

  const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? user : null;
}

function generateRandomNumbers(count: number, min: number, max: number): number[] {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

async function generateAlgorithmicNumbers(): Promise<number[]> {
  // Weighted by most/least frequent user scores
  const { data: scores } = await supabase
    .from('scores')
    .select('score');

  if (!scores || scores.length === 0) {
    return generateRandomNumbers(5, 1, 45);
  }

  // Count frequency of each score
  const freq: Record<number, number> = {};
  scores.forEach((s) => {
    freq[s.score] = (freq[s.score] || 0) + 1;
  });

  // Weight: less frequent scores have higher chance
  const entries = Object.entries(freq).map(([score, count]) => ({
    score: parseInt(score),
    weight: 1 / count,
  }));

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  const nums = new Set<number>();

  while (nums.size < 5) {
    let rand = Math.random() * totalWeight;
    for (const entry of entries) {
      rand -= entry.weight;
      if (rand <= 0) {
        nums.add(entry.score);
        break;
      }
    }
    // Fallback: random number if weighted selection fails
    if (nums.size < 5 && rand > 0) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
  }

  return Array.from(nums).sort((a, b) => a - b);
}

function countMatches(userScores: number[], winningNumbers: number[]): number {
  const winSet = new Set(winningNumbers);
  return userScores.filter((s) => winSet.has(s)).length;
}

async function calculatePrizePool(): Promise<number> {
  // Count active subscribers and their plans
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('status', 'active');

  if (!subs) return 0;

  const total = subs.reduce((sum, sub) => {
    const price = PRICING[sub.plan as keyof typeof PRICING] || 29;
    return sum + price;
  }, 0);

  return total * PRIZE_POOL_PERCENT;
}

// ─── GET: List draws ──────────────────────────────────────

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { data: draws, error } = await supabase
    .from('draws')
    .select('*, prizes(*)')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Transform for frontend
  const formattedDraws = (draws || []).map((d) => ({
    id: d.id,
    drawDate: `${['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.month]} ${d.year}`,
    status: d.status,
    entries: 0, // Will be counted below
    prizePool: d.prizes?.reduce((sum: number, p: any) => sum + Number(p.pool_amount), 0) || 0,
    winningNumbers: d.winning_numbers || [],
    totalWinners: d.prizes?.reduce((sum: number, p: any) => sum + p.winner_count, 0) || 0,
  }));

  return NextResponse.json(formattedDraws);
}

// ─── POST: Create, Simulate, or Publish draws ─────────────

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { action } = body;

  // ── CREATE ──
  if (action === 'create') {
    const { month, year, drawType } = body;
    if (!month || !year || !drawType) {
      return NextResponse.json({ error: 'Month, year, and drawType are required' }, { status: 400 });
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from('draws')
      .select('id')
      .eq('month', month)
      .eq('year', year)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Draw already exists for this month/year' }, { status: 400 });
    }

    const { data: newDraw, error } = await supabase
      .from('draws')
      .insert({ month, year, draw_type: drawType, status: 'draft', winning_numbers: [], jackpot_rollover: false })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data: newDraw });
  }

  // ── SIMULATE ──
  if (action === 'simulate') {
    const { drawId, drawType } = body;

    // Generate winning numbers
    const winningNumbers = drawType === 'algorithmic'
      ? await generateAlgorithmicNumbers()
      : generateRandomNumbers(5, 1, 45);

    // Get all draw entries
    const { data: entries } = await supabase
      .from('draw_entries')
      .select('*, users(name, email)')
      .eq('draw_id', drawId);

    // Calculate matches for each entry
    const results = (entries || []).map((entry) => {
      const matches = countMatches(entry.scores_snapshot, winningNumbers);
      const tier = matches >= 3 ? matches as 3 | 4 | 5 : null;
      return { ...entry, matches, tier };
    });

    // Calculate prize pool
    const totalPool = await calculatePrizePool();

    // Calculate prizes per tier
    const prizeBreakdown = [5, 4, 3].map((tier) => {
      const winners = results.filter((r) => r.tier === tier);
      const poolAmount = totalPool * POOL_DISTRIBUTION[tier as 3 | 4 | 5];
      const perWinner = winners.length > 0 ? poolAmount / winners.length : 0;
      return {
        tier,
        poolAmount: Math.round(poolAmount * 100) / 100,
        winnerCount: winners.length,
        perWinnerAmount: Math.round(perWinner * 100) / 100,
        winners: winners.map((w) => ({ userId: w.user_id, matches: w.matches })),
      };
    });

    // Update draw with winning numbers and simulated status
    await supabase
      .from('draws')
      .update({
        winning_numbers: winningNumbers,
        status: 'simulated',
        jackpot_rollover: prizeBreakdown.find((p) => p.tier === 5)?.winnerCount === 0,
      })
      .eq('id', drawId);

    // Update match_tier for each entry
    for (const result of results) {
      if (result.tier) {
        await supabase
          .from('draw_entries')
          .update({ match_tier: result.tier })
          .eq('id', result.id);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        drawId,
        winningNumbers,
        totalPool,
        prizeBreakdown,
        totalEntries: entries?.length || 0,
        totalWinners: results.filter((r) => r.tier).length,
      },
    });
  }

  // ── PUBLISH ──
  if (action === 'publish') {
    const { drawId } = body;

    // Get draw with its simulation data
    const { data: draw } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (!draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
    if (draw.status === 'published') return NextResponse.json({ error: 'Already published' }, { status: 400 });

    // Get all entries with their match tiers
    const { data: entries } = await supabase
      .from('draw_entries')
      .select('*')
      .eq('draw_id', drawId);

    // Calculate prize pool
    const totalPool = await calculatePrizePool();

    // Create prize records and winner records
    for (const tier of [5, 4, 3] as const) {
      const winners = (entries || []).filter((e) => e.match_tier === tier);
      const poolAmount = totalPool * POOL_DISTRIBUTION[tier];
      const perWinner = winners.length > 0 ? poolAmount / winners.length : 0;

      // Insert prize record
      await supabase.from('prizes').insert({
        draw_id: drawId,
        match_tier: tier,
        pool_amount: Math.round(poolAmount * 100) / 100,
        winner_count: winners.length,
        per_winner_amount: Math.round(perWinner * 100) / 100,
      });

      // Insert winner records
      for (const winner of winners) {
        await supabase.from('winners').insert({
          draw_id: drawId,
          user_id: winner.user_id,
          match_tier: tier,
          prize_amount: Math.round(perWinner * 100) / 100,
          verification_status: 'pending',
          payment_status: 'pending',
        });
      }
    }

    // Update draw status to published
    await supabase
      .from('draws')
      .update({ status: 'published' })
      .eq('id', drawId);

    return NextResponse.json({ success: true, message: 'Draw published and winners recorded' });
  }

  return NextResponse.json({ error: 'Invalid action. Use: create, simulate, or publish' }, { status: 400 });
}
