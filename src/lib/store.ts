import { RequestItem, RequestStatus } from "@/types/request";

const STORAGE_KEY = "moc_requests_v1";

function load(): RequestItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as any[]) : [];
    // Migration: map legacy 'paused' status to 'pending'
    const migrated: RequestItem[] = parsed.map((r) =>
      ({
        ...r,
        status: r.status === "paused" ? ("pending" as RequestStatus) : (r.status as RequestStatus),
      })
    );
    return migrated;
  } catch {
    return [];
  }
}

function save(items: RequestItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const RequestStore = {
  list(): RequestItem[] {
    return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  get(id: string): RequestItem | undefined {
    return load().find((r) => r.id === id);
  },
  create(input: Omit<RequestItem, "id" | "createdAt" | "updatedAt">): RequestItem {
    const items = load();
    const now = new Date().toISOString();
    const item: RequestItem = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    items.push(item);
    save(items);
    return item;
  },
  update(id: string, patch: Partial<RequestItem>): RequestItem | undefined {
    const items = load();
    const idx = items.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
    save(items);
    return items[idx];
  },
  updateStatus(id: string, status: RequestStatus) {
    return this.update(id, { status });
  },
  remove(id: string) {
    const items = load().filter((r) => r.id !== id);
    save(items);
  },
};
