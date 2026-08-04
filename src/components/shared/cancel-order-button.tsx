'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { cancelCustomerOrderAction } from '@/actions/order';
import { AlertTriangle, X } from 'lucide-react';

interface CancelOrderButtonProps {
  orderId: string;
  orderNumber: string;
}

export function CancelOrderButton({ orderId, orderNumber }: CancelOrderButtonProps) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      const res = await cancelCustomerOrderAction(orderId);
      if (res.success) {
        toast.success(`Order #${orderNumber} has been cancelled.`);
        setIsOpen(false);
      } else {
        toast.error(res.error || 'Failed to cancel order.');
      }
    } catch {
      toast.error('An unexpected error occurred while cancelling order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold uppercase tracking-wider text-xs"
      >
        Cancel Order
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#e3e2e2] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-3">
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                <AlertTriangle className="h-5 w-5 stroke-[1.5]" />
                Cancel Order #{orderNumber}?
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#5e5e5b] hover:text-[#1b1c1c]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#5e5e5b] leading-relaxed">
              Are you sure you want to cancel order <strong className="text-[#1b1c1c]">#{orderNumber}</strong>?
              This action cannot be undone and reserved stock will be returned to inventory.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Keep Order
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
