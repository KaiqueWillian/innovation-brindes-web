import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, id, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={id}
          className={cn(
            'h-10 w-full appearance-none rounded-[6px] border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
