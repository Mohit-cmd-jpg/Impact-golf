import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const range = request.nextUrl.searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get total users
    const { count: totalUsersCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total revenue from subscriptions
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('monthly_contribution_amount, plan')
      .eq('status', 'active');

    const totalRevenue =
      subscriptions?.reduce((sum, sub) => {
        const monthlyAmount = sub.monthly_contribution_amount || 0;
        return sum + (sub.plan === 'yearly' ? monthlyAmount * 12 : monthlyAmount);
      }, 0) || 0;

    // Get total impact from subscription contributions
    const totalImpact =
      subscriptions?.reduce((sum, sub) => {
        return sum + (sub.monthly_contribution_amount || 0);
      }, 0) || 0;

    // Get monthly growth data
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const { count: monthlyUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        users: monthlyUsers || 0,
        revenue: 0, // Would calculate from subscriptions in real scenario
      });
    }

    // Get subscription breakdown
    const { data: monthlyPlans } = await supabaseAdmin
      .from('subscriptions')
      .select('plan')
      .eq('status', 'active');

    const subscriptionBreakdown = {
      monthly: monthlyPlans?.filter((s) => s.plan === 'monthly').length || 0,
      yearly: monthlyPlans?.filter((s) => s.plan === 'yearly').length || 0,
    };

    // Get top charities
    const { data: charities } = await supabaseAdmin
      .from('charities')
      .select('id, name')
      .limit(5);

    const topCharities = await Promise.all(
      (charities || []).map(async (charity) => {
        const { data: charitySubscriptions } = await supabaseAdmin
          .from('subscriptions')
          .select('monthly_contribution_amount')
          .eq('charity_id', charity.id)
          .eq('status', 'active');

        const totalRaised =
          charitySubscriptions?.reduce((sum, sub) => sum + (sub.monthly_contribution_amount || 0), 0) || 0;

        return {
          name: charity.name,
          totalRaised: totalRaised * 12, // Annual amount
          donors: charitySubscriptions?.length || 0,
        };
      })
    );

    // Calculate retention rate (active subscriptions / total users)
    const retentionRate =
      totalUsersCount && subscriptionBreakdown.monthly + subscriptionBreakdown.yearly > 0
        ? Math.round(
            ((subscriptionBreakdown.monthly + subscriptionBreakdown.yearly) / totalUsersCount) * 100
          )
        : 0;

    return NextResponse.json({
      totalUsers: totalUsersCount || 0,
      totalRevenue,
      totalImpact,
      averageCharityContribution: subscriptions ? totalImpact / subscriptions.length : 0,
      monthlyGrowth: monthlyData,
      topCharities: topCharities.sort((a, b) => b.totalRaised - a.totalRaised),
      subscriptionBreakdown,
      retentionRate,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
