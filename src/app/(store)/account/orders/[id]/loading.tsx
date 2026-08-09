export default function OrderDetailsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-28 bg-[#efeded]" />
          <div className="h-6 w-24 bg-[#efeded]" />
        </div>
        <div className="h-7 w-48 bg-[#efeded]" />
      </div>

      {/* Progress Timeline Skeleton */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
        <div className="h-4 w-36 bg-[#efeded]" />
        <div className="h-12 w-full bg-[#fbf9f8] border border-[#e3e2e2]" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <div className="h-5 w-40 bg-[#efeded]" />
            <div className="h-20 bg-[#fbf9f8] border border-[#e3e2e2]" />
            <div className="h-20 bg-[#fbf9f8] border border-[#e3e2e2]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-3">
            <div className="h-5 w-36 bg-[#efeded]" />
            <div className="h-4 w-full bg-[#efeded]" />
            <div className="h-4 w-2/3 bg-[#efeded]" />
            <div className="h-6 w-full bg-[#efeded]" />
          </div>
        </div>
      </div>
    </div>
  );
}
