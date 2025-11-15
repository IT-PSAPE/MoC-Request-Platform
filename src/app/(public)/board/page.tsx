"use client";

import { BoardContextProvider } from "@/contexts/board-context";
import { Suspense } from "react";
import RequestsListView from "./components/list-view";
import Loader from "@/components/common/loader";

export default function RequestsPage() {
  return (
    <BoardContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <RequestsListView />
      </Suspense>
    </BoardContextProvider>
  );
}