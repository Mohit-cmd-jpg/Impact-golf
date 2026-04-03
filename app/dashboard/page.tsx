'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  subscription_plan: string | null;
  subscription_renewal_date: string | null;
  charity_id: string | null;
  charity_contribution_percent: number;
  charity?: { id: string; name: string; category: string; image_url?: string } | null;
  subscription?: { plan: string; status: string; amount: number } | null;
}

interface Score {
  id: string;
  score: number;
  date_played: string;
  created_at: string;
}

interface DrawEntry {
  id: string;
  draw_id: string;
  scores_snapshot: number[];
  match_tier: number | null;
  created_at: string;
}

interface WinRecord {
  id: string;
  match_tier: number;
  prize_amount: number;
  verification_status: string;
  payment_status: string;
  created_at: string;
}

interface CharityOption {
  id: string;
  name: string;
  category: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [wins, setWins] = useState<WinRecord[]>([]);
  const [charities, setCharities] = useState<CharityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'scores' | 'charity' | 'winnings'>('overview');

  // Score form state
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [scoreSubmitting, setScoreSubmitting] = useState(false);
  const [scoreError, setScoreError] = useState('');
  const [scoreSuccess, setScoreSuccess] = useState('');

  // Charity update state
  const [selectedCharity, setSelectedCharity] = useState('');
  const [contributionPercent, setContributionPercent] = useState(10);
  const [charitySaving, setCharitySaving] = useState(false);

