"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminController } from "@/features/admin/useAdminController";

import KanbanBoard from "./components/kanban-board";
import EquipmentCatalogPanel from "./components/equipment-catalog-panel";
import DetailsSheet from "./components/details-sheet";
import Sidebar from "./components/siebar";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function AdminPage() {
  const { authed, user, initialized } = useAuthContext();
  const controloler = useAdminController();

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
              items={controloler.items}
              updateStatus={controloler.updateStatus}
              setActive={controloler.setActive}
            />
          </>
        ) : (
          <>
            <div className="w-full px-4 text-2xl font-semibold mb-4">Equipment Catalog</div>
            <EquipmentCatalogPanel
              items={controloler.items}
              setActive={controloler.setActive}
            />
          </>
        )}

        {/* Details sheet stays available for both tabs */}
        <DetailsSheet
          active={controloler.active}
          setActive={controloler.setActive}
          updateStatus={controloler.updateStatus}
          refreshActive={controloler.refreshActive}
          setEquipmentChecked={controloler.setEquipmentChecked}
          setSongChecked={controloler.setSongChecked}
          addNote={controloler.addNote}
        />
      </section>
    </div>
  );

}
