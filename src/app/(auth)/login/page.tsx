import type { Metadata } from 'next';
import { AuthPageShell } from '@/features/auth/components/auth-page-shell';
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
    <AuthPageShell
      title="Sign in to your account"
      subtitle="Welcome back"
      footer={{ text: "Don't have an account?", linkText: 'Register', linkHref: '/register' }}
    >
      {params.error === 'auth_callback_failed' && (
        <div className="mb-4 rounded-md bg-error-bg px-4 py-3 text-sm text-error">
          Authentication failed. Please try again.
        </div>
      )}
      <LoginForm next={next} />
    </AuthPageShell>
  );
}
