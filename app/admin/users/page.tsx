'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Filter, Download, Edit2, Trash2, Shield } from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  tier: 'EAGLE_TIER' | 'BIRDIE_TIER' | 'PAR_TIER';
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  subscriptionPlan: 'monthly' | 'yearly';
  charitySelected: string;
  scoresCount: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Tier', 'Status', 'Joined', 'Plan', 'Charity', 'Scores'].join(','),
      ...filteredUsers.map((u) =>
        [u.name, u.email, u.tier, u.status, u.joinedDate, u.subscriptionPlan, u.charitySelected, u.scoresCount].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
  };

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
              User Management
            </h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10">
        {/* Filters */}
        <div className="bg-surface-container p-6 rounded-lg border border-white/5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary-container focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['All', 'Active', 'Pending', 'Suspended'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as typeof filterStatus)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                    filterStatus === status
                      ? 'bg-primary-container text-on-primary-fixed shadow-neon'
                      : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading users...</p>
          </div>
        ) : (
          <div className="bg-surface-container rounded-lg border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/5 bg-surface-container-low">
                  <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4 text-left">Member</th>
                    <th className="px-6 py-4 text-left">Tier</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                    <th className="px-6 py-4 text-left">Plan</th>
                    <th className="px-6 py-4 text-left">Charity</th>
                    <th className="px-6 py-4 text-center">Scores</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/2 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                            👤
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{user.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-primary-container">{user.tier}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'Active'
                              ? 'bg-primary/10 text-primary'
                              : user.status === 'Pending'
                              ? 'bg-error/10 text-error'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Active'
                                ? 'bg-primary'
                                : user.status === 'Pending'
                                ? 'bg-error'
                                : 'bg-on-surface-variant'
                            }`}
                          ></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{user.joinedDate}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-on-surface capitalize">{user.subscriptionPlan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-on-surface-variant">{user.charitySelected}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-primary-container">{user.scoresCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-error/10 rounded-full text-error transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Info */}
            <div className="px-6 py-4 border-t border-white/5 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
