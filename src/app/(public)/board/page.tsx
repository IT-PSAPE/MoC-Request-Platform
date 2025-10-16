"use client";

import { BoardContextProvider } from "./board-provider";
import RequestsContent from "./components/kanban-board";

export default function RequestsPage() {
  return (
    <BoardContextProvider>
      <RequestsContent />
    </BoardContextProvider>
  );
}