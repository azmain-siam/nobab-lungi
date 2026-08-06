'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { getUserWishlistAction } from '@/actions/wishlist';
import { useWishlist } from '@/providers/wishlist-provider';
import { useCart } from '@/context/cart-context';
import type { ProductWithImages } from '@/types';
import { Heart, ShoppingBag, Trash2, ArrowRight, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { toggleWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getUserWishlistAction()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.items) {
          setItems(res.items);
        }
      })
      .catch((err) => console.error('Error fetching wishlist items:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (product: ProductWithImages) => {
    setItems((prev) => prev.filter((p) => p.id !== product.id));
    await toggleWishlist({ id: product.id, name: product.name });
    await refreshWishlist();
  };

  const handleAddToCart = (product: ProductWithImages) => {
    const coverImage =
      product.product_images?.find((img) => img.is_cover)?.url ||
      product.product_images?.[0]?.url ||
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop';

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      collectionTag: product.fabric || 'Handloom',
      price: `৳${(product.discount_price ?? product.price).toLocaleString('en-BD')}`,
      image: coverImage,
    });
  };

  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#e3e2e2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-semibold text-[#1b1c1c]">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs font-light text-[#5e5e5b] mt-0.5">
            Your saved favorite handcrafted lungis. Add them to your cart anytime.
          </p>
        </div>
        {items.length > 0 && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-3 border border-[#e3e2e2] p-4">
              <div className="aspect-[3/4] w-full bg-[#efeded]" />
              <div className="h-4 w-2/3 bg-[#efeded]" />
              <div className="h-3 w-1/3 bg-[#efeded]" />
              <div className="h-9 w-full bg-[#efeded]" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {items.map((product) => {
              const coverImage =
                product.product_images?.find((img) => img.is_cover)?.url ||
                product.product_images?.[0]?.url ||
                'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop';
              const inStock = product.is_active && product.stock > 0;
              const priceStr = `৳${(product.discount_price ?? product.price).toLocaleString('en-BD')}`;
              const originalPriceStr = product.discount_price
                ? `৳${product.price.toLocaleString('en-BD')}`
                : null;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col border border-[#e3e2e2] bg-white transition hover:shadow-sm"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#efeded]"
                  >
                    <Image
                      src={coverImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Stock Badge Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      {inStock ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 border border-rose-200">
                          <XCircle className="h-3 w-3 stroke-[2.5]" />
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Remove Button Overlay */}
                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 border border-[#e3e2e2] text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-90 transition shadow-xs cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </Link>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <span className="block text-[11px] font-medium text-[#5e5e5b] uppercase tracking-wider">
                        {product.fabric || 'Handloom Series'}
                      </span>
                      <Link href={`/products/${product.id}`}>
                        <h2 className="font-display text-base font-semibold text-[#1b1c1c] hover:underline line-clamp-1 mt-0.5">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-[#1b1c1c]">
                          {priceStr}
                        </span>
                        {originalPriceStr && (
                          <span className="text-xs text-[#5e5e5b] line-through">
                            {originalPriceStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="pt-2 border-t border-[#e3e2e2]/60">
                      <Button
                        variant={inStock ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full gap-2 text-xs uppercase tracking-wider"
                        disabled={!inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center space-y-4 bg-[#fbf9f8]/60 border border-dashed border-[#e3e2e2]">
          <div className="p-3.5 bg-white border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b] shadow-2xs">
            <Heart className="h-7 w-7 stroke-[1.2] text-rose-600" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
              Your wishlist is waiting
            </h2>
            <p className="text-xs text-[#5e5e5b] leading-relaxed">
              Save your favorite lungis here and come back whenever you&apos;re ready.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition shadow-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" />
              Explore Collection
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
