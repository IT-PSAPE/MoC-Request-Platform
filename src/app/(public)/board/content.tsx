'use client';

import { Text } from "@/components/ui/common";
import { Header } from "@/components/ui/layout/header";
import { RequestList } from "@/components/ui/block/request-list/request-list";
import { usePublicRequestContext } from "@/feature/requests/components/public-request-context";


export function BoardRequestsContent() {
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