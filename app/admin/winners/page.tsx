'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Winner {
  id: string;
  name: string;
  amount: string;
  matches: number;
  status: 'pending' | 'approved' | 'paid';
  drawDate: string;
  email: string;
}

export default function AdminWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('/api/admin/winners');
        if (response.ok) {
          const data = await response.json();
          setWinners(data);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const filtersWinners = winners.filter((w) => filter === 'all' || w.status === filter);

  const pendingCount = winners.filter((w) => w.status === 'pending').length;
  const approvedCount = winners.filter((w) => w.status === 'approved').length;
  const paidCount = winners.filter((w) => w.status === 'paid').length;

  const handleApprove = async (winnerId: string) => {
    try {
      const response = await fetch(`/api/admin/winners/${winnerId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        setWinners((prev) =>
          prev.map((w) => (w.id === winnerId ? { ...w, status: 'approved' } : w))
        );
      }
    } catch (error) {
      console.error('Error approving winner:', error);
    }
  };

  const handleMarkPaid = async (winnerId: string) => {
    try {
      const response = await fetch(`/api/admin/winners/${winnerId}/paid`, {
        method: 'POST',
      });
      if (response.ok) {
        setWinners((prev) =>
          prev.map((w) => (w.id === winnerId ? { ...w, status: 'paid' } : w))
        );
      }
    } catch (error) {
      console.error('Error marking winner as paid:', error);
    }
  };

  const StatusBadge = ({ status }: { status: 'pending' | 'approved' | 'paid' }) => {
    const styles = {
      pending: 'bg-error/10 text-error',
      approved: 'bg-primary/10 text-primary',
      paid: 'bg-primary-container/10 text-primary-container',
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle2 className="w-3 h-3" />,
      paid: <CheckCircle2 className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl border-b border-white/5">
        <div className="px-10 py-6 flex items-center">
          <Link href="/admin" className="text-on-surface-variant hover:text-on-surface transition mr-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-primary-container uppercase font-headline">
            Winners & Payouts
          </h1>
          {pendingCount > 0 && (
            <span className="ml-4 bg-error text-[9px] font-black px-2 py-1 rounded-sm">
              {pendingCount} URGENT
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {/* Filter Tabs */}
        <div className="flex gap-3 flex-wrap">
          {[
            { id: 'all' as const, label: 'All', count: winners.length },
            { id: 'pending' as const, label: 'Pending', count: pendingCount },
            { id: 'approved' as const, label: 'Approved', count: approvedCount },
            { id: 'paid' as const, label: 'Paid', count: paidCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                filter === tab.id
                  ? 'bg-primary-container text-on-primary-fixed shadow-neon'
                  : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading winners...</p>
          </div>
        ) : filtersWinners.length === 0 ? (
          <div className="text-center py-20 bg-surface-container rounded-lg border border-white/5">
            <p className="text-on-surface-variant">No winners found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtersWinners.map((winner) => (
              <div
                key={winner.id}
                className={`bg-surface-container p-6 rounded-lg border-l-4 ${
                  winner.status === 'pending' ? 'border-error' : 'border-primary-container'
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full border-2 border-primary-container flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-on-surface mb-1">{winner.name}</h3>
                      <p className="text-[10px] text-on-surface-variant">{winner.email}</p>
                      <div className="mt-2 flex gap-3 text-[10px]">
                        <span className="text-on-surface-variant">
                          Draw: {winner.drawDate}
                        </span>
                        <span className="text-primary-container font-mono">
                          {winner.matches} Match{winner.matches > 1 ? 'es' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">
                        Prize Amount
                      </p>
                      <p className="text-2xl font-black text-primary-container font-mono">
                        {winner.amount}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <StatusBadge status={winner.status} />

                      {winner.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(winner.id)}
                          className="px-4 py-2 bg-primary-container text-on-primary-fixed rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-neon whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          Approve
                        </button>
                      )}

                      {winner.status === 'approved' && (
                        <button
                          onClick={() => handleMarkPaid(winner.id)}
                          className="px-4 py-2 bg-primary-container text-on-primary-fixed rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-neon whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          Mark Paid
                        </button>
                      )}

                      {winner.status === 'paid' && (
                        <span className="text-[10px] text-on-surface-variant font-bold text-center">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
