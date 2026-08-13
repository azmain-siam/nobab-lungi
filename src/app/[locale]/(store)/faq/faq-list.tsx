'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: 'Products & Fabrics',
    question: 'What makes Nabab Lungi different from regular market lungis?',
    answer:
      'Nabab Lungis are woven by master handloom artisans in Bangladesh using 100% long-staple organic cotton yarns. We use specialized weaving density and traditional dyeing techniques that preserve color brilliance, preventing shrinking or rough textures even after repeated washes.',
  },
  {
    category: 'Products & Fabrics',
    question: 'Are Nabab Lungis pre-stitched or open?',
    answer:
      'All our lungis come fully stitched with high-durability reinforced seams, ready to wear immediately out of the luxury box.',
  },
  {
    category: 'Ordering & Payment',
    question: 'How do I pay using bKash or Nagad?',
    answer:
      'Select bKash or Nagad at checkout. You will be provided with our official Merchant/Personal number. Send the order total amount to that number, enter your Sender Phone Number and Transaction ID (TrxID) in the checkout form, and click Place Order.',
  },
  {
    category: 'Ordering & Payment',
    question: 'Can I pay Cash on Delivery (COD)?',
    answer:
      'Yes! We offer Cash on Delivery across all 64 districts in Bangladesh. You can pay the total amount directly to the courier delivery agent when your package arrives.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long does delivery take?',
    answer:
      'Inside Dhaka City: 1 to 3 business days. Outside Dhaka (district and upazila levels): 3 to 5 business days. You will receive an SMS tracking notification upon dispatch.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'What are the delivery charges?',
    answer:
      'Delivery fee is ৳70 for addresses inside Dhaka Metropolitan, and ৳130 for all locations outside Dhaka.',
  },
  {
    category: 'Returns & Exchanges',
    question: 'What if the product has a defect or wrong size?',
    answer:
      'We offer a 7-day hassle-free return and exchange policy. If there is any weaving flaw, defect, or wrong item delivered, contact our support team within 7 days for a free replacement.',
  },
];

export function FaqList() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-12">
      {categories.map((cat, catIdx) => {
        const catFaqs = faqs.filter((f) => f.category === cat);
        return (
          <div key={catIdx} className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] pb-2 border-b border-[#e3e2e2]">
              {cat}
            </h2>
            <div className="space-y-3">
              {catFaqs.map((faq, itemIdx) => {
                const globalIdx = faqs.indexOf(faq);
                const isOpen = openIdx === globalIdx;
                return (
                  <div
                    key={itemIdx}
                    className="bg-white rounded-2xl border border-[#e3e2e2] overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(globalIdx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 font-display text-lg font-medium text-[#1b1c1c] hover:text-black focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#5e5e5b] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#1b1c1c]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 font-sans text-sm text-[#5e5e5b] font-light leading-relaxed border-t border-[#e3e2e2]/40">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
