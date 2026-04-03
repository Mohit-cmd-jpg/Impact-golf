'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface OverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalPrizePool: number;
  totalCharity: number;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/admin/users', label: 'Users', icon: 'group' },
  { href: '/admin/draws', label: 'Draws', icon: 'casino' },
  { href: '/admin/charities', label: 'Charities', icon: 'favorite' },
  { href: '/admin/winners', label: 'Winners', icon: 'emoji_events' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
];

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalPrizePool: 0,
    totalCharity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken') || '';
        const res = await fetch('/api/admin/analytics?range=30d', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalUsers: data.totalUsers || 0,
            activeSubscriptions: data.subscriptionBreakdown
              ? (data.subscriptionBreakdown.monthly || 0) + (data.subscriptionBreakdown.yearly || 0)
              : 0,
            totalPrizePool: data.totalRevenue || 0,
            totalCharity: data.totalImpact || 0,
          });
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/auth/login');
  };

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: 'group', color: 'text-[#cafd00]' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions.toLocaleString(), icon: 'credit_card', color: 'text-green-400' },
    { label: 'Prize Pool Total', value: `$${(stats.totalPrizePool / 1000).toFixed(1)}K`, icon: 'payments', color: 'text-blue-400' },
    { label: 'Charity Contributions', value: `$${(stats.totalCharity / 1000).toFixed(1)}K`, icon: 'volunteer_activism', color: 'text-pink-400' },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="h-screen w-72 border-r border-white/5 bg-[#0e0e0e] flex flex-col py-8 shrink-0 sticky top-0">
        <div className="px-8 mb-10 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#cafd00] flex items-center justify-center">
              <span className="text-[#0e0e0e] font-black text-sm">IG</span>
            </div>
            <div>
              <h3 className="font-headline font-black text-[#cafd00] text-sm uppercase tracking-wider">Admin Console</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Management Panel</p>
            </div>
          </div>
          <nav className="w-full space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 font-headline font-semibold transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'bg-[#cafd00]/10 text-[#cafd00] border-l-4 border-[#cafd00]'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto px-8 space-y-4">
          <Link href="/" className="flex items-center gap-4 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
            <span className="material-symbols-outlined">home</span> View Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-4 text-red-400 font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 w-full z-40 bg-[#0e0e0e]/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex justify-between items-center px-10 py-6">
            <div>
              <h1 className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</h1>
              <span className="text-[10px] text-on-surface-variant font-bold tracking-[0.2em] uppercase">Executive Dashboard</span>
            </div>
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input className="bg-[#1a1a1a] border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-[#cafd00] w-64 text-on-surface outline-none" placeholder="Quick Search..." type="text" />
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STAT_CARDS.map((card) => (
              <div key={card.label} className="bg-[#131313] p-8 rounded-lg border border-white/5 group hover:border-[#cafd00]/20 transition-all">
                <div className={`w-10 h-10 rounded-md bg-white/5 flex items-center justify-center ${card.color} mb-4`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{card.label}</p>
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tighter">
                  {loading ? '...' : card.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/draws" className="bg-[#131313] p-6 rounded-lg border border-white/5 hover:border-[#cafd00]/30 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#cafd00]">casino</span>
                <h3 className="font-headline font-bold text-lg uppercase tracking-tight group-hover:text-[#cafd00] transition-colors">Draw Engine</h3>
              </div>
              <p className="text-sm text-on-surface-variant">Configure, simulate, and publish monthly draws.</p>
            </Link>
            <Link href="/admin/winners" className="bg-[#131313] p-6 rounded-lg border border-white/5 hover:border-[#cafd00]/30 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#cafd00]">emoji_events</span>
                <h3 className="font-headline font-bold text-lg uppercase tracking-tight group-hover:text-[#cafd00] transition-colors">Winners</h3>
              </div>
              <p className="text-sm text-on-surface-variant">Review and verify winner submissions, manage payouts.</p>
            </Link>
            <Link href="/admin/users" className="bg-[#131313] p-6 rounded-lg border border-white/5 hover:border-[#cafd00]/30 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#cafd00]">group</span>
                <h3 className="font-headline font-bold text-lg uppercase tracking-tight group-hover:text-[#cafd00] transition-colors">Users</h3>
              </div>
              <p className="text-sm text-on-surface-variant">Manage user profiles, subscriptions, and scores.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
