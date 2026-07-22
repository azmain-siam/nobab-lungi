import type { Metadata } from 'next';
import { AuthPageShell } from '@/features/auth/components/auth-page-shell';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Nobab Lungi account and start shopping premium Bangladeshi lungis and sarees.',
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Create your account"
      subtitle="Join thousands of happy customers"
      footer={{ text: 'Already have an account?', linkText: 'Sign in', linkHref: '/login' }}
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
