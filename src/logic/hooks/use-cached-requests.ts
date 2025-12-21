'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from './use-supabase-client';
import { QueryKeys } from '@/lib/query-keys';
import { addComment } from '@/logic/services/admin-service';
import { RequestTable } from '@/lib/database';

// Hook for fetching requests with automatic caching
export function useRequests() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.requests(),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      return RequestTable.list(supabase);
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 2, // 2 minutes for requests (more dynamic data)
  });
}

// Hook for fetching a single request
export function useRequest(requestId: string | null) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.request(requestId || ''),
    queryFn: async () => {
      if (!supabase || !requestId) throw new Error('Supabase client or request ID not available');
      
      // For now, we'll filter from the cached requests list
      // In the future, you might want a dedicated endpoint for single request
      const allRequests = await RequestTable.list(supabase);
      const request = allRequests.find(r => r.id === requestId);
      
      if (!request) throw new Error('Request not found');
      return request;
    },
    enabled: !!supabase && !!requestId,
  });
}

// Hook for updating request status with optimistic updates
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ requestId, statusId }: { requestId: string; statusId: string }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      // Get the new status details first
      const statusResponse = await supabase
        .from('status')
        .select('*')
        .eq('id', statusId)
        .single();
      
      if (statusResponse.error) throw statusResponse.error;
      
      const result = await RequestTable.update(supabase, requestId, { status: statusId });
      if (result.error) throw result.error;
      
      return { requestId, status: statusResponse.data };
    },
    onMutate: async ({ requestId, statusId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.requests() });
      await queryClient.cancelQueries({ queryKey: QueryKeys.request(requestId) });
      
      // Snapshot the previous values
      const previousRequests = queryClient.getQueryData<FetchRequest[]>(QueryKeys.requests());
      const previousRequest = queryClient.getQueryData<FetchRequest>(QueryKeys.request(requestId));
      
      // Get status details for optimistic update
      if (supabase) {
        const statusResponse = await supabase
          .from('status')
          .select('*')
          .eq('id', statusId)
          .single();
          
        if (!statusResponse.error) {
          const newStatus = statusResponse.data as Status;
          
          // Optimistically update requests list
          if (previousRequests) {
            queryClient.setQueryData<FetchRequest[]>(
              QueryKeys.requests(),
              previousRequests.map(request =>
                request.id === requestId ? { ...request, status: newStatus } : request
              )
            );
          }
          
          // Optimistically update single request
          if (previousRequest) {
            queryClient.setQueryData<FetchRequest>(
              QueryKeys.request(requestId),
              { ...previousRequest, status: newStatus }
            );
          }
        }
      }
      
      return { previousRequests, previousRequest };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousRequests) {
        queryClient.setQueryData(QueryKeys.requests(), context.previousRequests);
      }
      if (context?.previousRequest) {
        queryClient.setQueryData(QueryKeys.request(variables.requestId), context.previousRequest);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.request(variables.requestId) });
    },
  });
}

// Hook for adding comments with optimistic updates
export function useAddComment() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ requestId, comment, authorId }: { requestId: string; comment: string; authorId: string }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const result = await addComment(supabase, requestId, comment, authorId);
      if (result.error) throw result.error;
      
      return { requestId, comment, authorId };
    },
    onMutate: async ({ requestId, comment, authorId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.requests() });
      await queryClient.cancelQueries({ queryKey: QueryKeys.request(requestId) });
      
      // Create optimistic comment
      const optimisticComment: Note = {
        id: `temp-${Date.now()}`,
        author: authorId,
        request: requestId,
        note: comment,
        created: new Date().toISOString(),
      };
      
      // Snapshot previous values
      const previousRequests = queryClient.getQueryData<FetchRequest[]>(QueryKeys.requests());
      const previousRequest = queryClient.getQueryData<FetchRequest>(QueryKeys.request(requestId));
      
      // Optimistically update requests list
      if (previousRequests) {
        queryClient.setQueryData<FetchRequest[]>(
          QueryKeys.requests(),
          previousRequests.map(request =>
            request.id === requestId
              ? { ...request, note: [...(request.note || []), optimisticComment] }
              : request
          )
        );
      }
      
      // Optimistically update single request
      if (previousRequest) {
        queryClient.setQueryData<FetchRequest>(
          QueryKeys.request(requestId),
          { ...previousRequest, note: [...(previousRequest.note || []), optimisticComment] }
        );
      }
      
      return { previousRequests, previousRequest };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousRequests) {
        queryClient.setQueryData(QueryKeys.requests(), context.previousRequests);
      }
      if (context?.previousRequest) {
        queryClient.setQueryData(QueryKeys.request(variables.requestId), context.previousRequest);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.request(variables.requestId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.requestComments(variables.requestId) });
    },
  });
}

// Hook for deleting requests
export function useDeleteRequest() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const result = await RequestTable.delete(supabase, requestId);
      if (result.error) throw result.error;
      
      return requestId;
    },
    onMutate: async (requestId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.requests() });
      
      // Snapshot previous value
      const previousRequests = queryClient.getQueryData<FetchRequest[]>(QueryKeys.requests());
      
      // Optimistically remove from list
      if (previousRequests) {
        queryClient.setQueryData<FetchRequest[]>(
          QueryKeys.requests(),
          previousRequests.filter(request => request.id !== requestId)
        );
      }
      
      return { previousRequests };
    },
    onError: (error, requestId, context) => {
      // Rollback on error
      if (context?.previousRequests) {
        queryClient.setQueryData(QueryKeys.requests(), context.previousRequests);
      }
    },
    onSettled: (requestId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
      if (requestId) {
        queryClient.removeQueries({ queryKey: QueryKeys.request(requestId) });
      }
    },
  });
}
