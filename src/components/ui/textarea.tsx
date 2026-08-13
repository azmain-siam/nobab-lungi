import React, { forwardRef } from 'react';
import { Label } from './label';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={`w-full bg-white border text-xs text-[#1b1c1c] transition-colors rounded-none placeholder:text-[#5e5e5b]/60 focus:outline-none p-3 ${
            error
              ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
              : 'border-[#e3e2e2] focus:border-[#1b1c1c] focus:ring-1 focus:ring-[#1b1c1c]'
          } ${disabled ? 'bg-[#f5f3f3] text-[#5e5e5b] cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#5e5e5b]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
