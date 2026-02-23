import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Product } from '@/services/api/types';
import { ProductCard } from './ProductCard';

const productMock: Product = {
  id: '1',
  code: 'PRD-001',
  name: 'Produto de Teste',
  reference: 'PRD-001',
  categoryCode: 'CAT-1',
  description: 'Descricao do produto',
  price: 4.6,
  image: '/images/placeholders/product-placeholder.svg',
  isExclusive: true,
  raw: {}
};

describe('ProductCard', () => {
  it('renderiza dados do produto e dispara acoes', async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    const onOpenQuickView = vi.fn();

    render(
      <ProductCard
        product={productMock}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
        onOpenQuickView={onOpenQuickView}
      />
    );

    expect(screen.getByText('Produto de Teste')).toBeInTheDocument();
    expect(screen.getByText('COD PRD-001')).toBeInTheDocument();
    expect(screen.getByText('R$ 4,60')).toBeInTheDocument();
    expect(screen.getByText('EXCLUSIVO!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Adicionar aos favoritos' }));
    expect(onToggleFavorite).toHaveBeenCalledWith(productMock);

    await user.click(screen.getByRole('button', { name: 'CONFIRA' }));
    expect(onOpenQuickView).toHaveBeenCalledWith(productMock);
  });
});


