import { cn } from '@/utils/cn';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertMessageProps {
  variant: AlertVariant;
  message: string;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'bg-error-bg text-error border border-red-200',
  success: 'bg-success-bg text-success border border-green-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
};

const roleMap: Record<AlertVariant, string> = {
  error: 'alert',
  success: 'status',
  info: 'status',
};

export function AlertMessage({ variant, message, className }: AlertMessageProps) {
  return (
    <div
      role={roleMap[variant]}
      className={cn(
        'rounded-md px-4 py-3 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {message}
    </div>
  );
}
