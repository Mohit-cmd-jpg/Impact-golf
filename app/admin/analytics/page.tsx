'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, TrendingUp, Users, Heart, PieChart, Download, RefreshCw } from 'lucide-react';
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
  const [hoveredBar, setHoveredBar] = useState<{ section: string; idx: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handleExport = () => {
    if (!data) return;

    const rows = [
      ['Metric', 'Value'],
      ['Total Users', data.totalUsers.toString()],
      ['Total Revenue', `$${data.totalRevenue.toLocaleString()}`],
      ['Total Impact', `$${data.totalImpact.toLocaleString()}`],
      ['Avg Charity Contribution', `$${data.averageCharityContribution.toFixed(2)}`],
      ['Monthly Subscribers', data.subscriptionBreakdown.monthly.toString()],
      ['Yearly Subscribers', data.subscriptionBreakdown.yearly.toString()],
      ['Retention Rate', `${data.retentionRate}%`],
      [''],
      ['Month', 'New Users', 'Revenue'],
      ...data.monthlyGrowth.map((m) => [m.month, m.users.toString(), `$${m.revenue.toLocaleString()}`]),
      [''],
      ['Charity', 'Total Raised', 'Donors'],
      ...data.topCharities.map((c) => [c.name, `$${c.totalRaised.toLocaleString()}`, c.donors.toString()]),
    ];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const rangeName = (r: string) =>
    r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : 'Last Year';

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

          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={!data}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

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
                  {rangeName(range)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading analytics...</p>
          </div>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5 hover:border-primary-container/20 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary-container" />
                  <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                    Total Users
                  </p>
                </div>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  {data.totalUsers.toLocaleString()}
                </h2>
                <p className="text-[10px] text-primary-container mt-2">Active Members</p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5 hover:border-primary-container/20 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                    Total Revenue
                  </p>
                </div>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  ${data.totalRevenue > 1000 ? `${(data.totalRevenue / 1000).toFixed(1)}K` : data.totalRevenue.toLocaleString()}
                </h2>
                <p className="text-[10px] text-primary-container mt-2">
                  {rangeName(dateRange)}
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5 hover:border-primary-container/20 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                    Total Impact
                  </p>
                </div>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  ${data.totalImpact > 1000 ? `${(data.totalImpact / 1000).toFixed(1)}K` : data.totalImpact.toLocaleString()}
                </h2>
                <p className="text-[10px] text-primary-container mt-2">Donated to Charities</p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-white/5 hover:border-primary-container/20 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="w-4 h-4 text-blue-400" />
                  <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                    Retention Rate
                  </p>
                </div>
                <h2 className="text-3xl font-extrabold text-on-surface font-mono">
                  {data.retentionRate}%
                </h2>
                <div className="mt-2 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-700"
                    style={{ width: `${data.retentionRate}%` }}
                  />
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
                  {data.monthlyGrowth.every((m) => m.users === 0) ? (
                    <div className="h-40 flex items-center justify-center text-on-surface-variant text-sm">
                      No user signups in this period
                    </div>
                  ) : (
                    <div className="h-40 flex items-end gap-1 relative">
                      {data.monthlyGrowth.map((item, idx) => {
                        const maxUsers = Math.max(...data.monthlyGrowth.map((m) => m.users));
                        const height = maxUsers > 0 ? (item.users / maxUsers) * 100 : 0;
                        const isHovered = hoveredBar?.section === 'users' && hoveredBar.idx === idx;
                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center relative"
                            onMouseEnter={() => setHoveredBar({ section: 'users', idx })}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {/* Tooltip */}
                            {isHovered && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 border border-white/10">
                                {item.users} users
                              </div>
                            )}
                            <div
                              className={`w-full rounded-t-sm transition-all cursor-pointer ${
                                isHovered
                                  ? 'bg-primary-container shadow-neon scale-105'
                                  : height > 70
                                  ? 'bg-primary-container shadow-neon'
                                  : 'bg-surface-container-highest hover:bg-surface-container-highest/80'
                              }`}
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                            <span className="text-[8px] text-on-surface-variant mt-2 w-full text-center truncate">
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Revenue Growth */}
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    Revenue Growth
                  </p>
                  {data.monthlyGrowth.every((m) => m.revenue === 0) ? (
                    <div className="h-40 flex items-center justify-center text-on-surface-variant text-sm">
                      No revenue data in this period
                    </div>
                  ) : (
                    <div className="h-40 flex items-end gap-1 relative">
                      {data.monthlyGrowth.map((item, idx) => {
                        const maxRevenue = Math.max(...data.monthlyGrowth.map((m) => m.revenue));
                        const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                        const isHovered = hoveredBar?.section === 'revenue' && hoveredBar.idx === idx;
                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center relative"
                            onMouseEnter={() => setHoveredBar({ section: 'revenue', idx })}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {isHovered && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 border border-white/10">
                                ${item.revenue.toLocaleString()}
                              </div>
                            )}
                            <div
                              className={`w-full rounded-t-sm transition-all cursor-pointer ${
                                isHovered
                                  ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)] scale-105'
                                  : height > 70
                                  ? 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                                  : 'bg-surface-container-highest hover:bg-surface-container-highest/80'
                              }`}
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                            <span className="text-[8px] text-on-surface-variant mt-2 w-full text-center truncate">
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

                {data.subscriptionBreakdown.monthly + data.subscriptionBreakdown.yearly === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-sm">
                    No active subscriptions yet
                  </div>
                ) : (
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
                          className="h-full bg-primary-container rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (data.subscriptionBreakdown.monthly /
                                (data.subscriptionBreakdown.monthly +
                                  data.subscriptionBreakdown.yearly)) *
                              100
                            }%`,
                          }}
                        />
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
                          className="h-full bg-green-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (data.subscriptionBreakdown.yearly /
                                (data.subscriptionBreakdown.monthly +
                                  data.subscriptionBreakdown.yearly)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Top Charities */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <h3 className="font-headline font-extrabold text-lg uppercase mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-container" />
                  Top Charities
                </h3>

                {data.topCharities.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-sm">
                    No charity data available yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.topCharities.map((charity, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-4 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-on-surface-variant bg-white/5 w-6 h-6 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-bold">{charity.name}</span>
                          </div>
                          <span className="text-sm font-bold text-primary-container">
                            ${charity.totalRaised > 1000 ? `${(charity.totalRaised / 1000).toFixed(1)}K` : charity.totalRaised.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant ml-8">
                          {charity.donors} donor{charity.donors !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-error text-2xl">!</span>
            </div>
            <p className="text-error font-bold mb-2">Failed to load analytics data</p>
            <button
              onClick={handleRefresh}
              className="text-sm text-primary-container hover:text-primary transition underline"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
