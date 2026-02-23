import { Subtitle, Text, Title } from '@/components/ui/Typography';
import Image from 'next/image';
import type { Metadata } from 'next';
import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Acesse sua conta para consultar o catalogo de brindes personalizados da Innovation Brindes.'
};

export default function LoginPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen w-full lg:h-screen lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:overflow-hidden">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-white p-14 lg:flex lg:items-center lg:justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 15%, rgba(15, 140, 79, 0.16), transparent 36%), radial-gradient(circle at 78% 0%, rgba(52, 211, 127, 0.18), transparent 28%), radial-gradient(circle at 90% 85%, rgba(15, 140, 79, 0.1), transparent 34%)'
          }}
        />

        <div className="relative z-10 w-full max-w-2xl">
          <div className="mx-auto max-w-xl">
            <div className="mb-8">
              <Image
                src="/images/logos/innovation-logo-horizontal.png"
                alt="Innovation Brindes"
                width={230}
                height={70}
                priority
                className="h-auto w-[220px] max-w-full"
              />
            </div>

            <Title className="text-5xl leading-tight">Brindes que viram presenca de marca.</Title>

            <Text tone="muted" className="mt-6 text-2xl leading-relaxed">
              Mais de 3.000 opcoes personalizaveis para campanhas, eventos e acoes internas. Do briefing a
              entrega, com suporte de consultores e opcao Ultra Rapido em ate 48h.
            </Text>
          </div>

          <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-4">
            <article className="rounded-[6px] border border-brand-200 bg-white/90 p-4">
              <Subtitle className="text-base">Catalogo completo</Subtitle>
              <Text tone="muted" className="mt-1">
                Encontre o brinde ideal por categoria, ocasiao e faixa de preco.
              </Text>
            </article>

            <article className="rounded-[6px] border border-brand-200 bg-white/90 p-4">
              <Subtitle className="text-base">Agilidade com suporte humano</Subtitle>
              <Text tone="muted" className="mt-1">
                Consultores especializados para acelerar sua escolha e sua compra.
              </Text>
            </article>
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-16">
        <div className="relative z-10 flex w-full max-w-[440px] flex-col gap-4">
          <div className="lg:hidden">
            <Image
              src="/images/logos/innovation-mark.png"
              alt="Innovation Brindes"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-[6px] shadow-md shadow-brand-600/20"
            />
          </div>

          <Title className="text-4xl">Acesse sua conta</Title>

          <Text tone="muted">
            Digite suas credenciais para continuar a navegacao na plataforma Innovation Brindes.
          </Text>

          <LoginForm />
        </div>

        <Text tone="muted" className="pointer-events-none absolute bottom-6 left-0 w-full text-center text-xs">
          (c) {currentYear} Innovation Brindes. Todos os direitos reservados.
        </Text>
      </section>
    </main>
  );
}


