import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pill' | 'square' | 'danger';
  className?: string;
}

export function Badge({
  children,
  variant = 'pill',
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-block text-[10px] font-semibold tracking-wide';

  const variantStyles = {
    pill: 'bg-white text-[#1b1c1c] px-3 py-1 rounded-full shadow-sm',
    square: 'bg-white text-[#1b1c1c] px-2.5 py-1 uppercase tracking-widest rounded-none shadow-sm',
    danger: 'text-red-600 font-semibold text-[10px]',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
