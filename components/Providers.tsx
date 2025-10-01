'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const ClientProviders = dynamic(() => import('../app/ClientProviders'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  });

  return (
    <SessionProvider>
      <ClientProviders>{children}</ClientProviders>
    </SessionProvider>
  );
}
