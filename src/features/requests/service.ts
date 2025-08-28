import { RequestStore } from "@/lib/store";
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
    return RequestStore.updateStatus(id, status);
  },
  addNote(id: string, message: string) {
    const r = RequestStore.get(id);
    if (!r) return;
    const note: InternalNote = { id: crypto.randomUUID(), message, createdAt: new Date().toISOString() };
    RequestStore.update(id, { notes: [...r.notes, note] });
  },
  updateEquipmentChecklist(id: string, next: NonNullable<RequestItem["equipmentChecklist"]>) {
    RequestStore.update(id, { equipmentChecklist: next });
  },
  updateSongChecklist(id: string, next: NonNullable<RequestItem["songChecklist"]>) {
    RequestStore.update(id, { songChecklist: next });
  },
};
