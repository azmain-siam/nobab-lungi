import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewItem {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductReviewsProps {
  reviews?: ReviewItem[];
}

export function ProductReviews({ reviews = [] }: ProductReviewsProps) {
  const hasReviews = reviews && reviews.length > 0;

  return (
    <div className="space-y-8 pt-8 border-t border-[#e3e2e2]">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c]">
            Customer Reviews
          </h3>
          {hasReviews ? (
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
                (Based on {reviews.length} verified customer reviews)
              </span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-[#5e5e5b]">
              No customer reviews yet. Be the first to share your experience with this lungi.
            </p>
          )}
        </div>

        <Button variant="secondary" size="md">
          Write a Review
        </Button>
      </div>

      {/* Reviews List or Polished Empty State */}
      {hasReviews ? (
        <div className="space-y-6 pt-4">
          {reviews.map((review) => (
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
                &quot;{review.comment}&quot;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-none border border-dashed border-[#e3e2e2] bg-[#fbf9f8] space-y-3">
          <MessageSquare className="h-8 w-8 text-[#5e5e5b] stroke-[1.2]" />
          <h4 className="font-display text-sm font-semibold text-[#1b1c1c]">
            Be the First to Review
          </h4>
          <p className="text-xs text-[#5e5e5b] max-w-sm">
            Have you purchased this lungi? Share your thoughts on quality, weave, and comfort to help fellow shoppers.
          </p>
        </div>
      )}
    </div>
  );
}
