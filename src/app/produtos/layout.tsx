import type { ReactNode } from 'react';
import { ProdutosProviders } from './providers';

interface ProdutosLayoutProps {
  children: ReactNode;
}

export default function ProdutosLayout({ children }: ProdutosLayoutProps) {
  return <ProdutosProviders>{children}</ProdutosProviders>;
}
