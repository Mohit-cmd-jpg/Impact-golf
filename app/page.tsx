export default function Page() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f3ffca]" style={{fontVariationSettings: "'FILL' 1"}}>water_drop</span>
            <span className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase">IMPACT GOLF</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center font-['Manrope'] font-extrabold tracking-tighter uppercase">
            <a className="text-[#f3ffca] border-b-2 border-[#cafd00] pb-1" href="/">Home</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/draws">Draws</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/charities">Impact</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/dashboard">Wallet</a>
          </nav>
        </div>
      </header>
      <main className="pt-24">
        <section className="relative min-h-[795px] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10"></div>
            <img alt="Hero Background" className="w-full h-full object-cover opacity-40" src="https://images.unsplash.com/photo-1587321528643-9836371dc110?q=80&w=2070" />
          </div>
          <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9] text-on-surface">
                 PLAY YOUR <span className="text-primary-container">GAME.</span><br/>
                 POWER THEIR <span className="text-primary">MISSION.</span>
              </h1>
              <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
                 Transform every Stableford point into real-world change. A premium subscription engine connecting the passion of golf with global humanitarian impact.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                  <button className="bg-primary-container text-on-primary-fixed px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(202,253,0,0.3)]">Subscribe Now</button>
              </div>
            </div>
            <div className="relative hidden lg:block flex-col gap-6">
              <div className="bg-[#262626]/60 backdrop-blur-xl p-8 rounded-xl border border-white/5 shadow-2xl space-y-6">
                <div>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Live Prize Pool</p>
                  <h2 className="text-5xl font-headline font-black text-primary-container tracking-tighter mt-1">$458,290.00</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pb-4 px-2 bg-[#0e0e0e]/80 backdrop-blur-2xl rounded-t-[2rem] z-50 border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center justify-center bg-[#cafd00] text-[#0e0e0e] rounded-full p-3 mb-2 scale-110 shadow-[0_0_15px_#cafd00]">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest mt-1">Draws</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </div>
  );
}