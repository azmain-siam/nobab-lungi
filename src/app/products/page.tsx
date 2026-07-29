import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { ShopView } from '@/features/products/components/shop-view';

export const metadata: Metadata = {
  title: 'Shop Collection — Nabab Lungi',
  description:
    'Explore our full catalog of authentic handcrafted Bangladeshi lungis and sarees. Premium cotton, handloom, and export quality items delivered across Bangladesh.',
};

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />
        <main className="py-12 lg:py-16">
          <Container>
            <ShopView />
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
}
