import { ReactNode, useState, DragEvent } from "react";

import Text from "@/components/ui/text";
import EmptyState from "@/components/ui/EmptyState";
import RequestCard from "@/components/ui/RequestCard";
import { cn } from "@/lib/cn";

type Column = { [key: string]: string }

type KanbanProps = {
    columns: Column[]
    data: FetchRequest[]
    isDraggable?: boolean
    onRequestStatusChange?: (requestId: string, newStatusId: string) => Promise<void>
}

function KanbanBoard({ columns, data, isDraggable = false, onRequestStatusChange }: KanbanProps) {
    const [draggedRequestId, setDraggedRequestId] = useState<string | null>(null);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
    // Indicator is column-based; no need to track item index
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, requestId: string) => {
        if (!isDraggable) return;
        
        setDraggedRequestId(requestId);
        setIsDragging(true);
        
        // Create a ghost image for dragging that preserves the original card width
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
        dragImage.style.opacity = '0.8';
        dragImage.style.pointerEvents = 'none';
        dragImage.style.boxSizing = 'border-box';
        dragImage.style.width = `${rect.width}px`;
        dragImage.style.maxWidth = `${rect.width}px`;
        dragImage.style.minWidth = `${rect.width}px`;
        dragImage.style.position = 'fixed';
        dragImage.style.top = '-10000px';
        dragImage.style.left = '-10000px';
        dragImage.style.zIndex = '9999';
        document.body.appendChild(dragImage);
        
        const offsetX = (e.nativeEvent as unknown as MouseEvent).offsetX ?? 0;
        const offsetY = (e.nativeEvent as unknown as MouseEvent).offsetY ?? 0;
        e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
        // Browser snapshots the image immediately; safe to remove on next tick
        setTimeout(() => document.body.removeChild(dragImage), 0);
        
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedRequestId(null);
        setDragOverColumnId(null);
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: string) => {
        if (!isDraggable) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumnId(columnId);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>, columnId: string) => {
        if (!isDraggable) return;
        e.preventDefault();
        
        if (draggedRequestId && onRequestStatusChange) {
            await onRequestStatusChange(draggedRequestId, columnId);
        }
        
        handleDragEnd();
    };

    return (
        <div className="flex-1 flex gap-2 px-3 py-2">
            {columns.map((column) => {
                const columnKey = Object.keys(column)[0];
                const requestsForColumn = data.filter((request) => {
                    const statusId = request.status?.id;
                    if (statusId === undefined || statusId === null) return false;
                    return String(statusId) === columnKey;
                });

                return (
                    <KanbanColumn 
                        key={columnKey}
                        onDragOver={(e) => handleDragOver(e, columnKey)}
                        onDrop={(e) => handleDrop(e, columnKey)}
                        onDragLeave={() => setDragOverColumnId(null)}
                        isDraggedOver={dragOverColumnId === columnKey}
                    >
                        <KanbanHeader column={column} count={requestsForColumn.length} />
                        <KanbanContent isDraggable={isDraggable}>
                            {requestsForColumn.map((request) => (
                                <DraggableRequestCard
                                    key={request.id}
                                    request={request}
                                    isDraggable={isDraggable}
                                    isDragging={draggedRequestId === request.id}
                                    onDragStart={(e) => handleDragStart(e, request.id)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                            {isDragging && dragOverColumnId === columnKey && (
                                <div className="h-1 bg-pink-500 rounded-full animate-pulse mt-2" />
                            )}
                        </KanbanContent>
                    </KanbanColumn>
                );
            })}
        </div>
    )
}

function KanbanColumn({ 
    children, 
    onDragOver, 
    onDrop, 
    onDragLeave,
    isDraggedOver 
}: { 
    children?: ReactNode;
    onDragOver?: (e: DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: DragEvent<HTMLDivElement>) => void;
    onDragLeave?: () => void;
    isDraggedOver?: boolean;
}) {
    return (
        <div 
            className={cn(
                "flex-1 flex flex-col bg-secondary rounded-md overflow-clip min-w-[250px] transition-all",
                isDraggedOver && "ring-2 ring-pink-500 ring-offset-2"
            )}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
        >
            {children}
        </div>
    )
}

function KanbanHeader({ column, count }: { column: Column; count: number }) {
    return (
        // <div className="px-5 py-4 sticky top-15 bg-secondary" >
        <div className="px-5 py-4" >
            <Text style="label-md" >{Object.values(column)[0]}</Text>
            <Text style="paragraph-sm" >{count} Requests</Text>
        </div>
    )
}

function KanbanContent({ children, isDraggable }: { children?: ReactNode; isDraggable?: boolean }) {
    return (
        <div className={cn(
            "p-2 flex-1 flex flex-col bg-secondary rounded-md gap-2",
            isDraggable && "min-h-[100px]"
        )}>
            {children ? children : <EmptyState />}
        </div>
    )
}

function DraggableRequestCard({
    request,
    isDraggable,
    isDragging,
    onDragStart,
    onDragEnd,
}: {
    request: FetchRequest;
    isDraggable: boolean;
    isDragging: boolean;
    onDragStart: (e: DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
}) {
    return (
        <div
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={cn(
                "transition-opacity",
                isDragging && "opacity-50",
                isDraggable && "cursor-move"
            )}
        >
            <RequestCard 
                request={request} 
                setActive={() => {}} 
                className={cn(
                    isDraggable && "hover:shadow-lg transition-shadow"
                )}
            />
        </div>
    );
}

export { KanbanBoard }

export type { Column }