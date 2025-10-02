"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminController } from "@/features/admin/useAdminController";

import KanbanBoard from "./components/kanban-board";
import EquipmentCatalogPanel from "./components/equipment-catalog-panel";
import DetailsSheet from "./components/details-sheet";
import Sidebar from "./components/sidebar";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function AdminPage() {
  const { authed, user, initialized } = useAuthContext();
  const controller = useAdminController();

  const router = useRouter();

  // Sidebar tab state
  const [tab, setTab] = useState<"requests" | "equipment">("requests");

  useEffect(() => {
    if (initialized && !authed) {
      // redirect to dedicated login page, preserving return location
      router.push(`/login?next=${encodeURIComponent("/admin")}`);
    }
  }, [authed, initialized, router]);

  if (!initialized) {
    return <div className="py-8">Loading...</div>;
  }

  if (!authed || !user) {
    return <div className="py-8">Redirecting...</div>;
  }

  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  // FINAL RENDER
  // ──────────────────────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="py-8 flex flex-1 min-h-0">
      {/* Sidebar */}
      <Sidebar tab={tab} setTab={setTab} />

      {/* Main content */}
      <section className="flex-1 flex flex-col min-w-0">
        {tab === "requests" ? (
          <>
            <div className="w-full px-4 text-2xl font-semibold mb-4">Requests</div>
            <KanbanBoard
              grouped={controller.grouped}
              updateStatus={controller.updateStatus}
              setActive={controller.setActive}
            />
          </>
        ) : (
          <>
            <div className="w-full px-4 text-2xl font-semibold mb-4">Equipment Catalog</div>
            <EquipmentCatalogPanel
              items={controller.items}
              setActive={controller.setActive}
            />
          </>
        )}

        {/* Details sheet stays available for both tabs */}
        <DetailsSheet
          active={controller.active}
          setActive={controller.setActive}
          updateStatus={controller.updateStatus}
          refreshActive={controller.refreshActive}
          setEquipmentChecked={controller.setEquipmentChecked}
          setSongChecked={controller.setSongChecked}
          addNote={controller.addNote}
        />
      </section>
    </div>
  );

}
