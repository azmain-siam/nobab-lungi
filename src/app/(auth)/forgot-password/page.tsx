import type { Metadata } from 'next';
import { AuthPageShell } from '@/features/auth/components/auth-page-shell';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Nobab Lungi account password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Reset your password"
      subtitle="We'll send you a reset link"
      footer={{ text: 'Remember your password?', linkText: 'Back to login', linkHref: '/login' }}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
