'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from './use-supabase-client';
import { QueryKeys } from '@/lib/query-keys';

// Hook for getting a signed URL for a file with caching
export function useSignedUrl(bucketName: string, filePath: string, expiresIn = 3600) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.storage.file(bucketName, filePath),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);
      
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!bucketName && !!filePath,
    staleTime: (expiresIn - 300) * 1000, // Refresh 5 minutes before expiry
    gcTime: expiresIn * 1000, // Cache for the full expiry time
  });
}

// Hook for listing files in a bucket with caching
export function useStorageBucket(bucketName: string, folder = '', options?: {
  limit?: number;
  offset?: number;
  sortBy?: { column: string; order: 'asc' | 'desc' };
}) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: [QueryKeys.storage.bucket(bucketName), folder, options],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      
      let query = supabase.storage.from(bucketName).list(folder, options);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!bucketName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for uploading files with cache invalidation
export function useUploadFile(bucketName: string) {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ 
      filePath, 
      file, 
      options 
    }: { 
      filePath: string; 
      file: File | Blob; 
      options?: { cacheControl?: string; contentType?: string; upsert?: boolean } 
    }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, options);
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate bucket listing
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.storage.bucket(bucketName) 
      });
      
      // Remove any existing signed URL for this file so it gets refreshed
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.storage.file(bucketName, variables.filePath) 
      });
    },
  });
}

// Hook for downloading files with caching
export function useDownloadFile(bucketName: string, filePath: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['storage-download', bucketName, filePath],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);
      
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!bucketName && !!filePath,
    staleTime: 1000 * 60 * 10, // 10 minutes for file content
  });
}

// Hook for deleting files with cache invalidation
export function useDeleteFile(bucketName: string) {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async (filePaths: string[]) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, filePaths) => {
      // Invalidate bucket listing
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.storage.bucket(bucketName) 
      });
      
      // Remove signed URLs and downloads for deleted files
      filePaths.forEach(filePath => {
        queryClient.removeQueries({ 
          queryKey: QueryKeys.storage.file(bucketName, filePath) 
        });
        queryClient.removeQueries({ 
          queryKey: ['storage-download', bucketName, filePath] 
        });
      });
    },
  });
}

// Hook for moving/renaming files with cache invalidation
export function useMoveFile(bucketName: string) {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ 
      fromPath, 
      toPath 
    }: { 
      fromPath: string; 
      toPath: string 
    }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .move(fromPath, toPath);
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate bucket listing
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.storage.bucket(bucketName) 
      });
      
      // Remove old file cache and invalidate new file path
      queryClient.removeQueries({ 
        queryKey: QueryKeys.storage.file(bucketName, variables.fromPath) 
      });
      queryClient.removeQueries({ 
        queryKey: ['storage-download', bucketName, variables.fromPath] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.storage.file(bucketName, variables.toPath) 
      });
    },
  });
}

// Utility hook to prefetch common storage operations
export function usePrefetchStorage() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return {
    prefetchBucket: (bucketName: string, folder = '') => {
      return queryClient.prefetchQuery({
        queryKey: [QueryKeys.storage.bucket(bucketName), folder],
        queryFn: async () => {
          if (!supabase) throw new Error('Supabase client not available');
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list(folder);
          
          if (error) throw error;
          return data;
        },
        staleTime: 1000 * 60 * 5,
      });
    },
    
    prefetchSignedUrl: (bucketName: string, filePath: string, expiresIn = 3600) => {
      return queryClient.prefetchQuery({
        queryKey: QueryKeys.storage.file(bucketName, filePath),
        queryFn: async () => {
          if (!supabase) throw new Error('Supabase client not available');
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, expiresIn);
          
          if (error) throw error;
          return data;
        },
        staleTime: (expiresIn - 300) * 1000,
      });
    },
  };
}
