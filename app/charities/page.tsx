'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  is_featured: boolean;
  upcoming_events: Array<{ title: string; date: string; description: string }>;
}

const CATEGORIES = ['All', 'Water', 'Education', 'Health', 'Reforestation'];

const CATEGORY_ICONS: Record<string, string> = {
  Water: 'water_drop',
  Education: 'school',
  Health: 'health_and_safety',
  Reforestation: 'nature',
};

const CATEGORY_COLORS: Record<string, string> = {
  Water: 'from-blue-500/20 to-cyan-400/10',
  Education: 'from-amber-500/20 to-yellow-400/10',
  Health: 'from-red-500/20 to-pink-400/10',
  Reforestation: 'from-green-500/20 to-emerald-400/10',
};

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const url = activeCategory !== 'All'
          ? `/api/charities?category=${activeCategory}`
          : '/api/charities';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setCharities(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load charities:', err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchCharities();
  }, [activeCategory]);

  const filteredCharities = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filteredCharities.filter((c) => c.is_featured);
  const regular = filteredCharities.filter((c) => !c.is_featured);

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
            <Link className="text-gray-400 hover:text-white transition-colors" href="/draws">Draws</Link>
            <Link className="text-[#f3ffca] border-b-2 border-[#cafd00] pb-1" href="/charities">Impact</Link>
            <Link className="text-gray-400 hover:text-white transition-colors" href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#0e0e0e] text-center py-24 lg:py-36 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#cafd00]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface mb-6 font-headline relative z-10">
          GLOBAL <span className="text-[#cafd00]">DIRECTORY</span>
        </h1>
        <p className="text-on-surface-variant text-sm font-bold tracking-[0.2em] max-w-xl mx-auto uppercase relative z-10 px-4">
          Discover the incredible organizations we support worldwide through your participation.
        </p>
        <div className="mt-12 w-full max-w-2xl px-6 relative z-10">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input
              className="w-full bg-[#1a1a1a] border-2 border-white/5 rounded-full pl-12 pr-6 py-4 text-sm focus:border-[#cafd00] focus:ring-0 text-on-surface transition-colors placeholder:text-on-surface-variant/50 outline-none"
              placeholder="Search by name, cause, or region..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-10">
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-[#cafd00] text-[#0e0e0e] shadow-neon'
                  : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#cafd00]/30 border-t-[#cafd00] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant text-sm">Loading charities...</p>
          </div>
        ) : filteredCharities.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-4xl text-white/10 block mb-4">search_off</span>
            <p className="text-on-surface-variant">No charities found matching your search.</p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="font-headline font-black text-lg uppercase tracking-widest text-[#cafd00] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Featured Charities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((charity) => (
                    <Link
                      key={charity.id}
                      href={`/charities/${charity.id}`}
                      className="bg-gradient-to-br from-[#cafd00]/5 to-transparent rounded-2xl p-8 border border-[#cafd00]/20 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(202,253,0,0.1)] block"
                    >
                      <div className="absolute top-0 right-0 bg-[#cafd00] text-[#0e0e0e] text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-widest">Featured</div>
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[charity.category] || 'from-gray-500/20 to-gray-400/10'} mb-6 flex items-center justify-center border border-white/10`}>
                        <span className="material-symbols-outlined text-[#cafd00] text-3xl">{CATEGORY_ICONS[charity.category] || 'favorite'}</span>
                      </div>
                      <span className="inline-block px-3 py-1 bg-[#cafd00]/10 text-[#cafd00] text-[10px] font-black tracking-widest uppercase mb-3 rounded border border-[#cafd00]/20">{charity.category}</span>
                      <h2 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight mb-3 group-hover:text-[#cafd00] transition-colors">{charity.name}</h2>
                      <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">{charity.description}</p>
                      {charity.upcoming_events && charity.upcoming_events.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[10px] text-[#cafd00] font-bold uppercase tracking-widest mb-2">Upcoming Event</p>
                          <p className="text-sm text-on-surface">{charity.upcoming_events[0].title}</p>
                          <p className="text-xs text-on-surface-variant">{charity.upcoming_events[0].date}</p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Charities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featured.length > 0 ? regular : filteredCharities).map((charity) => (
                <Link
                  key={charity.id}
                  href={`/charities/${charity.id}`}
                  className="bg-[#131313] rounded-2xl p-8 border border-white/5 relative overflow-hidden group hover:-translate-y-2 hover:border-[#cafd00]/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(202,253,0,0.05)] block"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cafd00] to-green-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[charity.category] || 'from-gray-500/20 to-gray-400/10'} mb-8 flex items-center justify-center border border-white/10 group-hover:border-[#cafd00]/50 transition-colors`}>
                    <span className="material-symbols-outlined text-[#cafd00] text-3xl">{CATEGORY_ICONS[charity.category] || 'favorite'}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-[#cafd00]/10 text-[#cafd00] text-[10px] font-black tracking-widest uppercase mb-4 rounded border border-[#cafd00]/20">{charity.category}</span>
                  <h2 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight mb-4 group-hover:text-[#cafd00] transition-colors">{charity.name}</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-8 line-clamp-3">{charity.description}</p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{charity.category}</span>
                    <span className="material-symbols-outlined text-white/10 group-hover:text-[#cafd00] transition-colors group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pb-4 px-2 bg-[#0e0e0e]/90 backdrop-blur-2xl rounded-t-[2rem] z-50 border-t border-white/5">
        <Link href="/" className="flex flex-col items-center justify-center text-gray-500 p-2">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </Link>
        <Link href="/draws" className="flex flex-col items-center justify-center text-gray-500 p-2">
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Draws</span>
        </Link>
        <Link href="/charities" className="flex flex-col items-center justify-center bg-[#cafd00] text-[#0e0e0e] rounded-full p-3 mb-2 scale-110 shadow-[0_0_15px_#cafd00]">
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
