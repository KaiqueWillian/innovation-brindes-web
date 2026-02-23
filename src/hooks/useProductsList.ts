'use client';

import { useQuery } from '@tanstack/react-query';
import { listProducts } from '@/services/api/products';

interface UseProductsListOptions {
  enabled?: boolean;
}

export function useProductsList({ enabled = true }: UseProductsListOptions = {}) {
  const query = useQuery({
    queryKey: ['products', 'list'],
    queryFn: listProducts,
    staleTime: 60_000,
    enabled
  });

  const products = query.data ?? [];

  return {
    ...query,
    products
  };
}


