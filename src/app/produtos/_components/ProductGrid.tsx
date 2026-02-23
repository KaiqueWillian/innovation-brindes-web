'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatBRL } from '@/lib/utils/formatBRL';
import { Product } from '@/services/api/types';
import { FavoriteButton } from './FavoriteButton';
import { ProductViewMode } from './ProductsToolbar';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  favoriteMap: Record<string, true>;
  viewMode: ProductViewMode;
  onToggleFavorite: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

function getFavoriteKey(product: Product) {
  return product.code || product.id;
}

export function ProductGrid({
  products,
  favoriteMap,
  viewMode,
  onToggleFavorite,
  onOpenQuickView
}: ProductGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,1.8fr)_120px_120px_140px_150px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
          <span>Produto</span>
          <span className="whitespace-nowrap">Codigo</span>
          <span className="whitespace-nowrap">Preco</span>
          <span className="whitespace-nowrap">Status</span>
          <span className="text-right">Acoes</span>
        </div>

        <div className="divide-y divide-slate-200">
          {products.map((product) => {
            const favoriteKey = getFavoriteKey(product);
            const isFavorite = Boolean(favoriteMap[favoriteKey]);

            return (
              <div
                key={product.id || favoriteKey}
                className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.8fr)_120px_120px_140px_150px] md:items-center"
              >
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <div className="h-12 w-12 overflow-hidden rounded border border-slate-200 bg-white">
                    <Image
                      src={product.image || '/images/placeholders/product-placeholder.svg'}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="truncate text-xs text-slate-500">{product.description}</p>
                  </div>
                </div>

                <p className="whitespace-nowrap text-sm text-slate-700">COD {product.code}</p>
                <p className="whitespace-nowrap text-sm font-semibold text-slate-900">{formatBRL(product.price)}</p>
                <div className="whitespace-nowrap">
                  {product.isExclusive ? <Badge variant="warning">EXCLUSIVO!</Badge> : <Badge>PADRAO</Badge>}
                </div>

                <div className="flex items-center justify-start gap-2 md:justify-end">
                  <FavoriteButton
                    isFavorite={isFavorite}
                    onClick={() => onToggleFavorite(product)}
                    className="h-8 w-8"
                  />
                  <Button type="button" onClick={() => onOpenQuickView(product)} className="h-8 px-3 text-xs">
                    CONFIRA
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] sm:gap-3">
      {products.map((product) => {
        const favoriteKey = getFavoriteKey(product);
        return (
          <ProductCard
            key={product.id || favoriteKey}
            product={product}
            isFavorite={Boolean(favoriteMap[favoriteKey])}
            onToggleFavorite={onToggleFavorite}
            onOpenQuickView={onOpenQuickView}
          />
        );
      })}
    </div>
  );
}


