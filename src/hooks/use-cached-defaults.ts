'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from './use-supabase-client';
import { QueryKeys } from '@/lib/query-keys';
import { EquipmentTable, SongTable, VenueTable, RequestItemTable } from '@/lib/database';

// Hook for fetching equipment with automatic caching
export function useEquipment() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.equipment(),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      const result = await EquipmentTable.select(supabase);
      if (result.error) throw result.error;
      return (result.data ?? []) as Equipment[];
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 10, // 10 minutes - equipment changes less frequently
  });
}

// Hook for updating equipment availability
export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ id, available }: { id: string; available: number }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const result = await EquipmentTable.update(supabase, id, { available });
      if (result.error) throw result.error;
      
      return { id, available };
    },
    onMutate: async ({ id, available }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.equipment() });
      
      // Snapshot the previous value
      const previousEquipment = queryClient.getQueryData<Equipment[]>(QueryKeys.equipment());
      
      // Optimistically update
      if (previousEquipment) {
        queryClient.setQueryData<Equipment[]>(
          QueryKeys.equipment(),
          previousEquipment.map(eq => eq.id === id ? { ...eq, available } : eq)
        );
      }
      
      return { previousEquipment };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousEquipment) {
        queryClient.setQueryData(QueryKeys.equipment(), context.previousEquipment);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.equipment() });
    },
  });
}

// Hook for fetching songs with automatic caching
export function useSongs() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.songs(),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      const result = await SongTable.select(supabase);
      if (result.error) throw result.error;
      return (result.data ?? []) as Song[];
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for updating song availability
export function useUpdateSong() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ 
      songId, 
      type, 
      available 
    }: { 
      songId: string; 
      type: 'instrumental' | 'lyrics'; 
      available: boolean 
    }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const result = await SongTable.update(supabase, songId, { [type]: available });
      if (result.error) throw result.error;
      
      return { songId, type, available };
    },
    onMutate: async ({ songId, type, available }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.songs() });
      
      // Snapshot the previous value
      const previousSongs = queryClient.getQueryData<Song[]>(QueryKeys.songs());
      
      // Optimistically update
      if (previousSongs) {
        queryClient.setQueryData<Song[]>(
          QueryKeys.songs(),
          previousSongs.map(song => 
            song.id === songId ? { ...song, [type]: available } : song
          )
        );
      }
      
      return { previousSongs };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSongs) {
        queryClient.setQueryData(QueryKeys.songs(), context.previousSongs);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.songs() });
    },
  });
}

// Hook for fetching venues with automatic caching
export function useVenues() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.venues(),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      const result = await VenueTable.select(supabase);
      if (result.error) throw result.error;
      return (result.data ?? []) as Venue[];
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for updating venue availability
export function useUpdateVenue() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ venueId, available }: { venueId: string; available: boolean }) => {
      if (!supabase) throw new Error('Supabase client not available');
      
      const result = await VenueTable.update(supabase, venueId, { available });
      if (result.error) throw result.error;
      
      return { venueId, available };
    },
    onMutate: async ({ venueId, available }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QueryKeys.venues() });
      
      // Snapshot the previous value
      const previousVenues = queryClient.getQueryData<Venue[]>(QueryKeys.venues());
      
      // Optimistically update
      if (previousVenues) {
        queryClient.setQueryData<Venue[]>(
          QueryKeys.venues(),
          previousVenues.map(venue => venue.id === venueId ? { ...venue, available } : venue)
        );
      }
      
      return { previousVenues };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousVenues) {
        queryClient.setQueryData(QueryKeys.venues(), context.previousVenues);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.venues() });
    },
  });
}

// Hook for fetching request items with automatic caching
export function useRequestItems() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: QueryKeys.items(),
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase client not available');
      const result = await RequestItemTable.select(supabase);
      if (result.error) throw result.error;
      return (result.data ?? []) as RequestItem[];
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
