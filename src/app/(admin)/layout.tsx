import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/user-service';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

/**
 * Admin Layout — Server Component.
 *
 * Middleware already guards /dashboard/** routes, but we re-validate
 * the admin role here as a defence-in-depth measure.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/dashboard');

  const profile = await getUserProfile(user.id);

  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <p className="text-sm text-gray-500">
            Signed in as{' '}
            <span className="font-medium text-gray-900">
              {profile.name ?? user.email}
            </span>
          </p>
          <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">
            Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
