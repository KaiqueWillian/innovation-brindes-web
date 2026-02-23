'use client';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useProductsList } from '@/hooks/useProductsList';
import { useProductsSearch } from '@/hooks/useProductsSearch';
import { POST_LOGIN_SUCCESS_TOAST_KEY } from '@/lib/auth/constants';
import { getAuthToken } from '@/lib/auth/cookies';
import { hydrateAuthSessionFromStorage } from '@/lib/auth/storage';
import { ApiClientError, Product } from '@/services/api/types';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ProductGrid } from './ProductGrid';
import { ProductsPagination } from './ProductsPagination';
import { ProductsSkeleton } from './ProductsSkeleton';
import { ProductOrder, ProductsToolbar, ProductViewMode } from './ProductsToolbar';
import { ProductsTopbar } from './ProductsTopbar';

const ProductQuickViewModal = dynamic(
  () => import('./ProductQuickViewModal').then((module) => module.ProductQuickViewModal),
  {
    ssr: false
  }
);

const DEFAULT_ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 1000;

function getFavoriteKey(product: Product) {
  return product.code || product.id;
}

function sortProducts(list: Product[], order: ProductOrder) {
  const sorted = [...list];

  sorted.sort((a, b) => {
    switch (order) {
      case 'name_asc':
        return a.name.localeCompare(b.name, 'pt-BR');
      case 'name_desc':
        return b.name.localeCompare(a.name, 'pt-BR');
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return sorted;
}

function resolveSearchFilters(searchText: string) {
  const normalized = searchText.trim();

  if (!normalized) {
    return {
      productName: '',
      productCode: ''
    };
  }

  const looksLikeCode = /[\d-]/.test(normalized) && !/\s/.test(normalized);

  if (looksLikeCode) {
    return {
      productName: '',
      productCode: normalized
    };
  }

  return {
    productName: normalized,
    productCode: ''
  };
}

export function ProductsPageClient() {
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [order, setOrder] = useState<ProductOrder>('name_asc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [viewMode, setViewMode] = useState<ProductViewMode>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const favoriteMap = useFavoritesStore((state) => state.favoriteMap);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const logout = useAuthStore((state) => state.logout);

  const listQuery = useProductsList();
  const searchFilters = useMemo(() => resolveSearchFilters(searchText), [searchText]);
  const searchQuery = useProductsSearch({
    searchName: searchFilters.productName,
    searchCode: searchFilters.productCode,
    debounceMs: SEARCH_DEBOUNCE_MS
  });

  const shouldUseSearchResults = searchQuery.hasDebouncedFilters;
  const sourceProducts = shouldUseSearchResults ? searchQuery.products : listQuery.products;

  const processedProducts = useMemo(() => {
    const filteredByFavorite = onlyFavorites
      ? sourceProducts.filter((product) => favoriteMap[getFavoriteKey(product)])
      : sourceProducts;

    return sortProducts(filteredByFavorite, order);
  }, [sourceProducts, onlyFavorites, favoriteMap, order]);

  const totalItems = processedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageStartIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = processedProducts.slice(pageStartIndex, pageStartIndex + itemsPerPage);

  const hasAnyFiltersApplied = Boolean(searchText.trim() || onlyFavorites || order !== 'name_asc');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, order, onlyFavorites, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    function enforceAuth() {
      const cookieToken = getAuthToken();
      const session = hydrateAuthSessionFromStorage();
      const storageToken = session?.token ?? null;

      if (cookieToken && storageToken && cookieToken === storageToken) {
        return;
      }

      logout();
      router.replace('/login');
    }

    enforceAuth();
    window.addEventListener('focus', enforceAuth);
    document.addEventListener('visibilitychange', enforceAuth);

    return () => {
      window.removeEventListener('focus', enforceAuth);
      document.removeEventListener('visibilitychange', enforceAuth);
    };
  }, [logout, router]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldShowToast = sessionStorage.getItem(POST_LOGIN_SUCCESS_TOAST_KEY) === '1';
    if (!shouldShowToast) {
      return;
    }

    sessionStorage.removeItem(POST_LOGIN_SUCCESS_TOAST_KEY);
    toast.success('Acesso realizado com sucesso.');
  }, []);

  function handleOpenQuickView(product: Product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function handleToggleFavorite(product: Product) {
    toggleFavorite(getFavoriteKey(product));
  }

  function handleRefresh() {
    if (shouldUseSearchResults) {
      searchQuery.refetch();
      return;
    }

    listQuery.refetch();
  }

  function handleCreateProduct() {
    toast.info('Cadastro de produto sera disponibilizado em breve.');
  }

  function handleClearFilters() {
    setSearchText('');
    setOrder('name_asc');
    setOnlyFavorites(false);
  }

  function handleLogout() {
    logout();
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  }

  const selectedFavorite = selectedProduct
    ? Boolean(favoriteMap[getFavoriteKey(selectedProduct)])
    : false;

  const activeQueryError = (shouldUseSearchResults ? searchQuery.error : listQuery.error) as ApiClientError | null;
  const hasQueryError = shouldUseSearchResults ? searchQuery.isError : listQuery.isError;
  const isInitialLoading =
    (listQuery.isPending && listQuery.products.length === 0) ||
    (shouldUseSearchResults && searchQuery.isPending && searchQuery.products.length === 0);
  const isRefreshing =
    !isInitialLoading && (listQuery.isFetching || searchQuery.isFetching || searchQuery.isDebouncing);
  const shouldShowPagination = !isInitialLoading && !hasQueryError;

  return (
    <main className="h-screen overflow-hidden bg-slate-100">
      <div className="flex h-full min-h-0 flex-col">
        <ProductsTopbar onLogout={handleLogout} />

        <div className="flex-1 min-h-0 px-3 py-3">
          <Card className="flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-[6px]">
            <ProductsToolbar
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
              onCreateProduct={handleCreateProduct}
              searchText={searchText}
              onSearchTextChange={setSearchText}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              order={order}
              onOrderChange={setOrder}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onlyFavorites={onlyFavorites}
              onOnlyFavoritesChange={setOnlyFavorites}
            />

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
              {isInitialLoading ? <ProductsSkeleton /> : null}

              {!isInitialLoading && hasQueryError ? (
                <ErrorState
                  title="Erro ao carregar produtos"
                  description={
                    activeQueryError instanceof ApiClientError
                      ? activeQueryError.message
                      : 'Nao foi possivel carregar os dados no momento.'
                  }
                  onRetry={handleRefresh}
                />
              ) : null}

              {!isInitialLoading && !hasQueryError && processedProducts.length === 0 ? (
                <EmptyState
                  title="Nenhum item encontrado"
                  description="Tente alterar a busca ou remover os filtros aplicados."
                  actionLabel={hasAnyFiltersApplied ? 'Limpar filtros' : undefined}
                  onAction={hasAnyFiltersApplied ? handleClearFilters : undefined}
                />
              ) : null}

              {!isInitialLoading && !hasQueryError && processedProducts.length > 0 ? (
                <ProductGrid
                  products={pageItems}
                  favoriteMap={favoriteMap}
                  viewMode={viewMode}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenQuickView={handleOpenQuickView}
                />
              ) : null}
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2">
              {shouldShowPagination ? (
                <ProductsPagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </div>
          </Card>
        </div>
      </div>

      <ProductQuickViewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        isFavorite={selectedFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </main>
  );
}
