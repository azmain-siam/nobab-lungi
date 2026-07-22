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
    <div className="group relative flex flex-col">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff aria-hidden="true" className="h-10 w-10 text-gray-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5">
            {discountPercent > 0 ? (
              <Badge variant="error">-{discountPercent}%</Badge>
            ) : product.is_new_arrival ? (
              <Badge variant="secondary">New</Badge>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Wishlist button — UI only; wired up in Phase 5 */}
      <button
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute right-2.5 top-2.5 rounded-full bg-white/80 p-1.5 text-gray-500 opacity-0 backdrop-blur-sm transition hover:text-red-500 group-hover:opacity-100"
      >
        <Heart aria-hidden="true" className="h-4 w-4" />
      </button>

      {/* Info */}
      <div className="mt-3 space-y-1 px-0.5">
        <Link href={`/products/${product.slug}`}>
          <p className="line-clamp-2 text-sm font-medium text-gray-900 transition group-hover:text-primary">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(effectivePrice)}
          </span>
          {product.discount_price != null && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
