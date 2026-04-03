'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Charity {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  totalRaised: number;
  status: 'Active' | 'Verification Pending' | 'Inactive';
  progress: number;
}

export default function AdminCharities() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmoji, setFormEmoji] = useState('');
  const [formCategory, setFormCategory] = useState('Water');
  const [formDescription, setFormDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleCreateCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: formName, emoji: formEmoji, category: formCategory, description: formDescription }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormName(''); setFormEmoji(''); setFormCategory('Water'); setFormDescription('');
        // Refresh list
        const refreshRes = await fetch('/api/admin/charities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (refreshRes.ok) setCharities(await refreshRes.json());
      }
    } catch (error) {
      console.error('Error creating charity:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch('/api/admin/charities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCharities(data);
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const handleDeleteCharity = async (charityId: string) => {
    if (confirm('Are you sure you want to delete this charity?')) {
      try {
        const response = await fetch(`/api/admin/charities/${charityId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          setCharities((prev) => prev.filter((c) => c.id !== charityId));
        }
      } catch (error) {
        console.error('Error deleting charity:', error);
      }
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
              Charity Partners
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-neon transition-all hover:shadow-neon-lg"
          >
            <Plus className="w-4 h-4" />
            Add Charity
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10 space-y-8">
        {showAddForm && (
          <div className="bg-surface-container p-8 rounded-lg border border-primary-container/20">
            <h3 className="font-headline font-extrabold text-lg uppercase mb-6">
              Add New Charity
            </h3>

            <form onSubmit={handleCreateCharity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Name
                  </label>
                  <input type="text" placeholder="Charity name" value={formName} onChange={(e) => setFormName(e.target.value)} required className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary-container outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Emoji Icon
                  </label>
                  <input type="text" placeholder="💧" value={formEmoji} onChange={(e) => setFormEmoji(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary-container outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Category
                </label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary-container outline-none">
                  <option>Water</option>
                  <option>Education</option>
                  <option>Health</option>
                  <option>Reforestation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                  Description
                </label>
                <textarea placeholder="Describe the charity..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary-container outline-none resize-none h-20"></textarea>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={formSubmitting} className="flex-1 bg-primary-container text-on-primary-fixed py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-neon transition-all hover:shadow-neon-lg disabled:opacity-50">
                  {formSubmitting ? 'Creating...' : 'Create Charity'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">Loading charities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <div
                key={charity.id}
                className="bg-surface-container p-6 rounded-lg border-l-4 border-primary-container hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                      {charity.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{charity.name}</h3>
                      <p className="text-[10px] text-primary-container font-bold uppercase tracking-widest">
                        {charity.category}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                  {charity.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                      Total Raised
                    </span>
                    <span className="text-sm font-bold text-primary-container font-mono">
                      ${charity.totalRaised.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                      Status
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        charity.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                      }`}
                    >
                      {charity.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant mb-2">
                      <span>Contribution Goal</span>
                      <span>{charity.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container"
                        style={{ width: `${charity.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface py-2 rounded-full text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCharity(charity.id)}
                    className="flex-1 bg-error/10 hover:bg-error/20 text-error py-2 rounded-full text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
