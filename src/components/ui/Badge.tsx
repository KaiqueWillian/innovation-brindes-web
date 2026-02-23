import clsx from 'clsx';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'warning';
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase',
        {
          'bg-slate-100 text-slate-700': variant === 'neutral',
          'bg-amber-300 text-slate-900': variant === 'warning'
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
