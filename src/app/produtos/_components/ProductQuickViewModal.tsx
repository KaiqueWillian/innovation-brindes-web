'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatBRL } from '@/lib/utils/formatBRL';
import { Product } from '@/services/api/types';
import { ExclusiveBadge } from './ExclusiveBadge';

interface ProductQuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export function ProductQuickViewModal({
  open,
  onOpenChange,
  product,
  isFavorite,
  onToggleFavorite
}: ProductQuickViewModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product?.name ?? 'Produto'}
      description={product ? `Codigo ${product.code} - Visualizacao rapida do produto` : undefined}
    >
      {product ? (
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded border border-slate-200">
            <Image
              src={product.image || '/images/placeholders/product-placeholder.svg'}
              alt={product.name}
              width={600}
              height={450}
              className="h-full min-h-56 w-full object-cover"
            />
          </div>

          <div className="space-y-3">
            {product.isExclusive ? <ExclusiveBadge /> : null}
            <p className="text-sm leading-relaxed text-slate-700">{product.description}</p>
            <div className="text-2xl font-semibold text-slate-900">{formatBRL(product.price)}</div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => onToggleFavorite(product)}>
                {isFavorite ? 'Remover favorito' : 'Adicionar favorito'}
              </Button>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}


