'use client';

import { Truck, Banknote, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';

export function AnnouncementBar() {
  return (
    <div className="bg-[#1b1c1c] text-white text-[11px] font-sans py-2 border-b border-white/10 relative z-50">
      <Container>
        <div className="flex items-center justify-between gap-4">
          {/* Main Trust Message */}
          <div className="flex items-center justify-center gap-6 mx-auto text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 font-medium text-white/90">
              <Banknote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Cash on Delivery Available Nationwide</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 font-medium text-white/80">
              <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Express Delivery (1-3 Days in Dhaka)</span>
            </span>

            <span className="hidden lg:inline-flex items-center gap-1.5 font-medium text-white/80">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>100% Organic Cotton Handloom</span>
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}
