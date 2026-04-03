import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMPACT GOLF — Play Your Game. Power Their Mission.',
  description:
    'A premium subscription platform combining golf performance tracking, monthly prize draws, and charitable giving. Transform every Stableford point into real-world change.',
  keywords: ['golf', 'charity', 'subscription', 'stableford', 'prize draw', 'impact'],
};

const STATS = [
  { label: 'Active Members', value: '14,200+', icon: 'group' },
  { label: 'Donated to Charity', value: '$1.2M+', icon: 'volunteer_activism' },
  { label: 'Monthly Draws', value: '36', icon: 'emoji_events' },
  { label: 'Charities Supported', value: '24', icon: 'favorite' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Subscribe',
    description: 'Choose a monthly ($29) or yearly ($249) plan. A portion of every subscription goes directly to charity.',
    icon: 'credit_card',
  },
  {
    step: '02',
    title: 'Enter Scores',
    description: 'Submit your last 5 Stableford scores. Only the latest 5 are kept — new scores replace the oldest automatically.',
    icon: 'scoreboard',
  },
  {
    step: '03',
    title: 'Win Prizes',
    description: 'Your 5 scores become your entry into the monthly draw. Match 3, 4, or all 5 winning numbers to win from the prize pool.',
    icon: 'emoji_events',
  },
  {
    step: '04',
    title: 'Fund Change',
    description: 'Select a charity when you sign up. At least 10% of your subscription fee goes to their mission. Increase your % anytime.',
    icon: 'favorite',
  },
];

const PRIZE_TIERS = [
  { match: '5-Number Match', share: '40%', rollover: true, highlight: true },
  { match: '4-Number Match', share: '35%', rollover: false, highlight: false },
  { match: '3-Number Match', share: '25%', rollover: false, highlight: false },
];

