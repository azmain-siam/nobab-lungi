'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ── Register ────────────────────────────────────────────────

export interface RegisterResult {
  error?: string;
  success?: boolean;
}

export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ── Login ────────────────────────────────────────────────────

export interface LoginResult {
  error?: string;
}

export async function loginAction(
  email: string,
  password: string,
  next: string = '/'
): Promise<LoginResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // redirect() must be called OUTSIDE try/catch — it throws internally
  redirect(next);
}

// ── Logout ───────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

// ── Forgot Password ──────────────────────────────────────────

export interface ForgotPasswordResult {
  error?: string;
  success?: boolean;
}

export async function forgotPasswordAction(
  email: string
): Promise<ForgotPasswordResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/account/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Always return success to avoid email enumeration attacks
  return { success: true };
}

// ── Reset Password ───────────────────────────────────────────

export interface ResetPasswordResult {
  error?: string;
  success?: boolean;
}

/**
 * Called from the /reset-password page after the user clicks the email link.
 * The Supabase session is established via the callback route before this runs.
 */
export async function resetPasswordAction(
  password: string
): Promise<ResetPasswordResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true };
}
