'use client';

import { createContext, useContext } from "react";
import { useAuthContext } from "./auth-context";
import { 
  useRequests, 
  useUpdateRequestStatus, 
  useAddComment, 
  useDeleteRequest 
} from "@/hooks/use-cached-requests";
import { 
  useEquipment, 
  useUpdateEquipment,
  useSongs,
  useUpdateSong,
  useVenues,
  useUpdateVenue,
  useRequestItems
} from "@/hooks/use-cached-defaults";

type TabItem = 'venues' | 'songs' | 'equipment' | 'dashboard' | 'request-items';

type AdminContextType = {
  // Data
  requests: FetchRequest[];
  items: RequestItem[];
  equipment: Equipment[];
  songs: Song[];
  venues: Venue[];
  
  // Loading states
  requestsLoading: boolean;
  itemsLoading: boolean;
  equipmentLoading: boolean;
  songsLoading: boolean;
  venuesLoading: boolean;
  
  // Error states
  requestsError: Error | null;
  itemsError: Error | null;
  equipmentError: Error | null;
  songsError: Error | null;
  venuesError: Error | null;
  
  // UI State
  tab: TabItem;
  setTab: (tab: TabItem) => void;
  
  // Mutations (returning mutation objects for loading/error states)
  updateEquipmentMutation: ReturnType<typeof useUpdateEquipment>;
  updateVenueMutation: ReturnType<typeof useUpdateVenue>;
  updateSongMutation: ReturnType<typeof useUpdateSong>;
  updateRequestStatusMutation: ReturnType<typeof useUpdateRequestStatus>;
  addCommentMutation: ReturnType<typeof useAddComment>;
  deleteRequestMutation: ReturnType<typeof useDeleteRequest>;
  
  // Legacy methods for backward compatibility
  updateEquipment: (id: string, available: number) => void;
  updateVenue: (venueId: string, available: boolean) => void;
  updateSong: (songId: string, type: 'instrumental' | 'lyrics', available: boolean) => void;
  updateRequestStatusOptimistic: (requestId: string, newStatusId: string) => Promise<void>;
  addCommentToRequest: (requestId: string, comment: string) => Promise<void>;
  deleteRequestById: (requestId: string) => Promise<void>;
};

export const AdminContextCached = createContext<AdminContextType | null>(null);

export function AdminContextCachedProvider({ 
  children, 
  tab = 'dashboard',
  onTabChange
}: { 
  children: React.ReactNode; 
  tab?: TabItem;
  onTabChange?: (tab: TabItem) => void;
}) {
  const { user } = useAuthContext();

  // Cached queries
  const requestsQuery = useRequests();
  const itemsQuery = useRequestItems();
  const equipmentQuery = useEquipment();
  const songsQuery = useSongs();
  const venuesQuery = useVenues();

  // Mutations
  const updateEquipmentMutation = useUpdateEquipment();
  const updateVenueMutation = useUpdateVenue();
  const updateSongMutation = useUpdateSong();
  const updateRequestStatusMutation = useUpdateRequestStatus();
  const addCommentMutation = useAddComment();
  const deleteRequestMutation = useDeleteRequest();

  // Legacy methods for backward compatibility
  const updateEquipment = (id: string, available: number) => {
    updateEquipmentMutation.mutate({ id, available });
  };

  const updateVenue = (venueId: string, available: boolean) => {
    updateVenueMutation.mutate({ venueId, available });
  };

  const updateSong = (songId: string, type: 'instrumental' | 'lyrics', available: boolean) => {
    updateSongMutation.mutate({ songId, type, available });
  };

  const updateRequestStatusOptimistic = async (requestId: string, newStatusId: string) => {
    try {
      await updateRequestStatusMutation.mutateAsync({ requestId, statusId: newStatusId });
    } catch (error) {
      console.error("Failed to update request status", error);
      throw error;
    }
  };

  const addCommentToRequest = async (requestId: string, comment: string) => {
    if (!user) {
      throw new Error("User must be logged in to add comments");
    }
    
    try {
      await addCommentMutation.mutateAsync({ 
        requestId, 
        comment, 
        authorId: user.id 
      });
    } catch (error) {
      console.error("Failed to add comment", error);
      throw error;
    }
  };

  const deleteRequestById = async (requestId: string) => {
    try {
      await deleteRequestMutation.mutateAsync(requestId);
    } catch (error) {
      console.error("Failed to delete request", error);
      throw error;
    }
  };

  const setTab = (newTab: TabItem) => {
    onTabChange?.(newTab);
  };

  const context: AdminContextType = {
    // Data
    requests: requestsQuery.data ?? [],
    items: itemsQuery.data ?? [],
    equipment: equipmentQuery.data ?? [],
    songs: songsQuery.data ?? [],
    venues: venuesQuery.data ?? [],
    
    // Loading states
    requestsLoading: requestsQuery.isLoading,
    itemsLoading: itemsQuery.isLoading,
    equipmentLoading: equipmentQuery.isLoading,
    songsLoading: songsQuery.isLoading,
    venuesLoading: venuesQuery.isLoading,
    
    // Error states
    requestsError: requestsQuery.error,
    itemsError: itemsQuery.error,
    equipmentError: equipmentQuery.error,
    songsError: songsQuery.error,
    venuesError: venuesQuery.error,
    
    // UI State
    tab,
    setTab,
    
    // Mutations
    updateEquipmentMutation,
    updateVenueMutation,
    updateSongMutation,
    updateRequestStatusMutation,
    addCommentMutation,
    deleteRequestMutation,
    
    // Legacy methods
    updateEquipment,
    updateVenue,
    updateSong,
    updateRequestStatusOptimistic,
    addCommentToRequest,
    deleteRequestById,
  };

  return (
    <AdminContextCached.Provider value={context}>
      {children}
    </AdminContextCached.Provider>
  );
}

export function useAdminContextCached() {
  const context = useContext(AdminContextCached);
  
  if (!context) {
    throw new Error("useAdminContextCached must be used within a AdminContextCachedProvider");
  }
  
  return context;
}
