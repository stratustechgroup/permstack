import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded font-medium',
        {
          'px-1.5 py-0.5 text-[10px]': size === 'sm',
          'px-2 py-0.5 text-xs': size === 'md',
        },
        {
          'bg-surface-800 text-surface-300': variant === 'default',
          'bg-green-500/20 text-green-400': variant === 'success',
          'bg-yellow-500/20 text-yellow-400': variant === 'warning',
          'bg-red-500/20 text-red-400': variant === 'danger',
          'bg-primary-500/20 text-primary-400': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
