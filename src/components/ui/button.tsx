import React from 'react';
import Link from 'next/link';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white' | 'ghost-white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold uppercase tracking-[0.15em] rounded-none transition-all duration-150 active:scale-[0.97] focus:outline-none cursor-pointer motion-reduce:transform-none';

  const variantStyles = {
    primary: 'bg-[#1b1c1c] text-white hover:bg-black/90',
    secondary: 'border border-[#1b1c1c] bg-transparent text-[#1b1c1c] hover:bg-[#1b1c1c]/5',
    white: 'bg-white text-black hover:bg-white/90',
    'ghost-white': 'border border-white/80 bg-transparent text-white hover:bg-white/10',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-7 py-3.5 text-xs',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
