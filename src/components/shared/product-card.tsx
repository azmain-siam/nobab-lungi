import Image from 'next/image';
import Link from 'next/link';
import { Heart, ImageOff } from 'lucide-react';
import type { ProductWithImages } from '@/types';
import { formatPrice, getEffectivePrice, getDiscountPercent } from '@/utils/format-price';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images
    ?.slice()
    .sort((a, b) => a.sort_order - b.sort_order)[0];

  const effectivePrice = getEffectivePrice(product.price, product.discount_price);
  const discountPercent =
    product.discount_price != null
      ? getDiscountPercent(product.price, product.discount_price)
      : 0;

  return (
    <div className="group relative flex flex-col transition-all duration-300">
      {/* Product Image Container */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block overflow-hidden rounded-lg bg-surface-container/50 border border-border/40"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-stone-100">
              <ImageOff aria-hidden="true" className="h-10 w-10 text-stone-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
            {discountPercent > 0 ? (
              <Badge variant="error" className="bg-secondary text-white font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5">
                -{discountPercent}%
              </Badge>
            ) : product.is_new_arrival ? (
              <Badge variant="secondary" className="bg-primary text-white font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5">
                New Arrival
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Quick Wishlist Icon */}
      <button
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-stone-600 opacity-0 backdrop-blur-sm transition-all duration-300 hover:text-secondary group-hover:opacity-100 shadow-sm"
      >
        <Heart aria-hidden="true" className="h-4 w-4 stroke-[1.5]" />
      </button>

      {/* Product Info */}
      <div className="mt-3 space-y-1.5 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-serif text-base font-semibold text-foreground transition-colors group-hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">
            {formatPrice(effectivePrice)}
          </span>
          {product.discount_price != null && (
            <span className="text-xs text-foreground/50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
