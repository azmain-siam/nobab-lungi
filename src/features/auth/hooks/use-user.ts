'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { Profile } from '@/types';

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  user_metadata?: { full_name?: string };
}

interface SessionUserShape {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: 'admin' | 'customer';
  image?: string | null;
}

interface UseUserReturn {
  user: CustomUser | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  const sessionUser = session?.user as SessionUserShape | undefined;

  const user: CustomUser | null = sessionUser
    ? {
        id: sessionUser.id || sessionUser.email || 'user',
        name: sessionUser.name,
        email: sessionUser.email,
        user_metadata: { full_name: sessionUser.name ?? undefined },
      }
    : null;

  const profile: Profile | null = sessionUser
    ? {
        id: sessionUser.id || sessionUser.email || 'user',
        name: sessionUser.name ?? null,
        email: sessionUser.email ?? null,
        phone: null,
        role: sessionUser.role || 'customer',
        avatar_url: sessionUser.image ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/login' });
  };

  return { user, profile, loading, signOut };
}
