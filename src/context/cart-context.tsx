'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ProductCardData } from '@/components/shared/product-card';

export interface CartItem {
  product: ProductCardData;
  quantity: number;
  numericPrice: number;
  maxStock?: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoaded: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: ProductCardData, quantity?: number, maxStock?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CART_STORAGE_KEY = 'nobab_lungi_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydration safety: Load cart from localStorage ONLY after client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize items with numericPrice
          const normalized = parsed.map((item: CartItem) => ({
            ...item,
            numericPrice:
              item.numericPrice ||
              parseInt(item.product.price.replace(/[^\d]/g, ''), 10) ||
              0,
          }));
          queueMicrotask(() => {
            setItems(normalized);
          });
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items state changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: ProductCardData, quantityToAdd = 1, maxStock?: number) => {
    const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity;
        const availableStock = maxStock ?? updated[existingIndex].maxStock;
        
        let newQty = currentQty + quantityToAdd;
        if (availableStock !== undefined && availableStock > 0) {
          newQty = Math.min(newQty, availableStock);
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          maxStock: availableStock ?? updated[existingIndex].maxStock,
        };
        return updated;
      }

      let initialQty = quantityToAdd;
      if (maxStock !== undefined && maxStock > 0) {
        initialQty = Math.min(initialQty, maxStock);
      }

      return [
        ...prevItems,
        {
          product,
          quantity: initialQty,
          numericPrice: priceNum,
          maxStock,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, targetQuantity: number, maxStock?: number) => {
    if (targetQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const cap = maxStock ?? item.maxStock;
          const finalQty = cap !== undefined && cap > 0 ? Math.min(targetQuantity, cap) : targetQuantity;
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.numericPrice || parseInt(item.product.price.replace(/[^\d]/g, ''), 10) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoaded,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
