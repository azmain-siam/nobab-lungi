import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function Label({
  children,
  required,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`block text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
}
