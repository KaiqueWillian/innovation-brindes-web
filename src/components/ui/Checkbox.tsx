import { cn } from '@/lib/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';
import { Label } from './Label';

type LegacyChangeEvent = {
  target: {
    checked: boolean;
  };
};

interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'onCheckedChange' | 'children' | 'onChange'
  > {
  label: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: LegacyChangeEvent) => void;
  controlClassName?: string;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      label,
      className,
      id,
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      controlClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    function handleCheckedChange(value: CheckboxPrimitive.CheckedState) {
      const nextChecked = value === true;
      onCheckedChange?.(nextChecked);
      onChange?.({ target: { checked: nextChecked } });
    }

    return (
      <label
        htmlFor={id}
        className={cn('inline-flex cursor-pointer items-center gap-2', disabled && 'opacity-60', className)}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-[6px] border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white',
            controlClassName
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-3.5 w-3.5" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        <Label htmlFor={id} className={cn('cursor-pointer text-sm font-normal text-slate-700', labelClassName)}>
          {label}
        </Label>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
