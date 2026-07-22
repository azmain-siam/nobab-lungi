import { cn } from '@/utils/cn';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  labelRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * FormField — wraps a label, any input element, and an optional error message.
 * The `children` is the actual input/select/textarea element.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  labelRight,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {labelRight}
      </div>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {children}

      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * FormInput — styled input element matching the design system.
 * Use inside <FormField>.
 */
export function FormInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'block w-full rounded-md border px-3 py-2.5 text-sm text-gray-900',
        'border-gray-300 placeholder-gray-400 bg-white',
        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition',
        className,
      )}
      {...props}
    />
  );
}
