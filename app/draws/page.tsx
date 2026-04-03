
export default function DrawsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 lg:pt-20">
      <div className="bg-[#0e0e0e] text-center py-20 lg:py-32 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-container/20 via-surface to-surface-dim opacity-40 mix-blend-screen pointer-events-none" />
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface mb-6 font-headline relative z-10">MONTHLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cafd00] to-[#8eb300]">REVEAL</span></h1>
        <p className="text-on-surface-variant text-sm font-bold tracking-[0.2em] max-w-xl mx-auto uppercase relative z-10 px-4">Watch the live draw, check past results, and see the impact we've made together.</p>
        <div className="mt-12 flex gap-4 relative z-10">
          <button className="bg-surface-container-high border border-white/10 px-8 py-3 rounded-full text-on-surface font-headline font-bold text-xs tracking-widest hover:border-primary-container hover:text-primary-container transition-all uppercase">LIVE DRAW</button>
          <button className="bg-[#cafd00] text-surface-dim px-8 py-3 rounded-full font-headline font-black text-xs tracking-widest hover:bg-[#d6ff33] transition-all uppercase shadow-[0 0 20px rgba(202,253,0,0.3)]">PAST RESULTS</button>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 space-y-24">
        {/* Further content structure would continue here based on the original template */}
      </div>
    </div>
  )
}
