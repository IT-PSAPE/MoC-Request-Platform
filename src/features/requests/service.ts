import { getRandomUUID } from "@/lib/randomuuid";
import { RequestStore } from "@/lib/store";
import { EquipmentStore } from "@/lib/equipmentStore";
import { RequestItem, RequestStatus, InternalNote } from "@/types/request";

export const RequestService = {
  list(): RequestItem[] {
    return RequestStore.list();
  },
  get(id: string): RequestItem | undefined {
    return RequestStore.get(id);
  },
  create(input: Omit<RequestItem, "id" | "createdAt" | "updatedAt">): RequestItem {
    return RequestStore.create(input);
  },
  updateStatus(id: string, status: RequestStatus) {
    const current = RequestStore.get(id);
    // Guard: nothing to do if not found
    if (!current) return;

    // Clone checklist to mutate idempotently
    const checklist = { ...(current.equipmentChecklist || {}) } as NonNullable<RequestItem["equipmentChecklist"]>;

    if (status === "completed") {
      // Return all borrowed items for this request
      const selected = (current.selectedEquipment || []);
      Object.entries(checklist).forEach(([eqId, isBorrowed]) => {
        if (isBorrowed) {
          const item = selected.find((e) => e.id === eqId);
          const qty = item && typeof item.quantity === "number" ? Math.max(1, Math.floor(item.quantity)) : 1;
          EquipmentStore.adjustQuantity(eqId, +qty);
          checklist[eqId] = false;
        }
      });
      RequestStore.update(id, { equipmentChecklist: checklist });
    } else if (status === "pending" || status === "in_progress") {
      // Ensure selected equipment are reserved (borrowed)
      const selected = (current.selectedEquipment || []);
      if (selected.length) {
        selected.forEach((sel) => {
          const eqId = sel.id;
          const qty = sel && typeof sel.quantity === "number" ? Math.max(1, Math.floor(sel.quantity)) : 1;
          if (!checklist[eqId]) {
            checklist[eqId] = true;
            EquipmentStore.adjustQuantity(eqId, -qty);
          }
        });
        RequestStore.update(id, { equipmentChecklist: checklist });
      }
    }

    return RequestStore.updateStatus(id, status);
  },
  addNote(id: string, message: string) {
    const r = RequestStore.get(id);
    if (!r) return;
    const note: InternalNote = { id: getRandomUUID(), message, createdAt: new Date().toISOString() };
    RequestStore.update(id, { notes: [...r.notes, note] });
  },
  updateEquipmentChecklist(id: string, next: NonNullable<RequestItem["equipmentChecklist"]>) {
    RequestStore.update(id, { equipmentChecklist: next });
  },
  updateSongChecklist(id: string, next: NonNullable<RequestItem["songChecklist"]>) {
    RequestStore.update(id, { songChecklist: next });
  },
};
