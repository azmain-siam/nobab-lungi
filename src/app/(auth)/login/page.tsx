'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/actions/auth';
import { useToast } from '@/providers/toast-provider';
import { ArrowRight, Lock, Mail } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        toast.success('Signed in successfully.');
        if (nextParam) {
          router.push(nextParam);
        } else if (res.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/account');
        }
        router.refresh();
      } else {
        setErrorMsg(res.error ?? 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md bg-white border border-[#e3e2e2] p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
          WELCOME BACK
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
          Sign In to Your Account
        </h1>
        <p className="text-xs font-light text-[#5e5e5b]">
          Enter your email and password to access your orders and profile.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#1b1c1c]">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1b1c1c]">
              Password *
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#5e5e5b] hover:text-[#1b1c1c] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full py-3.5 gap-2 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="border-t border-[#e3e2e2] pt-6 text-center text-xs text-[#5e5e5b]">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#1b1c1c] hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <Suspense fallback={<div className="text-center text-xs text-[#5e5e5b]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </Container>
    </div>
  );
}
