'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Dices,
  Heart,
  Trophy,
  TrendingUp,
  LogOut,
  Search,
  MoreVertical,
  Bell,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'draws', label: 'Draws', icon: Dices },
    { id: 'charities', label: 'Charities', icon: Heart },
    { id: 'winners', label: 'Winners', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  // Mock data
  const stats = [
    { label: 'Total Users', value: '14,208', change: '+12%', icon: Users },
    { label: 'Prize Pool', value: '$420.5K', status: 'AUTO-GENERATING...', icon: BarChart3 },
    { label: 'Impact Total', value: '$1.2M', badge: '24 CHARITIES', icon: Heart },
    { label: 'Retention Rate', value: '98.2%', progress: 98, icon: TrendingUp },
  ];

  const users = [
    {
      id: 1,
      name: 'James Arrington',
      email: 'james@golf-impact.io',
      tier: 'EAGLE TIER',
      status: 'Active',
      joined: 'Oct 12, 2023',
    },
    {
      id: 2,
      name: 'Sarah Sterling',
      email: 's.sterling@web.com',
      tier: 'BIRDIE TIER',
      status: 'Pending',
      joined: 'Nov 01, 2023',
    },
  ];

  const charities = [
    {
      id: 1,
      name: 'Pure Flow Initiative',
      icon: '💧',
      status: 'Active Partner',
      impact: '$142,500',
      progress: 75,
    },
    {
      id: 2,
      name: 'Green Tee Scholars',
      icon: '📚',
      status: 'Verification Pending',
      impact: '$50,000',
      progress: 10,
    },
  ];

  const winners = [
    { id: 1, name: 'Marc L.', amount: '$2,500 USD', status: 'pending' },
    { id: 2, name: 'Helena K.', amount: '$1,200 USD', status: 'approved' },
  ];

  const chartData = [40, 55, 45, 70, 85, 60, 50, 65, 75, 40, 55, 95];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-white/5 bg-surface flex flex-col py-8 shrink-0">
        <div className="px-8 mb-10">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h3 className="font-headline text-sm font-black uppercase tracking-wider text-primary-container">
            Admin Console
          </h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
            Global Impact Manager
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full space-y-2 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const href = item.id === 'overview' ? '/admin' : `/admin/${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-headline font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-container/10 text-primary-container border-l-4 border-primary-container'
                    : 'text-on-surface-variant hover:bg-white/5 hover:translate-x-2'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto px-8">
          <button className="flex items-center gap-4 text-error font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl border-b border-white/5 shadow-lg">
          <div className="flex justify-between items-center px-10 py-6">
            <div>
              <h1 className="text-2xl font-black text-primary-container uppercase font-headline">
                IMPACT GOLF
              </h1>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                Executive Dashboard
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Quick Search..."
                  className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary-container w-64 text-on-surface"
                />
              </div>

              {/* Notification Bell */}
              <button className="relative text-on-surface hover:text-primary-container transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-container rounded-full ring-2 ring-surface"></span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-white/10"></div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface">System Live</p>
                  <p className="text-[9px] text-primary-container font-mono uppercase">V 2.4.1.0-STABLE</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-container-low p-8 rounded-lg border border-white/5 hover:border-primary-container/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="w-10 h-10 rounded-md bg-primary-container/10 flex items-center justify-center text-primary-container mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                        {stat.label}
                      </p>
                      <h2 className="text-4xl font-extrabold font-headline text-on-surface">
                        {stat.value}
                      </h2>
                    </div>
                  </div>

                  {stat.change && (
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-[10px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded-full font-bold">
                        {stat.change}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">vs last month</span>
                    </div>
                  )}
                  {stat.status && (
                    <div className="text-[10px] font-mono text-on-surface-variant mt-4">
                      {stat.status}
                    </div>
                  )}
                  {stat.badge && (
                    <div className="text-[10px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded-full font-bold inline-block mt-4">
                      {stat.badge}
                    </div>
                  )}
                  {stat.progress !== undefined && (
                    <div className="mt-4 space-y-2">
                      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container shadow-neon"
                          style={{ width: `${stat.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: User & Charity Tables */}
            <div className="xl:col-span-2 space-y-8">
              {/* User Management */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-extrabold text-xl uppercase">User Management</h3>
                  <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all">
                    Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                      <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                        <th className="pb-4">Member</th>
                        <th className="pb-4">Tier</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => (
                        <tr key={user.id} className="text-sm hover:bg-white/2 transition">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                                👤
                              </div>
                              <div>
                                <span className="font-semibold text-on-surface">{user.name}</span>
                                <span className="text-[10px] text-on-surface-variant block">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-mono text-xs font-bold text-primary-container">
                            {user.tier}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                user.status === 'Active'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-error/10 text-error'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  user.status === 'Active' ? 'bg-primary animate-pulse' : 'bg-error'
                                }`}
                              ></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-on-surface-variant">{user.joined}</td>
                          <td className="py-4 text-right">
                            <button className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Charity Management */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline font-extrabold text-xl uppercase">Charity Partners</h3>
                  <button className="bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:shadow-neon">
                    <Plus className="w-4 h-4 inline mr-2" /> Add Listing
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {charities.map((charity) => (
                    <div
                      key={charity.id}
                      className="bg-surface-container-low p-5 rounded-lg border-l-4"
                      style={{
                        borderLeftColor: charity.status === 'Active Partner' ? '#cafd00' : '#484847',
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-2xl">
                          {charity.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{charity.name}</h4>
                          <p className="text-[10px] text-primary-container font-bold uppercase tracking-widest">
                            {charity.status}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant">
                          <span>Total Impact</span>
                          <span className="text-on-surface">{charity.impact}</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-container"
                            style={{ width: `${charity.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Draw Engine & Winners */}
            <div className="space-y-8">
              {/* Draw Engine */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5 relative overflow-hidden">
                <h3 className="font-headline font-extrabold text-xl uppercase mb-6">Draw Engine</h3>

                <div className="space-y-6">
                  {/* Logic Protocol */}
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                      Logic Protocol
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-primary-container text-on-primary-fixed p-3 rounded-md text-[10px] font-bold uppercase ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container">
                        True Random
                      </button>
                      <button className="bg-surface-container-highest text-on-surface-variant p-3 rounded-md text-[10px] font-bold uppercase hover:bg-white/5 transition-colors">
                        Tier-Weighted
                      </button>
                    </div>
                  </div>

                  {/* Draw Info */}
                  <div className="p-4 rounded-md bg-surface-container-lowest border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Current Entries</span>
                      <span className="text-xs font-mono font-bold">142,201</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Est. Draw Time</span>
                      <span className="text-xs font-mono font-bold text-primary-container">00:12:44</span>
                    </div>
                  </div>

                  {/* Draw Buttons */}
                  <div className="space-y-3 pt-4">
                    <button className="w-full bg-white/5 hover:bg-white/10 text-on-surface py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 transition-all">
                      Run Simulation
                    </button>
                    <button className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-neon transition-all hover:shadow-neon-lg">
                      Publish Results
                    </button>
                  </div>
                </div>
              </section>

              {/* Winners/Payouts Queue */}
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="font-headline font-extrabold text-xl uppercase">Payouts</h3>
                  <span className="bg-error text-[9px] font-black px-1.5 py-0.5 rounded-sm">URGENT (2)</span>
                </div>

                <div className="space-y-4">
                  {winners.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-surface-container-low p-4 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-primary-container flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface">{winner.name}</p>
                          <p className="text-[10px] font-mono text-primary-container">{winner.amount}</p>
                        </div>
                      </div>
                      <button
                        className={`p-2 rounded-full transition-colors ${
                          winner.status === 'approved'
                            ? 'bg-primary text-on-primary-fixed'
                            : 'bg-surface-container-highest hover:text-primary'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 text-on-surface-variant hover:text-on-surface text-[10px] font-bold uppercase tracking-widest transition-colors">
                  View All Winners History
                </button>
              </section>
            </div>
          </div>

          {/* Growth Analytics */}
          <section className="bg-surface-container p-8 rounded-lg border border-white/5">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="font-headline font-extrabold text-xl uppercase">Growth Analytics</h3>
                <p className="text-xs text-on-surface-variant mt-1">Real-time subscription and churn data.</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span className="w-3 h-3 rounded-full bg-white/10"></span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end gap-2 md:gap-4 overflow-hidden px-2 mb-8">
              {chartData.map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-sm transition-all group relative ${
                      height > 85
                        ? 'bg-primary-container shadow-neon'
                        : 'bg-surface-container-highest'
                    }`}
                    style={{ height: `${Math.max(height * 2.5, 20)}px` }}
                  >
                    {height > 85 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary-container text-surface text-[8px] font-bold px-1 rounded-sm">
                        {Math.round(height / 10)}k
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Month Labels */}
            <div className="grid grid-cols-12 gap-0 border-t border-white/10 pt-4">
              {months.map((month, idx) => (
                <div
                  key={month}
                  className={`text-[9px] text-center font-bold ${
                    chartData[idx] > 85 ? 'text-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
