'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />

        <main className="py-16 lg:py-24">
          <Container>
            <div className="mx-auto max-w-md bg-white border border-[#e3e2e2] p-8 sm:p-10 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
                  PASSWORD RECOVERY
                </span>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
                  Reset Your Password
                </h1>
                <p className="text-xs font-light text-[#5e5e5b]">
                  Enter the email address associated with your account and we&apos;ll send you a password reset link.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center space-y-4 pt-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6 stroke-[2]" />
                  </div>
                  <p className="text-xs text-[#1b1c1c] font-medium">
                    Reset link sent to <strong>{email}</strong>! Please check your inbox.
                  </p>
                  <Button href="/login" variant="secondary" size="md" className="w-full">
                    Return to Sign In
                  </Button>
                </div>
              ) : (
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

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-3.5 mt-2"
                  >
                    Send Reset Link
                  </Button>
                </form>
              )}

              <div className="border-t border-[#e3e2e2] pt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </Container>
        </main>
      </div>

      <Footer />
    </div>
  );
}
