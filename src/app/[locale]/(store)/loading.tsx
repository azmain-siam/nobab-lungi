export default function StoreLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1b1c1c] border-t-transparent" />
      <p className="text-xs uppercase tracking-widest text-[#5e5e5b] font-medium">
        Loading...
      </p>
    </div>
  );
}
