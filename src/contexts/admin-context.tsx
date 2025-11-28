'use client';

import { EquipmentTable, RequestItemTable, SongTable, VenueTable } from "@/lib/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { list, updateRequestStatus, updateRequestPriority, updateRequestType, updateRequestDueDate, addComment, deleteRequest as deleteRequestService, listMembers, assignMember, unassignMember } from "@/services/admin-service";
import { useAuthContext } from "./auth-context";

type TabItem = 'venues' | 'songs' | 'equipment' | 'dashboard' | 'request-items';

type AdminContextType = {
    requests: FetchRequest[]
    items: RequestItem[];
    equipment: Equipment[];
    songs: Song[];
    venues: Venue[];
    members: Member[];
    tab: TabItem;
    updateEquipment: (id: string, available: number) => void;
    updateVenue: (venueId: string, available: boolean) => void;
    updateSong: (venueId: string, type: 'instrumental' | 'lyrics', available: boolean) => void;
    updateRequestStatusOptimistic: (requestId: string, newStatusId: string) => Promise<void>;
    updateRequestPriorityOptimistic: (requestId: string, newPriorityId: string) => Promise<void>;
    updateRequestTypeOptimistic: (requestId: string, newTypeId: string) => Promise<void>;
    updateRequestDueDateOptimistic: (requestId: string, newDueDate: string) => Promise<void>;
    addCommentToRequest: (requestId: string, comment: string) => Promise<void>;
    deleteRequestById: (requestId: string) => Promise<void>;
    assignMemberToRequest: (requestId: string, memberId: string) => Promise<void>;
    unassignMemberFromRequest: (requestId: string, memberId: string) => Promise<void>;
    setTab: (tab: TabItem) => void;
};

export const AdminContext = createContext<AdminContextType | null>(null);

