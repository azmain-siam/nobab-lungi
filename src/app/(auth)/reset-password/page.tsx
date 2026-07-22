import type { Metadata } from 'next';
import { AuthPageShell } from '@/features/auth/components/auth-page-shell';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Set New Password',
  description: 'Set a new password for your Nobab Lungi account.',
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Set your new password"
      subtitle="Choose a strong password"
      footer={{ text: 'Remember your password?', linkText: 'Back to login', linkHref: '/login' }}
    >
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
