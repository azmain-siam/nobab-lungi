import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ShopView } from '@/features/products/components/shop-view';

export const metadata: Metadata = {
  title: 'Shop Collection — Nabab Lungi',
  description:
    'Explore our full catalog of authentic handcrafted Bangladeshi lungis and sarees. Premium cotton, handloom, and export quality items delivered across Bangladesh.',
};

export default function ShopPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <ShopView />
      </Container>
    </div>
  );
}