  const getToken = () => localStorage.getItem('authToken') || '';

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }), []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchAll = async () => {
      try {
        const [profileRes, scoresRes, charitiesRes] = await Promise.all([
          fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/scores', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/charities'),
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p.data);
          setSelectedCharity(p.data?.charity_id || '');
          setContributionPercent(p.data?.charity_contribution_percent || 10);
        } else if (profileRes.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/auth/login');
          return;
        }

        if (scoresRes.ok) {
          const s = await scoresRes.json();
          setScores(s.data || []);
        }

        if (charitiesRes.ok) {
          const c = await charitiesRes.json();
          setCharities(c.data || []);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScoreError('');
    setScoreSuccess('');
    const scoreNum = parseInt(newScore, 10);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setScoreError('Score must be between 1 and 45 (Stableford format)');
      return;
    }
    setScoreSubmitting(true);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ score: scoreNum, datePlayed: newDate }),
      });
      if (res.ok) {
        const data = await res.json();
        setScores((prev) => [data.data, ...prev].slice(0, 5));
        setNewScore('');
        setScoreSuccess('Score submitted! Only your latest 5 scores are kept.');
        setTimeout(() => setScoreSuccess(''), 4000);
      } else {
        const err = await res.json();
        setScoreError(err.error || 'Failed to submit score');
      }
    } catch {
      setScoreError('Network error');
    } finally {
      setScoreSubmitting(false);
    }
  };

  const handleCharityUpdate = async () => {
    if (!selectedCharity) return;
    setCharitySaving(true);
    try {
      const res = await fetch('/api/charities', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ charityId: selectedCharity, contributionPercent }),
      });
      if (res.ok) {
        const updated = charities.find((c) => c.id === selectedCharity);
        setProfile((prev) => prev ? { ...prev, charity_id: selectedCharity, charity_contribution_percent: contributionPercent, charity: updated || null } : prev);
      }
    } catch (err) {
      console.error('Charity update error:', err);
    } finally {
      setCharitySaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/auth/login');
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period.')) return;
    try {
      const res = await fetch('/api/payments/cancel', { method: 'POST', headers: authHeaders() });
      if (res.ok) {
        alert('Your subscription has been canceled. It will remain active until the end of the billing period.');
        // Refresh profile
        const profileRes = await fetch('/api/user/profile', { headers: authHeaders() });
        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p.data);
        }
      } else {
        alert('Failed to cancel subscription.');
      }
    } catch {
      alert('Network error while canceling subscription.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#cafd00]/30 border-t-[#cafd00] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const totalWinnings = wins.reduce((sum, w) => sum + w.prize_amount, 0);
  const subStatus = profile?.subscription_status || 'expired';
  const subPlan = profile?.subscription_plan || 'none';

  const TAB_ITEMS = [
    { id: 'overview' as const, label: 'OVERVIEW', icon: 'dashboard' },
    { id: 'scores' as const, label: 'SCORES', icon: 'scoreboard' },
    { id: 'charity' as const, label: 'CHARITY', icon: 'favorite' },
    { id: 'winnings' as const, label: 'WINNINGS', icon: 'emoji_events' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 lg:pt-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cafd00]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            <span className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant font-bold hidden md:block">{profile?.email}</span>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-widest transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ───── SIDEBAR ───── */}
        <aside className="lg:col-span-3 h-fit flex flex-col gap-6 sticky top-24">
          <div className="bg-[#131313] rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#cafd00]/30 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#cafd00] to-green-500 mb-6 p-0.5 shadow-[0_0_20px_rgba(202,253,0,0.3)]">
              <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
            <h2 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight mb-1">{profile?.name || 'User'}</h2>
            <p className="text-xs text-on-surface-variant font-bold tracking-[0.2em] mb-6">
              {subStatus === 'active' ? `${subPlan.toUpperCase()} MEMBER` : 'NO ACTIVE PLAN'}
            </p>
            <nav className="flex flex-col gap-2">
              {TAB_ITEMS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md font-headline font-bold text-sm tracking-widest transition-colors text-left w-full ${
                    activeTab === tab.id
                      ? 'bg-[#cafd00]/10 text-[#cafd00] border border-[#cafd00]/20'
                      : 'text-on-surface hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 mt-6 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 font-headline font-bold text-sm tracking-widest transition-colors w-full text-left">
                <span className="material-symbols-outlined shrink-0">logout</span> LOGOUT
              </button>
            </nav>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cafd00]/10 rounded-full blur-3xl -z-10" />
          </div>
        </aside>

        {/* ───── MAIN CONTENT ───── */}
        <main className="lg:col-span-9 flex flex-col gap-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Subscription Card */}
              <div className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-10 border border-white/10 relative overflow-hidden border-l-4 border-l-[#cafd00]">
                <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-[#cafd00]/5 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${subStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Subscription Status</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Plan</p>
                      <p className="text-xl font-black text-on-surface uppercase">{subPlan === 'none' ? 'No Plan' : subPlan}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Status</p>
                      <p className={`text-xl font-black uppercase ${subStatus === 'active' ? 'text-green-400' : 'text-red-400'}`}>{subStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Renewal Date</p>
                      <p className="text-xl font-black text-on-surface">
                        {profile?.subscription_renewal_date ? new Date(profile.subscription_renewal_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {subStatus !== 'active' && (
                      <Link href="/auth/signup" className="inline-flex items-center gap-2 mt-6 bg-[#cafd00] text-[#0e0e0e] px-6 py-3 rounded-full font-black text-sm hover:shadow-neon transition-all">
                        Subscribe Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    )}
                    {subStatus === 'active' && (
                      <button onClick={handleCancelSubscription} className="inline-flex items-center gap-2 mt-6 bg-transparent border border-red-500/50 text-red-400 px-6 py-3 rounded-full font-bold text-sm hover:bg-red-500/10 transition-all">
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#131313] p-6 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Scores Entered</p>
                  <p className="text-3xl font-black text-[#cafd00] font-mono">{scores.length}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">of 5 required</p>
                </div>
                <div className="bg-[#131313] p-6 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Charity %</p>
                  <p className="text-3xl font-black text-[#cafd00] font-mono">{profile?.charity_contribution_percent || 10}%</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">contribution</p>
                </div>
                <div className="bg-[#131313] p-6 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Total Won</p>
                  <p className="text-3xl font-black text-[#cafd00] font-mono">${totalWinnings}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">lifetime</p>
                </div>
                <div className="bg-[#131313] p-6 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Selected Charity</p>
                  <p className="text-sm font-black text-on-surface truncate">{profile?.charity?.name || 'None'}</p>
                  <p className="text-[10px] text-[#cafd00] mt-1">{profile?.charity?.category || '—'}</p>
                </div>
              </div>

              {/* Latest scores mini */}
              <div className="bg-[#131313] rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline font-black text-lg uppercase tracking-tight">Latest Scores</h3>
                  <button onClick={() => setActiveTab('scores')} className="text-[#cafd00] text-xs font-bold uppercase tracking-widest hover:underline">View All →</button>
                </div>
                {scores.length === 0 ? (
                  <p className="text-on-surface-variant text-sm">No scores entered yet. Enter your 5 Stableford scores to participate in draws.</p>
                ) : (
                  <div className="flex gap-3">
                    {scores.map((s) => (
                      <div key={s.id} className="flex-1 bg-white/5 p-4 rounded-lg text-center">
                        <p className="text-2xl font-black text-[#cafd00] font-mono">{s.score}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{new Date(s.date_played).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* SCORES TAB */}
          {activeTab === 'scores' && (
            <>
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10">
                <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-6">Enter New Score</h3>
                <form onSubmit={handleScoreSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest block mb-2">Stableford Score (1–45)</label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      placeholder="e.g. 38"
                      className="w-full bg-[#262626] border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-[#cafd00] focus:ring-0 outline-none transition"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest block mb-2">Date Played</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[#262626] border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:border-[#cafd00] focus:ring-0 outline-none transition"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={scoreSubmitting}
                      className="bg-[#cafd00] text-[#0e0e0e] px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm hover:shadow-neon transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {scoreSubmitting ? 'Saving...' : 'Submit'}
                    </button>
                  </div>
                </form>
                {scoreError && <p className="text-red-400 text-sm mt-3">{scoreError}</p>}
                {scoreSuccess && <p className="text-green-400 text-sm mt-3">{scoreSuccess}</p>}
              </div>

              <div className="bg-[#131313] rounded-xl p-6 border border-white/5">
                <h3 className="font-headline font-black text-lg uppercase tracking-tight mb-4">Your Rolling 5 Scores</h3>
                <p className="text-xs text-on-surface-variant mb-6">Only the latest 5 scores are retained. A new score replaces the oldest automatically. Displayed newest first.</p>
                {scores.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-white/10 block mb-4">scoreboard</span>
                    <p className="text-on-surface-variant">No scores yet. Enter your first score above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scores.map((s, idx) => (
                      <div key={s.id} className={`flex items-center justify-between p-4 rounded-lg border ${idx === 0 ? 'bg-[#cafd00]/5 border-[#cafd00]/20' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-on-surface-variant w-6">#{idx + 1}</span>
                          <div>
                            <p className="font-black text-xl text-on-surface font-mono">{s.score}</p>
                            <p className="text-[10px] text-on-surface-variant">{new Date(s.date_played).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${s.score >= 36 ? 'bg-[#cafd00]/10 text-[#cafd00]' : s.score >= 30 ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-on-surface-variant'}`}>
                            {s.score >= 36 ? 'Excellent' : s.score >= 30 ? 'Good' : 'Average'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* CHARITY TAB */}
          {activeTab === 'charity' && (
            <>
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10">
                <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-2">Your Charity Selection</h3>
                <p className="text-sm text-on-surface-variant mb-6">A minimum of 10% of your subscription fee goes to your selected charity. You can increase this percentage anytime.</p>

                <div className="space-y-3 mb-8 max-h-80 overflow-y-auto">
                  {charities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCharity(c.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition flex items-center gap-4 ${
                        selectedCharity === c.id ? 'border-[#cafd00] bg-[#cafd00]/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#cafd00]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#cafd00]">favorite</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{c.name}</p>
                        <p className="text-xs text-on-surface-variant">{c.category}</p>
                      </div>
                      {selectedCharity === c.id && (
                        <div className="w-6 h-6 bg-[#cafd00] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#0e0e0e] text-sm font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-[#262626] p-6 rounded-xl mb-6">
                  <label className="text-sm font-bold flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#cafd00] text-sm">trending_up</span>
                    Contribution Percentage: <span className="text-[#cafd00]">{contributionPercent}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={contributionPercent}
                    onChange={(e) => setContributionPercent(Number(e.target.value))}
                    className="w-full accent-[#cafd00]"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                    <span>Minimum 10%</span>
                    <span>Maximum 100%</span>
                  </div>
                </div>

                <button
                  onClick={handleCharityUpdate}
                  disabled={charitySaving || !selectedCharity}
                  className="bg-[#cafd00] text-[#0e0e0e] px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm hover:shadow-neon transition-all disabled:opacity-50 w-full"
                >
                  {charitySaving ? 'Saving...' : 'Save Charity Settings'}
                </button>
              </div>

              {/* Independent Donation */}
              <div className="bg-[#131313] rounded-xl p-6 border border-white/5">
                <h3 className="font-headline font-black text-lg uppercase tracking-tight mb-2">Make a Direct Donation</h3>
                <p className="text-xs text-on-surface-variant mb-4">You can donate independently — this is not tied to your subscription or gameplay.</p>
                <Link href="/charities" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full font-bold text-sm hover:border-white/30 transition-all">
                  Browse Charities <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </>
          )}

          {/* WINNINGS TAB */}
          {activeTab === 'winnings' && (
            <>
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10">
                <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-2">Winnings Overview</h3>
                <p className="text-sm text-on-surface-variant mb-6">Track your draw results, total winnings, and payout status.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#262626] p-6 rounded-xl text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Total Won</p>
                    <p className="text-4xl font-black text-[#cafd00] font-mono">${totalWinnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#262626] p-6 rounded-xl text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-2">Payment Status</p>
                    <p className="text-xl font-black text-on-surface">
                      {wins.filter((w) => w.payment_status === 'pending').length > 0
                        ? `${wins.filter((w) => w.payment_status === 'pending').length} Pending`
                        : 'All Paid'}
                    </p>
                  </div>
                </div>

                {wins.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-white/10 block mb-4">emoji_events</span>
                    <p className="text-on-surface-variant">No winnings yet. Keep entering scores and participating in monthly draws!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wins.map((w) => (
                      <div key={w.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                        <div>
                          <p className="font-bold text-on-surface">{w.match_tier}-Number Match</p>
                          <p className="text-[10px] text-on-surface-variant">{new Date(w.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xl text-[#cafd00] font-mono">${w.prize_amount.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                            w.payment_status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {w.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pb-4 px-2 bg-[#0e0e0e]/90 backdrop-blur-2xl rounded-t-[2rem] z-50 border-t border-white/5">
        <Link href="/" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </Link>
        <Link href="/draws" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Draws</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center bg-[#cafd00] text-[#0e0e0e] rounded-full p-3 mb-2 scale-110 shadow-[0_0_15px_#cafd00]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Me</span>
        </Link>
      </nav>
    </div>
  );
}
