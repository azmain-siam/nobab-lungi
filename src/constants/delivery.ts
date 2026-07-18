// Delivery charges in whole BDT (as defined in PROJECT_SPEC.md)
export const DELIVERY_CHARGES = {
  INSIDE_DHAKA: 70,   // ৳70
  OUTSIDE_DHAKA: 130, // ৳130
} as const;

export type DeliveryZone = keyof typeof DELIVERY_CHARGES;
