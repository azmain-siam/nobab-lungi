import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Coupon } from '@/models/Coupon';
import mongoose from 'mongoose';

export interface DashboardMetrics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalProducts: number;
    totalCustomers: number;
    activeCoupons: number;
    lowStockCount: number;
  };
  revenueOverview: {
    today: number;
    last7Days: number;
    last30Days: number;
    chartData: { date: string; label: string; amount: number }[];
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
  }[];
  lowStockProducts: {
    id: string;
    name: string;
    sku: string;
    stock: number;
    coverImage: string | null;
  }[];
  topSellingProducts: {
    id: string;
    name: string;
    image: string | null;
    unitsSold: number;
    revenue: number;
  }[];
  recentCustomers: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
  }[];
  systemStatus: {
    dbConnected: boolean;
    authWorking: boolean;
    googleLoginEnabled: boolean;
    mediaConnected: boolean;
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Run parallel DB queries
    const [
      totalOrdersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      totalProductsCount,
      totalCustomersCount,
      activeCouponsCount,
      lowStockCount,
      revenueAggregation,
      todayRevenueAgg,
      last7DaysRevenueAgg,
      last30DaysRevenueAgg,
      recentOrdersDocs,
      lowStockDocs,
      topSellingAgg,
      recentCustomersDocs,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Coupon.countDocuments({ is_active: true }),
      Product.countDocuments({ stock: { $lte: 5 } }),
      // Total Revenue (excluding cancelled)
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
      // Today Revenue
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, created_at: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
      // 7 Days Revenue
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, created_at: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
      // 30 Days Revenue
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, created_at: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
      // Recent 6 orders
      Order.find().sort({ created_at: -1 }).limit(6).lean(),
      // Low stock products (<= 10)
      Product.find({ stock: { $lte: 10 } }).sort({ stock: 1 }).limit(5).lean(),
      // Top selling products aggregation from order items
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$order_items' },
        {
          $group: {
            _id: '$order_items.product_id',
            name: { $first: '$order_items.product_name' },
            image: { $first: '$order_items.product_image' },
            unitsSold: { $sum: '$order_items.quantity' },
            revenue: { $sum: '$order_items.total_price' },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 },
      ]),
      // Recent 5 customers
      User.find({ role: 'customer' }).sort({ created_at: -1 }).limit(5).lean(),
    ]);

    // Build 7-day revenue chart breakdown
    const chartData: { date: string; label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const nextD = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

      const dayRevenue = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            created_at: { $gte: d, $lt: nextD },
          },
        },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]);

      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      chartData.push({
        date: d.toISOString().split('T')[0],
        label,
        amount: dayRevenue[0]?.total || 0,
      });
    }

    return {
      summary: {
        totalRevenue: revenueAggregation[0]?.total || 0,
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount,
        activeCoupons: activeCouponsCount,
        lowStockCount,
      },
      revenueOverview: {
        today: todayRevenueAgg[0]?.total || 0,
        last7Days: last7DaysRevenueAgg[0]?.total || 0,
        last30Days: last30DaysRevenueAgg[0]?.total || 0,
        chartData,
      },
      recentOrders: recentOrdersDocs.map((ord) => ({
        id: ord._id.toString(),
        orderNumber: ord.order_number,
        customerName: ord.shipping_address?.fullName || 'Guest Customer',
        customerPhone: ord.shipping_address?.phone || 'N/A',
        totalAmount: ord.total_amount,
        status: ord.status,
        paymentStatus: ord.payment_status,
        paymentMethod: ord.payment_method,
        createdAt: ord.created_at ? new Date(ord.created_at).toISOString() : new Date().toISOString(),
      })),
      lowStockProducts: lowStockDocs.map((p) => {
        const coverImg = p.product_images?.find((img) => img.is_cover)?.url || p.product_images?.[0]?.url || null;
        return {
          id: p._id.toString(),
          name: p.name,
          sku: p.sku || 'N/A',
          stock: p.stock,
          coverImage: coverImg,
        };
      }),
      topSellingProducts: topSellingAgg.map((item) => ({
        id: item._id ? item._id.toString() : item.name,
        name: item.name,
        image: item.image || null,
        unitsSold: item.unitsSold || 0,
        revenue: item.revenue || 0,
      })),
      recentCustomers: recentCustomersDocs.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        email: c.email,
        avatarUrl: c.avatar_url || null,
        createdAt: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
      })),
      systemStatus: {
        dbConnected: mongoose.connection.readyState === 1,
        authWorking: true,
        googleLoginEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        mediaConnected: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
      },
    };
  } catch (error) {
    console.error('Error computing dashboard metrics:', error);
    return {
      summary: {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        activeCoupons: 0,
        lowStockCount: 0,
      },
      revenueOverview: {
        today: 0,
        last7Days: 0,
        last30Days: 0,
        chartData: [],
      },
      recentOrders: [],
      lowStockProducts: [],
      topSellingProducts: [],
      recentCustomers: [],
      systemStatus: {
        dbConnected: mongoose.connection.readyState === 1,
        authWorking: true,
        googleLoginEnabled: false,
        mediaConnected: false,
      },
    };
  }
}
