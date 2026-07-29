import { Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Rafiqul Islam',
    location: 'Dhaka',
    rating: 5,
    date: '2 weeks ago',
    comment:
      'Extremely soft cotton and authentic handloom weave! Wears so comfortably during hot summer days in Dhaka. Highly recommended!',
    verified: true,
  },
  {
    id: '2',
    author: 'Tanvir Hossain',
    location: 'Chittagong',
    rating: 5,
    date: '1 month ago',
    comment:
      'The executive series quality is unmatched. Fast delivery to Chittagong within 3 days. Will definitely buy more as gifts.',
    verified: true,
  },
];

export function ProductReviews() {
  return (
    <div className="space-y-8 pt-8 border-t border-[#e3e2e2]">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c]">
            Customer Reviews
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-[#1b1c1c]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current stroke-none" />
              ))}
            </div>
            <span className="font-display text-sm font-semibold text-[#1b1c1c]">
              5.0 out of 5
            </span>
            <span className="text-xs text-[#5e5e5b]">
              (Based on 128 verified customer ratings)
            </span>
          </div>
        </div>

        <Button variant="secondary" size="md">
          Write a Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 pt-4">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="border-b border-[#e3e2e2] pb-6 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                  {review.author}
                </span>
                {review.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 border border-emerald-200/60">
                    <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                    Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-xs text-[#5e5e5b]">{review.date}</span>
            </div>

            <div className="flex items-center text-[#1b1c1c]">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current stroke-none" />
              ))}
            </div>

            <p className="text-xs font-light leading-relaxed text-[#5e5e5b] sm:text-sm pt-1">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
