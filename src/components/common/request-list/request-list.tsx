import { useState, useMemo, DragEvent } from "react";
import { RequestListItem } from "@/components/common/cards/request-list-item";
import { IconButton } from "@/components/common/button";
import Input from "@/components/common/forms/input";
import Select, { Option } from "@/components/common/forms/select";
import EmptyState from "@/components/common/empty-state";
import { useDefaultContext } from "@/contexts/defaults-context";
import { cn } from "@/lib/cn";
import Icon from "../icon";

type SortField = 'title' | 'type' | 'status' | 'dueDate' | 'createdAt' | 'items';
type SortDirection = 'asc' | 'desc';

interface RequestListProps {
  requests: FetchRequest[];
  onRequestClick?: (request: FetchRequest) => void;
  isPublic?: boolean;
  onRequestStatusChange?: (requestId: string, newStatusId: string) => Promise<void>;
}

const statusColors: Record<number, string> = {
  0: "text-gray-600",
  1: "text-blue-600",
  2: "text-yellow-600",
  3: "text-green-600",
  4: "text-red-600",
};

const statusDotColors: Record<number, string> = {
  0: "bg-gray-500",
  1: "bg-blue-500",
  2: "bg-yellow-500",
  3: "bg-green-600",
  4: "bg-red-500",
};

