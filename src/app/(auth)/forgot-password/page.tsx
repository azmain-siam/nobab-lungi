import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Nobab Lungi account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Nobab Lungi
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Reset your password
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <a href="/login" className="font-medium text-gray-900 underline underline-offset-4">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
