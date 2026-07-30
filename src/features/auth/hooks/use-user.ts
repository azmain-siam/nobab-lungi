'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { logoutAction } from '@/actions/auth';
import type { Profile } from '@/types';

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * Client-side hook to get the current authenticated user and profile.
 * Subscribes to auth state changes automatically.
 *
 * Use in Client Components only.
 * Server Components should use `supabase.auth.getUser()` directly.
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile(uid: string) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();
        setProfile((data as Profile) ?? null);
      } catch {
        setProfile(null);
      }
    }

    // Initial fetch
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await logoutAction();
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, signOut };
}
