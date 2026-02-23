'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatBRL } from '@/lib/utils/formatBRL';
import { Product } from '@/services/api/types';
import { ExclusiveBadge } from './ExclusiveBadge';
import { FavoriteButton } from './FavoriteButton';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenQuickView
}: ProductCardProps) {
  return (
    <Card as="article" className="group flex h-full flex-col p-2 sm:p-3">
      <div className="relative rounded border border-slate-200 bg-slate-50 p-1.5 sm:p-2">
        {product.isExclusive ? (
          <div className="absolute left-2 top-2 z-10">
            <ExclusiveBadge />
          </div>
        ) : null}

        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => onToggleFavorite(product)}
          className="absolute right-1.5 top-1.5 z-10 h-7 w-7 sm:right-2 sm:top-2 sm:h-8 sm:w-8"
        />

        <div className="aspect-[16/10] overflow-hidden rounded-[6px] bg-white sm:aspect-[4/3]">
          <Image
            src={product.image || '/images/placeholders/product-placeholder.svg'}
            alt={product.name}
            width={560}
            height={560}
            className="h-full w-full object-contain p-2 sm:p-3"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-1.5 sm:mt-3 sm:gap-2">
        <h3
          className="text-xs font-bold leading-snug text-slate-900 sm:text-sm"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h3>

        <div>
          <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-600 sm:px-2 sm:text-[11px]">
            COD {product.code}
          </span>
        </div>

        <p
          className="text-[11px] text-slate-600 sm:text-xs"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-200 pt-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Preco</p>
            <p className="text-lg font-semibold text-slate-900 sm:text-xl">{formatBRL(product.price)}</p>
          </div>
          <Button type="button" onClick={() => onOpenQuickView(product)} className="h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs">
            CONFIRA
          </Button>
        </div>
      </div>
    </Card>
  );
}


