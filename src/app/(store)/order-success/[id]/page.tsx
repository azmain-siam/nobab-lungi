import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { getOrderById } from '@/services/order-service';
import { OrderSuccessCard } from '@/components/shared/order-success-card';

export const metadata: Metadata = {
  title: 'Order Confirmed — Nabab Lungi',
  description: 'Thank you for your purchase! Your order has been placed successfully.',
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  const orderNumber = order ? order.order_number : id;
  const totalAmount = order ? `৳${order.total.toLocaleString('en-BD')}` : null;
  const paymentMethod = order ? order.payment_method : null;
  const transactionId = order ? order.transaction_id : null;
  const customerPhone = order ? order.shipping_address.phone : null;

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
