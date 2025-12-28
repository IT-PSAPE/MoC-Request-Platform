import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader, Text } from "@/components/ui/common";
import { Header } from "@/components/ui/layout/header";
import { RequestList } from "@/components/ui/block/request-list/request-list";
import { PublicRequestContextProvider, usePublicRequestContext } from "@/feature/requests/components/public-request-context";

export const metadata: Metadata = {
  title: "Request Board | MOC Request Platform",
  description: "Review submitted requests in a Kanban board to monitor ownership and progress.",
};

function BoardRequestsContent() {
  const { requests } = usePublicRequestContext();

  return (
    <div className="space-y-6 w-full max-w-[1280px] mx-auto">
      <Header>
        <Text style="title-h4">Requests</Text>
        <Text style="paragraph-md">Track each request as it moves from intake through completion.</Text>
      </Header>
      <RequestList isPublic requests={requests} onRequestClick={undefined} />
    </div>
  );
}

export default function RequestsPage() {
  return (
    <PublicRequestContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <BoardRequestsContent />
      </Suspense>
    </PublicRequestContextProvider>
  );
}
