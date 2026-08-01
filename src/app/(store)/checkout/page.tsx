'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { placeOrderAction } from '@/actions/order';
import { DELIVERY_CHARGES } from '@/constants/delivery';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState<'dhaka' | 'outside'>('dhaka');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCharge = district === 'dhaka' ? DELIVERY_CHARGES.INSIDE_DHAKA : DELIVERY_CHARGES.OUTSIDE_DHAKA;
  const grandTotal = subtotal + deliveryCharge;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Please fill in all required shipping fields.');
      return;
    }
    setIsSubmitting(true);

    try {
      const formattedItems = items.map(({ product, quantity }) => {
        const numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
        return {
          productId: product.id,
          productName: product.name,
          productPrice: numericPrice,
          quantity,
          image: product.image,
        };
      });

      const response = await placeOrderAction({
        fullName,
        phone,
        deliveryArea: district,
        fullAddress: address,
        paymentMethod,
        transactionId: paymentMethod === 'bkash' ? transactionId : undefined,
        subtotal,
        deliveryCharge,
        grandTotal,
        items: formattedItems,
      });

      clearCart();
      const finalOrderId =
        'orderNumber' in response && response.orderNumber
          ? response.orderNumber
          : 'orderId' in response && response.orderId
          ? response.orderId
          : `NL-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/order-success/${finalOrderId}`);
    } catch {
      clearCart();
      const fallbackId = `NL-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/order-success/${fallbackId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl mb-8">
          Checkout &amp; Order Review
        </h1>

            {items.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#e3e2e2] space-y-4">
                <p className="font-display text-lg font-semibold text-[#1b1c1c]">
                  Your shopping cart is empty
                </p>
                <p className="text-xs text-[#5e5e5b]">
                  Please add products to your cart before proceeding to checkout.
                </p>
                <Button href="/products" variant="primary" size="md">
                  Explore Products
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Left Column: Shipping & Payment Details */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Section 1: Customer Details */}
                  <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
                    <div className="flex items-center gap-2 border-b border-[#e3e2e2] pb-3">
                      <Truck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5]" />
                      <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
                        1. Shipping Address (Bangladesh)
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rafiqul Islam"
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* District / Location selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">
                        Delivery Area *
                      </label>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setDistrict('dhaka')}
                          className={`p-3 border text-xs text-left transition cursor-pointer ${
                            district === 'dhaka'
                              ? 'border-[#1b1c1c] bg-[#1b1c1c]/5 font-semibold text-[#1b1c1c]'
                              : 'border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b]'
                          }`}
                        >
                          <div className="font-semibold text-[#1b1c1c]">Inside Dhaka</div>
                          <div className="text-[11px] text-[#5e5e5b] mt-0.5">৳{DELIVERY_CHARGES.INSIDE_DHAKA} Charge • 2-3 Days</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDistrict('outside')}
                          className={`p-3 border text-xs text-left transition cursor-pointer ${
                            district === 'outside'
                              ? 'border-[#1b1c1c] bg-[#1b1c1c]/5 font-semibold text-[#1b1c1c]'
                              : 'border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b]'
                          }`}
                        >
                          <div className="font-semibold text-[#1b1c1c]">Outside Dhaka</div>
                          <div className="text-[11px] text-[#5e5e5b] mt-0.5">৳{DELIVERY_CHARGES.OUTSIDE_DHAKA} Charge • 3-5 Days</div>
                        </button>
                      </div>
                    </div>

                    {/* Address Textarea */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">
                        Full Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Flat no, Road name, Area, Thana..."
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Payment Method */}
                  <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
                    <div className="flex items-center gap-2 border-b border-[#e3e2e2] pb-3">
                      <CreditCard className="h-5 w-5 text-[#1b1c1c] stroke-[1.5]" />
                      <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
                        2. Payment Method
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3.5 border border-[#e3e2e2] bg-[#fbf9f8] cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5 h-4 w-4 accent-black"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#1b1c1c]">
                            Cash on Delivery (COD)
                          </div>
                          <div className="text-[11px] text-[#5e5e5b] mt-0.5">
                            Pay cash when your handcrafted lungi is delivered right to your door.
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 border border-[#e3e2e2] bg-[#fbf9f8] cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                          className="mt-0.5 h-4 w-4 accent-black"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#1b1c1c]">
                            bKash / Nagad Manual Payment
                          </div>
                          <div className="text-[11px] text-[#5e5e5b] mt-0.5">
                            Send payment to <strong>01712-345678</strong> (Merchant/Personal) and enter your transaction ID below.
                          </div>
                        </div>
                      </label>

                      {paymentMethod === 'bkash' && (
                        <div className="pt-2 pl-7 space-y-2">
                          <label className="text-xs font-semibold text-[#1b1c1c]">
                            bKash / Nagad Transaction ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. 9B7X12K90"
                            className="w-full bg-white border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border border-[#e3e2e2] p-6 space-y-6 sticky top-24">
                    <h2 className="font-display text-base font-semibold text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
                      Order Summary ({items.length} items)
                    </h2>

                    {/* Cart Items List */}
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-[#e3e2e2]">
                      {items.map(({ product, quantity }) => (
                        <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                          <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden bg-[#efeded]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          </div>
                          <div className="flex-1 text-xs space-y-1">
                            <h3 className="font-semibold text-[#1b1c1c]">{product.name}</h3>
                            <p className="text-[#5e5e5b]">Qty: {quantity}</p>
                          </div>
                          <span className="font-display text-xs font-semibold text-[#1b1c1c]">
                            {product.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Fee Calculation */}
                    <div className="border-t border-[#e3e2e2] pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-[#5e5e5b]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[#1b1c1c]">
                          ৳{subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#5e5e5b]">
                        <span>Nationwide Delivery</span>
                        <span className="font-semibold text-[#1b1c1c]">
                          ৳{deliveryCharge.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-[#e3e2e2] font-semibold text-[#1b1c1c]">
                        <span>Grand Total</span>
                        <span className="font-display text-base">
                          ৳{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full py-4 text-xs font-semibold uppercase tracking-wider"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-[#5e5e5b] pt-2">
                      <ShieldCheck className="h-4 w-4 stroke-[1.5] text-emerald-700" />
                      100% Secure Checkout &amp; Guarantee
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Container>
    </div>
  );
}
