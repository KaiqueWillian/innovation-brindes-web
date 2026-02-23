import { cn } from '@/lib/cn';
import * as React from 'react';
import { Label } from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2">
        {label ? <Label htmlFor={id}>{label}</Label> : null}

        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-[6px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50',
              className,
              startAdornment && 'pl-10',
              endAdornment && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
            {...props}
          />

          {startAdornment ? (
            <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">{startAdornment}</div>
          ) : null}

          {endAdornment ? (
            <div className="absolute inset-y-0 right-2 flex items-center text-slate-500">{endAdornment}</div>
          ) : null}
        </div>

        {error ? <span className="text-xs font-medium text-red-700">{error}</span> : null}
        {!error && helperText ? <span className="text-xs text-slate-500">{helperText}</span> : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
