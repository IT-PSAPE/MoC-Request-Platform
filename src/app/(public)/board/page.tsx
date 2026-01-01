import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/common";
import { PublicRequestContextProvider } from "@/feature/requests/components/public-request-context";
import { BoardRequestsContent } from "./content";

export const metadata: Metadata = {
  title: "Request Board | MOC Request Platform",
  description: "Review submitted requests in a Kanban board to monitor ownership and progress.",
};

export default function RequestsPage() {
  return (
    <PublicRequestContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <BoardRequestsContent />
      </Suspense>
    </PublicRequestContextProvider>
  );
}
