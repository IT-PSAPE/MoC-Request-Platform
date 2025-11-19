"use client";

import { Suspense } from "react";
import Loader from "@/components/common/loader";
import { BoardContextProvider } from "@/contexts/board-context";
import RequestsListView from "./list-view";

export default function RequestsPageClient() {
  return (
    <BoardContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <RequestsListView />
      </Suspense>
    </BoardContextProvider>
  );
}
