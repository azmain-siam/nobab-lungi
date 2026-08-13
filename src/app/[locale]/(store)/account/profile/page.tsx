'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfileAction, updatePasswordAction } from '@/features/auth/actions/profile-actions';
import { useUser } from '@/features/auth/hooks/use-user';
import { useToast } from '@/providers/toast-provider';
import { User, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSettingsPage() {
  const toast = useToast();
  const { user, profile, loading } = useUser();

  const [fullNameInput, setFullNameInput] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fullName = fullNameInput ?? profile?.name ?? user?.user_metadata?.full_name ?? '';
  const phone = phoneInput ?? profile?.phone ?? '';

  const isGoogleUser = user?.id?.includes('google') || (profile as unknown as { provider?: string })?.provider === 'google';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!fullName.trim()) {
        setErrorMsg('Full Name is required.');
        setIsSubmitting(false);
        return;
      }

      // Profile info update
      const profileRes = await updateProfileAction(fullName, phone);
      if (profileRes.error) {
        setErrorMsg(profileRes.error);
        toast.error(profileRes.error);
        setIsSubmitting(false);
        return;
      }

      // Password update (if entered and not Google user)
      if (!isGoogleUser && newPassword) {
        if (newPassword.length < 6) {
          setErrorMsg('New password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setErrorMsg('New password and confirm password do not match.');
          setIsSubmitting(false);
          return;
        }

        const passRes = await updatePasswordAction(newPassword);
        if (passRes.error) {
          setErrorMsg(passRes.error);
          toast.error(passRes.error);
          setIsSubmitting(false);
          return;
        }
      }

      setSuccessMsg('Profile settings updated successfully!');
      toast.success('Profile settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrorMsg('An unexpected error occurred while updating profile.');
      toast.error('An unexpected error occurred while updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-8">
      <div className="border-b border-[#e3e2e2] pb-4">
        <h1 className="font-display text-lg sm:text-xl font-semibold text-[#1b1c1c]">
          Profile Settings
        </h1>
        <p className="text-xs font-light text-[#5e5e5b] mt-1">
          Manage your personal details, contact preferences, and account security.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="h-4 w-4 stroke-[2] shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          <AlertCircle className="h-4 w-4 stroke-[2] shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 py-4 animate-pulse">
          <div className="h-5 bg-[#f5f3f3] w-1/3" />
          <div className="h-10 bg-[#fbf9f8] border border-[#e3e2e2]" />
          <div className="h-10 bg-[#fbf9f8] border border-[#e3e2e2]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-2 border-b border-[#e3e2e2] pb-2">
              <User className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="e.g. Siam Ahmed"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#f5f3f3] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#5e5e5b] rounded-none cursor-not-allowed"
              />
              <p className="text-[11px] text-[#5e5e5b] font-light">
                Email address is linked to your primary login account.
              </p>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-2 border-b border-[#e3e2e2] pb-2">
              <Shield className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Account Security
            </h2>

            {isGoogleUser ? (
              <div className="p-4 bg-[#fbf9f8] border border-[#e3e2e2] text-xs text-[#5e5e5b] space-y-1">
                <div className="font-semibold text-[#1b1c1c] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                  Signed in via Google Authentication
                </div>
                <p>Your account password and security settings are managed securely via your Google Account.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#e3e2e2]">
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
