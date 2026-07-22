'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerAction } from '@/features/auth/actions/auth-actions';
import { FormField, FormInput } from '@/components/forms/form-field';
import { AlertMessage } from '@/components/shared/alert-message';
import { Button } from '@/components/ui/button';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    const result = await registerAction(values.name, values.email, values.password);
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
        message="We've sent a confirmation link to your email. Please verify your email to activate your account."
      />
    );
  }

  return (
    <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <AlertMessage variant="error" message={serverError} />}

      <FormField id="register-name" label="Full name" error={errors.name?.message}>
        <FormInput
          id="register-name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          disabled={isSubmitting}
          {...register('name')}
        />
      </FormField>

      <FormField id="register-email" label="Email address" error={errors.email?.message}>
        <FormInput
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          {...register('email')}
        />
      </FormField>

      <FormField id="register-password" label="Password" error={errors.password?.message}>
        <FormInput
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          disabled={isSubmitting}
          {...register('password')}
        />
      </FormField>

      <FormField
        id="register-confirm-password"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <FormInput
          id="register-confirm-password"
          type="password"
          autoComplete="off"
          placeholder="Repeat your password"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
