import { RequestStatus } from "@/types/request";

export const statusColor: Record<RequestStatus, "gray" | "blue" | "yellow" | "green" | "red"> = {
    not_started: "gray",
    pending: "blue",
    in_progress: "yellow",
    completed: "green",
    dropped: "red",
};