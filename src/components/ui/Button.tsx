import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-primary text-white hover:opacity-90': variant === 'primary',
          'bg-surface-800 text-white border border-surface-700 hover:bg-surface-700': variant === 'secondary',
          'text-surface-400 hover:text-white hover:bg-surface-800': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
