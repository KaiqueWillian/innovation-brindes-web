import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

interface ProductsTopbarProps {
  onLogout: () => void;
}

export function ProductsTopbar({ onLogout }: ProductsTopbarProps) {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4">
        <Image
          src="/images/logos/innovation-logo-horizontal.png"
          alt="Innovation Brindes"
          width={170}
          height={52}
          priority
          className="h-auto w-[160px] sm:w-[170px]"
        />

        <Button type="button" variant="danger" className="px-3" onClick={onLogout}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </span>
        </Button>
      </div>
    </header>
  );
}
