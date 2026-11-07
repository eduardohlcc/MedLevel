'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMsw() {
      const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
      if (useMocks && typeof window !== 'undefined') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
      setMswReady(true);
    }

    initMsw();
  }, []);

  if (!mswReady && process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-sans text-sm">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Iniciando ambiente simulado MedLevel...</span>
        </div>
      </div>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