export function AdminContextProvider({ children, supabase }: { children: React.ReactNode, supabase: SupabaseClient }) {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [items, setItems] = useState<RequestItem[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [requests, setRequests] = useState<FetchRequest[]>([]);
    const [tab, setTab] = useState<TabItem>('dashboard');
    const { user } = useAuthContext();

    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [equipmentResult, songsResult, venuesResult, itemsResult, membersResult, requestsResults] = await Promise.all([
                    EquipmentTable.select(supabase),
                    SongTable.select(supabase),
                    VenueTable.select(supabase),
                    RequestItemTable.select(supabase),
                    listMembers(supabase),
                    list(supabase),
                ]);

                if (!isMounted) return;

                if (equipmentResult.error) {
                    console.error("Failed to load statuses", equipmentResult.error);
                } else {
                    setEquipment((equipmentResult.data ?? []) as Equipment[]);
                }

                if (songsResult.error) {
                    console.error("Failed to load priorities", songsResult.error);
                } else {
                    setSongs((songsResult.data ?? []) as Song[]);
                }

                if (itemsResult.error) {
                    console.error("Failed to load items", itemsResult.error);
                } else {
                    setItems((itemsResult.data ?? []) as RequestItem[]);
                }

                if (venuesResult.error) {
                    console.error("Failed to load request types", venuesResult.error);
                } else {
                    setVenues((venuesResult.data ?? []) as Venue[]);
                }

                setMembers(membersResult ?? []);
                setRequests((requestsResults ?? []) as FetchRequest[]);

            } catch (error) {
                if (!isMounted) return;
                console.error("Unexpected error loading defaults", error);
            }
        };

        void loadDefaults();

        // TEMPORARILY ADDED: Refetch data when window gains focus to ensure fresh data
        const handleFocus = () => {
            void loadDefaults();
        };
        
        window.addEventListener('focus', handleFocus);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', handleFocus);
        };
    }, [supabase]);

    const updateVenue = async (venueId: string, available: boolean) => {
        const { error } = await VenueTable.update(supabase, venueId, { available });

        if (error) {
            console.error("Failed to update venue", error);
            return;
        }

        setVenues((prevVenues) =>
            prevVenues.map((venue) =>
                venue.id === venueId ? { ...venue, available } : venue
            )
        );
    }

    const updateSong = async (songID: string, type: 'instrumental' | 'lyrics', available: boolean) => {
        const { error } = await SongTable.update(supabase, songID, { [type]: available });

        if (error) {
            console.error("Failed to update venue", error);
            return;
        }

        setSongs((prevSongs) =>
            prevSongs.map((song) =>
                song.id === songID ? { ...song, [type]: available } : song
            )
        );
    }

    const updateEquipment = async (id: string, available: number) => {
        const { error } = await EquipmentTable.update(supabase, id, { available });

        if (error) {
            console.error("Failed to update equipment", error);
            return;
        }

        setEquipment((prevEquipment) =>
            prevEquipment.map((eq) =>
                eq.id === id ? { ...eq, available } : eq
            )
        );
    }

    const updateRequestStatusOptimistic = async (requestId: string, newStatusId: string) => {
        // Find the status object for the new status ID
        const newStatus = (await supabase.from("status").select("*").eq("id", newStatusId).single()).data;
        
        if (!newStatus) {
            console.error("Status not found");
            return;
        }

        // Optimistically update the local state
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId ? { ...request, status: newStatus as Status } : request
            )
        );

        // Update the database
        const { error } = await updateRequestStatus(supabase, requestId, newStatusId);

        if (error) {
            console.error("Failed to update request status", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const addCommentToRequest = async (requestId: string, comment: string) => {
        if (!user) {
            throw new Error("User must be logged in to add comments");
        }
        
        // Add comment to database
        const { error } = await addComment(supabase, requestId, comment, user.id);

        if (error) {
            console.error("Failed to add comment", error);
            throw error;
        }

        // Optimistically update the local state
        const newNote: Note = {
            id: `temp-${Date.now()}`,
            author: user.id,
            request: requestId,
            note: comment,
            created: new Date().toISOString()
        };

        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId 
                    ? { ...request, note: [...(request.note || []), newNote] }
                    : request
            )
        );
    }

    const updateRequestPriorityOptimistic = async (requestId: string, newPriorityId: string) => {
        // Find the priority object for the new priority ID
        const newPriority = (await supabase.from("priority").select("*").eq("id", newPriorityId).single()).data;
        
        if (!newPriority) {
            console.error("Priority not found");
            return;
        }

        // Optimistically update the local state
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId ? { ...request, priority: newPriority as Priority } : request
            )
        );

        // Update the database
        const { error } = await updateRequestPriority(supabase, requestId, newPriorityId);

        if (error) {
            console.error("Failed to update request priority", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const updateRequestTypeOptimistic = async (requestId: string, newTypeId: string) => {
        // Find the type object for the new type ID
        const newType = (await supabase.from("request_type").select("*").eq("id", newTypeId).single()).data;
        
        if (!newType) {
            console.error("Request type not found");
            return;
        }

        // Optimistically update the local state
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId ? { ...request, type: newType as RequestType } : request
            )
        );

        // Update the database
        const { error } = await updateRequestType(supabase, requestId, newTypeId);

        if (error) {
            console.error("Failed to update request type", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const updateRequestDueDateOptimistic = async (requestId: string, newDueDate: string) => {
        // Optimistically update the local state
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId ? { ...request, due: newDueDate } : request
            )
        );

        // Update the database
        const { error } = await updateRequestDueDate(supabase, requestId, newDueDate);

        if (error) {
            console.error("Failed to update request due date", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const deleteRequestById = async (requestId: string) => {
        const { error } = await deleteRequestService(supabase, requestId);

        if (error) {
            console.error("Failed to delete request", error);
            throw error;
        }

        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
    }

    const assignMemberToRequest = async (requestId: string, memberId: string) => {
        // Optimistically update the UI
        const member = members.find(m => m.id === memberId);
        if (!member) {
            throw new Error("Member not found");
        }

        const newAssignee: Assignee = {
            request_id: requestId,
            member_id: memberId,
            assigned_at: new Date().toISOString(),
            member: member,
        };

        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? { ...request, assignee: [...request.assignee, newAssignee] }
                    : request
            )
        );

        // Update the database
        const { error } = await assignMember(supabase, requestId, memberId);

        if (error) {
            console.error("Failed to assign member", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const unassignMemberFromRequest = async (requestId: string, memberId: string) => {
        // Optimistically update the UI
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? {
                        ...request,
                        assignee: request.assignee.filter((assignee) => assignee.member_id !== memberId),
                    }
                    : request
            )
        );

        // Update the database
        const { error } = await unassignMember(supabase, requestId, memberId);

        if (error) {
            console.error("Failed to unassign member", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const context = {
        requests,
        items,
        equipment,
        songs,
        venues,
        members,
        tab,
        updateVenue,
        updateSong,
        updateRequestStatusOptimistic,
        updateRequestPriorityOptimistic,
        updateRequestTypeOptimistic,
        updateRequestDueDateOptimistic,
        addCommentToRequest,
        deleteRequestById,
        assignMemberToRequest,
        unassignMemberFromRequest,
        setTab,
        updateEquipment,
    };

    return (
        <AdminContext.Provider value={context}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);

    if (!context) throw new Error("useAdminContext must be used within a AdminContextProvider");

    return context;
}
