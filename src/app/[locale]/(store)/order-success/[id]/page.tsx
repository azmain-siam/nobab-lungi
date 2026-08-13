import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { getOrderById } from '@/services/order-service';
import { OrderSuccessCard } from '@/components/shared/order-success-card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Order Confirmed — Nabab Lungi',
  description: 'Thank you for your purchase! Your order has been placed successfully.',
};

function maskPhone(phone: string | null): string | null {
  if (!phone || phone.length < 6) return phone;
  return `${phone.slice(0, 3)}******${phone.slice(-2)}`;
}

function maskTrxId(trxId: string | null): string | null {
  if (!trxId || trxId.length < 5) return trxId;
  return `${trxId.slice(0, 3)}*****`;
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const order = await getOrderById(id);

  const orderNumber = order ? order.order_number : id;
  const totalAmount = order ? `৳${order.total.toLocaleString('en-BD')}` : null;
  const paymentMethod = order ? order.payment_method : null;

  const currentUserId = (session?.user as { id?: string })?.id;
  const currentUserRole = (session?.user as { role?: string })?.role;
  const isOwnerOrAdmin =
    Boolean(order && order.user_id && currentUserId && (order.user_id === currentUserId || currentUserRole === 'admin'));

  const rawTrxId = order ? order.transaction_id : null;
  const rawPhone = order ? order.shipping_address.phone : null;

  const transactionId = isOwnerOrAdmin ? rawTrxId : maskTrxId(rawTrxId);
  const customerPhone = isOwnerOrAdmin ? rawPhone : maskPhone(rawPhone);

  return (
    <div className="py-16 lg:py-24">
      <Container>
        <OrderSuccessCard
          orderNumber={orderNumber}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          transactionId={transactionId}
          customerPhone={customerPhone}
        />
      </Container>
    </div>
  );
}

