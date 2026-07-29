'use client';

import { useState } from 'react';
import { Star, Heart, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    collectionTag: string;
    categoryTag: string;
    description: string;
    price: string;
    originalPrice?: string;
    rating: string;
    reviewsCount: number;
    badge?: string | null;
    inStock: boolean;
    fabricDetails: string;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-6">
      {/* Badges & Tags */}
      <div className="flex items-center gap-3">
        <Badge variant="pill">{product.collectionTag}</Badge>
        {product.badge && <Badge variant="square">{product.badge}</Badge>}
        {product.inStock && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 border border-emerald-200/60">
            <Check className="h-3 w-3 stroke-[2.5]" />
            In Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
        {product.name}
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-2">
        <div className="flex items-center text-[#1b1c1c]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current stroke-none" />
          ))}
        </div>
        <span className="text-xs font-medium text-[#1b1c1c]">
          {product.rating}
        </span>
        <span className="text-xs text-[#5e5e5b]">
          ({product.reviewsCount} verified reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="font-display text-3xl font-semibold text-[#1b1c1c]">
          {product.price}
        </span>
        {product.originalPrice && (
          <span className="text-base text-[#5e5e5b] line-through font-normal">
            {product.originalPrice}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs font-light leading-relaxed text-[#5e5e5b] sm:text-sm">
        {product.description}
      </p>

      {/* Fabric Specs */}
      <div className="border-y border-[#e3e2e2] py-4 space-y-2 text-xs text-[#5e5e5b]">
        <div className="flex justify-between">
          <span className="font-medium text-[#1b1c1c]">Material:</span>
          <span>{product.fabricDetails}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-[#1b1c1c]">Craftsmanship:</span>
          <span>Traditional Handloom Weave</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-[#1b1c1c]">Origin:</span>
          <span>Pabna / Sirajganj, Bangladesh</span>
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
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-2.5 text-[#1b1c1c] transition hover:bg-[#efeded] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-display text-sm font-semibold text-[#1b1c1c]">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              aria-label="Increase quantity"
              className="p-2.5 text-[#1b1c1c] transition hover:bg-[#efeded]"
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
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            Add to Cart
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Buy Now
          </Button>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Add to Wishlist"
            className={`flex h-12 w-12 shrink-0 items-center justify-center border border-[#e3e2e2] transition ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white text-[#1b1c1c] hover:bg-[#efeded]'
            }`}
          >
            <Heart
              className={`h-5 w-5 stroke-[1.5] ${
                isWishlisted ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
