'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Span, Text, Title } from '@/components/ui/Typography';
import { Funnel, Grid2x2, Heart, List, Plus, RefreshCw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type ProductOrder = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';
export type ProductViewMode = 'grid' | 'list';

interface ProductsToolbarProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onCreateProduct: () => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  viewMode: ProductViewMode;
  onViewModeChange: (value: ProductViewMode) => void;
  order: ProductOrder;
  onOrderChange: (value: ProductOrder) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onlyFavorites: boolean;
  onOnlyFavoritesChange: (value: boolean) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;

const ORDER_OPTIONS: Array<{ value: ProductOrder; label: string }> = [
  { value: 'name_asc', label: 'Nome (A-Z)' },
  { value: 'name_desc', label: 'Nome (Z-A)' },
  { value: 'price_asc', label: 'Menor preco' },
  { value: 'price_desc', label: 'Maior preco' }
];

export function ProductsToolbar({
  isRefreshing,
  onRefresh,
  onCreateProduct,
  searchText,
  onSearchTextChange,
  viewMode,
  onViewModeChange,
  order,
  onOrderChange,
  itemsPerPage,
  onItemsPerPageChange,
  onlyFavorites,
  onOnlyFavoritesChange
}: ProductsToolbarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFiltersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!mobileFiltersRef.current) {
        return;
      }

      if (!mobileFiltersRef.current.contains(event.target as Node)) {
        setMobileFiltersOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileFiltersOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="shrink-0 border-b border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <Title className="font-semibold">Lista de produtos</Title>

          <Text tone="muted">Administre catalogo, filtros e disponibilidade dos itens.</Text>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onRefresh}
            isLoading={isRefreshing}
            aria-label="Atualizar produtos"
            className="h-10 flex items-center gap-1 px-2 sm:px-4"
          >
            <RefreshCw size={15} aria-hidden="true" />
            <span>Atualizar</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onCreateProduct}
            aria-label="Novo produto"
            className="h-10 flex items-center gap-1 px-2 sm:px-4"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Novo produto</span>
          </Button>
        </div>
      </div>

      <div className="w-full border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex justify-between gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[140px] max-w-[72vw] sm:w-[290px]">
              <Input
                id="products-search"
                value={searchText}
                onChange={(event) => onSearchTextChange(event.target.value)}
                placeholder="Buscar por nome ou codigo..."
                aria-label="Buscar produto por nome ou codigo"
                className="h-10 w-full bg-white"
                endAdornment={<Search className="h-4 w-4 text-slate-500" aria-hidden="true" />}
              />
            </div>

            <div
              role="group"
              aria-label="Modo de visualizacao"
              className="inline-flex h-10 overflow-hidden rounded-[6px] border border-slate-300 bg-white"
            >
              <button
                type="button"
                title="Visualizacao em grade"
                aria-pressed={viewMode === 'grid'}
                onClick={() => onViewModeChange('grid')}
                className={`inline-flex h-full w-10 items-center justify-center ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Grid2x2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                title="Visualizacao em lista"
                aria-pressed={viewMode === 'list'}
                onClick={() => onViewModeChange('list')}
                className={`inline-flex h-full w-10 items-center justify-center border-l border-slate-200 ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <List className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Button
              type="button"
              variant={onlyFavorites ? 'primary' : 'secondary'}
              onClick={() => onOnlyFavoritesChange(!onlyFavorites)}
              className="h-10 flex items-center gap-1 px-2 sm:px-4"
              aria-pressed={onlyFavorites}
              aria-label="Mostrar apenas favoritos"
            >
              <Heart size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Favoritos</span>
            </Button>
        </div>

          <div className="relative sm:hidden" ref={mobileFiltersRef}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMobileFiltersOpen((value) => !value)}
              aria-expanded={mobileFiltersOpen}
              aria-label="Abrir filtros"
              className="h-10 flex items-center px-2"
            >
              <Funnel size={15} aria-hidden="true" />
            </Button>

            {mobileFiltersOpen ? (
              <div
                role="dialog"
                aria-label="Filtros da listagem"
                className="absolute right-0 z-20 mt-2 w-72 rounded-[6px] border border-slate-200 bg-white p-3 shadow-lg"
              >
                <div className="space-y-3">
                  <div>
                    <Span tone="muted" className="mb-1 block text-sm font-medium">
                      Ordenacao
                    </Span>
                    <Select
                      id="sort-order-mobile"
                      aria-label="Ordenacao da listagem"
                      value={order}
                      onChange={(event) => onOrderChange(event.target.value as ProductOrder)}
                      className="h-10 w-full text-sm font-semibold"
                    >
                      {ORDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Span tone="muted" className="mb-1 block text-sm font-medium">
                      Exibir
                    </Span>
                    <Select
                      id="items-per-page-mobile"
                      aria-label="Quantidade de itens por pagina"
                      value={String(itemsPerPage)}
                      onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
                      className="h-10 w-full text-sm font-semibold"
                    >
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size} por pagina
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Span tone="muted" className="text-sm font-medium">
              Ordenacao:
            </Span>

            <Select
              id="sort-order"
              aria-label="Ordenacao da listagem"
              value={order}
              onChange={(event) => onOrderChange(event.target.value as ProductOrder)}
              className="h-10 w-[170px] text-sm font-semibold"
            >
              {ORDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Span tone="muted" className="text-sm font-medium">
              Exibir:
            </Span>

            <Select
              id="items-per-page"
              aria-label="Quantidade de itens por pagina"
              value={String(itemsPerPage)}
              onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
              className="h-10 w-[160px] text-sm font-semibold"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} por pagina
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
