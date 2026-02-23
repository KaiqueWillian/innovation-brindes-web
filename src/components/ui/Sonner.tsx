'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-[6px]',
          title: 'text-sm',
          description: 'text-xs'
        }
      }}
      {...props}
    />
  );
}