const FEATURED_CHARITIES = [
  { name: 'Clean Water Alliance', category: 'Water', icon: 'water_drop', color: 'from-blue-500/20 to-cyan-400/20' },
  { name: 'EduBridge Foundation', category: 'Education', icon: 'school', color: 'from-amber-500/20 to-yellow-400/20' },
  { name: 'Global Health Initiative', category: 'Health', icon: 'health_and_safety', color: 'from-red-500/20 to-pink-400/20' },
  { name: 'Earth Rebalance Project', category: 'Reforestation', icon: 'nature', color: 'from-green-500/20 to-emerald-400/20' },
];

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {/* ───── HEADER ───── */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cafd00]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            <span className="text-2xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center font-headline font-extrabold tracking-tighter uppercase text-sm">
            <a className="text-[#f3ffca] border-b-2 border-[#cafd00] pb-1" href="/">Home</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/draws">Draws</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/charities">Impact</a>
            <a className="text-gray-400 hover:text-white transition-colors" href="/dashboard">Dashboard</a>
          </nav>
          <div className="hidden md:flex gap-3">
            <Link href="/auth/login" className="text-on-surface-variant hover:text-white text-sm font-bold px-5 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all">Log In</Link>
            <Link href="/auth/signup" className="bg-[#cafd00] text-[#0e0e0e] text-sm font-black px-6 py-2 rounded-full hover:shadow-neon transition-all">Subscribe</Link>
          </div>
        </div>
      </header>

      <main>
        {/* ───── HERO ───── */}
        <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10" />
            <Image alt="Golf course aerial view" src="https://images.unsplash.com/photo-1587321528643-9836371dc110?q=80&w=2070" fill className="object-cover opacity-30" sizes="(max-width: 768px) 100vw, 100vw" />
          </div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#cafd00]/5 rounded-full blur-[150px]" />
          <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#cafd00] animate-pulse" />
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Next Draw: 15 Days Away</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9] text-on-surface">
                PLAY YOUR <span className="text-[#f3ffca]">GAME.</span><br />
                POWER THEIR <span className="text-[#cafd00]">MISSION.</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Transform every Stableford point into real-world change. A premium subscription engine connecting the passion of golf with global humanitarian impact.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/auth/signup" className="bg-[#cafd00] text-[#0e0e0e] px-8 py-4 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(202,253,0,0.3)] inline-flex items-center gap-2">
                  Subscribe Now <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/draws" className="border border-white/20 text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:border-white/40 transition-all">
                  View Draws
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:flex flex-col gap-6">
              <div className="bg-[#1a1a1a]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl space-y-6">
                <div>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Live Prize Pool</p>
                  <h2 className="text-5xl font-headline font-black text-[#cafd00] tracking-tighter mt-1">$458,290</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {PRIZE_TIERS.map((tier) => (
                    <div key={tier.match} className={`p-3 rounded-lg text-center ${tier.highlight ? 'bg-[#cafd00]/10 border border-[#cafd00]/20' : 'bg-white/5'}`}>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{tier.match.replace(' Match', '')}</p>
                      <p className={`text-xl font-black mt-1 ${tier.highlight ? 'text-[#cafd00]' : 'text-on-surface'}`}>{tier.share}</p>
                      {tier.rollover && <p className="text-[8px] text-[#cafd00] font-bold mt-1">JACKPOT ROLLOVER</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── STATS COUNTER ───── */}
        <section className="border-y border-white/5 bg-[#0e0e0e]">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center group">
                <span className="material-symbols-outlined text-[#cafd00] text-3xl mb-3 block group-hover:scale-110 transition-transform">{stat.icon}</span>
                <h3 className="text-3xl md:text-4xl font-headline font-black text-on-surface tracking-tighter">{stat.value}</h3>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── HOW IT WORKS ───── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-[#cafd00]/10 text-[#cafd00] text-xs font-black tracking-widest uppercase rounded-full border border-[#cafd00]/20 mb-4">The Process</span>
              <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter">
                HOW IT <span className="text-[#cafd00]">WORKS</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="group relative bg-[#131313] rounded-2xl p-8 border border-white/5 hover:border-[#cafd00]/30 transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cafd00] to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  <span className="text-5xl font-headline font-black text-white/5 block mb-4">{item.step}</span>
                  <div className="w-12 h-12 rounded-lg bg-[#cafd00]/10 flex items-center justify-center mb-4 group-hover:bg-[#cafd00]/20 transition-colors">
                    <span className="material-symbols-outlined text-[#cafd00]">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight mb-3 group-hover:text-[#cafd00] transition-colors">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── DRAW MECHANICS ───── */}
        <section className="py-24 px-6 bg-[#0e0e0e] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-[#cafd00]/10 text-[#cafd00] text-xs font-black tracking-widest uppercase rounded-full border border-[#cafd00]/20 mb-4">Monthly Draw Engine</span>
              <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter">
                THE <span className="text-[#cafd00]">PRIZE POOL</span>
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto mt-4">A fixed portion of each subscription contributes to the prize pool, distributed across three match tiers automatically.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRIZE_TIERS.map((tier) => (
                <div key={tier.match} className={`relative rounded-2xl p-8 border text-center ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-[#cafd00]/10 to-transparent border-[#cafd00]/30 shadow-[0_0_40px_rgba(202,253,0,0.1)]'
                    : 'bg-[#131313] border-white/5'
                }`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#cafd00] text-[#0e0e0e] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Jackpot</span>
                  )}
                  <h3 className="text-lg font-headline font-black uppercase tracking-tight mt-4 mb-2">{tier.match}</h3>
                  <p className={`text-6xl font-headline font-black tracking-tighter ${tier.highlight ? 'text-[#cafd00]' : 'text-on-surface'}`}>{tier.share}</p>
                  <p className="text-xs text-on-surface-variant mt-2 uppercase font-bold tracking-widest">of prize pool</p>
                  {tier.rollover && (
                    <p className="mt-4 text-xs text-[#cafd00] font-bold bg-[#cafd00]/10 px-3 py-1 rounded-full inline-block">Rolls over if unclaimed</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── FEATURED CHARITIES ───── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-[#cafd00]/10 text-[#cafd00] text-xs font-black tracking-widest uppercase rounded-full border border-[#cafd00]/20 mb-4">Charity Partners</span>
              <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter">
                DRIVING <span className="text-[#cafd00]">IMPACT</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_CHARITIES.map((charity) => (
                <div key={charity.name} className="group bg-[#131313] rounded-2xl p-6 border border-white/5 hover:border-[#cafd00]/30 hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${charity.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[#cafd00] text-2xl">{charity.icon}</span>
                  </div>
                  <span className="text-[10px] text-[#cafd00] font-black uppercase tracking-widest">{charity.category}</span>
                  <h3 className="text-lg font-headline font-black tracking-tight mt-1 mb-2 group-hover:text-[#cafd00] transition-colors">{charity.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Supporting communities through impactful programs worldwide.</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/charities" className="inline-flex items-center gap-2 text-[#cafd00] font-bold hover:gap-3 transition-all">
                View All Charities <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ───── CTA SECTION ───── */}
        <section className="py-24 px-6 bg-gradient-to-b from-[#0e0e0e] to-[#131313] border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter mb-6">
              READY TO MAKE AN <span className="text-[#cafd00]">IMPACT?</span>
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of golfers who are transforming their passion into positive change. Subscribe today and enter the next monthly draw.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?plan=monthly" className="bg-white/5 border border-white/10 px-8 py-4 rounded-full font-bold hover:border-white/30 transition-all">
                Monthly — $29
              </Link>
              <Link href="/auth/signup?plan=yearly" className="bg-[#cafd00] text-[#0e0e0e] px-8 py-4 rounded-full font-black hover:scale-105 transition-all shadow-neon relative">
                <span className="absolute -top-3 right-4 bg-[#0e0e0e] text-[#cafd00] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#cafd00]/30">SAVE $99</span>
                Yearly — $249
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#cafd00]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              <span className="text-xl font-black text-[#cafd00] tracking-tighter uppercase font-headline">IMPACT GOLF</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Combining the love of golf with global humanitarian impact through subscription-based charitable giving and prize draws.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-widest text-on-surface mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/draws" className="hover:text-[#cafd00] transition-colors">Monthly Draws</Link></li>
              <li><Link href="/charities" className="hover:text-[#cafd00] transition-colors">Charities</Link></li>
              <li><Link href="/auth/signup" className="hover:text-[#cafd00] transition-colors">Subscribe</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-widest text-on-surface mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/auth/login" className="hover:text-[#cafd00] transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#cafd00] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-widest text-on-surface mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><span className="hover:text-[#cafd00] transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-[#cafd00] transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-6 text-center text-xs text-on-surface-variant">
          © 2026 IMPACT GOLF. All rights reserved. Powered by passion. Driven by purpose.
        </div>
      </footer>

      {/* ───── MOBILE NAV ───── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-end pb-4 px-2 bg-[#0e0e0e]/90 backdrop-blur-2xl rounded-t-[2rem] z-50 border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex flex-col items-center justify-center bg-[#cafd00] text-[#0e0e0e] rounded-full p-3 mb-2 scale-110 shadow-[0_0_15px_#cafd00]">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </Link>
        <Link href="/draws" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Draws</span>
        </Link>
        <Link href="/charities" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Impact</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:text-[#f3ffca]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}