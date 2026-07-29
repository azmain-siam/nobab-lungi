'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard error:', error);
  }, [error]);

  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
      </div>
      <h2 className="font-display text-xl font-semibold text-[#1b1c1c]">
        Dashboard Error Encountered
      </h2>
      <p className="text-xs text-[#5e5e5b] max-w-sm">
        Failed to load administrative portal data.
      </p>
      <div className="flex gap-3 pt-2">
        <Button variant="primary" size="md" onClick={() => reset()}>
          Reload Dashboard
        </Button>
      </div>
    </div>
  );
}
