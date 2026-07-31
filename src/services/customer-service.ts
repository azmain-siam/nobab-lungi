import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import type { CustomerListItem, CustomerDetails, CustomerAddressItem, OrderWithItems, OrderStatus, PaymentStatus, ShippingAddressSnapshot, TimelineEvent } from '@/types';

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

export async function getAdminCustomers(options?: {
  search?: string;
  filter?: string; // 'all' | 'with_orders' | 'without_orders' | 'new_customers'
  sort?: string;   // 'newest' | 'oldest' | 'most_orders' | 'highest_spent' | 'alphabetical'
  page?: number;
  limit?: number;
}): Promise<{ customers: CustomerListItem[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const filter = options?.filter || 'all';
    const sort = options?.sort || 'newest';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 8);

    const userQuery: Record<string, unknown> = {
      role: 'customer',
    };

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter === 'new_customers') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      userQuery.created_at = { $gte: thirtyDaysAgo };
    }

    // Fetch user documents matching userQuery
    const users = await User.find(userQuery).lean();

    // Aggregate orders metrics per user
    const customerList: CustomerListItem[] = await Promise.all(
      users.map(async (u) => {
        const userIdStr = String(u._id);

        const orders = await Order.find({
          $or: [
            { user_id: userIdStr },
            { 'shipping_address.phone': u.phone },
            { 'shipping_address.fullName': u.name },
          ],
        })
          .sort({ created_at: -1 })
          .lean();

        const validOrders = orders.filter((o) => o.status !== 'cancelled');
        const total_orders = validOrders.length;

        const total_spent = validOrders.reduce((sum, o) => {
          const amt = (o.total_amount as number) ?? 0;
          const cleanAmt = amt > 100000 ? Math.round(amt / 100) : amt;
          return sum + cleanAmt;
        }, 0);

        const last_order_date = orders.length > 0 && orders[0].created_at
          ? new Date(orders[0].created_at as Date).toISOString()
          : null;

        return {
          id: userIdStr,
          name: u.name,
          email: u.email,
          phone: u.phone || null,
          avatar_url: u.avatar_url || null,
          role: u.role,
          total_orders,
          total_spent,
          last_order_date,
          account_status: 'Active',
          created_at: u.created_at ? new Date(u.created_at as Date).toISOString() : new Date().toISOString(),
        };
      })
    );

    // Apply Filter rules based on order counts
    let filteredCustomers = customerList;
    if (filter === 'with_orders') {
      filteredCustomers = customerList.filter((c) => c.total_orders > 0);
    } else if (filter === 'without_orders') {
      filteredCustomers = customerList.filter((c) => c.total_orders === 0);
    }

    // Apply Sorting
    filteredCustomers.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_orders':
          return b.total_orders - a.total_orders;
        case 'highest_spent':
          return b.total_spent - a.total_spent;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    const total = filteredCustomers.length;
    const pages = Math.ceil(total / limit) || 1;
    const paginatedCustomers = filteredCustomers.slice((page - 1) * limit, page * limit);

    return { customers: paginatedCustomers, total, pages };
  } catch (error) {
    console.error('Error fetching admin customers:', error);
    return { customers: [], total: 0, pages: 1 };
  }
}

export async function getCustomerDetails(customerId: string): Promise<CustomerDetails | null> {
  try {
    await connectToDatabase();

    const user = await User.findById(customerId).lean();
    if (!user) return null;

    const userIdStr = String(user._id);

    // Query customer orders
    const rawOrders = await Order.find({
      $or: [
        { user_id: userIdStr },
        { 'shipping_address.phone': user.phone },
        { 'shipping_address.fullName': user.name },
      ],
    })
      .sort({ created_at: -1 })
      .lean();

    const recent_orders = rawOrders.map((o) =>
      mapOrderToOrderWithItems(o as unknown as Record<string, unknown>)
    );

    const validOrders = recent_orders.filter((o) => o.status !== 'cancelled');
    const total_orders = validOrders.length;

    const total_spent = validOrders.reduce((sum, o) => sum + o.total, 0);
    const avg_order_value = total_orders > 0 ? Math.round(total_spent / total_orders) : 0;
    const last_order_date = recent_orders.length > 0 ? recent_orders[0].created_at : null;

    // Aggregate unique shipping addresses from order history
    const addressMap = new Map<string, CustomerAddressItem>();

    recent_orders.forEach((o, idx) => {
      const addrKey = `${o.shipping_address.phone}-${o.shipping_address.address}`;
      if (!addressMap.has(addrKey)) {
        addressMap.set(addrKey, {
          id: `addr-${idx + 1}`,
          name: o.shipping_address.name,
          phone: o.shipping_address.phone,
          district: o.shipping_address.district,
          address: o.shipping_address.address,
          is_default: idx === 0,
        });
      }
    });

    const addresses = Array.from(addressMap.values());

    return {
      id: userIdStr,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      avatar_url: user.avatar_url || null,
      role: user.role,
      created_at: user.created_at ? new Date(user.created_at as Date).toISOString() : new Date().toISOString(),
      stats: {
        total_orders,
        total_spent,
        avg_order_value,
        last_order_date,
      },
      addresses,
      recent_orders,
    };
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return null;
  }
}
