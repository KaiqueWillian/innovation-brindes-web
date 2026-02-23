import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Innovation Brindes',
    template: '%s | Innovation Brindes'
  },
  description: 'Teste tecnico Front-End Innovation Brindes',
  icons: {
    icon: '/images/logos/innovation-mark.png',
    shortcut: '/images/logos/innovation-mark.png',
    apple: '/images/logos/innovation-mark.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
