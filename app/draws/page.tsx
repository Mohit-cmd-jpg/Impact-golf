'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Draw {
  id: string;
  month: number;
  year: number;
  draw_type: string;
  status: string;
  winning_numbers: number[];
  jackpot_rollover: boolean;
  prizes?: Array<{
    match_tier: number;
    pool_amount: number;
    winner_count: number;
    per_winner_amount: number;
  }>;
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PRIZE_LABELS: Record<number, string> = {
  5: '5-Number Match',
  4: '4-Number Match',
  3: '3-Number Match',
};

const POOL_SHARES: Record<number, string> = {
  5: '40%',
  4: '35%',
  3: '25%',
};

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await fetch('/api/draws?published=true');
        if (res.ok) {
          const data = await res.json();
          const published = (data.data || []).filter((d: Draw) => d.status === 'published');
          setDraws(published);
          if (published.length > 0) setSelectedDraw(published[0]);
        }
      } catch (err) {
        console.error('Failed to load draws:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 lg:pt-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cafd00]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            <span className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center font-headline font-extrabold tracking-tighter uppercase text-sm">
            <Link className="text-gray-400 hover:text-white transition-colors" href="/">Home</Link>
            <Link className="text-[#f3ffca] border-b-2 border-[#cafd00] pb-1" href="/draws">Draws</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" href="/charities">Impact</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#0e0e0e] text-center py-20 lg:py-32 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#cafd00]/20 via-surface to-transparent opacity-40 mix-blend-screen pointer-events-none" />
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface mb-6 font-headline relative z-10">
          MONTHLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#8eb300]">REVEAL</span>
        </h1>
        <p className="text-on-surface-variant text-sm font-bold tracking-[0.2em] max-w-xl mx-auto uppercase relative z-10 px-4">
          Check draw results, see the prize pool breakdown, and find out if you won.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 space-y-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#cafd00]/30 border-t-[#cafd00] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant text-sm">Loading draw results...</p>
          </div>
        ) : draws.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-white/10 block mb-4">emoji_events</span>
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight mb-2">No Draws Published Yet</h2>
            <p className="text-on-surface-variant max-w-md mx-auto">
              The first monthly draw is coming soon! Subscribe and enter your scores to participate.
            </p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 mt-8 bg-[#cafd00] text-[#0e0e0e] px-8 py-3 rounded-full font-black hover:shadow-neon transition-all">
              Subscribe Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Prize Pool Breakdown */}
            <section>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tight mb-8 text-center">
                Prize Pool <span className="text-[#cafd00]">Breakdown</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[5, 4, 3].map((tier) => (
                  <div key={tier} className={`relative rounded-2xl p-8 border text-center ${
                    tier === 5
                      ? 'bg-gradient-to-b from-[#cafd00]/10 to-transparent border-[#cafd00]/30 shadow-[0_0_40px_rgba(202,253,0,0.1)]'
                      : 'bg-[#131313] border-white/5'
                  }`}>
                    {tier === 5 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#cafd00] text-[#0e0e0e] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Jackpot</span>
                    )}
                    <h3 className="text-lg font-headline font-black uppercase tracking-tight mt-2 mb-2">{PRIZE_LABELS[tier]}</h3>
                    <p className={`text-5xl font-headline font-black tracking-tighter ${tier === 5 ? 'text-[#cafd00]' : 'text-on-surface'}`}>{POOL_SHARES[tier]}</p>
                    <p className="text-xs text-on-surface-variant mt-2 uppercase font-bold tracking-widest">of prize pool</p>
                    {tier === 5 && <p className="mt-3 text-xs text-[#cafd00] font-bold bg-[#cafd00]/10 px-3 py-1 rounded-full inline-block">Rolls over if unclaimed</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Draw Detail */}
            {selectedDraw && (
              <section className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-12 border border-white/10">
                <h2 className="font-headline font-black text-2xl uppercase tracking-tight mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#cafd00]">emoji_events</span>
                  {MONTH_NAMES[selectedDraw.month]} {selectedDraw.year} Draw
                  {selectedDraw.jackpot_rollover && (
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full font-bold ml-2">Jackpot Rollover</span>
                  )}
                </h2>

                {/* Winning Numbers */}
                <div className="text-center mb-10">
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-4">Winning Numbers</p>
                  <div className="flex justify-center gap-4">
                    {selectedDraw.winning_numbers.map((num, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-full bg-[#cafd00] text-[#0e0e0e] font-black text-2xl flex items-center justify-center shadow-[0_0_30px_rgba(202,253,0,0.4)] animate-pulse"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize Details */}
                {selectedDraw.prizes && selectedDraw.prizes.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedDraw.prizes
                      .sort((a, b) => b.match_tier - a.match_tier)
                      .map((prize) => (
                      <div key={prize.match_tier} className="bg-white/5 rounded-xl p-6 text-center border border-white/5">
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">{PRIZE_LABELS[prize.match_tier]}</p>
                        <p className="text-2xl font-black text-[#cafd00] font-mono">${Number(prize.pool_amount).toLocaleString()}</p>
                        <p className="text-xs text-on-surface-variant mt-2">{prize.winner_count} winner{prize.winner_count !== 1 ? 's' : ''}</p>
                        {prize.winner_count > 0 && (
                          <p className="text-xs text-on-surface mt-1 font-bold">${Number(prize.per_winner_amount).toLocaleString()} each</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center mt-8">
                  <p className="text-xs text-on-surface-variant">Draw Type: <span className="text-on-surface font-bold capitalize">{selectedDraw.draw_type}</span></p>
                </div>
              </section>
            )}

            {/* Past Draw History */}
            <section>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tight mb-8">
                Past <span className="text-[#cafd00]">Results</span>
              </h2>
              <div className="space-y-4">
                {draws.map((draw) => (
                  <button
                    key={draw.id}
                    onClick={() => setSelectedDraw(draw)}
                    className={`w-full text-left p-6 rounded-xl border transition-all ${
                      selectedDraw?.id === draw.id
                        ? 'bg-[#cafd00]/5 border-[#cafd00]/30'
                        : 'bg-[#131313] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#cafd00]">calendar_month</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface text-lg">{MONTH_NAMES[draw.month]} {draw.year}</h3>
                          <p className="text-xs text-on-surface-variant capitalize">{draw.draw_type} draw</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {draw.winning_numbers.slice(0, 5).map((num, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-[#cafd00]/10 text-[#cafd00] font-bold text-xs flex items-center justify-center">{num}</span>
                          ))}
                        </div>
                        {draw.jackpot_rollover && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full font-bold">Rollover</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Participate CTA */}
            <section className="text-center bg-gradient-to-b from-[#131313] to-transparent rounded-2xl p-12 border border-white/5">
              <h2 className="text-3xl font-headline font-black uppercase tracking-tighter mb-4">
                Enter the Next <span className="text-[#cafd00]">Draw</span>
              </h2>
              <p className="text-on-surface-variant max-w-md mx-auto mb-8">
                Submit your 5 Stableford scores and you&apos;ll automatically be entered into the next monthly draw.
              </p>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-[#cafd00] text-[#0e0e0e] px-8 py-4 rounded-full font-black text-lg hover:shadow-neon transition-all">
                Subscribe & Play <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </section>
          </>
        )}
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pb-4 px-2 bg-[#0e0e0e]/90 backdrop-blur-2xl rounded-t-[2rem] z-50 border-t border-white/5">
        <Link href="/" className="flex flex-col items-center justify-center text-gray-500 p-2">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </Link>
        <Link href="/draws" className="flex flex-col items-center justify-center bg-[#cafd00] text-[#0e0e0e] rounded-full p-3 mb-2 scale-110 shadow-[0_0_15px_#cafd00]">
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Draws</span>
        </Link>
        <Link href="/charities" className="flex flex-col items-center justify-center text-gray-500 p-2">
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Impact</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-gray-500 p-2">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
