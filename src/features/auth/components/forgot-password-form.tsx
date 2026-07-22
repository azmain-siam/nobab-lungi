'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPasswordAction } from '@/features/auth/actions/auth-actions';
import { FormField, FormInput } from '@/components/forms/form-field';
import { AlertMessage } from '@/components/shared/alert-message';
import { Button } from '@/components/ui/button';

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

  if (success) {
    return (
      <AlertMessage
        variant="success"
        message="If an account exists with that email, you will receive a password reset link shortly."
      />
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

      {serverError && <AlertMessage variant="error" message={serverError} />}

      <FormField id="forgot-email" label="Email address" error={errors.email?.message}>
        <FormInput
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          {...register('email')}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}
