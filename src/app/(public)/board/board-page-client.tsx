"use client";

import { Suspense } from "react";
import Loader from "@/components/common/loader";
import Header from "@/components/common/header";
import Text from "@/components/common/text";
import { RequestList } from "@/components/common/request-list/request-list";
import { BoardContextProvider, useBoardContext } from "@/contexts/board-context";

function BoardRequestsContent() {
  const { requests } = useBoardContext();

  return (
    <div className="space-y-6 w-full max-w-[1280px] mx-auto">
      <Header>
        <Text style="title-h4">Requests</Text>
        <Text style="paragraph-md">Track each request as it moves from intake through completion.</Text>
      </Header>
      <RequestList
        requests={requests}
        onRequestClick={undefined}
        isPublic
      />
    </div>
  );
}

export default function BoardPageClient() {
  return (
    <BoardContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <BoardRequestsContent />
      </Suspense>
    </BoardContextProvider>
  );
}
