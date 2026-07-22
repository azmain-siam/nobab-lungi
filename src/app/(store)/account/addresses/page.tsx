import type { Metadata } from 'next';
import { AccountNav } from '@/features/auth/components/account-nav';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = {
  title: 'Saved Addresses',
  description: 'Manage your saved delivery addresses on Nobab Lungi.',
};

/**
 * Saved addresses page — placeholder for Phase 5.
 */
export default function AccountAddressesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your delivery addresses.</p>
      </div>

      <AccountNav />

      <EmptyState
        icon="📍"
        title="No saved addresses"
        description="Addresses you add during checkout will be saved here."
      />
    </div>
  );
}
