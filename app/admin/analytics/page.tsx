'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Users, Heart, PieChart } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  totalUsers: number;
  totalRevenue: number;
  totalImpact: number;
  averageCharityContribution: number;
  monthlyGrowth: Array<{ month: string; users: number; revenue: number }>;
  topCharities: Array<{ name: string; totalRaised: number; donors: number }>;
  subscriptionBreakdown: { monthly: number; yearly: number };
  retentionRate: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return (
    <main className="min-h-screen bg-surface">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl border-b border-white/5">
        <div className="px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-on-surface-variant hover:text-on-surface transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-black text-primary-container uppercase font-headline">
              Analytics
            </h1>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                  dateRange === range
                    ? 'bg-primary-container text-on-primary-fixed shadow-neon'
                    : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'Last Year'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading analytics...</p>
          </div>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5">
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  Total Users
                </p>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  {data.totalUsers.toLocaleString()}
                </h2>
                <p className="text-[10px] text-primary-container mt-2">Active Members</p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5">
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  Total Revenue
                </p>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  ${(data.totalRevenue / 1000).toFixed(1)}K
                </h2>
                <p className="text-[10px] text-primary-container mt-2">
                  {dateRange === '30d' ? 'This Month' : 'Period'}
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5">
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  Total Impact
                </p>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  ${(data.totalImpact / 1000).toFixed(1)}K
                </h2>
                <p className="text-[10px] text-primary-container mt-2">Donated to Charities</p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5">
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  Retention Rate
                </p>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  {data.retentionRate}%
                </h2>
                <div className="mt-2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container"
                    style={{ width: `${data.retentionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Growth Chart */}
            <section className="bg-surface-container p-8 rounded-lg border border-white/5">
              <h3 className="font-headline font-extrabold text-lg uppercase mb-6">Growth Trends</h3>

              <div className="space-y-8">
                {/* Users Growth */}
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    User Growth
                  </p>
                  <div className="h-40 flex items-end gap-1">
                    {data.monthlyGrowth.map((item, idx) => {
                      const maxUsers = Math.max(...data.monthlyGrowth.map((m) => m.users));
                      const height = maxUsers > 0 ? (item.users / maxUsers) * 100 : 0;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t-sm transition-all ${
                              height > 70
                                ? 'bg-primary-container shadow-neon'
                                : 'bg-surface-container-highest'
                            }`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                          ></div>
                          <span className="text-[8px] text-on-surface-variant mt-2 w-full text-center truncate">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue Growth */}
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    Revenue Growth
                  </p>
                  <div className="h-40 flex items-end gap-1">
                    {data.monthlyGrowth.map((item, idx) => {
                      const maxRevenue = Math.max(...data.monthlyGrowth.map((m) => m.revenue));
                      const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t-sm transition-all ${
                              height > 70
                                ? 'bg-primary-container shadow-neon'
                                : 'bg-surface-container-highest'
                            }`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Subscription & Charity Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subscription Breakdown */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <h3 className="font-headline font-extrabold text-lg uppercase mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary-container" />
                  Subscription Plans
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Monthly ($29)</span>
                      <span className="text-sm font-bold text-primary-container">
                        {data.subscriptionBreakdown.monthly} members
                      </span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container"
                        style={{
                          width: `${
                            (data.subscriptionBreakdown.monthly /
                              (data.subscriptionBreakdown.monthly +
                                data.subscriptionBreakdown.yearly)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Yearly ($249)</span>
                      <span className="text-sm font-bold text-primary-container">
                        {data.subscriptionBreakdown.yearly} members
                      </span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container"
                        style={{
                          width: `${
                            (data.subscriptionBreakdown.yearly /
                              (data.subscriptionBreakdown.monthly +
                                data.subscriptionBreakdown.yearly)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Top Charities */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <h3 className="font-headline font-extrabold text-lg uppercase mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-container" />
                  Top Charities
                </h3>

                <div className="space-y-4">
                  {data.topCharities.map((charity, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-4 last:border-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold">{charity.name}</span>
                        <span className="text-sm font-bold text-primary-container">
                          ${(charity.totalRaised / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">
                        {charity.donors} donors
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-error">
            <p>Failed to load analytics data</p>
          </div>
        )}
      </div>
    </main>
  );
}
