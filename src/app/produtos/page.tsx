import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { ProductsPageClient } from './_components/ProductsPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Listagem de produtos Innovation Brindes com busca e favoritos.'
};

export default async function ProdutosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  return <ProductsPageClient />;
}


