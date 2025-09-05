export type RequestStatus =
  | "not_started"
  | "pending"
  | "in_progress"
  | "completed"
  | "dropped";

export type RequestPriority = "low" | "medium" | "high" | "urgent";

export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number; // bytes
  dataUrl: string; // for demo/local only
};

// New enums and types to support multi-step form
export type RequestKind =
  | "event"
  | "video_editing"
  | "video_filming_editing"
  | "equipment"
  | "design_flyer"
  | "design_special";

export type EquipmentItem = {
  id: string;
  name: string;
  quantity?: number; // requested units (default 1 for legacy)
};

export type SongItem = {
  id: string;
  title: string;
  artist?: string;
};

export type EventFlowStep = {
  id: string;
  order: number;
  type: "segment" | "song";
  label: string;
  songId?: string; // when type is song, reference selected song
};

export type InternalNote = {
  id: string;
  author?: string;
  message: string;
  createdAt: string; // ISO
};

export type RequestItem = {
  id: string;
  who: string;
  what: string;
  when: string;
  where: string;
  why: string;
  how: string;
  additionalInfo?: string;
  priority: RequestPriority;
  attachments: Attachment[];
  status: RequestStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes: InternalNote[];
  // New optional fields for the multi-step flow
  kind?: RequestKind;
  dueAt?: string; // ISO string for due date/time
  selectedEquipment?: EquipmentItem[];
  selectedSongs?: SongItem[];
  eventFlow?: EventFlowStep[];
  // Admin-only tracking of handoff/checklist
  equipmentChecklist?: Record<string, boolean>; // key: EquipmentItem.id
  songChecklist?: Record<string, boolean>; // key: SongItem.id
};
