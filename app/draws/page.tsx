'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, TrendingDown } from 'lucide-react';

export default function DrawsPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraw, setSelectedDraw] = useState<any>(null);

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = async () => {
    try {
      const response = await fetch('/api/draws?published=true');
      const data = await response.json();
      setDraws(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedDraw(data.data[0]);
      }
    } catch (err) {
      console.error('Failed to load draws:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    return new Date(2024, month - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-bg backdrop-blur-xl border-b border-outline-variant">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
              <span className="text-on-primary-fixed font-bold">⛳</span>
            </div>
            <h1 className="font-headline text-2xl font-bold">IMPACT GOLF</h1>
          </Link>
          <Link
            href="/dashboard"
            className="bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full font-semibold hover:shadow-neon transition"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main */}
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center text-on-surface-variant">Loading draws...</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Draw Display */}
            <div className="lg:col-span-2">
              {selectedDraw && (
                <div>
                  {/* Hero Section */}
                  <div className="bg-gradient-to-br from-blue-900 to-blue-600 rounded-2xl p-12 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative">
                      <div className="text-on-surface-variant text-sm font-semibold mb-4">
                        {getMonthName(selectedDraw.month)} {selectedDraw.year}
                      </div>
                      <h2 className="font-headline text-5xl font-black mb-8">
                        DRAW RESULTS
                      </h2>

                      {/* Winning Numbers */}
                      <div className="flex gap-4 mb-8">
                        {selectedDraw.winning_numbers && selectedDraw.winning_numbers.map(
                          (num: number, idx: number) => (
                            <div
                              key={idx}
                              className="w-20 h-20 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center text-4xl font-black shadow-neon"
                            >
                              {num}
                            </div>
                          )
                        )}
                      </div>

                      {selectedDraw.jackpot_rollover && (
                        <div className="inline-block px-4 py-2 bg-error/20 text-error rounded-full">
                          🎉 Jackpot Rolled Over
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prize Breakdown */}
                  <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant mb-8">
                    <h3 className="font-headline text-2xl font-bold mb-6">Prize Breakdown</h3>

                    <div className="space-y-4">
                      {selectedDraw.prizes && selectedDraw.prizes.map((prize: any) => (
                        <div
                          key={prize.id}
                          className="flex items-center justify-between p-4 bg-surface-container-high rounded-lg"
                        >
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-primary-container" />
                              {prize.match_tier}-Number Match
                            </div>
                            <div className="text-on-surface-variant text-sm">
                              {prize.winner_count} winner{prize.winner_count !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary-container">
                              ${prize.per_winner_amount}
                            </div>
                            <div className="text-on-surface-variant text-sm">
                              (Pool: ${prize.pool_amount})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Draw Stats */}
                  <div className="graph-chart bg-surface-container p-8 rounded-2xl border border-outline-variant">
                    <h3 className="font-headline text-2xl font-bold mb-6">Draw Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-on-surface-variant text-sm mb-2">Total Prize Pool</div>
                        <div className="text-2xl font-bold text-primary-container">
                          $
                          {selectedDraw.prizes
                            ?.reduce((sum: number, p: any) => sum + parseFloat(p.pool_amount), 0)
                            .toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-on-surface-variant text-sm mb-2">Total Winners</div>
                        <div className="text-2xl font-bold text-primary-container">
                          {selectedDraw.prizes?.reduce((sum: number, p: any) => sum + p.winner_count, 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-on-surface-variant text-sm mb-2">Draw Type</div>
                        <div className="text-2xl font-bold capitalize">{selectedDraw.draw_type}</div>
                      </div>
                      <div>
                        <div className="text-on-surface-variant text-sm mb-2">Entries</div>
                        <div className="text-2xl font-bold">
                          {selectedDraw.draw_entries?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Draw History Sidebar */}
            <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant h-fit sticky top-24">
              <h3 className="font-headline text-xl font-bold mb-6">Draw History</h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {draws.length > 0 ? (
                  draws.map((draw) => (
                    <button
                      key={draw.id}
                      onClick={() => setSelectedDraw(draw)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        selectedDraw?.id === draw.id
                          ? 'border-primary-container bg-surface-container-high'
                          : 'border-outline-variant hover:border-primary-container'
                      }`}
                    >
                      <div className="font-semibold">
                        {getMonthName(draw.month)} {draw.year}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {draw.draw_entries?.length || 0} entries
                      </div>
                      {draw.winning_numbers && (
                        <div className="text-xs text-primary-container font-mono mt-2">
                          {draw.winning_numbers.join(', ')}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-on-surface-variant text-sm">No draws published yet</p>
                )}
              </div>

              {/* Charity Impact Info */}
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <h4 className="font-semibold mb-4">Charity Impact This Draw</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Total Raised</span>
                    <span className="font-semibold">$8,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">To Water for All</span>
                    <span className="font-semibold text-primary-container">$2,535</span>
                  </div>
                  <div className="relative bg-surface-container-high rounded-full h-2 mt-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary-container rounded-full"
                      style={{ width: '30%' }}
                    ></div>
                  </div>
                  <p className="text-on-surface-variant text-xs">30% of this draw's proceeds support charities</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
