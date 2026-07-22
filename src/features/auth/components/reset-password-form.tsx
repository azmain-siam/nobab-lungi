'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPasswordAction } from '@/features/auth/actions/auth-actions';
import { FormField, FormInput } from '@/components/forms/form-field';
import { AlertMessage } from '@/components/shared/alert-message';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    const result = await resetPasswordAction(values.password);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div role="status" className="rounded-md bg-success-bg px-6 py-8 text-center">
        <p className="text-lg font-semibold text-success">Password updated!</p>
        <p className="mt-2 text-sm text-success/80">
          Your password has been changed.{' '}
          <Link href="/login" className="underline hover:text-success">
            Sign in
          </Link>{' '}
          with your new password.
        </p>
      </div>
    );
  }

  return (
    <form
      id="reset-password-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {serverError && <AlertMessage variant="error" message={serverError} />}

      <FormField id="reset-password" label="New password" error={errors.password?.message}>
        <FormInput
          id="reset-password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          disabled={isSubmitting}
          {...register('password')}
        />
      </FormField>

      <FormField
        id="reset-confirm-password"
        label="Confirm new password"
        error={errors.confirmPassword?.message}
      >
        <FormInput
          id="reset-confirm-password"
          type="password"
          autoComplete="off"
          placeholder="Repeat new password"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button id="reset-password-submit" type="submit" fullWidth isLoading={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  );
}
