"use client";

import { Suspense } from "react";
import Loader from "@/components/ui/common/loader";
import Header from "@/components/ui/common/header";
import Text from "@/components/ui/common/text";
import { RequestList } from "@/components/ui/common/request-list/request-list";
import { BoardContextProvider, useBoardContext } from "@/components/contexts/board-context";

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
