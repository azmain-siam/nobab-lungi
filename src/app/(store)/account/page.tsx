import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/user-service';
import { EditProfileForm } from '@/features/auth/components/edit-profile-form';
import { AccountNav } from '@/features/auth/components/account-nav';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Nobab Lungi account profile.',
};

/**
 * Account profile page — Server Component.
 * Middleware already guards this route, but we double-check for safety.
 */
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account');

  const profile = await getUserProfile(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and preferences.
        </p>
      </div>

      <AccountNav />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Read-only email */}
        <div className="mb-6 space-y-1 border-b border-gray-100 pb-6">
          <p className="text-sm font-medium text-gray-700">Email address</p>
          <p className="text-sm text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-400">Email cannot be changed.</p>
        </div>

        <EditProfileForm
          initialName={profile?.name ?? ''}
          initialPhone={profile?.phone ?? ''}
        />
      </div>
    </div>
  );
}
