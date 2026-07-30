import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { AccountSidebar } from '@/components/shared/account-sidebar';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';

export const metadata: Metadata = {
  title: 'My Wishlist — Nabab Lungi',
  description: 'View your saved favorite handcrafted lungis and sarees.',
};

const WISHLIST_PRODUCTS: ProductCardData[] = [
  {
    id: '1',
    name: 'Midnight Indigo',
    collectionTag: 'Heritage Collection',
    description: 'Hand-woven fine cotton with traditional pattern borders.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
    price: '৳2,450',
    badge: 'New Arrival',
  },
  {
    id: '2',
    name: 'Charcoal Silk Weave',
    collectionTag: 'Executive Series',
    description: 'Premium silk blend for executive comfort and occasion wear.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    price: '৳4,800',
    originalPrice: '৳5,500',
    badge: 'Premium',
  },
  {
    id: '5',
    name: 'Traditional Jamdani Saree',
    collectionTag: 'Artisanal Saree Series',
    description: 'Fine translucent cotton Jamdani with woven gold motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    price: '৳4,500',
    badge: 'NEW',
  },
];

export default function WishlistPage() {
  return (
    <Section variant="default" className="py-12 lg:py-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl mb-8">
          My Account
        </h1>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <AccountSidebar />

          <div className="flex-1 bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e3e2e2] pb-4">
              <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                My Wishlist ({WISHLIST_PRODUCTS.length} Saved Items)
              </h2>
              <p className="text-xs font-light text-[#5e5e5b] mt-1">
                Your saved favorite lungis and sarees. Add them to your cart anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {WISHLIST_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
