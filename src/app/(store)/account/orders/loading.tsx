export default function OrderHistoryLoading() {
  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6 animate-pulse">
      <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-[#efeded]" />
          <div className="h-4 w-48 bg-[#efeded]" />
        </div>
        <div className="h-6 w-20 bg-[#efeded]" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-[#e3e2e2] p-5 space-y-3 bg-[#fbf9f8]/60">
            <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-3">
              <div className="h-5 w-36 bg-[#efeded]" />
              <div className="h-5 w-24 bg-[#efeded]" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/2 bg-[#efeded]" />
              <div className="h-5 w-28 bg-[#efeded]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
