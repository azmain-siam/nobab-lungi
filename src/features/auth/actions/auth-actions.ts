'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
  role?: string;
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
    await connectToDatabase();

    const lowerEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: lowerEmail });

    if (existingUser) {
      return { error: 'An account with this email address already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role: 'admin' | 'customer' = 'customer';
    if (lowerEmail.startsWith('admin@') || lowerEmail.includes('admin')) {
      role = 'admin';
    }

    await User.create({
      name: fullName.trim(),
      email: lowerEmail,
      password: hashedPassword,
      phone: phone?.trim() || null,
      role,
    });

    revalidatePath('/', 'layout');
    return { success: true, role };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during registration.';
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
    await connectToDatabase();

    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail }).select('+password');

    if (!user || !user.password) {
      return { error: 'Invalid email or password.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    revalidatePath('/', 'layout');
    return { success: true, role: user.role };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during login.';
    return { error: message };
  }
}

// ── Logout ───────────────────────────────────────────────────

export async function logoutAction(): Promise<AuthActionResult> {
  try {
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
    await connectToDatabase();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });

    if (!user) {
      // Return success to avoid email enumeration
      return { success: true };
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
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
