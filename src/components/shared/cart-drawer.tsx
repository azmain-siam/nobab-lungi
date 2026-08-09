'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';

const FREE_SHIPPING_THRESHOLD = 3000;

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
  } = useCart();

  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-end transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel Container */}
      <div
        className={`relative z-10 flex h-full w-full max-w-md flex-col justify-between bg-[#fbf9f8] shadow-2xl transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e2e2] px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 stroke-[1.5] text-[#1b1c1c]" />
            <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
              Your Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1 text-[#5e5e5b] transition hover:text-[#1b1c1c] focus:outline-none active:scale-90 cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#efeded] px-6 py-3 border-b border-[#e3e2e2] text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[#5e5e5b]">
              Add <strong className="text-[#1b1c1c]">৳{remainingForFreeShipping.toLocaleString()}</strong> more for Free Nationwide Shipping!
            </p>
          ) : (
            <p className="font-medium text-emerald-700">
              🎉 Congratulations! You unlocked Free Nationwide Shipping!
            </p>
          )}
          <div className="mt-2 h-1.5 w-full bg-[#e3e2e2] overflow-hidden">
            <div
              className="h-full bg-[#1b1c1c] transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List with AnimatePresence Exit Support */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divider-y divide-[#e3e2e2]">
          {items.length > 0 ? (
            <AnimatePresence initial={false}>
              {items.map((cartItem) => {
                const { product, quantity, maxStock } = cartItem;
                const isMaxReached = Boolean(maxStock && maxStock > 0 && quantity >= maxStock);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-4 first:pt-0 flex gap-4 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#efeded]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info & Quantity */}
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-xs font-semibold text-[#1b1c1c]">
                            {product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            aria-label="Remove item"
                            className="text-[#5e5e5b] hover:text-red-600 active:scale-90 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                        <span className="block text-[10px] text-[#5e5e5b] mt-0.5">
                          {product.collectionTag ?? 'Heritage'}
                        </span>
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#e3e2e2] bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-[#1b1c1c] hover:bg-[#efeded] active:scale-90 transition cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center font-display text-xs font-semibold text-[#1b1c1c]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, maxStock)}
                            disabled={isMaxReached}
                            title={isMaxReached ? `Only ${maxStock} in stock` : undefined}
                            className="p-1 text-[#1b1c1c] hover:bg-[#efeded] active:scale-90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-display text-xs font-semibold text-[#1b1c1c]">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <ShoppingBag className="h-10 w-10 text-[#5e5e5b] stroke-[1.2]" />
              <p className="font-display text-sm font-semibold text-[#1b1c1c]">
                Your cart is currently empty
              </p>
              <p className="text-xs text-[#5e5e5b] max-w-xs">
                Explore our catalog to find handcrafted lungis.
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {items.length > 0 && (
          <div className="border-t border-[#e3e2e2] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-display font-medium text-[#5e5e5b]">Subtotal</span>
              <span className="font-display text-base font-semibold text-[#1b1c1c]">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-[#5e5e5b]">
              Shipping and taxes calculated at checkout.
            </p>

            <Link href="/checkout" onClick={closeCart} className="block w-full">
              <Button variant="primary" size="lg" className="w-full gap-2 py-3.5">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
