import { Truck, ShieldCheck, RefreshCw, Banknote } from 'lucide-react';

interface DeliveryInfoProps {
  insideDhakaCharge?: number;
  outsideDhakaCharge?: number;
  estimatedDeliveryTime?: string;
}

export function DeliveryInfo({
  insideDhakaCharge = 70,
  outsideDhakaCharge = 130,
  estimatedDeliveryTime = '2-3 business days in Dhaka, 3-5 days outside Dhaka',
}: DeliveryInfoProps) {
  return (
    <div className="rounded-none border border-[#e3e2e2] bg-[#f5f3f3]/50 p-6 space-y-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1b1c1c]">
        Delivery &amp; Policy Information
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs text-[#5e5e5b]">
        {/* Item 1 */}
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">Nationwide Delivery</h4>
            <p className="mt-0.5 text-[11px]">
              Inside Dhaka: ৳{insideDhakaCharge}<br />
              Outside Dhaka: ৳{outsideDhakaCharge}<br />
              <span className="text-[10px] text-[#5e5e5b]/80">({estimatedDeliveryTime})</span>
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3">
          <Banknote className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">Cash on Delivery</h4>
            <p className="mt-0.5 text-[11px]">
              Pay cash when your package is delivered right to your doorstep.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">7-Day Easy Returns</h4>
            <p className="mt-0.5 text-[11px]">
              Return or exchange unwashed items within 7 days of receiving.
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1b1c1c]">100% Authentic Guaranteed</h4>
            <p className="mt-0.5 text-[11px]">
              Handcrafted directly by verified artisan weavers in Bangladesh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
