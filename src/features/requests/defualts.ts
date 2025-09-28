import { RequestPriority, RequestStatus } from "@/types/request";

export const priorities: { value: RequestPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export const columns: { key: RequestStatus; title: string }[] = [
  { key: "not_started", title: "Not Started" },
  { key: "pending", title: "Pending" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
  { key: "dropped", title: "Dropped" },
];

export const statusColor: Record<RequestStatus, "gray" | "blue" | "yellow" | "green" | "red"> = {
    not_started: "gray",
    pending: "blue",
    in_progress: "yellow",
    completed: "green",
    dropped: "red",
};