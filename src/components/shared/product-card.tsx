import Image from 'next/image';
import Link from 'next/link';
import type { ProductWithImages } from '@/types';
import { formatPrice, getEffectivePrice, getDiscountPercent } from '@/utils/format-price';

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
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
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
            <svg
              aria-hidden="true"
              className="h-14 w-14 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            -{discountPercent}%
          </span>
        )}

        {/* New badge */}
        {product.is_new_arrival && discountPercent === 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
            New
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="line-clamp-2 text-sm font-medium text-gray-900 transition group-hover:text-gray-600">
          {product.name}
        </p>
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
    </Link>
  );
}
