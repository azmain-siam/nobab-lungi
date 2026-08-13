import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { AccountSidebar } from '@/components/shared/account-sidebar';

export const metadata: Metadata = {
  title: {
    default: 'Customer Account — Nabab Lungi',
    template: '%s — Nabab Lungi',
  },
  description: 'Manage your orders, saved addresses, wishlist, and profile details.',
};

export default function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-[#fbf9f8]/40 border-b border-[#e3e2e2]/60 min-h-[calc(100vh-280px)]">
      <Container className="py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <AccountSidebar />
          <main className="flex-1 min-w-0 w-full space-y-6">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
