export const PAYMENT_METHOD = {
  COD:   'cod',
  BKASH: 'bkash',
  NAGAD: 'nagad',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

// Human-readable labels for display
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod:   'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
};

// Phase 2: SSLCommerz will be added here
