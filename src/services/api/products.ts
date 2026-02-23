import { apiFetch } from '@/lib/apiClient';
import { Product, ProductListFilters, normalizeProductsPayload } from '@/services/api/types';

const API_PREFIX = '/api/innova-dinamica';
const PRODUCTS_PATH = `${API_PREFIX}/produtos/listar`;

export async function listProducts(): Promise<Product[]> {
  const response = await apiFetch<unknown>(PRODUCTS_PATH, {
    method: 'GET'
  });

  return normalizeProductsPayload(response as Record<string, unknown> | Record<string, unknown>[]);
}

export async function listProductsFiltered(filters: ProductListFilters): Promise<Product[]> {
  const response = await apiFetch<unknown>(PRODUCTS_PATH, {
    method: 'POST',
    body: JSON.stringify({
      nome_produto: filters.productName ?? '',
      codigo_produto: filters.productCode ?? ''
    })
  });

  return normalizeProductsPayload(response as Record<string, unknown> | Record<string, unknown>[]);
}


