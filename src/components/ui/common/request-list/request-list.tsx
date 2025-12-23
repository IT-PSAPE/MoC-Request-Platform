import { createContext, useContext, useMemo, useState } from "react";
import type { DragEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { RequestListItem } from "@/components/ui/common/request-list/request-list-item";
import { IconButton } from "@/components/ui/common/controls/button";
import Select, { Option } from "@/components/ui/common/controls/select";
import EmptyState from "@/components/ui/common/empty-state";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/common/icon";
import Text from "@/components/ui/common/text";
import { TabContextProvider, TabItem, TabList } from "@/components/ui/common/tabs";
import { FilterProvider, useFilterContext } from "./filter-provider";

type SortField = "title" | "type" | "status" | "dueDate" | "createdAt" | "items";
type SortDirection = "asc" | "desc";
type RequestGroup = { status: Status; requests: FetchRequest[] };

interface RequestListProps {
  requests: FetchRequest[];
  onRequestClick?: (request: FetchRequest) => void;
  isPublic?: boolean;
  onRequestStatusChange?: (requestId: string, newStatusId: string) => Promise<void>;
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

type IndicatorProps = {
  color: IndicatorColor;
};

interface RequestListProviderProps extends RequestListProps {
  children: ReactNode;
}

const RequestListContext = createContext<RequestListContextValue | undefined>(undefined);

function useRequestListContext() {
  const context = useContext(RequestListContext);
  if (!context) {
    throw new Error("RequestList components must be used within RequestListProvider");
  }
  return context;
}

function RequestListLayout() {
  return (
    <div className="pb-4 w-full max-w-container mx-auto ">
      <RequestListFilters />
      <RequestListGroups />
    </div>
  );
}

function RequestListProvider({
  children,
  requests,
  onRequestClick,
  isPublic = true,
  onRequestStatusChange,
}: RequestListProviderProps) {
  const { types, statuses } = useDefaultContext();
  const { filters, sort } = useFilterContext();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [draggedRequestId, setDraggedRequestId] = useState<string | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggable = !isPublic && !!onRequestStatusChange;

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
    if (!isDraggable || !onRequestStatusChange) return;
    event.preventDefault();

    if (draggedRequestId) {
      await onRequestStatusChange(draggedRequestId, statusId);
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

function RequestListFilters() {
  const {
    typeFilter,
    setTypeFilter,
    typeFilterLabel,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
    types,
  } = useRequestListContext();

  const {
    listView,
    setListView,
  } = useDefaultContext();

  return (
    <div className="px-(--margin) mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">

        <div className="hidden">
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
                {type.name.replace(/_/g, " ")}
              </Option>
            ))}
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
            className="w-full sm:w-[180px]"
            placeholder="Sort by"
            displayValue={(() => {
              const sortLabels = {
                createdAt: "Created Date",
                dueDate: "Due Date", 
                title: "Title",
                type: "Type",
                status: "Status",
                items: "Items Count"
              };
              return sortLabels[sortField as keyof typeof sortLabels];
            })()}
          >
            <Option value="createdAt">Created Date</Option>
            <Option value="dueDate">Due Date</Option>
            <Option value="title">Title</Option>
            <Option value="type">Type</Option>
            <Option value="status">Status</Option>
            <Option value="items">Items Count</Option>
          </Select>

          <IconButton
            variant="secondary"
            size="md"
            onClick={toggleSortDirection}
            className="shrink-0"
          >
            {sortDirection === "asc" ? (
              <Icon.chevron_up size={16} />
            ) : (
              <Icon.chevron_down size={16} />
            )}
          </IconButton>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[200px] max-md:max-w-full">
            <TabContextProvider defaultTab={listView}>
              <TabList className="max-md:w-full">
                <TabItem value="column" onClick={() => setListView("column")}>
                  <Icon.column className="mr-1" size={16} />Column
                </TabItem>
                <TabItem value="list" onClick={() => setListView("list")}>
                  <Icon.row className="mr-1" size={16} />List
                </TabItem>
              </TabList>
            </TabContextProvider>
          </div>
        </div>

      </div>

    </div>
  );
}


function RequestListGroups() {
  const { groupedRequests, typeFilter } = useRequestListContext();
  const { hasActiveFilters } = useFilterContext();

  const { listView } = useDefaultContext();

  return (
    <div className={cn("px-(--margin)", listView === "column" ? "flex gap-4 items-start overflow-y-auto *:min-w-[280px]" : "space-y-4")}>
      {groupedRequests.length > 0 ? (
        groupedRequests.map((group) => (
          <RequestListGroup className="flex-1" key={group.status.id} group={group} />
        ))
      ) : (
        <EmptyState
          title={hasActiveFilters || typeFilter !== "all" ? "No results found" : "No requests"}
          message={
            hasActiveFilters || typeFilter !== "all"
              ? "No requests found matching your filters. Try adjusting your search or filters."
              : "There are no requests to display at this time."
          }
          className="my-8"
        />
      )}
    </div>
  );
}

function RequestListGroup({ group, className }: { group: RequestGroup, className?: string }) {
  const {
    isDraggable,
    dragOverStatusId,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  } = useRequestListContext();

  const isActive = isDraggable && dragOverStatusId === group.status.id;

  return (
    <div
      className={cn(
        "bg-secondary rounded-lg transition-outline",
        isActive && "ring-2 ring-blue-500 ring-offset-2",
        className,
      )}
      onDragOver={(event) => handleDragOver(event, group.status.id)}
      onDrop={(event) => handleDrop(event, group.status.id)}
      onDragLeave={handleDragLeave}
    >
      <RequestListGroupHeader group={group} />
      <RequestListGroupBody group={group} />
    </div>
  );
}

function Indicator({ color }: IndicatorProps) {
  const colors: Record<IndicatorColor, string> = {
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <span className="w-3.5 h-3.5 rounded-full p-0.5 bg-primary flex items-center justify-center">
      <div className={cn("h-2 w-2 rounded-full", colors[color])} />
    </span>
  );
}

function RequestListGroupHeader({ group }: { group: RequestGroup }) {
  const statusColors: Record<number, string> = {
    0: "text-gray-600",
    1: "text-blue-600",
    2: "text-yellow-600",
    3: "text-green-600",
    4: "text-red-600",
  };

  const statusDotColors: Record<number, IndicatorColor> = {
    0: "gray",
    1: "blue",
    2: "yellow",
    3: "green",
    4: "red",
  };

  const dotColor = statusDotColors[group.status.value] || "gray";
  const textColor = statusColors[group.status.value] || "text-gray-600";

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Indicator color={dotColor} />
      <Text style="label-sm" className={cn("text-sm capitalize", textColor)}>
        {group.status.name.replace(/_/g, " ")}
      </Text>
      <Text style="paragraph-xs" className="text-gray-500">
        {group.requests.length} request{group.requests.length !== 1 ? "s" : ""}
      </Text>
    </div>
  );
}

