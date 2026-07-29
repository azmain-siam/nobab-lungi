'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

// ── Register ────────────────────────────────────────────────

export async function registerAction(formData: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthActionResult> {
  const { fullName, email, password, phone } = formData;
  if (!email || !password || !fullName) {
    return { error: 'Full name, email, and password are required.' };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone ?? null,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: fullName,
        phone: phone ?? null,
        role: 'customer',
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// ── Login ────────────────────────────────────────────────────

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const { email, password } = formData;
  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// ── Logout ───────────────────────────────────────────────────

export async function logoutAction(): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// ── Forgot Password ──────────────────────────────────────────

export async function forgotPasswordAction(
  email: string
): Promise<AuthActionResult> {
  if (!email) {
    return { error: 'Email address is required.' };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/forgot-password?reset=true`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}

// ── Reset Password ───────────────────────────────────────────

export async function resetPasswordAction(
  password: string
): Promise<AuthActionResult> {
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) return { error: error.message };
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
