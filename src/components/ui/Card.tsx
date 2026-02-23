import clsx from 'clsx';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'article' | 'section' | 'div' | 'header';
}

export function Card({ as = 'div', className, children, ...props }: CardProps) {
  const Component = as;

  return (
    <Component className={clsx('rounded-[6px] border border-slate-200 bg-white', className)} {...props}>
      {children}
    </Component>
  );
}
