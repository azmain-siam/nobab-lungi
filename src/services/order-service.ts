import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import type { OrderWithItems, OrderStatus, PaymentStatus, ShippingAddressSnapshot, TimelineEvent } from '@/types';

export interface CreateOrderParams {
  userId?: string;
  fullName: string;
  phone: string;
  deliveryArea: 'dhaka' | 'outside';
  fullAddress: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
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
  const rawTimeline = (doc.timeline as Record<string, unknown>[]) || [];

  const shippingAddress: ShippingAddressSnapshot = {
    name: (addr?.fullName as string) || (doc.user_name as string) || '',
    phone: (addr?.phone as string) || '',
    district: addr?.deliveryArea === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
    upazila: '',
    address: (addr?.fullAddress as string) || '',
    postal_code: null,
  };

  const timeline: TimelineEvent[] = rawTimeline.map((evt) => ({
    status: (evt.status as string) || '',
    message: (evt.message as string) || '',
    timestamp: evt.timestamp ? new Date(evt.timestamp as Date).toISOString() : new Date().toISOString(),
    updated_by: (evt.updated_by as string) || 'System',
  }));

  // Handle amount conversion if amounts were stored in paisa vs whole BDT
  const subtotalRaw = (doc.subtotal as number) ?? 0;
  const deliveryRaw = (doc.delivery_charge as number) ?? 0;
  const totalRaw = (doc.total_amount as number) ?? 0;
  const discountRaw = (doc.discount_amount as number) ?? 0;

  const subtotal = subtotalRaw > 100000 ? Math.round(subtotalRaw / 100) : subtotalRaw;
  const delivery_charge = deliveryRaw > 100000 ? Math.round(deliveryRaw / 100) : deliveryRaw;
  const total = totalRaw > 100000 ? Math.round(totalRaw / 100) : totalRaw;
  const discount = discountRaw > 100000 ? Math.round(discountRaw / 100) : discountRaw;

