import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui/common";
import { BoardRequestsContent } from "./content";
import { RequestContextProvider } from "@/feature/requests/components/request-context";

export const metadata: Metadata = {
  title: "Request Board | MOC Request Platform",
  description: "Review submitted requests in a Kanban board to monitor ownership and progress.",
};

export default function RequestsPage() {
  return (
    <RequestContextProvider>
      <Suspense fallback={<Loader label="Loading requests" />}>
        <BoardRequestsContent />
      </Suspense>
    </RequestContextProvider>
  );
}
