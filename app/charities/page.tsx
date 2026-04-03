
export default function CharitiesPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 lg:pt-20">
      <div className="bg-[#0e0e0e] text-center py-24 lg:py-36 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface mb-6 font-headline relative z-10">GLOBAL <span className="text-[#cafd00]">DIRECTORY</span></h1>
        <p className="text-on-surface-variant text-sm font-bold tracking-[0.2em] max-w-xl mx-auto uppercase relative z-10 px-4">Discover the incredible organizations we support worldwide through your participation.</p>
        <div className="mt-12 w-full max-w-2xl px-6 relative z-10">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input className="w-full bg-surface-container-high border-2 border-white/5 rounded-full pl-12 pr-6 py-4 text-sm focus:border-[#cafd00] focus:ring-0 text-on-surface transition-colors placeholder:text-on-surface-variant/50" placeholder="Search by name, cause, or region..." type="text" />
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        {/* Placeholder for organization grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface-container-low rounded-2xl p-8 border border-white/5 relative overflow-hidden group hover:-translate-y-2 hover:border-[#cafd00]/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(202,253,0,0.05)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cafd00] to-green-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-xl bg-surface-container-highest mb-8 flex items-center justify-center border border-white/10 group-hover:border-[#cafd00]/50 transition-colors">
              <span className="material-symbols-outlined text-[#cafd00] text-3xl">nature</span>
            </div>
            <span className="inline-block px-3 py-1 bg-[#cafd00]/10 text-[#cafd00] text-[10px] font-black tracking-widest uppercase mb-4 rounded border border-[#cafd00]/20">ENVIRONMENT</span>
            <h2 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight mb-4 group-hover:text-[#cafd00] transition-colors">Earth Rebalance Initiative</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">Focusing on massive reforestation projects and ocean cleanups globally. Every ticket sold plants 5 trees in critical areas.</p>
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Global Reach</span>
              <span className="material-symbols-outlined text-surface-container-highest group-hover:text-[#cafd00] transition-colors group-hover:translate-x-1">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
