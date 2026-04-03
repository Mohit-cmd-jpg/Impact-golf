'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store session token
      localStorage.setItem('authToken', data.data.session.access_token);
      // Set cookie for middleware to read
      document.cookie = `auth-token=${data.data.session.access_token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push('/dashboard');
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
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md">
        <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant">
          <h2 className="font-headline text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-on-surface-variant mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              className="w-full bg-primary-container text-on-primary-fixed py-3 rounded-lg font-semibold hover:shadow-neon transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface-variant">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-container font-semibold hover:text-primary transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
