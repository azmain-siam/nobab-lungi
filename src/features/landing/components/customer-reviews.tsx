import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Tanvir Hasan',
    location: 'Dhaka',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Executive Series Lungi',
    comment:
      'The 100% organic cotton yarn is unbelievably soft and breathable. The finish and dye quality stay rich even after multiple washes.',
  },
  {
    id: 2,
    name: 'Mahmudur Rahman',
    location: 'Chittagong',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Heritage Pabna Handloom',
    comment:
      'Pabna handloom craftsmanship at its absolute finest. Same day dispatch with Cash-on-Delivery made buying completely worry-free.',
  },
  {
    id: 3,
    name: 'Syed Ahmed',
    location: 'Sylhet',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Royal Handloom Series',
    comment:
      'Bought 3 lungis for my father and uncles. They immediately recognized the authentic loom density and traditional border motifs. Royal comfort indeed.',
  },
];

export function CustomerReviews() {
  return (
    <Section variant="default" className="py-20 lg:py-28 bg-[#fbf9f8]">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-2xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-950 px-4 py-1.5 rounded-full text-xs font-sans font-semibold">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>4.9 / 5 Average Rating (500+ Orders)</span>
          </div>

          <SectionHeading
            title="Trusted Across Bangladesh"
            subtitle="Read real experiences from customers who wear Nabab Lungi with pride."
            align="center"
            className="mb-0"
          />
        </RevealOnScroll>

        {/* Reviews Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <StaggerItem key={review.id}>
              <div className="bg-white rounded-2xl p-8 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full space-y-6 relative">
                <Quote className="w-8 h-8 text-[#1b1c1c]/10 absolute top-6 right-6" />

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-400 gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="font-sans text-sm text-[#1b1c1c] font-light leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e3e2e2]/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-[#1b1c1c]">
                      {review.name}
                    </h4>
                    <span className="text-[11px] text-[#5e5e5b] block font-light">
                      {review.location} • {review.product}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
