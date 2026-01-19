// Types are globally available from lib/type.ts and types/system-types.ts

import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const requestColorMap: Record<string, BadgeColor> = {
  "Video Filming & Production": "teal",
  "Video Editing": "yellow",
  "Design Flyer": "pink",
  "Video Filming": "green",
  "Equipment": "orange",
  "Event": "blue",
  "Design Special": "purple",
};

export const priorityColorMap: Record<string, BadgeColor> = {
  "Low": "blue",
  "Medium": "yellow",
  "High": "orange",
  "Urgent": "red",
};

export const statusColorMap: Record<string, BadgeColor> = {
  "Not Started": "gray",
  "In Progress": "orange",
  "Completed": "green",
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not specified";
  try {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return "Invalid date";
  }
};

export const formatPriority = (priority: Priority) => {
  return priority?.name?.replace(/_/g, " ") || "Not specified";
};

export const formatRequestType = (type: RequestType) => {
  return type?.name?.replace(/_/g, " ") || "Not specified";
};

export interface RequestDetailsBaseProps {
  request: FetchRequest;
}

export interface RequestDetailsEditableProps extends RequestDetailsBaseProps {
  onUpdateStatus?: (requestId: string, statusId: string) => Promise<void>;
  onUpdatePriority?: (requestId: string, priorityId: string) => Promise<void>;
  onUpdateType?: (requestId: string, typeId: string) => Promise<void>;
  onUpdateDueDate?: (requestId: string, dueDate: string) => Promise<void>;
  onAssignMember?: (requestId: string, memberId: string) => Promise<void>;
  onUnassignMember?: (requestId: string, memberId: string) => Promise<void>;
}

export interface RequestDetailsCommentsProps extends RequestDetailsBaseProps {
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
}

export interface RequestDetailsDeleteProps extends RequestDetailsBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest?: (requestId: string) => Promise<void>;
}

type RequestFetchData = { id: any; who: any; what: any; when: any; where: any; why: any; how: any; info: any; due: any; flow: any; created_at: any; priority: any[]; status: any[]; type: any[]; attachment: any[]; note: any[]; song: any[]; venue: any[]; item: any[]; assignee: any[]; }[]

export function jsonToFetchRequest({ data }: { data: { id: any; who: any; what: any; when: any; where: any; why: any; how: any; info: any; due: any; flow: any; created_at: any; priority: any[]; status: any[]; type: any[]; attachment: any[]; note: any[]; song: any[]; venue: any[]; item: any[]; assignee: any[]; }[] }) {
  return data.map((request) => ({
    id: request.id as string,
    who: request.who as string,
    what: request.what as string,
    when: request.when as string,
    where: request.where as string,
    why: request.why as string,
    how: request.how as string,
    info: request.info as string,
    due: request.due as string,
    flow: request.flow as string[],
    created_at: request.created_at as string,
    priority: request.priority as unknown as Priority,
    status: request.status as unknown as Status,
    type: request.type as unknown as RequestType,
    attachment: request.attachment as Attachment[],
    note: request.note as Note[],
    song: request.song,
    venue: request.venue,
    item: request.item,
    assignee: request.assignee as Assignee[],
  }));
}