'use client';

import { useRealtimeSubscriptions } from "@/logic/hooks/use-realtime-subscriptions";

interface CacheSyncProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that sets up real-time subscriptions for cache synchronization.
 * This should be rendered inside the QueryProvider and AuthProvider.
 */
export function CacheSyncProvider({ children }: CacheSyncProviderProps) {
  // Set up real-time subscriptions for automatic cache invalidation
  useRealtimeSubscriptions();
  
  return <>{children}</>;
}
