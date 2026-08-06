'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Heart, Check, Minus, Plus, ShoppingBag, XCircle, Truck, Banknote, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/providers/wishlist-provider';

export interface ProductInfoData {
  id: string;
  name: string;
  slug?: string;
  sku?: string | null;
  collectionTag: string;
  categoryTag: string;
  description: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number | null;
  rating?: string;
  reviewsCount?: number;
  badge?: string | null;
  inStock: boolean;
  stockCount: number;
  fabricDetails?: string | null;
  color?: string | null;
  pattern?: string | null;
  weight?: string | null;
  craftsmanship?: string | null;
  origin?: string | null;
  images?: string[];
}

interface ProductInfoProps {
  product: ProductInfoData;
  insideDhakaCharge?: number;
  outsideDhakaCharge?: number;
  estimatedDeliveryTime?: string;
}

export function ProductInfo({
  product,
  insideDhakaCharge = 70,
  outsideDhakaCharge = 130,
}: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [quantity, setQuantity] = useState(1);

  const maxStock = Math.max(0, product.stockCount);
  const isOutOfStock = !product.inStock || maxStock <= 0;

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < maxStock) setQuantity(quantity + 1);
  };

  const productCardData = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collectionTag: product.collectionTag,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    badge: product.badge,
    image:
      product.images?.[0] ??
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(productCardData, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(productCardData, quantity);
    router.push('/checkout');
  };

  // Has specs helper
  const hasSpecs =
    Boolean(product.fabricDetails) ||
    Boolean(product.color) ||
    Boolean(product.pattern) ||
    Boolean(product.weight) ||
    Boolean(product.craftsmanship) ||
    Boolean(product.origin);

  return (
    <div className="space-y-6">
      {/* Badges & Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="pill">{product.collectionTag}</Badge>
        {product.badge && <Badge variant="square">{product.badge}</Badge>}
        {product.inStock && maxStock > 0 ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 border border-emerald-200/60">
            <Check className="h-3 w-3 stroke-[2.5]" />
            {maxStock <= 5 ? `Only ${maxStock} left in stock!` : `In Stock`}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-rose-700 font-medium bg-rose-50 px-2.5 py-0.5 border border-rose-200/60">
            <XCircle className="h-3 w-3 stroke-[2.5]" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
          {product.name}
        </h1>
        {/* {product.sku && (
          <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[#5e5e5b]">
            SKU: {product.sku}
          </p>
        )} */}
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-2">
        <div className="flex items-center text-[#1b1c1c]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current stroke-none" />
          ))}
        </div>
        {product.reviewsCount && product.reviewsCount > 0 ? (
          <>
            <span className="text-xs font-medium text-[#1b1c1c]">
              {product.rating || '5.0'}
            </span>
            <span className="text-xs text-[#5e5e5b]">
              ({product.reviewsCount} verified reviews)
            </span>
          </>
        ) : (
          <span className="text-xs text-[#5e5e5b]">
            (No customer reviews yet)
          </span>
        )}
      </div>

      {/* Price & Savings */}
      <div className="flex items-center gap-3 pt-2">
        <span className="font-display text-3xl font-semibold text-[#1b1c1c]">
          {product.price}
        </span>
        {product.originalPrice && (
          <span className="text-base text-[#5e5e5b] line-through font-normal">
            {product.originalPrice}
          </span>
        )}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200/60">
            SAVE {product.discountPercent}%
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-xs font-light leading-relaxed text-[#5e5e5b] sm:text-sm">
          {product.description}
        </p>
      )}

      {/* Specifications Grid */}
      {hasSpecs && (
        <div className="border-y border-[#e3e2e2] py-4 space-y-2 text-xs text-[#5e5e5b]">
          {product.fabricDetails && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Material:</span>
              <span>{product.fabricDetails}</span>
            </div>
          )}
          {product.color && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Color:</span>
              <span>{product.color}</span>
            </div>
          )}
          {product.pattern && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Pattern:</span>
              <span>{product.pattern}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Weight:</span>
              <span>{product.weight}</span>
            </div>
          )}
          {product.craftsmanship && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Craftsmanship:</span>
              <span>{product.craftsmanship}</span>
            </div>
          )}
          {product.origin && (
            <div className="flex justify-between">
              <span className="font-medium text-[#1b1c1c]">Origin:</span>
              <span>{product.origin}</span>
            </div>
          )}
        </div>
      )}

      {/* Subtle Near-Purchase Delivery & Policy Summary */}
      <div className="rounded-none border border-[#e3e2e2] bg-[#fbf9f8] p-4 space-y-2.5 text-xs text-[#5e5e5b]">
        <div className="flex items-center justify-between font-medium text-[#1b1c1c]">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 stroke-[1.5] text-amber-800" />
            <span>Nationwide Delivery Available</span>
          </div>
          <span className="text-[11px] font-normal text-[#5e5e5b]">Cash on Delivery</span>
        </div>
        <div className="pl-6 space-y-1 text-[11px]">
          <p>• Inside Dhaka: <span className="font-medium text-[#1b1c1c]">৳{insideDhakaCharge}</span> (1–2 business days)</p>
          <p>• Outside Dhaka: <span className="font-medium text-[#1b1c1c]">৳{outsideDhakaCharge}</span> (2–5 business days)</p>
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-[#e3e2e2]/60 text-[11px] text-[#1b1c1c] font-medium">
          <div className="flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 stroke-[1.5] text-emerald-700" />
            <span>Pay on Delivery</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-blue-700" />
            <span>100% Handloom Authenticity</span>
          </div>
        </div>
      </div>

      {/* Quantity & Action Controls */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
            Quantity:
          </span>
          <div className="flex items-center border border-[#e3e2e2] bg-white">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Decrease quantity"
              className="p-2.5 text-[#1b1c1c] transition hover:bg-[#efeded] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-display text-sm font-semibold text-[#1b1c1c]">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= maxStock || isOutOfStock}
              aria-label="Increase quantity"
              className="p-2.5 text-[#1b1c1c] transition hover:bg-[#efeded] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 gap-2"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <button
            onClick={() => toggleWishlist({ id: product.id, name: product.name })}
            aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`flex h-12 w-12 shrink-0 items-center justify-center border border-[#e3e2e2] transition cursor-pointer ${wishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white text-[#1b1c1c] hover:bg-[#efeded]'
              }`}
          >
            <Heart
              className={`h-5 w-5 stroke-[1.5] transition-transform active:scale-125 ${wishlisted ? 'fill-current' : ''
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
