import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  product_image?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  deliveryArea: 'dhaka' | 'outside';
  fullAddress: string;
}

export interface ITimelineEvent {
  status: string;
  message: string;
  timestamp: Date;
  updated_by?: string;
}

export interface IOrder extends Document {
  user_id?: string | null;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'cod' | 'bkash' | 'nagad';
  payment_status: 'unpaid' | 'pending_verification' | 'paid' | 'refunded';
  shipping_address: IShippingAddress;
  transaction_id?: string | null;
  coupon_code?: string | null;
  courier?: string | null;
  tracking_number?: string | null;
  delivery_status?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  order_items: IOrderItem[];
  timeline: ITimelineEvent[];
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: String, default: null },
    product_name: { type: String, required: true },
    product_image: { type: String, default: null },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    total_price: { type: Number, required: true },
  },
  { _id: true }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryArea: { type: String, enum: ['dhaka', 'outside'], required: true },
    fullAddress: { type: String, required: true },
  },
  { _id: false }
);

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    status: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updated_by: { type: String, default: 'Admin' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: String, default: null },
    order_number: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    subtotal: { type: Number, required: true },
    delivery_charge: { type: Number, required: true },
    discount_amount: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['cod', 'bkash', 'nagad'], required: true },
    payment_status: {
      type: String,
      enum: ['unpaid', 'pending_verification', 'paid', 'refunded'],
      default: 'unpaid',
    },
    shipping_address: { type: ShippingAddressSchema, required: true },
    transaction_id: { type: String, default: null },
    coupon_code: { type: String, default: null },
    courier: { type: String, default: null },
    tracking_number: { type: String, default: null },
    delivery_status: { type: String, default: null },
    notes: { type: String, default: null },
    admin_notes: { type: String, default: null },
    order_items: [OrderItemSchema],
    timeline: { type: [TimelineEventSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ status: 1, created_at: -1 });
OrderSchema.index({ payment_status: 1 });

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Order;
}

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
