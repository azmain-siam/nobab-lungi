'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { placeOrderAction } from '@/actions/order';
import { validateCouponAction } from '@/actions/coupon';
import { getCheckoutSettingsAction } from '@/actions/settings';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Copy, Check, Tag, AlertCircle } from 'lucide-react';

import { useUser } from '@/features/auth/hooks/use-user';
import { getUserAddressesAction } from '@/actions/address';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useUser();

  // Shipping Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState<'dhaka' | 'outside'>('dhaka');
  const [address, setAddress] = useState('');

  // Settings State
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(70);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(130);
  const [bkashNumber, setBkashNumber] = useState('01700000000');
  const [nagadNumber, setNagadNumber] = useState('01700000000');

  // Payment Selection State: mainType = 'cod' | 'mobile_banking'
  const [mainPaymentType, setMainPaymentType] = useState<'cod' | 'mobile_banking'>('cod');
  const [mobileProvider, setMobileProvider] = useState<'bkash' | 'nagad'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Settings on Mount
  useEffect(() => {
    getCheckoutSettingsAction().then((s) => {
      if (s) {
        setInsideDhakaCharge(s.insideDhakaCharge);
        setOutsideDhakaCharge(s.outsideDhakaCharge);
        setBkashNumber(s.bkashMerchantNumber);
        setNagadNumber(s.nagadMerchantNumber);
      }
    });
  }, []);

  // Pre-fill user details & default address when authenticated
  useEffect(() => {
    const initialName = profile?.name || user?.user_metadata?.full_name || '';
    const initialPhone = profile?.phone || '';

    if (initialName || initialPhone) {
      queueMicrotask(() => {
        if (initialName) setFullName((prev) => prev || initialName);
        if (initialPhone) setPhone((prev) => prev || initialPhone);
      });
    }

    getUserAddressesAction().then((res) => {
      if (res.success && res.addresses && res.addresses.length > 0) {
        const defaultAddr = res.addresses.find((a) => a.isDefault) || res.addresses[0];
        if (defaultAddr) {
          setFullName((prev) => prev || defaultAddr.name);
          setPhone((prev) => prev || defaultAddr.phone);
          setAddress((prev) => prev || defaultAddr.fullAddress);
          setDistrict(defaultAddr.area === 'Inside Dhaka' ? 'dhaka' : 'outside');
        }
      }
    });
  }, [user, profile]);

  const deliveryCharge = district === 'dhaka' ? insideDhakaCharge : outsideDhakaCharge;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + deliveryCharge;

  // Actual payment_method passed to backend: 'cod' | 'bkash' | 'nagad'
  const selectedPaymentMethod: 'cod' | 'bkash' | 'nagad' =
    mainPaymentType === 'cod' ? 'cod' : mobileProvider;

  // Handle Copy Number
  const currentMerchantNumber = mobileProvider === 'bkash' ? bkashNumber : nagadNumber;
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentMerchantNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Handle Coupon Apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    const res = await validateCouponAction(couponCodeInput, subtotal);
    if (res.success && res.discountAmount) {
      setAppliedCouponCode(res.code || couponCodeInput.toUpperCase());
      setCouponDiscount(res.discountAmount);
      setCouponError(null);
    } else {
      setCouponError(res.error || 'Failed to apply coupon.');
      setCouponDiscount(0);
      setAppliedCouponCode(null);
    }
    setIsApplyingCoupon(false);
  };

  // Handle Order Submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in all required shipping address fields.');
      return;
    }

    if (phone.trim().replace(/\D/g, '').length < 11) {
      setFormError('Please enter a valid 11-digit Bangladeshi phone number (e.g. 017XXXXXXXX).');
      return;
    }

    if (mainPaymentType === 'mobile_banking') {
      if (!transactionId.trim() || transactionId.trim().length < 3) {
        setFormError(`Please enter your ${mobileProvider === 'bkash' ? 'bKash' : 'Nagad'} Transaction ID.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formattedItems = items.map(({ product, quantity }) => {
        const numericPrice =
          parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
        return {
          productId: product.id,
          productName: product.name,
          productPrice: numericPrice,
          quantity,
          image: product.image,
        };
      });

      const response = await placeOrderAction({
        fullName: fullName.trim(),
        phone: phone.trim(),
        deliveryArea: district,
        fullAddress: address.trim(),
        paymentMethod: selectedPaymentMethod,
        transactionId: mainPaymentType === 'mobile_banking' ? transactionId.trim() : undefined,
        couponCode: appliedCouponCode || undefined,
        subtotal,
        deliveryCharge,
        grandTotal,
        items: formattedItems,
      });

      if (!response.success) {
        setFormError(response.error || 'Failed to place order. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      clearCart();
      const finalOrderId = response.orderNumber || response.orderId || `NL-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/order-success/${finalOrderId}`);
    } catch (err) {
      console.error('Order submission error:', err);
      setFormError('An error occurred while placing order. Please try again.');
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
              {/* Section 1: Customer & Shipping Details */}
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
                      Phone Number (BD) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX or +88017XXXXXXXX"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
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
                      <div className="text-[11px] text-[#5e5e5b] mt-0.5">৳{insideDhakaCharge} Charge • 1-2 Days</div>
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
                      <div className="text-[11px] text-[#5e5e5b] mt-0.5">৳{outsideDhakaCharge} Charge • 2-5 Days</div>
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

                {/* Main Method Selector: COD vs Mobile Banking */}
                <div className="space-y-3">
                  {/* Radio Option 1: COD */}
                  <label className="flex items-start gap-3 p-4 border border-[#e3e2e2] bg-[#fbf9f8] cursor-pointer hover:border-[#1b1c1c] transition">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={mainPaymentType === 'cod'}
                      onChange={() => {
                        setMainPaymentType('cod');
                        setTransactionId('');
                      }}
                      className="mt-0.5 h-4 w-4 accent-black"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#1b1c1c]">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-[11px] text-[#5e5e5b] mt-0.5">
                        Pay cash when your handcrafted lungi is delivered right to your doorstep. We will call you to confirm your order before dispatch.
                      </div>
                    </div>
                  </label>

                  {/* Radio Option 2: Mobile Banking */}
                  <label className="flex items-start gap-3 p-4 border border-[#e3e2e2] bg-[#fbf9f8] cursor-pointer hover:border-[#1b1c1c] transition">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={mainPaymentType === 'mobile_banking'}
                      onChange={() => setMainPaymentType('mobile_banking')}
                      className="mt-0.5 h-4 w-4 accent-black"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#1b1c1c]">
                        Mobile Banking (bKash / Nagad)
                      </div>
                      <div className="text-[11px] text-[#5e5e5b] mt-0.5">
                        Send payment directly to our bKash or Nagad merchant account and enter your transaction ID.
                      </div>
                    </div>
                  </label>

                  {/* Revealed Mobile Banking Provider Cards & Form */}
                  {mainPaymentType === 'mobile_banking' && (
                    <div className="pt-3 space-y-4 pl-2 sm:pl-4 border-l-2 border-[#1b1c1c] ml-3">
                      <label className="block text-xs font-semibold text-[#1b1c1c]">
                        Select Mobile Banking Provider *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* bKash Card */}
                        <button
                          type="button"
                          onClick={() => setMobileProvider('bkash')}
                          className={`p-4 border flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                            mobileProvider === 'bkash'
                              ? 'border-[#1b1c1c] bg-[#1b1c1c]/5 shadow-xs ring-1 ring-[#1b1c1c]'
                              : 'border-[#e3e2e2] bg-white hover:border-[#1b1c1c]/50'
                          }`}
                        >
                          <div className="relative h-10 w-24">
                            <Image
                              src="/images/payment/bkash.svg"
                              alt="bKash"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#1b1c1c]">bKash</span>
                        </button>

                        {/* Nagad Card */}
                        <button
                          type="button"
                          onClick={() => setMobileProvider('nagad')}
                          className={`p-4 border flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                            mobileProvider === 'nagad'
                              ? 'border-[#1b1c1c] bg-[#1b1c1c]/5 shadow-xs ring-1 ring-[#1b1c1c]'
                              : 'border-[#e3e2e2] bg-white hover:border-[#1b1c1c]/50'
                          }`}
                        >
                          <div className="relative h-10 w-24">
                            <Image
                              src="/images/payment/nagad.svg"
                              alt="Nagad"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#1b1c1c]">Nagad</span>
                        </button>
                      </div>

                      {/* Instructions & Account Copy */}
                      <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 space-y-2 text-xs text-[#1b1c1c]">
                        <p className="font-medium">
                          Send <span className="font-bold text-amber-800">৳{grandTotal.toLocaleString('en-BD')}</span> to our official {mobileProvider === 'bkash' ? 'bKash' : 'Nagad'} account:
                        </p>
                        <div className="flex items-center justify-between bg-white border border-[#e3e2e2] px-3.5 py-2">
                          <span className="font-mono font-bold text-sm text-[#1b1c1c]">
                            {mobileProvider === 'bkash' ? 'bKash' : 'Nagad'}: {currentMerchantNumber}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyNumber}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#1b1c1c] hover:underline cursor-pointer"
                          >
                            {copiedNumber ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Transaction ID Input */}
                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">
                          {mobileProvider === 'bkash' ? 'bKash' : 'Nagad'} Transaction ID *
                        </label>
                        <input
                          type="text"
                          required={mainPaymentType === 'mobile_banking'}
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 9B7X12K90"
                          className="w-full bg-white border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] font-mono rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                        <p className="text-[11px] text-[#5e5e5b]">
                          Enter the SMS transaction ID received after completing your payment.
                        </p>
                      </div>
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
                <div className="space-y-4 max-h-64 overflow-y-auto pr-1 divide-y divide-[#e3e2e2]">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden bg-[#efeded]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="50px"
                        />
                      </div>
                      <div className="flex-1 text-xs space-y-0.5">
                        <h3 className="font-semibold text-[#1b1c1c]">{product.name}</h3>
                        <p className="text-[#5e5e5b]">Qty: {quantity}</p>
                      </div>
                      <span className="font-display text-xs font-semibold text-[#1b1c1c]">
                        {product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2 border-t border-[#e3e2e2]">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-3.5 w-3.5 text-[#5e5e5b]" />
                    <span className="text-xs font-semibold text-[#1b1c1c]">Have a Promo Code?</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {appliedCouponCode ? (
                      <motion.div
                        key="applied"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-emerald-800">
                          Coupon &quot;{appliedCouponCode}&quot; Applied
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedCouponCode(null);
                            setCouponDiscount(0);
                            setCouponCodeInput('');
                          }}
                          className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE"
                          className="flex-1 bg-[#fbf9f8] border border-[#e3e2e2] px-3 py-2 text-xs font-mono uppercase text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCodeInput.trim()}
                          className="px-4 py-2 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black active:scale-95 transition disabled:opacity-50 cursor-pointer"
                        >
                          {isApplyingCoupon ? '...' : 'Apply'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 text-[11px] font-medium text-rose-600"
                      >
                        {couponError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fee Calculation */}
                <div className="border-t border-[#e3e2e2] pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#5e5e5b]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1b1c1c]">
                      ৳{subtotal.toLocaleString('en-BD')}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount</span>
                      <span>-৳{couponDiscount.toLocaleString('en-BD')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5e5e5b]">
                    <span>Nationwide Delivery</span>
                    <span className="font-semibold text-[#1b1c1c]">
                      ৳{deliveryCharge.toLocaleString('en-BD')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm pt-3 border-t border-[#e3e2e2] font-semibold text-[#1b1c1c]">
                    <span>Grand Total</span>
                    <span className="font-display text-lg text-[#1b1c1c]">
                      ৳{grandTotal.toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>

                {/* Error Banner with Animated Shake & Reveal */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, 0] }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#5e5e5b] pt-1">
                  <ShieldCheck className="h-4 w-4 stroke-[1.5] text-emerald-700" />
                  Secure Order Processing
                </div>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
