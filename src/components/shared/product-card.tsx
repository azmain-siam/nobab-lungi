import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const collectionTag = product.collectionTag ?? 'Heritage';
  const description =
    product.description ?? 'Hand-woven fine cotton with traditional Bangladeshi techniques.';

  return (
    <div className="group/card relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-[#efeded]">
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
          aria-label="Wishlist"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1b1c1c] shadow-sm transition hover:bg-white focus:outline-none z-10"
        >
          <Heart className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Animated Quick Add Button */}
        <div className="absolute bottom-0 inset-x-0 z-20 w-full transition-all duration-300 transform translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <Button variant="primary" size="md" className="w-full py-3">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Details below image */}
      <div className="mt-3.5 space-y-1">
        {/* Collection Tag */}
        <span className="block text-[11px] font-medium text-[#5e5e5b]">
          {collectionTag}
        </span>

        {/* Title */}
        <h3 className="font-display text-base font-semibold text-[#1b1c1c] transition group-hover/card:text-black">
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs font-light text-[#5e5e5b] line-clamp-1">
          {description}
        </p>

        {/* Price Row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-base font-semibold text-[#1b1c1c]">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#5e5e5b] line-through font-normal">
              {product.originalPrice}
            </span>
          )}
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
