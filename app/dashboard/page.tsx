
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 lg:pt-20">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 h-fit flex flex-col gap-6 sticky top-24">
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#cafd00]/30 transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#cafd00] to-green-500 mb-6 p-0.5 shadow-[0 0 20px rgba(202,253,0,0.3)] group-hover:shadow-[0 0 40px rgba(202,253,0,0.5)] transition-shadow">
              <div className="w-full h-full rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-[#0e0e0e]">
                <img alt="User Avatar" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQEpmTOWv7jbp0qWq1JrYmIMlG-3yS8mZ0sJuIoPr9y-vTmwSfwUs8uuloPVMsKbR4poRIKt7R7Ksc1HVcJOCUiXVH7rFzTN1Py0guI3OJSkxuyI7kNydErvAJDcKOx54CR_c0YVjNmVHynle7c8qg9Nf1pOVt_bt7_3A3MI_GO3olHfOKy_zxXn41JpD85bIdt5hNiJC8lm72iV7DRXOiInQ4arnnE4R7Dq9EulK5By9srw0QkDw2p3j5SjCMmtSBFpHgq_5K3r8" />
              </div>
            </div>
            <h2 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight mb-1">Alex Mercer</h2>
            <p className="text-xs text-on-surface-variant font-bold tracking-[0.2em] mb-8">FOUNDING MEMBER</p>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-4 px-4 py-3 rounded-md bg-[#cafd00]/10 text-[#cafd00] font-headline font-bold text-sm tracking-widest border border-[#cafd00]/20" href="#">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span> OVERVIEW
              </a>
              <a className="flex items-center gap-4 px-4 py-3 rounded-md text-on-surface hover:bg-white/5 font-headline font-bold text-sm tracking-widest transition-colors" href="#">
                <span className="material-symbols-outlined shrink-0" style={{fontVariationSettings: "'FILL' 0"}}>history</span> TICKET HISTORY
              </a>
              <a className="flex items-center gap-4 px-4 py-3 rounded-md text-on-surface hover:bg-white/5 font-headline font-bold text-sm tracking-widest transition-colors" href="#">
                <span className="material-symbols-outlined shrink-0" style={{fontVariationSettings: "'FILL' 0"}}>settings</span> SETTINGS
              </a>
              <button className="flex items-center gap-4 px-4 py-3 mt-6 rounded-md text-error-dim hover:text-error hover:bg-error-container/10 font-headline font-bold text-sm tracking-widest transition-colors w-full text-left">
                <span className="material-symbols-outlined shrink-0">logout</span> LOGOUT
              </button>
            </nav>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cafd00]/10 rounded-full blur-3xl -z-10 group-hover:bg-[#cafd00]/20 transition-all duration-700" />
          </div>
        </aside>
        
        <main className="lg:col-span-9 flex flex-col gap-10">
          <div className="bg-surface-container-high rounded-2xl p-8 lg:p-12 border border-white/10 relative overflow-hidden flex flex-col justify-end min-h-[300px] border-l-4 border-l-[#cafd00]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/90 to-transparent z-10" />
            <img alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale mix-blend-overlay" src="https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1742&q=80" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
            <div className="relative z-20 max-w-xl">
              <span className="inline-block px-3 py-1 bg-surface-container-highest text-primary-fixed text-[10px] font-black tracking-widest uppercase mb-4 rounded border border-white/10">Next Draw: MAY 15</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold font-headline uppercase tracking-tighter text-on-surface mb-4 leading-none hidden lg:block">READY FOR<br/><span className="text-[#cafd00]">IMPACT.</span></h1>
              <p className="text-on-surface-variant text-sm max-w-md font-medium leading-relaxed mb-8">You have 3 active tickets for the upcoming Major Draw. Support global charities while standing a chance to win exclusive golf experiences.</p>
              <button className="bg-[#cafd00] hover:bg-[#d6ff33] text-surface-dim px-8 py-3 rounded text-sm font-black font-headline tracking-widest transition-colors uppercase flex items-center w-max">
                Get More Tickets <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
