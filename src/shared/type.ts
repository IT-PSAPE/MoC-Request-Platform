/* eslint-disable @typescript-eslint/no-unused-vars */
// Global domain types derived from the Supabase schema. These stay in the
// global type space (no exports) so that existing files that referenced them
// without explicit imports continue to type-check.

type Priority = {
    id: string;
    name: string;
    value: number;
};

type Status = {
    id: string;
    name: string;
    value: number;
};

type RequestType = {
    id: string;
    name: string;
    notice: number;
    warning: string;
};

type RequestItem = {
    id: string;
    name: string;
    description: string;
    available: boolean;
    archived: boolean;
};

type Equipment = {
    id: string;
    name: string;
    quantity: number;
    available: number;
    description: string;
    archived: boolean;
};

type Song = {
    id: string;
    name: string;
    instrumental: boolean;
    lyrics: boolean;
    archived: boolean;
};

type Venue = {
    id: string;
    name: string;
    available: boolean;
    description: string;
    archived: boolean;
};

type Attachment = {
    id: string;
    request_id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    created: string;
};

type Note = {
    id: string;
    author: string;
    request: string;
    note: string;
    created: string;
};

// JOIN TABLES

type ItemEquipment = {
    id: string;
    item_id: string;
    equipment_id: string;
    quantity: number;
    created_at: string;
};

type ItemEquipmentWithEquipment = ItemEquipment & {
    equipment: Equipment;
};

type RequestItemWithEquipment = RequestItem & {
    equipment: ItemEquipmentWithEquipment[];
};

type RequestedItem = {
    request_id: string;
    item_id: string;
    item: RequestItem;
};

type RequestedSong = {
    request_id: string;
    song_id: string;
    song: Song;
};

type RequestedVenue = {
    request_id: string;
    venue_id: string;
    venue: Venue;
};

type Member = {
    id: string;
    name: string;
};

type Assignee = {
    request_id: string;
    member_id: string;
    assigned_at: string;
    member: Member;
};

// Request

type BaseRequest = {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string | null;
    flow: string[];
    priority: string;
    status: string;
    type: string;
    archived: boolean;
}

type FormRequest = {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string;
    flow: string[];
    priority: string;
    status: string;
    type: string;
    equipments: { id: string; quantity: number }[];
    attachments: {
        id: string;
        request: string;
        name: string;
        type: string;
        size: number;
        storage: string;
        created: string;
    }[];
    songs: { id: string }[];
    venues: { id: string }[];
    items: { id: string }[];
};

type FetchRequest = {
    id: string;
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    info: string | null;
    due: string | null;
    flow: string[];
    created_at: string;
    priority: Priority;
    status: Status;
    type: RequestType;
    attachment: Attachment[];
    note: Note[];
    item: RequestedItem[];
    song: RequestedSong[];
    venue: RequestedVenue[];
    assignee: Assignee[];
    archived: boolean;
};

// INPUT TYPES FOR CRUD OPERATIONS

type CreateRequestItemInput = {
    name: string;
    description: string;
    available?: boolean;
    equipment?: { equipment_id: string; quantity: number }[];
};

type UpdateRequestItemInput = Partial<{
    name: string;
    description: string;
    available: boolean;
    archived: boolean;
}>;

type CreateEquipmentInput = {
    name: string;
    description: string;
    quantity: number;
    available?: number;
};

type UpdateEquipmentInput = Partial<{
    name: string;
    description: string;
    quantity: number;
    available: number;
    archived: boolean;
}>;

type UpdateSongInput = Partial<{
    name: string;
    instrumental: boolean;
    lyrics: boolean;
    archived: boolean;
}>;

type UpdateVenueInput = Partial<{
    name: string;
    description: string;
    available: boolean;
    archived: boolean;
}>;