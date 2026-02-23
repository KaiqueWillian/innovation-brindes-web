'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open && typeof document !== 'undefined') {
      lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[6px] border border-slate-300 bg-white p-4 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:p-5"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            lastFocusedElementRef.current?.focus();
          }}
        >
          <Dialog.Title className="text-lg font-semibold text-slate-900">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-1 text-sm text-slate-600">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-4">{children}</div>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Fechar modal"
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
