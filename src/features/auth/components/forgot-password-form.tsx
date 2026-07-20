'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPasswordAction } from '@/features/auth/actions/auth-actions';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    const result = await forgotPasswordAction(values.email);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  }

  // Success state
  if (success) {
    return (
      <div
        role="status"
        className="rounded-md bg-green-50 px-6 py-8 text-center"
      >
        <p className="text-lg font-semibold text-green-800">Email sent!</p>
        <p className="mt-2 text-sm text-green-700">
          If an account exists with that email, you will receive a password reset link shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      id="forgot-password-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      <p className="text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {/* Server-level error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        id="forgot-password-submit"
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
