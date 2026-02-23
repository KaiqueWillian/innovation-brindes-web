import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('animate-pulse rounded bg-slate-200', className)} aria-hidden="true" {...props} />
  );
}
