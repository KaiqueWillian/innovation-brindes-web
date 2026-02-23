import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renderiza com atributos acessiveis e fecha ao clicar em fechar', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Modal
        open
        onOpenChange={onOpenChange}
        title="Detalhe do produto"
        description="Visualizacao rapida"
      >
        <p>Conteudo do modal</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Detalhe do produto' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Conteudo do modal')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fechar modal' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
