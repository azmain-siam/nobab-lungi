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
    pill: 'bg-white/95 backdrop-blur-xs text-[#1b1c1c] border border-[#e3e2e2]/80 px-3 py-1 rounded-full shadow-xs',
    square: 'bg-white/95 backdrop-blur-xs text-[#1b1c1c] border border-[#e3e2e2]/80 px-2.5 py-1 uppercase tracking-widest rounded-none shadow-xs',
    danger: 'text-red-600 font-semibold text-[10px]',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
