'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  XCircle,
  ChevronRight,
  ChevronDown,
  Share2,
  Copy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/providers/wishlist-provider';
import { ProductOptionsDrawer, type OptionType } from './product-options-drawer';
import { ProductReviews } from './product-reviews';

export interface ProductInfoData {
  id: string;
  name: string;
  slug?: string;
  sku?: string | null;
  collectionTag: string;
  categoryTag: string;
  shortDescription?: string | null;
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
}: ProductInfoProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard (Free Size)');
  const [copiedSku, setCopiedSku] = useState(false);
  const [activeDrawerOption, setActiveDrawerOption] = useState<OptionType>(null);
  const [mobileAccordionOption, setMobileAccordionOption] = useState<OptionType>(null);

  const maxStock = Math.max(0, product.stockCount);
  const isOutOfStock = !product.inStock || maxStock <= 0;
  const productSku = product.sku || 'NL-HERITAGE-01';

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
      '/images/placeholder-product.svg',
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(productCardData, quantity);
  };

  const handleOptionClick = (option: OptionType) => {
    // If screen width is lg or higher, trigger desktop right-side slide drawer
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (option === 'code') return; // On desktop, code is displayed inline directly
      setActiveDrawerOption(option);
    } else {
      // Mobile inline accordion toggle
      setMobileAccordionOption((prev) => (prev === option ? null : option));
    }
  };

  const handleCopySku = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(productSku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const specs = {
    sku: productSku,
    description: product.description,
    fabricDetails: product.fabricDetails,
    color: product.color,
    pattern: product.pattern,
    weight: product.weight,
    craftsmanship: product.craftsmanship,
    origin: product.origin,
  };

  return (
    <div className="space-y-6">
      {/* Badges & Tags */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant="pill">{product.collectionTag}</Badge>
        {product.badge && <Badge variant="square">{product.badge}</Badge>}
        {product.inStock && maxStock > 0 ? (
          <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 border border-emerald-200/60">
            <Check className="h-3 w-3 stroke-[2.5]" />
            {maxStock <= 5 ? `Only ${maxStock} left` : `In Stock`}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-rose-700 font-medium bg-rose-50 px-2 py-0.5 border border-rose-200/60">
            <XCircle className="h-3 w-3 stroke-[2.5]" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#1b1c1c] sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
      </div>

      {/* Price & Savings */}
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl font-semibold text-[#1b1c1c] sm:text-3xl">
          {product.price}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-[#5e5e5b] line-through font-normal sm:text-base">
            {product.originalPrice}
          </span>
        )}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200/60">
            SAVE {product.discountPercent}%
          </span>
        )}
      </div>

      {/* Short Description Snippet */}
      {(product.shortDescription || product.description) && (
        <p className="font-sans text-xs sm:text-sm font-light leading-relaxed text-[#5e5e5b]">
          {product.shortDescription || product.description}
        </p>
      )}

      {/* Quantity & Size Selection Grid (Matching Image 1 & 4 layout) */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e3e2e2]">
        {/* Quantity Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
            Quantity
          </label>
          <div className="flex items-center border border-[#e3e2e2] bg-white h-10">
            <button
              type="button"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Decrease quantity"
              className="p-2 text-[#1b1c1c] transition hover:bg-[#efeded] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex-1 text-center font-display text-xs font-semibold text-[#1b1c1c]">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button
              type="button"
              onClick={incrementQuantity}
              disabled={quantity >= maxStock || isOutOfStock}
              aria-label="Increase quantity"
              className="p-2 text-[#1b1c1c] transition hover:bg-[#efeded] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Size Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
            Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full h-10 px-3 border border-[#e3e2e2] bg-white text-xs font-medium text-[#1b1c1c] focus:outline-hidden focus:ring-1 focus:ring-[#1b1c1c] cursor-pointer"
          >
            <option value="Standard (Free Size)">Standard (Free Size)</option>
            <option value="Stitched Regular">Stitched Regular</option>
            <option value="Unstitched Handloom">Unstitched Handloom</option>
          </select>
        </div>
      </div>

      {/* Options Rows List (Product Code, Description, Reviews) */}
      <div className="border-y border-[#e3e2e2] divide-y divide-[#e3e2e2]">
        {/* Option 1: Product Code (SKU) */}
        <div className="py-3.5">
          <div
            onClick={() => handleOptionClick('code')}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
              Product Code
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-[#1b1c1c] tracking-wider hidden sm:inline">
                {productSku}
              </span>
              <button
                type="button"
                onClick={handleCopySku}
                title="Copy Product Code"
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition cursor-pointer"
              >
                {copiedSku ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <ChevronDown className="h-4 w-4 stroke-[1.5] text-[#5e5e5b] sm:hidden" />
            </div>
          </div>

          {/* Mobile Collapsible Accordion for Product Code */}
          <AnimatePresence>
            {mobileAccordionOption === 'code' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden sm:hidden pt-3 text-xs text-[#5e5e5b]"
              >
                <div className="flex items-center justify-between p-2.5 bg-[#f5f3f3] border border-[#e3e2e2]">
                  <span className="font-mono font-bold text-[#1b1c1c]">{productSku}</span>
                  <span className="text-[10px] text-[#5e5e5b]">Tap copy icon above</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Option 2: Product Description */}
        <div className="py-3.5">
          <div
            onClick={() => handleOptionClick('description')}
            className="flex items-center justify-between cursor-pointer group py-0.5"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
              Product Description
            </span>
            <ChevronRight className="h-4 w-4 stroke-[1.8] text-[#1b1c1c] group-hover:translate-x-1 transition-transform hidden lg:block" />
            <ChevronDown
              className={`h-4 w-4 stroke-[1.8] text-[#1b1c1c] transition-transform lg:hidden ${
                mobileAccordionOption === 'description' ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Mobile Collapsible Accordion for Product Description & Specs */}
          <AnimatePresence>
            {mobileAccordionOption === 'description' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden lg:hidden pt-4 space-y-4 text-xs text-[#5e5e5b]"
              >
                {specs.description && (
                  <p className="leading-relaxed font-light text-[#5e5e5b]">
                    {specs.description}
                  </p>
                )}

                {/* Mobile Specifications Table (Matching Image 4) */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                    Specifications
                  </h4>
                  <div className="border border-[#e3e2e2] overflow-hidden rounded-none text-xs">
                    <div className="flex justify-between p-2.5 bg-white border-b border-[#e3e2e2]/60">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Colour</span>
                      <span className="text-[#1b1c1c] w-2/3">{specs.color || 'Heritage Multi'}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#f5f3f3] border-b border-[#e3e2e2]/60">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Fabric</span>
                      <span className="text-[#1b1c1c] w-2/3">{specs.fabricDetails || '100% Organic Superfine Cotton'}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white border-b border-[#e3e2e2]/60">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Value Addition</span>
                      <span className="text-[#1b1c1c] w-2/3">{specs.pattern || specs.craftsmanship || 'Handloom Weave'}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#f5f3f3] border-b border-[#e3e2e2]/60">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Measurement Unit</span>
                      <span className="text-[#1b1c1c] w-2/3">Inch / Free Size</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white border-b border-[#e3e2e2]/60">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Craftsmanship</span>
                      <span className="text-[#1b1c1c] w-2/3">{specs.craftsmanship || 'Traditional Bangladesh Weave'}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#f5f3f3]">
                      <span className="font-medium text-[#5e5e5b] w-1/3">Care</span>
                      <span className="text-[#1b1c1c] w-2/3">Hand Wash With Mild Detergent In Cold Water</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Option 3: Reviews */}
        <div className="py-3.5">
          <div
            onClick={() => handleOptionClick('reviews')}
            className="flex items-center justify-between cursor-pointer group py-0.5"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
              Reviews
            </span>
            <ChevronRight className="h-4 w-4 stroke-[1.8] text-[#1b1c1c] group-hover:translate-x-1 transition-transform hidden lg:block" />
            <ChevronDown
              className={`h-4 w-4 stroke-[1.8] text-[#1b1c1c] transition-transform lg:hidden ${
                mobileAccordionOption === 'reviews' ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Mobile Collapsible Accordion for Reviews */}
          <AnimatePresence>
            {mobileAccordionOption === 'reviews' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden lg:hidden pt-4 space-y-4"
              >
                <ProductReviews />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Action Bar (Add to Bag + Wishlist & Share) */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1 font-display text-xs font-bold uppercase tracking-[0.15em] bg-[#1b1c1c] hover:bg-black text-white h-12 rounded-none"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 stroke-[1.8] mr-2" />
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
        </Button>

        {/* Wishlist Icon Button */}
        <button
          type="button"
          onClick={() => toggleWishlist({ id: product.id, name: product.name })}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`flex h-12 w-12 shrink-0 items-center justify-center border border-[#e3e2e2] transition cursor-pointer ${
            wishlisted
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white text-[#1b1c1c] hover:bg-[#efeded]'
          }`}
        >
          <Heart
            className={`h-5 w-5 stroke-[1.5] transition-transform active:scale-125 ${
              wishlisted ? 'fill-current' : ''
            }`}
          />
        </button>

        {/* Share Icon Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          title="Share Product"
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#e3e2e2] bg-white text-[#1b1c1c] hover:bg-[#efeded] transition cursor-pointer"
        >
          <Share2 className="h-5 w-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Desktop Slide-Over Drawer Component */}
      <ProductOptionsDrawer
        activeOption={activeDrawerOption}
        onClose={() => setActiveDrawerOption(null)}
        specs={specs}
      />
    </div>
  );
}
