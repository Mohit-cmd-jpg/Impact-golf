'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['All Causes', 'Water', 'Education', 'Health', 'Reforestation'];

  useEffect(() => {
    loadCharities();
  }, [category]);

  const loadCharities = async () => {
    try {
      const categoryParam = category === 'all' ? '' : `?category=${category}`;
      const response = await fetch(`/api/charities${categoryParam}`);
      const data = await response.json();
      setCharities(data.data || []);
    } catch (err) {
      console.error('Failed to load charities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="font-headline text-5xl font-black mb-4">OUR IMPACT PARTNERS</h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">
            Choose a cause you care about and help drive real impact with every draw participation
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary-container transition"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All Causes' ? 'all' : cat)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  (cat === 'All Causes' && category === 'all') || cat === category
                    ? 'bg-primary-container text-on-primary-fixed'
                    : 'bg-surface-container border border-outline-variant hover:border-primary-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Charities Grid */}
        {loading ? (
          <div className="text-center text-on-surface-variant">Loading charities...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((charity) => (
              <div
                key={charity.id}
                className="bg-surface-container p-6 rounded-2xl border border-outline-variant hover:border-primary-container transition group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center text-6xl mb-4 group-hover:shadow-neon transition">
                  💧
                </div>

                {/* Category Tag */}
                <div className="inline-block mb-3 px-3 py-1 bg-surface-container-high rounded-full">
                  <span className="text-primary-container font-semibold text-sm">{charity.category}</span>
                </div>

                {/* Charity Info */}
                <h3 className="font-headline text-2xl font-bold mb-3">{charity.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-3">
                  {charity.description}
                </p>

                {/* Button */}
                <button className="w-full bg-primary-container text-on-primary-fixed py-2 rounded-lg font-semibold hover:shadow-neon transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-on-surface-variant text-lg">No charities found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
