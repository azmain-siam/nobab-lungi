import React, { forwardRef } from 'react';
import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      error,
      hint,
      leftIcon,
      rightIcon,
      containerClassName = '',
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#5e5e5b] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-white border text-xs text-[#1b1c1c] transition-colors rounded-none placeholder:text-[#5e5e5b]/60 focus:outline-none ${
              leftIcon ? 'pl-9' : 'pl-3'
            } ${rightIcon ? 'pr-9' : 'pr-3'} py-2.5 ${
              error
                ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                : 'border-[#e3e2e2] focus:border-[#1b1c1c] focus:ring-1 focus:ring-[#1b1c1c]'
            } ${disabled ? 'bg-[#f5f3f3] text-[#5e5e5b] cursor-not-allowed' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#5e5e5b] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#5e5e5b]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
