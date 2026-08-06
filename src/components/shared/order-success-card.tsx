'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Package, Truck, ArrowRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSuccessCardProps {
  orderNumber: string;
  totalAmount: string | null;
  paymentMethod: string | null;
  transactionId: string | null;
  customerPhone: string | null;
}

export function OrderSuccessCard({
  orderNumber,
  totalAmount,
  paymentMethod,
  transactionId,
  customerPhone,
}: OrderSuccessCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="mx-auto max-w-2xl text-center space-y-6 bg-white border border-[#e3e2e2] p-8 sm:p-12 shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-8 w-8 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block">
            ✓ Order Confirmed
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
            Thank You for Your Order!
          </h1>
          <p className="font-mono text-sm font-bold text-[#1b1c1c] pt-1">
            Order Number: <span className="text-black underline">#{orderNumber}</span>
          </p>
        </div>
        <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 text-xs text-[#5e5e5b] leading-relaxed max-w-lg mx-auto">
          {paymentMethod === 'cod' || !paymentMethod ? (
            <p>
              We have received your order details.{' '}
              <strong className="text-[#1b1c1c]">
                We&apos;ll call you{customerPhone ? ` at ${customerPhone}` : ''} to confirm your order before dispatch.
              </strong>
            </p>
          ) : (
            <p>
              Your <strong className="uppercase text-[#1b1c1c]">{paymentMethod}</strong> payment
              {transactionId ? ` (TrxID: ${transactionId})` : ''} has been recorded. Our team will verify your payment and contact you{customerPhone ? ` at ${customerPhone}` : ''} to confirm delivery.
            </p>
          )}
        </div>
        <div className="border-t border-b border-[#e3e2e2] py-6 my-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left text-xs">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#1b1c1c]">Estimated Delivery</h4>
              <p className="text-[#5e5e5b] mt-0.5">2 - 4 Business Days</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneCall className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#1b1c1c]">Phone Confirmation</h4>
              <p className="text-[#5e5e5b] mt-0.5">Prior to dispatch</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#1b1c1c]">Total Payable</h4>
              <p className="font-display font-bold text-sm text-[#1b1c1c] mt-0.5">
                {totalAmount || 'As per invoice'}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/products" variant="primary" size="lg" className="gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/account/orders" variant="secondary" size="lg">
            View Order History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl text-center space-y-6 bg-white border border-[#e3e2e2] p-8 sm:p-12 shadow-xs"
    >
      {/* Sequenced Icon Entrance */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
      >
        <CheckCircle2 className="h-8 w-8 stroke-[2]" />
      </motion.div>

      {/* Sequenced Title & Order Number Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block">
          ✓ Order Confirmed
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
          Thank You for Your Order!
        </h1>
        <p className="font-mono text-sm font-bold text-[#1b1c1c] pt-1">
          Order Number: <span className="text-black underline">#{orderNumber}</span>
        </p>
      </motion.div>

      {/* Sequenced Confirmation Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 text-xs text-[#5e5e5b] leading-relaxed max-w-lg mx-auto"
      >
        {paymentMethod === 'cod' || !paymentMethod ? (
          <p>
            We have received your order details.{' '}
            <strong className="text-[#1b1c1c]">
              We&apos;ll call you{customerPhone ? ` at ${customerPhone}` : ''} to confirm your order before dispatch.
            </strong>
          </p>
        ) : (
          <p>
            Your <strong className="uppercase text-[#1b1c1c]">{paymentMethod}</strong> payment
            {transactionId ? ` (TrxID: ${transactionId})` : ''} has been recorded. Our team will verify your payment and contact you{customerPhone ? ` at ${customerPhone}` : ''} to confirm delivery.
          </p>
        )}
      </motion.div>

      {/* Delivery & Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-b border-[#e3e2e2] py-6 my-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left text-xs"
      >
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">Estimated Delivery</h4>
            <p className="text-[#5e5e5b] mt-0.5">2 - 4 Business Days</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PhoneCall className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">Phone Confirmation</h4>
            <p className="text-[#5e5e5b] mt-0.5">Prior to dispatch</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">Total Payable</h4>
            <p className="font-display font-bold text-sm text-[#1b1c1c] mt-0.5">
              {totalAmount || 'As per invoice'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="pt-2 flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Button href="/products" variant="primary" size="lg" className="gap-2">
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button href="/account/orders" variant="secondary" size="lg">
          View Order History
        </Button>
      </motion.div>
    </motion.div>
  );
}
