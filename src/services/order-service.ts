import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import type { OrderWithItems, OrderStatus, PaymentStatus, ShippingAddressSnapshot } from '@/types';

export interface CreateOrderParams {
  userId?: string;
  fullName: string;
  phone: string;
  deliveryArea: 'dhaka' | 'outside';
  fullAddress: string;
  paymentMethod: 'cod' | 'bkash';
  transactionId?: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  items: {
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    image: string;
  }[];
}

function mapOrderToOrderWithItems(doc: Record<string, unknown>): OrderWithItems {
  const addr = doc.shipping_address as Record<string, unknown> | undefined;
  const items = (doc.order_items as Record<string, unknown>[]) || [];

  const shippingAddress: ShippingAddressSnapshot = {
    name: (addr?.fullName as string) || '',
    phone: (addr?.phone as string) || '',
    district: addr?.deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
    upazila: '',
    address: (addr?.fullAddress as string) || '',
    postal_code: null,
  };

  return {
    id: String(doc._id),
    user_id: (doc.user_id as string) ?? null,
    order_number: doc.order_number as string,
    status: doc.status as OrderStatus,
    subtotal: doc.subtotal as number,
    delivery_charge: doc.delivery_charge as number,
    discount: (doc.discount_amount as number) ?? 0,
    total: doc.total_amount as number,
    payment_method: doc.payment_method as 'cod' | 'bkash' | 'nagad',
    payment_status: doc.payment_status as PaymentStatus,
    shipping_address: shippingAddress,
    transaction_id: (doc.transaction_id as string) ?? null,
    coupon_code: (doc.coupon_code as string) ?? null,
    notes: (doc.notes as string) ?? null,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
    order_items: items.map((item) => ({
      id: item._id ? String(item._id) : String(doc._id),
      order_id: String(doc._id),
      product_id: (item.product_id as string) ?? null,
      product_name: item.product_name as string,
      product_image: (item.product_image as string) ?? null,
      price: item.unit_price as number,
      quantity: item.quantity as number,
    })),
  };
}

export async function createOrder(params: CreateOrderParams): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
  try {
    await connectToDatabase();

    const orderNumber = `NL-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderItems = params.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.image,
      unit_price: Math.round(item.productPrice * 100),
      quantity: item.quantity,
      total_price: Math.round(item.productPrice * item.quantity * 100),
    }));

    const newOrder = await Order.create({
      user_id: params.userId ?? null,
      order_number: orderNumber,
      status: 'pending',
      payment_method: params.paymentMethod,
      payment_status: params.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
      subtotal: Math.round(params.subtotal * 100),
      delivery_charge: Math.round(params.deliveryCharge * 100),
      discount_amount: 0,
      total_amount: Math.round(params.grandTotal * 100),
      shipping_address: {
        fullName: params.fullName,
        phone: params.phone,
        deliveryArea: params.deliveryArea,
        fullAddress: params.fullAddress,
      },
      transaction_id: params.transactionId || null,
      notes: params.transactionId ? `bKash TrxID: ${params.transactionId}` : null,
      order_items: orderItems,
    });

    return {
      success: true,
      orderId: newOrder._id.toString(),
      orderNumber: (newOrder as unknown as { order_number: string }).order_number,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while placing order.';
    return { success: false, error: message };
  }
}

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  try {
    await connectToDatabase();
    const orders = await Order.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    return orders.map((o) => mapOrderToOrderWithItems(o as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  try {
    await connectToDatabase();

    const query = orderId.startsWith('NL-') ? { order_number: orderId } : { _id: orderId };
    const order = await Order.findOne(query).lean();

    if (!order) return null;
    return mapOrderToOrderWithItems(order as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    const query = orderId.startsWith('NL-') ? { order_number: orderId } : { _id: orderId };

    await Order.findOneAndUpdate(query, {
      $set: { status, updated_at: new Date() },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order status.';
    return { success: false, error: message };
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    const query = orderId.startsWith('NL-') ? { order_number: orderId } : { _id: orderId };

    await Order.findOneAndUpdate(query, {
      $set: { payment_status: paymentStatus, updated_at: new Date() },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update payment status.';
    return { success: false, error: message };
  }
}
