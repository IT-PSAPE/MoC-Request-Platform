// Equipment now comes from localStorage-backed store.
// Call this at render time in client components to get current availability.
import { EquipmentStore } from "@/lib/equipmentStore";

export function getEquipmentCatalog() {
  // Reading should not mutate storage; EquipmentStore.list() is read-only.
  // Map to UI shape with computed availability and quantity left.
  return EquipmentStore.list().map((e) => ({ id: e.id, name: e.name, available: e.quantity > 0, quantity: e.quantity }));
}

export const songsCatalog = [
  { id: "s1", title: "Song Alpha", artist: "Band X", available: true },
  { id: "s2", title: "Song Beta", artist: "Band Y", available: true },
  { id: "s3", title: "Song Gamma", artist: "Band Z", available: false },
] as const;
