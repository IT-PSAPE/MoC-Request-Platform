"use client";

import { BoardContextProvider } from "@/contexts/board-context";
import RequestsContent from "./components/kanban-board";

export default function RequestsPage() {
  return (
    <BoardContextProvider>
      <RequestsContent />
    </BoardContextProvider>
  );
}