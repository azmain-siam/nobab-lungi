'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { registerAction } from '@/actions/auth';
import { useToast } from '@/providers/toast-provider';
import { ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await registerAction({
        email,
        password,
        fullName,
        phone,
      });

      if (res.success) {
        toast.success('Account created successfully!');
        // Automatically sign in to create NextAuth session
        const loginRes = await signIn('credentials', {
          redirect: false,
          email: email.trim().toLowerCase(),
          password,
        });

        if (loginRes?.error) {
          router.push('/login');
        } else {
          router.refresh();
          if (res.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/account');
          }
        }
      } else {
        setErrorMsg(res.error ?? 'Failed to register account.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-md bg-white border border-[#e3e2e2] p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
              JOIN NABAB LUNGI
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
              Create Your Account
            </h1>
            <p className="text-xs font-light text-[#5e5e5b]">
              Register to enjoy faster checkout, order tracking, and exclusive collection drops.
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
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>
            </div>

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
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="border-t border-[#e3e2e2] pt-6 text-center text-xs text-[#5e5e5b]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#1b1c1c] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
