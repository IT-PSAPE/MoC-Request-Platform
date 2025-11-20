import type { Metadata } from "next";
import BoardPageClient from "./board-page-client";

export const metadata: Metadata = {
  title: "Request Board | MOC Request Platform",
  description: "Review submitted requests in a Kanban board to monitor ownership and progress.",
};

export default function RequestsPage() {
  return <BoardPageClient />;
}