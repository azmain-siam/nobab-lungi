import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ShopView } from '@/features/products/components/shop-view';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Shop Lungi Collection — Nabab Lungi',
  description:
    'Browse authentic handloom lungis from Bangladesh. Premium organic cotton yarn, royal comfort weave, express cash-on-delivery nationwide.',
};

export default function ShopPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <Suspense fallback={<div className="h-96 bg-[#f5f3f3] animate-pulse" />}>
          <ShopView />
        </Suspense>
      </Container>
    </div>
  );
}
