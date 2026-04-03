
export default function AdminPage() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-dim">
      <aside className="h-full w-72 border-r border-white/5 bg-[#0e0e0e] flex flex-col py-8 shrink-0">
        <div className="px-8 mb-10 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <img alt="Admin User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQEpmTOWv7jbp0qWq1JrYmIMlG-3yS8mZ0sJuIoPr9y-vTmwSfwUs8uuloPVMsKbR4poRIKt7R7Ksc1HVcJOCUiXVH7rFzTN1Py0guI3OJSkxuyI7kNydErvAJDcKOx54CR_c0YVjNmVHynle7c8qg9Nf1pOVt_bt7_3A3MI_GO3olHfOKy_zxXn41JpD85bIdt5hNiJC8lm72iV7DRXOiInQ4arnnE4R7Dq9EulK5By9srw0QkDw2p3j5SjCMmtSBFpHgq_5K3r8" />
            </div>
            <div>
              <h3 className="font-headline font-black text-[#cafd00] text-sm uppercase tracking-wider">Admin Console</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Impact Manager</p>
            </div>
          </div>
          <nav className="w-full space-y-2">
            <a className="bg-[#cafd00]/10 text-[#cafd00] border-l-4 border-[#cafd00] flex items-center gap-4 px-4 py-3 font-headline font-semibold transition-transform duration-200" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm">Overview</span>
            </a>
            <a className="text-gray-500 hover:bg-white/5 hover:translate-x-2 flex items-center gap-4 px-4 py-3 font-headline font-semibold transition-transform duration-200" href="#">
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm">Users</span>
            </a>
            <a className="text-gray-500 hover:bg-white/5 hover:translate-x-2 flex items-center gap-4 px-4 py-3 font-headline font-semibold transition-transform duration-200" href="#">
              <span className="material-symbols-outlined">casino</span>
              <span className="text-sm">Draws</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto px-8">
          <button className="flex items-center gap-4 text-error-dim font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface-dim hide-scrollbar">
        <header className="sticky top-0 w-full z-40 bg-[#0e0e0e]/60 backdrop-blur-xl shadow-[0 20px 40px rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center px-10 py-6 max-w-full">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</h1>
              <span className="text-[10px] text-on-surface-variant font-bold tracking-[0.2em] uppercase">Executive Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary-container w-64 text-on-surface" placeholder="Quick Search..." type="text" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 bg-surface-container-low p-8 rounded-lg border border-white/5 flex flex-col justify-between group hover:border-primary-container/20 transition-all">
              <div>
                <div className="w-10 h-10 rounded-md bg-primary-container/10 flex items-center justify-center text-primary-container mb-4">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Users</p>
                <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tighter">14,208</h2>
              </div>
            </div>
            {/* Additional cards truncated for brevity, standard admin panel items... */}
          </div>
        </div>
      </main>
    </div>
  );
}