function RequestListGroupBody({ group }: { group: RequestGroup }) {
  const { isDraggable, dragOverStatusId, isDragging } = useRequestListContext();

  return (
    <div className={cn("space-y-2 px-2 pb-2", isDraggable && "min-h-[60px]")}>
      {group.requests.length > 0 ? (
        group.requests.map((request) => (
          <DraggableRequestListItem key={request.id} request={request} />
        ))
      ) : (
        <EmptyState
          title="No requests"
          message={`No requests in ${group.status.name.replace(/_/g, " ").toLowerCase()} status`}
          className="my-2"
        />
      )}
      {isDragging && dragOverStatusId === group.status.id && (
        <div className="h-1 bg-blue-500 rounded-full animate-pulse mt-2" />
      )}
    </div>
  );
}

function DraggableRequestListItem({ request }: { request: FetchRequest }) {
  const {
    isDraggable,
    draggedRequestId,
    handleDragStart,
    handleDragEnd,
    onRequestClick,
    isPublic,
  } = useRequestListContext();
  const [isDragStarted, setIsDragStarted] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);
  const requestClickHandler = isPublic ? undefined : onRequestClick;
  const isDragging = draggedRequestId === request.id;

  const handleMouseDown = () => {
    if (!isDraggable) return;
    setMouseDownTime(Date.now());
    setIsDragStarted(false);
  };

  const handleMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDraggable || !mouseDownTime) return;

    const timeDiff = Date.now() - mouseDownTime;
    if (timeDiff < 200 && !isDragStarted && requestClickHandler) {
      event.preventDefault();
      event.stopPropagation();
      requestClickHandler(request);
    }

    setMouseDownTime(null);
    setIsDragStarted(false);
  };

  const handleLocalDragStart = (event: DragEvent<HTMLDivElement>) => {
    if (!isDraggable) return;
    setIsDragStarted(true);
    handleDragStart(event, request.id);
  };

  const handleLocalDragEnd = () => {
    setIsDragStarted(false);
    handleDragEnd();
  };

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isDraggable) {
      event.preventDefault();
      return;
    }

    if (requestClickHandler) {
      requestClickHandler(request);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleLocalDragStart}
      onDragEnd={handleLocalDragEnd}
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
        onRequestClick={undefined}
        isPublicView={isPublic}
      />
    </div>
  );
}

export function RequestList(props: RequestListProps) {
  return (
    <FilterProvider>
      <RequestListProvider {...props}>
        <RequestListLayout />
      </RequestListProvider>
    </FilterProvider>
  );
}
