import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const getSupabaseAdmin = () => createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const range = request.nextUrl.searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

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

    const startISO = startDate.toISOString();

    // Get total users (all time)
    const { count: totalUsersCount } = await getSupabaseAdmin()
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active subscriptions (filtered by date range — created within range)
    const { data: subscriptions } = await getSupabaseAdmin()
      .from('subscriptions')
      .select('monthly_contribution_amount, plan, amount, created_at')
      .eq('status', 'active');

    // Compute total revenue from active subscriptions
    const totalRevenue =
      subscriptions?.reduce((sum, sub) => {
        const amount = Number(sub.amount) || 0;
        return sum + amount;
      }, 0) || 0;

    // Compute total charity impact from monthly contributions
    const totalImpact =
      subscriptions?.reduce((sum, sub) => {
        return sum + (Number(sub.monthly_contribution_amount) || 0);
      }, 0) || 0;

    // Calculate how many months to show in growth chart
    let monthsToShow = 12;
    switch (range) {
      case '7d':
        monthsToShow = 3;
        break;
      case '30d':
        monthsToShow = 6;
        break;
      case '90d':
        monthsToShow = 6;
        break;
      case '1y':
        monthsToShow = 12;
        break;
    }

    // Get monthly growth data
    const monthlyData = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

      const { count: monthlyUsers } = await getSupabaseAdmin()
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      // Calculate revenue for this month from subscriptions created within period
      const monthRevenue =
        subscriptions
          ?.filter((s) => {
            const d = new Date(s.created_at);
            return d >= monthStart && d <= monthEnd;
          })
          .reduce((sum, sub) => sum + (Number(sub.amount) || 0), 0) || 0;

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        users: monthlyUsers || 0,
        revenue: monthRevenue,
      });
    }

    // Get subscription breakdown
    const subscriptionBreakdown = {
      monthly: subscriptions?.filter((s) => s.plan === 'monthly').length || 0,
      yearly: subscriptions?.filter((s) => s.plan === 'yearly').length || 0,
    };

    // Get top charities with donation aggregation
    const { data: charities } = await getSupabaseAdmin()
      .from('charities')
      .select('id, name')
      .limit(5);

    const topCharities = await Promise.all(
      (charities || []).map(async (charity) => {
        const { data: charitySubscriptions } = await getSupabaseAdmin()
          .from('subscriptions')
          .select('monthly_contribution_amount')
          .eq('charity_id', charity.id)
          .eq('status', 'active');

        const totalRaised =
          charitySubscriptions?.reduce(
            (sum, sub) => sum + (Number(sub.monthly_contribution_amount) || 0),
            0
          ) || 0;

        return {
          name: charity.name,
          totalRaised: totalRaised * 12, // Annualized
          donors: charitySubscriptions?.length || 0,
        };
      })
    );

    // Calculate retention rate (active subscriptions / total users)
    const totalActive = subscriptionBreakdown.monthly + subscriptionBreakdown.yearly;
    const retentionRate =
      totalUsersCount && totalActive > 0
        ? Math.round((totalActive / totalUsersCount) * 100)
        : 0;

    // Average contribution
    const avgContribution =
      subscriptions && subscriptions.length > 0
        ? totalImpact / subscriptions.length
        : 0;

    return NextResponse.json({
      totalUsers: totalUsersCount || 0,
      totalRevenue,
      totalImpact,
      averageCharityContribution: avgContribution,
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
