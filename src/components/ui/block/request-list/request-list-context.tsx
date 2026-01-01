'use client';

import { createContext, useContext, useMemo, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { useFilterContext } from "./request-filter-provider";
import { useRequestContext } from "@/feature/requests/components/request-context";

type SortField = "title" | "type" | "status" | "dueDate" | "createdAt" | "items";
type SortDirection = "asc" | "desc";
type RequestGroup = { status: Status; requests: FetchRequest[] };

export interface RequestListProps {
    requests: FetchRequest[];
    onRequestClick?: (request: FetchRequest) => void;
}

interface RequestListContextValue {
    requests: FetchRequest[];
    filteredRequests: FetchRequest[];
    groupedRequests: RequestGroup[];
    typeFilter: string;
    setTypeFilter: (value: string) => void;
    typeFilterLabel: string;
    sortField: SortField;
    setSortField: (value: SortField) => void;
    sortDirection: SortDirection;
    toggleSortDirection: () => void;
    types: RequestType[];
    isPublic: boolean;
    onRequestClick?: (request: FetchRequest) => void;
    isDraggable: boolean;
    draggedRequestId: string | null;
    dragOverStatusId: string | null;
    isDragging: boolean;
    handleDragStart: (event: DragEvent<HTMLDivElement>, requestId: string) => void;
    handleDragEnd: () => void;
    handleDragOver: (event: DragEvent<HTMLDivElement>, statusId: string) => void;
    handleDrop: (event: DragEvent<HTMLDivElement>, statusId: string) => Promise<void>;
    handleDragLeave: () => void;
}

interface RequestListProviderProps extends RequestListProps {
    children: ReactNode;
    isPublic?: boolean;
}

const RequestListContext = createContext<RequestListContextValue | undefined>(undefined);

export function useRequestListContext() {
    const context = useContext(RequestListContext);
    if (!context) {
        throw new Error("RequestList components must be used within RequestListProvider");
    }
    return context;
}

export function RequestListProvider({ children, requests, onRequestClick, isPublic = true }: RequestListProviderProps) {
    // Safely get admin context - it may not be available in public context
    
    const { types, statuses } = useDefaultContext();
    const { filters, sort } = useFilterContext();
    const { updateRequestStatusOptimistic } = useRequestContext();

    const [isDragging, setIsDragging] = useState(false);

    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [draggedRequestId, setDraggedRequestId] = useState<string | null>(null);
    const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);

    const isDraggable = !isPublic && !!updateRequestStatusOptimistic;

    const filteredRequests = useMemo(() => {
        let result = [...requests];

        // Apply date range filter
        if (filters.dateRange.from || filters.dateRange.to) {
            result = result.filter((request) => {
                if (!request.due) return false;
                const dueDate = new Date(request.due);
                const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
                const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;

                if (fromDate && dueDate < fromDate) return false;
                if (toDate && dueDate > toDate) return false;
                return true;
            });
        }

        // Apply request types filter
        if (filters.requestTypes.length > 0) {
            result = result.filter((request) =>
                request.type && filters.requestTypes.includes(String(request.type.id))
            );
        }

        // Apply priorities filter
        if (filters.priorities.length > 0) {
            result = result.filter((request) => {
                // Compare with the priority ID from the request
                return request.priority && filters.priorities.includes(String(request.priority.id));
            });
        }

        // Apply archived filter - by default hide archived requests
        if (!filters.showArchived) {
            result = result.filter((request) => !request.archived);
        }

        // Legacy type filter (keeping for backward compatibility)
        if (typeFilter !== "all") {
            result = result.filter((request) => String(request.type?.id) === typeFilter);
        }

        // Apply sorting based on filter context
        result.sort((a, b) => {
            let aValue: string | number = 0;
            let bValue: string | number = 0;

            // Map filter sort field to legacy sort field
            const currentSortField =
                sort.field === "name" ? "title" :
                    sort.field === "createDate" ? "createdAt" :
                        sort.field === "dueDate" ? "dueDate" :
                            sort.field === "type" ? "type" :
                                sortField;

            const currentSortDirection = sort.direction || sortDirection;

            switch (currentSortField) {
                case "title":
                    aValue = a.what || "";
                    bValue = b.what || "";
                    break;
                case "type":
                    aValue = a.type?.name || "";
                    bValue = b.type?.name || "";
                    break;
                case "status":
                    aValue = a.status?.name || "";
                    bValue = b.status?.name || "";
                    break;
                case "dueDate":
                    aValue = a.due ? new Date(a.due).getTime() : 0;
                    bValue = b.due ? new Date(b.due).getTime() : 0;
                    break;
                case "createdAt":
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
                case "items":
                    aValue = a.item?.length || 0;
                    bValue = b.item?.length || 0;
                    break;
            }

            return currentSortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        return result;
    }, [requests, filters, sort, typeFilter, sortField, sortDirection]);

    const groupedRequests = useMemo(() => {
        const groups = new Map<string, RequestGroup>();

        statuses.forEach((status) => {
            groups.set(String(status.id), { status, requests: [] });
        });

        filteredRequests.forEach((request) => {
            const statusId = String(request.status?.id);
            if (groups.has(statusId)) {
                groups.get(statusId)!.requests.push(request);
            }
        });

        return Array.from(groups.values()).sort((a, b) => a.status.value - b.status.value);
    }, [filteredRequests, statuses]);

    const typeFilterLabel = useMemo(() => {
        if (typeFilter === "all") {
            return "All Types";
        }

        const match = types.find((type) => String(type.id) === typeFilter);
        return match ? match.name.replace(/_/g, " ") : "All Types";
    }, [typeFilter, types]);

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleDragStart = (event: DragEvent<HTMLDivElement>, requestId: string) => {
        if (!isDraggable) return;

        setDraggedRequestId(requestId);
        setIsDragging(true);

        const currentTarget = event.currentTarget as HTMLElement;
        const rect = currentTarget.getBoundingClientRect();
        const dragImage = currentTarget.cloneNode(true) as HTMLElement;
        dragImage.style.opacity = "0.8";
        dragImage.style.pointerEvents = "none";
        dragImage.style.boxSizing = "border-box";
        dragImage.style.width = `${rect.width}px`;
        dragImage.style.maxWidth = `${rect.width}px`;
        dragImage.style.minWidth = `${rect.width}px`;
        dragImage.style.position = "fixed";
        dragImage.style.top = "-10000px";
        dragImage.style.left = "-10000px";
        dragImage.style.zIndex = "9999";
        document.body.appendChild(dragImage);

        const offsetX = (event.nativeEvent as unknown as MouseEvent).offsetX ?? 0;
        const offsetY = (event.nativeEvent as unknown as MouseEvent).offsetY ?? 0;
        event.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
        setTimeout(() => document.body.removeChild(dragImage), 0);

        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedRequestId(null);
        setDragOverStatusId(null);
        setIsDragging(false);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>, statusId: string) => {
        if (!isDraggable) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOverStatusId(statusId);
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>, statusId: string) => {
        if (!isDraggable || !updateRequestStatusOptimistic) return;
        event.preventDefault();

        if (draggedRequestId) {
            try {
                await updateRequestStatusOptimistic(draggedRequestId, statusId);
            } catch (error) {
                console.error("Failed to update request status:", error);
            }
        }

        handleDragEnd();
    };

    const handleDragLeave = () => {
        setDragOverStatusId(null);
    };

    const value: RequestListContextValue = {
        requests,
        filteredRequests,
        groupedRequests,
        typeFilter,
        setTypeFilter,
        typeFilterLabel,
        sortField,
        setSortField,
        sortDirection,
        toggleSortDirection,
        types,
        isPublic,
        onRequestClick,
        isDraggable,
        draggedRequestId,
        dragOverStatusId,
        isDragging,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        handleDragLeave,
    };

    return (
        <RequestListContext.Provider value={value}>
            {children}
        </RequestListContext.Provider>
    );
}