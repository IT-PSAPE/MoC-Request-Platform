'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optimized caching for Vercel deployment
            // staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
            // gcTime: 1000 * 60 * 30, // 30 minutes - garbage collection time
            staleTime: 0, // 5 minutes - data considered fresh
            gcTime: 0, // 30 minutes - garbage collection time
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors except 429
              if (error && typeof error === 'object' && 'status' in error) {
                const status = error.status as number;
                if (status >= 400 && status < 500 && status !== 429) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: true, // Re-enabled: Fetch fresh data on window focus
            refetchOnReconnect: true,
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry mutations on 4xx errors
              if (error && typeof error === 'object' && 'status' in error) {
                const status = error.status as number;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
