import React, { forwardRef } from 'react';
import { Label } from './label';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      required,
      error,
      hint,
      containerClassName = '',
      className = '',
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <Label htmlFor={selectId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-white border text-xs text-[#1b1c1c] transition-colors rounded-none appearance-none pr-8 pl-3 py-2.5 focus:outline-none ${
              error
                ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                : 'border-[#e3e2e2] focus:border-[#1b1c1c] focus:ring-1 focus:ring-[#1b1c1c]'
            } ${disabled ? 'bg-[#f5f3f3] text-[#5e5e5b] cursor-not-allowed' : ''} ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 text-[#5e5e5b] pointer-events-none flex items-center justify-center">
            <ChevronDown className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#5e5e5b]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
