import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'MedLevel | Preparação de Excelência para o ENAMED',
  description:
    'Plataforma editorial de estudos para o Exame Nacional de Avaliação da Formação Médica. Banco de questões, simulados cronometrados e caderno de erros com repetição espaçada SM-2.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-accent/20 selection:text-accent">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