  return {
    id: String(doc._id),
    user_id: (doc.user_id as string) ?? null,
    order_number: doc.order_number as string,
    status: doc.status as OrderStatus,
    subtotal,
    delivery_charge,
    discount,
    total,
    payment_method: doc.payment_method as 'cod' | 'bkash' | 'nagad',
    payment_status: doc.payment_status as PaymentStatus,
    shipping_address: shippingAddress,
    transaction_id: (doc.transaction_id as string) ?? null,
    coupon_code: (doc.coupon_code as string) ?? null,
    courier: (doc.courier as string) ?? null,
    tracking_number: (doc.tracking_number as string) ?? null,
    delivery_status: (doc.delivery_status as string) ?? null,
    notes: (doc.notes as string) ?? null,
    admin_notes: (doc.admin_notes as string) ?? null,
    timeline,
    created_at: doc.created_at ? new Date(doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? new Date(doc.updated_at as Date).toISOString() : new Date().toISOString(),
    order_items: items.map((item) => {
      const priceRaw = (item.unit_price as number) ?? 0;
      const price = priceRaw > 100000 ? Math.round(priceRaw / 100) : priceRaw;

      return {
        id: item._id ? String(item._id) : String(doc._id),
        order_id: String(doc._id),
        product_id: (item.product_id as string) ?? null,
        product_name: item.product_name as string,
        product_image: (item.product_image as string) ?? null,
        price,
        quantity: item.quantity as number,
      };
    }),
  };
}

export async function createOrder(
  params: CreateOrderParams
): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
  try {
    await connectToDatabase();

    const orderNumber = `NL-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderItems = params.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.image,
      unit_price: item.productPrice,
      quantity: item.quantity,
      total_price: item.productPrice * item.quantity,
    }));

    const initialTimeline = [
      {
        status: 'pending',
        message: 'Order placed by customer.',
        timestamp: new Date(),
        updated_by: 'Customer',
      },
    ];

    const newOrder = await Order.create({
      user_id: params.userId ?? null,
      order_number: orderNumber,
      status: 'pending',
      payment_method: params.paymentMethod,
      payment_status: params.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
      subtotal: params.subtotal,
      delivery_charge: params.deliveryCharge,
      discount_amount: 0,
      total_amount: params.grandTotal,
      shipping_address: {
        fullName: params.fullName,
        phone: params.phone,
        deliveryArea: params.deliveryArea,
        fullAddress: params.fullAddress,
      },
      transaction_id: params.transactionId || null,
      notes: params.transactionId ? `Payment TrxID: ${params.transactionId}` : null,
      order_items: orderItems,
      timeline: initialTimeline,
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

export async function getAdminOrders(options?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sort?: string; // 'newest' | 'oldest' | 'highest_total' | 'lowest_total'
  page?: number;
  limit?: number;
}): Promise<{ orders: OrderWithItems[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const status = options?.status || 'all';
    const paymentStatus = options?.paymentStatus || 'all';
    const paymentMethod = options?.paymentMethod || 'all';
    const startDate = options?.startDate;
    const endDate = options?.endDate;
    const sort = options?.sort || 'newest';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 8);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { order_number: { $regex: search, $options: 'i' } },
        { 'shipping_address.fullName': { $regex: search, $options: 'i' } },
        { 'shipping_address.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (status !== 'all') {
      query.status = status;
    }

    if (paymentStatus !== 'all') {
      query.payment_status = paymentStatus;
    }

    if (paymentMethod !== 'all') {
      query.payment_method = paymentMethod;
    }

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      query.created_at = dateFilter;
    }

    let sortOption: Record<string, 1 | -1> = { created_at: -1 };

    switch (sort) {
      case 'oldest':
        sortOption = { created_at: 1 };
        break;
      case 'highest_total':
        sortOption = { total_amount: -1 };
        break;
      case 'lowest_total':
        sortOption = { total_amount: 1 };
        break;
      default:
        sortOption = { created_at: -1 };
    }

    const total = await Order.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const docs = await Order.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const orders = docs.map((doc) => mapOrderToOrderWithItems(doc as unknown as Record<string, unknown>));

    return { orders, total, pages };
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return { orders: [], total: 0, pages: 1 };
  }
}

export async function updateAdminOrder(
  orderId: string,
  updates: {
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    courier?: string | null;
    tracking_number?: string | null;
    delivery_status?: string | null;
    admin_notes?: string | null;
    timelineEvent?: { status: string; message: string; updated_by?: string };
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    const query = orderId.startsWith('NL-') ? { order_number: orderId } : { _id: orderId };

    const existingOrder = await Order.findOne(query);
    if (!existingOrder) {
      return { success: false, error: 'Order not found.' };
    }

    // Auto-restore inventory stock if order is cancelled or returned
    if (
      updates.status &&
      (updates.status === 'cancelled' || updates.status === 'returned') &&
      existingOrder.status !== 'cancelled' &&
      existingOrder.status !== 'returned'
    ) {
      for (const item of existingOrder.order_items) {
        if (item.product_id) {
          try {
            await Product.findByIdAndUpdate(item.product_id, {
              $inc: { stock: item.quantity },
            });
          } catch (err) {
            console.error(`Failed to restore stock for product ${item.product_id}:`, err);
          }
        }
      }
    }

    const updateFields: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (updates.status) updateFields.status = updates.status;
    if (updates.payment_status) updateFields.payment_status = updates.payment_status;
    if (updates.courier !== undefined) updateFields.courier = updates.courier;
    if (updates.tracking_number !== undefined) updateFields.tracking_number = updates.tracking_number;
    if (updates.delivery_status !== undefined) updateFields.delivery_status = updates.delivery_status;
    if (updates.admin_notes !== undefined) updateFields.admin_notes = updates.admin_notes;

    const updateQuery: Record<string, unknown> = { $set: updateFields };

    if (updates.timelineEvent) {
      updateQuery.$push = {
        timeline: {
          status: updates.timelineEvent.status,
          message: updates.timelineEvent.message,
          timestamp: new Date(),
          updated_by: updates.timelineEvent.updated_by || 'Admin',
        },
      };
    }

    await Order.findOneAndUpdate(query, updateQuery);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order.';
    return { success: false, error: message };
  }
}
