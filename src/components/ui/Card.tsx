import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  selected?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  selected = false,
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-surface-900 border rounded-xl p-6 transition-all duration-200',
        {
          'border-primary-500 ring-2 ring-primary-500/20': selected,
          'border-surface-800': !selected,
          'hover:border-surface-700 cursor-pointer': hoverable && !selected,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
