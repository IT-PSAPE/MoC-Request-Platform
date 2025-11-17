# Supabase Caching System

This document explains the comprehensive caching system implemented for the MoC Request Platform using TanStack Query (React Query) with Supabase real-time subscriptions.

## Overview

The caching system provides:
- **Automatic caching** of Supabase queries
- **Real-time synchronization** with database changes  
- **Optimistic updates** for better UX
- **Request deduplication** 
- **Background refetching**
- **Error handling with automatic retries**
- **Storage/image caching** (future-ready)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │     Hooks       │    │   Services      │
│                 │────▶│  (Cached)       │────▶│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └──────────────▶│  Query Client   │◀────────────┘
                        │     (Cache)     │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Real-time      │
                        │  Subscriptions  │
                        └─────────────────┘
```

## Core Components

### 1. Query Provider (`src/providers/query-provider.tsx`)

Sets up the TanStack Query client with optimized configuration:

```tsx
import { QueryProvider } from '@/providers/query-provider';

// Already integrated in RootProvider
<QueryProvider>
  {/* Your app */}
</QueryProvider>
```

### 2. Cache Sync Provider (`src/providers/cache-sync-provider.tsx`)

Automatically sets up real-time subscriptions for cache invalidation.

### 3. Query Keys (`src/lib/query-keys.ts`)

Centralized query key management for consistent caching:

```tsx
export const QueryKeys = {
  requests: () => ['requests'] as const,
  request: (id: string) => ['requests', id] as const,
  equipment: () => ['equipment'] as const,
  // ... etc
};
```

## Cached Hooks

### Request Operations

```tsx
import { 
  useRequests, 
  useRequest,
  useUpdateRequestStatus,
  useAddComment,
  useDeleteRequest
} from '@/hooks/use-cached-requests';

// Fetch all requests with caching
const { data: requests, isLoading, error } = useRequests();

// Fetch single request
const { data: request } = useRequest(requestId);

// Update request status with optimistic updates
const updateStatus = useUpdateRequestStatus();
updateStatus.mutate({ requestId: '123', statusId: '456' });

// Add comment with optimistic updates
const addComment = useAddComment();
addComment.mutate({ 
  requestId: '123', 
  comment: 'New comment', 
  authorId: user.id 
});
```

### Default Data Operations

```tsx
import { 
  useEquipment,
  useUpdateEquipment,
  useSongs,
  useUpdateSong,
  useVenues,
  useUpdateVenue,
  useRequestItems
} from '@/hooks/use-cached-defaults';

// Fetch equipment with caching
const { data: equipment, isLoading } = useEquipment();

// Update equipment availability
const updateEquipment = useUpdateEquipment();
updateEquipment.mutate({ id: '123', available: 5 });
```

### Storage Operations (Future-Ready)

```tsx
import { 
  useSignedUrl,
  useStorageBucket,
  useUploadFile,
  useDownloadFile,
  useDeleteFile
} from '@/hooks/use-cached-storage';

// Get cached signed URL for image
const { data: signedUrl } = useSignedUrl('avatars', 'user-123.jpg');

// Upload file with cache invalidation
const uploadFile = useUploadFile('avatars');
uploadFile.mutate({ 
  filePath: 'user-123.jpg', 
  file: fileBlob 
});
```

## Real-time Synchronization

The system automatically listens to Supabase real-time events and invalidates relevant caches:

```tsx
// Automatically set up in CacheSyncProvider
useRealtimeSubscriptions();

// Listens to changes in:
// - requests table → invalidates request queries
// - equipment table → invalidates equipment queries  
// - song table → invalidates song queries
// - venue table → invalidates venue queries
// - note table → invalidates request and comment queries
// - status/priority/type tables → invalidates related queries
```

## Migration Guide

### Option 1: Gradual Migration (Recommended)

Keep existing contexts working while gradually adopting cached hooks:

```tsx
// Use the new cached context
import { useAdminContextCached } from '@/contexts/admin-context-cached';

function MyComponent() {
  const {
    requests,           // Cached data
    requestsLoading,    // Loading state
    requestsError,      // Error state
    updateRequestStatusMutation // Mutation object
  } = useAdminContextCached();
  
  // Access loading/error states for better UX
  if (requestsLoading) return <div>Loading...</div>;
  if (requestsError) return <div>Error: {requestsError.message}</div>;
  
  return (
    <div>
      {requests.map(request => (
        <div key={request.id}>{request.what}</div>
      ))}
    </div>
  );
}
```

### Option 2: Direct Hook Usage

For new components, use hooks directly:

```tsx
import { useRequests, useUpdateRequestStatus } from '@/hooks/use-cached-requests';

