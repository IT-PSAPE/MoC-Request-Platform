'use client';

import { MembersTable, RequestTable} from "@/shared/database";
import { createContext, useContext, useEffect, useState } from "react";
import { addComment, assignMember, unassignMember } from "@/logic/services/admin-service";
import { useAuthContext } from "@/feature/auth";
import { useDefaultContext } from "@/components/contexts/defaults-context";

type RequestContextType = {
    requests: FetchRequest[]
    members: Member[];
    updateRequestStatusOptimistic: (requestId: string, newStatusId: string) => Promise<void>;
    updateRequestPriorityOptimistic: (requestId: string, newPriorityId: string) => Promise<void>;
    updateRequestTypeOptimistic: (requestId: string, newTypeId: string) => Promise<void>;
    updateRequestDueDateOptimistic: (requestId: string, newDueDate: string) => Promise<void>;
    addCommentToRequest: (requestId: string, comment: string) => Promise<void>;
    deleteRequestById: (requestId: string) => Promise<void>;
    assignMemberToRequest: (requestId: string, memberId: string) => Promise<void>;
    unassignMemberFromRequest: (requestId: string, memberId: string) => Promise<void>;
};

const RequestContext = createContext<RequestContextType | null>(null);

export function useRequestContext() {
    const context = useContext(RequestContext);

    if (!context) throw new Error("useRequestContext must be used within a RequestContextProvider");

    return context;
}

export function RequestContextProvider({ children }: { children: React.ReactNode}) {
    const { statuses, priorities, types } = useDefaultContext();
    const { supabase } = useDefaultContext();

    const [members, setMembers] = useState<Member[]>([]);
    const [requests, setRequests] = useState<FetchRequest[]>([]);
    const { user } = useAuthContext();


    useEffect(() => {
        let isMounted = true;

        const loadDefaults = async () => {
            try {
                const [membersResult, requestsResults] = await Promise.all([
                    MembersTable.select(supabase),
                    RequestTable.list(supabase),
                ]);

                if (!isMounted) return;

                if (membersResult.error) {
                    console.error("Failed to load members", membersResult.error);
                } else {
                    setMembers((membersResult.data ?? []) as Member[]);
                }
                
                // if (requestsResults.error) {
                //     console.error("Failed to load requests", requestsResults.error);
                // } else {
                //     setRequests((requestsResults.data ?? []) as FetchRequest[]);
                // }

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

    const updateRequestStatusOptimistic = async (requestId: string, newStatusId: string) => {
        // Find the status object for the new status ID
        const newStatus = statuses.find(s => s.id === newStatusId);

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
        const { error } = await RequestTable.update(supabase, requestId, { status: newStatusId });

        if (error) {
            console.error("Failed to update request status", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await RequestTable.list(supabase);
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
        const newPriority = priorities.find(p => p.id === newPriorityId);

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
        const { error } = await RequestTable.update(supabase, requestId, { priority: newPriorityId });

        if (error) {
            console.error("Failed to update request priority", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await RequestTable.list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const updateRequestTypeOptimistic = async (requestId: string, newTypeId: string) => {
        // Find the type object for the new type ID
        const newType = types.find(t => t.id === newTypeId);

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
        const { error } = await RequestTable.update(supabase, requestId, { type: newTypeId });

        if (error) {
            console.error("Failed to update request type", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await RequestTable.list(supabase);
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
        const { error } = await RequestTable.update(supabase, requestId, { due: newDueDate });

        if (error) {
            console.error("Failed to update request due date", error);
            // Revert the optimistic update by re-fetching the data
            const updatedRequests = await RequestTable.list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const deleteRequestById = async (requestId: string) => {
        const { error } = await RequestTable.delete(supabase, requestId);

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
            const updatedRequests = await RequestTable.list(supabase);
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
            const updatedRequests = await RequestTable.list(supabase);
            setRequests(updatedRequests);
            throw error;
        }
    }

    const context = {
        requests,
        members,
        updateRequestStatusOptimistic,
        updateRequestPriorityOptimistic,
        updateRequestTypeOptimistic,
        updateRequestDueDateOptimistic,
        addCommentToRequest,
        deleteRequestById,
        assignMemberToRequest,
        unassignMemberFromRequest,
    };

    return (
        <RequestContext.Provider value={context}>
            {children}
        </RequestContext.Provider>
    );
}
