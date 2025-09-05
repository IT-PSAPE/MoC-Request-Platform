import { CONFIG } from "@/config";

export type EquipmentRecord = {
  id: string;
  name: string;
  quantity: number; // available units
};

// Seed list for initial population and merging of new items
const EQUIPMENT_SEED: EquipmentRecord[] = [
  { id: "eq_wireless_mic", name: "Wireless Mic", quantity: 2 },
  { id: "eq_wired_mic", name: "Wired Mic", quantity: 5 },
  { id: "eq_video_camera", name: "Video Camera", quantity: 1 },
  { id: "eq_photo_camera", name: "Photo Camera", quantity: 2 },
  { id: "eq_active_speaker", name: "Active Speaker", quantity: 1 },
  { id: "eq_speaker", name: "Speaker", quantity: 2 },
  { id: "eq_mixer", name: "Mixer", quantity: 2 },
  { id: "eq_power_extension_cord", name: "Power Extension Cord", quantity: 2 },
  { id: "eq_projector", name: "Projector", quantity: 1 },
];

function safeLoad(): EquipmentRecord[] {
  if (typeof window === "undefined") return EQUIPMENT_SEED;
  try {
    const raw = localStorage.getItem(CONFIG.storage.equipment);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return EQUIPMENT_SEED;
    // Migration and sanity: support legacy {available:boolean}
    const cleaned: EquipmentRecord[] = parsed
      .map((x: any) => {
        const id = String(x.id);
        const name = String(x.name);
        let quantity: number;
        if (typeof x.quantity === "number" && !Number.isNaN(x.quantity)) quantity = x.quantity;
        else if (typeof x.available === "boolean") quantity = x.available ? 1 : 0;
        else quantity = 0;
        return { id, name, quantity: Math.max(0, Math.floor(quantity)) };
      })
      .filter((x) => !!x.id && !!x.name);
    return cleaned.length ? cleaned : EQUIPMENT_SEED;
  } catch {
    return EQUIPMENT_SEED;
  }
}

function save(items: EquipmentRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG.storage.equipment, JSON.stringify(items));
}

export const EquipmentStore = {
  // Ensures localStorage has equipment, and merges in new seed items if missing
  init() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(CONFIG.storage.equipment);
    if (raw === null) {
      // Not present at all — seed storage
      save(EQUIPMENT_SEED);
      return;
    }
    const existing = safeLoad();
    // Merge: add seed items not present by id
    const ids = new Set(existing.map((e) => e.id));
    const toAdd = EQUIPMENT_SEED.filter((e) => !ids.has(e.id));
    if (toAdd.length > 0) {
      save([...existing, ...toAdd]);
    }
  },

  list(): EquipmentRecord[] {
    return safeLoad();
  },

  get(id: string): EquipmentRecord | undefined {
    return safeLoad().find((e) => e.id === id);
  },

  setQuantity(id: string, quantity: number) {
    if (typeof window === "undefined") return;
    const q = Math.max(0, Math.floor(quantity));
    const items = safeLoad().map((e) => (e.id === id ? { ...e, quantity: q } : e));
    save(items);
  },

  adjustQuantity(id: string, delta: number) {
    if (typeof window === "undefined") return;
    const items = safeLoad().map((e) => (e.id === id ? { ...e, quantity: Math.max(0, e.quantity + Math.floor(delta)) } : e));
    save(items);
  },
};
