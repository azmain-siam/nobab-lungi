export const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PROCESSING: 'processing',
  SHIPPED:    'shipped',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
  REFUNDED:   'refunded',
} as const;

export const PAYMENT_STATUS = {
  UNPAID:   'unpaid',
  PAID:     'paid',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus  = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Human-readable labels for display
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
  refunded:   'Refunded',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid:   'Unpaid',
  paid:     'Paid',
  refunded: 'Refunded',
};
