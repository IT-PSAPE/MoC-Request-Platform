'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useSupabaseClient } from './use-supabase-client';
import { QueryKeys } from '@/shared/query-keys';

// Hook to set up real-time subscriptions for cache invalidation
export function useRealtimeSubscriptions() {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!supabase) return;

    const channels: RealtimeChannel[] = [];

    // Requests table subscription
    const requestsChannel = supabase
      .channel('requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'request',
        },
        (payload) => {
          console.log('Requests table changed:', payload);
          
          // Invalidate all request-related queries
          queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
          
          // If it's an update/delete on a specific request, invalidate that request too
          if ((payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') && payload.old && 'id' in payload.old && payload.old.id) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.request(payload.old.id as string) });
          }
          
          // If it's an insert/update, invalidate the specific request by new ID
          if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && payload.new && 'id' in payload.new && payload.new.id) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.request(payload.new.id as string) });
          }
        }
      )
      .subscribe();

    // Equipment table subscription
    const equipmentChannel = supabase
      .channel('equipment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment',
        },
        (payload) => {
          console.log('Equipment table changed:', payload);
          queryClient.invalidateQueries({ queryKey: QueryKeys.equipment() });
          
          // Invalidate specific equipment item if ID is available
          const equipmentId = (payload.new && 'id' in payload.new && payload.new.id) || (payload.old && 'id' in payload.old && payload.old.id);
          if (equipmentId) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.equipmentItem(equipmentId as string) });
          }
        }
      )
      .subscribe();

    // Songs table subscription
    const songsChannel = supabase
      .channel('songs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song',
        },
        (payload) => {
          console.log('Songs table changed:', payload);
          queryClient.invalidateQueries({ queryKey: QueryKeys.songs() });
          
          // Invalidate specific song if ID is available
          const songId = (payload.new && 'id' in payload.new && payload.new.id) || (payload.old && 'id' in payload.old && payload.old.id);
          if (songId) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.song(songId as string) });
          }
        }
      )
      .subscribe();

    // Venues table subscription
    const venuesChannel = supabase
      .channel('venues-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'venue',
        },
        (payload) => {
          console.log('Venues table changed:', payload);
          queryClient.invalidateQueries({ queryKey: QueryKeys.venues() });
          
          // Invalidate specific venue if ID is available
          const venueId = (payload.new && 'id' in payload.new && payload.new.id) || (payload.old && 'id' in payload.old && payload.old.id);
          if (venueId) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.venue(venueId as string) });
          }
        }
      )
      .subscribe();

    // Request items table subscription
    const itemsChannel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'item',
        },
        (payload) => {
          console.log('Items table changed:', payload);
          queryClient.invalidateQueries({ queryKey: QueryKeys.items() });
          
          // Invalidate specific item if ID is available
          const itemId = (payload.new && 'id' in payload.new && payload.new.id) || (payload.old && 'id' in payload.old && payload.old.id);
          if (itemId) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.item(itemId as string) });
          }
        }
      )
      .subscribe();

    // Notes/comments table subscription
    const notesChannel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'note',
        },
        (payload) => {
          console.log('Notes table changed:', payload);
          
          // Invalidate request queries when comments change
          const requestId = (payload.new && 'request' in payload.new && payload.new.request) || (payload.old && 'request' in payload.old && payload.old.request);
          if (requestId) {
            queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.request(requestId as string) });
            queryClient.invalidateQueries({ queryKey: QueryKeys.requestComments(requestId as string) });
          }
        }
      )
      .subscribe();

    // Status, Priority, and Type tables (these change rarely, so longer stale times are OK)
    const statusChannel = supabase
      .channel('status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'status',
        },
        () => {
          console.log('Status table changed');
          queryClient.invalidateQueries({ queryKey: QueryKeys.statuses() });
          // Also invalidate requests since they contain status info
          queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
        }
      )
      .subscribe();

    const priorityChannel = supabase
      .channel('priority-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'priority',
        },
        () => {
          console.log('Priority table changed');
          queryClient.invalidateQueries({ queryKey: QueryKeys.priorities() });
          queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
        }
      )
      .subscribe();

    const requestTypeChannel = supabase
      .channel('request-type-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'request_type',
        },
        () => {
          console.log('Request type table changed');
          queryClient.invalidateQueries({ queryKey: QueryKeys.requestTypes() });
          queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
        }
      )
      .subscribe();

    // Store all channels for cleanup
    channels.push(
      requestsChannel,
      equipmentChannel,
      songsChannel,
      venuesChannel,
      itemsChannel,
      notesChannel,
      statusChannel,
      priorityChannel,
      requestTypeChannel
    );

    // Cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [supabase, queryClient]);
}

// Hook to manually invalidate all caches (useful for debugging or force refresh)
export function useInvalidateAllCaches() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: QueryKeys.requests() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.equipment() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.songs() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.venues() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.items() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.statuses() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.priorities() });
    queryClient.invalidateQueries({ queryKey: QueryKeys.requestTypes() });
  };
}
