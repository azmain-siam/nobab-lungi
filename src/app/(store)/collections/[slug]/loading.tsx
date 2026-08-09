import { Container } from '@/components/ui/container';

export default function CollectionLoading() {
  return (
    <div className="animate-pulse space-y-12">
      {/* Hero Banner Skeleton */}
      <div className="min-h-[50vh] w-full bg-stone-900/90 flex items-end pb-16 pt-32">
        <Container>
          <div className="max-w-2xl space-y-4">
            <div className="h-4 w-28 bg-white/20" />
            <div className="h-10 w-3/4 bg-white/20" />
            <div className="h-16 w-full bg-white/10" />
          </div>
        </Container>
      </div>

      {/* Grid Skeleton */}
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 border border-[#e3e2e2] p-4 bg-white">
              <div className="aspect-[3/4] w-full bg-[#efeded]" />
              <div className="h-4 w-2/3 bg-[#efeded]" />
              <div className="h-5 w-1/3 bg-[#efeded]" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
