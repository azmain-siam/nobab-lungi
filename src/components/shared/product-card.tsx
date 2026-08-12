'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/providers/wishlist-provider';

export interface ProductCardData {
  id: string;
  name: string;
  slug?: string;
  collectionTag?: string;
  description?: string;
  image: string;
  rating?: string | number;
  reviewsCount?: number;
  price: string;
  originalPrice?: string;
  badge?: string | null;
  subTag?: string | null;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const collectionTag = product.collectionTag ?? 'Heritage';
  const description =
    product.description ?? 'Hand-woven fine cotton with traditional Bangladeshi techniques.';
  const productHref = `/products/${product.id}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id: product.id, name: product.name });
  };

  return (
    <div className="group/card relative flex flex-col">
      {/* Image Container */}
      <Link
        href={productHref}
        aria-label={product.name}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-[#efeded]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top-Left Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="pill">{product.badge}</Badge>
          </div>
        )}

        {/* Top-Right Wishlist Heart */}
        <button
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition focus:outline-none z-10 cursor-pointer ${
            wishlisted
              ? 'bg-rose-50 text-red-600 hover:bg-rose-100 ring-1 ring-rose-200'
              : 'bg-white/90 text-[#1b1c1c] hover:bg-white'
          }`}
        >
          <Heart
            className={`h-4 w-4 stroke-[1.5] transition-transform active:scale-125 ${
              wishlisted ? 'fill-current' : ''
            }`}
          />
        </button>

        {/* Animated Desktop Quick Add Button */}
        <div className="hidden sm:block absolute bottom-0 inset-x-0 z-20 w-full transition-all duration-300 transform translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <Button
            variant="primary"
            size="md"
            className="w-full py-3"
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Product Details below image */}
      <div className="mt-3.5 space-y-1">
        {/* Collection Tag */}
        <span className="block text-[11px] font-medium text-[#5e5e5b]">
          {collectionTag}
        </span>

        {/* Title */}
        <Link href={productHref}>
          <h3 className="font-display text-base font-semibold text-[#1b1c1c] transition group-hover/card:text-black">
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs font-light text-[#5e5e5b] line-clamp-1">
          {description}
        </p>

        {/* Price & Mobile Quick Add Row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-[#1b1c1c]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#5e5e5b] line-through font-normal">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Mobile Direct Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden flex items-center gap-1 bg-[#1b1c1c] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-sm active:scale-95 transition cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Sub-Tag */}
        {product.subTag && (
          <div className="pt-0.5">
            <Badge variant="danger">{product.subTag}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
