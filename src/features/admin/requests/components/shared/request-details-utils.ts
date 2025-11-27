// Types are globally available from lib/type.ts and types/system-types.ts

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
}

export interface RequestDetailsCommentsProps extends RequestDetailsBaseProps {
  onAddComment?: (requestId: string, comment: string) => Promise<void>;
}

export interface RequestDetailsDeleteProps extends RequestDetailsBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest?: (requestId: string) => Promise<void>;
}
