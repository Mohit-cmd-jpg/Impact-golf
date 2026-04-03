'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Trophy, Gift, Clock, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadUserData(token);
  }, []);

  const loadUserData = async (token: string) => {
    try {
      const profileRes = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const scoresRes = await fetch('/api/scores', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (profileRes.ok && scoresRes.ok) {
        const userData = await profileRes.json();
        const scoresData = await scoresRes.json();
        setUser(userData.data);
        setScores(scoresData.data || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token || !newScore || !scoreDate) return;

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: parseInt(newScore),
          datePlayed: scoreDate,
        }),
      });

      if (response.ok) {
        setNewScore('');
        setScoreDate('');
        loadUserData(token);
      }
    } catch (err) {
      console.error('Failed to add score:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-bg backdrop-blur-xl border-b border-outline-variant">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
              <span className="text-on-primary-fixed font-bold">⛳</span>
            </div>
            <h1 className="font-headline text-2xl font-bold tracking-tight">IMPACT GOLF</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/charities" className="text-on-surface-variant hover:text-on-surface transition">
              Charities
            </Link>
            <Link href="/draws" className="text-on-surface-variant hover:text-on-surface transition">
              Draws
            </Link>
            <button
              onClick={handleLogout}
              className="text-on-surface hover:text-error transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        {/* Welcome Hero */}
        <div className="mb-12">
          <h2 className="font-headline text-5xl font-black mb-4">
            Welcome back, {user?.name}! 🎉
          </h2>
          <p className="text-on-surface-variant text-lg">
            Next draw in {Math.floor(Math.random() * 28) + 1} days
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Subscription Status */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline font-bold">Subscription</h3>
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-on-primary-fixed" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-2 capitalize">{user?.subscription_plan || 'No Plan'}</div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                user?.subscription_status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-error/20 text-error'
              }`}
            >
              {user?.subscription_status || 'Inactive'}
            </div>
            <button className="mt-4 text-primary-container font-semibold hover:text-primary transition">
              Manage →
            </button>
          </div>

          {/* Scores Status */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline font-bold">Golf Scores</h3>
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-on-primary-fixed" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-2">{scores.length}/5</div>
            <p className="text-on-surface-variant text-sm mb-4">
              {scores.length === 5
                ? 'Ready for draws!'
                : `${5 - scores.length} more scores needed`}
            </p>
            <button className="text-primary-container font-semibold hover:text-primary transition">
              View Scores →
            </button>
          </div>

          {/* Winnings */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline font-bold">Winnings</h3>
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-on-primary-fixed" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-container mb-2">$0.00</div>
            <p className="text-on-surface-variant text-sm">Total prize money won</p>
          </div>
        </div>

        {/* Add Score Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Score Entry Form */}
          <div className="bg-surface-container p-8 rounded-xl border border-outline-variant">
            <h3 className="font-headline text-2xl font-bold mb-6">Add Your Score</h3>

            <form onSubmit={handleAddScore} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Score (1-45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Enter your score"
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary-container transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Date Played</label>
                <input
                  type="date"
                  value={scoreDate}
                  onChange={(e) => setScoreDate(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary-container transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition"
              >
                Post Score
              </button>
            </form>
          </div>

          {/* Scores History */}
          <div className="bg-surface-container p-8 rounded-xl border border-outline-variant">
            <h3 className="font-headline text-2xl font-bold mb-6">Recent Scores</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scores.length > 0 ? (
                scores.map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-4 bg-surface-container-high rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{score.score} Points</div>
                      <div className="text-sm text-on-surface-variant">
                        {new Date(score.date_played).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-primary-container font-bold text-lg">{score.score}</div>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant">No scores yet. Add your first score above!</p>
              )}
            </div>
          </div>
        </div>

        {/* Charity Section */}
        {user?.charity && (
          <div className="mt-12 bg-surface-container p-8 rounded-xl border border-outline-variant">
            <h3 className="font-headline text-2xl font-bold mb-6">Your Impact</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-2">{user.charity.name}</div>
                <div className="text-on-surface-variant mb-4">
                  {user.charity_contribution_percent}% of your winnings support this cause
                </div>
              </div>
              <button className="bg-primary-container text-on-primary-fixed px-6 py-3 rounded-full font-semibold hover:shadow-neon transition">
                Change Charity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
