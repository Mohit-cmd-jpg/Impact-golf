import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: users, error: usersError } = await getSupabaseAdmin()
      .from('users')
      .select('*, charities(name)')
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;
    if (!users || users.length === 0) return NextResponse.json([]);

    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        const { count } = await getSupabaseAdmin()
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        return {
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || '',
          tier: user.subscription_plan === 'yearly' ? 'EAGLE_TIER' : user.subscription_status === 'active' ? 'BIRDIE_TIER' : 'PAR_TIER',
          status: user.subscription_status === 'active' ? 'Active' : user.subscription_status === 'cancelled' ? 'Suspended' : 'Pending',
          joinedDate: new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          subscriptionPlan: user.subscription_plan || 'monthly',
          charitySelected: (user as any).charities?.name || 'Not Selected',
          scoresCount: count || 0,
        };
      })
    );

    return NextResponse.json(usersWithScores);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
