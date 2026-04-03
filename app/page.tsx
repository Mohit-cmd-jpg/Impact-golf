'use client';

import Link from 'next/link';
import { ArrowRight, Trophy, Wind, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const charities = [
    { id: 1, name: 'Water for All', category: 'Water', img: '💧' },
    { id: 2, name: 'Education First', category: 'Education', img: '📚' },
    { id: 3, name: 'Health Initiative', category: 'Health', img: '🏥' },
    { id: 4, name: 'Green Earth', category: 'Reforestation', img: '🌱' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Choose your plan and select your favorite charity',
      icon: <Users className="w-8 h-8" />,
    },
    {
      number: '02',
      title: 'Track Scores',
      description: 'Enter your golf scores and build your 5-score profile',
      icon: <Zap className="w-8 h-8" />,
    },
    {
      number: '03',
      title: 'Win & Contribute',
      description: 'Participate in monthly draws and help your chosen charity',
      icon: <Trophy className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-bg backdrop-blur-xl border-b border-outline-variant">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
              <span className="text-on-primary-fixed font-bold text-lg">⛳</span>
            </div>
            <h1 className="font-headline text-2xl font-bold tracking-tight">IMPACT GOLF</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-on-surface-variant hover:text-on-surface transition">
              How It Works
            </a>
            <a href="#charities" className="text-on-surface-variant hover:text-on-surface transition">
              Charities
            </a>
            <a href="#pricing" className="text-on-surface-variant hover:text-on-surface transition">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-on-surface hover:text-primary-container transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary-container text-on-primary-fixed px-6 py-2 rounded-full font-semibold hover:shadow-neon transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-surface-container rounded-full border border-primary-container/30">
            <span className="text-primary-container font-semibold">🏆 Join 1,000+ Golfers</span>
          </div>

          <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            ELEGANCE IN<br />
            <span className="bg-impact-gradient bg-clip-text text-transparent">GIVING</span>
          </h2>

          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-12">
            Play golf. Track your scores. Win prizes monthly. Help charities you love. Every subscription fuels impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/signup"
              className="bg-primary-container text-on-primary-fixed px-8 py-4 rounded-full font-headline font-bold text-lg hover:shadow-neon-lg transition flex items-center justify-center gap-2"
            >
              START YOUR IMPACT <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-primary-container text-primary-container px-8 py-4 rounded-full font-semibold hover:bg-surface-container transition"
            >
              Learn More
            </a>
          </div>

          {/* Prize Pool Counter */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-[#262626]/60 backdrop-blur-xl p-4 rounded-xl border border-primary-container/20">
              <div className="text-2xl font-bold font-headline text-primary-container [text-shadow:0_0_15px_#cafd00]">$45K</div>
              <div className="text-xs text-on-surface-variant">Prize Pool</div>
            </div>
            <div className="bg-[#262626]/60 backdrop-blur-xl p-4 rounded-xl border border-primary-container/20">
              <div className="text-2xl font-bold font-headline text-primary-container [text-shadow:0_0_15px_#cafd00]">12</div>
              <div className="text-xs text-on-surface-variant">Draws/Year</div>
            </div>
            <div className="bg-[#262626]/60 backdrop-blur-xl p-4 rounded-xl border border-primary-container/20">
              <div className="text-2xl font-bold font-headline text-primary-container [text-shadow:0_0_15px_#cafd00]">20%</div>
              <div className="text-xs text-on-surface-variant">To Charities</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-headline text-4xl font-black mb-4">HOW IT WORKS</h3>
            <p className="text-on-surface-variant text-lg">
              Join thousands of golfers making a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-[#262626]/60 backdrop-blur-xl p-8 rounded-xl border border-outline-variant hover:border-primary-container transition group"
              >
                <div className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/5 rounded-xl transition-colors pointer-events-none"></div>
                <div className="text-6xl font-black text-primary-container/20 mb-4 [text-shadow:0_0_15px_#cafd00]">
                  {step.number}
                </div>
                <div className="text-primary-container mb-4">{step.icon}</div>
                <h4 className="font-headline text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-on-surface-variant z-10 relative">{step.description}</p>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-container/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-headline text-4xl font-black mb-4">FEATURED CHARITY</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 h-96 rounded-xl flex items-center justify-center text-8xl">
              💧
            </div>
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-surface-container rounded-full">
                <span className="text-primary-container font-semibold text-sm">WATER</span>
              </div>
              <h4 className="font-headline text-4xl font-bold mb-4">Water For All</h4>
              <p className="text-on-surface-variant text-lg mb-6 leading-relaxed">
                Providing clean drinking water and sanitation to underserved communities across Africa. With every subscription, you help build wells and water purification systems that transform lives.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-3xl font-bold text-primary-container">50K+</div>
                  <div className="text-sm text-on-surface-variant">People Helped</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-container">120</div>
                  <div className="text-sm text-on-surface-variant">Wells Built</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-container">$2.3M</div>
                  <div className="text-sm text-on-surface-variant">Raised</div>
                </div>
              </div>

              <button className="bg-primary-container text-on-primary-fixed px-6 py-3 rounded-full font-semibold hover:shadow-neon transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Charities Scroll */}
      <section id="charities" className="py-20 px-4 bg-surface-container-low">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <h3 className="font-headline text-4xl font-black mb-12 text-center [text-shadow:0_0_15px_#cafd00] text-primary-container">OUR IMPACT PARTNERS</h3>

          <div className="relative w-full overflow-hidden flex">
            <div className="animate-marquee flex gap-6 pb-4 whitespace-nowrap w-max">
              {[...charities, ...charities, ...charities].map((charity, index) => (
                <div
                  key={`${charity.id}-${index}`}
                  className="flex-shrink-0 w-72 bg-[#262626]/60 backdrop-blur-xl p-6 rounded-xl border border-outline-variant hover:border-primary-container transition hover:shadow-neon cursor-pointer"
                >
                <div className="w-20 h-20 rounded-lg bg-surface-container-high flex items-center justify-center text-4xl mb-4">
                  {charity.img}
                </div>
                <div className="inline-block mb-3 px-2 py-1 bg-surface-container-high rounded text-xs text-on-surface-variant">
                  {charity.category}
                </div>
                <h5 className="font-headline font-bold text-lg mb-2">{charity.name}</h5>
                <p className="text-on-surface-variant text-sm">
                  Making a difference in {charity.category.toLowerCase()} globally.
                </p>
              </div>
            ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/charities"
              className="text-primary-container font-semibold hover:text-primary transition inline-flex items-center gap-2"
            >
              View All Charities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-headline text-4xl font-black mb-4">SIMPLE PRICING</h3>
            <p className="text-on-surface-variant text-lg">Choose the plan that fits your commitment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly */}
            <div className="bg-surface-container p-8 rounded-xl border border-outline-variant">
              <h4 className="font-headline text-2xl font-bold mb-2">Monthly</h4>
              <p className="text-on-surface-variant mb-6">Perfect for trying it out</p>

              <div className="mb-8">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-on-surface-variant">/month</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Monthly draw entries</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Prize pool access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Charity selection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Score tracking</span>
                </div>
              </div>

              <Link
                href="/signup?plan=monthly"
                className="w-full block text-center bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-semibold hover:bg-surface-container-highest transition"
              >
                Get Started
              </Link>
            </div>

            {/* Yearly */}
            <div className="bg-surface-container p-8 rounded-xl border-2 border-primary-container relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>

              <h4 className="font-headline text-2xl font-bold mb-2">Yearly</h4>
              <p className="text-on-surface-variant mb-6">Commitment saves you $99</p>

              <div className="mb-8">
                <span className="text-5xl font-bold">$249</span>
                <span className="text-on-surface-variant">/year</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>All monthly features</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>12 draws per year</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Premium winner badge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="text-on-primary-fixed text-sm">✓</span>
                  </div>
                  <span>Exclusive monthly newsletter</span>
                </div>
              </div>

              <Link
                href="/signup?plan=yearly"
                className="w-full block text-center bg-primary-container text-on-primary-fixed px-6 py-3 rounded-full font-semibold hover:shadow-neon-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
                  <span className="text-on-primary-fixed text-sm font-bold">⛳</span>
                </div>
                <h5 className="font-headline font-bold">IMPACT GOLF</h5>
              </div>
              <p className="text-on-surface-variant text-sm">Elegance in Giving</p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Platform</h6>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <a href="#" className="hover:text-on-surface transition block">
                  How It Works
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Pricing
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Charities
                </a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Company</h6>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <a href="#" className="hover:text-on-surface transition block">
                  About
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Blog
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <a href="#" className="hover:text-on-surface transition block">
                  Privacy
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Terms
                </a>
                <a href="#" className="hover:text-on-surface transition block">
                  Cookies
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-on-surface-variant text-sm">
              © 2024 IMPACT GOLF. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-on-surface-variant hover:text-on-surface transition">
                Twitter
              </a>
              <a href="#" className="text-on-surface-variant hover:text-on-surface transition">
                Instagram
              </a>
              <a href="#" className="text-on-surface-variant hover:text-on-surface transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
