import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all users from the database
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      return NextResponse.json([]);
    }

    // Get score counts for each user
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        const { count } = await supabaseAdmin
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        return {
          id: user.id,
          name: user.full_name || 'Unknown',
          email: user.email,
          tier: user.tier || 'PAR_TIER',
          status: user.subscription_status === 'active' ? 'Active' : 'Pending',
          joinedDate: new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          subscriptionPlan: user.subscription_plan || 'monthly',
          charitySelected: user.charity_name || 'Not Selected',
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
