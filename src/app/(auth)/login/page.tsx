import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Nobab Lungi account to track orders and manage your wishlist.',
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? '/';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Nobab Lungi
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Error from callback */}
        {params.error === 'auth_callback_failed' && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            Authentication failed. Please try again.
          </div>
        )}

        <LoginForm next={next} />

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-medium text-gray-900 underline underline-offset-4">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
