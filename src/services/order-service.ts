import { createClient } from '@/lib/supabase/server';
import type { OrderWithItems, OrderStatus, PaymentStatus } from '@/types';

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

export async function createOrder(params: CreateOrderParams): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const orderNumber = `NL-${Math.floor(100000 + Math.random() * 900000)}`;

    const shippingAddressJson = {
      fullName: params.fullName,
      phone: params.phone,
      deliveryArea: params.deliveryArea,
      fullAddress: params.fullAddress,
    };

    // Insert into orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: params.userId ?? null,
        order_number: orderNumber,
        status: 'pending',
        payment_method: params.paymentMethod,
        payment_status: params.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
        subtotal: Math.round(params.subtotal * 100), // store in poisha
        delivery_charge: Math.round(params.deliveryCharge * 100),
        discount_amount: 0,
        total_amount: Math.round(params.grandTotal * 100),
        shipping_address: shippingAddressJson,
        notes: params.transactionId ? `bKash TrxID: ${params.transactionId}` : null,
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('Order creation database error:', orderError);
      return { success: false, error: orderError.message };
    }

    // Insert order items
    if (order && params.items.length > 0) {
      const orderItems = params.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.image,
        unit_price: Math.round(item.productPrice * 100),
        quantity: item.quantity,
        total_price: Math.round(item.productPrice * item.quantity * 100),
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('Order items insertion error:', itemsError);
      }
    }

    return {
      success: true,
      orderId: order?.id ?? orderNumber,
      orderNumber: order?.order_number ?? orderNumber,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while placing order.';
    return { success: false, error: message };
  }
}

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return (data as OrderWithItems[]) ?? [];
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .single();

    return (data as OrderWithItems) ?? null;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order status.';
    return { success: false, error: message };
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update payment status.';
    return { success: false, error: message };
  }
}
