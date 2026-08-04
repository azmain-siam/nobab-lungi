'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { AccountSidebar } from '@/components/shared/account-sidebar';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { useToast } from '@/providers/toast-provider';
import { Heart, ShoppingBag } from 'lucide-react';

const INITIAL_WISHLIST: ProductCardData[] = [
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
  const toast = useToast();
  const [items, setItems] = useState<ProductCardData[]>(INITIAL_WISHLIST);

  const handleRemove = (productId: string, productName: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    toast.success(`"${productName}" removed from your wishlist.`);
  };

  return (
    <Section variant="default" className="py-10 lg:py-16">
      <Container>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1b1c1c] mb-8">
          My Account
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <AccountSidebar />

          <div className="flex-1 bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  My Wishlist ({items.length})
                </h2>
                <p className="text-xs font-light text-[#5e5e5b] mt-1">
                  Your saved favorite lungis and sarees. Add them to your cart anytime.
                </p>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id, product.name)}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 border border-[#e3e2e2] text-red-600 hover:bg-red-50 transition rounded-none text-[10px] font-semibold uppercase tracking-wider"
                      title="Remove from Wishlist"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 bg-[#fbf9f8]/40 border border-dashed border-[#e3e2e2]">
                <div className="p-3 bg-white border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
                  <Heart className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
                  Save your favorite handcrafted lungis and sarees here while browsing to easily find them later.
                </p>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" />
                    Explore Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
