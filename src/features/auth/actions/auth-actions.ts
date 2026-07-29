'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth';

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
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { fullName, email, password, phone } = parsed.data;

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
      // Use admin client for initial profile creation so it bypasses RLS if user is not confirmed yet
      const adminSupabase = createAdminClient();
      await adminSupabase.from('profiles').upsert({
        id: data.user.id,
        name: fullName,
        email,
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
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

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
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
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
  const parsed = resetPasswordSchema.safeParse({ password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

    if (error) return { error: error.message };
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