function RequestsList() {
  const { data: requests, isLoading, error } = useRequests();
  const updateStatus = useUpdateRequestStatus();
  
  const handleStatusChange = (requestId: string, statusId: string) => {
    updateStatus.mutate({ requestId, statusId });
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {requests?.map(request => (
        <RequestCard 
          key={request.id} 
          request={request} 
          onStatusChange={handleStatusChange}
          isUpdating={updateStatus.isPending}
        />
      ))}
    </div>
  );
}
```

## Configuration

### Cache Settings

Default cache configuration (can be customized):

```tsx
{
  queries: {
    staleTime: 1000 * 60 * 5,     // 5 minutes
    gcTime: 1000 * 60 * 30,       // 30 minutes
    retry: 3,                     // Retry failed requests 3 times
    refetchOnWindowFocus: true,   // Refetch when window regains focus
    refetchOnReconnect: true,     // Refetch when network reconnects
  },
  mutations: {
    retry: 2,                     // Retry failed mutations 2 times
  }
}
```

### Stale Times by Data Type

Different data types have different stale times:

- **Requests**: 2 minutes (more dynamic)
- **Equipment/Songs/Venues**: 10 minutes (less dynamic)  
- **Status/Priority/Types**: Default 5 minutes (rarely change)
- **Storage URLs**: Until expiry - 5 minutes (auto-refresh)

## Best Practices

### 1. Use Query States

Always handle loading and error states:

```tsx
const { data, isLoading, error, isFetching } = useRequests();

// isLoading: Initial loading
// isFetching: Background refetching  
// error: Any error that occurred
```

### 2. Optimistic Updates

Mutations include optimistic updates automatically:

```tsx
const updateStatus = useUpdateRequestStatus();

// This will:
// 1. Immediately update the UI optimistically
// 2. Send the request to the server
// 3. Rollback if the request fails
// 4. Keep the optimistic update if it succeeds
updateStatus.mutate({ requestId, statusId });
```

### 3. Manual Cache Management

When needed, you can manually manage the cache:

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';

function useManualCacheUpdate() {
  const queryClient = useQueryClient();
  
  const invalidateRequests = () => {
    queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
  };
  
  const setRequestData = (request: FetchRequest) => {
    queryClient.setQueryData(QueryKeys.request(request.id), request);
  };
  
  return { invalidateRequests, setRequestData };
}
```

### 4. Prefetching

Prefetch data that users are likely to need:

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/query-keys';

function usePrefetchRequest() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  const prefetchRequest = (requestId: string) => {
    queryClient.prefetchQuery({
      queryKey: QueryKeys.request(requestId),
      queryFn: () => fetchSingleRequest(supabase, requestId),
    });
  };
  
  return { prefetchRequest };
}
```

## Debugging

### React Query Devtools

The devtools are automatically enabled in development mode:

```tsx
// Shows in development
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
```

### Manual Cache Inspection

```tsx
import { useInvalidateAllCaches } from '@/hooks/use-realtime-subscriptions';

function DebugPanel() {
  const invalidateAll = useInvalidateAllCaches();
  
  return (
    <button onClick={invalidateAll}>
      Force Refresh All Caches
    </button>
  );
}
```

## Future Enhancements

### Planned Features

1. **Infinite Queries**: For paginated data
2. **Parallel Queries**: For related data fetching
3. **Dependent Queries**: Chain queries based on results
4. **Image Optimization**: Automatic image resizing and caching
5. **Offline Support**: Cache-first with sync when online

### Storage Integration

When images are added, the storage caching system is ready:

```tsx
// Future usage
const { data: imageUrl } = useSignedUrl('request-attachments', 'image-123.jpg');
const uploadImage = useUploadFile('request-attachments');

// Upload with automatic cache invalidation
uploadImage.mutate({ 
  filePath: `requests/${requestId}/image.jpg`, 
  file: imageFile 
});
```

## Performance Benefits

- **Reduced API calls**: Automatic caching prevents duplicate requests
- **Faster UI**: Optimistic updates make the app feel instant
- **Real-time sync**: Changes from other users appear automatically
- **Background updates**: Data stays fresh without user interaction
- **Error resilience**: Automatic retries and fallback handling
- **Request deduplication**: Multiple components requesting same data = single API call

## Conclusion

This caching system provides a solid foundation for high-performance data management in your Supabase application. It handles the complexity of caching, real-time synchronization, and optimistic updates while maintaining a simple API for developers.

The system is designed to be:
- **Progressive**: Adopt gradually without breaking existing code
- **Performant**: Optimized for speed and efficiency
- **Reliable**: Automatic error handling and retries  
- **Future-ready**: Prepared for images and advanced features
- **Developer-friendly**: Simple APIs with comprehensive TypeScript support
