'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { AccountSidebar } from '@/components/shared/account-sidebar';
import { updateProfileAction, updatePasswordAction } from '@/features/auth/actions/profile-actions';
import { useUser } from '@/features/auth/hooks/use-user';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function ProfileForm() {
  const { user, profile } = useUser();
  const [fullName, setFullName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentName = fullName ?? profile?.name ?? user?.user_metadata?.full_name ?? '';
  const currentPhone = phone ?? profile?.phone ?? '';
  const currentEmail = user?.email || profile?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSaved(false);
    setErrorMsg('');

    try {
      const profileRes = await updateProfileAction(currentName, currentPhone);
      if (profileRes.error) {
        setErrorMsg(profileRes.error);
        return;
      }

      if (password) {
        const passRes = await updatePasswordAction(password);
        if (passRes.error) {
          setErrorMsg(passRes.error);
          return;
        }
      }

      setIsSaved(true);
      setPassword('');
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setErrorMsg('An error occurred while updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
      <div className="border-b border-[#e3e2e2] pb-4">
        <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
          Profile Information
        </h2>
        <p className="text-xs font-light text-[#5e5e5b] mt-1">
          Update your account profile details and login preferences.
        </p>
      </div>

      {isSaved && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="h-4 w-4 stroke-[2]" />
          Profile settings saved successfully!
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          <AlertCircle className="h-4 w-4 stroke-[2]" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1b1c1c]">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={currentName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1b1c1c]">
              Phone Number
            </label>
            <input
              type="tel"
              value={currentPhone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#1b1c1c]">
            Email Address *
          </label>
          <input
            type="email"
            required
            disabled
            value={currentEmail}
            className="w-full bg-[#f5f3f3] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#5e5e5b] rounded-none cursor-not-allowed"
          />
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold text-[#1b1c1c]">
            New Password (Leave blank to keep unchanged)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Section variant="default" className="py-12 lg:py-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl mb-8">
          My Account
        </h1>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <AccountSidebar />
          <ProfileForm />
        </div>
      </Container>
    </Section>
  );
}
