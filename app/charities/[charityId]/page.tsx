'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  is_featured: boolean;
  upcoming_events: Array<{ title: string; date: string; description: string }>;
}

const CATEGORY_ICONS: Record<string, string> = {
  Water: 'water_drop',
  Education: 'school',
  Health: 'health_and_safety',
  Reforestation: 'nature',
};

export default function CharityDetailPage() {
  const params = useParams();
  const charityId = params.charityId as string;
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const res = await fetch('/api/charities');
        if (res.ok) {
          const data = await res.json();
          const found = (data.data || []).find((c: Charity) => c.id === charityId);
          setCharity(found || null);
        }
      } catch (err) {
        console.error('Failed to load charity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [charityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#cafd00]/30 border-t-[#cafd00] rounded-full animate-spin" />
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-4xl text-white/10">search_off</span>
        <p className="text-on-surface-variant">Charity not found.</p>
        <Link href="/charities" className="text-[#cafd00] font-bold text-sm">← Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16 lg:pt-20">
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
      <div className="bg-[#0e0e0e] py-16 lg:py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#cafd00]/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/charities" className="inline-flex items-center gap-2 text-on-surface-variant text-sm hover:text-[#cafd00] transition-colors mb-8">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Directory
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#cafd00]/10 flex items-center justify-center border border-[#cafd00]/20 shrink-0">
              <span className="material-symbols-outlined text-[#cafd00] text-4xl">{CATEGORY_ICONS[charity.category] || 'favorite'}</span>
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-[#cafd00]/10 text-[#cafd00] text-[10px] font-black tracking-widest uppercase mb-3 rounded border border-[#cafd00]/20">{charity.category}</span>
              <h1 className="text-3xl lg:text-5xl font-headline font-black uppercase tracking-tighter text-on-surface">{charity.name}</h1>
              {charity.is_featured && (
                <span className="inline-flex items-center gap-1 mt-3 text-[#cafd00] text-xs font-bold">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> Featured Charity
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16 space-y-12">
        {/* Description */}
        <section className="bg-[#131313] rounded-2xl p-8 border border-white/5">
          <h2 className="font-headline font-black text-lg uppercase tracking-tight mb-4">About This Charity</h2>
          <p className="text-on-surface-variant leading-relaxed text-base">{charity.description}</p>
          {charity.image_url && (
            <img src={charity.image_url} alt={charity.name} className="w-full h-64 object-cover rounded-xl mt-6" />
          )}
        </section>

        {/* Upcoming Events */}
        {charity.upcoming_events && charity.upcoming_events.length > 0 && (
          <section className="bg-[#131313] rounded-2xl p-8 border border-white/5">
            <h2 className="font-headline font-black text-lg uppercase tracking-tight mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#cafd00]">event</span>
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {charity.upcoming_events.map((event, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-6 border-l-4 border-[#cafd00]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-on-surface text-lg">{event.title}</h3>
                    <span className="text-xs text-[#cafd00] font-bold bg-[#cafd00]/10 px-3 py-1 rounded-full">{event.date}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{event.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#cafd00]/10 to-transparent rounded-2xl p-8 border border-[#cafd00]/20 text-center">
          <h2 className="text-2xl font-headline font-black uppercase tracking-tighter mb-3">Support {charity.name}</h2>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6">Subscribe to Impact Golf and select this charity to direct a portion of your subscription towards their mission.</p>
          <Link href={`/auth/signup`} className="inline-flex items-center gap-2 bg-[#cafd00] text-[#0e0e0e] px-8 py-3 rounded-full font-black hover:shadow-neon transition-all">
            Subscribe & Support <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
