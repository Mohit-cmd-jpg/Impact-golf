'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams as useSearchParamsHook } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, ChevronRight } from 'lucide-react';

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParamsHook();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Identity
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Plan
  const [plan, setPlan] = useState<'monthly' | 'yearly' | null>(searchParams.get('plan') as any || 'monthly');

  // Step 3: Charity
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [charityContribution, setCharityContribution] = useState(10);

  // Load charities on mount
  useEffect(() => {
    const loadCharities = async () => {
      try {
        const response = await fetch('/api/charities');
        const data = await response.json();
        setCharities(data.data || []);
      } catch (err) {
        console.error('Failed to load charities:', err);
      }
    };

    loadCharities();
  }, []);

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      if (data.data?.session?.access_token) {
        localStorage.setItem('authToken', data.data.session.access_token);
      }

      setStep(2);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepTwo = () => {
    if (!plan) {
      setError('Please select a plan');
      return;
    }
    setStep(3);
  };

  const handleStepThree = () => {
    if (!selectedCharity) {
      setError('Please select a charity');
      return;
    }
    setStep(4);
  };

  const handleFinalize = async () => {
    setLoading(true);
    setError('');

    try {
      // Finalize registration
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify({
          plan,
          charityId: selectedCharity,
          charityContributionPercent: charityContribution,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Finalization failed');
        return;
      }

      if (data.data.sessionUrl) {
        window.location.href = data.data.sessionUrl;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
            <span className="text-on-primary-fixed font-bold text-xl">⛳</span>
          </div>
          <h1 className="font-headline text-3xl font-bold">IMPACT GOLF</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  s <= step
                    ? 'bg-primary-container text-on-primary-fixed'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {s}
              </div>
              {s < 4 && <div className="w-8 h-0.5 bg-outline-variant"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md">
        {error && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStepOne} className="bg-surface-container p-8 rounded-2xl border border-outline-variant">
            <h2 className="font-headline text-2xl font-bold mb-2">Create Your Account</h2>
            <p className="text-on-surface-variant mb-8">Step {step} of 4</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary-container transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary-container transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary-container transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Continue'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-on-surface-variant">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-container font-semibold hover:text-primary transition">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant">
            <h2 className="font-headline text-2xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-on-surface-variant mb-8">Step {step} of 4</p>

            <div className="space-y-4">
              <button
                onClick={() => setPlan('monthly')}
                className={`w-full p-6 rounded-xl border-2 transition text-left ${
                  plan === 'monthly'
                    ? 'border-primary-container bg-surface-container-high'
                    : 'border-outline-variant hover:border-primary-container'
                }`}
              >
                <div className="font-headline font-bold text-lg mb-2">Monthly Plan</div>
                <div className="text-on-surface-variant text-sm mb-3">
                  Perfect for trying it out. Cancel anytime.
                </div>
                <div className="text-3xl font-bold">$29 <span className="text-sm text-on-surface-variant">/month</span></div>
              </button>

              <button
                onClick={() => setPlan('yearly')}
                className={`w-full p-6 rounded-xl border-2 transition text-left relative ${
                  plan === 'yearly'
                    ? 'border-primary-container bg-surface-container-high'
                    : 'border-outline-variant hover:border-primary-container'
                }`}
              >
                <div className="absolute top-4 right-4 bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
                <div className="font-headline font-bold text-lg mb-2">Yearly Plan</div>
                <div className="text-on-surface-variant text-sm mb-3">
                  Save $99 per year. Full commitment discount.
                </div>
                <div className="text-3xl font-bold">$249 <span className="text-sm text-on-surface-variant">/year</span></div>
              </button>
            </div>

            <button
              onClick={handleStepTwo}
              disabled={!plan}
              className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant">
            <h2 className="font-headline text-2xl font-bold mb-2">Select Your Charity</h2>
            <p className="text-on-surface-variant mb-8">Step {step} of 4 - You can change this later</p>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-8">
              {charities.slice(0, 4).map((charity) => (
                <button
                  key={charity.id}
                  onClick={() => setSelectedCharity(charity.id)}
                  className={`w-full p-4 rounded-lg border-2 transition text-left ${
                    selectedCharity === charity.id
                      ? 'border-primary-container bg-surface-container-high'
                      : 'border-outline-variant hover:border-primary-container'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🌍</div>
                    <div className="flex-1">
                      <div className="font-semibold">{charity.name}</div>
                      <div className="text-sm text-on-surface-variant">{charity.category}</div>
                    </div>
                    {selectedCharity === charity.id && (
                      <div className="w-6 h-6 bg-primary-container rounded-full flex items-center justify-center">
                        <span className="text-on-primary-fixed text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-surface-container-high p-4 rounded-lg mb-8">
              <label className="text-sm font-semibold flex items-center gap-2 mb-3">Contribution Percentage</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={charityContribution}
                onChange={(e) => setCharityContribution(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-on-surface-variant mt-2">
                {charityContribution}% of your winnings go to your charity
              </div>
            </div>

            <button
              onClick={handleStepThree}
              disabled={!selectedCharity}
              className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant">
            <h2 className="font-headline text-2xl font-bold mb-2">Review & Confirm</h2>
            <p className="text-on-surface-variant mb-8">Step {step} of 4</p>

            <div className="bg-surface-container-high p-6 rounded-lg mb-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Selected Plan:</span>
                <span className="font-semibold capitalize">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Membership Fee:</span>
                <span className="font-semibold">${plan === 'monthly' ? '29' : '249'}</span>
              </div>
              <div className="border-t border-outline-variant pt-4 flex justify-between">
                <span className="font-semibold">Total to Pay:</span>
                <span className="text-xl font-bold text-primary-container">
                  ${plan === 'monthly' ? '29' : '249'}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinalize}
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Activating Account...' : 'Confirm & Start Playing'} <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-on-surface-variant text-xs mt-6">
              By confirming, you agree to our Terms of Service.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-on-surface-variant hover:text-on-surface transition"
            >
              ← Previous
            </button>
          )}
          {step === 1 && (
            <Link href="/" className="text-on-surface-variant hover:text-on-surface transition">
              ← Back to home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
