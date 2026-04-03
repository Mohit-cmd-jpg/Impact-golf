'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  Calendar,
  Users,
  DollarSign,
  Play,
  Send,
  Clock,
  Plus,
  X,
  Eye,
  Heart,
  RefreshCw,
  Zap,
  Shuffle,
} from 'lucide-react';
import Link from 'next/link';

interface Draw {
  id: string;
  drawDate: string;
  status: 'published' | 'pending' | 'running' | 'draft' | 'simulated';
  entries: number;
  prizePool: number;
  winningNumbers: number[];
  totalWinners: number;
}

interface Charity {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  totalRaised: number;
  status: string;
  progress: number;
}

export default function AdminDraws() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [drawLogic, setDrawLogic] = useState<'random' | 'algorithmic'>('random');
  const [charities, setCharities] = useState<Charity[]>([]);
  const [detailDraw, setDetailDraw] = useState<Draw | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [creating, setCreating] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const fetchDraws = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/draws', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setDraws(data);
      }
    } catch (error) {
      console.error('Error fetching draws:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCharities = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/charities', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCharities(data);
      }
    } catch (error) {
      console.error('Error fetching charities:', error);
    }
  }, []);

  useEffect(() => {
    fetchDraws();
    fetchCharities();
  }, [fetchDraws, fetchCharities]);

  const handleCreateDraw = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/admin/draws/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      const result = await response.json();
      if (response.ok) {
        showMessage('success', result.message || 'Draw created successfully!');
        await fetchDraws();
      } else {
        showMessage('error', result.error || 'Failed to create draw');
      }
    } catch (error) {
      console.error('Error creating draw:', error);
      showMessage('error', 'Network error creating draw');
    } finally {
      setCreating(false);
    }
  };

  const handleSimulation = async () => {
    setSimulationRunning(true);
    try {
      // Use the [action] route which auto-creates a draw if none exists
      const response = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ drawType: drawLogic }),
      });
      const result = await response.json();
      if (response.ok) {
        showMessage('success', `Simulation complete! Numbers: ${result.winningNumbers?.join(', ') || 'Generated'}`);
        await fetchDraws();
      } else {
        showMessage('error', result.error || 'Simulation failed');
      }
    } catch (error) {
      console.error('Error running simulation:', error);
      showMessage('error', 'Network error running simulation');
    } finally {
      setSimulationRunning(false);
    }
  };

  const handlePublishDraw = async (drawId: string) => {
    try {
      const response = await fetch('/api/admin/draws/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ drawId }),
      });
      const result = await response.json();
      if (response.ok) {
        showMessage('success', 'Draw published successfully! Results are now public.');
        setDraws((prev) =>
          prev.map((d) =>
            d.id === drawId ? { ...d, status: 'published' as const } : d
          )
        );
      } else {
        showMessage('error', result.error || 'Failed to publish draw');
      }
    } catch (error) {
      console.error('Error publishing draw:', error);
      showMessage('error', 'Network error publishing draw');
    }
  };

  const currentDraw = draws.length > 0 ? draws[0] : null;

  const statusColors: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400',
    simulated: 'bg-blue-500/10 text-blue-400',
    draft: 'bg-amber-500/10 text-amber-400',
    pending: 'bg-amber-500/10 text-amber-400',
    running: 'bg-purple-500/10 text-purple-400',
  };

  const statusDot: Record<string, string> = {
    published: 'bg-green-400',
    simulated: 'bg-blue-400',
    draft: 'bg-amber-400',
    pending: 'bg-amber-400',
    running: 'bg-purple-400',
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg border flex items-center gap-3 transition-all animate-[slideIn_0.3s_ease-out] ${
            actionMessage.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-error/10 border-error/20 text-error'
          }`}
        >
          <span className="text-sm font-bold">{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container w-full max-w-lg mx-4 rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-black text-xl uppercase">Draw Details</h2>
              <button
                onClick={() => setDetailDraw(null)}
                className="p-2 hover:bg-white/5 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Date</span>
                <span className="font-bold text-on-surface flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-container" />
                  {detailDraw.drawDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[detailDraw.status] || 'bg-white/5 text-on-surface-variant'}`}>
                  {detailDraw.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Total Entries</span>
                <span className="font-bold text-on-surface font-mono">{detailDraw.entries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Prize Pool</span>
                <span className="font-bold text-primary-container font-mono">${detailDraw.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm">Total Winners</span>
                <span className="font-bold text-on-surface font-mono">{detailDraw.totalWinners}</span>
              </div>

              {detailDraw.winningNumbers && detailDraw.winningNumbers.length > 0 && (
                <div>
                  <p className="text-on-surface-variant text-sm mb-3">Winning Numbers</p>
                  <div className="flex gap-2">
                    {detailDraw.winningNumbers.map((num, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-full bg-primary-container text-on-primary-fixed font-black text-lg flex items-center justify-center shadow-neon"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-2">
              {detailDraw.status === 'simulated' && (
                <button
                  onClick={() => {
                    handlePublishDraw(detailDraw.id);
                    setDetailDraw(null);
                  }}
                  className="flex-1 bg-primary-container text-on-primary-fixed py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-neon hover:shadow-neon-lg transition-all"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Publish
                </button>
              )}
              <button
                onClick={() => setDetailDraw(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl border-b border-white/5">
        <div className="px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-on-surface-variant hover:text-on-surface transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-black text-primary-container uppercase font-headline">
              Draw Engine
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateDraw}
              disabled={creating}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-on-surface px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'New Draw'}
            </button>
            <button
              onClick={handleSimulation}
              disabled={simulationRunning}
              className="flex items-center gap-2 bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-neon disabled:opacity-50 hover:shadow-neon-lg transition-all"
            >
              <Play className="w-4 h-4" />
              {simulationRunning ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading draws...</p>
          </div>
        ) : (
          <>
            {/* Current/Upcoming Draw */}
            {currentDraw && (
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Draw Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="font-headline font-extrabold text-xl uppercase">
                        Current Draw
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[currentDraw.status] || 'bg-white/5 text-on-surface-variant'}`}>
                        {currentDraw.status}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-2">
                          Draw Date
                        </label>
                        <p className="text-lg font-bold text-on-surface flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-container" />
                          {currentDraw.drawDate}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container-low p-4 rounded-lg">
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                            Total Entries
                          </p>
                          <p className="text-2xl font-black text-primary-container font-mono">
                            {currentDraw.entries.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-lg">
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                            Prize Pool
                          </p>
                          <p className="text-2xl font-black text-on-surface font-mono">
                            ${currentDraw.prizePool.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {currentDraw.winningNumbers && currentDraw.winningNumbers.length > 0 && (
                        <div>
                          <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                            Winning Numbers
                          </label>
                          <div className="flex gap-3">
                            {currentDraw.winningNumbers.map((num, idx) => (
                              <div
                                key={idx}
                                className="w-12 h-12 rounded-full bg-primary-container text-on-primary-fixed font-black text-lg flex items-center justify-center shadow-neon"
                              >
                                {num}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-2">
                          Total Winners
                        </label>
                        <p className="text-2xl font-black text-on-surface flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary-container" />
                          {currentDraw.totalWinners}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePublishDraw(currentDraw.id)}
                        disabled={currentDraw.status === 'published' || currentDraw.status === 'draft'}
                        className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-neon disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon-lg transition-all"
                      >
                        <Send className="w-4 h-4 inline mr-2" />
                        {currentDraw.status === 'published'
                          ? 'Published ✓'
                          : currentDraw.status === 'draft'
                          ? 'Simulate First'
                          : 'Publish Results'}
                      </button>
                    </div>
                  </div>

                  {/* Logic Protocol */}
                  <div>
                    <h3 className="font-headline font-extrabold text-xl uppercase mb-6">
                      Draw Configuration
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                          Logic Protocol
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDrawLogic('random')}
                            className={`p-4 rounded-lg text-[10px] font-bold uppercase text-center transition-all flex flex-col items-center gap-2 ${
                              drawLogic === 'random'
                                ? 'bg-primary-container text-on-primary-fixed ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container'
                                : 'bg-surface-container-highest text-on-surface-variant hover:bg-white/5'
                            }`}
                          >
                            <Shuffle className="w-5 h-5" />
                            True Random
                          </button>
                          <button
                            onClick={() => setDrawLogic('algorithmic')}
                            className={`p-4 rounded-lg text-[10px] font-bold uppercase text-center transition-all flex flex-col items-center gap-2 ${
                              drawLogic === 'algorithmic'
                                ? 'bg-primary-container text-on-primary-fixed ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container'
                                : 'bg-surface-container-highest text-on-surface-variant hover:bg-white/5'
                            }`}
                          >
                            <Zap className="w-5 h-5" />
                            Tier-Weighted
                          </button>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-2">
                          {drawLogic === 'random'
                            ? 'Uses cryptographically random number generation for full fairness.'
                            : 'Weights draw chances based on subscription tier (Eagle > Birdie > Par).'}
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                          Draw History
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {draws.length === 0 ? (
                            <div className="text-center py-4 text-on-surface-variant text-sm">
                              No draws yet. Create one to get started.
                            </div>
                          ) : (
                            draws.map((draw) => (
                              <div
                                key={draw.id}
                                className="bg-surface-container-low p-4 rounded-lg border-l-4 border-primary-container hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setDetailDraw(draw)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-bold text-sm text-on-surface">{draw.drawDate}</p>
                                    <p className="text-[10px] text-on-surface-variant">
                                      {draw.entries.toLocaleString()} entries • {draw.totalWinners} winners
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                                        statusColors[draw.status] || 'bg-white/5 text-on-surface-variant'
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[draw.status] || 'bg-on-surface-variant'}`} />
                                      {draw.status}
                                    </span>
                                    <Eye className="w-4 h-4 text-on-surface-variant" />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Empty State when no draws */}
            {draws.length === 0 && !loading && (
              <section className="bg-surface-container p-12 rounded-lg border border-white/5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary-container" />
                </div>
                <h3 className="font-headline font-black text-xl uppercase mb-2">No Draws Yet</h3>
                <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
                  Create your first monthly draw to get started. Subscribers with 5 scores will be automatically entered.
                </p>
                <button
                  onClick={handleCreateDraw}
                  disabled={creating}
                  className="bg-primary-container text-on-primary-fixed px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-neon hover:shadow-neon-lg transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {creating ? 'Creating...' : 'Create First Draw'}
                </button>
              </section>
            )}

            {/* Charity Impact Section */}
            {charities.length > 0 && (
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <h3 className="font-headline font-extrabold text-xl uppercase mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Charity Partners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {charities.map((charity) => (
                    <div
                      key={charity.id}
                      className="bg-surface-container-low p-5 rounded-lg border-l-4 border-primary-container hover:border-pink-400 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                          {charity.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">{charity.name}</h4>
                          <p className="text-[10px] text-primary-container font-bold uppercase tracking-widest">
                            {charity.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                          Total Raised
                        </span>
                        <span className="text-sm font-bold text-primary-container font-mono">
                          ${charity.totalRaised.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full transition-all duration-500"
                          style={{ width: `${charity.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className={`text-[10px] font-bold uppercase ${
                          charity.status === 'Active' || charity.status === 'Featured'
                            ? 'text-green-400'
                            : 'text-on-surface-variant'
                        }`}>
                          {charity.status}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-bold">
                          {charity.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Draws Table */}
            {draws.length > 0 && (
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <h3 className="font-headline font-extrabold text-xl uppercase mb-6">All Draws</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/5 bg-surface-container-low">
                      <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-6 py-4 text-left">Draw Date</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Entries</th>
                        <th className="px-6 py-4 text-right">Prize Pool</th>
                        <th className="px-6 py-4 text-center">Winners</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {draws.map((draw) => (
                        <tr key={draw.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-6 py-4 font-bold text-on-surface">{draw.drawDate}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                statusColors[draw.status] || 'bg-white/5 text-on-surface-variant'
                              }`}
                            >
                              <span className={`w-1 h-1 rounded-full ${statusDot[draw.status] || 'bg-on-surface-variant'}`} />
                              {draw.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-mono">
                            {draw.entries.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold">
                            ${draw.prizePool.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-bold text-primary-container">{draw.totalWinners}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setDetailDraw(draw)}
                                className="text-primary-container hover:text-primary text-xs font-bold uppercase transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Details
                              </button>
                              {draw.status === 'simulated' && (
                                <button
                                  onClick={() => handlePublishDraw(draw.id)}
                                  className="text-green-400 hover:text-green-300 text-xs font-bold uppercase transition-colors flex items-center gap-1 ml-2"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  Publish
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
