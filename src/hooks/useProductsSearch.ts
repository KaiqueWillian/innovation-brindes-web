'use client';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { listProductsFiltered } from '@/services/api/products';

interface UseProductsSearchOptions {
  searchName: string;
  searchCode: string;
  debounceMs?: number;
  enabled?: boolean;
}

export function useProductsSearch({
  searchName,
  searchCode,
  debounceMs = 400,
  enabled = true
}: UseProductsSearchOptions) {
  const debouncedName = useDebounce(searchName, debounceMs);
  const debouncedCode = useDebounce(searchCode, debounceMs);

  const hasRawFilters = Boolean(searchName.trim() || searchCode.trim());
  const hasDebouncedFilters = Boolean(debouncedName.trim() || debouncedCode.trim());
  const isDebouncing = searchName !== debouncedName || searchCode !== debouncedCode;

  const query = useQuery({
    queryKey: ['products', 'search', debouncedName, debouncedCode],
    queryFn: () =>
      listProductsFiltered({
        productName: debouncedName,
        productCode: debouncedCode
      }),
    staleTime: 60_000,
    enabled: enabled && hasDebouncedFilters,
    placeholderData: (previousData) => previousData
  });

  const products = query.data ?? [];

  return {
    ...query,
    products,
    hasRawFilters,
    hasDebouncedFilters,
    isDebouncing
  };
}


