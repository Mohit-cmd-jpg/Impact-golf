'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Users, DollarSign, Play, Send, Clock } from 'lucide-react';
import Link from 'next/link';

interface Draw {
  id: string;
  drawDate: string;
  status: 'published' | 'pending' | 'running';
  entries: number;
  prizePool: number;
  winningNumbers: number[];
  totalWinners: number;
}

export default function AdminDraws() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const response = await fetch('/api/admin/draws');
        if (response.ok) {
          const data = await response.json();
          setDraws(data);
        }
      } catch (error) {
        console.error('Error fetching draws:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  const handleSimulation = async () => {
    setSimulationRunning(true);
    try {
      const response = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
      });
      if (response.ok) {
        // Refresh draws
        const result = await fetch('/api/admin/draws');
        if (result.ok) {
          setDraws(await result.json());
        }
      }
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setSimulationRunning(false);
    }
  };

  const handlePublishDraw = async (drawId: string) => {
    try {
      const response = await fetch(`/api/admin/draws/${drawId}/publish`, {
        method: 'POST',
      });
      if (response.ok) {
        setDraws((prev) =>
          prev.map((d) =>
            d.id === drawId ? { ...d, status: 'published' as const } : d
          )
        );
      }
    } catch (error) {
      console.error('Error publishing draw:', error);
    }
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
              Draw Engine
            </h1>
          </div>
          <button
            onClick={handleSimulation}
            disabled={simulationRunning}
            className="flex items-center gap-2 bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-neon disabled:opacity-50 hover:shadow-neon-lg transition-all"
          >
            <Play className="w-4 h-4" />
            {simulationRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading draws...</p>
          </div>
        ) : (
          <>
            {/* Current/Upcoming Draw */}
            {draws.length > 0 && (
              <section className="bg-surface-container p-8 rounded-lg border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Draw Info */}
                  <div>
                    <h3 className="font-headline font-extrabold text-xl uppercase mb-6">
                      Current Draw
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-2">
                          Draw Date
                        </label>
                        <p className="text-lg font-bold text-on-surface flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-container" />
                          {draws[0]?.drawDate}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container-low p-4 rounded-lg">
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                            Total Entries
                          </p>
                          <p className="text-2xl font-black text-primary-container font-mono">
                            {draws[0]?.entries.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-lg">
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                            Prize Pool
                          </p>
                          <p className="text-2xl font-black text-on-surface font-mono">
                            ${draws[0]?.prizePool.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                          Winning Numbers
                        </label>
                        <div className="flex gap-3">
                          {draws[0]?.winningNumbers.map((num, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded-full bg-primary-container text-on-primary-fixed font-black text-lg flex items-center justify-center shadow-neon"
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-2">
                          Total Winners
                        </label>
                        <p className="text-2xl font-black text-on-surface flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary-container" />
                          {draws[0]?.totalWinners}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePublishDraw(draws[0].id)}
                        disabled={draws[0]?.status === 'published'}
                        className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-neon disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon-lg transition-all"
                      >
                        <Send className="w-4 h-4 inline mr-2" />
                        {draws[0]?.status === 'published' ? 'Published' : 'Publish Results'}
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
                          <button className="bg-primary-container text-on-primary-fixed p-4 rounded-lg text-[10px] font-bold uppercase ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container text-center">
                            True Random
                          </button>
                          <button className="bg-surface-container-highest text-on-surface-variant p-4 rounded-lg text-[10px] font-bold uppercase hover:bg-white/5 transition-colors text-center">
                            Tier-Weighted
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant block mb-3">
                          Draw History
                        </label>
                        <div className="space-y-2">
                          {draws.map((draw) => (
                            <div
                              key={draw.id}
                              className="bg-surface-container-low p-4 rounded-lg border-l-4 border-primary-container"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-sm text-on-surface">{draw.drawDate}</p>
                                  <p className="text-[10px] text-on-surface-variant">
                                    {draw.entries.toLocaleString()} entries
                                  </p>
                                </div>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                    draw.status === 'published'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-surface-container text-on-surface-variant'
                                  }`}
                                >
                                  {draw.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* All Draws */}
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
                      <tr key={draw.id} className="hover:bg-white/2 transition">
                        <td className="px-6 py-4 font-bold text-on-surface">{draw.drawDate}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              draw.status === 'published'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                draw.status === 'published' ? 'bg-primary' : 'bg-on-surface-variant'
                              }`}
                            ></span>
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
                          <button className="text-primary-container hover:text-primary text-xs font-bold uppercase transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
