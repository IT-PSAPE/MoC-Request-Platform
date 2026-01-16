'use client';

import { useState } from "react";
import type { DragEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { RequestListItem } from "@/components/ui/block/request-list/request-list-item";
import { EmptyState } from "@/components/ui";
import { useDefaultContext } from "@/components/contexts/defaults-context";
import { cn } from "@/shared/cn";
import { Icon, Text } from "@/components/ui/common";
import { TabContextProvider, TabItem, TabList } from "@/components/ui/common/tabs";
import { useFilterContext } from "./request-filter-provider";
import { FilterPopover } from "./request-filter-popover";
import { SortPopover } from "./request-sort-popover";
import { RequestListProvider, useRequestListContext } from "./request-list-context";

type SortField = "title" | "type" | "status" | "dueDate" | "createdAt" | "items";
type SortDirection = "asc" | "desc";
type RequestGroup = { status: Status; requests: FetchRequest[] };

export interface RequestListProps {
  requests: FetchRequest[];
  onRequestClick?: (request: FetchRequest) => void;
  isPublic?: boolean;
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

function ListGroupHeader({ group }: { group: RequestGroup }) {
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

function ListGroupBody({ group }: { group: RequestGroup }) {
  const { isDraggable, dragOverStatusId, isDragging } = useRequestListContext();

  return (
    <div className={cn("space-y-2 px-2 pb-2", isDraggable && "min-h-[60px]")}>
      {group.requests.length > 0 ? (
        group.requests.map((request) => (
          <DraggableRequestListItem key={request.id} request={request} />
        ))
      ) : (
        <EmptyState
          icon={<Icon.folder_search size={24} className="text-quaternary mx-auto" />}
          title="No requests"
          message={`No requests in ${group.status.name.replace(/_/g, " ").toLowerCase()} status`}
          className="text-center"
        />
      )}
      {isDragging && dragOverStatusId === group.status.id && (
        <div className="h-1 bg-blue-500 rounded-full animate-pulse mt-2" />
      )}
    </div>
  );
}

function ListGroup({ group, className }: { group: RequestGroup, className?: string }) {
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
      <ListGroupHeader group={group} />
      <ListGroupBody group={group} />
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

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-4 w-full max-w-container mx-auto ">{children}</div>
  );
}

function Controls({ children }: { children: ReactNode }) {
  return (
    <div className="px-(--margin) mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full flex mobile:flex-col items-center mobile:items-stretch gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function ViewTab() {
  const { listView, setListView } = useDefaultContext();

  return (
    <div className="flex-1 max-w-[200px] mobile:max-w-full">
      <TabContextProvider defaultTab={listView}>
        <TabList className="mobile:w-full">
          <TabItem value="column" onClick={() => setListView("column")}>
            <Icon.column className="mr-1" size={16} />Column
          </TabItem>
          <TabItem value="list" onClick={() => setListView("list")}>
            <Icon.row className="mr-1" size={16} />List
          </TabItem>
        </TabList>
      </TabContextProvider>
    </div>
  )
}

function Filters() {
  return (
    <div className="ml-auto mobile:ml-0 flex items-center mobile:justify-stretch gap-2">
      <SortPopover />
      <FilterPopover />
    </div>
  )
}

function List() {
  const { groupedRequests, typeFilter } = useRequestListContext();
  const { hasActiveFilters } = useFilterContext();

  const { listView } = useDefaultContext();

  return (
    <div className={cn("px-(--margin)", listView === "column" ? "flex gap-4 items-start overflow-y-auto *:min-w-[280px]" : "space-y-4")}>
      {groupedRequests.length > 0 ? (
        groupedRequests.map((group) => (
          <ListGroup className="flex-1" key={group.status.id} group={group} />
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

export const RequestListA = {
  Provider: RequestListProvider,
  Layout: Layout,
  Controls: Controls,
  ViewTab: ViewTab,
  Filters: Filters,
  List: List,
};