export function RequestList({ requests, onRequestClick, isPublic = true, onRequestStatusChange }: RequestListProps) {
  const { types, statuses } = useDefaultContext();
  const [draggedRequestId, setDraggedRequestId] = useState<string | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggable = !isPublic && !!onRequestStatusChange;
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get all available statuses from defaults context and sort by value
  const uniqueStatuses = useMemo(() => {
    return statuses
      .map(status => ({ 
        id: String(status.id), 
        name: status.name, 
        value: status.value 
      }))
      .sort((a, b) => a.value - b.value);
  }, [statuses]);


  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(request =>
        (request.what?.toLowerCase().includes(term)) ||
        (request.why?.toLowerCase().includes(term)) ||
        (request.how?.toLowerCase().includes(term)) ||
        (request.type?.name.toLowerCase().includes(term))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(request => String(request.type?.id) === typeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.what || '';
          bValue = b.what || '';
          break;
        case 'type':
          aValue = a.type?.name || '';
          bValue = b.type?.name || '';
          break;
        case 'status':
          aValue = a.status?.name || '';
          bValue = b.status?.name || '';
          break;
        case 'dueDate':
          aValue = a.due ? new Date(a.due).getTime() : 0;
          bValue = b.due ? new Date(b.due).getTime() : 0;
          break;
        case 'createdAt':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'items':
          aValue = a.item?.length || 0;
          bValue = b.item?.length || 0;
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [requests, searchTerm, typeFilter, sortField, sortDirection]);

  // Group requests by status
  const groupedRequests = useMemo(() => {
    const groups = new Map<string, { status: Status; requests: FetchRequest[] }>();

    // Initialize groups with all available statuses from defaults context
    statuses.forEach(status => {
      groups.set(String(status.id), { status, requests: [] });
    });

    // Add requests to their respective groups
    filteredAndSortedRequests.forEach(request => {
      const statusId = String(request.status?.id);
      if (groups.has(statusId)) {
        groups.get(statusId)!.requests.push(request);
      }
    });

    // Convert to array and sort by status value
    return Array.from(groups.values()).sort((a, b) => a.status.value - b.status.value);
  }, [filteredAndSortedRequests, statuses]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const typeFilterLabel = useMemo(() => {
    if (typeFilter === 'all') {
      return 'All Types';
    }

    const match = types.find((type) => String(type.id) === typeFilter);
    return match ? match.name.replace(/_/g, ' ') : 'All Types';
  }, [typeFilter, types]);

  // Drag handlers similar to KanbanBoard
  const handleDragStart = (e: DragEvent<HTMLDivElement>, requestId: string) => {
    if (!isDraggable) return;
    
    setDraggedRequestId(requestId);
    setIsDragging(true);
    
    // Create a ghost image for dragging
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
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedRequestId(null);
    setDragOverStatusId(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, statusId: string) => {
    if (!isDraggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatusId(statusId);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, statusId: string) => {
    if (!isDraggable || !onRequestStatusChange) return;
    e.preventDefault();
    
    if (draggedRequestId && onRequestStatusChange) {
      await onRequestStatusChange(draggedRequestId, statusId);
    }
    
    handleDragEnd();
  };

  const handleDragLeave = () => {
    setDragOverStatusId(null);
  };

  return (
    <div className="px-6 pb-4">
      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
            className="w-full sm:w-[200px]"
            placeholder="All Types"
            displayValue={typeFilterLabel}
          >
            <Option value="all">All Types</Option>
            {types.map((type) => (
              <Option key={type.id} value={String(type.id)}>
                {type.name.replace(/_/g, ' ')}
              </Option>
            ))}
          </Select>

          {/* Sort Options */}
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
            className="w-full sm:w-[180px]"
            placeholder="Sort by"
          >
            <Option value="createdAt">Created Date</Option>
            <Option value="dueDate">Due Date</Option>
            <Option value="title">Title</Option>
            <Option value="type">Type</Option>
            <Option value="status">Status</Option>
            <Option value="items">Items Count</Option>
          </Select>

          {/* Sort Direction */}
          <IconButton
            variant="secondary"
            size="md"
            onClick={toggleSortDirection}
            className="shrink-0"
          >
            {sortDirection === 'asc' ? (
              <Icon name="line:chevron_up" size={16} />
            ) : (
              <Icon name="line:chevron_down" size={16} />
            )}
          </IconButton>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedRequests.length} of {requests.length} requests
        </div>
      </div>

      {/* Request List Grouped by Status */}
      <div className="space-y-4">
        {groupedRequests.length > 0 ? (
          groupedRequests.map((group) => (
            <div 
              key={group.status.id} 
              className={cn(
                "bg-secondary rounded-lg transition-all",
                isDraggable && dragOverStatusId === group.status.id && "ring-2 ring-blue-500 ring-offset-2"
              )}
              onDragOver={(e) => handleDragOver(e, group.status.id)}
              onDrop={(e) => handleDrop(e, group.status.id)}
              onDragLeave={handleDragLeave}
            >
              {/* Status Header */}
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="w-3.5 h-3.5 rounded-full p-0.5 bg-primary flex items-center justify-center">
                  <div className={cn("h-2 w-2 rounded-full", statusDotColors[group.status.value])} />
                </span>
                <h3 className={cn("text-sm font-medium capitalize", statusColors[group.status.value])}>
                  {group.status.name.replace(/_/g, ' ')}
                </h3>
                <span className="text-sm text-gray-500">
                  {group.requests.length} request{group.requests.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Requests in this status */}
              <div className={cn(
                "space-y-2 px-2 pb-2",
                isDraggable && "min-h-[60px]"
              )}>
                {group.requests.length > 0 ? (
                  group.requests.map((request) => (
                    <DraggableRequestListItem
                      key={request.id}
                      request={request}
                      isDraggable={isDraggable}
                      isDragging={draggedRequestId === request.id}
                      onDragStart={(e) => handleDragStart(e, request.id)}
                      onDragEnd={handleDragEnd}
                      onRequestClick={isPublic ? undefined : onRequestClick}
                      isPublic={isPublic}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No requests"
                    message={`No requests in ${group.status.name.replace(/_/g, ' ').toLowerCase()} status`}
                    className="my-2"
                  />
                )}
                {isDragging && dragOverStatusId === group.status.id && (
                  <div className="h-1 bg-blue-500 rounded-full animate-pulse mt-2" />
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={searchTerm || typeFilter !== 'all' ? "No results found" : "No requests"}
            message={searchTerm || typeFilter !== 'all'
              ? "No requests found matching your filters. Try adjusting your search or filters."
              : "There are no requests to display at this time."}
            className="my-8"
          />
        )}
      </div>
    </div>
  );
}

// Draggable wrapper for RequestListItem, similar to DraggableRequestCard in KanbanBoard
function DraggableRequestListItem({
  request,
  isDraggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onRequestClick,
  isPublic,
}: {
  request: FetchRequest;
  isDraggable: boolean;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onRequestClick?: (request: FetchRequest) => void;
  isPublic: boolean;
}) {
  const [isDragStarted, setIsDragStarted] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);

  const handleMouseDown = () => {
    if (!isDraggable) return;
    setMouseDownTime(Date.now());
    setIsDragStarted(false);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggable || !mouseDownTime) return;
    
    const timeDiff = Date.now() - mouseDownTime;
    // If it was a quick click (less than 200ms) and no drag was started, treat as click
    if (timeDiff < 200 && !isDragStarted && onRequestClick) {
      e.preventDefault();
      e.stopPropagation();
      onRequestClick(request);
    }
    
    setMouseDownTime(null);
    setIsDragStarted(false);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!isDraggable) return;
    setIsDragStarted(true);
    onDragStart(e);
  };

  const handleDragEnd = () => {
    setIsDragStarted(false);
    onDragEnd();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If dragging is enabled, we handle clicks through mouseUp to avoid conflicts
    if (isDraggable) {
      e.preventDefault();
      return;
    }
    // If not draggable, allow normal click behavior
    if (onRequestClick) {
      onRequestClick(request);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={cn(
        "transition-opacity",
        isDragging && "opacity-50",
        isDraggable ? "cursor-move" : "cursor-pointer"
      )}
    >
      <RequestListItem 
        request={request} 
        onRequestClick={undefined} // Disable RequestListItem's internal click handling
        isPublicView={isPublic}
      />
    </div>
  );
}