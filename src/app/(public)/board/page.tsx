import type { Metadata } from "next";
import RequestsPageClient from "./components/requests-page-client";

export const metadata: Metadata = {
  title: "Request Board | MOC Request Platform",
  description: "Review Ministry of Culture requests in a Kanban board, filter updates, and follow each submission's progress.",
};

export default function RequestsPage() {
  return <RequestsPageClient />;
}
