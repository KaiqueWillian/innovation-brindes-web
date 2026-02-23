import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[6px] border text-sm font-medium transition-colors ring-offset-white focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'border-slate-900 bg-slate-900 text-white hover:bg-black focus-visible:ring-slate-500',
        secondary: 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-400',
        ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
        danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-500',
        link: 'h-auto border-transparent bg-transparent px-0 py-0 text-brand-700 underline-offset-2 hover:text-brand-800 hover:underline focus-visible:ring-brand-400'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-10 rounded-[6px] px-3',
        lg: 'h-11 rounded-[6px] px-8',
        icon: 'h-10 w-10 p-0'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      fullWidth = false,
      disabled,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Carregando...' : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
