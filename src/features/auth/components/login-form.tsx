'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAction } from '@/features/auth/actions/auth-actions';
import { FormField, FormInput } from '@/components/forms/form-field';
import { AlertMessage } from '@/components/shared/alert-message';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next = '/' }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    const result = await loginAction(values.email, values.password, next);
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <AlertMessage variant="error" message={serverError} />}

      <FormField id="login-email" label="Email address" error={errors.email?.message}>
        <FormInput
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          {...register('email')}
        />
      </FormField>

      <FormField
        id="login-password"
        label="Password"
        error={errors.password?.message}
        labelRight={
          <Link
            href="/forgot-password"
            className="text-xs text-gray-500 underline underline-offset-4 hover:text-primary"
          >
            Forgot password?
          </Link>
        }
      >
        <FormInput
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isSubmitting}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
