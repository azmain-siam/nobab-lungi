export default function AccountOverviewLoading() {
  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-[#e3e2e2] pb-6">
        <div className="h-4 w-36 bg-[#efeded]" />
        <div className="h-8 w-64 bg-[#efeded]" />
        <div className="h-4 w-48 bg-[#efeded]" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-[#fbf9f8] border border-[#e3e2e2]" />
        <div className="h-24 bg-[#fbf9f8] border border-[#e3e2e2]" />
        <div className="h-24 bg-[#fbf9f8] border border-[#e3e2e2]" />
      </div>

      {/* Recent Orders Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-5 w-40 bg-[#efeded]" />
        <div className="space-y-3">
          <div className="h-20 bg-[#fbf9f8] border border-[#e3e2e2]" />
          <div className="h-20 bg-[#fbf9f8] border border-[#e3e2e2]" />
        </div>
      </div>
    </div>
  );
}
