import { Container } from '@/components/ui/container';

export default function ProductLoading() {
  return (
    <div className="py-12 lg:py-16">
      <Container className="space-y-16 animate-pulse">
        {/* Upper Stage: Gallery (Left) & Info (Right) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[3/4] w-full bg-[#efeded]" />
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square bg-[#efeded]" />
              <div className="aspect-square bg-[#efeded]" />
              <div className="aspect-square bg-[#efeded]" />
              <div className="aspect-square bg-[#efeded]" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="h-4 w-32 bg-[#efeded]" />
            <div className="h-9 w-3/4 bg-[#efeded]" />
            <div className="h-7 w-28 bg-[#efeded]" />
            <div className="h-20 w-full bg-[#efeded]" />

            <div className="border-t border-b border-[#e3e2e2] py-6 space-y-3">
              <div className="h-4 w-1/2 bg-[#efeded]" />
              <div className="h-4 w-1/3 bg-[#efeded]" />
              <div className="h-4 w-2/3 bg-[#efeded]" />
            </div>

            <div className="flex gap-4 pt-2">
              <div className="h-12 flex-1 bg-[#efeded]" />
              <div className="h-12 flex-1 bg-[#efeded]" />
              <div className="h-12 w-12 bg-[#efeded]" />
            </div>
          </div>
        </div>

        {/* Delivery Info Skeleton */}
        <div className="h-24 w-full bg-[#efeded]" />
      </Container>
    </div>
  );
}
