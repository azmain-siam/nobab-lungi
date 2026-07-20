import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Nobab Lungi account and start shopping premium Bangladeshi lungis and sarees.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Nobab Lungi
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-gray-900 underline underline-offset-4">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
