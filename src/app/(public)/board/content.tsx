'use client';

import { Text } from "@/components/ui/common";
import { Header } from "@/components/ui/layout/header";
import { useRequestContext } from "@/feature/requests/components/request-context";
import { PublicRequestList } from "@/feature/requests/components/public-request-list";


export function BoardRequestsContent() {
  const { requests } = useRequestContext();

  return (
    <div className="space-y-6 w-full max-w-[1280px] mx-auto">
      <Header>
        <Text style="title-h4">Requests</Text>
        <Text style="paragraph-md">Track each request as it moves from intake through completion.</Text>
      </Header>
      <PublicRequestList isPublic requests={requests} onRequestClick={undefined} />
    </div>
  );
}