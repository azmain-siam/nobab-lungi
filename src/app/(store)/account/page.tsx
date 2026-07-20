import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/user-service';
import { EditProfileForm } from '@/features/auth/components/edit-profile-form';

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
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>

      {/* Account navigation */}
      <nav aria-label="Account sections" className="mb-8 flex gap-4 border-b border-gray-200">
        {[
          { label: 'Profile', href: '/account' },
          { label: 'Orders', href: '/account/orders' },
          { label: 'Wishlist', href: '/account/wishlist' },
          { label: 'Addresses', href: '/account/addresses' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
              item.href === '/account'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Read-only email */}
        <div className="mb-6 space-y-1">
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
