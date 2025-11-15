import { useState, useMemo } from "react";
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
  isPublicView?: boolean;
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

export function RequestList({ requests, onRequestClick, isPublicView = false }: RequestListProps) {
  const { types } = useDefaultContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get unique statuses from requests and sort by value
  const uniqueStatuses = useMemo(() => {
    const statusMap = new Map<string, { name: string; value: number }>();
    requests.forEach(request => {
      if (request.status) {
        statusMap.set(String(request.status.id), {
          name: request.status.name,
          value: request.status.value
        });
      }
    });
    return Array.from(statusMap.entries())
      .map(([id, data]) => ({ id, name: data.name, value: data.value }))
      .sort((a, b) => a.value - b.value);
  }, [requests]);


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

    // Initialize groups with all statuses
    uniqueStatuses.forEach(status => {
      const statusObj = requests.find(r => String(r.status?.id) === status.id)?.status;
      if (statusObj) {
        groups.set(status.id, { status: statusObj, requests: [] });
      }
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
  }, [filteredAndSortedRequests, uniqueStatuses, requests]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
            <div key={group.status.id} className="bg-secondary rounded-lg">
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
              <div className="space-y-2 px-2 pb-2">
                {group.requests.length > 0 ? (
                  group.requests.map((request) => (
                    <RequestListItem
                      key={request.id}
                      request={request}
                      onRequestClick={isPublicView ? undefined : onRequestClick}
                      isPublicView={isPublicView}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No requests"
                    message={`No requests in ${group.status.name.replace(/_/g, ' ').toLowerCase()} status`}
                    className="my-2"
                  />
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