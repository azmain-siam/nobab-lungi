'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { ArrowRight, Lock, Mail } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const oauthErrorMsg =
    errorParam === 'OAuthSignin' || errorParam === 'OAuthCallback'
      ? 'Failed to sign in with Google. Please try again.'
      : errorParam === 'OAuthAccountNotLinked'
      ? 'To confirm your identity, sign in with the same account you used originally.'
      : errorParam
      ? 'Authentication error. Please try again.'
      : null;

  const displayError = errorMsg || oauthErrorMsg;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setErrorMsg('Invalid email or password.');
      } else {
        toast.success('Signed in successfully.');
        const session = await getSession();
        const role = (session?.user as { role?: string })?.role;

        router.refresh();

        if (nextParam) {
          router.push(nextParam);
        } else if (role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/account');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setErrorMsg('');
    try {
      await signIn('google', {
        callbackUrl: nextParam || '/account',
      });
    } catch {
      setErrorMsg('Failed to initialize Google Sign-In.');
      setIsGoogleSubmitting(false);
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

      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
          {displayError}
        </div>
      )}

      {/* Continue with Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full bg-[#fbf9f8] hover:bg-[#f5f3f3] border border-[#e3e2e2] text-[#1b1c1c] text-xs font-semibold py-3 px-4 flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        {isGoogleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#e3e2e2] w-full" />
        <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#5e5e5b] absolute">
          OR EMAIL SIGN IN
        </span>
      </div>

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
          disabled={isSubmitting || isGoogleSubmitting}
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
