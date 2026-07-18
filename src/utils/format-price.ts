/**
 * Formats a whole BDT integer into a localized Bengali Taka string.
 * Example: formatPrice(850) → "৳850"
 * Example: formatPrice(1500) → "৳1,500"
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

/**
 * Calculates discount percentage from original and discounted price.
 * Example: getDiscountPercent(1000, 800) → 20
 */
export function getDiscountPercent(price: number, discountPrice: number): number {
  if (price === 0) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

/**
 * Returns the effective selling price (discount_price if available, else price).
 */
export function getEffectivePrice(price: number, discountPrice: number | null): number {
  return discountPrice !== null && discountPrice < price ? discountPrice : price;
}
